import requests
import sys
import json
from datetime import datetime
import time

class SafeTrailAPITester:
    def __init__(self, base_url="https://safetourist-1.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tourist_token = None
        self.authority_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.tourist_id = None
        self.authority_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, token=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if token:
            headers['Authorization'] = f'Bearer {token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict) and len(str(response_data)) < 500:
                        print(f"   Response: {response_data}")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_init_demo_data(self):
        """Initialize demo data"""
        success, response = self.run_test(
            "Initialize Demo Data",
            "POST",
            "init-demo-data",
            200
        )
        return success

    def test_get_zones(self):
        """Test getting high-risk zones"""
        success, response = self.run_test(
            "Get High-Risk Zones",
            "GET",
            "zones",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} high-risk zones")
            for zone in response[:2]:  # Show first 2 zones
                print(f"   Zone: {zone.get('name', 'Unknown')} - Risk: {zone.get('risk_level', 'Unknown')}")
        return success

    def test_tourist_registration(self):
        """Test tourist registration"""
        tourist_data = {
            "email": "test_tourist@example.com",
            "password": "TestPass123!",
            "full_name": "Test Tourist",
            "role": "tourist",
            "phone": "+91-9876543210",
            "emergency_contact": "Emergency Contact",
            "emergency_phone": "+91-9876543211",
            "id_proof_number": "ID123456789"
        }
        
        success, response = self.run_test(
            "Tourist Registration",
            "POST",
            "auth/register",
            200,
            data=tourist_data
        )
        
        if success and 'access_token' in response:
            self.tourist_token = response['access_token']
            self.tourist_id = response['user']['id']
            print(f"   Tourist ID: {self.tourist_id}")
            return True
        return False

    def test_authority_registration(self):
        """Test authority registration"""
        authority_data = {
            "email": "test_authority@example.com",
            "password": "AuthPass123!",
            "full_name": "Test Authority",
            "role": "authority"
        }
        
        success, response = self.run_test(
            "Authority Registration",
            "POST",
            "auth/register",
            200,
            data=authority_data
        )
        
        if success and 'access_token' in response:
            self.authority_token = response['access_token']
            self.authority_id = response['user']['id']
            print(f"   Authority ID: {self.authority_id}")
            return True
        return False

    def test_demo_login(self):
        """Test login with demo credentials"""
        # Test tourist demo login
        tourist_login = {
            "email": "tourist@demo.com",
            "password": "demo123"
        }
        
        success, response = self.run_test(
            "Demo Tourist Login",
            "POST",
            "auth/login",
            200,
            data=tourist_login
        )
        
        if success and 'access_token' in response:
            self.tourist_token = response['access_token']
            self.tourist_id = response['user']['id']
            print(f"   Demo Tourist logged in successfully")
        
        # Test authority demo login
        authority_login = {
            "email": "authority@demo.com",
            "password": "demo123"
        }
        
        success2, response2 = self.run_test(
            "Demo Authority Login",
            "POST",
            "auth/login",
            200,
            data=authority_login
        )
        
        if success2 and 'access_token' in response2:
            self.authority_token = response2['access_token']
            self.authority_id = response2['user']['id']
            print(f"   Demo Authority logged in successfully")
        
        return success and success2

    def test_tourist_profile(self):
        """Test getting tourist profile"""
        if not self.tourist_token:
            print("❌ No tourist token available")
            return False
            
        success, response = self.run_test(
            "Get Tourist Profile",
            "GET",
            "tourist/profile",
            200,
            token=self.tourist_token
        )
        
        if success:
            print(f"   Digital ID: {response.get('digital_id', 'Not found')}")
            print(f"   Safety Score: {response.get('safety_score', 'Not found')}")
        
        return success

    def test_location_update(self):
        """Test location update and geo-fencing"""
        if not self.tourist_token or not self.tourist_id:
            print("❌ No tourist token/ID available")
            return False
        
        # Test location in Delhi (should trigger geo-fence alert)
        location_data = {
            "tourist_id": self.tourist_id,
            "latitude": 28.6644,  # Old Delhi Railway Station (high-risk zone)
            "longitude": 77.2198,
            "timestamp": datetime.now().isoformat()
        }
        
        success, response = self.run_test(
            "Update Location (High-Risk Zone)",
            "PUT",
            "tourist/location",
            200,
            data=location_data,
            token=self.tourist_token
        )
        
        if success:
            print("   Location updated - should trigger geo-fence alert")
        
        return success

    def test_panic_alert(self):
        """Test panic button functionality"""
        if not self.tourist_token:
            print("❌ No tourist token available")
            return False
        
        success, response = self.run_test(
            "Trigger Panic Alert",
            "POST",
            "tourist/panic",
            200,
            token=self.tourist_token
        )
        
        if success:
            print(f"   Panic alert created with ID: {response.get('alert_id', 'Unknown')}")
        
        return success

    def test_authority_dashboard(self):
        """Test authority dashboard"""
        if not self.authority_token:
            print("❌ No authority token available")
            return False
        
        success, response = self.run_test(
            "Get Authority Dashboard",
            "GET",
            "authority/dashboard",
            200,
            token=self.authority_token
        )
        
        if success:
            print(f"   Active Tourists: {response.get('tourists', 0)}")
            print(f"   Active Alerts: {response.get('active_alerts', 0)}")
            print(f"   High-Risk Zones: {len(response.get('high_risk_zones', []))}")
        
        return success

    def test_authority_alerts(self):
        """Test getting alerts for authority"""
        if not self.authority_token:
            print("❌ No authority token available")
            return False
        
        success, response = self.run_test(
            "Get Authority Alerts",
            "GET",
            "authority/alerts",
            200,
            token=self.authority_token
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} alerts")
            for alert in response[:3]:  # Show first 3 alerts
                print(f"   Alert: {alert.get('alert_type', 'Unknown')} - {alert.get('status', 'Unknown')}")
        
        return success

    def test_invalid_endpoints(self):
        """Test invalid endpoints and unauthorized access"""
        print("\n🔍 Testing Invalid Endpoints and Security...")
        
        # Test unauthorized access to tourist profile
        success, _ = self.run_test(
            "Unauthorized Tourist Profile Access",
            "GET",
            "tourist/profile",
            401  # Should return 401 Unauthorized
        )
        
        # Test unauthorized access to authority dashboard
        success2, _ = self.run_test(
            "Unauthorized Authority Dashboard Access",
            "GET",
            "authority/dashboard",
            401  # Should return 401 Unauthorized
        )
        
        # Test invalid login
        invalid_login = {
            "email": "invalid@example.com",
            "password": "wrongpassword"
        }
        
        success3, _ = self.run_test(
            "Invalid Login Credentials",
            "POST",
            "auth/login",
            401,  # Should return 401 Unauthorized
            data=invalid_login
        )
        
        return success and success2 and success3

def main():
    print("🚀 Starting SafeTrail API Testing...")
    print("=" * 60)
    
    tester = SafeTrailAPITester()
    
    # Test sequence
    tests = [
        ("Initialize Demo Data", tester.test_init_demo_data),
        ("Get High-Risk Zones", tester.test_get_zones),
        ("Demo User Login", tester.test_demo_login),
        ("Tourist Profile", tester.test_tourist_profile),
        ("Location Update & Geo-fencing", tester.test_location_update),
        ("Panic Alert", tester.test_panic_alert),
        ("Authority Dashboard", tester.test_authority_dashboard),
        ("Authority Alerts", tester.test_authority_alerts),
        ("Security & Invalid Access", tester.test_invalid_endpoints),
    ]
    
    # Run all tests
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        try:
            test_func()
        except Exception as e:
            print(f"❌ Test failed with exception: {str(e)}")
        
        # Small delay between tests
        time.sleep(0.5)
    
    # Print final results
    print(f"\n{'='*60}")
    print(f"📊 FINAL RESULTS")
    print(f"{'='*60}")
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%" if tester.tests_run > 0 else "No tests run")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed - check logs above")
        return 1

if __name__ == "__main__":
    sys.exit(main())