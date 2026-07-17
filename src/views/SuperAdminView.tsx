import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Tenant } from '../types';
import BusinessOwnerView from './BusinessOwnerView';
import { 
  Building, ShieldAlert, BadgeDollarSign, Activity, Users, 
  ExternalLink, Lock, Unlock, Settings, ArrowRight, TrendingUp, 
  AlertCircle, Check, X, Megaphone, Plus, Trash2, Layers, History,
  Compass, Laptop, ShieldCheck, Mail, Radio, Key, ToggleLeft, HelpCircle,
  AlertTriangle
} from 'lucide-react';

export default function SuperAdminView() {
  const { 
    tenants, 
    orders, 
    logs, 
    toggleTenantStatus, 
    updateTenantPlan,
    updateTenantCurrency,
    setActiveTenantId,
    approveTenantStatus,
    rejectTenantStatus,
    ads,
    addAd,
    toggleAdStatus,
    deleteAd,
    pricingPlans,
    updatePlanPrice,
    updatePlanTabs,
    addLog,
    staff,
    subscriptionRequests,
    approveSubscriptionRequest,
    rejectSubscriptionRequest,
    superAdminPaymentInfo,
    setSuperAdminPaymentInfo
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('health');
  const [managingTenantId, setManagingTenantId] = useState<string | null>(null);

  const [localPricingPlans, setLocalPricingPlans] = useState(pricingPlans);

  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Sync pricing plans
  React.useEffect(() => {
    setLocalPricingPlans(pricingPlans);
  }, [pricingPlans]);

  const handleSavePricing = (planId: string) => {
    const plan = localPricingPlans.find(p => p.id === planId);
    if (plan) {
      updatePlanPrice(planId, plan.priceUSD, plan.priceETB);
      showToast(`Pricing for ${plan.name} updated successfully!`);
    }
  };

  // Ad Form States
  const [adTitle, setAdTitle] = useState('');
  const [adSubtitle, setAdSubtitle] = useState('');
  const [adImageUrl, setAdImageUrl] = useState('');
  const [adTargetTenant, setAdTargetTenant] = useState('');

  // Business Types State
  const [businessTypes, setBusinessTypes] = useState<{ name: string; count: number }[]>([
    { name: 'Hotel', count: 1 },
    { name: 'Ethiopian Restaurant', count: 4 },
    { name: 'Cafe', count: 3 },
    { name: 'Bakery', count: 2 },
    { name: 'Pizza Restaurant', count: 1 },
    { name: 'Burger House', count: 2 },
    { name: 'Fast Food', count: 1 },
    { name: 'Street Food', count: 0 },
    { name: 'Juice Bar', count: 1 },
    { name: 'Dessert Shop', count: 1 },
    { name: 'Bar', count: 1 },
    { name: 'Coffee House', count: 2 }
  ]);
  const [newBusinessType, setNewBusinessType] = useState('');

  // Feature Manager Matrix
  const [featureMatrix, setFeatureMatrix] = useState<Record<string, { free: boolean; growth: boolean; enterprise: boolean }>>({
    'orderingEnabled': { free: true, growth: true, enterprise: true },
    'tableManagementEnabled': { free: true, growth: true, enterprise: true },
    'reservationEnabled': { free: false, growth: true, enterprise: true },
    'loyaltyEnabled': { free: false, growth: true, enterprise: true },
    'tipsEnabled': { free: false, growth: true, enterprise: true },
    'customerAccountsEnabled': { free: true, growth: true, enterprise: true },
    'kitchenEnabled': { free: false, growth: true, enterprise: true },
    'takeawayEnabled': { free: true, growth: true, enterprise: true },
    'deliveryEnabled': { free: false, growth: true, enterprise: true }
  });

  // Marketplace Integrations Store
  const [integrations, setIntegrations] = useState([
    { id: 'chapa', name: 'Chapa Payment Gateway', type: 'Payment', desc: 'Accept credit cards and local mobile money (telebirr, CBE Birr) seamlessly in Ethiopia.', installed: true, cost: 'Free' },
    { id: 'telebirr', name: 'Telebirr Direct', type: 'Payment', desc: 'Direct merchant API integration for Ethio Telecom\'s super app.', installed: true, cost: 'Free' },
    { id: 'cbebirr', name: 'CBE Birr API', type: 'Payment', desc: 'Commercial Bank of Ethiopia direct wallet checkout checkout.', installed: false, cost: 'Free' },
    { id: 'twilio', name: 'Twilio SMS Notification', type: 'Utility', desc: 'Send direct confirmation text alerts to diners on order checks.', installed: false, cost: '$0.01 / SMS' },
    { id: 'stripe', name: 'Stripe International', type: 'Payment', desc: 'Global card checkout supporting USD, EUR, and GBP for hotel travelers.', installed: false, cost: '2.9% + 30c' },
    { id: 'quickbooks', name: 'QuickBooks Accounting', type: 'Accounting', desc: 'Export ledger checks and daily end-of-day kitchen reports.', installed: false, cost: '$15 / mo' }
  ]);

  // Verification documents
  const [verifications, setVerifications] = useState<Record<string, 'Verified' | 'Pending License' | 'Unverified'>>({
    't-01': 'Verified',
    't-02': 'Verified',
    't-03': 'Pending License'
  });
  const [viewingLicenseDoc, setViewingLicenseDoc] = useState<string | null>(null);

  // Notifications Broadcast Center State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState('all');
  const [broadcastHistory, setBroadcastHistory] = useState([
    { id: 'b-1', title: 'System Maintenance Window', message: 'Dinex cloud servers will undergo scheduled API optimization on Monday at 02:00 AM EAT. Downtime under 3 minutes.', target: 'all', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'b-2', title: 'New CBE Birr Integration Enabled!', message: 'You can now activate the Commercial Bank of Ethiopia checkout option directly from your custom merchant billing dashboard.', target: 'enterprise', timestamp: new Date(Date.now() - 86400000 * 5).toISOString() }
  ]);

  // Platform Global Settings
  const { globalSettings, updateGlobalSettings } = useApp();
  const [globalTaxRate, setGlobalTaxRate] = useState(15);
  const [supportEmail, setSupportEmail] = useState('naolnigatu2025@gmail.com');
  const [maintenanceMode, setMaintenanceMode] = useState(globalSettings.maintenanceMode);
  const [usdEtbRate, setUsdEtbRate] = useState(115);
  const [isSavingGlobalSettings, setIsSavingGlobalSettings] = useState(false);
  const [supportedCountriesText, setSupportedCountriesText] = useState(globalSettings.supportedCountries.join(', '));
  const [supportedCurrenciesText, setSupportedCurrenciesText] = useState(globalSettings.supportedCurrencies.join(', '));

  // User search
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Platform Metrics
  const totalRegistered = tenants.length;
  const activeCount = React.useMemo(() => tenants.filter(t => t.subscriptionStatus === 'active').length, [tenants]);
  const pendingCount = React.useMemo(() => tenants.filter(t => t.subscriptionStatus === 'pending_approval').length, [tenants]);
  const platformOrdersCount = orders.length;
  const platformRevenue = React.useMemo(() => orders.reduce((acc, curr) => acc + (curr.paymentStatus === 'paid' ? curr.total : 0), 0), [orders]);

  const handlePublishAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle || !adSubtitle) {
      showToast('Please fill in Ad Title and Subtitle.', 'error');
      return;
    }
    
    addAd({
      title: adTitle,
      subtitle: adSubtitle,
      imageUrl: adImageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
      tenantId: adTargetTenant || undefined
    });

    setAdTitle('');
    setAdSubtitle('');
    setAdImageUrl('');
    setAdTargetTenant('');
    showToast('✓ Platform campaign ad published to direct client tables!');
  };

  const handleAddBusinessType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBusinessType.trim()) return;
    setBusinessTypes(prev => [...prev, { name: newBusinessType.trim(), count: 0 }]);
    addLog('Platform Setting', `Added new business category descriptor: ${newBusinessType}`);
    setNewBusinessType('');
    showToast('✓ Saved successfully.');
  };

  const handleToggleFeature = (featureName: string, tier: 'free' | 'growth' | 'enterprise') => {
    setFeatureMatrix(prev => {
      const current = prev[featureName];
      return {
        ...prev,
        [featureName]: {
          ...current,
          [tier]: !current[tier]
        }
      };
    });
  };

  const handleToggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(integration => {
      if (integration.id === id) {
        const nextState = !integration.installed;
        addLog('Marketplace Change', `${nextState ? 'Installed' : 'Uninstalled'} Integration: ${integration.name}`);
        return { ...integration, installed: nextState };
      }
      return integration;
    }));
    showToast('✓ Saved successfully. Workspace services updated.');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) {
      showToast('Please fill in both title and announcement copy.', 'error');
      return;
    }
    const newBroadcast = {
      id: `b-${Date.now()}`,
      title: broadcastTitle,
      message: broadcastMessage,
      target: broadcastTarget,
      timestamp: new Date().toISOString()
    };
    setBroadcastHistory(prev => [newBroadcast, ...prev]);
    addLog('Platform Broadcast', `Dispatched system message: ${broadcastTitle}`);
    setBroadcastTitle('');
    setBroadcastMessage('');
    showToast('✓ Saved successfully. Broadcasted to live restaurant channels!');
  };

  const handleSaveGlobalSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGlobalSettings(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    updateGlobalSettings({
      maintenanceMode,
      supportedCountries: supportedCountriesText.split(',').map(s => s.trim()).filter(Boolean),
      supportedCurrencies: supportedCurrenciesText.split(',').map(s => s.trim()).filter(Boolean),
    });
    addLog('Global Configuration', `Tax Default set to ${globalTaxRate}%, Exchange Rate set to ${usdEtbRate} ETB/USD, Maintenance: ${maintenanceMode}`);
    setIsSavingGlobalSettings(false);
    showToast('✓ Saved successfully.');
  };

  const pendingRequests = React.useMemo(() => tenants.filter(t => t.subscriptionStatus === 'pending_approval'), [tenants]);
  const existingBusinesses = React.useMemo(() => tenants.filter(t => t.subscriptionStatus !== 'pending_approval'), [tenants]);

  // Unified lists of users (Owners + Staff roster)
  const allPlatformUsers = React.useMemo(() => {
    const list: { name: string; email: string; role: string; origin: string; status: string; tenantName: string }[] = [];
    
    // Add owners
    tenants.forEach(t => {
      list.push({
        name: t.id === 't-01' ? 'Aisha Traditional Owner' : t.id === 't-02' ? 'Carlos Espresso Owner' : 'Business Owner',
        email: t.ownerEmail || `${t.slug}-owner@menuflow.com`,
        role: 'owner',
        origin: 'Direct Sign Up',
        status: t.subscriptionStatus === 'suspended' ? 'Suspended' : 'Active',
        tenantName: t.name
      });
    });

    // Add employees
    staff.forEach(s => {
      const parentTenant = tenants.find(t => t.id === s.tenantId);
      list.push({
        name: s.name,
        email: s.email,
        role: s.role,
        origin: 'Staff Invite Token',
        status: s.active ? 'Active' : 'Suspended',
        tenantName: parentTenant ? parentTenant.name : 'Unknown Tenant'
      });
    });

    // Filter list
    return list.filter(u => 
      (u.name || '').toLowerCase().includes((userSearchTerm || '').toLowerCase()) ||
      (u.email || '').toLowerCase().includes((userSearchTerm || '').toLowerCase()) ||
      (u.role || '').toLowerCase().includes((userSearchTerm || '').toLowerCase()) ||
      (u.tenantName || '').toLowerCase().includes((userSearchTerm || '').toLowerCase())
    );
  }, [tenants, staff, userSearchTerm]);

  if (managingTenantId) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-indigo-50 border border-indigo-200 p-3 rounded-xl shadow-sm">
           <span className="text-xs font-bold text-indigo-700 flex items-center gap-2">
             <AlertCircle className="h-4 w-4" /> 
             Super Admin Override Active: Managing <strong>"{tenants.find(t => t.id === managingTenantId)?.name}"</strong> Workspace
           </span>
           <button 
             onClick={() => setManagingTenantId(null)} 
             className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
           >
             Exit Control Override
           </button>
        </div>
        <BusinessOwnerView />
      </div>
    );
  }

  // Define 10 primary active working tabs representing the platform control center
  const workingTabs = [
    { id: 'health', label: 'Platform Health', icon: Activity, emoji: '🌍' },
    { id: 'revenue', label: 'Revenue Dashboard', icon: BadgeDollarSign, emoji: '💰' },
    { id: 'businesses', label: 'Businesses', icon: Building, emoji: '🏢', badge: pendingCount },
    { id: 'analytics', label: 'Growth Analytics', icon: TrendingUp, emoji: '📈' },
    { id: 'feature_manager', label: 'Feature Manager', icon: Layers, emoji: '📦' },
    { id: 'advertisements', label: 'Ads Manager', icon: Megaphone, emoji: '📣' },
    { id: 'subscriptions', label: 'Subscription Approvals', icon: ShieldCheck, emoji: '💳' },
    { id: 'marketplace', label: 'Marketplace', icon: ExternalLink, emoji: '🛒' },
    { id: 'security', label: 'Security Center', icon: ShieldCheck, emoji: '🛡' },
    { id: 'audit_logs', label: 'Audit Logs', icon: History, emoji: '📜' },
    { id: 'settings', label: 'Platform Settings', icon: Settings, emoji: '⚙' }
  ];

  const [isStatsExpanded, setIsStatsExpanded] = useState(true);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider border border-indigo-100">Super Admin Center</span>
            <span className="text-[10px] font-extrabold text-slate-400">naolnigatu2025@gmail.com</span>
          </div>
          <h1 className="font-sans font-extrabold text-2xl text-slate-900 tracking-tight mt-1">Dinex Control Center</h1>
          <p className="text-xs text-slate-500 mt-0.5">Global platform administration, real-time telemetry, multi-tenant billing overrides, and unified configuration.</p>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="space-y-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5">Platform Control Modules</span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pr-2 scrollbar-none max-w-full">
            {workingTabs.map(tab => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    addLog('Navigation', `Accessed Control Center: ${tab.label}`);
                  }}
                  className={`rounded-lg px-3.5 py-2 text-xs font-bold transition-all flex items-center gap-2 shrink-0 whitespace-nowrap cursor-pointer border ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm scale-102 font-extrabold'
                      : 'bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100'
                  }`}
                >
                  <span className="text-sm shrink-0">{tab.emoji}</span>
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`rounded-full h-4 px-1.5 text-[9px] font-extrabold flex items-center justify-center ${
                      isActive ? 'bg-white text-indigo-600' : 'bg-rose-500 text-white animate-pulse'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Minimized KPI Metrics Row (Collapsible) - Shown only on main Platform Health Overview tab */}
      {activeTab === 'health' && !managingTenantId && (
        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-indigo-600 animate-pulse" />
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Platform Overview (Minimized Stats)</span>
            </div>
            <button 
              type="button"
              onClick={() => setIsStatsExpanded(!isStatsExpanded)}
              className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wider cursor-pointer"
            >
              {isStatsExpanded ? 'Hide Details' : 'Show Details'}
            </button>
          </div>

          {isStatsExpanded ? (
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
              {/* Global Tenants */}
              <div 
                onClick={() => setActiveTab('businesses')}
                className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-sm cursor-pointer hover:border-indigo-400 transition-colors flex items-center justify-between"
              >
                <div className="min-w-0">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Global Tenants</span>
                  <span className="text-sm font-extrabold text-slate-900 block mt-0.5">{totalRegistered} total</span>
                </div>
                <span className="text-[8px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                  {activeCount} Live
                </span>
              </div>

              {/* Pending Approvals */}
              <div 
                onClick={() => setActiveTab('businesses')}
                className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-sm cursor-pointer hover:border-amber-400 transition-colors flex items-center justify-between"
              >
                <div className="min-w-0">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Pending Approvals</span>
                  <span className={`text-sm font-extrabold block mt-0.5 ${pendingCount > 0 ? 'text-amber-600 font-black animate-pulse' : 'text-slate-900'}`}>
                    {pendingCount} App{pendingCount === 1 ? '' : 's'}
                  </span>
                </div>
                <span className={`h-2 w-2 rounded-full shrink-0 ${pendingCount > 0 ? 'bg-amber-500 animate-ping' : 'bg-slate-300'}`} />
              </div>

              {/* Live Campaign Ads */}
              <div 
                onClick={() => setActiveTab('advertisements')}
                className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-sm cursor-pointer hover:border-emerald-400 transition-colors flex items-center justify-between"
              >
                <div className="min-w-0">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Campaign Ads</span>
                  <span className="text-sm font-extrabold text-slate-900 block mt-0.5">
                    {ads.filter(a => a.active).length} Active
                  </span>
                </div>
                <Megaphone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              </div>

              {/* System Health */}
              <div 
                onClick={() => setActiveTab('health')}
                className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-sm cursor-pointer hover:border-indigo-400 transition-colors flex items-center justify-between"
              >
                <div className="min-w-0">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">System Health</span>
                  <span className="text-sm font-extrabold text-slate-900 block mt-0.5">99.98%</span>
                </div>
                <span className="text-[8px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                  Healthy
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-bold text-slate-600 pt-1 border-t border-slate-100">
              <span>• Tenants: <button onClick={() => setActiveTab('businesses')} className="text-slate-900 hover:underline">{totalRegistered} ({activeCount} Live)</button></span>
              <span>• Pending Approvals: <button onClick={() => setActiveTab('businesses')} className={`hover:underline ${pendingCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>{pendingCount}</button></span>
              <span>• Active Ads: <button onClick={() => setActiveTab('advertisements')} className="text-slate-900 hover:underline">{ads.filter(a => a.active).length}</button></span>
              <span>• Health: <button onClick={() => setActiveTab('health')} className="text-emerald-600 hover:underline">99.98% (Healthy)</button></span>
            </div>
          )}
        </div>
      )}

      {/* Tab Contents */}

      {/* 1. PLATFORM HEALTH TAB */}
      {activeTab === 'health' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Uptime & Service Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { name: 'SaaS Core Database', provider: 'Firestore Engine', status: 'Online', latency: '12ms', health: '99.99%', color: 'emerald' },
              { name: 'Identity & Auth Gate', provider: 'Firebase Auth', status: 'Operational', latency: '8ms', health: '100%', color: 'emerald' },
              { name: 'SMS Dispatch Core', provider: 'Twilio Gateway', status: 'Live', latency: '145ms', health: '99.95%', color: 'emerald' },
              { name: 'SMTP Dispatch Relay', provider: 'Mail Server', status: 'Operational', latency: '42ms', health: '100%', color: 'emerald' },
              { name: 'Chapa Handshake Core', provider: 'Payment Gateway', status: 'Online', latency: '24ms', health: '99.87%', color: 'emerald' }
            ].map((srv, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{srv.provider}</span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{srv.name}</h4>
                  <div className="flex justify-between items-baseline mt-2">
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold uppercase">{srv.status}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">{srv.latency}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Live Operational Health summary */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white p-5 rounded-2xl shadow-md flex flex-col justify-between">
              <div>
                <span className="text-indigo-300 text-[10px] font-extrabold uppercase tracking-wider block">Telemetry Operational Summary</span>
                <h3 className="text-base font-bold mt-1 text-slate-100">Dinex Central SaaS Cloud</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Dinex empowers restaurant menus, reservations, and real-time order ticks across the country. Server cores are processing cleanly.
                </p>
              </div>
              <div className="pt-4 border-t border-indigo-800/40 mt-4 flex justify-between items-baseline">
                <div>
                  <span className="text-[9px] text-indigo-300 uppercase block">Active Socket Subs</span>
                  <span className="text-xl font-mono font-bold text-white">128 channels</span>
                </div>
                <div>
                  <span className="text-[9px] text-indigo-300 uppercase block">Platform Health Score</span>
                  <span className="text-xl font-mono font-bold text-emerald-400">99.98% OK</span>
                </div>
              </div>
            </div>

            {/* Platform Adoption Tiers */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-sans font-extrabold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Laptop className="h-4 w-4 text-indigo-500" />
                <span>Subscription Plan Adoption</span>
              </h3>
              <div className="space-y-2.5 pt-1.5">
                {['enterprise', 'growth', 'free'].map(plan => {
                  const count = tenants.filter(t => t.subscriptionPlan === plan).length;
                  const percent = Math.round((count / (tenants.length || 1)) * 100);
                  return (
                    <div key={plan} className="space-y-1 text-xs">
                      <div className="flex justify-between font-bold text-slate-800 uppercase tracking-wide">
                        <span className="capitalize">{plan} Tier</span>
                        <span>{count} ({percent}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            plan === 'enterprise' ? 'bg-purple-600' : plan === 'growth' ? 'bg-indigo-600' : 'bg-slate-400'
                          }`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Audit Alerts */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-sans font-extrabold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <History className="h-4 w-4 text-slate-400" />
                <span>Latest System Events</span>
              </h3>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {logs.slice(0, 4).map((log, index) => (
                  <div key={index} className="text-[10px] leading-relaxed p-2 bg-slate-50 border border-slate-100/50 rounded-lg">
                    <div className="flex justify-between font-bold text-slate-400 mb-0.5">
                      <span>{log.userEmail.slice(0, 18)}...</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-800 font-semibold">{log.action}: {log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Access Checklist */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/20 p-5 space-y-3">
            <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
              <Compass className="h-4.5 w-4.5 text-indigo-600" />
              <span>Dinex Operations Checklist</span>
            </h4>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 text-xs">
              <button onClick={() => setActiveTab('businesses')} className="bg-white border border-indigo-100/60 p-3 rounded-xl hover:border-indigo-300 hover:shadow-sm text-left transition-all">
                <span className="font-extrabold text-indigo-950 block">Review Approvals</span>
                <span className="text-[10px] text-slate-400 mt-1 block">{pendingCount} applications waiting</span>
              </button>
              <button onClick={() => setActiveTab('marketplace')} className="bg-white border border-indigo-100/60 p-3 rounded-xl hover:border-indigo-300 hover:shadow-sm text-left transition-all">
                <span className="font-extrabold text-indigo-950 block">Marketplace Apps</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Toggle payment gateways</span>
              </button>
              <button onClick={() => setActiveTab('security')} className="bg-white border border-indigo-100/60 p-3 rounded-xl hover:border-indigo-300 hover:shadow-sm text-left transition-all">
                <span className="font-extrabold text-indigo-950 block">Security & Verifications</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Review uploaded tax papers</span>
              </button>
              <button onClick={() => setActiveTab('settings')} className="bg-white border border-indigo-100/60 p-3 rounded-xl hover:border-indigo-300 hover:shadow-sm text-left transition-all">
                <span className="font-extrabold text-indigo-950 block">Global Parameters</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Emergency maintenance limits</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. BUSINESSES TAB */}
      {activeTab === 'businesses' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* PENDING APPROVAL REQUESTS */}
          {pendingRequests.length > 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50/20 shadow-sm overflow-hidden">
              <div className="border-b border-amber-200 bg-amber-100/40 px-4 py-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 animate-bounce" />
                <h3 className="font-sans font-extrabold text-sm text-slate-800">
                  Pending Registration & Upgrade Approvals ({pendingRequests.length})
                </h3>
              </div>
              
              <div className="divide-y divide-amber-200/50">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
                    <div className="flex items-start gap-3">
                      <div className="h-11 w-11 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 border border-amber-200 font-extrabold text-xs">
                        {(request.name || '').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-slate-900">{request.name}</h4>
                          <span className="bg-amber-100 text-amber-800 rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase border border-amber-200">
                            Awaiting Approval
                          </span>
                          <span className="bg-indigo-100 text-indigo-800 rounded-full px-2.5 py-0.5 text-[8px] font-extrabold uppercase border border-indigo-200 tracking-wide">
                            Requested Tier: {(request.subscriptionPlan || '').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">
                          Owner: <strong>{request.ownerEmail}</strong> | Slug: <span className="font-mono bg-slate-100 px-1 py-0.2 rounded text-[9px]">{request.slug}</span>
                        </p>
                        <p className="text-[11px] text-slate-600 italic mt-1 font-medium">"{request.description}"</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end md:self-center">
                      <button
                        onClick={() => {
                          approveTenantStatus(request.id);
                          showToast('✓ Saved successfully. Tenant application approved and workspace is now fully live!');
                        }}
                        className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Approve / Accept
                      </button>
                      <button
                        onClick={() => {
                          rejectTenantStatus(request.id);
                          showToast('Tenant application declined and moved to rejected stack.');
                        }}
                        className="rounded-lg bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1.5 text-xs font-bold hover:bg-rose-100 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                        Reject Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-xl text-center text-slate-500 text-xs">
              ✓ No pending registration or upgrade approvals. All clean!
            </div>
          )}

          {/* ACTIVE DIRECTORY SECTION */}
          <div className="space-y-4">
            <h3 className="font-sans font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <Building className="h-4.5 w-4.5 text-slate-400" />
              <span>Platform Tenant Directories</span>
            </h3>

            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-100">
                {existingBusinesses.map((tenant) => {
                  const isBlocked = tenant.subscriptionStatus === 'suspended';
                  const isRejected = tenant.subscriptionStatus === 'rejected';
                  
                  const tenantSales = orders
                    .filter(o => o.tenantId === tenant.id && o.paymentStatus === 'paid')
                    .reduce((acc, curr) => acc + curr.total, 0);

                  return (
                    <div key={tenant.id} className="p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 transition-colors hover:bg-slate-50/30">
                      <div className="flex items-start gap-3">
                        <img 
                          src={tenant.logoUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=80'} 
                          alt={tenant.name} 
                          className="h-11 w-11 rounded-lg border border-slate-150 object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900">{tenant.name}</h4>
                            <span className={`rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase ${
                              tenant.subscriptionPlan === 'enterprise' 
                                ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                                : tenant.subscriptionPlan === 'growth' 
                                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {tenant.subscriptionPlan} Plan
                            </span>
                            {isBlocked && (
                              <span className="bg-rose-100 text-rose-700 border border-rose-200 rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase">
                                Suspended
                              </span>
                            )}
                            {isRejected && (
                              <span className="bg-slate-100 text-slate-500 border border-slate-200 rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase">
                                Rejected
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">Slug: <span className="font-mono">{tenant.slug}</span> | Owner: {tenant.ownerEmail}</p>
                          <div className="flex gap-3 text-[10px] font-semibold text-slate-500 mt-1">
                            <span>Sales Volume: <strong className="text-slate-800">{tenant.currencySymbol} {tenantSales.toLocaleString()}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Subscription Plan Overrides */}
                        <div className="flex flex-col gap-0.5 text-[9px] font-extrabold text-slate-400 uppercase">
                          <span>Plan Tier</span>
                          <select
                            value={tenant.subscriptionPlan}
                            onChange={(e) => {
                              updateTenantPlan(tenant.id, e.target.value as any);
                              showToast('✓ Saved successfully. Subscription tier updated.');
                            }}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                          >
                            <option value="free">Free Tier</option>
                            <option value="growth">Growth Plan</option>
                            <option value="enterprise">Enterprise</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-0.5 text-[9px] font-extrabold text-slate-400 uppercase">
                          <span>Currency</span>
                          <select
                            value={tenant.currency}
                            onChange={(e) => {
                              const currency = e.target.value;
                              const symbol = currency === 'USD' ? '$' : 'Br';
                              updateTenantCurrency(tenant.id, currency, symbol);
                              showToast('✓ Saved successfully. Currency overrides set.');
                            }}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                          >
                            <option value="ETB">ETB (Br)</option>
                            <option value="USD">USD ($)</option>
                          </select>
                        </div>

                        {/* Suspension Toggle */}
                        <div className="flex flex-col gap-0.5 text-[9px] font-extrabold text-slate-400 uppercase">
                          <span>Status Access</span>
                          <button
                            onClick={() => {
                              toggleTenantStatus(tenant.id);
                              showToast(`Workspace status changed successfully.`);
                            }}
                            className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                              isBlocked
                                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            }`}
                          >
                            {isBlocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                            <span>{isBlocked ? 'Blocked' : 'Active'}</span>
                          </button>
                        </div>

                        {/* Manage Business Override */}
                        <div className="flex flex-col gap-0.5 text-[9px] font-extrabold text-slate-400 uppercase">
                          <span>Operations Override</span>
                          <button
                            onClick={() => {
                              setActiveTenantId(tenant.id);
                              setManagingTenantId(tenant.id);
                            }}
                            className="flex items-center gap-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 text-xs font-bold cursor-pointer"
                          >
                            <Settings className="h-3 w-3" />
                            <span>Launch Control</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 2. REVENUE DASHBOARD TAB */}
      {activeTab === 'revenue' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Revenue Metric Highlights */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Gross Transaction Volume</span>
              <span className="text-2xl font-mono font-black text-slate-900 block mt-1">Br {platformRevenue.toLocaleString()}</span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-1">↑ 18.2% vs previous month</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Commission Intake (2.5%)</span>
              <span className="text-2xl font-mono font-black text-indigo-600 block mt-1">Br {(platformRevenue * 0.025).toLocaleString()}</span>
              <span className="text-[10px] text-indigo-600 font-bold block mt-1">Direct payout deduction model</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">MRR SaaS Licenses</span>
              <span className="text-2xl font-mono font-black text-slate-900 block mt-1">Br 34,900</span>
              <span className="text-[10px] text-slate-400 font-bold block mt-1">From active subscription plans</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Disbursed Funds</span>
              <span className="text-2xl font-mono font-black text-emerald-600 block mt-1">Br 124,500</span>
              <span className="text-[10px] text-slate-400 font-bold block mt-1">To merchant bank channels</span>
            </div>
          </div>

          {/* Pricing Plan Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-sans font-extrabold text-sm text-slate-900">SaaS License Plans & Tiers</h3>
                <p className="text-xs text-slate-400">Modify subscription prices charged to merchant businesses. Changes take effect on next billing cycle.</p>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider border border-indigo-100">Live Config Matrix</span>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {localPricingPlans.map(plan => (
                <div key={plan.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-all">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="font-sans font-extrabold text-sm text-slate-900 capitalize">{plan.name} Tier</h4>
                        <span className="rounded bg-indigo-50 text-indigo-700 text-[8px] font-extrabold px-1.5 py-0.5 uppercase tracking-wider mt-1 inline-block">
                          ID: {plan.id}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Price (USD/mo)</label>
                        <input
                          type="number"
                          value={plan.priceUSD}
                          onChange={(e) => setLocalPricingPlans(prev => prev.map(p => p.id === plan.id ? { ...p, priceUSD: Number(e.target.value) } : p))}
                          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Price (ETB/mo)</label>
                        <input
                          type="number"
                          value={plan.priceETB}
                          onChange={(e) => setLocalPricingPlans(prev => prev.map(p => p.id === plan.id ? { ...p, priceETB: Number(e.target.value) } : p))}
                          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold bg-white"
                        />
                      </div>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-500">
                      {plan.description}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4">
                    <button
                      onClick={() => {
                        handleSavePricing(plan.id);
                        showToast(`✓ Successfully saved subscription details for ${plan.name} tier!`);
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      Save Subscription Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Disbursements & Settlement */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-wider">Merchant Settled Disbursements</h3>
                <p className="text-xs text-slate-400 mt-0.5">Track automated bank disbursements processed for platform food orders.</p>
              </div>
              <button 
                onClick={() => {
                  addLog('Payout Run', 'Triggered a manual platform settlement sweep');
                  showToast('✓ Manual settlement run succeeded. All outstanding merchant escrow batches have been released to local banks!');
                }}
                className="rounded-xl border border-slate-200 hover:bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
              >
                <Activity className="h-4 w-4 text-emerald-600 animate-pulse" />
                <span>Trigger Manual Settlement Sweep</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                    <th className="p-3">Reference ID</th>
                    <th className="p-3">Merchant Restaurant</th>
                    <th className="p-3">Settlement Date</th>
                    <th className="p-3 text-right">Settled Amount</th>
                    <th className="p-3 text-center">Transfer Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {[
                    { ref: 'TXN-9901-ADD', name: 'Aisha Traditional Foods', date: 'Today, 11:20 AM', amount: 'Br 14,250.00', status: 'Success' },
                    { ref: 'TXN-9842-ADD', name: 'Carlos Espresso Bar', date: 'Yesterday, 04:15 PM', amount: 'Br 8,190.00', status: 'Success' },
                    { ref: 'TXN-9733-ADD', name: 'Le Bistro Addis', date: '08 Jul 2026', amount: 'Br 22,400.00', status: 'Success' },
                    { ref: 'TXN-9621-ADD', name: 'Sheger Burger & Shakes', date: '05 Jul 2026', amount: 'Br 19,800.00', status: 'Success' }
                  ].map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3 font-mono text-[10px] text-slate-500">{item.ref}</td>
                      <td className="p-3 font-bold text-slate-900">{item.name}</td>
                      <td className="p-3 text-slate-500">{item.date}</td>
                      <td className="p-3 text-right font-bold text-indigo-950">{item.amount}</td>
                      <td className="p-3 text-center">
                        <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 text-[9px] font-extrabold uppercase">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. FEATURE MANAGER TAB */}
      
      {activeTab === 'feature_manager' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div>
              <h3 className="font-sans font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <Settings className="h-4.5 w-4.5 text-indigo-600" />
                <span>Granular Tab Access by Plan</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Toggle tabs that businesses can access according to their plans.
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-150">
                    <th className="p-3">Tab Module</th>
                    {pricingPlans.map(plan => (
                      <th key={plan.id} className="p-3 text-center">{plan.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {[
                    { id: 'dashboard', label: 'Dashboard / Reports' },
                    { id: 'orders', label: 'Order Manager' },
                    { id: 'menu', label: 'Menu Designer' },
                    { id: 'tables', label: 'QR Tables' },
                    { id: 'staff', label: 'Staff' },
                    { id: 'payments', label: 'Payments' },
                    { id: 'loyalty', label: 'Loyalty' },
                    { id: 'subscriptions', label: 'Subscriptions' },
                    { id: 'reservations', label: 'Reservations' },
                    { id: 'inventory', label: 'Inventory' },
                    { id: 'ads', label: 'Marketing Ads' },
                    { id: 'marketplace', label: 'Marketplace' },
                    { id: 'settings', label: 'SaaS Plan Settings' }
                  ].map(tab => (
                    <tr key={tab.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="p-3 font-bold text-slate-900">{tab.label}</td>
                      {pricingPlans.map(plan => {
                        const isEnabled = plan.enabledTabs?.includes(tab.id);
                        return (
                          <td key={plan.id} className="p-3 text-center">
                            <button 
                              onClick={() => {
                                const newTabs = isEnabled 
                                  ? (plan.enabledTabs || []).filter(t => t !== tab.id)
                                  : [...(plan.enabledTabs || []), tab.id];
                                updatePlanTabs(plan.id, newTabs);
                              }}
                              className={`mx-auto rounded px-2.5 py-1 text-[10px] font-bold ${
                                isEnabled 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                  : 'bg-rose-50 text-rose-600 border border-rose-100'
                              }`}
                            >
                              {isEnabled ? 'ENABLED' : 'HIDDEN'}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


      {/* 8. SECURITY CENTER TAB */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-sans font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-600 animate-pulse" />
                <span>Central Security &amp; Verifications Cockpit</span>
              </h3>
              <p className="text-xs text-slate-400">Manage brand identity verification, role-based controls, and platform access rosters.</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            
            {/* COLUMN 1: Brand Verification Certs */}
            <div className="lg:col-span-1 rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <h4 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-2">
                <ShieldCheck className="h-4.5 w-4.5 text-indigo-600" />
                <span>Onboarding Brand Verifications</span>
              </h4>
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {tenants.map(t => {
                  const status = verifications[t.id] || 'Unverified';
                  return (
                    <div key={t.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">{t.name}</h5>
                          <p className="text-[10px] text-slate-400 mt-0.5">{t.ownerEmail}</p>
                        </div>
                        <span className={`rounded px-1.5 py-0.2 text-[8px] font-extrabold uppercase ${
                          status === 'Verified' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                        }`}>
                          {status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 pt-1 border-t border-slate-150">
                        <button
                          onClick={() => setViewingLicenseDoc(t.id)}
                          className="text-[10px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          License preview
                        </button>
                        <span className="text-slate-300">•</span>
                        <button
                          onClick={() => {
                            setVerifications(prev => ({
                              ...prev,
                              [t.id]: prev[t.id] === 'Verified' ? 'Unverified' : 'Verified'
                            }));
                            showToast('✓ Saved successfully. Verification status toggled.');
                          }}
                          className={`text-[10px] font-bold cursor-pointer ${status === 'Verified' ? 'text-rose-600' : 'text-emerald-600'}`}
                        >
                          {status === 'Verified' ? 'Revoke verification' : 'Verify Brand'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COLUMN 2 & 3: Platform Users list & Clearance matrix */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Users roster list */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-50 pb-2">
                  <h4 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-wider">
                    Global User Roster ({allPlatformUsers.length})
                  </h4>
                  <input
                    type="text"
                    
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold bg-white focus:outline-none"
                  />
                </div>

                <div className="overflow-x-auto max-h-[220px] overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[9px] border-b border-slate-100">
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Tenant</th>
                        <th className="p-2">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {allPlatformUsers.map((user, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/40">
                          <td className="p-2 font-bold text-slate-900">{user.name}</td>
                          <td className="p-2 font-mono text-[10px] text-slate-400">{user.email}</td>
                          <td className="p-2 text-slate-600">{user.tenantName}</td>
                          <td className="p-2">
                            <span className="bg-indigo-50 text-indigo-700 rounded px-1.5 py-0.5 text-[8px] font-bold uppercase">
                              {user.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* RBAC Clearances Checklist */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <h4 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-2">
                  Enforced RBAC Clearance Codes
                </h4>
                <div className="grid gap-3 sm:grid-cols-2 text-[11px] leading-relaxed text-slate-600">
                  {[
                    { code: 'do.all', label: 'Master Bypass', desc: 'Implicit absolute clearance.' },
                    { code: 'business.edit', label: 'Modify Profile', desc: 'Allows brand updates.' },
                    { code: 'menu.create', label: 'Create Menu Items', desc: 'Allows modifier additions.' },
                    { code: 'menu.edit', label: 'Pricing modifications', desc: 'Toggles dish prices.' }
                  ].map((perm, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg flex items-start gap-2">
                      <span className="rounded bg-indigo-50 border border-indigo-100 px-1 text-[9px] font-mono font-bold text-indigo-600 mt-0.5">{perm.code}</span>
                      <div>
                        <span className="font-bold text-slate-900 block">{perm.label}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{perm.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* LICENCE DOC PREVIEW POPUP */}
          {viewingLicenseDoc && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl border border-slate-100 space-y-4">
                <h4 className="font-sans font-bold text-sm text-slate-900 border-b border-slate-50 pb-2 flex items-center gap-1">
                  <ShieldCheck className="h-4.5 w-4.5 text-indigo-600" />
                  <span>Business License Document Preview</span>
                </h4>
                
                <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 space-y-2 text-xs font-semibold">
                  <div className="flex justify-between border-b border-slate-200/60 pb-1 text-[10px] text-slate-400 uppercase">
                    <span>Document Type</span>
                    <span>Corporate Tin Registration</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-500">Business Legal Entity:</span>
                    <span className="text-slate-800">{tenants.find(t => t.id === viewingLicenseDoc)?.name} PLC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">TIN Number:</span>
                    <span className="text-slate-800 font-mono">ET-0045239-12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Document Authority:</span>
                    <span className="text-slate-800">Ministry of Trade (Ethiopia)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status Check:</span>
                    <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded text-[9px] uppercase">Active Valid</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-50">
                  <button 
                    onClick={() => setViewingLicenseDoc(null)} 
                    className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 cursor-pointer"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 8. MARKETPLACE TAB */}
      {activeTab === 'marketplace' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div>
            <h3 className="font-sans font-bold text-sm text-slate-800">Dinex Integration Marketplace</h3>
            <p className="text-xs text-slate-400 mt-1">Activate first-party payment gateways, direct SMS modules, and accounting tools globally for SaaS consumers.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {integrations.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-200 transition-all flex flex-col justify-between">
                <div className="space-y-3.5">
                  <div className="flex justify-between items-start">
                    <span className="bg-slate-100 border border-slate-200 text-slate-500 rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase">
                      {item.type}
                    </span>
                    <span className="text-[10px] font-mono font-extrabold text-indigo-600">{item.cost}</span>
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1 font-medium">{item.desc}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.installed ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                    <span className="text-[11px] font-bold text-slate-600">{item.installed ? 'Installed (Global)' : 'Available'}</span>
                  </div>
                  <button
                    onClick={() => handleToggleIntegration(item.id)}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      item.installed 
                        ? 'bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100' 
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {item.installed ? 'Uninstall' : 'Install'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. ADVERTISEMENTS TAB */}
      {activeTab === 'advertisements' && (
        <div className="grid gap-6 lg:grid-cols-3 animate-in fade-in duration-150">
          {/* AD PUBLISHER FORM */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 self-start">
            <h3 className="font-sans font-bold text-sm text-slate-800 flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <Megaphone className="h-4 w-4 text-indigo-600" />
              Publish Restaurant Campaign Ad
            </h3>

            <form onSubmit={handlePublishAd} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Ad Title</label>
                <input
                  type="text"
                  required
                  value={adTitle}
                  onChange={(e) => setAdTitle(e.target.value)}
                  
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Subtitle / Description</label>
                <textarea
                  required
                  rows={2}
                  value={adSubtitle}
                  onChange={(e) => setAdSubtitle(e.target.value)}
                  
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Campaign Image URL</label>
                <input
                  type="url"
                  value={adImageUrl}
                  onChange={(e) => setAdImageUrl(e.target.value)}
                  
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Ad Targeting (Specific Business)</label>
                <select
                  value={adTargetTenant}
                  onChange={(e) => setAdTargetTenant(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-slate-700 bg-white focus:outline-none cursor-pointer"
                >
                  <option value="">Global Platform Wide Ad (All QR Menus)</option>
                  {tenants.map(t => (
                    <option key={t.id} value={t.id}>
                      Target: "{t.name}" Menu Only
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Publish Promotion Campaign
              </button>
            </form>
          </div>

          {/* ACTIVE CAMPAIGN STREAM */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3">
                <h3 className="font-sans font-bold text-sm text-slate-800">Published Platform Ads Directory ({ads.length})</h3>
              </div>

              <div className="divide-y divide-slate-100">
                {ads.map((ad) => {
                  const targetTenantObj = tenants.find(t => t.id === ad.tenantId);

                  return (
                    <div key={ad.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors hover:bg-slate-50/50">
                      <div className="flex items-start gap-3">
                        <img 
                          src={ad.imageUrl} 
                          alt={ad.title} 
                          className="h-16 w-24 rounded-lg border border-slate-100 object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-900">{ad.title}</span>
                            <span className={`rounded-full px-1.5 py-0.2 text-[8px] font-bold uppercase ${
                              ad.tenantId 
                                ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            }`}>
                              {ad.tenantId ? `Target: ${targetTenantObj?.name || 'Restaurant'}` : 'Global Platform Wide'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">{ad.subtitle}</p>
                          <p className="text-[9px] text-slate-400 mt-0.5">Published on {new Date(ad.createdAt).toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => {
                            toggleAdStatus(ad.id);
                            showToast('Ad status updated successfully.');
                          }}
                          className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold cursor-pointer transition-all ${
                            ad.active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {ad.active ? 'Active' : 'Paused'}
                        </button>
                        <button
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: 'Delete Ad Campaign',
                              message: `Are you sure you want to delete the campaign "${ad.title}"? This action cannot be undone.`,
                              onConfirm: () => {
                                deleteAd(ad.id);
                                setConfirmDialog(null);
                                showToast('✓ Deleted successfully.');
                              }
                            });
                          }}
                          className="rounded-lg bg-rose-50 text-rose-600 border border-rose-200 p-1 hover:bg-rose-100 transition-colors cursor-pointer"
                          title="Delete Ad"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div>
            <h3 className="font-sans font-bold text-sm text-slate-800">Platform Analytics Dashboard</h3>
            <p className="text-xs text-slate-400 mt-1">Cross-tenant platform telemetry representation of order volumes and growth trajectories.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Registrations trend */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Sign-Ups (Trailing 6 Months)</h4>
              <div className="flex items-end gap-3 h-48 pt-6">
                {[
                  { month: 'Feb', value: 2, height: 'h-1/5' },
                  { month: 'Mar', value: 4, height: 'h-2/5' },
                  { month: 'Apr', value: 7, height: 'h-3/5' },
                  { month: 'May', value: 12, height: 'h-4/5' },
                  { month: 'Jun', value: 16, height: 'h-5/6' },
                  { month: 'Jul', value: tenants.length, height: 'h-full' }
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-[10px] font-mono font-bold text-slate-500">{item.value}</span>
                    <div className={`${item.height} w-full bg-indigo-600 rounded-t-md hover:bg-indigo-700 transition-colors`}></div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Volume trend */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Platform Ticket Run (Monthly)</h4>
              <div className="flex items-end gap-3 h-48 pt-6">
                {[
                  { month: 'Feb', value: 34, height: 'h-1/4' },
                  { month: 'Mar', value: 68, height: 'h-2/5' },
                  { month: 'Apr', value: 110, height: 'h-3/5' },
                  { month: 'May', value: 175, height: 'h-4/5' },
                  { month: 'Jun', value: 240, height: 'h-5/6' },
                  { month: 'Jul', value: orders.length, height: 'h-full' }
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-[10px] font-mono font-bold text-slate-500">{item.value}</span>
                    <div className={`${item.height} w-full bg-slate-900 rounded-t-md hover:bg-slate-800 transition-colors`}></div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 13. GLOBAL SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-sans font-bold text-sm text-slate-800 flex items-center gap-1.5 border-b border-slate-150 pb-3 mb-4">
              <Settings className="h-4.5 w-4.5 text-indigo-600" />
              <span>Platform Global Configuration Parameters</span>
            </h3>

            <form onSubmit={handleSaveGlobalSettings} className="space-y-4 max-w-lg">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Default Base Tax Rate (%)</label>
                  <input
                    type="number"
                    value={globalTaxRate}
                    onChange={(e) => setGlobalTaxRate(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Global USD exchange rate (ETB)</label>
                  <input
                    type="number"
                    value={usdEtbRate}
                    onChange={(e) => setUsdEtbRate(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Supported Countries (comma separated)</label>
                <input
                  type="text"
                  value={supportedCountriesText}
                  onChange={(e) => setSupportedCountriesText(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Supported Currencies (comma separated)</label>
                <input
                  type="text"
                  value={supportedCurrenciesText}
                  onChange={(e) => setSupportedCurrenciesText(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Platform Support Routing Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">Emergency Maintenance Mode</span>
                  <span className="text-[10px] text-slate-400 leading-normal block">Place the entire platform and all checkout portals under offline maintenance.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    maintenanceMode 
                      ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm' 
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-350'
                  }`}
                >
                  {maintenanceMode ? 'ENABLED (OFFLINE)' : 'DISABLED (LIVE)'}
                </button>
              </div>

              <button
                type="submit"
                disabled={isSavingGlobalSettings}
                className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                {isSavingGlobalSettings ? 'Saving Settings...' : 'Save Configuration Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 14. AUDIT LOGS TAB */}
      {activeTab === 'audit_logs' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <h3 className="font-sans font-extrabold text-xs text-slate-850 uppercase tracking-wider flex items-center gap-1.5">
                <History className="h-4.5 w-4.5 text-indigo-600" />
                <span>Central System Security Audit Stream</span>
              </h3>
              <span className="inline-block rounded-full bg-slate-50 px-2.5 py-0.5 text-[10px] font-bold text-slate-500 animate-pulse">
                Live Server Feed
              </span>
            </div>
            
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {logs.map((log, idx) => (
                <div key={`${log.id}-${idx}`} className="rounded-lg bg-slate-50 p-3 text-xs space-y-1.5 border border-slate-100 hover:border-slate-200 hover:bg-slate-100/20 transition-all">
                  <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                    <span>{log.userEmail} ({(log.role || '').toUpperCase()})</span>
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-800 font-bold">{log.action}: {log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Banner */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl border p-4 shadow-xl animate-in slide-in-from-bottom-5 fade-in duration-300 ${
          toast.type === 'success' 
            ? 'border-emerald-100 bg-emerald-50 text-emerald-800' 
            : toast.type === 'error'
            ? 'border-rose-100 bg-rose-50 text-rose-800'
            : 'border-slate-100 bg-slate-50 text-slate-800'
        }`}>
          {toast.type === 'success' ? <Check className="h-4.5 w-4.5 bg-emerald-500 text-white rounded-full p-0.5 animate-bounce" /> : <AlertTriangle className="h-4.5 w-4.5 text-rose-500" />}
          <span className="text-xs font-bold">{toast.text}</span>
        </div>
      )}

      {/* Confirmation Dialog Modal */}
      {confirmDialog && confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-5 shadow-2xl animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-600">
              <AlertTriangle className="h-5 w-5 shrink-0 animate-pulse" />
              <h4 className="font-sans font-bold text-sm text-slate-900">{confirmDialog.title}</h4>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              {confirmDialog.message}
            </p>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
              >
                No, Cancel
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className="flex-1 rounded-lg bg-rose-600 text-white px-3 py-1.5 text-xs font-bold hover:bg-rose-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
