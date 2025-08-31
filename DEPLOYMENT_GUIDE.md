# 🚀 SafeTrail Deployment Guide - Deploy for Free Worldwide Access

This guide helps you deploy the SafeTrail Tourist Safety App to free cloud platforms, making it accessible to users worldwide.

## 🌐 Quick Deployment Options

Choose any of these free platforms to deploy your app:

### Option 1: Railway.app (Recommended - Easy & Fast)

1. **Fork this repository** to your GitHub account
2. **Sign up at [Railway.app](https://railway.app)** with your GitHub account
3. **Create a new project** and connect your forked repository
4. **Deploy the backend:**
   - Railway will automatically detect the `railway.toml` configuration
   - The backend will be available at `https://your-app-name.up.railway.app`
5. **Deploy the frontend separately:**
   - Create another Railway service for the frontend
   - Set environment variable: `REACT_APP_BACKEND_URL=https://your-backend-url.up.railway.app`
   - Deploy from the `frontend` directory

### Option 2: Render.com (Free with SSL)

1. **Fork this repository** to your GitHub account
2. **Sign up at [Render.com](https://render.com)**
3. **Deploy the backend:**
   - Create new "Web Service" 
   - Connect your forked repository
   - Use build command: `cd backend && pip install -r requirements.txt`
   - Use start command: `cd backend && python -m uvicorn demo_server:app --host 0.0.0.0 --port $PORT`
4. **Deploy the frontend:**
   - Create new "Static Site"
   - Build command: `cd frontend && npm install --legacy-peer-deps && npm run build`
   - Publish directory: `frontend/build`
   - Add environment variable: `REACT_APP_BACKEND_URL=https://your-backend-url.onrender.com`

### Option 3: Fly.io (Global Edge Network)

1. **Install Fly CLI:** `curl -L https://fly.io/install.sh | sh`
2. **Sign up:** `fly auth signup`
3. **Deploy backend:**
   ```bash
   cd backend
   fly launch --copy-config --dockerfile ./Dockerfile
   fly deploy
   ```
4. **Deploy frontend separately on Vercel/Netlify (see below)**

### Option 4: Docker + Any VPS (DigitalOcean, AWS, etc.)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/tourist-app-hackathon-v1.git
   cd tourist-app-hackathon-v1
   ```

2. **Run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

3. **Access your app:**
   - Backend: http://your-server-ip:8000
   - Frontend: http://your-server-ip:3000

## 🌍 Frontend-Only Deployment (Netlify/Vercel)

For the frontend, you can use these free static hosting services:

### Netlify
1. **Sign up at [Netlify](https://netlify.com)**
2. **Connect your forked repository**
3. **Build settings:**
   - Build command: `cd frontend && npm install --legacy-peer-deps && npm run build`
   - Publish directory: `frontend/build`
   - Environment variable: `REACT_APP_BACKEND_URL=https://your-backend-url`

### Vercel
1. **Sign up at [Vercel](https://vercel.com)**
2. **Import your forked repository**
3. **Configure build:**
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Environment variable: `REACT_APP_BACKEND_URL=https://your-backend-url`

## 🔧 Configuration for Production

### Backend Environment Variables
Set these environment variables on your chosen platform:

```bash
HOST=0.0.0.0
PORT=8000  # Usually set automatically by the platform
CORS_ORIGINS=https://your-frontend-domain.com
JWT_SECRET_KEY=your-very-secure-secret-key-change-this
```

### Frontend Environment Variables
```bash
REACT_APP_BACKEND_URL=https://your-backend-domain.com
```

## 📋 Pre-Deployment Checklist

- [ ] Fork the repository to your GitHub account
- [ ] Choose your deployment platform
- [ ] Update JWT_SECRET_KEY for production
- [ ] Set CORS_ORIGINS to your frontend domain
- [ ] Test the deployment with demo credentials
- [ ] Update documentation with your deployed URLs

## 🎯 Demo Credentials

After deployment, users can test with:
- **Tourist:** `tourist@demo.com` / `demo123`
- **Authority:** `authority@demo.com` / `demo123`

## 🚨 Security Notes

- Change `JWT_SECRET_KEY` in production
- Set proper `CORS_ORIGINS` instead of "*"
- Consider adding rate limiting for production
- Use HTTPS for all deployments

## 📞 Support

If you encounter issues:
1. Check the deployment logs on your chosen platform
2. Verify environment variables are set correctly
3. Ensure the backend is accessible at `/docs` endpoint
4. Check CORS settings if frontend can't connect to backend

## 🎉 Success!

Once deployed, your SafeTrail app will be accessible worldwide:
- **Backend API:** `https://your-backend-domain.com/docs`
- **Frontend App:** `https://your-frontend-domain.com`

Users from anywhere in the world can now access your tourist safety application!