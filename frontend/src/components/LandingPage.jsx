import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, MapPin, AlertCircle, Users, QrCode, Globe, ChevronRight, Star } from 'lucide-react';

const LandingPage = () => {
  const [currentLang, setCurrentLang] = useState('en');

  const translations = {
    en: {
      title: 'SafeTrail',
      subtitle: 'Smart Tourist Safety & Incident Response Platform',
      description: 'Ensuring real-time monitoring, emergency response, and secure identity verification for tourists using AI, Blockchain, and Geo-fencing technology.',
      getStarted: 'Get Started',
      loginAs: 'Login as',
      tourist: 'Tourist',
      authority: 'Authority',
      features: 'Features',
      digitalId: 'Digital Tourist ID',
      digitalIdDesc: 'Secure blockchain-based identity verification with QR codes for seamless travel experience.',
      realtimeMonitoring: 'Real-time Monitoring',
      realtimeDesc: 'AI-powered safety scoring and geo-fencing alerts for high-risk zones and anomaly detection.',
      emergencyResponse: 'Emergency Response',
      emergencyDesc: 'Instant panic button with live location sharing to nearest authorities and emergency contacts.',
      authorityDashboard: 'Authority Dashboard',
      authorityDesc: 'Comprehensive monitoring system with tourist heatmaps, alerts management, and incident response.',
      multilingual: 'Multilingual Support',
      multilingualDesc: 'Available in multiple Indian languages for better accessibility and user experience.',
      aiPowered: 'AI-Powered Insights',
      aiDesc: 'Smart anomaly detection for unusual behavior patterns, route deviations, and safety predictions.',
      howItWorks: 'How It Works',
      step1: '1. Register & Get Digital ID',
      step1Desc: 'Create your tourist profile and receive a secure digital ID with QR code.',
      step2: '2. Real-time Safety Monitoring',
      step2Desc: 'Your location is monitored with AI-powered safety scoring and geo-fence alerts.',
      step3: '3. Emergency Response',
      step3Desc: 'Use panic button for instant help or receive automated alerts for unusual activities.',
      step4: '4. Authority Dashboard',
      step4Desc: 'Authorities monitor all tourists, respond to alerts, and generate safety reports.',
      demoFlow: 'Demo Flow',
      demoStep1: 'Tourist Registration → Digital ID Generation',
      demoStep2: 'Geo-fence Alert when entering restricted zones',
      demoStep3: 'SOS Button → Real-time alert to authorities',
      demoStep4: 'Authority Dashboard receives location & responds',
      stats1: '500+ Tourists Protected',
      stats2: '50+ Authorities Connected',
      stats3: '99.9% Response Time',
      stats4: '24/7 Monitoring',
    },
    hi: {
      title: 'सेफट्रेल',
      subtitle: 'स्मार्ट पर्यटक सुरक्षा और घटना प्रतिक्रिया प्लेटफॉर्म',
      description: 'AI, ब्लॉकचेन और जियो-फेंसिंग तकनीक का उपयोग करके पर्यटकों के लिए वास्तविक समय की निगरानी, आपातकालीन प्रतिक्रिया और सुरक्षित पहचान सत्यापन सुनिश्चित करना।',
      getStarted: 'शुरू करें',
      loginAs: 'लॉगिन करें',
      tourist: 'पर्यटक',
      authority: 'प्राधिकरण',
      features: 'विशेषताएं',
      digitalId: 'डिजिटल पर्यटक पहचान',
      digitalIdDesc: 'निर्बाध यात्रा अनुभव के लिए QR कोड के साथ सुरक्षित ब्लॉकचेन-आधारित पहचान सत्यापन।',
      realtimeMonitoring: 'वास्तविक समय निगरानी',
      realtimeDesc: 'उच्च जोखिम वाले क्षेत्रों और विसंगति का पता लगाने के लिए AI-संचालित सुरक्षा स्कोरिंग और जियो-फेंसिंग अलर्ट।',
      emergencyResponse: 'आपातकालीन प्रतिक्रिया',
      emergencyDesc: 'निकटतम अधिकारियों और आपातकालीन संपर्कों के साथ लाइव स्थान साझाकरण के साथ तत्काल पैनिक बटन।',
      authorityDashboard: 'प्राधिकरण डैशबोर्ड',
      authorityDesc: 'पर्यटक हीटमैप, अलर्ट प्रबंधन और घटना प्रतिक्रिया के साथ व्यापक निगरानी प्रणाली।',
      multilingual: 'बहुभाषी समर्थन',
      multilingualDesc: 'बेहतर पहुंच और उपयोगकर्ता अनुभव के लिए कई भारतीय भाषाओं में उपलब्ध।',
      aiPowered: 'AI-संचालित अंतर्दृष्टि',
      aiDesc: 'असामान्य व्यवहार पैटर्न, मार्ग विचलन और सुरक्षा भविष्यवाणियों के लिए स्मार्ट विसंगति का पता लगाना।',
      howItWorks: 'यह कैसे काम करता है',
      step1: '१. पंजीकरण करें और डिजिटल पहचान प्राप्त करें',
      step1Desc: 'अपना पर्यटक प्रोफ़ाइल बनाएं और QR कोड के साथ एक सुरक्षित डिजिटल पहचान प्राप्त करें।',
      step2: '२. वास्तविक समय सुरक्षा निगरानी',
      step2Desc: 'AI-संचालित सुरक्षा स्कोरिंग और जियो-फेंस अलर्ट के साथ आपके स्थान की निगरानी की जाती है।',
      step3: '३. आपातकालीन प्रतिक्रिया',
      step3Desc: 'तत्काल सहायता के लिए पैनिक बटन का उपयोग करें या असामान्य गतिविधियों के लिए स्वचालित अलर्ट प्राप्त करें।',
      step4: '४. प्राधिकरण डैशबोर्ड',
      step4Desc: 'अधिकारी सभी पर्यटकों की निगरानी करते हैं, अलर्ट का जवाब देते हैं, और सुरक्षा रिपोर्ट तैयार करते हैं।',
      demoFlow: 'डेमो फ्लो',
      demoStep1: 'पर्यटक पंजीकरण → डिजिटल पहचान निर्माण',
      demoStep2: 'प्रतिबंधित क्षेत्रों में प्रवेश करते समय जियो-फेंस अलर्ट',
      demoStep3: 'SOS बटन → अधिकारियों को वास्तविक समय अलर्ट',
      demoStep4: 'प्राधिकरण डैशबोर्ड स्थान प्राप्त करता है और प्रतिक्रिया देता है',
      stats1: '500+ पर्यटक सुरक्षित',
      stats2: '50+ अधिकारी जुड़े',
      stats3: '99.9% प्रतिक्रिया समय',
      stats4: '24/7 निगरानी',
    }
  };

  const t = translations[currentLang];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="glass border-b border-white/30 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {t.title}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentLang(currentLang === 'en' ? 'hi' : 'en')}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/50 hover:bg-white/70 transition-all"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">{currentLang === 'en' ? 'हिंदी' : 'English'}</span>
              </button>
              
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                {t.loginAs}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-5xl mx-auto animate-fade-in">
          <div className="mb-8 animate-float">
            <Shield className="w-20 h-20 text-blue-600 mx-auto mb-6 icon-glow" />
          </div>
          <h1 className="text-6xl font-bold text-gray-800 mb-6">
            <span className="text-gradient">{t.title}</span>
          </h1>
          <h2 className="text-3xl text-blue-600 font-semibold mb-8 animate-slide-in">
            {t.subtitle}
          </h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto animate-slide-in-right">
            {t.description}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in">
            <Link
              to="/register"
              className="btn-gradient text-white px-10 py-5 rounded-2xl font-semibold text-lg flex items-center space-x-3 shadow-glow transform hover:scale-105 transition-all duration-300"
            >
              <span>{t.getStarted}</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
            
            <div className="flex space-x-3">
              <Link
                to="/login?role=tourist"
                className="px-8 py-4 glass-card text-gray-700 rounded-2xl font-medium hover:bg-white/95 transition-all shadow-lg interactive-element"
              >
                {t.tourist}
              </Link>
              <Link
                to="/login?role=authority"
                className="px-8 py-4 glass-card text-gray-700 rounded-2xl font-medium hover:bg-white/95 transition-all shadow-lg interactive-element"
              >
                {t.authority}
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 max-w-5xl mx-auto">
          {[t.stats1, t.stats2, t.stats3, t.stats4].map((stat, index) => (
            <div key={index} className="stats-card p-8 card-hover" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="text-3xl font-bold text-blue-600 mb-4">
                <Star className="w-8 h-8 mx-auto mb-3 icon-glow" />
              </div>
              <div className="text-sm font-semibold text-gray-700 tracking-wide">{stat}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-pattern">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center text-gray-800 mb-20">
            <span className="text-gradient">{t.features}</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {[
              { icon: QrCode, title: t.digitalId, desc: t.digitalIdDesc },
              { icon: MapPin, title: t.realtimeMonitoring, desc: t.realtimeDesc },
              { icon: AlertCircle, title: t.emergencyResponse, desc: t.emergencyDesc },
              { icon: Users, title: t.authorityDashboard, desc: t.authorityDesc },
              { icon: Globe, title: t.multilingual, desc: t.multilingualDesc },
              { icon: Shield, title: t.aiPowered, desc: t.aiDesc },
            ].map((feature, index) => (
              <div key={index} className="feature-card p-10 card-hover animate-slide-in" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="mb-8">
                  <feature.icon className="w-16 h-16 text-blue-600 mx-auto icon-glow" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-mesh">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center text-gray-800 mb-20">
            <span className="text-gradient">{t.howItWorks}</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
            {[
              { step: t.step1, desc: t.step1Desc },
              { step: t.step2, desc: t.step2Desc },
              { step: t.step3, desc: t.step3Desc },
              { step: t.step4, desc: t.step4Desc },
            ].map((item, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-8 shadow-glow animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">{item.step}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Flow */}
      <section className="py-24 hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-16 animate-fade-in">{t.demoFlow}</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8 max-w-6xl mx-auto">
            {[t.demoStep1, t.demoStep2, t.demoStep3, t.demoStep4].map((step, index) => (
              <React.Fragment key={index}>
                <div className="glass-dark rounded-2xl p-8 flex-1 animate-slide-in" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="text-lg font-semibold leading-relaxed">{step}</div>
                </div>
                {index < 3 && (
                  <ChevronRight className="w-8 h-8 hidden md:block animate-pulse" />
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div className="mt-16 animate-fade-in">
            <Link
              to="/register"
              className="btn-success text-white px-12 py-6 rounded-2xl font-bold text-xl inline-flex items-center space-x-3 shadow-glow-success transform hover:scale-105 transition-all duration-300"
            >
              <span>{t.getStarted}</span>
              <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-gradient-to-r from-gray-900 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-20"></div>
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <Shield className="w-10 h-10 text-blue-400 icon-glow" />
            <span className="text-3xl font-bold text-gradient">{t.title}</span>
          </div>
          <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
          <div className="flex justify-center space-x-8">
            <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
              {t.getStarted}
            </Link>
            <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
              {t.loginAs}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;