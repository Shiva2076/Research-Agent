from pydantic import BaseModel
from typing import Optional

class ResearchRequest(BaseModel):
    query: str
    user_id: Optional[str] = "anonymous"

class ExportRequest(BaseModel):
    session_id: str
    format: str  # "pdf" or "docx"
