from db.mongo import get_db
from datetime import datetime, timezone

async def create_session(session_id: str, query: str) -> dict:
    doc = {
        "session_id": session_id,
        "query": query,
        "status": "running",
        "created_at": datetime.now(timezone.utc),
        "completed_at": None,
        "agents": {},
        "sources": [],
        "final_report": None,
        "exports": {},
        "metadata": {"total_elapsed_ms": 0}
    }
    await get_db()["sessions"].insert_one(doc)
    return doc

async def update_agent(session_id: str, agent: str, output: str, elapsed_ms: int = 0):
    await get_db()["sessions"].update_one(
        {"session_id": session_id},
        {"$set": {
            f"agents.{agent}": {
                "output": output,
                "elapsed_ms": elapsed_ms,
                "completed_at": datetime.now(timezone.utc)
            }
        }}
    )

async def complete_session(session_id: str, final_report: str):
    await get_db()["sessions"].update_one(
        {"session_id": session_id},
        {"$set": {
            "status": "complete",
            "final_report": final_report,
            "completed_at": datetime.now(timezone.utc)
        }}
    )

async def fail_session(session_id: str, error: str):
    await get_db()["sessions"].update_one(
        {"session_id": session_id},
        {"$set": {"status": "failed", "error": error}}
    )

async def get_session(session_id: str) -> dict:
    return await get_db()["sessions"].find_one(
        {"session_id": session_id},
        {"_id": 0}
    )

async def get_history(limit: int = 20) -> list:
    cursor = get_db()["sessions"].find(
        {"status": "complete"},
        {"_id": 0, "session_id": 1, "query": 1, "created_at": 1, "metadata": 1}
    ).sort("created_at", -1).limit(limit)
    return await cursor.to_list(length=limit)
