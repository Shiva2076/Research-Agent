from graph.state import ResearchState
from llm.groq_client import call_agent

RANKER_PROMPT = """You are the Ranker agent in a LangGraph multi-agent research pipeline.

Retrieved sources:
{sources}

Your job:
1. Score each source 1-10 for relevance, credibility, and recency
2. Select the TOP 4-5 sources to pass to the Writer
3. Output a ranked list in this format:

[RANK 1] <Title> — Score: X/10 — Reason: <one sentence>
[RANK 2] ...

Output ONLY the ranked list."""

async def ranker_node(state: ResearchState) -> ResearchState:
    prompt = RANKER_PROMPT.format(sources=state["sources"])
    result = await call_agent("ranker", prompt)
    return {**state, "ranked_sources": result}
