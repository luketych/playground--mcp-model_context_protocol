import pytest
from fastapi.testclient import TestClient
import pytest
from unittest.mock import patch
from src.mcp_server.app import app as mcp_app
from src.app_a.app import app as app_a
from src.app_b.app import app as app_b

@pytest.fixture
def mcp_client():
    return TestClient(mcp_app)

@pytest.fixture
def app_a_client():
    # Mock MCP server calls in App A
    with patch('src.app_a.mcp_handler.send_mcp_to_server') as mock_send:
        mock_send.return_value = {"status": "success"}
        yield TestClient(app_a)

@pytest.fixture
def app_b_client():
    # Mock MCP server calls in App B
    with patch('src.app_b.app.poll_mcp_server') as mock_poll:
        mock_poll.return_value = {"messages": []}
        yield TestClient(app_b)

@pytest.fixture
def test_email():
    return """
    Hello Support Team,
    
    I recently purchased a laptop from your store on April 15th, but unfortunately,
    it's not meeting my needs. The battery life is much shorter than advertised,
    and the screen has some dead pixels.
    
    I would like to request a refund under your 30-day return policy. Order number
    is #12345. Please let me know the next steps.
    
    Best regards,
    John Smith
    """
