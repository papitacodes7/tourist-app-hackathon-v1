#!/usr/bin/env python3
"""
SafeTrail Production Server Launcher
This script helps launch SafeTrail for production deployment
"""

import os
import subprocess
import sys

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Error: Python 3.8+ is required")
        print(f"   Current version: {sys.version}")
        sys.exit(1)
    print(f"✅ Python version: {sys.version.split()[0]}")

def install_dependencies():
    """Install required dependencies"""
    print("📦 Installing dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully")
    except subprocess.CalledProcessError:
        print("❌ Failed to install dependencies")
        print("💡 Try installing manually: pip install -r requirements.txt")
        sys.exit(1)

def main():
    """Main launcher function"""
    print("🚀 SafeTrail Production Server Launcher")
    print("=" * 40)
    
    # Change to backend directory if not already there
    if not os.path.exists("requirements.txt"):
        if os.path.exists("backend/requirements.txt"):
            os.chdir("backend")
            print("📁 Changed to backend directory")
        else:
            print("❌ Error: Cannot find backend directory or requirements.txt")
            sys.exit(1)
    
    check_python_version()
    
    # Check if dependencies are installed
    try:
        import fastapi
        import uvicorn
        print("✅ Core dependencies available")
    except ImportError:
        print("📦 Installing missing dependencies...")
        install_dependencies()
    
    # Get configuration from environment or use defaults
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", 8000))
    
    print(f"🌐 Starting server on http://{host}:{port}")
    print("🔑 Demo Credentials:")
    print("   Tourist: tourist@demo.com / demo123")  
    print("   Authority: authority@demo.com / demo123")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("❤️  Health Check: http://localhost:8000/health")
    print("")
    print("Press Ctrl+C to stop the server")
    print("=" * 40)
    
    try:
        # Use demo_server for simple deployment
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "demo_server:app", 
            "--host", host,
            "--port", str(port)
        ])
    except KeyboardInterrupt:
        print("\n👋 Server stopped. Thanks for using SafeTrail!")
    except FileNotFoundError:
        print("❌ Error: demo_server.py not found")
        print("💡 Make sure you're in the backend directory")
        sys.exit(1)

if __name__ == "__main__":
    main()