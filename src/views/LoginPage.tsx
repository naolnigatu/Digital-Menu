import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChefHat, ArrowLeft, Mail, AlertCircle, Sparkles, Check } from 'lucide-react';

export default function LoginPage() {
  const { login, setCurrentView } = useApp();
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    setTimeout(() => {
      const success = login(emailInput);
      setIsSubmitting(false);
      if (success) {
        setSuccessMsg('Successfully logged in! Redirecting...');
        setTimeout(() => {
          // Context's useEffect automatically pushes view to 'dashboard' upon login
        }, 1000);
      } else {
        setErrorMsg('The email entered is not registered yet. If you are a new customer or business owner, please sign up first!');
      }
    }, 800);
  };

  const handleDemoLogin = (email: string) => {
    setEmailInput(email);
    const success = login(email);
    if (success) {
      setSuccessMsg('Logged in as demo user! Redirecting...');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6 lg:px-8 relative">
      {/* Back Arrow at Top Left */}
      <button 
        onClick={() => setCurrentView('landing')}
        className="absolute top-6 left-6 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-100 text-slate-600 hover:text-slate-950 hover:border-slate-200 shadow-sm transition-all text-xs font-bold shrink-0"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </button>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg mb-4">
          <ChefHat className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sign In to MenuFlow</h2>
        <p className="mt-2 text-xs text-slate-500 max-w-xs mx-auto">
          Access your restaurant operations dashboard or customer profile instantly.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-100/50 space-y-6">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              {isSubmitting ? 'Signing In...' : 'Continue'}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Don't you have an account?{' '}
              <button
                onClick={() => setCurrentView('signup')}
                className="text-indigo-600 hover:text-indigo-500 font-bold underline cursor-pointer"
              >
                Sign up here
              </button>
            </p>
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs font-bold uppercase">
              <span className="bg-white px-2.5 text-[9px] text-slate-400 tracking-wider">Quick Demo Logins</span>
            </div>
          </div>

          {/* Quick Demo Logins Grid */}
          <div className="grid grid-cols-2 gap-2 text-left">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Business Owners & Admins</p>
              <div className="space-y-1">
                {[
                  { name: 'Platform Admin', email: 'naolnigatu2025@gmail.com' },
                  { name: 'Business Owner 1', email: 'aisha@menuflow.com' },
                  { name: 'Business Owner 2', email: 'carlos@menuflow.com' }
                ].map((demo) => (
                  <button
                    key={demo.email}
                    onClick={() => handleDemoLogin(demo.email)}
                    className="w-full text-left p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-[10px] font-medium text-slate-600 flex items-center justify-between"
                  >
                    <span>{demo.name}</span>
                    <Sparkles className="h-3 w-3 text-indigo-500 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Operational & Staff</p>
              <div className="space-y-1">
                {[
                  { name: 'Waiter Ahmed', email: 'fatima@menuflow.com' },
                  { name: 'KDS Chef Bekele', email: 'yohannes@menuflow.com' },
                  { name: 'Cashier Abera', email: 'cashier@menuflow.com' }
                ].map((demo) => (
                  <button
                    key={demo.email}
                    onClick={() => handleDemoLogin(demo.email)}
                    className="w-full text-left p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-[10px] font-medium text-slate-600 flex items-center justify-between"
                  >
                    <span>{demo.name}</span>
                    <Sparkles className="h-3 w-3 text-emerald-500 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
