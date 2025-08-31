from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
import random
import hashlib

# In-memory storage (for demo purposes only)
users_db: Dict[str, Any] = {}
tourist_profiles_db: Dict[str, Any] = {}
alerts_db: Dict[str, Any] = {}
high_risk_zones_db: Dict[str, Any] = {}

# Create the main app
app = FastAPI(title="SafeTrail API", description="Smart Tourist Safety & Incident Response Platform")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()
SECRET_KEY = "safetrail-jwt-secret-key-2024-change-in-production"

# Models
class UserRole(str):
    TOURIST = "tourist"
    AUTHORITY = "authority"

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str

class UserCreate(UserBase):
    password: str
    phone: Optional[str] = None
    emergency_contact: Optional[str] = None
    emergency_phone: Optional[str] = None
    id_proof_number: Optional[str] = None

class User(UserBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_active: bool = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class TouristProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    digital_id: str = Field(default_factory=lambda: f"DT{random.randint(100000, 999999)}")
    safety_score: int = Field(default=85)
    current_location: Optional[dict] = None
    planned_itinerary: List[dict] = Field(default_factory=list)
    family_tracking_enabled: bool = False
    emergency_contacts: List[dict] = Field(default_factory=list)
    blockchain_hash: str = Field(default_factory=lambda: hashlib.sha256(str(uuid.uuid4()).encode()).hexdigest())
    trip_start_date: Optional[datetime] = None
    trip_end_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Alert(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    tourist_id: str
    alert_type: str
    message: str
    location: dict
    status: str = "active"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    resolved_at: Optional[datetime] = None
    authority_id: Optional[str] = None

class HighRiskZone(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    center_lat: float
    center_lng: float
    radius: float
    risk_level: str
    description: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LocationUpdate(BaseModel):
    tourist_id: str
    latitude: float
    longitude: float
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Utility functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user_data = users_db.get(user_id)
    if user_data is None:
        raise HTTPException(status_code=401, detail="User not found")
    return User(**user_data)

# Initialize demo data
def initialize_demo_data():
    # Create demo users
    demo_users = [
        {
            'id': str(uuid.uuid4()),
            'email': 'tourist@demo.com',
            'full_name': 'Demo Tourist',
            'role': 'tourist',
            'created_at': datetime.now(timezone.utc),
            'is_active': True,
            'hashed_password': hash_password('demo123')
        },
        {
            'id': str(uuid.uuid4()),
            'email': 'authority@demo.com',
            'full_name': 'Demo Authority Officer',
            'role': 'authority',
            'created_at': datetime.now(timezone.utc),
            'is_active': True,
            'hashed_password': hash_password('demo123')
        }
    ]
    
    # Store users in memory
    for user in demo_users:
        users_db[user['id']] = user
    
    # Create tourist profile for demo tourist
    tourist_user = next(user for user in demo_users if user['role'] == 'tourist')
    tourist_profile = {
        'id': str(uuid.uuid4()),
        'user_id': tourist_user['id'],
        'digital_id': 'DT123456',
        'safety_score': 85,
        'current_location': None,
        'planned_itinerary': [],
        'family_tracking_enabled': False,
        'emergency_contacts': [
            {
                'name': 'John Doe',
                'phone': '+91-9876543210',
                'relationship': 'Family Member'
            }
        ],
        'blockchain_hash': 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
        'trip_start_date': None,
        'trip_end_date': None,
        'created_at': datetime.now(timezone.utc)
    }
    
    tourist_profiles_db[tourist_profile['id']] = tourist_profile
    
    # Create demo high-risk zones
    demo_zones = [
        {
            'id': str(uuid.uuid4()),
            'name': 'Old Delhi Railway Station Area',
            'center_lat': 28.6644,
            'center_lng': 77.2198,
            'radius': 500,
            'risk_level': 'high',
            'description': 'High crime rate area near railway station',
            'created_at': datetime.now(timezone.utc)
        },
        {
            'id': str(uuid.uuid4()),
            'name': 'Chandni Chowk Narrow Lanes',
            'center_lat': 28.6507,
            'center_lng': 77.2334,
            'radius': 300,
            'risk_level': 'medium',
            'description': 'Crowded area with risk of pickpocketing',
            'created_at': datetime.now(timezone.utc)
        }
    ]
    
    for zone in demo_zones:
        high_risk_zones_db[zone['id']] = zone

# Authentication endpoints
@api_router.post("/auth/register", response_model=Token)
async def register_user(user_data: UserCreate):
    # Check if user already exists
    existing_user = next((u for u in users_db.values() if u['email'] == user_data.email), None)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_password = hash_password(user_data.password)
    
    # Create user
    user_dict = user_data.dict()
    del user_dict['password']
    user = User(**user_dict)
    user_doc = user.dict()
    user_doc['hashed_password'] = hashed_password
    
    users_db[user.id] = user_doc
    
    # Create tourist profile if role is tourist
    if user_data.role == UserRole.TOURIST:
        tourist_profile = TouristProfile(user_id=user.id)
        if user_data.emergency_contact and user_data.emergency_phone:
            tourist_profile.emergency_contacts = [{
                "name": user_data.emergency_contact,
                "phone": user_data.emergency_phone,
                "relationship": "Emergency Contact"
            }]
        tourist_profiles_db[tourist_profile.id] = tourist_profile.dict()
    
    # Generate token
    access_token = create_access_token(data={"sub": user.id})
    return Token(access_token=access_token, token_type="bearer", user=user)

@api_router.post("/auth/login", response_model=Token)
async def login_user(login_data: UserLogin):
    # Find user
    user_doc = next((u for u in users_db.values() if u['email'] == login_data.email), None)
    if not user_doc or not verify_password(login_data.password, user_doc['hashed_password']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user = User(**user_doc)
    
    # Generate token
    access_token = create_access_token(data={"sub": user.id})
    return Token(access_token=access_token, token_type="bearer", user=user)

# Tourist endpoints
@api_router.get("/tourist/profile", response_model=TouristProfile)
async def get_tourist_profile(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.TOURIST:
        raise HTTPException(status_code=403, detail="Access denied")
    
    profile_data = next((p for p in tourist_profiles_db.values() if p['user_id'] == current_user.id), None)
    if not profile_data:
        raise HTTPException(status_code=404, detail="Tourist profile not found")
    
    return TouristProfile(**profile_data)

@api_router.put("/tourist/location")
async def update_location(location_data: LocationUpdate, current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.TOURIST:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Update tourist location
    profile = next((p for p in tourist_profiles_db.values() if p['user_id'] == current_user.id), None)
    if profile:
        profile['current_location'] = {
            "latitude": location_data.latitude,
            "longitude": location_data.longitude,
            "timestamp": location_data.timestamp.isoformat()
        }
    
    return {"message": "Location updated successfully"}

@api_router.post("/tourist/panic")
async def trigger_panic_alert(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.TOURIST:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Get current location from profile
    profile = next((p for p in tourist_profiles_db.values() if p['user_id'] == current_user.id), None)
    if not profile or not profile.get('current_location'):
        raise HTTPException(status_code=400, detail="Location not available")
    
    # Create panic alert
    alert = Alert(
        tourist_id=current_user.id,
        alert_type="panic",
        message=f"PANIC BUTTON pressed by {current_user.full_name}",
        location=profile['current_location']
    )
    alerts_db[alert.id] = alert.dict()
    
    return {"message": "Panic alert sent successfully", "alert_id": alert.id}

# Authority endpoints
@api_router.get("/authority/dashboard")
async def get_authority_dashboard(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.AUTHORITY:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Get all tourists with locations
    tourists = [p for p in tourist_profiles_db.values() if p.get('current_location')]
    
    # Get recent alerts
    alerts = [a for a in alerts_db.values() if a['status'] == 'active']
    alerts.sort(key=lambda x: x['created_at'], reverse=True)
    alerts = alerts[:50]
    
    # Get high-risk zones
    zones = list(high_risk_zones_db.values())
    
    return {
        "tourists": len(tourists),
        "active_alerts": len(alerts),
        "tourist_locations": tourists,
        "recent_alerts": alerts,
        "high_risk_zones": zones
    }

@api_router.get("/authority/alerts", response_model=List[Alert])
async def get_alerts(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.AUTHORITY:
        raise HTTPException(status_code=403, detail="Access denied")
    
    alerts = list(alerts_db.values())
    alerts.sort(key=lambda x: x['created_at'], reverse=True)
    return [Alert(**alert) for alert in alerts[:100]]

@api_router.put("/authority/alerts/{alert_id}/resolve")
async def resolve_alert(alert_id: str, current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.AUTHORITY:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if alert_id in alerts_db:
        alerts_db[alert_id]['status'] = 'resolved'
        alerts_db[alert_id]['resolved_at'] = datetime.now(timezone.utc)
        alerts_db[alert_id]['authority_id'] = current_user.id
    
    return {"message": "Alert resolved successfully"}

# High-risk zones endpoints
@api_router.get("/zones", response_model=List[HighRiskZone])
async def get_high_risk_zones():
    zones = list(high_risk_zones_db.values())
    return [HighRiskZone(**zone) for zone in zones]

@api_router.post("/zones", response_model=HighRiskZone)
async def create_high_risk_zone(zone_data: HighRiskZone, current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.AUTHORITY:
        raise HTTPException(status_code=403, detail="Access denied")
    
    zone_dict = zone_data.dict()
    high_risk_zones_db[zone_data.id] = zone_dict
    return zone_data

# Include the router in the main app
app.include_router(api_router)

# Add health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "SafeTrail API is running",
        "version": "1.0.0",
        "deployment": "demo",
        "uptime": "server_running"
    }

# Add root endpoint for easy testing
@app.get("/")
async def root():
    return {
        "message": "Welcome to SafeTrail API - Smart Tourist Safety Platform",
        "docs": "/docs",
        "health": "/health", 
        "api": "/api",
        "demo_credentials": {
            "tourist": {"email": "tourist@demo.com", "password": "demo123"},
            "authority": {"email": "authority@demo.com", "password": "demo123"}
        }
    }

# Add deployment info endpoint
@app.get("/info")
async def deployment_info():
    import os
    return {
        "app_name": "SafeTrail",
        "version": "1.0.0",
        "deployment": "demo",
        "host": os.environ.get("HOST", "0.0.0.0"),
        "port": os.environ.get("PORT", 8000),
        "users_count": len(users_db),
        "zones_count": len(high_risk_zones_db),
        "alerts_count": len(alerts_db)
    }

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize demo data on startup
@app.on_event("startup")
async def startup_event():
    initialize_demo_data()
    print("✅ Demo server started with test data!")
    print("🔑 Test Credentials:")
    print("   Tourist: tourist@demo.com / demo123")
    print("   Authority: authority@demo.com / demo123")

if __name__ == "__main__":
    import uvicorn
    import os
    
    # Get host and port from environment variables or use defaults
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", 8000))
    
    uvicorn.run(app, host=host, port=port, reload=True)
