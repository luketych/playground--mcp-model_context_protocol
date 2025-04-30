from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, Set, Optional
import asyncio
import json
from datetime import datetime

from .router import inbox, VALID_APPS  # Import from existing MCP server router

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.subscribers: Set[str] = set()
        self._background_task: Optional[asyncio.Task] = None

    async def connect(self, client_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        self.subscribers.add(client_id)
        
        # Send initial system state
        await self.send_system_state(client_id)

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]
        self.subscribers.discard(client_id)

    async def broadcast_system_event(self, event_type: str, data: dict):
        event = {
            "type": event_type,
            "data": data,
            "timestamp": datetime.now().isoformat()
        }
        await self._broadcast(event)

    async def _broadcast(self, message: dict):
        for client_id in self.subscribers:
            try:
                ws = self.active_connections.get(client_id)
                if ws and ws.client_state.connected:
                    await ws.send_json(message)
            except Exception:
                # If sending fails, remove the connection
                self.disconnect(client_id)

    async def send_system_state(self, client_id: str):
        """Send current system state to a client."""
        ws = self.active_connections.get(client_id)
        if not ws:
            return

        # Collect current system state
        state = {
            "type": "system_state",
            "data": {
                "apps": VALID_APPS,
                "queues": {app: len(inbox.get(app, [])) for app in VALID_APPS},
                "messages": [msg for queue in inbox.values() for msg in queue],
            },
            "timestamp": datetime.now().isoformat()
        }
        await ws.send_json(state)

    async def start_monitoring(self):
        """Start background task to monitor system metrics."""
        async def monitor_loop():
            while True:
                metrics = {
                    "queue_sizes": {app: len(inbox.get(app, [])) for app in VALID_APPS},
                    "total_messages": sum(len(inbox.get(app, [])) for app in VALID_APPS),
                    "active_connections": len(self.active_connections)
                }
                await self.broadcast_system_event("metrics_update", metrics)
                await asyncio.sleep(5)  # Update every 5 seconds

        if not self._background_task:
            self._background_task = asyncio.create_task(monitor_loop())

    def stop_monitoring(self):
        """Stop the background monitoring task."""
        if self._background_task:
            self._background_task.cancel()
            self._background_task = None

# Global connection manager instance
manager = ConnectionManager()

async def handle_websocket(websocket: WebSocket, client_id: str):
    """Handle individual WebSocket connections."""
    try:
        await manager.connect(client_id, websocket)
        
        while True:
            try:
                data = await websocket.receive_json()
                
                # Handle different client message types
                if data.get("type") == "request_status":
                    await manager.send_system_state(client_id)
                
                elif data.get("type") == "send_message":
                    # Forward message to MCP router
                    message = data.get("data", {})
                    if message.get("target") in VALID_APPS:
                        inbox[message["target"]].append(message)
                        await manager.broadcast_system_event(
                            "message_sent",
                            {"message": message}
                        )
                
            except json.JSONDecodeError:
                continue  # Ignore invalid JSON
                
    except WebSocketDisconnect:
        manager.disconnect(client_id)
    except Exception as e:
        manager.disconnect(client_id)
        await manager.broadcast_system_event(
            "error",
            {"message": f"Client error: {str(e)}"}
        )

def setup_websocket_routes(app):
    """Configure WebSocket routes and event handlers for the FastAPI app."""
    
    @app.websocket("/ws/{client_id}")
    async def websocket_endpoint(websocket: WebSocket, client_id: str):
        await handle_websocket(websocket, client_id)

    @app.on_event("startup")
    async def startup_event():
        await manager.start_monitoring()

    @app.on_event("shutdown")
    def shutdown_event():
        manager.stop_monitoring()

    return app
