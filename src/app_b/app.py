from fastapi import FastAPI, HTTPException
import uvicorn
from config import APP_B_PORT
import requests
from app_b.mcp_handler import parse_mcp_package, poll_mcp_server
from app_b.llm_client import call_claude
import traceback

app = FastAPI()

@app.get("/poll")
async def poll_endpoint():
    try:
        # First try to poll the MCP server
        try:
            response = poll_mcp_server()
        except Exception as e:
            # Any poll error should return 503
            raise HTTPException(
                status_code=503, 
                detail="Error connecting to MCP server: " + str(e)
            )

        messages = response.get("messages", [])
        
        # If there are no messages, return early with empty array
        if not messages:
            return {"messages": []}
        
        # Process messages with Claude if we have any
        try:
            # First return the messages we received
            result = {
                "received_messages": messages,
                "replies": []
            }
            
            # Try to get Claude replies if possible
            try:
                for mcp_package in messages:
                    prompt = parse_mcp_package(mcp_package)
                    reply = call_claude(prompt)
                    result["replies"].append(reply)
            except Exception as e:
                result["claude_error"] = str(e)
                
            return result
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Error processing messages: {str(e)}")
            
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, port=APP_B_PORT)
