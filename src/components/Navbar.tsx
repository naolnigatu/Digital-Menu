import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, SubscriptionPlan } from '../types';
import { 
  ChefHat, Coffee, QrCode, Shield, Utensils, CreditCard, Globe, Wifi, WifiOff, Bell, LogOut, User, RefreshCw,
  PlusCircle, Lock, Mail, Building2, Landmark, HelpCircle, Check, ArrowRight, AlertTriangle, Bike, Heart
} from 'lucide-react';
import { signInWithGoogle, logOut } from '../lib/firebase';

export default function Navbar() {
  const { 
    currentUser, 
    login, 
    logout, 
    tenants, 
    activeTenantId, 
    setActiveTenantId,
    currentLanguage,
    setLanguage,
    logs,
    addLog,
    registerTenant,
    signUpOwnerOnly,
    setCurrentView,
    notifications,
    markNotificationRead,
    deleteNotification
  } = useApp();

  const [simulatedOffline, setSimulatedOffline] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGoogleLoadingSignUp, setIsGoogleLoadingSignUp] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [localNotice, setLocalNotice] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const showNotice = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setLocalNotice({ text, type });
  };

  // Clear notice whenever the tab changes
  const [activeModalTab, setActiveModalTab] = useState<'signin' | 'signup' >('signin');
  useEffect(() => {
    setLocalNotice(null);
  }, [activeModalTab]);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [signupOwnerName, setSignupOwnerName] = useState('');
  const [signupOwnerEmail, setSignupOwnerEmail] = useState('');
  const [signupBusinessName, setSignupBusinessName] = useState('');
  const [signupCurrency, setSignupCurrency] = useState<'USD' | 'ETB'>('ETB');
  const [signupPlan, setSignupPlan] = useState<SubscriptionPlan>('free');

  const activeTenant = tenants.find(t => t.id === activeTenantId) || tenants[0];

  // List of easy login targets for evaluation
  

  const handleRoleSelect = (email: string) => {
    if (email === 'guest@menuflow.com') {
      logout(); // Clears user context, placing in customer mode
      logOut().catch(console.error); // Also logout from Firebase if any
    } else {
      login(email);
    }
    setShowRoleModal(false);
    
    // Play optional browser tick sound if desired
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      // Ignored browser audio policy
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      const user = await signInWithGoogle();
      if (user.email) {
        const success = login(user.email);
        if (success) {
          setShowRoleModal(false);
        } else {
          // Instead of failing and logging out, let's ask if they want to register their business brand!
          const registerInstead = window.confirm(
            `The Google account (${user.email}) is not registered yet.\n\n` +
            `Would you like to register a brand new restaurant or coffee brand using this Google account?`
          );
          if (registerInstead) {
            setSignupOwnerEmail(user.email);
            setSignupOwnerName(user.displayName || 'Google User');
            setActiveModalTab('signup');
          } else {
            await logOut();
          }
        }
      }
    } catch (error: any) {
      console.error(error);
      const isConfigError = error?.message?.includes('API key') || error?.code?.includes('api-key') || error?.message?.includes('invalid-api-key');
      if (isConfigError) {
        showNotice("Firebase is not fully configured (missing API key). Please use 'Demo Accounts' tab below to log in instantly!", "error");
      } else if (error?.code !== 'auth/popup-closed-by-user') {
        showNotice(`Google Sign-In Error: ${error?.message || 'Check network or try again.'}`, "error");
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsGoogleLoadingSignUp(true);
      const user = await signInWithGoogle();
      if (user.email) {
        const alreadyRegistered = login(user.email);
        if (alreadyRegistered) {
          showNotice(`Welcome back! Logging you in with ${user.email}...`, "success");
          setTimeout(() => setShowRoleModal(false), 1500);
        } else {
          signUpOwnerOnly(user.displayName || 'Google User', user.email);
          showNotice(`Authenticated successfully! Welcome to MenuFlow, ${user.displayName || 'Owner'}. Let's create your business profile!`, "success");
          setTimeout(() => setShowRoleModal(false), 2000);
        }
      }
    } catch (error: any) {
      console.error(error);
      const isConfigError = error?.message?.includes('API key') || error?.code?.includes('api-key') || error?.message?.includes('invalid-api-key');
      if (isConfigError) {
        showNotice("Firebase is not fully configured. Please register your brand by filling out the email/name fields manually below!", "info");
      } else if (error?.code !== 'auth/popup-closed-by-user') {
        showNotice(`Google Authentication Error: ${error?.message || 'Please fill in details manually.'}`, "error");
      }
    } finally {
      setIsGoogleLoadingSignUp(false);
    }
  };

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;
    setIsEmailLoading(true);
    setTimeout(() => {
      const success = login(loginEmail);
      setIsEmailLoading(false);
      if (success) {
        setShowRoleModal(false);
        setLoginEmail('');
        setLoginPassword('');
      } else {
        showNotice(`The email "${loginEmail}" is not registered yet. Switch to "Owner Sign Up" above to register!`, "error");
      }
    }, 600);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupOwnerName || !signupOwnerEmail) {
      showNotice("Please fill in all the required fields.", "error");
      return;
    }
    setIsSignUpLoading(true);
    setTimeout(() => {
      signUpOwnerOnly(signupOwnerName, signupOwnerEmail);
      setIsSignUpLoading(false);
      showNotice(`Success! Your platform owner account has been created. Let's create your business profile!`, "success");
      setTimeout(() => {
        setShowRoleModal(false);
        setSignupOwnerName('');
        setSignupOwnerEmail('');
      }, 2000);
    }, 800);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-2 sm:px-4 lg:px-8">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <div 
            onClick={() => {
              logout();
              window.location.hash = '';
              window.location.reload();
            }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-sm cursor-pointer hover:opacity-90"
            title="Go to Landing Page"
          >
            M
          </div>
          <div className="flex items-center gap-1 sm:gap-2.5 min-w-0">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span 
                  onClick={() => {
                    logout();
                    window.location.hash = '';
                    window.location.reload();
                  }}
                  className="font-sans font-extrabold text-base tracking-tight text-slate-900 cursor-pointer hover:opacity-80 truncate"
                >
                  MenuFlow
                </span>
                <span className="hidden rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-extrabold text-slate-500 lg:inline-block uppercase tracking-wider">PWA SaaS</span>
              </div>
              <p className="hidden text-[10px] font-bold text-slate-400 lg:block uppercase tracking-wide">
                {currentUser?.role === 'super_admin' ? 'Platform Central' : `${activeTenant?.name}`}
              </p>
            </div>
            <span className="hidden px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-extrabold rounded uppercase tracking-wider lg:inline-block">
              Operational
            </span>
          </div>
        </div>

        {/* Action Controls & Info */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          
          {/* Simulated PWA Offline Toggle */}
          <button 
            id="nav-offline-btn"
            onClick={() => {
              setSimulatedOffline(!simulatedOffline);
              addLog('PWA Simulation', `Offline simulator toggled to ${!simulatedOffline ? 'OFFLINE' : 'ONLINE'}`);
            }}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-200 ${
              simulatedOffline 
                ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-transparent'
            }`}
            title="Simulate Progressive Web App Offline/No-WiFi capability"
          >
            {simulatedOffline ? (
              <>
                <WifiOff className="h-3.5 w-3.5 animate-pulse text-amber-600" />
                <span className="hidden lg:inline">PWA Offline Mode</span>
              </>
            ) : (
              <>
                <Wifi className="h-3.5 w-3.5 text-emerald-600" />
                <span className="hidden lg:inline">PWA Live Sync</span>
              </>
            )}
          </button>



          {/* Quick Real-Time Notifications */}
          <div className="relative">
                        <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-customer-dashboard'))}
              className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-rose-500 transition-colors mr-2"
              title="My Favorites"
            >
              <Heart className="h-5 w-5" />
            </button>
            <button 
              id="nav-notif-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
            >
              <Bell className="h-5 w-5" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-100 bg-white p-3 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-3">
                <div className="mb-2 flex items-center justify-between border-b border-slate-50 pb-2">
                  <span className="text-xs font-bold text-slate-800">Operational Alerts</span>
                  <button 
                    onClick={() => notifications.forEach(n => deleteNotification(n.id))}
                    className="text-[10px] text-slate-400 hover:text-slate-600 font-semibold"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <p className="py-4 text-center text-xs font-medium text-slate-400">No active alerts. All quiet!</p>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif.id} className={`flex gap-2 rounded-lg p-2 text-[11px] leading-relaxed cursor-pointer transition-colors ${notif.read ? 'bg-white text-slate-500' : 'bg-slate-50 text-slate-700 font-medium'}`} onClick={() => markNotificationRead(notif.id)}>
                        {!notif.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 mt-1.5"></span>}
                        <div className="flex-1">
                          <p>{notif.message}</p>
                          <span className="text-[9px] text-slate-400 mt-0.5 block">{new Date(notif.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }} className="text-slate-400 hover:text-red-500 ml-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Role Changer, Log In / Register & Active User Indicator */}
          {!currentUser ? (
            <button 
              id="nav-login-btn"
              onClick={() => setCurrentView('login')}
              className="flex items-center gap-1 sm:gap-1.5 rounded-lg bg-indigo-600 text-white px-2 sm:px-3.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-extrabold hover:bg-indigo-700 transition-colors cursor-pointer shadow-sm"
            >
              <User className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Log In / Register</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                id="nav-role-switcher"
                onClick={() => {
                  setActiveModalTab('demo');
                  setShowRoleModal(true);
                }}
                className="flex items-center gap-1 sm:gap-1.5 rounded-lg bg-indigo-50 text-indigo-700 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-extrabold border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-pointer shadow-sm"
              >
                <RefreshCw className="h-3.5 w-3.5 text-indigo-500 animate-spin-slow" />
                <span>Switch Account</span>
              </button>
              
              <button 
                id="nav-logout-btn"
                onClick={async () => {
                  logout();
                  await logOut().catch(console.error);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 px-2.5 py-1.5 text-xs font-extrabold transition-colors cursor-pointer border border-transparent"
                title="Log Out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Log Out</span>
              </button>
            </div>
          )}

          {/* Active User Name / Guest Badge */}
          <div className="hidden items-center gap-2 border-l border-slate-100 pl-3 md:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-100">
              {currentUser ? currentUser.name.charAt(0) : <User className="h-4 w-4" />}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {currentUser ? currentUser.name : 'Guest Customer'}
              </p>
              <span className="rounded bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 uppercase">
                {currentUser ? currentUser.role.replace('_', ' ') : 'Table Self-Order'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Role Switching & Registration Modal */}
      </header>
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto pt-20">
          <div className="w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl animate-in fade-in duration-200 mb-20 relative">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-sans font-bold text-lg text-slate-900">
                  {activeModalTab === 'signin' ? 'Sign In to MenuFlow' : activeModalTab === 'signup' ? 'Register Your Business' : 'Demo Account Switcher'}
                </h3>
                <p className="text-xs text-slate-500">
                  {activeModalTab === 'signin' ? 'Access your existing account using Google or email.' : activeModalTab === 'signup' ? 'Set up your restaurant brand in seconds!' : 'Quickly jump between different roles to evaluate the app.'}
                </p>
              </div>
              <button 
                onClick={() => setShowRoleModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                Close
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-100 mb-5 gap-1 p-1 bg-slate-50 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveModalTab('signin')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeModalTab === 'signin'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('signup')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeModalTab === 'signup'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Owner Sign Up
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('demo')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  false
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Demo Accounts
              </button>
            </div>

            {/* Local Notice Banner */}
            {localNotice && (
              <div className={`mb-4 rounded-xl border p-3 text-xs flex items-start gap-2 ${
                localNotice.type === 'success' 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                  : localNotice.type === 'error'
                  ? 'bg-rose-50 border-rose-100 text-rose-800'
                  : 'bg-indigo-50 border-indigo-100 text-indigo-800'
              }`}>
                {localNotice.type === 'success' ? (
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-semibold leading-normal">{localNotice.text}</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setLocalNotice(null)} 
                  className="text-[10px] font-bold text-slate-400 hover:text-slate-600 self-center"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Active Tab Content */}
            <div className="space-y-4">
              
              {/* TAB 1: SIGN IN */}
              {activeModalTab === 'signin' && (
                <div className="space-y-4">
                  {/* Google Sign In */}
                  <div>
                    <button
                      onClick={handleGoogleSignIn}
                      disabled={isGoogleLoading}
                      className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50"
                    >
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" className="h-5 w-5" />
                      {isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-slate-100"></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Or Use Your Email</span>
                    <div className="h-px flex-1 bg-slate-100"></div>
                  </div>

                  {/* Email Form */}
                  <form onSubmit={handleEmailSignIn} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          
                          className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          
                          className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isEmailLoading}
                      className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      {isEmailLoading ? 'Verifying...' : 'Sign In with Email'}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </form>
                  
                  <div className="text-center">
                    <p className="text-[11px] text-slate-400">
                      Don't have an account?{' '}
                      <button 
                        type="button" 
                        onClick={() => setActiveModalTab('signup')} 
                        className="font-bold text-indigo-600 hover:underline cursor-pointer"
                      >
                        Register your business brand here
                      </button>
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: PLATFORM OWNER SIGN UP */}
              {activeModalTab === 'signup' && (
                <div className="space-y-4">
                  {/* Google Registration Option */}
                  <div>
                    <button
                      type="button"
                      onClick={handleGoogleSignUp}
                      disabled={isGoogleLoadingSignUp}
                      className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                    >
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" className="h-5 w-5" />
                      {isGoogleLoadingSignUp ? 'Authenticating...' : 'Sign Up / Autofill with Google'}
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-slate-100"></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Or Fill Details Manually</span>
                    <div className="h-px flex-1 bg-slate-100"></div>
                  </div>

                  <form onSubmit={handleSignUpSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={signupOwnerName}
                        onChange={(e) => setSignupOwnerName(e.target.value)}
                        
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Your Email</label>
                      <input
                        type="email"
                        required
                        value={signupOwnerEmail}
                        onChange={(e) => setSignupOwnerEmail(e.target.value)}
                        
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Choose Password</label>
                      <input
                        type="password"
                        
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSignUpLoading}
                      className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      {isSignUpLoading ? 'Creating Account...' : 'Sign Up as Owner'}
                      <PlusCircle className="h-4 w-4" />
                    </button>
                    
                    <p className="text-[10px] text-center text-slate-400">
                      Signing up registers your account on the MenuFlow platform. You can then create your free digital menu business profile!
                    </p>
                  </form>
                </div>
              )}


            </div>
            
            <p className="mt-4 text-center text-[10px] font-medium text-slate-400 border-t border-slate-50 pt-3">
              Tip: Use Demo Accounts to swap roles to test Cashier bill split or Kitchen KDS!
            </p>
          </div>
        </div>
      )}

    </>
  );
}
