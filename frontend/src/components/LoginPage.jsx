import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../App.jsx';
import { useAuth } from '../App.jsx';
import Logo from './Logo.jsx';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Get role from URL params if provided
  const roleFromUrl = searchParams.get('role');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post('/auth/login', formData);
      
      if (response.data.access_token) {
        login(response.data.access_token, response.data.user);
        
        // Redirect based on role
        if (response.data.user.role === 'tourist') {
          navigate('/tourist/dashboard');
        } else {
          navigate('/authority/dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.detail || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials helper
  const fillDemoCredentials = (role) => {
    if (role === 'tourist') {
      setFormData({
        email: 'tourist@demo.com',
        password: 'demo123'
      });
    } else {
      setFormData({
        email: 'authority@demo.com',
        password: 'demo123'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="glass rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Logo variant="icon" />
                <h2 className="text-2xl font-bold text-white">SafeTrail Login</h2>
              </div>
              <Link to="/" className="text-white/80 hover:text-white transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
            </div>
            <p className="text-blue-100 mt-2">
              {roleFromUrl === 'tourist' ? 'Tourist Portal' : 
               roleFromUrl === 'authority' ? 'Authority Portal' : 
               'Secure Access Portal'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-amber-800 mb-3">Demo Credentials</h4>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('tourist')}
                  className="block w-full text-left text-sm text-amber-700 hover:text-amber-900 transition-colors"
                >
                  <strong>Tourist:</strong> tourist@demo.com / demo123
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('authority')}
                  className="block w-full text-left text-sm text-amber-700 hover:text-amber-900 transition-colors"
                >
                  <strong>Authority:</strong> authority@demo.com / demo123
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gradient text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="spinner w-5 h-5"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Create one here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;