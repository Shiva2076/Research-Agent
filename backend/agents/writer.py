from graph.state import ResearchState
from llm.groq_client import call_agent

WRITER_PROMPT = """You are the Writer agent in a LangGraph multi-agent research pipeline.

Research question: "{query}"

Top ranked sources:
{ranked_sources}

Full source details:
{sources}

Write a well-structured research report with these sections:

## Overview
(2-3 sentences summarising the topic)

## Key Findings
(4-5 bullet points of the most important discoveries)

## Analysis
(2-3 paragraphs of in-depth analysis with inline citations like [Source 1])

## Conclusion
(1 paragraph with key takeaways and implications)

Be informative, precise, and cite sources inline. Write in clear professional prose."""

async def writer_node(state: ResearchState) -> ResearchState:
    prompt = WRITER_PROMPT.format(
        query=state["query"],
        ranked_sources=state["ranked_sources"],
        sources=state["sources"]
    )
    result = await call_agent("writer", prompt)
    return {**state, "draft": result}
