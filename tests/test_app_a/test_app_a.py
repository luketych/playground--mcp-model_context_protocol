import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch

@patch('app_a.app.send_mcp_to_server')
def test_summarize_endpoint_success(mock_send, app_a_client, test_email):
    """Test successful email summarization."""
    mock_send.return_value = {"status": "success"}
    response = app_a_client.post(
        "/summarize",
        json={"email": test_email}
    )
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    mock_send.assert_called_once()

@patch('app_a.app.send_mcp_to_server')
def test_summarize_endpoint_empty_email(mock_send, app_a_client):
    """Test summarization with empty email."""
    response = app_a_client.post(
        "/summarize",
        json={"email": ""}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email content cannot be empty"
    mock_send.assert_not_called()

def test_summarize_endpoint_missing_email(app_a_client):
    """Test summarization with missing email field."""
    response = app_a_client.post(
        "/summarize",
        json={}
    )
    assert response.status_code == 422  # FastAPI validation error

def test_summarize_endpoint_invalid_json(app_a_client):
    """Test summarization with invalid JSON."""
    response = app_a_client.post(
        "/summarize",
        content=b"invalid json",
        headers={"Content-Type": "application/json"}
    )
    assert response.status_code == 422  # FastAPI validation error
