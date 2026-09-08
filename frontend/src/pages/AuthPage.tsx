import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Info,
  CheckCircle2,
  Sparkles,
  Database,
  ArrowLeft
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signIn, signUp, signInWithDemo, isConfigured } = useAuth();

  const isSignUpInitial = location.pathname.includes('signup');
  const [mode, setMode] = useState<'signin' | 'signup'>(isSignUpInitial ? 'signup' : 'signin');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  useEffect(() => {
    if (location.pathname.includes('signup')) {
      setMode('signup');
    } else if (location.pathname.includes('signin') || location.pathname.includes('login')) {
      setMode('signin');
    }
  }, [location.pathname]);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter.');
        return;
      }
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    try {
      setSubmitting(true);
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMessage(error.message || 'Invalid email or password.');
        } else {
          navigate(from, { replace: true });
        }
      } else {
        const { error, message } = await signUp(email, password, fullName);
        if (error) {
          setErrorMessage(error.message || 'Failed to create account.');
        } else {
          if (message && message.includes('check your email')) {
            setInfoMessage(message);
          } else {
            navigate(from, { replace: true });
          }
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = (role: 'officer' | 'operator' | 'analyst') => {
    signInWithDemo(role);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-slate-900 font-sans antialiased selection:bg-slate-900 selection:text-white flex flex-col justify-between">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#fbfaf7]/90 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* CityFlow Logo */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="grid grid-cols-2 gap-1 w-6 h-6 p-0.5 rounded-md bg-white border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform">
              <span className="w-2 h-2 rounded-[2px] bg-emerald-500"></span>
              <span className="w-2 h-2 rounded-[2px] bg-indigo-600"></span>
              <span className="w-2 h-2 rounded-[2px] bg-amber-500"></span>
              <span className="w-2 h-2 rounded-[2px] bg-sky-500"></span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-[#0b132b] leading-none">
                  CityFlow
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                  v2.4
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-widest font-semibold text-slate-400 mt-1">
                Bengaluru Mesh OS
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-950 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      {/* Auth Card Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]">
        {/* Subtle Transit Background Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 1200 600" fill="none">
          <line x1="100" y1="80" x2="1100" y2="480" stroke="#3b82f6" strokeWidth="1.5" />
          <line x1="80" y1="520" x2="1120" y2="120" stroke="#10b981" strokeWidth="1.5" strokeDasharray="6 6" />
          <line x1="200" y1="300" x2="1000" y2="300" stroke="#f59e0b" strokeWidth="1" />
        </svg>

        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl relative z-10">
          {/* CityFlow Logo Header inside Card */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="grid grid-cols-2 gap-1 w-8 h-8 p-1 rounded-lg bg-white border border-slate-200 shadow-xs mb-3">
              <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500"></span>
              <span className="w-2.5 h-2.5 rounded-[2px] bg-indigo-600"></span>
              <span className="w-2.5 h-2.5 rounded-[2px] bg-amber-500"></span>
              <span className="w-2.5 h-2.5 rounded-[2px] bg-sky-500"></span>
            </div>

            {mode === 'signin' ? (
              <>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b132b] tracking-tight">
                  Welcome back
                </h1>
                <p className="text-xs text-slate-500 mt-1.5">
                  Sign in to continue to CityFlow
                </p>
              </>
            ) : (
              <>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b132b] tracking-tight">
                  Create your CityFlow account
                </h1>
                <p className="text-xs text-slate-500 mt-1.5">
                  Start using intelligent urban mobility tools.
                </p>
              </>
            )}
          </div>

          {/* Alerts */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {infoMessage && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-fadeIn">
              <Info className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Abhishek Sharma"
                  className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() =>
                      setInfoMessage('Password reset link is handled via your registered Supabase email address.')
                    }
                    className="text-[11px] font-semibold text-slate-500 hover:text-emerald-700 transition"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50/70 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-50/70 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-full bg-[#0b132b] hover:bg-slate-800 active:scale-95 text-white text-xs font-semibold transition shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Mode Switcher Link */}
          <div className="text-center mt-6 text-xs text-slate-600">
            {mode === 'signin' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage(null);
                    setInfoMessage(null);
                    navigate('/signup', { replace: true });
                  }}
                  className="font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage(null);
                    setInfoMessage(null);
                    navigate('/signin', { replace: true });
                  }}
                  className="font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

          {/* Quick One-Click Demo Access Box */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Quick Demo Access
              </span>
              <span className="text-[10px] text-emerald-700 font-mono font-medium">1-Click Sign In</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('officer')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition"
              >
                <div className="text-[11px] font-bold text-slate-800">Abhishek S.</div>
                <div className="text-[9px] text-slate-500 font-mono">Municipal Officer</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('operator')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition"
              >
                <div className="text-[11px] font-bold text-slate-800">Priya Nair</div>
                <div className="text-[9px] text-slate-500 font-mono">Transit Control</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('analyst')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition"
              >
                <div className="text-[11px] font-bold text-slate-800">Karthik R.</div>
                <div className="text-[9px] text-slate-500 font-mono">AI Mobility</div>
              </button>
            </div>
          </div>

          {/* Backend Info Pill */}
          <div className="mt-6 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Database: Supabase</span>
            <span className="text-emerald-700 font-semibold">
              {isConfigured ? '✓ Cloud Configured' : '⚡ Local Fallback'}
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-200/60 bg-[#fbfaf7] text-center text-xs text-slate-500 font-normal">
        © 2026 CityFlow Technologies Inc. Bengaluru Mesh OS.
      </footer>
    </div>
  );
};
