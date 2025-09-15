import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  MapPin, 
  AlertTriangle, 
  Phone, 
  Users, 
  QrCode, 
  Activity,
  Clock,
  Navigation,
  Settings,
  LogOut,
  Wifi
} from 'lucide-react';
import { toast } from 'sonner';
import { api, useAuth } from '../App.jsx';
import QRCode from 'react-qr-code';
import TouristMap from './TouristMap.jsx';
import Logo from './Logo.jsx';

const TouristDashboard = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [locationStatus, setLocationStatus] = useState('offline');
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    fetchProfile();
    startLocationTracking();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/tourist/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const startLocationTracking = () => {
    if (navigator.geolocation) {
      setLocationStatus('searching');
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setCurrentLocation(location);
          updateLocation(location);
          setLocationStatus('online');
          
          // Start watching position
          navigator.geolocation.watchPosition(
            (position) => {
              const newLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              };
              setCurrentLocation(newLocation);
              updateLocation(newLocation);
            },
            (error) => {
              console.error('Location error:', error);
              setLocationStatus('offline');
            },
            { enableHighAccuracy: true, maximumAge: 30000, timeout: 10000 }
          );
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationStatus('offline');
          toast.error('Location access denied. Some features may be limited.');
        }
      );
    } else {
      setLocationStatus('offline');
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  const updateLocation = async (location) => {
    try {
      await api.put('/tourist/location', {
        tourist_id: user.id,
        latitude: location.latitude,
        longitude: location.longitude
      });
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const triggerPanicAlert = async () => {
    if (!currentLocation) {
      toast.error('Location not available. Please enable location services.');
      return;
    }

    try {
      const response = await api.post('/tourist/panic');
      toast.success('🚨 PANIC ALERT SENT! Authorities have been notified.');
      
      // Show alert confirmation
      setTimeout(() => {
        toast.success('Emergency services are on their way. Stay calm and stay visible.');
      }, 2000);
      
    } catch (error) {
      console.error('Error sending panic alert:', error);
      toast.error('Failed to send panic alert. Please try again or call emergency services.');
    }
  };

  const toggleFamilyTracking = async () => {
    try {
      const newStatus = !profile.family_tracking_enabled;
      // Update in backend (would need API endpoint)
      setProfile({
        ...profile,
        family_tracking_enabled: newStatus
      });
      toast.success(`Family tracking ${newStatus ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update family tracking');
    }
  };

  const getSafetyScoreColor = (score) => {
    if (score >= 80) return 'safety-score-excellent';
    if (score >= 60) return 'safety-score-good';
    if (score >= 40) return 'safety-score-fair';
    return 'safety-score-poor';
  };

  const getSafetyScoreText = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="glass border-b border-white/30 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Logo variant="icon" context="dashboard" size="default" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">Tourist Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.full_name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium ${
                locationStatus === 'online' ? 'bg-green-100 text-green-800' :
                locationStatus === 'searching' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                <Wifi className="w-4 h-4" />
                <span className="capitalize">{locationStatus}</span>
              </div>
              
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Safety Status */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Safety Status</h2>
                <div className={`px-6 py-3 rounded-full text-white font-semibold ${getSafetyScoreColor(profile.safety_score)}`}>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>{profile.safety_score}% - {getSafetyScoreText(profile.safety_score)}</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Current Zone</p>
                      <p className="font-semibold text-gray-800">Safe Zone</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-semibold text-green-600">Active</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-6 h-6 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Last Update</p>
                      <p className="font-semibold text-gray-800">Just now</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Map */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Live Location & Safety Zones</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Navigation className="w-4 h-4" />
                  <span>Real-time tracking</span>
                </div>
              </div>
              
              <div className="map-container h-96">
                {currentLocation ? (
                  <TouristMap 
                    userLocation={currentLocation}
                    showHighRiskZones={true}
                    height="384px"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-100 rounded-xl">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Location access required for map features</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Emergency Actions */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Emergency Actions</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={triggerPanicAlert}
                  className="btn-danger p-6 rounded-xl font-semibold text-lg flex items-center justify-center space-x-3"
                >
                  <AlertTriangle className="w-6 h-6" />
                  <span>PANIC BUTTON</span>
                </button>

                <button
                  onClick={() => window.open('tel:112')}
                  className="btn-warning p-6 rounded-xl font-semibold text-lg flex items-center justify-center space-x-3"
                >
                  <Phone className="w-6 h-6" />
                  <span>Call Emergency (112)</span>
                </button>
              </div>

              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Emergency Protocol:</strong> Panic button sends your live location to nearby authorities. 
                  Stay calm, stay visible, and wait for help to arrive.
                </p>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Digital Tourist ID */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Digital Tourist ID</h3>
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <QrCode className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{user.full_name.charAt(0)}</span>
                  </div>
                  <h4 className="font-semibold text-gray-800">{user.full_name}</h4>
                  <p className="text-sm text-gray-600">ID: {profile.digital_id}</p>
                </div>

                {showQR && (
                  <div className="mt-4 p-4 bg-white rounded-lg">
                    <div className="flex justify-center">
                      <QRCode 
                        value={JSON.stringify({
                          id: profile.digital_id,
                          name: user.full_name,
                          blockchain_hash: profile.blockchain_hash,
                          valid_until: profile.trip_end_date
                        })}
                        size={150}
                      />
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Blockchain Hash: {profile.blockchain_hash.substring(0, 16)}...
                    </p>
                  </div>
                )}

                <div className="text-xs text-gray-600">
                  <p><strong>Valid Until:</strong> {profile.trip_end_date || 'Not set'}</p>
                  <p><strong>Safety Score:</strong> {profile.safety_score}/100</p>
                </div>
              </div>
            </div>

            {/* Family Tracking */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Family Tracking</h3>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-700">Share location with family</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.family_tracking_enabled}
                    onChange={toggleFamilyTracking}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {profile.family_tracking_enabled && (
                <div className="space-y-2">
                  {profile.emergency_contacts.map((contact, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 bg-white/50 rounded-lg">
                      <Users className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{contact.name}</p>
                        <p className="text-xs text-gray-600">{contact.phone}</p>
                      </div>
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Alerts */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Alerts</h3>
              
              <div className="space-y-3">
                <div className="alert-low p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Safe Zone Entered</p>
                      <p className="text-xs text-gray-600">2 minutes ago</p>
                    </div>
                  </div>
                </div>

                <div className="alert-medium p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Crowded Area Warning</p>
                      <p className="text-xs text-gray-600">1 hour ago</p>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    View All Alerts
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristDashboard;