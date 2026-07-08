import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Tenant } from '../types';
import BusinessOwnerView from './BusinessOwnerView';
import { 
  Building, ShieldAlert, BadgeDollarSign, Activity, Users, 
  ExternalLink, Lock, Unlock, Settings, ArrowRight, TrendingUp, 
  AlertCircle, Check, X, Megaphone, Plus, Trash2, Layers, History
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
    login
  } = useApp();

  const [activeTab, setActiveTab] = useState<'businesses' | 'directory' | 'ads' | 'telemetry' | 'pricing'>('businesses');
  const [managingTenantId, setManagingTenantId] = useState<string | null>(null);

  const [localPricingPlans, setLocalPricingPlans] = useState(pricingPlans);

  // Sync when tab changes
  React.useEffect(() => {
    setLocalPricingPlans(pricingPlans);
  }, [pricingPlans]);

  const handleSavePricing = (planId: string) => {
    const plan = localPricingPlans.find(p => p.id === planId);
    if (plan) {
      updatePlanPrice(planId, plan.priceUSD, plan.priceETB);
    }
  };

  // Ad Form States
  const [adTitle, setAdTitle] = useState('');
  const [adSubtitle, setAdSubtitle] = useState('');
  const [adImageUrl, setAdImageUrl] = useState('');
  const [adTargetTenant, setAdTargetTenant] = useState(''); // empty means global platform ad

  // Compute platform-wide real metrics
  const totalRegistered = tenants.length;
  const activeCount = tenants.filter(t => t.subscriptionStatus === 'active').length;
  const pendingCount = tenants.filter(t => t.subscriptionStatus === 'pending_approval').length;
  const platformOrdersCount = orders.length;
  const platformRevenue = orders.reduce((acc, curr) => acc + (curr.paymentStatus === 'paid' ? curr.total : 0), 0);

  const handlePublishAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle || !adSubtitle) {
      alert('Please fill in Ad Title and Subtitle.');
      return;
    }
    
    addAd({
      title: adTitle,
      subtitle: adSubtitle,
      imageUrl: adImageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
      tenantId: adTargetTenant || undefined
    });

    // Reset Form
    setAdTitle('');
    setAdSubtitle('');
    setAdImageUrl('');
    setAdTargetTenant('');
    alert('Platform Ad published successfully!');
  };

  const pendingRequests = tenants.filter(t => t.subscriptionStatus === 'pending_approval');
  const existingBusinesses = tenants.filter(t => t.subscriptionStatus !== 'pending_approval');

  if (managingTenantId) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-indigo-50 border border-indigo-200 p-3 rounded-xl shadow-sm">
           <span className="text-xs font-bold text-indigo-700 flex items-center gap-2">
             <AlertCircle className="h-4 w-4" /> 
             Super Admin Override: Managing Business Dashboard
           </span>
           <button 
             onClick={() => setManagingTenantId(null)} 
             className="text-xs font-bold bg-white text-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors"
           >
             Exit Override
           </button>
        </div>
        <BusinessOwnerView />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider">Super Admin</span>
            <span className="text-[10px] font-bold text-slate-400">naolnigatu2025@gmail.com</span>
          </div>
          <h1 className="font-sans font-extrabold text-2xl text-slate-900 tracking-tight mt-1">SaaS Platform Operations</h1>
          <p className="text-xs text-slate-500 mt-0.5">Control registrations, review pending business applications, run localized ads, and oversee active licenses.</p>
        </div>

        {/* Tab Switchers */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-center">
          <button
            onClick={() => setActiveTab('businesses')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'businesses'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertCircle className="h-3.5 w-3.5" />
            Approvals
            {pendingCount > 0 && (
              <span className="bg-amber-500 text-white rounded-full h-4 px-1 text-[9px] font-bold flex items-center justify-center animate-pulse">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'directory'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="h-3.5 w-3.5" />
            Tenants Directory
          </button>
          <button
            onClick={() => setActiveTab('ads')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ads'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Megaphone className="h-3.5 w-3.5" />
            Campaign Ads
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'pricing'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Pricing Plans
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'telemetry'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="h-3.5 w-3.5" />
            Audit & Telemetry
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div 
          onClick={() => setActiveTab('directory')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Tenants</p>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Building className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold mt-1 tracking-tight text-slate-900 underline decoration-indigo-500 decoration-2 underline-offset-4">{totalRegistered}</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              {activeCount} Active
            </span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('businesses')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pending Approvals</p>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold mt-1 tracking-tight ${pendingCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {pendingCount}
            </span>
            <span className="text-[10px] font-medium text-slate-400">Applications</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('ads')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Ads</p>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Megaphone className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold mt-1 tracking-tight text-slate-900 underline decoration-indigo-500 decoration-2 underline-offset-4">
              {ads.filter(a => a.active).length}
            </span>
            <span className="text-[10px] font-medium text-slate-400">Campaigns Running</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('telemetry')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">System Health</p>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold mt-1 tracking-tight text-slate-900 underline decoration-indigo-500 decoration-2 underline-offset-4">99.98%</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              Healthy
            </span>
          </div>
        </div>
      </div>

      {/* TAB 1: BUSINESSES & APPROVALS */}
      {activeTab === 'businesses' && (
        <div className="space-y-6">
          
          {/* PENDING APPROVAL REQUESTS */}
          {pendingRequests.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/20 shadow-sm overflow-hidden animate-pulse-subtle">
              <div className="border-b border-amber-200 bg-amber-100/40 px-4 py-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 animate-bounce" />
                <h3 className="font-sans font-extrabold text-sm text-slate-800">
                  Pending Business Registration & Upgrade Approvals ({pendingRequests.length})
                </h3>
              </div>
              
              <div className="divide-y divide-amber-200/50">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70">
                    <div className="flex items-start gap-3">
                      <div className="h-11 w-11 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 border border-amber-200 font-extrabold text-xs">
                        {request.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-slate-900">{request.name}</h4>
                          <span className="bg-amber-100 text-amber-800 rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase border border-amber-200">
                            Awaiting Approval
                          </span>
                          <span className="bg-indigo-100 text-indigo-800 rounded-full px-2.5 py-0.5 text-[8px] font-extrabold uppercase border border-indigo-200 tracking-wide animate-pulse">
                            Requested Tier: {request.subscriptionPlan.toUpperCase()}
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
                        onClick={() => approveTenantStatus(request.id)}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Approve / Accept
                      </button>
                      <button
                        onClick={() => rejectTenantStatus(request.id)}
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
          )}

        </div>
      )}

      {/* TAB: DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Tenants Directory</h2>
            <span className="bg-slate-100 text-slate-600 border border-slate-200 rounded-full px-2.5 py-0.5 text-[10px] font-bold">
              {existingBusinesses.length} Total
            </span>
          </div>

          {['enterprise', 'growth', 'free'].map(plan => {
            const tenantsInPlan = existingBusinesses.filter(t => t.subscriptionPlan === plan);
            if (tenantsInPlan.length === 0) return null;

            return (
              <div key={plan} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3 flex justify-between items-center">
                  <h3 className="font-sans font-extrabold text-sm text-slate-800 capitalize flex items-center gap-2">
                    {plan} Plan 
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      plan === 'enterprise' 
                        ? 'bg-purple-100 text-purple-700' 
                        : plan === 'growth' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {tenantsInPlan.length} Active
                    </span>
                  </h3>
                </div>
                
                <div className="divide-y divide-slate-100">
                  {tenantsInPlan.map((tenant) => {
                    const isBlocked = tenant.subscriptionStatus === 'suspended';
                    const isRejected = tenant.subscriptionStatus === 'rejected';
                    
                    const tenantSales = orders
                      .filter(o => o.tenantId === tenant.id && o.paymentStatus === 'paid')
                      .reduce((acc, curr) => acc + curr.total, 0);

                    return (
                      <div key={tenant.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-slate-50/50">
                        <div className="flex items-start gap-3">
                          <img 
                            src={tenant.logoUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=80'} 
                            alt={tenant.name} 
                            className="h-11 w-11 rounded-lg border border-slate-100 object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-slate-900">{tenant.name}</h4>
                              <span className={`rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase ${
                                tenant.subscriptionPlan === 'enterprise' 
                                  ? 'bg-purple-50 text-purple-700 border border-purple-100' 
                                  : tenant.subscriptionPlan === 'growth' 
                                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}>
                                {tenant.subscriptionPlan} Plan
                              </span>
                              {isBlocked && (
                                <span className="bg-rose-50 text-rose-700 border border-rose-100 rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase">
                                  Blocked
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

                        <div className="flex flex-wrap items-center gap-2 sm:self-center">
                          {/* Subscription Plan Overrides */}
                          <select
                            value={tenant.subscriptionPlan}
                            onChange={(e) => updateTenantPlan(tenant.id, e.target.value as Tenant['subscriptionPlan'])}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 focus:outline-none cursor-pointer"
                          >
                            <option value="free">Free Tier</option>
                            <option value="growth">Growth Plan</option>
                            <option value="enterprise">Enterprise</option>
                          </select>

                          <select
                            value={tenant.currency}
                            onChange={(e) => {
                              const currency = e.target.value;
                              const symbol = currency === 'USD' ? '$' : 'Br';
                              updateTenantCurrency(tenant.id, currency, symbol);
                            }}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 focus:outline-none cursor-pointer"
                          >
                            <option value="ETB">ETB (Br)</option>
                            <option value="USD">USD ($)</option>
                          </select>

                          {/* Suspension Toggle */}
                          <button
                            onClick={() => toggleTenantStatus(tenant.id)}
                            className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                              isBlocked
                                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            }`}
                            title={isBlocked ? 'Unlock this business workspace' : 'Temporarily suspend or block this workspace'}
                          >
                            {isBlocked ? (
                              <>
                                <Lock className="h-3 w-3" />
                                <span>Blocked (Unblock)</span>
                              </>
                            ) : (
                              <>
                                <Unlock className="h-3 w-3" />
                                <span>Active (Block)</span>
                              </>
                            )}
                          </button>

                          {/* Manage Business Override */}
                          <button
                            onClick={() => {
                              setActiveTenantId(tenant.id);
                              setManagingTenantId(tenant.id);
                            }}
                            className="flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Manage this business dashboard"
                          >
                            <Settings className="h-3 w-3" />
                            <span>Manage</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: CAMPAIGN ADS */}
      {activeTab === 'ads' && (
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* AD PUBLISHER FORM */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 self-start">
            <h3 className="font-sans font-bold text-sm text-slate-800 flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <Megaphone className="h-4 w-4 text-indigo-600 animate-pulse" />
              Run Specific Business Ad
            </h3>

            <form onSubmit={handlePublishAd} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Ad Title</label>
                <input
                  type="text"
                  required
                  value={adTitle}
                  onChange={(e) => setAdTitle(e.target.value)}
                  placeholder="e.g. 20% Off Weekend Espresso!"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Subtitle / Description</label>
                <textarea
                  required
                  rows={2}
                  value={adSubtitle}
                  onChange={(e) => setAdSubtitle(e.target.value)}
                  placeholder="e.g. Try Carlos fine espresso with amazing discount this weekend."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Campaign Image URL</label>
                <input
                  type="url"
                  value={adImageUrl}
                  onChange={(e) => setAdImageUrl(e.target.value)}
                  placeholder="e.g. https://images.unsplash.com/... or blank"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
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
                    <div key={ad.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors hover:bg-slate-50/50">
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

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button
                          onClick={() => toggleAdStatus(ad.id)}
                          className={`rounded-lg border px-2 py-1 text-[10px] font-bold cursor-pointer transition-all ${
                            ad.active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {ad.active ? 'Running (Pause)' : 'Paused (Resume)'}
                        </button>
                        <button
                          onClick={() => deleteAd(ad.id)}
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

      {activeTab === 'pricing' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-sans font-bold text-sm text-slate-800">Platform Pricing Configurations</h3>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 uppercase">Local Sync</span>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-3">
            {localPricingPlans.map(plan => (
              <div key={plan.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-sans font-bold text-sm text-slate-900">{plan.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">{plan.id}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Price (USD)</label>
                    <input
                      type="number"
                      value={plan.priceUSD}
                      onChange={(e) => setLocalPricingPlans(prev => prev.map(p => p.id === plan.id ? { ...p, priceUSD: Number(e.target.value) } : p))}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Price (ETB)</label>
                    <input
                      type="number"
                      value={plan.priceETB}
                      onChange={(e) => setLocalPricingPlans(prev => prev.map(p => p.id === plan.id ? { ...p, priceETB: Number(e.target.value) } : p))}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
                    />
                  </div>
                  <button
                    onClick={() => handleSavePricing(plan.id)}
                    className="w-full bg-indigo-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Save Changes
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs text-slate-500 leading-relaxed">{plan.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT & TELEMETRY */}
      {activeTab === 'telemetry' && (
        <div className="grid gap-6 lg:grid-cols-3">
          
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <h3 className="font-sans font-bold text-sm text-slate-800 flex items-center gap-2">
              <Settings className="h-4 w-4 text-slate-400" />
              <span>Global SaaS Configuration</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span className="text-slate-400">Default Free Commission</span>
                <span className="font-semibold text-slate-800">1.8% per txn</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span className="text-slate-400">Growth Plan Charge</span>
                <span className="font-semibold text-slate-800">${pricingPlans.find(p => p.id === 'growth')?.priceUSD} / month</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span className="text-slate-400">Enterprise SLA</span>
                <span className="font-semibold text-slate-800">99.99% Guaranteed</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span className="text-slate-400">Server Region</span>
                <span className="font-semibold text-slate-800">East Africa Core (Addis)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <h3 className="font-sans font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />
                <span>Central System Security Audit Stream</span>
              </h3>
              <span className="inline-block rounded-full bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 animate-pulse">
                Live
              </span>
            </div>
            
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {logs.map((log, idx) => (
                <div key={`${log.id}-${idx}`} className="rounded-lg bg-slate-50 p-2.5 text-[10px] space-y-1 border border-slate-100">
                  <div className="flex justify-between text-slate-400 font-bold">
                    <span>{log.userEmail} ({log.role.toUpperCase()})</span>
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-700 font-semibold">{log.action}: {log.details}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
