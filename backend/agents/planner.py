from graph.state import ResearchState
from llm.groq_client import call_agent

PLANNER_PROMPT = """You are the Planner agent in a LangGraph multi-agent research pipeline.

Research question: "{query}"

Your job:
1. Decompose this into 4-5 specific sub-questions or search goals
2. Identify key topics, entities, and time frames to investigate
3. Output a numbered plan — one sub-task per line
4. Be concise and specific — this plan guides the Searcher agent

Output ONLY the numbered plan. No preamble or explanation."""

async def planner_node(state: ResearchState) -> ResearchState:
    prompt = PLANNER_PROMPT.format(query=state["query"])
    result = await call_agent("planner", prompt)
    return {**state, "plan": result}
