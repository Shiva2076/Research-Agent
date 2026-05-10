from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GROQ_API_KEY: str
    PINECONE_API_KEY: str
    PINECONE_INDEX_NAME: str = "research-agent"
    OPENAI_API_KEY: str | None = None
    MONGODB_URI: str = "mongodb://localhost:27017"
    VALKEY_URL: str = "redis://localhost:6379"
    MINIO_ENDPOINT: str = "http://localhost:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin123"
    MINIO_BUCKET: str = "research-agent"
    MINIO_LICENSE: str | None = None

    CLOUDINARY_CLOUD_NAME: str | None = None
    CLOUDINARY_API_KEY: str | None = None
    CLOUDINARY_API_SECRET: str | None = None

    GROQ_MODELS: dict = {
        "planner":   "llama-3.3-70b-versatile",
        "searcher":  "llama-3.1-8b-instant",
        "ranker":    "llama-3.1-8b-instant",
        "writer":    "llama-3.3-70b-versatile",
        "factcheck": "llama-3.3-70b-versatile",
        "report":    "llama-3.3-70b-versatile",
    }

    class Config:
        env_file = ".env"

settings = Settings()
