import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, MapPin, AlertCircle, Users, QrCode, Globe, ChevronRight, Star, Menu } from 'lucide-react';
import Logo from './Logo.jsx';
import { GradientBlurBg } from './ui/gradient-blur-bg.jsx';
import { Button } from './ui/button.jsx';

const LandingPage = () => {
  const [currentLang, setCurrentLang] = useState('en');
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      subtitle: 'स्मार्ट पर्यटक सुरक्षा और घटना प्रतिक्रिया प्लेटफॉRM',
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
    <GradientBlurBg className="overflow-hidden">
      {/* Navigation */}
      <nav
        className={`glass border-b border-white/30 sticky top-0 z-50 ${
          scrollY > 10 ? "shadow-lg bg-white/70 backdrop-blur-md" : ""
        }`}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left: Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center space-x-3 hover:scale-105 transition-all duration-300 px-2 py-1 rounded-lg hover:bg-white/20"
          >
            <div className="relative">
              <Shield className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SafeTrail
              </span>
              <div className="text-xs text-gray-500 font-medium">Tourist Safety</div>
            </div>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setCurrentLang(currentLang === "en" ? "hi" : "en")}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/50 hover:bg-white/70 transition-all"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">
                {currentLang === "en" ? "हिंदी" : "English"}
              </span>
            </button>

            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              {t.loginAs}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="w-7 h-7 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-200 animate-slide-down">
            <div className="flex flex-col items-center py-4 space-y-3">
              <button
                onClick={() => setCurrentLang(currentLang === "en" ? "hi" : "en")}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/70 hover:bg-white/90 transition-all"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {currentLang === "en" ? "हिंदी" : "English"}
                </span>
              </button>

              <Link
                to="/login"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.loginAs}
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-5xl mx-auto animate-fade-in">
          <div className="mb-8 animate-float flex justify-center">
            <Logo variant="hero" size="large" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            <span className="text-gradient">{t.title}</span>
          </h1>
          <h2 className="text-2xl md:text-3xl text-blue-600 font-semibold mb-8 animate-slide-in">
            {t.subtitle}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto animate-slide-in-right">
            {t.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in">
            <Button asChild size="lg" className="group px-8 py-4 md:px-10 md:py-5 text-base md:text-lg font-semibold">
              <Link to="/register" className="flex items-center space-x-3">
                <span>{t.getStarted}</span>
                <ChevronRight className="w-5 h-5 opacity-60 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>

            <div className="flex space-x-3">
              <Button asChild variant="outline" size="lg" className="px-6 py-3 md:px-8 md:py-4 rounded-full font-medium">
                <Link to="/login?role=tourist">
                  <Users className="w-4 h-4 mr-2" />
                  {t.tourist}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-6 py-3 md:px-8 md:py-4 rounded-full font-medium">
                <Link to="/login?role=authority">
                  <Shield className="w-4 h-4 mr-2" />
                  {t.authority}
                </Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-16 md:mt-24 max-w-5xl mx-auto">
          {[t.stats1, t.stats2, t.stats3, t.stats4].map((stat, index) => (
            <div key={index} className="stats-card p-4 md:p-8 card-hover" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2 md:mb-4">
                <Star className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 md:mb-3 icon-glow" />
              </div>
              <div className="text-xs md:text-sm font-semibold text-gray-700 tracking-wide">{stat}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-pattern">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12 md:mb-20">
            <span className="text-gradient">{t.features}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 max-w-7xl mx-auto">
            {[
              { icon: QrCode, title: t.digitalId, desc: t.digitalIdDesc },
              { icon: MapPin, title: t.realtimeMonitoring, desc: t.realtimeDesc },
              { icon: AlertCircle, title: t.emergencyResponse, desc: t.emergencyDesc },
              { icon: Users, title: t.authorityDashboard, desc: t.authorityDesc },
              { icon: Globe, title: t.multilingual, desc: t.multilingualDesc },
              { icon: Shield, title: t.aiPowered, desc: t.aiDesc },
            ].map((feature, index) => (
              <div key={index} className="feature-card p-6 md:p-10 card-hover animate-slide-in" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="mb-6 md:mb-8">
                  <feature.icon className="w-12 h-12 md:w-16 md:h-16 text-blue-600 mx-auto icon-glow" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-lg">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-28 bg-mesh relative overflow-hidden">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-6 md:mb-8">
            <span className="text-gradient">{t.howItWorks}</span>
          </h2>
          <p className="text-base md:text-lg text-gray-500 text-center max-w-2xl mx-auto mb-12 md:mb-20">
            A simple 4-step process to get started quickly
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 max-w-7xl mx-auto">
            {[
              { step: t.step1, desc: t.step1Desc },
              { step: t.step2, desc: t.step2Desc },
              { step: t.step3, desc: t.step3Desc },
              { step: t.step4, desc: t.step4Desc },
            ].map((item, index) => (
              <div
                key={index}
                className="group bg-white/70 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.25}s` }}
              >
                <div
                  className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 md:mb-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xl md:text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300"
                >
                  <span className="relative z-10">{index + 1}</span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-400 blur-md opacity-50 group-hover:opacity-80 transition" />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 md:mb-4">{item.step}</h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Flow */}
      <section className="py-16 md:py-24 hero-gradient text-grey relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 md:mb-16 animate-fade-in">{t.demoFlow}</h2>

          <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-6 max-w-6xl mx-auto">
            {[t.demoStep1, t.demoStep2, t.demoStep3, t.demoStep4].map((step, index) => (
              <React.Fragment key={index}>
                <div className="glass-dark rounded-2xl p-6 md:p-8 flex-1 animate-slide-in outline" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="text-base md:text-lg font-semibold leading-relaxed">{step}</div>
                </div>
                {index < 3 && (
                  <ChevronRight className="w-6 h-6 md:w-8 md:h-8 hidden md:block animate-pulse" />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="mt-12 md:mt-16 animate-fade-in">
            <Button asChild variant="" size="lg" className="group px-8 md:px-12 py-4 md:py-6 text-lg md:text-xl font-bold rounded-full">
              <Link to="/register" className="flex items-center space-x-3">
                <span>{t.getStarted}</span>
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 opacity-60 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 bg-gradient-to-r from-gray-900 to-slate-800 text-white relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-pattern opacity-20 pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-20">
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center space-x-3 md:space-x-4 mb-6 md:mb-8">
              <Logo variant="icon" context="footer" size="default" />
              <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{t.title}</span>
            </div>
            <p className="text-gray-300 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 md:space-x-8 mb-8 md:mb-12 relative z-30">
            <Button asChild variant="outline" size="lg" className="group px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-black border-white hover:bg-white hover:text-gray-900 hover:bg-blue-400 hover:text-white">
              <Link to="/register" className="flex items-center space-x-2">
                <Users className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base">{t.getStarted}</span>
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4 opacity-60 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="group px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-blue-800  hover:bg-blue-400 hover:text-white">
              <Link to="/login" className="flex items-center space-x-2">
                <Shield className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base">{t.loginAs}</span>
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4 opacity-60 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>

          <div className="text-center border-t border-gray-700 pt-6 md:pt-8 relative z-30">
            <div className="flex flex-wrap justify-center items-center space-x-4 md:space-x-6 text-xs md:text-sm text-gray-400">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-white transition-colors cursor-pointer flex items-center space-x-1 px-2 py-1 rounded select-none"
                type="button"
              >
                <span>Back to Top</span>
              </button>
              <span className="hidden sm:block pointer-events-none">•</span>
              <button
                onClick={() => setCurrentLang(currentLang === 'en' ? 'hi' : 'en')}
                className="hover:text-white transition-colors cursor-pointer flex items-center space-x-1 px-2 py-1 rounded select-none"
                type="button"
              >
                <Globe className="w-3 h-3 md:w-4 md:h-4" />
                <span>{currentLang === 'en' ? 'हिंदी' : 'English'}</span>
              </button>
              <span className="hidden sm:block pointer-events-none">•</span>
              <span className="text-gray-500 pointer-events-none">© 2025 SafeTrail. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </GradientBlurBg>
  );
};

export default LandingPage;
