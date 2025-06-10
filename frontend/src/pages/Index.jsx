import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { 
  Wallet, 
  TrendingUp, 
  Shield, 
  BarChart3, 
  Menu, 
  X, 
  Star,
  ArrowRight,
  CheckCircle,
  Users,
  Clock,
  Award,
  Github,
  Linkedin,
  Twitter,
  Instagram
} from 'lucide-react';
import Dashboard from '../components/Dashboard';
import SignInModal from '../components/SignInModal';
import SignUpModal from '../components/SignUpModal';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const navigate = useNavigate();

  const handleLogin = () => {
    // console.log('handleLogin called');
    setIsLoginOpen(false); // Close the SignIn modal
    setIsLoggedIn(true);
    navigate('/dashboard');
    
    // console.log('Login successful, navigating to dashboard');
  };

  const handleSignUp = () => {
    setIsSignUpOpen(false); // Close modal on success
    // open the sign in modal
    setIsLoginOpen(true);
  };

  const handleSwitchToSignUp = () => {
    setIsSignUpOpen(true);
  };

  if (isLoggedIn) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-x-hidden">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.3); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        .animate-slide-up {
          animation: slideInUp 0.6s ease-out forwards;
        }
        .animate-fade-scale {
          animation: fadeInScale 0.8s ease-out forwards;
        }
        .glass-morphism {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .text-gradient {
          background: linear-gradient(135deg, #60a5fa, #a78bfa, #34d399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
      `}</style>

      {/* Navigation */}
      <nav className="glass-morphism fixed w-full z-50 px-4 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Wallet className="h-8 w-8 text-cyan-400" />
              <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-30"></div>
            </div>
            <span className="text-2xl font-bold text-gradient">
              Budgify
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-gray-300 hover:text-cyan-400 transition-all duration-300 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-gray-300 hover:text-cyan-400 transition-all duration-300 relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('benefits')}
              className="text-gray-300 hover:text-cyan-400 transition-all duration-300 relative group"
            >
              Benefits
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-300 hover:text-cyan-400 transition-all duration-300 relative group"
            >
              Contact Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              onClick={() => setIsLoginOpen(true)}
            >
              Sign In
            </Button>

            <Button 
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 animate-glow"
              onClick={() => setIsSignUpOpen(true)}
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white hover:text-cyan-400 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10 animate-slide-up">
            <div className="flex flex-col space-y-4 mt-4">
              <button onClick={() => scrollToSection('home')} className="text-gray-300 hover:text-cyan-400 transition-colors text-left">
                Home
              </button>
              <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-cyan-400 transition-colors text-left">
                Features
              </button>
              <button onClick={() => scrollToSection('benefits')} className="text-gray-300 hover:text-cyan-400 transition-colors text-left">
                Benefits
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-cyan-400 transition-colors text-left">
                Contact Us
              </button>
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                <Button
                  onClick={() => setIsLoginOpen(true)}
                  variant="ghost"
                  className="text-gray-300 hover:bg-white/10 justify-start"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => setIsSignUpOpen(true)}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 justify-start"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 px-4 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="animate-fade-scale">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-cyan-500/30 rounded-full px-4 py-2 mb-8">
              <span className="text-sm text-cyan-300">Trusted by 50,000+ users worldwide</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-gradient">Manage Finances</span>
              <br />
              <span className="text-white">Easily and</span> 
              <span className="text-gradient"> Smartly</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Budgify helps you control spending, track income, and manage savings with an intuitive financial dashboard.
            </p>
            
              <div>
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 animate-glow group"
                  onClick={() => setIsLoginOpen(true)}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-scale">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Powerful Features</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to take control of your financial future
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-morphism p-8 rounded-2xl text-center group hover-lift">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 p-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-gradient transition-all duration-300">
                Smart Analytics
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Get detailed insights into your spending patterns with interactive charts and reports.
              </p>
            </div>
            
            <div className="glass-morphism p-8 rounded-2xl text-center group hover-lift">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-500 p-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-gradient transition-all duration-300">
                Secure & Private
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Your financial data is encrypted and protected with bank-level security measures.
              </p>
            </div>
            
            <div className="glass-morphism p-8 rounded-2xl text-center group hover-lift">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-green-400 to-cyan-500 p-4 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-gradient transition-all duration-300">
                Real-time Tracking
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Monitor your expenses, income, and savings in real-time with instant updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-16 animate-fade-scale">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Why Choose Budgify?</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join thousands of users who've transformed their financial lives
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="glass-morphism p-6 rounded-2xl hover-lift">
              <CheckCircle className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
              <div className="text-4xl font-bold text-gradient mb-2">100%</div>
              <p className="text-gray-300">Free to Use</p>
            </div>
            <div className="glass-morphism p-6 rounded-2xl hover-lift">
              <Clock className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
              <div className="text-4xl font-bold text-gradient mb-2">24/7</div>
              <p className="text-gray-300">Access Anywhere</p>
            </div>
            <div className="glass-morphism p-6 rounded-2xl hover-lift">
              <Users className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
              <div className="text-4xl font-bold text-gradient mb-2">50K+</div>
              <p className="text-gray-300">Happy Users</p>
            </div>
            <div className="glass-morphism p-6 rounded-2xl hover-lift">
              <Award className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
              <div className="text-4xl font-bold text-gradient mb-2">99.9%</div>
              <p className="text-gray-300">Uptime</p>
            </div>
          </div>

          {/* Testimonial */}
          <div className="glass-morphism p-8 rounded-2xl max-w-4xl mx-auto hover-lift">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-xl md:text-2xl text-gray-300 italic mb-6">
              "Budgify completely changed how I manage money. I've saved more in 6 months than I did all last year!"
            </blockquote>
            <cite className="text-cyan-400 font-semibold">— Anuj Kumar, SDE at PW</cite>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-scale">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              <span className="text-gradient">Ready to Take Control?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Join thousands of users who are already managing their finances smarter with Budgify.
            </p>
            <Button 
              size="lg" 
              className="text-lg px-10 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 animate-glow"
              onClick={() => setIsSignUpOpen(true)}
            >
              Start Your Financial Journey
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="relative">
                <Wallet className="h-8 w-8 text-cyan-400" />
                <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-30"></div>
              </div>
              <span className="text-2xl font-bold text-gradient">Budgify</span>
            </div>
            <p className="text-gray-400 max-w-md mx-auto">
              Empowering individuals to achieve financial freedom through smart money management.
            </p>
            <div className="flex justify-center space-x-6 mt-6">
              <a href="https://github.com/AnuJ221011" target="_blank" rel="noopener noreferrer">
                <Github className="h-6 w-6 text-gray-400 hover:text-gray-300" />
              </a>
              <a href="https://www.linkedin.com/in/anuj-kum//" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-6 w-6 text-gray-400 hover:text-gray-300" />  
              </a>
              <a href="https://www.instagram.com/anujkumar_ak_official/" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-6 w-6 text-gray-400 hover:text-gray-300" />
              </a>
            </div>

          </div>
          
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-500">
              © 2025 Budgify | All rights reserved | Made with ❤️ by Anuj Kumar.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals for mobile and programmatic opening */}
      <SignInModal
        isOpen={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        onLogin={handleLogin}
        onSwitchToSignUp={handleSwitchToSignUp}
      />

      <SignUpModal
        isOpen={isSignUpOpen}
        onOpenChange={setIsSignUpOpen}
        onSignUp={handleSignUp}
        
      />
    </div>
  );
};

export default Index;