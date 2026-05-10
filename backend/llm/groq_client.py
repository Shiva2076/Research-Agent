from groq import AsyncGroq
from config import settings

client = AsyncGroq(api_key=settings.GROQ_API_KEY)

async def call_agent(agent_name: str, prompt: str) -> str:
    model = settings.GROQ_MODELS[agent_name]
    response = await client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1500,
        temperature=0.7,
    )
    return response.choices[0].message.content

async def stream_agent(agent_name: str, prompt: str):
    model = settings.GROQ_MODELS[agent_name]
    stream = await client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1500,
        temperature=0.7,
        stream=True,
    )
    async for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta
