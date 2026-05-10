from rag.vectorstore import get_vectorstore

def get_retriever(k: int = 5):
    vs = get_vectorstore()
    return vs.as_retriever(search_kwargs={"k": k})

async def retrieve_context(query: str, k: int = 5) -> str:
    retriever = get_retriever(k)
    docs = await retriever.aget_relevant_documents(query)
    if not docs:
        return ""
    return "\n\n".join(d.page_content for d in docs)
