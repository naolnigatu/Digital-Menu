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
    </>
  );
}
