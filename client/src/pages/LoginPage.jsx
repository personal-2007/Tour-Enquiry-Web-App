import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Compass,
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Shield,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Plane,
  Calendar,
  LogOut,
  MapPin,
} from 'lucide-react';

const LoginPage = ({ defaultTab = 'signin' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab); // 'signin' or 'signup'
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register, logout, user, isAuthenticated, isAdmin, isTraveler } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If URL has ?tab=register, switch to sign up tab
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'register' || location.pathname === '/register') {
      setActiveTab('signup');
    }
  }, [location]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!signInEmail.trim() || !signInPassword) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(signInEmail, signInPassword);
      if (res?.data?.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setSuccessMsg('Welcome back! You are successfully signed in.');
      }
    } catch (err) {
      console.error('Sign In error:', err);
      setErrorMsg(
        err.response?.data?.message || err.message || 'Invalid email or password. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (signUpPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters in length.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        phone: signUpPhone.trim(),
        password: signUpPassword,
      });
      setSuccessMsg('Account created successfully! Welcome to WanderFlow.');
    } catch (err) {
      console.error('Sign Up error:', err);
      setErrorMsg(
        err.response?.data?.message || err.message || 'Registration failed. Email may already be in use.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillTravelerDemo = () => {
    setActiveTab('signin');
    setSignInEmail('traveler@wanderflow.com');
    setSignInPassword('Traveler@123');
    setErrorMsg('');
  };

  const fillAdminDemo = () => {
    setActiveTab('signin');
    setSignInEmail('admin@wanderflow.com');
    setSignInPassword('Admin@123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Visual Brand Column */}
          <div className="lg:col-span-5 bg-gradient-to-br from-brand-900 via-brand-800 to-accent-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs font-semibold text-brand-200">
                <Sparkles className="w-3.5 h-3.5 text-accent-300" />
                <span>WanderFlow Traveler Access</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                  Unlock Seamless Global Adventures
                </h2>
                <p className="mt-3 text-xs sm:text-sm text-brand-100/90 leading-relaxed">
                  Sign in to manage your custom tour enquiries, track quotation statuses, and access curated private itineraries.
                </p>
              </div>

              {/* Highlight Perks */}
              <div className="space-y-3 pt-2 text-xs text-brand-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span>Direct updates on submitted tour quotations</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span>Instant access to 24/7 destination specialists</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span>Exclusive member packages and seasonal promotions</span>
                </div>
              </div>
            </div>

            {/* Bottom Admin Link Card */}
            <div className="relative z-10 pt-8 mt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="text-[11px] text-brand-200">
                  <span className="font-semibold block text-white">Tour Coordinator?</span>
                  Access the admin management portal
                </div>
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-accent-300" />
                  <span>Admin</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Authentication Form / Account Overview */}
          <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
            
            {/* If user is already authenticated */}
            {isAuthenticated ? (
              <div className="space-y-6">
                <div className="text-center sm:text-left">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/20 mb-4 mx-auto sm:mx-0">
                    <User className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Welcome Back, {user?.name || 'Traveler'}!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    You are currently logged in with {user?.email}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Account Role:</span>
                    <span className="font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full">
                      {isAdmin ? 'Administrator' : 'Verified Traveler'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Email:</span>
                    <span className="font-semibold text-slate-800">{user?.email}</span>
                  </div>
                  {user?.phone && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500 font-medium">Phone:</span>
                      <span className="font-semibold text-slate-800">{user?.phone}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  {isAdmin ? (
                    <Link
                      to="/admin/dashboard"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Go to Admin Dashboard</span>
                    </Link>
                  ) : (
                    <Link
                      to="/enquiry"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all"
                    >
                      <Plane className="w-4 h-4" />
                      <span>Plan a New Tour Enquiry</span>
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-slate-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              /* If not authenticated: Sign In & Sign Up Tabs */
              <div>
                {/* Tabs Switcher */}
                <div className="flex border-b border-slate-200 mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signin');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${
                      activeTab === 'signin'
                        ? 'border-brand-600 text-brand-600'
                        : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Traveler Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signup');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${
                      activeTab === 'signup'
                        ? 'border-brand-600 text-brand-600'
                        : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {/* Status Messages */}
                {errorMsg && (
                  <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2.5 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2.5 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* Sign In Form */}
                {activeTab === 'signin' && (
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          required
                          value={signInEmail}
                          onChange={(e) => setSignInEmail(e.target.value)}
                          placeholder="traveler@example.com"
                          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Password
                        </label>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type="password"
                          required
                          value={signInPassword}
                          onChange={(e) => setSignInPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 text-white font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer mt-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Sign Up Form */}
                {activeTab === 'signup' && (
                  <form onSubmit={handleSignUp} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={signUpName}
                          onChange={(e) => setSignUpName(e.target.value)}
                          placeholder="Alex Morgan"
                          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          required
                          value={signUpEmail}
                          onChange={(e) => setSignUpEmail(e.target.value)}
                          placeholder="alex.m@example.com"
                          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Phone Number (Optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          value={signUpPhone}
                          onChange={(e) => setSignUpPhone(e.target.value)}
                          placeholder="+1 (555) 789-0123"
                          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Password (Min 6 characters)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type="password"
                          required
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 text-white font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer mt-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Traveler Account</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Quick Auto-fill Helpers */}
                <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                  <p className="text-[11px] text-slate-500 mb-2 font-medium">
                    Quick test? Fill demo credentials:
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={fillTravelerDemo}
                      className="text-xs font-bold text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Traveler Demo (traveler@wanderflow.com)
                    </button>
                    <button
                      type="button"
                      onClick={fillAdminDemo}
                      className="text-xs font-bold text-accent-600 hover:text-accent-800 bg-accent-50 hover:bg-accent-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Admin Demo (admin@wanderflow.com)
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
