import redis.asyncio as redis
import json
from config import settings

_client = None

def get_client():
    global _client
    if not _client:
        # For Upstash/Production Redis, handle SSL if URL starts with rediss://
        is_ssl = settings.VALKEY_URL.startswith("rediss://")
        _client = redis.from_url(
            settings.VALKEY_URL, 
            encoding="utf-8", 
            decode_responses=True,
            ssl_cert_reqs=None if is_ssl else "required"
        )
    return _client

async def cache_set(key: str, value: any, ttl: int = 3600):
    await get_client().setex(key, ttl, json.dumps(value))

async def cache_get(key: str) -> any:
    data = await get_client().get(key)
    return json.loads(data) if data else None

async def cache_agent_output(session_id: str, agent: str, output: str, ttl: int = 3600):
    await get_client().setex(f"agent:{session_id}:{agent}", ttl, output)

async def get_agent_output(session_id: str, agent: str) -> str:
    return await get_client().get(f"agent:{session_id}:{agent}")

async def rate_limit(user_id: str, limit: int = 20, window: int = 60) -> bool:
    key = f"ratelimit:{user_id}"
    count = await get_client().incr(key)
    if count == 1:
        await get_client().expire(key, window)
    return count <= limit
