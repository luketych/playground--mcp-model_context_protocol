import requests
from typing import Dict, Any, List, Optional
from config import MCP_SERVER_URL, MCP_RECEIVE_CONTEXT_ENDPOINT

def poll_mcp_server() -> Dict[str, Any]:
    """
    Poll MCP server for messages intended for App C.
    
    Returns:
        Dict containing any messages from the server
    """
    try:
        response = requests.post(f"{MCP_SERVER_URL}{MCP_RECEIVE_CONTEXT_ENDPOINT}/AppC")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise Exception(f"Failed to poll MCP server: {str(e)}")

def send_mcp_to_server(mcp_package: Dict[str, Any], target_app: str = None) -> Dict[str, Any]:
    """
    Send MCP package to the MCP server, optionally targeting a specific app.
    
    Args:
        mcp_package: The MCP package to send
        target_app: Optional target app (e.g., "AppA", "AppB")
        
    Returns:
        Dict with status of the operation
    """
    if target_app:
        mcp_package["target_app"] = target_app

    try:
        response = requests.post(
            f"{MCP_SERVER_URL}{MCP_RECEIVE_CONTEXT_ENDPOINT}/AppC", 
            json=mcp_package
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise Exception(f"Failed to send MCP package: {str(e)}")

def build_mcp_package(
    message: Dict[str, Any],
    target_app: Optional[str] = None,
    analysis: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Build an MCP package with App C specific analytics/monitoring data.
    
    Args:
        message: The base message to process
        target_app: Optional target app for the message
        analysis: Optional analysis results to include
        
    Returns:
        Dict containing the MCP package
    """
    mcp_package = {
        "source_app": "AppC",
        "message": message,
        "analysis": analysis or {},
    }

    if target_app:
        mcp_package["target_app"] = target_app

    return mcp_package
