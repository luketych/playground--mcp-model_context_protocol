import requests
from typing import Dict, Any, List
from src.config import MCP_SERVER_URL, MCP_RECEIVE_CONTEXT_ENDPOINT

def build_mcp_package(system: str, memory: List[str], conversation: List[Dict[str, str]], current_task: str) -> Dict[str, Any]:
    """
    Build an MCP package with the required components.
    
    Args:
        system: The system context/role
        memory: List of memory items
        conversation: List of conversation messages
        current_task: The current task to be performed
        
    Returns:
        Dict containing the MCP package
    """
    return {
        "system": system,
        "memory": memory,
        "conversation": conversation,
        "current_task": current_task
    }


def send_mcp_to_server(mcp_package: Dict[str, Any]) -> Dict[str, Any]:
    """
    Send MCP package to the MCP server.
    
    Args:
        mcp_package: The MCP package to send
        
    Returns:
        Dict with status of the operation
    """
    try:
        response = requests.post(f"{MCP_SERVER_URL}{MCP_RECEIVE_CONTEXT_ENDPOINT}/AppA", json=mcp_package)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise Exception(f"Failed to send MCP package: {str(e)}")
