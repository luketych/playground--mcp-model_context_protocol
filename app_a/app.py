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