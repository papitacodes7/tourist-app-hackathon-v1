# SafeTrail - Smart Tourist Safety Platform Prototype

SafeTrail is a high-fidelity interactive prototype demonstrating a comprehensive tourist safety solution with real-time monitoring, emergency response, and authority oversight capabilities.

## 🎯 Project Type: Interactive Prototype

This is a **fully functional prototype** showcasing:
- Complete user interface flows for tourists and authorities
- Interactive demonstrations of all planned features
- Professional-grade design system implementation
- Real map integration and geolocation services
- Comprehensive documentation and setup process

## 🚀 Prototype Features

### **Frontend (Fully Implemented)**
- **Tourist Dashboard**: Interactive interface with location display, safety metrics, and emergency features
- **Authority Dashboard**: Comprehensive monitoring system with tourist oversight and alert management
- **Authentication Flow**: Complete login/registration interfaces for both user types
- **Modern UI/UX**: Professional design with shadcn/ui components, responsive layouts, and smooth animations
- **Map Integration**: Real geolocation services using Leaflet maps
- **QR Code Generation**: Functional digital ID system
- **Multilingual Support**: English/Hindi language toggle
- **Mobile Responsive**: Optimized for all device sizes

### **Backend (Demo Implementation)**
- **Demo Server**: FastAPI-based simulation with mock data
- **API Structure**: Complete endpoint definitions ready for production
- **User Management**: Simulated authentication system
- **Data Models**: Comprehensive schemas for all entities
- **CORS Configuration**: Cross-origin setup for development

## 📋 Prerequisites

To run this prototype, you'll need:

### Required Software
- **Python 3.8+** (tested with Python 3.12)
- **Node.js 16+** (tested with Node.js 22.17.1)
- **npm** (comes with Node.js)

### Note
This prototype runs entirely on demo data and doesn't require external databases or complex setup.

## ⚙️ Configuration

### Demo Configuration (Pre-configured)

The prototype comes with pre-configured settings:

**Backend (.env)**:
```env
# Demo server configuration
CORS_ORIGINS=*
JWT_SECRET_KEY=demo-secret-key
HOST=127.0.0.1
PORT=8000
```

**Frontend (.env)**:
```env
# Backend API connection
VITE_BACKEND_URL=http://127.0.0.1:8000
```

All configuration is ready to run out-of-the-box for demonstration purposes.
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

## 🏃‍♂️ Running the Prototype

### Quick Start (2 Simple Steps)

1. **Start the Demo Backend Server:**
   ```bash
   cd backend
   python -m uvicorn demo_server:app --host 127.0.0.1 --port 8000 --reload
   ```
   
   You should see:
   ```
   ✅ Demo server started with test data!
   🔑 Demo Credentials:
      Tourist: tourist@demo.com / demo123
      Authority: authority@demo.com / demo123
   ```

2. **Start the Frontend (in a new terminal):**
   ```bash
   cd frontend
   npm install  # First time only
   npm run dev
   ```
   
   The application will open automatically at `http://localhost:3001`

### Alternative Setup Scripts

For convenience, you can also use:

**Windows:**
```bash
# PowerShell
.\start-app.ps1

# Command Prompt
start-app.bat
```

These scripts will automatically start both servers for you.

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

## 🔧 Technical Architecture

### Backend (Demo Server)
- **Framework**: FastAPI
- **Data Storage**: In-memory (no database required)
- **Mock Authentication**: Simulated JWT workflow
- **API Documentation**: Interactive docs at `/docs` endpoint

### Frontend (React Application)
- **Framework**: React 19
- **Build Tool**: Vite 7.1.5 (Modern ES Build Tool)
- **UI Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS 3.4.17
- **Maps**: Leaflet/React-Leaflet (mock data)
- **QR Codes**: react-qr-code
- **Icons**: Lucide React
- **Notifications**: Sonner

### Development Scripts

**Backend:**
```bash
# Start demo server (recommended)
python -m uvicorn demo_server:app --reload

# Run basic tests
python backend_test.py
```

**Frontend:**
```bash
# Start development server
npm run dev

# Build for demonstration
npm run build

# Preview production build
npm run preview
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

## 🔐 Prototype Security

**Important: This is a demonstration prototype**
- Demo credentials are hardcoded for easy testing
- Mock authentication simulates real JWT workflow
- Data is stored in memory only (resets on restart)
- Not intended for production deployment without major security enhancements

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
