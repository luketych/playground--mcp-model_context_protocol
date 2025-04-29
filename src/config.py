"""
Central configuration for all MCP components.
"""

# Port configurations
MCP_SERVER_PORT = 9002
APP_A_PORT = 8002
APP_B_PORT = 8003

# URLs
MCP_SERVER_URL = f"http://localhost:{MCP_SERVER_PORT}"
APP_A_URL = f"http://localhost:{APP_A_PORT}"
APP_B_URL = f"http://localhost:{APP_B_PORT}"

# Endpoints
MCP_RECEIVE_CONTEXT_ENDPOINT = "/receive_context"
