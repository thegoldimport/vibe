from typing import Annotated, List, TypedDict, Union, Dict
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from core.memory import MemoryManager
from agents.templates import CEO_TEMPLATE, LEAD_GEN_TEMPLATE, SEO_TEMPLATE, CONTENT_WRITER_TEMPLATE
import operator

class AgentState(TypedDict):
    # Messages in the conversation (Owner <-> CEO)
    messages: Annotated[List[BaseMessage], add_messages]
    
    # Agency configuration
    agency_id: str
    niche: str
    branding: Dict
    
    # Context about the agency (retrieved from memory)
    agency_context_summary: str
    
    # List of tasks currently being handled by employees
    tasks: List[dict]
    
    # The result of the last employee task
    last_task_result: str
    
    # Current status/phase of the conversation
    next_action: str

# In-memory store for agency memories (for MVP simulation)
AGENCY_MEMORIES: Dict[str, MemoryManager] = {}

def get_memory(agency_id: str) -> MemoryManager:
    if agency_id not in AGENCY_MEMORIES:
        AGENCY_MEMORIES[agency_id] = MemoryManager(agency_id)
    return AGENCY_MEMORIES[agency_id]

from langchain_google_genai import ChatGoogleGenerativeAI
import os

# Initialize LLM (Gemini 1.5 Pro for CEO)
def get_llm(model_name="gemini-1.5-pro"):
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return None
    return ChatGoogleGenerativeAI(model=model_name, google_api_key=api_key)

def ceo_node(state: AgentState):
    agency_id = state['agency_id']
    memory = get_memory(agency_id)
    niche = state.get('niche', 'General Digital Marketing')
    branding = state.get('branding', {})
    
    # Update context summary for the prompt
    state['agency_context_summary'] = memory.get_agency_context()
    
    messages = state['messages']
    
    llm = get_llm()
    if llm:
        # Actual LLM logic
        system_prompt = CEO_TEMPLATE.system_prompt.format(
            niche=niche,
            branding=branding
        )
        # Add instructions for delegation
        system_prompt += (
            "\n\nIf the user wants an audit, respond with 'TASK:LEAD_GEN:AUDIT'. "
            "If the user wants a blog post or writing, respond with 'TASK:WRITER:BLOG'. "
            "Otherwise, respond conversationally."
        )
        
        prompt = [SystemMessage(content=system_prompt)] + messages
        response = llm.invoke(prompt)
        content = response.content
        
        if "TASK:LEAD_GEN:AUDIT" in content:
             return {
                "messages": [AIMessage(content="Understood. I'm tasking our Lead Gen Specialist with a website audit.")],
                "next_action": "delegate_lead_gen"
            }
        elif "TASK:WRITER:BLOG" in content:
            return {
                "messages": [AIMessage(content="Sure. I'll have the Content Writer draft that for you.")],
                "next_action": "delegate_writer"
            }
        else:
            return {
                "messages": [response],
                "next_action": END
            }
    else:
        # Fallback to MOCK REASONING LOGIC (when API key is missing)
        last_message = messages[-1]
        if isinstance(last_message, HumanMessage):
            content = last_message.content.lower()
            if "audit" in content:
                return {
                    "messages": [AIMessage(content="Understood. I'm tasking our Lead Gen Specialist with a website audit.")],
                    "next_action": "delegate_lead_gen"
                }
            elif "blog" in content or "write" in content:
                 return {
                    "messages": [AIMessage(content="Sure. I'll have the Content Writer draft that for you.")],
                    "next_action": "delegate_writer"
                }
            else:
                return {
                    "messages": [AIMessage(content="Hello! I am your AI CEO. How can I help you grow your agency today?")],
                    "next_action": END
                }
    
    return {"next_action": END}

def lead_gen_node(state: AgentState):
    niche = state.get('niche', 'General Digital Marketing')
    llm = get_llm("gemini-1.5-flash") # Use flash for employees
    
    if llm:
        system_prompt = LEAD_GEN_TEMPLATE.system_prompt.format(niche=niche)
        prompt = [SystemMessage(content=system_prompt)] + [HumanMessage(content="Run an audit and return the result.")]
        response = llm.invoke(prompt)
        return {
            "messages": [SystemMessage(content="Lead Gen Specialist: Task completed.")],
            "last_task_result": response.content,
            "next_action": "report"
        }

    # Mock specialized employee logic
    return {
        "messages": [SystemMessage(content="Lead Gen Specialist: Audit completed.")],
        "last_task_result": "Website Audit Result: 85/100. Good SEO, but missing meta tags.",
        "next_action": "report"
    }

def writer_node(state: AgentState):
    branding = state.get('branding', {})
    brand_voice = branding.get('voice', 'Professional')
    llm = get_llm("gemini-1.5-flash")
    
    if llm:
        system_prompt = CONTENT_WRITER_TEMPLATE.system_prompt.format(brand_voice=brand_voice)
        prompt = [SystemMessage(content=system_prompt)] + [HumanMessage(content="Draft a blog post and return the result.")]
        response = llm.invoke(prompt)
        return {
            "messages": [SystemMessage(content="Content Writer: Task completed.")],
            "last_task_result": response.content,
            "next_action": "report"
        }

    return {
        "messages": [SystemMessage(content="Content Writer: Blog post drafted.")],
        "last_task_result": "Draft: '5 Ways to Boost Your Local Business Visibility'...",
        "next_action": "report"
    }

def reporting_node(state: AgentState):
    result = state['last_task_result']
    agency_id = state['agency_id']
    memory = get_memory(agency_id)
    
    # Save the result to long term memory
    memory.add_to_long_term_memory(f"Task Result: {result}")
    
    return {
        "messages": [AIMessage(content=f"The team has finished the task. Here is the result:\n\n{result}")],
        "next_action": END
    }

def router(state: AgentState):
    return state["next_action"]

def create_orchestrator():
    workflow = StateGraph(AgentState)
    
    workflow.add_node("ceo", ceo_node)
    workflow.add_node("lead_gen", lead_gen_node)
    workflow.add_node("writer", writer_node)
    workflow.add_node("reporter", reporting_node)
    
    workflow.set_entry_point("ceo")
    
    workflow.add_conditional_edges(
        "ceo",
        router,
        {
            "delegate_lead_gen": "lead_gen",
            "delegate_writer": "writer",
            END: END
        }
    )
    
    workflow.add_conditional_edges(
        "lead_gen",
        router,
        {
            "report": "reporter"
        }
    )

    workflow.add_conditional_edges(
        "writer",
        router,
        {
            "report": "reporter"
        }
    )
    
    workflow.add_edge("reporter", END)
    
    return workflow.compile()
