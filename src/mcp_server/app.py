from fastapi import FastAPI
import uvicorn
from config import MCP_SERVER_PORT
from mcp_server.router import router
from mcp_server.ws_adapter import setup_websocket_routes

app = FastAPI()

# Add REST API routes
app.include_router(router)

# Setup WebSocket routes and handlers
app = setup_websocket_routes(app)

if __name__ == "__main__":
    uvicorn.run(app, port=MCP_SERVER_PORT)
