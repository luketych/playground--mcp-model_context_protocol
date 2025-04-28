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
- Available ports:
  - 9001 (MCP Server)
  - 8000 (App A)
  - 8001 (App B)

## Installation

Install the required dependencies:

```bash
pip install fastapi uvicorn requests
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

Start each service in a separate terminal:

1. Start the MCP Server:
   ```bash
   cd mcp_server
   uvicorn app:app --port=9001
   ```

2. Start App A:
   ```bash
   cd app_a
   uvicorn app:app --port=8000
   ```

3. Start App B:
   ```bash
   cd app_b
   uvicorn app:app --port=8001
   ```

## Testing the Setup

1. Send a test email to App A:
   ```bash
   curl -X POST "http://localhost:8000/summarize" \
     -H "Content-Type: application/json" \
     -d '{"email":"Hello, I need help with my laptop refund."}'
   ```

2. Check App B's response:
   ```bash
   curl -X POST "http://localhost:8001/poll"
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