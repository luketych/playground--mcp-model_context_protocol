## Milestone 4: Implement MCP Flow

- App A receives an email via `/summarize`.
- App A summarizes it using OpenAI and builds an MCP package.
- App A sends the MCP package to the MCP Server.
- App B polls the MCP Server via `/poll`.
- MCP Server delivers the MCP package to App B.
- App B parses the MCP package, drafts a reply using Claude API.
- App B returns the generated reply.