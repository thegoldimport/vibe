from typing import List, Dict
import os
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.documents import Document

class MemoryManager:
    def __init__(self, agency_id: str):
        self.agency_id = agency_id
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.vector_store = None
        self.kv_store: Dict[str, str] = {}
        
        # Initialize an empty FAISS index
        # In a real app, we'd load from disk or a cloud DB
        dummy_doc = Document(page_content="Initial memory state", metadata={"source": "init"})
        self.vector_store = FAISS.from_documents([dummy_doc], self.embeddings)

    def add_to_long_term_memory(self, text: str, metadata: dict = None):
        """Adds a fact to the vector database."""
        doc = Document(page_content=text, metadata=metadata or {})
        self.vector_store.add_documents([doc])

    def query_long_term_memory(self, query: str, k: int = 3) -> List[Document]:
        """Retrieves relevant facts from the vector database."""
        return self.vector_store.similarity_search(query, k=k)

    def save_kv(self, key: str, value: str):
        """Saves a key-value pair to mid-term memory."""
        self.kv_store[key] = value

    def get_kv(self, key: str) -> str:
        """Retrieves a value from mid-term memory."""
        return self.kv_store.get(key, "")

    def get_agency_context(self) -> str:
        """Summarizes the current agency state for the prompt."""
        context = "Agency Context:\n"
        for k, v in self.kv_store.items():
            context += f"- {k}: {v}\n"
        return context
