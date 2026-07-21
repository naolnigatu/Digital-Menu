import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SubscriptionPlan } from '../types';
import { 
  ChefHat, ArrowLeft, User, Mail, Phone, Building2, Landmark, 
  Check, CheckCircle2, AlertCircle, Sparkles 
} from 'lucide-react';

export default function SignupPage() {
  const { registerCustomer, registerTenant, setCurrentView, pricingPlans } = useApp();
  const [activeTab, setActiveTab] = useState<'customer' | 'owner'>('customer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Customer Form State
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');

  // Business Owner Form State
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'ETB'>('ETB');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('free');

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custEmail || !custPhone) {
      setErrorMsg('Please fill in all customer signup fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setTimeout(() => {
      registerCustomer(custName, custEmail, custPhone);
      setIsSubmitting(false);
      setSuccessMsg(`Welcome, ${custName}! Your customer profile is active. Logging you in...`);
    }, 1000);
  };

  const handleOwnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !ownerEmail || !businessName) {
      setErrorMsg('Please fill in all business registration fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setTimeout(() => {
      const slug = businessName.toLowerCase().trim().replace(/\s+/g, '-');
      registerTenant({
        name: businessName,
        slug,
        description: `Welcome to ${businessName}! Explore our fine interactive digital menu.`,
        currency,
        subscriptionPlan: selectedPlan,
        ownerEmail,
        ownerName
      });
      setIsSubmitting(false);
      setSuccessMsg(`Success! Registered "${businessName}". Booting your operational dashboard...`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6 lg:px-8 relative">
      {/* Back Arrow to Login at Top Left */}
      <button 
        onClick={() => setCurrentView('login')}
        className="absolute top-6 left-6 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-100 text-slate-600 hover:text-slate-950 hover:border-slate-200 shadow-sm transition-all text-xs font-bold shrink-0"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Login
      </button>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg mb-4">
          <ChefHat className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create MenuFlow Account</h2>
        <p className="mt-2 text-xs text-slate-500 max-w-xs mx-auto">
          Choose account type below to get started. No complex credit cards required.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-100/50 space-y-6">
          
          {/* Tabs Navigation */}
          <div className="flex border-b border-slate-150 mb-4 gap-1.5 p-1 bg-slate-100/80 rounded-2xl">
            <button
              onClick={() => {
                setActiveTab('customer');
                setSuccessMsg('');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'customer'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="h-4 w-4" />
              Sign Up as Customer
            </button>
            <button
              onClick={() => {
                setActiveTab('owner');
                setSuccessMsg('');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'owner'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Building2 className="h-4 w-4" />
              Sign Up as Business Owner
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 text-xs font-medium flex gap-2.5 items-start">
              <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
              <p className="leading-normal">{errorMsg}</p>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-medium flex gap-2.5 items-start">
              <Check className="h-4 w-4 bg-emerald-500 text-white rounded-full p-0.5 shrink-0 mt-0.5" />
              <p className="leading-normal">{successMsg}</p>
            </div>
          )}

          {/* CUSTOMER REGISTRATION FORM */}
          {activeTab === 'customer' && (
            <form onSubmit={handleCustomerSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    placeholder="+251-912-3456"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-indigo-600 py-3.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                {isSubmitting ? 'Registering...' : 'Create Customer Account'}
              </button>
            </form>
          )}

          {/* BUSINESS OWNER REGISTRATION FORM */}
          {activeTab === 'owner' && (
            <form onSubmit={handleOwnerSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Your Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Owner name"
                      className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Owner Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      placeholder="owner@example.com"
                      className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Restaurant / Coffee Brand Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Gursha Traditional Kitchen"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Base Operating Currency</label>
                <div className="relative">
                  <Landmark className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as 'USD' | 'ETB')}
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-xs font-bold text-slate-700 bg-white focus:border-indigo-500 focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="ETB">ETB (Ethiopian Birr)</option>
                    <option value="USD">USD (US Dollars)</option>
                  </select>
                </div>
              </div>

              {/* Plans Radio */}
              <div className="pt-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Choose Plan Tier</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {pricingPlans.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPlan(p.id)}
                      className={`rounded-xl border p-3 flex flex-col justify-between gap-1 cursor-pointer transition-all ${
                        selectedPlan === p.id
                          ? 'border-indigo-600 bg-indigo-50/25 ring-1 ring-indigo-500'
                          : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] text-slate-800">{p.name}</span>
                        {selectedPlan === p.id && <Check className="h-3 w-3 text-indigo-600" />}
                      </div>
                      <span className="text-[10px] font-extrabold text-indigo-600">
                        {currency === 'ETB' ? `${p.priceETB} ETB/mo` : `$${p.priceUSD}/mo`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-indigo-600 py-3.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                {isSubmitting ? 'Provisioning Business...' : 'Register Business & Owner'}
              </button>
            </form>
          )}

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <button
                onClick={() => setCurrentView('login')}
                className="text-indigo-600 hover:text-indigo-500 font-bold underline cursor-pointer"
              >
                Sign in here
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
