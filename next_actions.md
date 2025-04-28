## Next Actions: Set up App B

1. Create the `app_b` directory structure:
   ```bash
   mkdir -p app_b
   ```

2. Create `app_b/mcp_handler.py` with the following content:
   ```python
   def parse_mcp_package(mcp_package):
       context = mcp_package["context"]
       prompt = (
           f"System Instruction: {context['system_message']}\n\n"
           "Memory:\n" + "\n".join(context.get("memory", [])) + "\n\n"
           "Conversation:\n" + "\n".join(
               f"{m['role'].capitalize()}: {m['content']}" for m in context.get("conversation", [])
           ) + "\n\n"
           f"Task: {context['current_task']}"
       )
       return prompt
   ```

3. Create `app_b/llm_client.py` with the following content:
   ```python
   import requests

   ANTHROPIC_API_KEY = "your_anthropic_key"

   def call_claude(prompt):
       url = "https://api.anthropic.com/v1/messages"
       headers = {
           "Authorization": f"Bearer {ANTHROPIC_API_KEY}",
           "Content-Type": "application/json"
       }
       data = {
           "model": "claude-3-opus-20240229",
           "messages": [{"role": "user", "content": prompt}],
           "max_tokens": 1000
       }
       response = requests.post(url, headers=headers, json=data)
       return response.json()["content"][0]["text"]
   ```

4. Create `app_b/app.py` with the following content:
   ```python
   from fastapi import FastAPI
   import uvicorn
   import requests
   from mcp_handler import parse_mcp_package
   from llm_client import call_claude

   app = FastAPI()

   @app.post("/poll")
   def poll_mcp_server():
       response = requests.post("http://localhost:9000/receive_context/AppB")
       messages = response.json().get("messages", [])
       replies = []
       for mcp_package in messages:
           prompt = parse_mcp_package(mcp_package)
           reply = call_claude(prompt)
           replies.append(reply)
       return {"status": "processed", "replies": replies}

   if __name__ == "__main__":
       uvicorn.run(app, port=8001)
   ```

Steps to implement:
1. First, create the `app_b` directory
2. Then create each file one by one with their respective content:
   - `mcp_handler.py` for parsing received MCP packages into prompts
   - `llm_client.py` for Anthropic API communication
   - `app.py` for polling the MCP server and processing messages
3. The files work together where:
   - `app.py` polls the MCP server for new messages
   - `mcp_handler.py` parses the received MCP packages into formatted prompts
   - `llm_client.py` sends these prompts to Claude and gets responses