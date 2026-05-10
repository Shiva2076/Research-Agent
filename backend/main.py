from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
from db.mongo import connect_mongo, disconnect_mongo
from storage.minio_client import ensure_bucket
import logging

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Research Agent API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await connect_mongo()
    await ensure_bucket()

@app.on_event("shutdown")
async def shutdown():
    await disconnect_mongo()

app.include_router(router)

@app.get("/health")
async def health():
    return {"status": "ok"}
