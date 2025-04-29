import pytest
import requests
from fastapi.testclient import TestClient
from src.config import APP_A_PORT, APP_B_PORT, APP_C_PORT

def test_app_a_to_app_b_flow():
    """Test the complete flow from App A to App B through MCP server."""
    # 1. Send an email to App A
    response = requests.post(
        f"http://localhost:{APP_A_PORT}/summarize",
        json={"email": "Hello, I need help with my laptop refund."}
    )
    assert response.status_code == 200
    assert "status" in response.json()
    assert "summary" in response.json()
    
    # Wait briefly for async processing
    import time
    time.sleep(1)
    
    # 2. Poll App B for the message
    response = requests.get(f"http://localhost:{APP_B_PORT}/poll")
    assert response.status_code == 200
    
    data = response.json()
    if "messages" in data:
        # Old format (empty response)
        assert isinstance(data["messages"], list)
    else:
        # New format with received messages and optional Claude response
        assert "received_messages" in data
        assert isinstance(data["received_messages"], list)
        if len(data["received_messages"]) > 0:
            # Verify the message structure
            msg = data["received_messages"][0]
            assert "system" in msg
            assert "memory" in msg
            assert "conversation" in msg
            assert "current_task" in msg
            
            # If Claude API is not configured, expect an error
            if "claude_error" in data:
                assert "Unauthorized" in data["claude_error"]

def test_multi_app_communication():
    """Test communication between all three apps."""
    # 1. App A sends message that should be processed by both B and C
    response = requests.post(
        f"http://localhost:{APP_A_PORT}/summarize",
        json={"email": "Testing multi-app communication"}
    )
    assert response.status_code == 200
    
    # Wait briefly for async processing
    import time
    time.sleep(1)
    
    # 2. Check App B's response
    response = requests.get(f"http://localhost:{APP_B_PORT}/poll")
    assert response.status_code == 200
    
    # 3. Check App C's response
    response = requests.get(f"http://localhost:{APP_C_PORT}/messages")
    assert response.status_code == 200
    
    # 4. Send message from App C to others
    test_message = {
        "content": "System monitoring update",
        "target_app": "AppB"  # Testing targeted message
    }
    response = requests.post(
        f"http://localhost:{APP_C_PORT}/process",
        json=test_message
    )
    assert response.status_code == 200
