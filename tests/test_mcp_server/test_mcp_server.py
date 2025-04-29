import pytest
from fastapi.testclient import TestClient

def test_receive_context_success(mcp_client):
    """Test successful context reception from an app."""
    test_context = {
        "summary": "Customer requesting refund for order #12345",
        "sentiment": "negative",
        "urgency": "high"
    }
    response = mcp_client.post(
        "/receive_context/AppA",
        json=test_context
    )
    assert response.status_code == 200
    assert response.json()["status"] == "success"

def test_receive_context_missing_data(mcp_client):
    """Test context reception with missing data."""
    response = mcp_client.post(
        "/receive_context/AppA",
        json={}
    )
    assert response.status_code == 400
    assert "error" in response.json()

def test_receive_context_invalid_app(mcp_client):
    """Test context reception from invalid app."""
    test_context = {
        "summary": "Test summary",
        "sentiment": "neutral"
    }
    response = mcp_client.post(
        "/receive_context/InvalidApp",
        json=test_context
    )
    assert response.status_code == 400
    assert "error" in response.json()

def test_get_context_success(mcp_client):
    """Test successful context retrieval."""
    # First send some context
    test_context = {
        "summary": "Test summary",
        "sentiment": "positive"
    }
    mcp_client.post("/receive_context/AppA", json=test_context)
    
    # Then try to receive it
    response = mcp_client.post("/receive_context/AppB")
    assert response.status_code == 200
    data = response.json()
    assert "messages" in data
    assert isinstance(data["messages"], list)

def test_get_context_no_messages(mcp_client):
    """Test context retrieval when no messages are available."""
    response = mcp_client.post("/receive_context/AppB")
    assert response.status_code == 200
    assert response.json()["messages"] == []

def test_get_context_invalid_app(mcp_client):
    """Test context retrieval for invalid app."""
    response = mcp_client.post("/receive_context/InvalidApp")
    assert response.status_code == 400
    assert "error" in response.json()

def test_context_flow(mcp_client):
    """Test the complete context flow between apps."""
    # App A sends context
    context_a = {
        "summary": "Customer needs refund for order #12345",
        "sentiment": "negative",
        "urgency": "high"
    }
    response_a = mcp_client.post("/receive_context/AppA", json=context_a)
    assert response_a.status_code == 200

    # App B receives context
    response_b = mcp_client.post("/receive_context/AppB")
    assert response_b.status_code == 200
    messages = response_b.json()["messages"]
    assert len(messages) > 0
    assert messages[0]["summary"] == context_a["summary"]
    assert messages[0]["sentiment"] == context_a["sentiment"]
    assert messages[0]["urgency"] == context_a["urgency"]