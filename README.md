# MCP Communication Project

## Overview

This project demonstrates communication between two applications using the Model Context Protocol (MCP). It implements a Fast MCP style with a lightweight, stateless MCP Server acting as a middleman.

### Components

1. **MCP Server**: A FastAPI-based server that manages and routes context between applications using Fast MCP principles (minimal memory, stateless delivery).
2. **App A**: An email summarization service that uses OpenAI's GPT-4 to process emails and forward them through MCP.
3. **App B**: A reply generation service that uses Anthropic's Claude to generate responses based on received context.

## Prerequisites

- Python 3.8 or higher
- OpenAI API key (for App A)
- Anthropic API key (for App B)
- Available ports (configured in config.py):
  - 9002 (MCP Server)
  - 8002 (App A)
  - 8003 (App B)

## Installation

This project uses the uv package manager for faster dependency management.

1. Install uv:
```bash
pip install uv
```

2. Create and activate a virtual environment:
```bash
uv venv
source .venv/bin/activate  # On macOS
```

3. Install the project and its dependencies:
```bash
uv pip install -e .
```

## Configuration

1. Configure OpenAI API key in `app_a/llm_client.py`:
   ```python
   OPENAI_API_KEY = "your_openai_key"
   ```

2. Configure Anthropic API key in `app_b/llm_client.py`:
   ```python
   ANTHROPIC_API_KEY = "your_anthropic_key"
   ```

## Running the Services

Start each service in a separate terminal (make sure your virtual environment is activated):

To start all services at once, simply run:
```bash
python main.py
```

This will start:
- MCP Server on port 9002
- App A on port 8002
- App B on port 8003

Alternatively, you can start each service individually:

1. Start the MCP Server:
   ```bash
   cd mcp_server
   python -m uvicorn app:app --port=9002
   ```

2. Start App A:
   ```bash
   cd app_a
   python -m uvicorn app:app --port=8002
   ```

3. Start App B:
   ```bash
   cd app_b
   python -m uvicorn app:app --port=8003
   ```

## Testing the Setup

1. Send a test email to App A:
   ```bash
   curl -X POST "http://localhost:8002/summarize" \
     -H "Content-Type: application/json" \
     -d '{"email":"Hello, I need help with my laptop refund."}'
   ```

2. Check App B's response:
   ```bash
   curl http://localhost:8003/poll
   ```

## Project Structure

```
/project-root
    /mcp_server
        app.py         # FastAPI app running the MCP server
        router.py      # Handles MCP routing with stateless delivery
    /app_a
        app.py         # API to trigger summarization
        llm_client.py  # OpenAI API client
        mcp_handler.py # Creates and sends MCP packages
    /app_b
        app.py         # Polls MCP server for messages
        llm_client.py  # Anthropic API client
        mcp_handler.py # Parses received MCP packages
```

### Flow Diagram

1. App A receives an email via `/summarize`
2. App A summarizes it using OpenAI and builds an MCP package
3. App A sends the MCP package to MCP Server
4. App B polls the MCP Server via `/poll`
5. MCP Server delivers the package to App B
6. App B parses the package into a prompt
7. App B uses Claude to generate a reply
8. App B returns the generated reply

## Fast MCP Implementation

This project implements Fast MCP principles:
- Minimal memory usage
- Stateless message delivery
- Simple message queuing
- Direct point-to-point routing
