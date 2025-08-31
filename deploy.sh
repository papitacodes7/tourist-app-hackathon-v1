#!/bin/bash

# SafeTrail One-Click Deployment Script
# This script helps deploy SafeTrail to various platforms

echo "🚀 SafeTrail Deployment Helper"
echo "=============================="
echo ""

echo "Choose your deployment platform:"
echo "1) Railway.app (Recommended)"
echo "2) Render.com"
echo "3) Docker (Local/VPS)"
echo "4) View deployment guide"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🚂 Deploying to Railway.app"
        echo ""
        echo "1. Fork this repository to your GitHub account"
        echo "2. Go to https://railway.app and sign up with GitHub"
        echo "3. Click 'Deploy from GitHub repo' and select your fork"
        echo "4. Railway will automatically deploy using railway.toml configuration"
        echo "5. Your app will be available at: https://your-app-name.up.railway.app"
        echo ""
        echo "For detailed instructions, see DEPLOYMENT_GUIDE.md"
        ;;
    2)
        echo ""
        echo "🎨 Deploying to Render.com"
        echo ""
        echo "1. Fork this repository to your GitHub account"
        echo "2. Go to https://render.com and sign up"
        echo "3. Create a new Web Service and connect your repository"
        echo "4. Build command: cd backend && pip install -r requirements.txt"
        echo "5. Start command: cd backend && python -m uvicorn demo_server:app --host 0.0.0.0 --port \$PORT"
        echo ""
        echo "For detailed instructions, see DEPLOYMENT_GUIDE.md"
        ;;
    3)
        echo ""
        echo "🐳 Deploying with Docker"
        echo ""
        echo "Building and starting containers..."
        if command -v docker-compose &> /dev/null; then
            docker-compose up -d
            echo ""
            echo "✅ SafeTrail is now running!"
            echo "Backend: http://localhost:8000/docs"
            echo "Frontend: http://localhost:3000"
        else
            echo "❌ Docker Compose not found. Please install Docker first."
            echo "Visit: https://docs.docker.com/compose/install/"
        fi
        ;;
    4)
        echo ""
        echo "📖 Opening deployment guide..."
        if command -v code &> /dev/null; then
            code DEPLOYMENT_GUIDE.md
        elif command -v nano &> /dev/null; then
            nano DEPLOYMENT_GUIDE.md
        else
            cat DEPLOYMENT_GUIDE.md
        fi
        ;;
    *)
        echo ""
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎯 Demo Credentials:"
echo "Tourist: tourist@demo.com / demo123"
echo "Authority: authority@demo.com / demo123"
echo ""
echo "📚 Need help? Check DEPLOYMENT_GUIDE.md for detailed instructions!"