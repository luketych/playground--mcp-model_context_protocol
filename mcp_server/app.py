from fastapi import FastAPI
import uvicorn
from mcp_server.router import router

app = FastAPI()
app.include_router(router)

if __name__ == "__main__":
    uvicorn.run(app, port=9001)