from core.orchestrator import create_orchestrator
from langchain_core.messages import HumanMessage

def test_orchestration():
    app = create_orchestrator()
    
    config = {"configurable": {"thread_id": "1"}}
    
    # Initial state
    initial_state = {
        "messages": [HumanMessage(content="Can you run an audit for example.com?")],
        "agency_id": "agency_123",
        "niche": "Local SEO",
        "branding": {"name": "VibeDev"},
        "tasks": []
    }
    
    print("--- Running Audit Workflow ---")
    for event in app.stream(initial_state, config):
        for node, output in event.items():
            print(f"Node: {node}")
            if "messages" in output:
                print(f"Message: {output['messages'][-1].content}")
    
    # Second state
    initial_state_2 = {
        "messages": [HumanMessage(content="Write a blog post about tree service.")],
        "agency_id": "agency_123",
        "niche": "Tree Service Marketing",
        "branding": {"name": "VibeDev"},
        "tasks": []
    }
    
    print("\n--- Running Writer Workflow ---")
    for event in app.stream(initial_state_2, config):
        for node, output in event.items():
            print(f"Node: {node}")
            if "messages" in output:
                print(f"Message: {output['messages'][-1].content}")

if __name__ == "__main__":
    test_orchestration()
