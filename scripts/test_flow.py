import requests
import time
import json
from typing import Dict, Any
from config import (
    APP_A_PORT, APP_B_PORT, MCP_SERVER_PORT,
    APP_A_URL, APP_B_URL, MCP_SERVER_URL
)

def send_email(email_content: str) -> Dict[str, Any]:
    """Send an email to App A for summarization."""
    url = f"{APP_A_URL}/summarize"
    data = {"email": email_content}
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, json=data, headers=headers)
    return response.json()

def poll_app_b():
    """Poll App B for responses."""
    url = f"{APP_B_URL}/poll"
    response = requests.post(url)
    return response.json()

def main():
    # Test email content
    test_email = """
    Hello Support Team,
    
    I recently purchased a laptop from your store on April 15th, but unfortunately,
    it's not meeting my needs. The battery life is much shorter than advertised,
    and the screen has some dead pixels.
    
    I would like to request a refund under your 30-day return policy. Order number
    is #12345. Please let me know the next steps.
    
    Best regards,
    John Smith
    """
    
    print("1. Sending email to App A...")
    result = send_email(test_email)
    print(f"Result from App A: {json.dumps(result, indent=2)}")
    
    # Wait a moment for the message to be processed
    print("\n2. Waiting for processing (2 seconds)...")
    time.sleep(2)
    
    print("\n3. Polling App B for response...")
    response = poll_app_b()
    print(f"Response from App B: {json.dumps(response, indent=2)}")

if __name__ == "__main__":
    try:
        main()
    except requests.exceptions.ConnectionError:
        print("\nError: Could not connect to one of the services.")
        print("Make sure all services are running:")
        print(f"- MCP Server (port {MCP_SERVER_PORT})")
        print(f"- App A (port {APP_A_PORT})")
        print(f"- App B (port {APP_B_PORT})")
