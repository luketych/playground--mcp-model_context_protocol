from fastapi import APIRouter, Request, HTTPException, Response
from typing import Dict, Any, Optional

router = APIRouter()

# Valid apps that can interact with MCP
VALID_APPS = ["AppA", "AppB", "AppC"]

# Fast MCP - minimal memory, stateless delivery 
# Store messages for each app
inbox: Dict[str, list] = {"AppA": [], "AppB": [], "AppC": []}

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
            messages = inbox[app_id]
            inbox[app_id] = []  # Clear after retrieval
            return {"messages": messages}

        try:
            context = await request.json()
        except ValueError:
            response.status_code = 400
            return {"error": "Invalid JSON data"}

        if not context:
            response.status_code = 400
            return {"error": "Missing request data"}

        # Handle message routing based on source app and target
        target_app = context.get("target_app")
        if target_app:
            if target_app not in VALID_APPS:
                response.status_code = 400
                return {"error": f"Invalid target app: {target_app}"}
                
            # Route to specific target
            inbox[target_app].append(context)
        else:
            # Default routing (AppA -> AppB, others broadcast except to self)
            if app_id == "AppA":
                inbox["AppB"].append(context)
            else:
                # Broadcast to all except sender
                for app in VALID_APPS:
                    if app != app_id:
                        inbox[app].append(context)
        
        return {"status": "success"}
    except Exception as e:
        response.status_code = 500
        return {"error": str(e)}
