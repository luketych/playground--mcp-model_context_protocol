import requests

ANTHROPIC_API_KEY = "your_anthropic_key"

def call_claude(prompt):
    url = "https://api.anthropic.com/v1/messages"
    headers = {
        "Authorization": f"Bearer {ANTHROPIC_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "claude-3-opus-20240229",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 1000
    }
    response = requests.post(url, headers=headers, json=data)
    return response.json()["content"][0]["text"]