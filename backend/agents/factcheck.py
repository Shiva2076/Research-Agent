from graph.state import ResearchState
from llm.groq_client import call_agent

FACTCHECK_PROMPT = """You are the Fact-check agent in a LangGraph multi-agent research pipeline.

Draft report:
{draft}

Your job:
1. Review each major claim in the report
2. Flag any claims that seem unverified, overstated, or need qualification
3. Suggest specific improvements

Output in this exact format:

VERIFIED CLAIMS:
- <claim 1>
- <claim 2>
- <claim 3>

FLAGS:
- <concern> OR "None found"

SUGGESTED EDITS:
- <specific improvement 1>
- <specific improvement 2>"""

async def factcheck_node(state: ResearchState) -> ResearchState:
    prompt = FACTCHECK_PROMPT.format(draft=state["draft"])
    result = await call_agent("factcheck", prompt)
    return {**state, "factcheck_result": result}
