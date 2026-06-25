import os
from core.orchestrator import create_orchestrator
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv

load_dotenv()

def test_minimal():
    print("Initializing orchestrator...")
    app = create_orchestrator()
    print("Orchestrator initialized.")
    
    config = {"configurable": {"thread_id": "1"}}
    initial_state = {
        "messages": [HumanMessage(content="Can you run an audit for example.com?")],
        "agency_id": "test_agency",
        "tasks": []
    }
    
    print("Invoking...")
    for event in app.stream(initial_state, config):
        print(f"Event: {event}")

if __name__ == "__main__":
    test_minimal()
