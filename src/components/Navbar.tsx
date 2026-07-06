import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  ChefHat, Coffee, QrCode, Shield, Utensils, CreditCard, Globe, Wifi, WifiOff, Bell, LogOut, User, RefreshCw
} from 'lucide-react';

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
    addLog
  } = useApp();

  const [simulatedOffline, setSimulatedOffline] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([
    'New Table Order MF-3011 received at Hot Stews Station!',
    'Traditional Coffee Ceremony is ready for pickup at Bar!'
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const activeTenant = tenants.find(t => t.id === activeTenantId) || tenants[0];

  // List of easy login targets for evaluation
  const demoUsers = [
    { email: 'naolnigatu2025@gmail.com', name: 'Naol Nigatu', desc: 'Platform Admin / Super Admin Overview', icon: Shield, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { email: 'admin@menuflow.com', name: 'Super Admin', desc: 'Platform Overview & Tenant Controls', icon: Shield, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { email: 'aisha@menuflow.com', name: 'Aisha (Owner)', desc: "Aisha's Traditional Kitchen", icon: ChefHat, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { email: 'carlos@menuflow.com', name: 'Carlos (Owner)', desc: "Carlos's Specialty Espresso", icon: Coffee, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { email: 'fatima@menuflow.com', name: 'Fatima (Waiter)', desc: 'Table status grid & tables placement', icon: Utensils, color: 'text-pink-600 bg-pink-50 border-pink-100' },
    { email: 'yohannes@menuflow.com', name: 'Yohannes (Kitchen)', desc: 'Hot Stews Station KDS View', icon: ChefHat, color: 'text-orange-600 bg-orange-50 border-orange-100' },
    { email: 'cashier@menuflow.com', name: 'Kebron (Cashier)', desc: 'Bill split & payment recording', icon: CreditCard, color: 'text-cyan-600 bg-cyan-50 border-cyan-100' },
    { email: 'guest@menuflow.com', name: 'Customer Scan (QR)', desc: 'Self-serve Table Ordering & Tracking', icon: QrCode, color: 'text-slate-600 bg-slate-50 border-slate-100' }
  ];

  const handleRoleSelect = (email: string) => {
    if (email === 'guest@menuflow.com') {
      logout(); // Clears user context, placing in customer mode
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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-sm">
            M
          </div>
          <div className="flex items-center gap-2.5">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-sans font-extrabold text-base tracking-tight text-slate-900">MenuFlow</span>
                <span className="hidden rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-extrabold text-slate-500 sm:inline-block uppercase tracking-wider">PWA SaaS</span>
              </div>
              <p className="hidden text-[10px] font-bold text-slate-400 md:block uppercase tracking-wide">
                {currentUser?.role === 'super_admin' ? 'Platform Central' : `${activeTenant?.name}`}
              </p>
            </div>
            <span className="hidden px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-extrabold rounded uppercase tracking-wider md:inline-block">
              Operational
            </span>
          </div>
        </div>

        {/* Action Controls & Info */}
        <div className="flex items-center gap-3">
          
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
                <span className="hidden sm:inline">PWA Offline Mode</span>
              </>
            ) : (
              <>
                <Wifi className="h-3.5 w-3.5 text-emerald-600" />
                <span className="hidden sm:inline">PWA Live Sync</span>
              </>
            )}
          </button>

          {/* Localized Language Switcher (Aisha Amharic support) */}
          {activeTenantId === 't-01' && (
            <button 
              id="nav-lang-btn"
              onClick={() => setLanguage(currentLanguage === 'en' ? 'am' : 'en')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              title="Toggle Multi-lingual Localization (English / Amharic)"
            >
              <Globe className="h-3.5 w-3.5 text-slate-500" />
              <span>{currentLanguage === 'en' ? 'English' : 'አማርኛ'}</span>
            </button>
          )}

          {/* Quick Real-Time Notifications */}
          <div className="relative">
            <button 
              id="nav-notif-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
            >
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-100 bg-white p-3 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-3">
                <div className="mb-2 flex items-center justify-between border-b border-slate-50 pb-2">
                  <span className="text-xs font-bold text-slate-800">Operational Alerts</span>
                  <button 
                    onClick={() => setNotifications([])}
                    className="text-[10px] text-slate-400 hover:text-slate-600 font-semibold"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2">
                  {notifications.length === 0 ? (
                    <p className="py-4 text-center text-xs font-medium text-slate-400">No active alerts. All quiet!</p>
                  ) : (
                    notifications.map((notif, index) => (
                      <div key={index} className="flex gap-2 rounded-lg bg-slate-50 p-2 text-[11px] leading-relaxed text-slate-600">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 mt-1.5"></span>
                        <p>{notif}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Role Changer & Active User Indicator */}
          <button 
            id="nav-role-switcher"
            onClick={() => setShowRoleModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-50 text-indigo-700 px-3 py-1.5 text-xs font-extrabold border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-pointer shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5 text-indigo-500 animate-spin-slow" />
            <span>Switch Role</span>
          </button>

          {/* Active User Name / Guest Badge */}
          <div className="hidden items-center gap-2 border-l border-slate-100 pl-3 md:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200">
              {currentUser ? currentUser.name.charAt(0) : <User className="h-4 w-4" />}
            </div>
            <div className="text-left">
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

      {/* Role Switching Evaluator Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-sans font-bold text-lg text-slate-900">Evaluate MenuFlow Roles</h3>
                <p className="text-xs text-slate-500">MenuFlow is fully stateful. Switching roles acts like logging in as that user instantly.</p>
              </div>
              <button 
                onClick={() => setShowRoleModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                Close
              </button>
            </div>

            <div className="grid gap-2">
              {demoUsers.map((user) => {
                const Icon = user.icon;
                const isCurrent = currentUser 
                  ? currentUser.email.toLowerCase() === user.email.toLowerCase()
                  : user.email === 'guest@menuflow.com';

                return (
                  <button
                    key={user.email}
                    onClick={() => handleRoleSelect(user.email)}
                    className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all duration-200 hover:border-slate-300 hover:shadow-sm ${
                      isCurrent 
                        ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900' 
                        : 'border-slate-100 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${user.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-slate-900">{user.name}</p>
                          <span className="text-[10px] text-slate-400 font-semibold">{user.email}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{user.desc}</p>
                      </div>
                    </div>
                    {isCurrent && (
                      <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[9px] font-bold text-white">Active</span>
                    )}
                  </button>
                );
              })}
            </div>
            
            <p className="mt-4 text-center text-[10px] font-medium text-slate-400">
              Tip: Create a custom menu item as "Owner", then switch to "Customer" to order it, view it appear in "Kitchen", and pay as "Cashier"!
            </p>
          </div>
        </div>
      )}

    </header>
  );
}
