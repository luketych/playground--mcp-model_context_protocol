import uvicorn
import multiprocessing
import os
from pathlib import Path
from dotenv import load_dotenv
import signal
import sys

# Add the project root to PYTHONPATH
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables from .env file
env_path = Path('.env')
load_dotenv(env_path)

def run_server(module, port):
    uvicorn.run(module, host="127.0.0.1", port=port, reload=True)

def signal_handler(sig, frame):
    print("\nStopping all servers...")
    sys.exit(0)

if __name__ == "__main__":
    # Set up signal handling for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    
    # Start all three servers in separate processes
    servers = [
        ("mcp_server.app:app", 9002),
        ("app_a.app:app", 8002),
        ("app_b.app:app", 8003)
    ]
    
    processes = []
    for module, port in servers:
        process = multiprocessing.Process(
            target=run_server,
            args=(module, port)
        )
        process.start()
        processes.append(process)
        print(f"Started {module} on port {port}")
    
    try:
        # Wait for all processes to complete
        for process in processes:
            process.join()
    except KeyboardInterrupt:
        print("\nStopping all servers...")
        for process in processes:
            process.terminate()
        sys.exit(0)