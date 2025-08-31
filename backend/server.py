from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import hashlib
import bcrypt
import random

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="SafeTrail API", description="Smart Tourist Safety & Incident Response Platform")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "your-secret-key-change-in-production")

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
    alert_type: str  # panic, geo_fence, anomaly, missing
    message: str
    location: dict
    status: str = "active"  # active, resolved, investigating
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    resolved_at: Optional[datetime] = None
    authority_id: Optional[str] = None

class HighRiskZone(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    center_lat: float
    center_lng: float
    radius: float  # in meters
    risk_level: str  # low, medium, high, critical
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
    
    user = await db.users.find_one({"id": user_id})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return User(**user)

# Authentication endpoints
@api_router.post("/auth/register", response_model=Token)
async def register_user(user_data: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
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
    
    await db.users.insert_one(user_doc)
    
    # Create tourist profile if role is tourist
    if user_data.role == UserRole.TOURIST:
        tourist_profile = TouristProfile(user_id=user.id)
        if user_data.emergency_contact and user_data.emergency_phone:
            tourist_profile.emergency_contacts = [{
                "name": user_data.emergency_contact,
                "phone": user_data.emergency_phone,
                "relationship": "Emergency Contact"
            }]
        await db.tourist_profiles.insert_one(tourist_profile.dict())
    
    # Generate token
    access_token = create_access_token(data={"sub": user.id})
    return Token(access_token=access_token, token_type="bearer", user=user)

@api_router.post("/auth/login", response_model=Token)
async def login_user(login_data: UserLogin):
    # Find user
    user_doc = await db.users.find_one({"email": login_data.email})
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
    
    profile_data = await db.tourist_profiles.find_one({"user_id": current_user.id})
    if not profile_data:
        raise HTTPException(status_code=404, detail="Tourist profile not found")
    
    # Remove ObjectId before creating Pydantic model
    if '_id' in profile_data:
        del profile_data['_id']
    
    return TouristProfile(**profile_data)

@api_router.put("/tourist/location")
async def update_location(location_data: LocationUpdate, current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.TOURIST:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Update tourist location
    await db.tourist_profiles.update_one(
        {"user_id": current_user.id},
        {"$set": {"current_location": {
            "latitude": location_data.latitude,
            "longitude": location_data.longitude,
            "timestamp": location_data.timestamp.isoformat()
        }}}
    )
    
    # Check for geo-fence violations (simulate)
    high_risk_zones = await db.high_risk_zones.find().to_list(100)
    for zone in high_risk_zones:
        distance = calculate_distance(
            location_data.latitude, location_data.longitude,
            zone['center_lat'], zone['center_lng']
        )
        if distance <= zone['radius']:
            # Create geo-fence alert
            alert = Alert(
                tourist_id=current_user.id,
                alert_type="geo_fence",
                message=f"Tourist entered high-risk zone: {zone['name']}",
                location={
                    "latitude": location_data.latitude,
                    "longitude": location_data.longitude
                }
            )
            await db.alerts.insert_one(alert.dict())
    
    return {"message": "Location updated successfully"}

@api_router.post("/tourist/panic")
async def trigger_panic_alert(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.TOURIST:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Get current location from profile
    profile = await db.tourist_profiles.find_one({"user_id": current_user.id})
    if not profile or not profile.get('current_location'):
        raise HTTPException(status_code=400, detail="Location not available")
    
    # Create panic alert
    alert = Alert(
        tourist_id=current_user.id,
        alert_type="panic",
        message=f"PANIC BUTTON pressed by {current_user.full_name}",
        location=profile['current_location']
    )
    await db.alerts.insert_one(alert.dict())
    
    return {"message": "Panic alert sent successfully", "alert_id": alert.id}

# Authority endpoints
@api_router.get("/authority/dashboard")
async def get_authority_dashboard(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.AUTHORITY:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Get all active tourists with locations
    tourists_cursor = db.tourist_profiles.find(
        {"current_location": {"$exists": True}}
    )
    tourists_raw = await tourists_cursor.to_list(1000)
    
    # Convert to serializable format
    tourists = []
    for tourist in tourists_raw:
        # Remove MongoDB ObjectId and convert to dict
        if '_id' in tourist:
            del tourist['_id']
        tourists.append(tourist)
    
    # Get recent alerts
    alerts_cursor = db.alerts.find(
        {"status": "active"}
    ).sort("created_at", -1).limit(50)
    alerts_raw = await alerts_cursor.to_list(50)
    
    # Convert to serializable format
    alerts = []
    for alert in alerts_raw:
        if '_id' in alert:
            del alert['_id']
        alerts.append(alert)
    
    # Get high-risk zones
    zones_cursor = db.high_risk_zones.find()
    zones_raw = await zones_cursor.to_list(100)
    
    # Convert to serializable format
    zones = []
    for zone in zones_raw:
        if '_id' in zone:
            del zone['_id']
        zones.append(zone)
    
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
    
    alerts_cursor = db.alerts.find().sort("created_at", -1).limit(100)
    alerts_raw = await alerts_cursor.to_list(100)
    
    # Convert to Alert objects, removing ObjectId
    alerts = []
    for alert_data in alerts_raw:
        if '_id' in alert_data:
            del alert_data['_id']
        alerts.append(Alert(**alert_data))
    
    return alerts

@api_router.put("/authority/alerts/{alert_id}/resolve")
async def resolve_alert(alert_id: str, current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.AUTHORITY:
        raise HTTPException(status_code=403, detail="Access denied")
    
    await db.alerts.update_one(
        {"id": alert_id},
        {"$set": {
            "status": "resolved",
            "resolved_at": datetime.now(timezone.utc).isoformat(),
            "authority_id": current_user.id
        }}
    )
    
    return {"message": "Alert resolved successfully"}

# High-risk zones endpoints
@api_router.get("/zones", response_model=List[HighRiskZone])
async def get_high_risk_zones():
    zones_cursor = db.high_risk_zones.find()
    zones_raw = await zones_cursor.to_list(100)
    
    # Convert to HighRiskZone objects, removing ObjectId
    zones = []
    for zone_data in zones_raw:
        if '_id' in zone_data:
            del zone_data['_id']
        zones.append(HighRiskZone(**zone_data))
    
    return zones

@api_router.post("/zones", response_model=HighRiskZone)
async def create_high_risk_zone(zone_data: HighRiskZone, current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.AUTHORITY:
        raise HTTPException(status_code=403, detail="Access denied")
    
    zone_dict = zone_data.dict()
    await db.high_risk_zones.insert_one(zone_dict)
    return zone_data

# Utility function for distance calculation
def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two points in meters using Haversine formula"""
    import math
    
    R = 6371000  # Earth's radius in meters
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = (math.sin(delta_lat/2) * math.sin(delta_lat/2) +
         math.cos(lat1_rad) * math.cos(lat2_rad) *
         math.sin(delta_lon/2) * math.sin(delta_lon/2))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    return R * c

# Initialize demo data
@api_router.post("/init-demo-data")
async def initialize_demo_data():
    # Create demo high-risk zones for Delhi
    demo_zones = [
        HighRiskZone(
            name="Old Delhi Railway Station Area",
            center_lat=28.6644,
            center_lng=77.2198,
            radius=500,
            risk_level="high",
            description="High crime rate area near railway station"
        ),
        HighRiskZone(
            name="Chandni Chowk Narrow Lanes",
            center_lat=28.6507,
            center_lng=77.2334,
            radius=300,
            risk_level="medium",
            description="Crowded area with risk of pickpocketing"
        ),
        HighRiskZone(
            name="Yamuna River Bank",
            center_lat=28.6562,
            center_lng=77.2410,
            radius=800,
            risk_level="critical",
            description="Unsafe area especially during night hours"
        )
    ]
    
    # Clear existing zones
    await db.high_risk_zones.delete_many({})
    
    # Insert demo zones
    for zone in demo_zones:
        await db.high_risk_zones.insert_one(zone.dict())
    
    return {"message": "Demo data initialized successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()