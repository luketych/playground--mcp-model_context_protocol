from fastapi import FastAPI, HTTPException
import uvicorn
from config import APP_C_PORT
from app_c.mcp_handler import send_mcp_to_server, poll_mcp_server
import traceback

app = FastAPI()

@app.get("/status")
async def status():
    """Report App C's status and capabilities."""
    return {
        "status": "healthy",
        "app": "AppC",
        "features": [
            "Message monitoring",
            "System analytics",
            "Cross-app communication"
        ]
    }

@app.get("/messages")
async def get_messages():
    """Poll MCP server for messages intended for App C."""
    try:
        response = poll_mcp_server()
        return response
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=503,
            detail=f"Error getting messages: {str(e)}"
        )

@app.post("/process")
async def process_message(message: dict):
    """Process a message and optionally forward it to other apps."""
    if not message:
        raise HTTPException(status_code=400, detail="Message content cannot be empty")
    
    try:
        # Process the message and decide where to route it
        # For now, just echo back the message
        return {"status": "processed", "message": message}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, port=APP_C_PORT)
