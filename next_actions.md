## Next Actions: Set up App A

1. Create the `app_a` directory structure:
   ```bash
   mkdir -p app_a
   ```

2. Create `app_a/mcp_handler.py` with the following content:
   ```python
   import requests

   def build_mcp_package(system, memory, conversation, current_task):
       return {
           "sender": "AppA",
           "target": "AppB",
           "context": {
               "system_message": system,
               "memory": memory,
               "conversation": conversation,
               "current_task": current_task
           },
           "meta": {
               "created_at": "2025-04-28T15:00:00Z",
               "compression": "none",
               "token_estimate": 1500
           }
       }

   def send_mcp_to_server(mcp_package):
       requests.post("http://localhost:9000/send_context", json=mcp_package)
   ```

3. Create `app_a/llm_client.py` with the following content:
   ```python
   import requests

   OPENAI_API_KEY = "your_openai_key"

   def call_openai_chat(prompt):
       url = "https://api.openai.com/v1/chat/completions"
       headers = {"Authorization": f"Bearer {OPENAI_API_KEY}"}
       data = {
           "model": "gpt-4-turbo",
           "messages": [{"role": "user", "content": prompt}]
       }
       response = requests.post(url, headers=headers, json=data)
       return response.json()["choices"][0]["message"]["content"]
   ```

4. Create `app_a/app.py` with the following content:
   ```python
   from fastapi import FastAPI
   import uvicorn
   from mcp_handler import build_mcp_package, send_mcp_to_server
   from llm_client import call_openai_chat

   app = FastAPI()

   @app.post("/summarize")
   def summarize_email(email: str):
       summary = call_openai_chat(f"Summarize this email briefly:\n{email}")
       mcp_package = build_mcp_package(
           system="You are a CRM assistant.",
           memory=["Customer is a frequent buyer."],
           conversation=[{"role": "user", "content": summary}],
           current_task="Draft a polite reply."
       )
       send_mcp_to_server(mcp_package)
       return {"status": "sent"}

   if __name__ == "__main__":
       uvicorn.run(app, port=8000)
   ```

Steps to implement:
1. First, create the `app_a` directory
2. Then create each file one by one with their respective content
3. Each file builds on the functionality of the others:
   - `mcp_handler.py` handles creating and sending MCP packages
   - `llm_client.py` manages OpenAI API communication
   - `app.py` ties everything together with a FastAPI endpoint