from langchain_pinecone import PineconeEmbeddings
from config import settings

def get_embeddings():
    return PineconeEmbeddings(
        model="multilingual-e5-large",
        pinecone_api_key=settings.PINECONE_API_KEY
    )
