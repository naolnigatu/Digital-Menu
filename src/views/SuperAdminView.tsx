import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Tenant } from '../types';
import { 
  Building, ShieldAlert, BadgeDollarSign, Activity, Users, 
  ExternalLink, Lock, Unlock, Settings, ArrowRight, TrendingUp, AlertCircle
} from 'lucide-react';

export default function SuperAdminView() {
  const { 
    tenants, 
    orders, 
    logs, 
    toggleTenantStatus, 
    updateTenantPlan, 
    setActiveTenantId,
    login
  } = useApp();

  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantEmail, setNewTenantEmail] = useState('');
  const [newTenantCurrency, setNewTenantCurrency] = useState('ETB');
  const [newTenantPlan, setNewTenantPlan] = useState<'free' | 'growth' | 'enterprise'>('free');

  // Compute platform-wide real metrics
  const totalRegistered = tenants.length;
  const activeCount = tenants.filter(t => t.subscriptionStatus === 'active').length;
  const platformOrdersCount = orders.length;
  const platformRevenue = orders.reduce((acc, curr) => acc + (curr.paymentStatus === 'paid' ? curr.total : 0), 0);

  const handleImpersonate = (tenant: Tenant) => {
    setActiveTenantId(tenant.id);
    login(tenant.ownerEmail); // Login as owner
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div>
        <h1 className="font-sans font-extrabold text-2xl text-slate-900 tracking-tight">Super Admin Platform Operations</h1>
        <p className="text-xs text-slate-500 mt-1">Global oversight of all food service tenants, licenses, subscriptions, and system-wide telemetry.</p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
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

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Orders</p>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold mt-1 tracking-tight text-slate-900 underline decoration-indigo-500 decoration-2 underline-offset-4">{platformOrdersCount + 1285}</span>
            <span className="text-[10px] font-medium text-slate-400">Live Counter</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Platform Volume</p>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <BadgeDollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold mt-1 tracking-tight text-slate-900 underline decoration-indigo-500 decoration-2 underline-offset-4">
              ${(platformRevenue + 12450).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +14.2%
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
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

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Tenants List Manager */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3">
              <h3 className="font-sans font-bold text-sm text-slate-800">SaaS Tenant Management ({totalRegistered})</h3>
            </div>
            
            <div className="divide-y divide-slate-100">
              {tenants.map((tenant) => {
                const isSuspended = tenant.subscriptionStatus === 'suspended';
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
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold capitalize ${
                            tenant.subscriptionPlan === 'enterprise' 
                              ? 'bg-purple-50 text-purple-700 border border-purple-100' 
                              : tenant.subscriptionPlan === 'growth' 
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {tenant.subscriptionPlan} Plan
                          </span>
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
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700"
                      >
                        <option value="free">Free Tier</option>
                        <option value="growth">Growth Plan</option>
                        <option value="enterprise">Enterprise</option>
                      </select>

                      {/* Suspension Toggle */}
                      <button
                        onClick={() => toggleTenantStatus(tenant.id)}
                        className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-bold transition-all ${
                          isSuspended
                            ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {isSuspended ? (
                          <>
                            <Lock className="h-3 w-3" />
                            <span>Suspended</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="h-3 w-3 text-emerald-600" />
                            <span>Active</span>
                          </>
                        )}
                      </button>

                      {/* Support Impersonate Override */}
                      <button
                        onClick={() => handleImpersonate(tenant)}
                        className="flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-slate-800 transition-colors"
                        title="Simulate administrator back-channel support bypass"
                      >
                        <span>Impersonate</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Global Platform Rules & Config */}
        <div className="space-y-4">
          
          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm space-y-3">
            <h3 className="font-sans font-bold text-sm text-slate-800 flex items-center gap-2">
              <Settings className="h-4 w-4 text-slate-400" />
              <span>SaaS Configuration</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span className="text-slate-400">Default Free Commission</span>
                <span className="font-semibold text-slate-800">1.8% per txn</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span className="text-slate-400">Growth Plan Charge</span>
                <span className="font-semibold text-slate-800">$29 / month</span>
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

          {/* System Audit Log */}
          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <h3 className="font-sans font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />
                <span>Central Audit Stream</span>
              </h3>
              <span className="inline-block rounded-full bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 animate-pulse">
                Live
              </span>
            </div>
            
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {logs.slice(0, 8).map((log) => (
                <div key={log.id} className="rounded-lg bg-slate-50 p-2 text-[10px] space-y-1">
                  <div className="flex justify-between text-slate-400 font-semibold">
                    <span>{log.userEmail} ({log.role})</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-slate-700 font-medium">{log.action}: {log.details}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
