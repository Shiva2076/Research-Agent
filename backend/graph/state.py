from typing import TypedDict, Optional

class ResearchState(TypedDict):
    session_id: str
    query: str
    plan: Optional[str]
    sources: Optional[str]
    ranked_sources: Optional[str]
    draft: Optional[str]
    factcheck_result: Optional[str]
    final_report: Optional[str]
    error: Optional[str]
