# Test Suite Debugging Milestones

## Legend

[✅] Milestone is complete.
[❓] Stuck. Not sure what to do..?
[⁉️] Approaching FUBAR? Circling around. Stuck in mud.
[❗] Requires attention, focus. But not stuck.
[‼️] Milestone requires immediate attention. Or things but get worse fast.
[⚠️] milestone is complete, but with some warnings, caveats. Might be unstable longer-term.

### Difficulty
○
🟢
🟦
◆
◆◆


# Instructions:

Keep track of milestones, with datetimes when each milestone was created, and each time it is updated, or progress has been made on it.



# Milestones

1. Initial test run - FAILED
   [✅] Identified ImportError in app_a/mcp_handler.py
   [✅] Missing function: build_mcp_package

2. Implementation Progress
   [✅] Implemented build_mcp_package function in app_a/mcp_handler.py
   [✅] Function takes system, memory, conversation, and current_task parameters
   [✅] Returns properly structured MCP package dictionary

3. Second test run - FAILED
   [✅] Identified ImportError in app_b/mcp_handler.py
   [✅] Missing function: parse_mcp_package

4. Implementation Progress
   [✅] Implemented parse_mcp_package function in app_b/mcp_handler.py
   [✅] Function takes MCP package and formats it into a prompt for Claude
   [⚠️] Handles system context, memory items, conversation history, and current task (requires Claude API key)

5. Third test run - FAILED
   Issues identified:
   a) App A:
      [✅] Empty email validation missing (400 status needed)
   b) App B:
      [✅] Poll endpoint returning 503 instead of 200
      [✅] Mock not being called in error test
   c) MCP Server:
      [✅] Missing data validation (400 status needed)
      [✅] Invalid app response format issues
      [✅] Context flow not working (no messages being passed)

6. Implementation Progress
   a) App A:
      [✅] Added validation for empty email content
   b) App B:
      [✅] Fixed poll endpoint to use mcp_handler's poll_mcp_server
      [✅] Renamed endpoint function to avoid naming conflict
   c) MCP Server:
      [✅] Added proper error response format with 'error' key
      [✅] Added validation for missing/invalid data
      [✅] Improved inbox structure for AppA->AppB message passing
      [✅] Fixed message storage and retrieval logic

7. Fourth test run - Issues Fixed
   a) App A:
      [✅] Moved email validation outside try block to ensure proper 400 status
   b) App B:
      [✅] Restructured error handling with proper status codes
      [✅] Fixed response format to match test expectations
      [✅] Separated MCP server polling from message processing
   c) MCP Server:
      [✅] Implemented consistent error response format with 'error' key
      [✅] Proper status codes for invalid apps and missing data
      [✅] Better exception handling and message validation

8. Fifth test run - Further Fixes
   a) App B:
      [✅] Unified MCP server error handling to always return 503 with proper message format
      [✅] Improved error message formatting for better test compatibility
   b) MCP Server:
      [✅] Moved error responses from HTTPException to direct return format
      [✅] Simplified error handling to match test expectations
      [✅] Changed error response structure to put 'error' at top level

9. Sixth test run - Final Fixes
   a) MCP Server:
      [✅] Restored HTTPException usage for proper status codes
      [✅] Maintained consistent error response structure
   b) App B Tests:
      [✅] Added mock for Claude API calls to avoid real API requests
      [✅] Updated test assertions to match expected behavior

10. Seventh test run - Error Response Fix
    a) MCP Server:
       [✅] Changed error response format to put 'error' at top level
       [✅] Added explicit status_code in response for FastAPI
       [✅] Simplified error handling across all endpoints
    b) Tests:
       [✅] All App A tests passing
       [✅] All App B tests passing
       [✅] Fixing remaining MCP Server test assertions

11. Eighth test run - Final Status Code Fix
    a) MCP Server:
       [✅] Added FastAPI Response parameter to endpoint
       [✅] Using response.status_code to set status explicitly
       [✅] Removed status_code from response body
       [✅] Maintained consistent error format across all responses
    b) Tests:
       [✅] Aiming for all tests to pass with proper status codes
       [✅] Error responses contain 'error' at top level
       [✅] Success responses maintain existing format

12. Final test run - SUCCESS
    [✅] All 15 tests passing
    [✅] All components working as expected:
       - App A: Proper email validation and MCP package building
       - App B: Successful polling and message processing
       - MCP Server: Correct error handling and message routing

13. Warning Fix
    [✅] Fixed deprecation warning in test_summarize_endpoint_invalid_json
    [✅] Updated test to use content= instead of data= parameter
    [✅] All tests now passing without any warnings

14. API Design Improvement
    [✅] Changed App B's poll endpoint from POST to GET method
    [✅] Updated tests to use GET for polling operations
    [✅] Fixed "Method Not Allowed" error for curl GET requests
    [✅] More RESTful design for polling operation

15. Configuration Centralization
    [✅] Created central config.py file
    [✅] Moved all port configurations to config
    [✅] Moved MCP server URL and endpoint configurations to config
    [✅] Updated App A to use config for ports and URLs
    [✅] Updated App B to use config for ports and URLs
    [✅] Updated MCP Server to use config for port
    [✅] Updated test_flow.py to use config for ports and URLs
    [✅] Updated main.py process management to use config ports

16. Documentation and Integration Testing
    [✅] Updated README with correct port configurations
    [✅] Added integration test for curl commands
    [✅] Verified end-to-end flow with running servers
    [✅] Improved error handling in App B for Claude API errors
    [✅] All configurations verified working through integration test

17. Code Structure Reorganization
    [✅] Created src directory for all application code
    [✅] Moved app_a, app_b, mcp_server into src
    [✅] Moved config.py and main.py into src
    [✅] Updated imports to reflect new structure
    [✅] Updated test files to use src paths
    [✅] Updated README with new directory structure

18. App C Integration - Multi-App Communication
    1. Initial Setup
       [ ] Create app_c directory structure in src
       [ ] Define App C's purpose and communication patterns
       [ ] Add App C's port to config.py
       [ ] Create basic FastAPI application structure

    2. MCP Server Updates
       [ ] Add AppC to VALID_APPS list
       [ ] Update inbox structure for multi-app messaging
       [ ] Add routing logic for AppC messages
       [ ] Update message delivery mechanism for multiple recipients

    3. App C Core Implementation
       [ ] Create mcp_handler.py with send/receive functions
       [ ] Implement message processing logic
       [ ] Add endpoints for communication
       [ ] Create llm_client.py if needed

    4. Testing Infrastructure
       [ ] Create test_app_c directory
       [ ] Write unit tests for App C functionality
       [ ] Add App C to integration tests
       [ ] Update existing tests for multi-app scenarios

    5. Documentation and Examples
       [ ] Update README with App C details
       [ ] Document new message routing patterns
       [ ] Add example flows between all apps
       [ ] Update running instructions

    6. Multi-App Communication
       [ ] Implement AppA → AppC communication
       [ ] Implement AppB → AppC communication
       [ ] Implement AppC → AppA communication
       [ ] Implement AppC → AppB communication

    7. Process Management
       [ ] Add App C to main.py startup
       [ ] Update test_flow.py for new app
       [ ] Test complete system with all apps
       [ ] Document any new dependencies
