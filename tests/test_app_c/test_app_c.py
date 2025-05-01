import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch

@patch('src.app_c.app.poll_mcp_server')
def test_get_messages_empty(mock_poll, app_c_client):
    """Test getting messages when none are available."""
    mock_poll.return_value = {"messages": []}
    response = app_c_client.get("/messages")
    assert response.status_code == 200
    assert response.json() == {"messages": []}
    mock_poll.assert_called_once()

@patch('src.app_c.app.poll_mcp_server')
def test_get_messages_with_data(mock_poll, app_c_client):
    """Test getting messages when messages are available."""
    test_messages = {
        "messages": [
            {
                "source_app": "AppA",
                "message": "Test message",
                "analysis": {}
            }
        ]
    }
    mock_poll.return_value = test_messages
    response = app_c_client.get("/messages")
    assert response.status_code == 200
    assert response.json() == test_messages
    mock_poll.assert_called_once()

def test_status_endpoint(app_c_client):
    """Test the status endpoint."""
    response = app_c_client.get("/status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["app"] == "AppC"
    assert "features" in data
    assert isinstance(data["features"], list)

def test_process_empty_message(app_c_client):
    """Test process endpoint with empty message."""
    response = app_c_client.post("/process", json={})
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()

@patch('src.app_c.mcp_handler.send_mcp_to_server')
def test_process_valid_message(mock_send, app_c_client):
    """Test processing a valid message."""
    test_message = {
        "content": "Test message",
        "target_app": "AppB"
    }
    mock_send.return_value = {"status": "success"}
    response = app_c_client.post("/process", json=test_message)
    assert response.status_code == 200
    assert "processed" in response.json()["status"]
    assert response.json()["message"] == test_message
