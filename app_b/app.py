from fastapi import FastAPI
import uvicorn
import requests
from mcp_handler import parse_mcp_package
from llm_client import call_claude

app = FastAPI()

@app.post("/poll")
def poll_mcp_server():
    response = requests.post("http://localhost:9001/receive_context/AppB")
    messages = response.json().get("messages", [])
    replies = []
    for mcp_package in messages:
        prompt = parse_mcp_package(mcp_package)
        reply = call_claude(prompt)
        replies.append(reply)
    return {"status": "processed", "replies": replies}

if __name__ == "__main__":
    uvicorn.run(app, port=8001)