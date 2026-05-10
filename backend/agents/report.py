from graph.state import ResearchState
from llm.groq_client import call_agent

REPORT_PROMPT = """You are the Report Assembly agent — the final node in the LangGraph pipeline.

Original question: "{query}"

Draft report:
{draft}

Fact-check review:
{factcheck_result}

Produce the FINAL polished report. Apply the fact-check suggestions where valid.
Structure it cleanly:

## Overview

## Key Findings

## Analysis

## Conclusion

## Sources
(list the sources cited)

Make it sharp, well-cited, and ready to export. This is the final deliverable."""

async def report_node(state: ResearchState) -> ResearchState:
    prompt = REPORT_PROMPT.format(
        query=state["query"],
        draft=state["draft"],
        factcheck_result=state["factcheck_result"]
    )
    result = await call_agent("report", prompt)
    return {**state, "final_report": result}
