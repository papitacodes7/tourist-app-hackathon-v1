# SafeTrail - Smart Tourist Safety & Incident Response Platform

SafeTrail is a comprehensive tourist safety application that provides real-time location tracking, emergency alerts, and safety monitoring for tourists and authorities.

## 🚀 Features

- **Tourist Dashboard**: Real-time location tracking, safety scores, and emergency panic button
- **Authority Dashboard**: Monitor tourists, manage alerts, and track high-risk zones
- **Authentication System**: Secure JWT-based login for tourists and authorities
- **Emergency Alerts**: Instant panic button and geo-fence violation alerts
- **High-Risk Zone Mapping**: Visual representation of dangerous areas
- **Family Tracking**: Enable family members to track tourist locations

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

### Required Software
- **Python 3.8+** (tested with Python 3.12)
- **Node.js 16+** (tested with Node.js 22.17.1)
- **npm** (comes with Node.js)

### Optional (for production)
- **MongoDB** (for persistent data storage)
- **Docker** (for containerized MongoDB)

## 🛠️ Installation & Setup

### Step 1: Clone/Download the Project
```bash
# If using git
git clone <repository-url>
cd Tourist-app-main

# Or download and extract the ZIP file
```

### Step 2: Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Environment Configuration:**
   The backend includes a `.env` file with the following configuration:
   ```
   MONGO_URL="mongodb://localhost:27017"
   DB_NAME="test_database"
   CORS_ORIGINS="*"
   JWT_SECRET_KEY="safetrail-jwt-secret-key-2024-change-in-production"
   ```

### Step 3: Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```
   > **Note:** Use `--legacy-peer-deps` flag to resolve dependency conflicts.

3. **Environment Configuration:**
   Update the `.env` file in the frontend directory:
   ```
   REACT_APP_BACKEND_URL=http://127.0.0.1:8000
   WDS_SOCKET_PORT=3000
   ```

## 🏃‍♂️ Running the Application

### Option 1: Quick Start (Demo Mode - Recommended)

For testing and development without MongoDB:

1. **Start the Demo Backend Server:**
   ```bash
   cd backend
   python -m uvicorn demo_server:app --host 127.0.0.1 --port 8000 --reload
   ```
   
   You should see:
   ```
   ✅ Demo server started with test data!
   🔑 Test Credentials:
      Tourist: tourist@demo.com / demo123
      Authority: authority@demo.com / demo123
   ```

2. **Start the Frontend Server (in a new terminal):**
   ```bash
   cd frontend
   npm start
   ```
   
   The React development server will start and automatically open your browser to `http://localhost:3000`.

### Option 2: Full Setup (with MongoDB)

For production-like environment with persistent data:

1. **Start MongoDB:**
   
   **Using Docker:**
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```
   
   **Using Local MongoDB Installation:**
   ```bash
   mongod --dbpath /path/to/your/data/directory
   ```

2. **Create Demo Users:**
   ```bash
   cd backend
   python create_demo_users.py
   ```

3. **Start the Production Backend:**
   ```bash
   python -m uvicorn server:app --host 127.0.0.1 --port 8000 --reload
   ```

4. **Start the Frontend:**
   ```bash
   cd ../frontend
   npm start
   ```

## 🌐 Accessing the Application

### Web Interface
- **Frontend URL**: http://localhost:3000
- **Backend API**: http://127.0.0.1:8000
- **API Documentation**: http://127.0.0.1:8000/docs (Swagger UI)

### Demo Accounts

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Tourist | `tourist@demo.com` | `demo123` | Access tourist dashboard with safety features |
| Authority | `authority@demo.com` | `demo123` | Access authority dashboard for monitoring |

## 🔧 Development

### Backend Development
- **Framework**: FastAPI
- **Database**: MongoDB (production) / In-memory (demo)
- **Authentication**: JWT tokens
- **API Docs**: Available at `/docs` endpoint

### Frontend Development
- **Framework**: React 19
- **Build Tool**: CRACO (Create React App Configuration Override)
- **UI Library**: Radix UI + Tailwind CSS
- **Maps**: Leaflet/React-Leaflet
- **QR Codes**: react-qr-code

### Available Scripts

**Backend:**
```bash
# Start development server
python -m uvicorn server:app --reload

# Start demo server (no MongoDB required)
python -m uvicorn demo_server:app --reload

# Run tests
pytest

# Code formatting
black .
isort .

# Linting
flake8
mypy .
```

**Frontend:**
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🐛 Troubleshooting

### Common Issues

1. **"MongoDB connection failed"**
   - Use the demo server: `python -m uvicorn demo_server:app --reload`
   - Or install and start MongoDB locally

2. **"Module not found" errors in frontend**
   - Run: `npm install --legacy-peer-deps --force`
   - Delete `node_modules` and `package-lock.json`, then reinstall

3. **CORS errors**
   - Ensure backend is running on port 8000
   - Check that frontend `.env` has correct `REACT_APP_BACKEND_URL`

4. **Login fails**
   - Verify backend is running and accessible
   - Check browser console for network errors
   - Use demo credentials: `tourist@demo.com` / `demo123`

### Port Conflicts
- Backend default port: `8000`
- Frontend default port: `3000`
- MongoDB default port: `27017`

If ports are occupied, modify the start commands:
```bash
# Backend on different port
python -m uvicorn demo_server:app --port 8001

# Frontend on different port
PORT=3001 npm start
```

## 🔐 Security Notes

- Demo credentials are for testing only
- Change `JWT_SECRET_KEY` in production
- Use environment variables for sensitive data
- Enable proper CORS configuration for production

## 📱 Usage Guide

### For Tourists
1. Register or login with tourist account
2. View your digital ID and safety score
3. Enable location tracking
4. Use panic button in emergencies
5. View your planned itinerary and family tracking options

### For Authorities
1. Login with authority account
2. Monitor tourist locations on the dashboard
3. Respond to active alerts
4. Manage high-risk zones
5. Resolve incidents and track safety metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For issues and questions:
- Check the troubleshooting section above
- Review API documentation at `/docs`
- Check browser console for frontend errors
- Verify both servers are running on correct ports
