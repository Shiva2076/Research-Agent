from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

_client: AsyncIOMotorClient = None
db = None

async def connect_mongo():
    global _client, db
    _client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = _client["research_agent"]

async def disconnect_mongo():
    if _client:
        _client.close()

def get_db():
    return db
