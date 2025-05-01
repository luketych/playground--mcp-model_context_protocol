import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch

@patch('src.app_b.app.poll_mcp_server')
def test_poll_endpoint_no_messages(mock_poll, app_b_client):
    """Test polling when no messages are available."""
    mock_poll.return_value = {"messages": []}
    response = app_b_client.get("/poll")
    assert response.status_code == 200
    assert response.json() == {"messages": []}
    mock_poll.assert_called_once()

@patch('src.app_b.app.call_claude')
@patch('src.app_b.app.poll_mcp_server')
def test_poll_endpoint_with_messages(mock_poll, mock_claude, app_b_client):
    """Test polling when messages are available."""
    message = {
        "summary": "Customer requesting refund for order #12345",
        "sentiment": "negative",
        "urgency": "high"
    }
    mock_poll.return_value = {"messages": [message]}
    mock_claude.return_value = "I'll help with the refund request"
    
    response = app_b_client.get("/poll")
    assert response.status_code == 200
    
    data = response.json()
    assert data["received_messages"] == [message]
    assert data["replies"] == ["I'll help with the refund request"]
    
    mock_poll.assert_called_once()
    mock_claude.assert_called_once()

@patch('src.app_b.app.poll_mcp_server')
def test_poll_endpoint_mcp_error(mock_poll, app_b_client):
    """Test polling when MCP server connection fails."""
    mock_poll.side_effect = Exception("MCP Server connection failed")
    response = app_b_client.get("/poll")
    assert response.status_code == 503
    assert "Error connecting to MCP server" in response.json()["detail"]
    mock_poll.assert_called_once()

def test_poll_endpoint_method_not_allowed(app_b_client):
    """Test polling with incorrect HTTP method."""
    response = app_b_client.post("/poll")
    assert response.status_code == 405  # Method not allowed
