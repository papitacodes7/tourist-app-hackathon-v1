#!/usr/bin/env python3

import asyncio
import os
import sys
from pathlib import Path

# Add the backend directory to the path
backend_dir = Path(__file__).parent / 'backend'
sys.path.insert(0, str(backend_dir))

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt
import uuid
from datetime import datetime, timezone

# Load environment variables
load_dotenv(backend_dir / '.env')

async def create_demo_users():
    # MongoDB connection
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    def hash_password(password: str) -> str:
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    # Demo users data
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
    
    try:
        # Clear existing demo users
        await db.users.delete_many({'email': {'$in': ['tourist@demo.com', 'authority@demo.com']}})
        await db.tourist_profiles.delete_many({'user_id': {'$in': [user['id'] for user in demo_users]}})
        
        # Insert demo users
        await db.users.insert_many(demo_users)
        
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
        
        await db.tourist_profiles.insert_one(tourist_profile)
        
        print("✅ Demo users created successfully!")
        print("Tourist: tourist@demo.com / demo123")
        print("Authority: authority@demo.com / demo123")
        
    except Exception as e:
        print(f"❌ Error creating demo users: {e}")
    
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(create_demo_users())