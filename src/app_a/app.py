from fastapi import FastAPI, HTTPException
import uvicorn
from src.config import APP_A_PORT
from src.app_a.mcp_handler import build_mcp_package, send_mcp_to_server
from src.app_a.llm_client import call_openai_chat
from pydantic import BaseModel
import traceback

app = FastAPI()


class EmailRequest(BaseModel):
    email: str

@app.post("/summarize")
async def summarize_email(request: EmailRequest):
    # Validate email content first
    if not request.email.strip():
        raise HTTPException(status_code=400, detail="Email content cannot be empty")
    
    try:
        summary = call_openai_chat(f"Summarize this email briefly:\n{request.email}")
        mcp_package = build_mcp_package(
            system="You are a CRM assistant.",
            memory=["Customer is a frequent buyer."],
            conversation=[{"role": "user", "content": summary}],
            current_task="Draft a polite reply."
        )
        send_mcp_to_server(mcp_package)
        return {"status": "sent", "summary": summary}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, port=APP_A_PORT)
