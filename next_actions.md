## Next Actions: Implement MCP Flow

1. Start all three servers:
   ```bash
   # Terminal 1: Start MCP Server
   cd mcp_server
   uvicorn app:app --port=9000

   # Terminal 2: Start App A
   cd app_a
   uvicorn app:app --port=8000

   # Terminal 3: Start App B
   cd app_b
   uvicorn app:app --port=8001
   ```

2. Test the email summarization flow:
   ```bash
   # Send a test email to App A
   curl -X POST "http://localhost:8000/summarize" \
     -H "Content-Type: application/json" \
     -d '{"email":"Hello, I am interested in purchasing your product. Could you please provide more information about pricing and availability? Best regards, John"}'
   ```

3. Test App B's polling:
   ```bash
   # Poll App B to receive and process the message
   curl -X POST "http://localhost:8001/poll"
   ```

4. Expected Flow:
   a. App A receives the email via `/summarize` endpoint
   b. App A uses OpenAI to summarize the email
   c. App A builds an MCP package with:
      - System message: "You are a CRM assistant."
      - Memory: ["Customer is a frequent buyer."]
      - Conversation: [The email summary]
      - Task: "Draft a polite reply."
   d. App A sends the MCP package to MCP Server
   e. App B polls the MCP Server via `/poll`
   f. MCP Server delivers the package to App B
   g. App B parses the package into a prompt
   h. App B uses Claude to generate a reply
   i. App B returns the generated reply

5. Verification Steps:
   - Check that App A returns {"status": "sent"}
   - Check that the MCP Server successfully stores the message
   - Check that App B successfully retrieves and processes the message
   - Verify the final response contains a properly formatted reply from Claude

Note: Make sure to replace "your_openai_key" and "your_anthropic_key" in the respective llm_client.py files with actual API keys before testing.