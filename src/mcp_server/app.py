from fastapi import FastAPI
import uvicorn
from src.config import MCP_SERVER_PORT
from src.mcp_server.router import router

app = FastAPI()
app.include_router(router)

if __name__ == "__main__":
    uvicorn.run(app, port=MCP_SERVER_PORT)
