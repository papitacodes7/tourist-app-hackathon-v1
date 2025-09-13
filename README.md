# SafeTrail - Smart Tourist Safety & Incident Response Platform

SafeTrail is a comprehensive tourist safety application that provides real-time location tracking, emergency alerts, and safety monitoring for tourists and authorities.

## 🚀 Features

- **Tourist Dashboard**: Real-time location tracking, safety scores, and emergency panic button
- **Authority Dashboard**: Monitor tourists, manage alerts, and track high-risk zones
- **Authentication System**: Secure JWT-based login for tourists and authorities
- **Emergency Alerts**: Instant panic button and geo-fence violation alerts
- **High-Risk Zone Mapping**: Visual representation of dangerous areas
- **Family Tracking**: Enable family members to track tourist locations
- **Modern UI/UX**: Beautiful gradients, smooth animations, and responsive design
- **Theme Toggle**: Light and dark mode support for better accessibility
- **Performance Optimized**: Built with Vite for fast development and production builds

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

### Required Software
- **Python 3.8+** (tested with Python 3.12)
- **Node.js 16+** (tested with Node.js 22.17.1)
- **npm** (comes with Node.js)

### Optional (for production)
- **MongoDB** (for persistent data storage)
- **Docker** (for containerized MongoDB)

## � Configuration

The application uses environment variables for configuration.

### Backend Configuration (backend/.env)

```env
# Database Configuration
MONGO_URL=mongodb://localhost:27017
DB_NAME=safetrail_database

# Security Configuration
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRE_HOURS=24

# CORS Configuration (comma-separated origins)
CORS_ORIGINS=http://localhost:3001,http://127.0.0.1:3001

# Server Configuration
HOST=127.0.0.1
PORT=8000
DEBUG=true

# Application Mode
APP_MODE=demo  # Set to 'production' for MongoDB mode

# Email Configuration (for future features)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Logging
LOG_LEVEL=INFO
```

### Frontend Configuration (frontend/.env)

```env
# Backend API URL
VITE_BACKEND_URL=http://127.0.0.1:8000

# Application Configuration
VITE_APP_NAME=SafeTrail
VITE_APP_VERSION=1.0.0
VITE_APP_MODE=development

# Map Configuration
VITE_MAP_API_KEY=your-map-api-key-here
VITE_DEFAULT_MAP_CENTER_LAT=28.6139
VITE_DEFAULT_MAP_CENTER_LNG=77.2090

# Features Toggle
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_LOCATION_TRACKING=true

# Development Configuration
VITE_DEBUG=true
VITE_LOG_LEVEL=info
```

### Security Notes

- **JWT_SECRET_KEY**: Change this to a strong, unique secret key in production
- **CORS_ORIGINS**: Limit to specific domains in production, never use "*"
- **Database**: Use authentication and SSL in production MongoDB setups
- **Environment Files**: Never commit .env files to version control
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
   npm install
   ```

3. **Environment Configuration:**
   Update the `.env` file in the frontend directory:
   ```
   VITE_BACKEND_URL=http://127.0.0.1:8000
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
   npm run dev
   ```
   
   The Vite development server will start and automatically open your browser to `http://localhost:3001`.

### Option 2: Full Setup (with MongoDB)

For production-like environment with persistent data:

#### MongoDB Setup Options

**Option A: Using Docker (Recommended)**
```bash
# Pull and run MongoDB container
docker run -d -p 27017:27017 --name safetrail-mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  mongo:latest

# Verify MongoDB is running
docker ps | grep safetrail-mongodb
```

**Option B: Using Local MongoDB Installation**
```bash
# Install MongoDB Community Edition (varies by OS)
# For Windows: Download from https://www.mongodb.com/try/download/community
# For Ubuntu: sudo apt install mongodb
# For macOS: brew install mongodb/brew/mongodb-community

# Start MongoDB service
# Windows: net start MongoDB
# Linux/macOS: sudo systemctl start mongod
mongod --dbpath /path/to/your/data/directory
```

**Option C: Using MongoDB Atlas (Cloud)**
1. Create account at https://cloud.mongodb.com/
2. Create a free cluster
3. Get connection string
4. Update backend/.env file with your connection string

#### Environment Configuration

1. **Update Backend Environment:**
   Edit `backend/.env` file:
   ```env
   # Change from demo to production mode
   APP_MODE=production
   
   # Update MongoDB connection (choose one):
   # For local MongoDB:
   MONGO_URL=mongodb://localhost:27017
   
   # For MongoDB with authentication:
   MONGO_URL=mongodb://admin:password123@localhost:27017
   
   # For MongoDB Atlas:
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net
   
   # Update database name
   DB_NAME=safetrail_production
   ```

2. **Initialize Database with Demo Data:**
   ```bash
   cd backend
   python create_demo_users.py
   ```

3. **Start the Production Backend:**
   ```bash
   # Make sure you're in the backend directory
   cd backend
   
   # Start with production server.py instead of demo_server.py
   python -m uvicorn server:app --host 127.0.0.1 --port 8000 --reload
   ```

4. **Start the Frontend:**
   ```bash
   cd ../frontend
   npm run dev
   ```

#### Switching Between Demo and Production Modes

**To switch to Demo Mode:**
1. Update `backend/.env`: Set `APP_MODE=demo`
2. Start with: `python -m uvicorn demo_server:app --reload`

**To switch to Production Mode:**
1. Ensure MongoDB is running
2. Update `backend/.env`: Set `APP_MODE=production`
3. Run database initialization: `python create_demo_users.py`
4. Start with: `python -m uvicorn server:app --reload`

#### Troubleshooting MongoDB Setup

**Common Issues:**

1. **"MongoDB connection failed"**
   - Verify MongoDB is running: `docker ps` or `sudo systemctl status mongod`
   - Check connection string in .env file
   - Ensure firewall allows port 27017

2. **"Authentication failed"**
   - Verify username/password in connection string
   - For local MongoDB, you may need to create a user:
     ```bash
     mongosh
     use admin
     db.createUser({user:"admin", pwd:"password123", roles:["root"]})
     ```

3. **"Database not found"**
   - Database will be created automatically on first connection
   - Run `python create_demo_users.py` to populate initial data

**MongoDB Management Commands:**
```bash
# Connect to MongoDB shell
mongosh

# Show databases
show dbs

# Use SafeTrail database
use safetrail_production

# Show collections
show collections

# Query users
db.users.find()

# Drop database (careful!)
db.dropDatabase()
```

## 🌐 Accessing the Application

### Web Interface
- **Frontend URL**: http://localhost:3001
- **Backend API**: http://127.0.0.1:8000
- **API Documentation**: http://127.0.0.1:8000/docs (Swagger UI)

### Demo Accounts

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Tourist | `tourist@demo.com` | `demo123` | Access tourist dashboard with safety features |
| Authority | `authority@demo.com` | `demo123` | Access authority dashboard for monitoring |

## ⚡ Recent Updates & Modernization

### Frontend Modernization (September 2025)
- **Migration to Vite**: Upgraded from Create React App to Vite 7.1.5 for faster builds and HMR
- **React 19**: Updated to latest React version with modern features
- **Component Architecture**: Converted all components to `.jsx` extensions for better clarity
- **Performance**: Optimized animations and scroll behavior for smooth user experience
- **Theme System**: Added light/dark mode toggle with glassmorphic design
- **Build Optimization**: Improved build times and development experience

### Key Technical Improvements
- **ESLint Configuration**: Modern flat config with comprehensive rules
- **Tailwind CSS**: Latest version with custom component library integration
- **TypeScript Support**: Ready for future TypeScript adoption
- **Modern Bundling**: Tree-shaking and code-splitting optimizations

## 🔧 Development

### Backend Development
- **Framework**: FastAPI
- **Database**: MongoDB (production) / In-memory (demo)
- **Authentication**: JWT tokens
- **API Docs**: Available at `/docs` endpoint

### Frontend Development
- **Framework**: React 19
- **Build Tool**: Vite 7.1.5 (Modern ES Build Tool)
- **UI Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS 3.4.17
- **Maps**: Leaflet/React-Leaflet
- **QR Codes**: react-qr-code
- **Icons**: Lucide React
- **Notifications**: Sonner

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
npm run dev

# Alternative start command
npm start

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🐛 Troubleshooting

### Common Issues

1. **"MongoDB connection failed"**
   - Use the demo server: `python -m uvicorn demo_server:app --reload`
   - Or install and start MongoDB locally

2. **"Module not found" errors in frontend**
   - Run: `npm install`
   - Delete `node_modules` and `package-lock.json`, then reinstall
   - Ensure you're using Node.js 16+ for Vite compatibility

3. **CORS errors**
   - Ensure backend is running on port 8000
   - Check that frontend `.env` has correct `VITE_BACKEND_URL`

4. **Login fails**
   - Verify backend is running and accessible
   - Check browser console for network errors
   - Use demo credentials: `tourist@demo.com` / `demo123`

### Port Conflicts
- Backend default port: `8000`
- Frontend default port: `3001` (Vite auto-detects and uses next available)
- MongoDB default port: `27017`

If ports are occupied, modify the start commands:
```bash
# Backend on different port
python -m uvicorn demo_server:app --port 8001

# Frontend on different port (Vite will auto-increment if 3001 is busy)
npm run dev -- --port 3002
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
