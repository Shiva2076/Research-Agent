from db.mongo import get_db
from datetime import datetime, timezone

async def log_research_event(session_id: str, event: str, data: dict):
    await get_db()["events"].insert_one({
        "session_id": session_id,
        "event": event,
        "data": data,
        "timestamp": datetime.now(timezone.utc)
    })
