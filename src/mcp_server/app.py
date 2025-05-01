from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from config import MCP_SERVER_PORT
from mcp_server.router import router
from mcp_server.ws_adapter import setup_socketio

app = FastAPI()

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add REST API routes
app.include_router(router)

# Setup Socket.IO routes and handlers
app = setup_socketio(app)

if __name__ == "__main__":
    uvicorn.run(app, port=MCP_SERVER_PORT, host="0.0.0.0")
