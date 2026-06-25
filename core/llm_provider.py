import os
from typing import Optional
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from langchain_core.language_models.chat_models import BaseChatModel

# Load environment variables from .env
load_dotenv()

class LLMProvider:
    @staticmethod
    def get_llm(model_type: str = "ceo") -> Optional[BaseChatModel]:
        """
        Returns the appropriate LLM based on the role.
        'ceo' -> Gemini Pro (Strategy/Reasoning)
        'employee' -> Gemini Flash (Fast/Cost-effective)
        """
        google_api_key = os.getenv("GOOGLE_API_KEY")
        openai_api_key = os.getenv("OPENAI_API_KEY")
        
        # Priority: Gemini (as per lead's latest instruction)
        if google_api_key:
            # Using latest stable aliases
            model_name = "gemini-pro-latest" if model_type == "ceo" else "gemini-flash-latest"
            return ChatGoogleGenerativeAI(model=model_name, google_api_key=google_api_key)
        
        # Fallback: OpenAI
        if openai_api_key:
            model_name = "gpt-4o" if model_type == "ceo" else "gpt-4o-mini"
            return ChatOpenAI(model=model_name, api_key=openai_api_key)
            
        return None
