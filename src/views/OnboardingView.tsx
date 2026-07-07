import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SubscriptionPlan } from '../types';
import { 
  Building2, Landmark, HelpCircle, Check, ArrowRight, ShieldCheck, ChefHat, Sparkles, AlertCircle, RefreshCw
} from 'lucide-react';

export default function OnboardingView() {
  const { registerTenant, currentUser, pricingPlans } = useApp();
  const [businessName, setBusinessName] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'ETB'>('ETB');
  const [description, setDescription] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('free');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName) {
      alert('Please fill in your restaurant or business name.');
      return;
    }
    if (!currentUser || !currentUser.email) {
      alert('You must be signed in to create a business profile.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      registerTenant({
        name: businessName,
        slug: businessName.toLowerCase().trim().replace(/\s+/g, '-'),
        description: description || `Welcome to ${businessName}! Experience our finest culinary offerings.`,
        currency,
        subscriptionPlan: selectedPlan,
        ownerEmail: currentUser.email,
        ownerName: currentUser.name || 'Owner'
      });
      setIsSubmitting(false);
    }, 1200);
  };

  const plans = pricingPlans.map(plan => ({
    id: plan.id,
    name: plan.name,
    price: currency === 'ETB' ? `${plan.priceETB} ETB/mo` : `$${plan.priceUSD}/mo`,
    description: plan.description,
    badge: plan.id === 'free' ? 'Active & Free' : 'Select to Upgrade',
    badgeColor: plan.id === 'free' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200',
  }));

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="text-center mb-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
          <Building2 className="h-6 w-6" />
        </div>
        <h1 className="font-sans font-extrabold text-2xl text-slate-900 tracking-tight">Create Your Business Profile</h1>
        <p className="text-slate-500 text-xs mt-1.5 max-w-lg mx-auto">
          Welcome, <span className="font-bold text-slate-800">{currentUser?.name}</span>! Set up your restaurant, café, or shop details to publish your interactive QR menu instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-5">
            <h3 className="font-sans font-bold text-sm text-slate-800 flex items-center gap-2">
              <ChefHat className="h-4 w-4 text-indigo-600" />
              General Business Info
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Business / Restaurant Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Habesha Gourmet, Carlos Bistro"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Base Operating Currency</label>
                  <div className="relative">
                    <Landmark className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as 'USD' | 'ETB')}
                      className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-xs font-bold text-slate-700 bg-white focus:border-indigo-500 focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="ETB">ETB (Ethiopian Birr)</option>
                      <option value="USD">USD (US Dollars)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Description (Tagline)</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Premium traditional coffee & delicacies"
                    className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Plans Grid */}
              <div className="pt-4">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3">Choose Your Launch Plan</label>
                <div className="grid gap-3">
                  {plans.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPlan(p.id)}
                      className={`relative rounded-xl border p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 transition-all ${
                        selectedPlan === p.id
                          ? 'border-indigo-600 bg-indigo-50/20 ring-1 ring-indigo-500'
                          : 'border-slate-200 bg-white hover:border-slate-300 cursor-pointer'
                      }`}
                    >
                      <div className="space-y-1 max-w-md">
                        <div className="flex items-center gap-2">
                          <span className="font-sans font-extrabold text-xs text-slate-800">{p.name}</span>
                          <span className={`rounded-full border px-2 py-0.5 text-[8px] font-bold ${p.badgeColor}`}>
                            {p.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal">{p.description}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="block font-sans font-extrabold text-sm text-slate-900">{p.price}</span>
                        {selectedPlan === p.id && (
                          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-white mt-1">
                            <Check className="h-2.5 w-2.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 rounded-xl bg-indigo-600 py-3.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Submitting Profile for Admin Review...
                  </>
                ) : (
                  <>
                    Submit Business Profile
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Platform Standards */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5 space-y-4">
            <h4 className="font-sans font-bold text-xs text-indigo-950 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              MenuFlow Platform Guarantee
            </h4>
            
            <ul className="space-y-3 text-[11px] text-indigo-900/80 leading-relaxed">
              <li className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span><strong>100% Free Menu Service</strong>: Get an elegant QR code menu with zero setup fee, no hidden commissions, and instant mobile-optimized view.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span><strong>Instant QR Generation</strong>: Print highly customizable branch QR codes for your tables as soon as you add dishes.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span><strong>Upgrade on Demand</strong>: Upgrade to premium at any time to unlock waiter tables placement, cashier terminals, and real-time cooking screens.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center space-y-3">
            <ShieldCheck className="h-8 w-8 text-indigo-600 mx-auto" />
            <h4 className="font-sans font-extrabold text-xs text-slate-800">Registration Process</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              To guarantee absolute platform quality, brand profiles undergo a quick review by the platform administrator <strong>naolnigatu2025@gmail.com</strong>. Approvals are typical within minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
