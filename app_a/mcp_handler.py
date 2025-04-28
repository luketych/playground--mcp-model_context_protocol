import requests

def build_mcp_package(system, memory, conversation, current_task):
    return {
        "sender": "AppA",
        "target": "AppB",
        "context": {
            "system_message": system,
            "memory": memory,
            "conversation": conversation,
            "current_task": current_task
        },
        "meta": {
            "created_at": "2025-04-28T15:00:00Z",
            "compression": "none",
            "token_estimate": 1500
        }
    }

def send_mcp_to_server(mcp_package):
    requests.post("http://localhost:9000/send_context", json=mcp_package)