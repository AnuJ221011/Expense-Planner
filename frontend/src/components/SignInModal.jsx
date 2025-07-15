import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';

const SignInModal = ({
  isOpen,
  onOpenChange,
  onLogin,
  onSwitchToSignUp,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('https://expense-planner-ynxs.vercel.app/api/routes/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      onLogin();
      onOpenChange(false);
      setEmail('');
      setPassword('');
      setShowPassword(false);
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToSignUp = () => {
    onOpenChange(false);
    onSwitchToSignUp();
  };


  return (
    <>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="relative w-full max-w-md mx-auto bg-slate-900 border-2 border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden">

          {/* Gradient background overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/50 to-slate-900 opacity-95"></div>

          <div className="relative z-10 px-8 py-6">
            {/* Close Button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-2 right-3 text-white text-lg hover:text-red-400"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="text-center space-y-4 pb-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Welcome Back to Budgify
              </h2>
              <p className="text-gray-300 text-sm">Sign in to continue managing your finances</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-cyan-400" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20 transition-all duration-300 h-12 rounded-xl backdrop-blur-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4 text-cyan-400" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20 transition-all duration-300 h-12 pr-12 rounded-xl backdrop-blur-sm"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  <p className="text-sm text-red-400 text-center">{errorMsg}</p>
                </div>
              )}

              {/* Sign In Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group border-0"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <LogIn className="h-4 w-4" />
                    {loading ? 'Signing In...' : 'Sign In'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </Button>
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center space-x-4 pt-2">
                <div className="h-px bg-white/20 flex-1"></div>
                <span className="text-gray-400 text-sm">or</span>
                <div className="h-px bg-white/20 flex-1"></div>
              </div>

              {/* Switch to Sign Up */}
              <div className="text-center pt-4 border-t border-white/20">
                <p className="text-gray-300 text-sm">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={handleSwitchToSignUp}
                    className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200 hover:underline"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}
    </>
  );
}


export default SignInModal;
