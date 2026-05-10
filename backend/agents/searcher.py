from graph.state import ResearchState
from llm.groq_client import call_agent

SEARCHER_PROMPT = """You are the Searcher agent in a LangGraph multi-agent research pipeline.

Research question: "{query}"
Planner's task list:
{plan}

Your job: For each sub-task, generate 2 realistic source entries in this exact format:

[SOURCE N]
Title: <realistic article or paper title>
URL: <realistic URL>
Snippet: <2-3 sentence summary of what this source says>
Relevance: high/medium/low

Cover all sub-tasks. Output ONLY the sources in the format above."""

async def searcher_node(state: ResearchState) -> ResearchState:
    prompt = SEARCHER_PROMPT.format(
        query=state["query"],
        plan=state["plan"]
    )
    result = await call_agent("searcher", prompt)
    return {**state, "sources": result}
