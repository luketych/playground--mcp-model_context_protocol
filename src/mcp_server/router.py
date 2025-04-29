from fastapi import APIRouter, Request, HTTPException, Response
from typing import Dict, Any, Optional

router = APIRouter()

# Valid apps that can interact with MCP
VALID_APPS = ["AppA", "AppB"]

# Fast MCP - minimal memory, stateless delivery 
# Store messages from AppA to be retrieved by AppB
inbox: Dict[str, list] = {"AppB": []}

@router.post("/receive_context/{app_id}")
async def receive_context(app_id: str, request: Request, response: Response):
    """
    Handle context reception and retrieval.
    If request body is provided, store the context.
    If no request body, return stored messages.
    """
    if app_id not in VALID_APPS:
        response.status_code = 400
        return {"error": f"Invalid app ID: {app_id}"}

    try:
        body = await request.body()
        if not body:
            # No body means it's a retrieval request
            if app_id == "AppB":
                messages = inbox["AppB"]
                inbox["AppB"] = []  # Clear after retrieval
                return {"messages": messages}
            return {"messages": []}

        try:
            context = await request.json()
        except ValueError:
            response.status_code = 400
            return {"error": "Invalid JSON data"}

        if not context:
            response.status_code = 400
            return {"error": "Missing request data"}

        if app_id == "AppA":
            # Store messages from AppA to be retrieved by AppB
            inbox["AppB"].append(context)
            return {"status": "success"}
        
        return {"status": "success", "messages": []}
    except Exception as e:
        response.status_code = 500
        return {"error": str(e)}
