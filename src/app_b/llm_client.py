import os
from pathlib import Path
from dotenv import load_dotenv
import requests

# Load environment variables from .env file
dotenv_path = os.getenv("DOTENV_PATH", str(Path(__file__).parent.parent / ".env"))
load_dotenv(dotenv_path)

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

def call_claude(prompt):
    if ANTHROPIC_API_KEY == "your_anthropic_key":
        raise ValueError("Please set the ANTHROPIC_API_KEY environment variable")
    
    url = "https://api.anthropic.com/v1/messages"
    headers = {
        "Authorization": f"Bearer {ANTHROPIC_API_KEY}",
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01"
    }
    data = {
        "model": "claude-3-opus-20240229",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 1000
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()  # Raise an exception for bad status codes
        return response.json()["content"][0]["text"]
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Anthropic API request failed: {str(e)}")