import os
from pathlib import Path
from dotenv import load_dotenv
import requests

# Load environment variables from .env file
dotenv_path = os.getenv("DOTENV_PATH", str(Path(__file__).parent.parent / ".env"))
load_dotenv(dotenv_path)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def call_openai_chat(prompt):
    if OPENAI_API_KEY == "your_openai_key":
        raise ValueError("Please set the OPENAI_API_KEY environment variable")

    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "gpt-4-turbo",
        "messages": [{"role": "user", "content": prompt}]
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()  # Raise an exception for bad status codes
        return response.json()["choices"][0]["message"]["content"]
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"OpenAI API request failed: {str(e)}")