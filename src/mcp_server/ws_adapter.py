import socketio
from fastapi import FastAPI
from typing import Dict, Set, Optional, List
import asyncio
import json
from datetime import datetime
import uuid

from .router import inbox, VALID_APPS  # Import from existing MCP server router

# Create a Socket.IO server
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
socket_app = socketio.ASGIApp(sio)

# Store active clients
active_clients = set()
background_task = None

@sio.event
async def connect(sid, environ):
    """Handle client connection"""
    print(f"Client connected: {sid}")
    active_clients.add(sid)
    
    # Send welcome message
    await sio.emit('welcome', {
        'message': 'Connected to MCP Server',
        'clientId': sid,
        'timestamp': datetime.now().isoformat()
    }, room=sid)
    
    # Send initial system state
    await send_system_state(sid)
    
    # Log connection
    await broadcast_log({
        'level': 'INFO',
        'source': 'mcp',
        'message': f'Client {sid} connected',
        'type': 'system'
    })

@sio.event
async def disconnect(sid):
    """Handle client disconnection"""
    print(f"Client disconnected: {sid}")
    active_clients.discard(sid)
    
    # Log disconnection
    await broadcast_log({
        'level': 'INFO',
        'source': 'mcp',
        'message': f'Client {sid} disconnected',
        'type': 'system'
    })

@sio.event
async def init(sid, data):
    """Handle client initialization"""
    print(f"Client initialized: {sid}, data: {data}")
    await broadcast_log({
        'level': 'INFO',
        'source': 'web-ui',
        'message': f'Client initialized: {data}',
        'type': 'system'
    })

@sio.event
async def request_status(sid):
    """Handle status request"""
    await send_system_state(sid)

@sio.event
async def send_message(sid, data):
    """Handle message sending"""
    try:
        message = data.get('data', {})
        target = message.get('target')
        
        # Map frontend target names to backend app names
        target_map = {
            'app_a': 'AppA',
            'app_b': 'AppB',
            'app_c': 'AppC'
        }
        
        backend_target = target_map.get(target)
        if backend_target in VALID_APPS:
            # Create a unique message ID
            message_id = str(uuid.uuid4())
            
            # Prepare the message for the inbox
            mcp_message = {
                'id': message_id,
                'source': message.get('source', 'web-ui'),
                'target_app': backend_target,
                'content': message.get('content', {}),
                'timestamp': datetime.now().isoformat()
            }
            
            # Add to the appropriate inbox
            inbox[backend_target].append(mcp_message)
            
            # Broadcast the message event
            await sio.emit('message_sent', {
                'message': mcp_message
            })
            
            # Log the message
            await broadcast_log({
                'level': 'INFO',
                'source': mcp_message['source'],
                'target': target,
                'message': 'Message sent',
                'data': mcp_message,
                'type': 'message'
            })
            
            return {'status': 'success', 'message_id': message_id}
        else:
            return {'status': 'error', 'message': f'Invalid target: {target}'}
    except Exception as e:
        print(f"Error sending message: {e}")
        return {'status': 'error', 'message': str(e)}

async def send_system_state(sid):
    """Send current system state to a client"""
    # Convert app names to match frontend expectations
    nodes = [
        {'name': 'mcp', 'status': 'online', 'type': 'mcp', 'queueSize': 0},
        {'name': 'app_a', 'status': 'online', 'type': 'app', 'queueSize': len(inbox.get('AppA', []))},
        {'name': 'app_b', 'status': 'online', 'type': 'app', 'queueSize': len(inbox.get('AppB', []))},
        {'name': 'app_c', 'status': 'online', 'type': 'app', 'queueSize': len(inbox.get('AppC', []))},
        {'name': 'web-ui', 'status': 'online', 'type': 'ui', 'queueSize': 0}
    ]
    
    await sio.emit('system:status', {
        'nodes': nodes,
        'timestamp': datetime.now().isoformat()
    }, room=sid)

async def broadcast_system_event(event_type, data):
    """Broadcast system event to all clients"""
    event = {
        'type': event_type,
        **data,
        'timestamp': datetime.now().isoformat()
    }
    await sio.emit(event_type, event)

async def broadcast_log(log_entry):
    """Broadcast log entry to all clients"""
    log_entry['timestamp'] = log_entry.get('timestamp', datetime.now().isoformat())
    await sio.emit('log', log_entry)

async def monitor_system():
    """Background task to monitor system and send updates"""
    while True:
        try:
            if active_clients:
                # Convert app names to match frontend expectations
                nodes = [
                    {'name': 'mcp', 'status': 'online', 'type': 'mcp', 'queueSize': 0},
                    {'name': 'app_a', 'status': 'online', 'type': 'app', 'queueSize': len(inbox.get('AppA', []))},
                    {'name': 'app_b', 'status': 'online', 'type': 'app', 'queueSize': len(inbox.get('AppB', []))},
                    {'name': 'app_c', 'status': 'online', 'type': 'app', 'queueSize': len(inbox.get('AppC', []))},
                    {'name': 'web-ui', 'status': 'online', 'type': 'ui', 'queueSize': 0}
                ]
                
                await sio.emit('system:heartbeat', {
                    'nodes': nodes,
                    'timestamp': datetime.now().isoformat()
                })
        except Exception as e:
            print(f"Error in monitoring task: {e}")
        
        await asyncio.sleep(5)  # Update every 5 seconds

def setup_socketio(app: FastAPI):
    """Mount Socket.IO app to FastAPI app"""
    global background_task
    
    @app.on_event("startup")
    async def startup_event():
        # Start background monitoring task
        background_task = asyncio.create_task(monitor_system())
    
    @app.on_event("shutdown")
    async def shutdown_event():
        # Cancel background task
        if background_task:
            background_task.cancel()
    
    # Mount Socket.IO app
    app.mount("/socket.io", socket_app)
    
    return app
