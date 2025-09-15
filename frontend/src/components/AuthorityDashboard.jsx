import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  MapPin, 
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  Filter,
  Download,
  LogOut,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { api, useAuth } from '../App.jsx';
import TouristMap from './TouristMap.jsx';
import Logo from './Logo.jsx';

const AuthorityDashboard = () => {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [alertFilter, setAlertFilter] = useState('all');

  useEffect(() => {
    fetchDashboardData();
    fetchAlerts();
    
    // Set up periodic refresh
    const interval = setInterval(() => {
      fetchDashboardData();
      fetchAlerts();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/authority/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    if (!alertsLoading) setAlertsLoading(true);
    
    try {
      const response = await api.get('/authority/alerts');
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast.error('Failed to load alerts');
    } finally {
      setAlertsLoading(false);
    }
  };

  const resolveAlert = async (alertId) => {
    try {
      await api.put(`/authority/alerts/${alertId}/resolve`);
      toast.success('Alert resolved successfully');
      fetchAlerts();
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast.error('Failed to resolve alert');
    }
  };

  const getAlertTypeIcon = (type) => {
    switch (type) {
      case 'panic': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'geo_fence': return <MapPin className="w-5 h-5 text-orange-600" />;
      case 'anomaly': return <TrendingUp className="w-5 h-5 text-yellow-600" />;
      case 'missing': return <XCircle className="w-5 h-5 text-purple-600" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAlertPriority = (type) => {
    switch (type) {
      case 'panic': return 'critical';
      case 'missing': return 'high';
      case 'geo_fence': return 'medium';
      case 'anomaly': return 'low';
      default: return 'low';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (alertFilter === 'all') return true;
    if (alertFilter === 'active') return alert.status === 'active';
    if (alertFilter === 'resolved') return alert.status === 'resolved';
    return alert.alert_type === alertFilter;
  });

  const generateMissingReport = () => {
    const missingAlerts = alerts.filter(alert => alert.alert_type === 'missing');
    toast.success(`Generated missing persons report with ${missingAlerts.length} cases`);
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
              <Logo variant="icon" context="panel" size="default" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">Authority Control Center</h1>
                <p className="text-sm text-gray-600">Welcome, {user.full_name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => { fetchDashboardData(); fetchAlerts(); }}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              
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
        {/* Navigation Tabs */}
        <div className="glass rounded-xl mb-8">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'map', label: 'Live Map', icon: MapPin },
              { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
              { id: 'reports', label: 'Reports', icon: Download }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  selectedTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass rounded-xl p-6 card-hover">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                  <span className="text-2xl font-bold text-gray-800">
                    {dashboardData?.tourists || 0}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800">Active Tourists</h3>
                <p className="text-sm text-gray-600">Currently being monitored</p>
              </div>

              <div className="glass rounded-xl p-6 card-hover">
                <div className="flex items-center justify-between mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  <span className="text-2xl font-bold text-gray-800">
                    {dashboardData?.active_alerts || 0}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800">Active Alerts</h3>
                <p className="text-sm text-gray-600">Requiring attention</p>
              </div>

              <div className="glass rounded-xl p-6 card-hover">
                <div className="flex items-center justify-between mb-4">
                  <MapPin className="w-8 h-8 text-green-600" />
                  <span className="text-2xl font-bold text-gray-800">
                    {dashboardData?.high_risk_zones?.length || 0}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800">Risk Zones</h3>
                <p className="text-sm text-gray-600">Monitored areas</p>
              </div>

              <div className="glass rounded-xl p-6 card-hover">
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle className="w-8 h-8 text-indigo-600" />
                  <span className="text-2xl font-bold text-gray-800">98.5%</span>
                </div>
                <h3 className="font-semibold text-gray-800">Response Rate</h3>
                <p className="text-sm text-gray-600">Last 24 hours</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h2>
              
              <div className="space-y-4">
                {alerts.slice(0, 5).map((alert) => (
                  <div key={alert.id} className="flex items-center space-x-4 p-4 bg-white/50 rounded-lg">
                    {getAlertTypeIcon(alert.alert_type)}
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{alert.message}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(alert.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      alert.status === 'active' ? 'bg-red-100 text-red-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {alert.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Live Map Tab */}
        {selectedTab === 'map' && (
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Live Tourist Monitoring</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>User Locations</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Other Tourists</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Alerts</span>
                </div>
              </div>
            </div>
            
            <div className="map-container h-96">
              <TouristMap 
                showTourists={true}
                showAlerts={true}
                showHighRiskZones={true}
                tourists={dashboardData?.tourist_locations || []}
                alerts={dashboardData?.recent_alerts || []}
                height="600px"
              />
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {selectedTab === 'alerts' && (
          <div className="space-y-6">
            {/* Alert Filters */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Alert Management</h2>
                <div className="flex items-center space-x-3">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <select
                    value={alertFilter}
                    onChange={(e) => setAlertFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Alerts</option>
                    <option value="active">Active Only</option>
                    <option value="resolved">Resolved Only</option>
                    <option value="panic">Panic Alerts</option>
                    <option value="geo_fence">Geo-fence Alerts</option>
                    <option value="anomaly">Anomaly Alerts</option>
                    <option value="missing">Missing Reports</option>
                  </select>
                </div>
              </div>

              {/* Alert List */}
              <div className="space-y-4">
                {alertsLoading ? (
                  <div className="text-center py-8">
                    <div className="spinner mx-auto"></div>
                  </div>
                ) : filteredAlerts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No alerts found</p>
                  </div>
                ) : (
                  filteredAlerts.map((alert) => (
                    <div key={alert.id} className={`p-6 rounded-xl border-l-4 ${
                      getAlertPriority(alert.alert_type) === 'critical' ? 'border-red-500 bg-red-50' :
                      getAlertPriority(alert.alert_type) === 'high' ? 'border-orange-500 bg-orange-50' :
                      getAlertPriority(alert.alert_type) === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                      'border-blue-500 bg-blue-50'
                    } bg-white/80`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          {getAlertTypeIcon(alert.alert_type)}
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-800">
                                {alert.alert_type.replace('_', ' ').toUpperCase()} ALERT
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                getAlertPriority(alert.alert_type) === 'critical' ? 'bg-red-100 text-red-800' :
                                getAlertPriority(alert.alert_type) === 'high' ? 'bg-orange-100 text-orange-800' :
                                getAlertPriority(alert.alert_type) === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {getAlertPriority(alert.alert_type)} priority
                              </span>
                            </div>
                            <p className="text-gray-700 mb-3">{alert.message}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{new Date(alert.created_at).toLocaleString()}</span>
                              </div>
                              {alert.location && (
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>
                                    {alert.location.latitude?.toFixed(4)}, {alert.location.longitude?.toFixed(4)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            alert.status === 'active' ? 'bg-red-100 text-red-800' :
                            alert.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {alert.status}
                          </span>
                          
                          {alert.status === 'active' && (
                            <button
                              onClick={() => resolveAlert(alert.id)}
                              className="btn-success px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Resolve</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {selectedTab === 'reports' && (
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Safety Reports & Analytics</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Generate Reports</h3>
                
                <button
                  onClick={generateMissingReport}
                  className="w-full btn-gradient text-white p-4 rounded-xl font-medium flex items-center justify-center space-x-3"
                >
                  <Download className="w-5 h-5" />
                  <span>Missing Persons Report</span>
                </button>

                <button className="w-full bg-white/70 text-gray-700 p-4 rounded-xl font-medium flex items-center justify-center space-x-3 hover:bg-white/90 transition-all">
                  <Download className="w-5 h-5" />
                  <span>Safety Incidents Summary</span>
                </button>

                <button className="w-full bg-white/70 text-gray-700 p-4 rounded-xl font-medium flex items-center justify-center space-x-3 hover:bg-white/90 transition-all">
                  <Download className="w-5 h-5" />
                  <span>Tourist Activity Log</span>
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Quick Stats</h3>
                
                <div className="bg-white/50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Today's Alerts</p>
                  <p className="text-2xl font-bold text-gray-800">{alerts.filter(alert => {
                    const today = new Date().toDateString();
                    return new Date(alert.created_at).toDateString() === today;
                  }).length}</p>
                </div>

                <div className="bg-white/50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Resolved This Week</p>
                  <p className="text-2xl font-bold text-green-600">
                    {alerts.filter(alert => alert.status === 'resolved').length}
                  </p>
                </div>

                <div className="bg-white/50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Average Response Time</p>
                  <p className="text-2xl font-bold text-blue-600">4.2 min</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorityDashboard;