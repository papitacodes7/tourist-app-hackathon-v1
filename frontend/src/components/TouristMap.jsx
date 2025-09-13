import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { api } from '../App.jsx';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const userIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="#3B82F6" stroke="white" stroke-width="4"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const touristIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#10B981" stroke="white" stroke-width="2"/>
      <path d="M12 8v8M8 12h8" stroke="white" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const alertIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="12" fill="#EF4444" stroke="white" stroke-width="4"/>
      <path d="M14 8v6M14 18h.01" stroke="white" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `),
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

// Component to update map center when userLocation changes
const MapUpdater = ({ userLocation }) => {
  const map = useMap();
  
  useEffect(() => {
    if (userLocation) {
      map.setView([userLocation.latitude, userLocation.longitude], map.getZoom());
    }
  }, [userLocation, map]);

  return null;
};

const TouristMap = ({ 
  userLocation, 
  showTourists = false, 
  showAlerts = false, 
  showHighRiskZones = true,
  tourists = [],
  alerts = [],
  height = "400px",
  center = null 
}) => {
  const [highRiskZones, setHighRiskZones] = useState([]);

  useEffect(() => {
    fetchHighRiskZones();
  }, []);

  const fetchHighRiskZones = async () => {
    try {
      const response = await api.get('/zones');
      setHighRiskZones(response.data);
    } catch (error) {
      console.error('Error fetching high-risk zones:', error);
    }
  };

  const getZoneColor = (riskLevel) => {
    switch (riskLevel) {
      case 'critical': return '#DC2626';
      case 'high': return '#EA580C';
      case 'medium': return '#D97706';
      case 'low': return '#65A30D';
      default: return '#6B7280';
    }
  };

  const getZoneOpacity = (riskLevel) => {
    switch (riskLevel) {
      case 'critical': return 0.3;
      case 'high': return 0.25;
      case 'medium': return 0.2;
      case 'low': return 0.15;
      default: return 0.1;
    }
  };

  // Default center (Delhi, India)
  const defaultCenter = center || userLocation || { latitude: 28.6139, longitude: 77.2090 };
  const mapCenter = [defaultCenter.latitude, defaultCenter.longitude];

  return (
    <div style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer
        center={mapCenter}
        zoom={userLocation ? 14 : 11}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {userLocation && <MapUpdater userLocation={userLocation} />}

        {/* User location marker */}
        {userLocation && (
          <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-blue-600 mb-1">Your Location</div>
                <div className="text-sm text-gray-600">
                  Lat: {userLocation.latitude.toFixed(6)}<br/>
                  Lng: {userLocation.longitude.toFixed(6)}
                </div>
                <div className="mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                  Live Tracking Active
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* High-risk zones */}
        {showHighRiskZones && highRiskZones.map((zone) => (
          <Circle
            key={zone.id}
            center={[zone.center_lat, zone.center_lng]}
            radius={zone.radius}
            pathOptions={{
              color: getZoneColor(zone.risk_level),
              fillColor: getZoneColor(zone.risk_level),
              fillOpacity: getZoneOpacity(zone.risk_level),
              weight: 2,
            }}
          >
            <Popup>
              <div>
                <div className="font-semibold text-gray-800 mb-2">{zone.name}</div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Risk Level:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      zone.risk_level === 'critical' ? 'bg-red-100 text-red-800' :
                      zone.risk_level === 'high' ? 'bg-orange-100 text-orange-800' :
                      zone.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {zone.risk_level.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Radius:</span> {zone.radius}m
                  </div>
                  <div className="mt-2 text-gray-600">
                    {zone.description}
                  </div>
                </div>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* Other tourists */}
        {showTourists && tourists.map((tourist) => (
          tourist.current_location && (
            <Marker
              key={tourist.id}
              position={[tourist.current_location.latitude, tourist.current_location.longitude]}
              icon={touristIcon}
            >
              <Popup>
                <div>
                  <div className="font-semibold text-gray-800 mb-1">Tourist</div>
                  <div className="text-sm text-gray-600">
                    ID: {tourist.digital_id}<br/>
                    Safety Score: {tourist.safety_score}/100
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Last seen: {new Date(tourist.current_location.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        ))}

        {/* Alert markers */}
        {showAlerts && alerts.map((alert) => (
          alert.location && (
            <Marker
              key={alert.id}
              position={[alert.location.latitude, alert.location.longitude]}
              icon={alertIcon}
            >
              <Popup>
                <div>
                  <div className="font-semibold text-red-600 mb-1">
                    {alert.alert_type.toUpperCase()} ALERT
                  </div>
                  <div className="text-sm text-gray-700 mb-2">
                    {alert.message}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(alert.created_at).toLocaleString()}
                  </div>
                  <div className={`mt-2 px-2 py-1 text-xs rounded ${
                    alert.status === 'active' ? 'bg-red-100 text-red-800' :
                    alert.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    Status: {alert.status.toUpperCase()}
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default TouristMap;