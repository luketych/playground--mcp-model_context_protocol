import requests
from typing import Dict, Any, List
from src.config import MCP_SERVER_URL, MCP_RECEIVE_CONTEXT_ENDPOINT

def parse_mcp_package(mcp_package: Dict[str, Any]) -> str:
    """
    Parse an MCP package into a prompt for Claude.
    
    Args:
        mcp_package: Dictionary containing system, memory, conversation, and current_task
        
    Returns:
        Formatted prompt string for Claude
    """
    system = mcp_package.get('system', '')
    memory = mcp_package.get('memory', [])
    conversation = mcp_package.get('conversation', [])
    current_task = mcp_package.get('current_task', '')
    
    # Build the prompt
    prompt_parts = []
    
    # Add system context
    if system:
        prompt_parts.append(f"System: {system}\n")
    
    # Add memory items
    if memory:
        prompt_parts.append("Context:")
        for item in memory:
            prompt_parts.append(f"- {item}")
        prompt_parts.append("")  # Empty line
    
    # Add conversation
    if conversation:
        prompt_parts.append("Conversation:")
        for msg in conversation:
            role = msg.get('role', '')
            content = msg.get('content', '')
            prompt_parts.append(f"{role}: {content}")
        prompt_parts.append("")  # Empty line
    
    # Add current task
    if current_task:
        prompt_parts.append(f"Task: {current_task}")
    
    return "\n".join(prompt_parts)


def poll_mcp_server() -> Dict[str, Any]:
    """
    Poll MCP server for messages.
    
    Returns:
        Dict containing any messages from the server
    """
    try:
        response = requests.post(f"{MCP_SERVER_URL}{MCP_RECEIVE_CONTEXT_ENDPOINT}/AppB")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise Exception(f"Failed to poll MCP server: {str(e)}")
