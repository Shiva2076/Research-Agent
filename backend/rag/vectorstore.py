from langchain_pinecone import PineconeVectorStore
from rag.embeddings import get_embeddings
from config import settings
from pinecone import Pinecone

def get_vectorstore():
    pc = Pinecone(api_key=settings.PINECONE_API_KEY)
    return PineconeVectorStore(
        index=pc.Index(settings.PINECONE_INDEX_NAME),
        embedding=get_embeddings(),
        text_key="text"
    )
