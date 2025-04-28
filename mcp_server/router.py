from fastapi import APIRouter, Request
from typing import Dict

router = APIRouter()

# Fast MCP - minimal memory, stateless delivery
inbox: Dict[str, list] = {}

@router.post("/send_context")
async def send_context(request: Request):
    mcp_package = await request.json()
    target = mcp_package.get("target")
    if target:
        inbox.setdefault(target, []).append(mcp_package)
        return {"status": "stored"}
    return {"status": "error", "reason": "Missing target"}

@router.post("/receive_context/{app_id}")
async def receive_context(app_id: str):
    messages = inbox.pop(app_id, [])
    return {"messages": messages}