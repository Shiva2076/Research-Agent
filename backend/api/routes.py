from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from sse_starlette.sse import EventSourceResponse
from api.models import ResearchRequest, ExportRequest
from graph.pipeline import pipeline
from graph.state import ResearchState
from db.sessions import create_session, update_agent, complete_session, fail_session, get_session, get_history
from cache.valkey import cache_agent_output
from export.pdf_generator import generate_pdf
from export.docx_generator import generate_docx
from storage.minio_client import upload_file, get_presigned_url
import uuid
import json
import time

router = APIRouter()

@router.post("/api/research")
async def run_research(request: ResearchRequest):
    session_id = str(uuid.uuid4())
    query = request.query.strip()

    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    await create_session(session_id, query)

    async def event_stream():
        yield {
            "event": "session_start",
            "data": json.dumps({"session_id": session_id, "query": query})
        }

        try:
            state: ResearchState = {
                "session_id": session_id,
                "query": query,
                "plan": None,
                "sources": None,
                "ranked_sources": None,
                "draft": None,
                "factcheck_result": None,
                "final_report": None,
                "error": None,
            }

            output_keys = {
                "planner":   "plan",
                "searcher":  "sources",
                "ranker":    "ranked_sources",
                "writer":    "draft",
                "factcheck": "factcheck_result",
                "report":    "final_report",
            }

            async for event in pipeline.astream(state):
                for node_name, node_state in event.items():
                    agent = node_name
                    t0 = time.time()

                    yield {
                        "event": "agent_start",
                        "data": json.dumps({"agent": agent})
                    }

                    output_key = output_keys[agent]
                    output = node_state.get(output_key, "")
                    elapsed = int((time.time() - t0) * 1000)

                    state = {**state, **node_state}

                    await cache_agent_output(session_id, agent, output)
                    await update_agent(session_id, agent, output, elapsed)

                    yield {
                        "event": "agent_done",
                        "data": json.dumps({
                            "agent": agent,
                            "output": output,
                            "elapsed_ms": elapsed
                        })
                    }

            await complete_session(session_id, state.get("final_report", ""))

            yield {
                "event": "pipeline_complete",
                "data": json.dumps({
                    "session_id": session_id,
                    "final_report": state.get("final_report", "")
                })
            }

        except Exception as e:
            await fail_session(session_id, str(e))
            yield {
                "event": "error",
                "data": json.dumps({"error": str(e), "session_id": session_id})
            }

    return EventSourceResponse(event_stream())


@router.post("/api/export")
async def export_report(request: ExportRequest):
    session = await get_session(request.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if not session.get("final_report"):
        raise HTTPException(status_code=400, detail="Report not ready")

    fmt = request.format.lower()
    query = session["query"]
    report = session["final_report"]

    if fmt == "pdf":
        data = generate_pdf(query, report)
        content_type = "application/pdf"
        ext = "pdf"
    elif fmt == "docx":
        data = generate_docx(query, report)
        content_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ext = "docx"
    else:
        raise HTTPException(status_code=400, detail="Format must be pdf or docx")

    key = f"exports/{request.session_id}.{ext}"
    await upload_file(key, data, content_type)
    url = await get_presigned_url(key)

    return {"url": url, "format": fmt, "session_id": request.session_id}


@router.get("/api/sessions/{session_id}")
async def get_session_data(session_id: str):
    session = await get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@router.get("/api/history")
async def get_research_history(limit: int = 20):
    return await get_history(limit)


@router.get("/api/health")
async def health():
    return {"status": "ok", "service": "research-agent-backend"}
