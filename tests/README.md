# Tests for MCP Model Context Protocol

This directory contains tests for all components of the MCP (Model Context Protocol) system.

## Structure

```
tests/
├── conftest.py              # Shared pytest fixtures
├── test_app_a/             # Tests for App A (email summarization)
├── test_app_b/             # Tests for App B (polling)
└── test_mcp_server/        # Tests for MCP Server (context management)
```

## Setup

1. Make sure you have activated the virtual environment:
```bash
source .venv/bin/activate.fish  # For fish shell
```

2. Install test dependencies:
```bash
uv pip install -r requirements.txt
```

## Running Tests

To run all tests:
```bash
pytest
```

To run tests for a specific component:
```bash
pytest tests/test_app_a/      # Test App A
pytest tests/test_app_b/      # Test App B
pytest tests/test_mcp_server/ # Test MCP Server
```

To run tests with verbose output:
```bash
pytest -v
```

## Test Coverage

The test suite covers:

- App A:
  - Email summarization endpoint
  - Input validation
  - Error handling

- App B:
  - Message polling endpoint
  - MCP server communication
  - Error handling

- MCP Server:
  - Context reception
  - Context retrieval
  - Application validation
  - Complete context flow between apps

Each component's tests use FastAPI's TestClient for HTTP testing and pytest fixtures for shared resources.