# SafeTrail Project Structure

## 📁 Directory Overview

```
Tourist-app-main/
├── backend/                    # Python FastAPI Backend
│   ├── .env                   # Backend environment variables
│   ├── server.py              # Main production server (requires MongoDB)
│   ├── demo_server.py         # Demo server with in-memory storage
│   └── requirements.txt       # Python dependencies
├── frontend/                   # React Frontend Application
│   ├── public/                # Static assets
│   ├── src/                   # Source code
│   │   ├── components/        # React components
│   │   │   ├── AuthorityDashboard.js
│   │   │   ├── LandingPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegistrationPage.js
│   │   │   ├── TouristDashboard.js
│   │   │   └── TouristMap.js
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility functions
│   │   ├── App.js             # Main App component
│   │   └── index.js           # Entry point
│   ├── .env                   # Frontend environment variables
│   ├── package.json           # Node.js dependencies
│   └── craco.config.js        # CRACO configuration
├── tests/                      # Test files
├── create_demo_users.py        # Script to create test users (MongoDB)
├── backend_test.py            # Backend API tests
├── start-app.ps1              # PowerShell quick start script
├── start-app.bat              # Batch quick start script
└── README.md                  # Main documentation
```

## 🔧 Key Files Explained

### Backend Files

- **`server.py`**: Production FastAPI server that requires MongoDB
- **`demo_server.py`**: Development server with in-memory storage (no MongoDB needed)
- **`requirements.txt`**: All Python dependencies for the FastAPI backend
- **`.env`**: Configuration for MongoDB connection and JWT secrets

### Frontend Files

- **`App.js`**: Main React application with routing and authentication context
- **`LoginPage.js`**: User authentication interface with demo credentials
- **`TouristDashboard.js`**: Dashboard for tourists with safety features
- **`AuthorityDashboard.js`**: Monitoring interface for authorities
- **`package.json`**: Node.js dependencies and build scripts
- **`.env`**: Frontend configuration including backend API URL

### Configuration Files

- **`craco.config.js`**: Custom webpack configuration for React
- **`tailwind.config.js`**: Tailwind CSS configuration
- **`postcss.config.js`**: PostCSS configuration

### Quick Start Scripts

- **`start-app.ps1`**: PowerShell script for Windows users
- **`start-app.bat`**: Batch script for traditional Windows command prompt

## 🏗️ Architecture

### Backend Architecture
```
FastAPI Server
├── Authentication (JWT)
├── User Management
├── Tourist Profiles
├── Emergency Alerts
├── Location Tracking
└── High-Risk Zone Management
```

### Frontend Architecture
```
React Application
├── Authentication Context
├── Protected Routes
├── Component Library (Radix UI)
├── Maps Integration (Leaflet)
├── Real-time Updates
└── Responsive Design (Tailwind CSS)
```

## 🔄 Data Flow

1. **Authentication**: JWT tokens for secure API access
2. **Tourist Flow**: Login → Dashboard → Location Updates → Emergency Features
3. **Authority Flow**: Login → Monitoring Dashboard → Alert Management
4. **Real-time Updates**: WebSocket connections for live data

## 🎨 Styling & UI

- **CSS Framework**: Tailwind CSS
- **Component Library**: Radix UI
- **Icons**: Lucide React
- **Maps**: Leaflet with React-Leaflet
- **Notifications**: Sonner toast notifications

## 🧪 Testing

- **Backend Tests**: pytest framework
- **Demo Data**: Automated demo user and zone creation
- **API Testing**: Built-in Swagger UI documentation

## 🚀 Deployment Notes

### Development
- Use `demo_server.py` for quick testing without database setup
- Frontend runs on port 3000, backend on port 8000
- Hot reload enabled for both servers

### Production
- Use `server.py` with proper MongoDB instance
- Configure environment variables securely
- Set up proper CORS policies
- Use production-grade web server (e.g., nginx + gunicorn)
