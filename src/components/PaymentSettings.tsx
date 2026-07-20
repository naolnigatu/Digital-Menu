import React, { useState, useEffect } from 'react';
import { Save, Lock, AlertCircle, CreditCard, Wallet, Coins, Check, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PaymentMethodConfig } from '../types';

interface PaymentSettingsProps {
  tenantId: string;
  onClose?: () => void;
}

export default function PaymentSettings({ tenantId, onClose }: PaymentSettingsProps) {
  const { 
    globalSettings, 
    tenants, 
    paymentMethodsConfigs, 
    updatePaymentMethodConfig 
  } = useApp();

  const tenant = tenants.find(t => t.id === tenantId);
  const plan = tenant?.subscriptionPlan || 'free';
  const isProPlan = plan === 'growth' || plan === 'enterprise';

  // Get active payment methods allowed by platform admin (Super Admin)
  const allowedByPlatform = globalSettings.allowedPaymentMethods || [
    'cash', 'stripe', 'mobile_money', 'bank_transfer', 'binance_id', 'binance_wallet'
  ];

  // Map of static metadata for payment methods
  const paymentMethodDetails: Record<string, { label: string, icon: any, desc: string, isPremium: boolean, placeholder: string }> = {
    cash: { 
      label: 'Cash Payment', 
      icon: Coins, 
      desc: 'Diners pay in cash directly to waiter or cashier upon order delivery.', 
      isPremium: false,
      placeholder: ''
    },
    stripe: { 
      label: 'Stripe Pay Online', 
      icon: CreditCard, 
      desc: 'Accept secure digital card payments instantly via automated Stripe gateway checkout.', 
      isPremium: true,
      placeholder: 'Stripe Live Secret Key (e.g., sk_live_...)'
    },
    mobile_money: { 
      label: 'Mobile Money Transfer', 
      icon: Wallet, 
      desc: 'Accept direct phone transfers (e.g. Telebirr, CBE Birr, M-Pesa). Requires manually verifying transaction screenshot proof.', 
      isPremium: false,
      placeholder: 'e.g., Telebirr: 0911223344 (Aisha J.), CBE Birr: +251911223344'
    },
    bank_transfer: { 
      label: 'Bank Transfer (Transfer)', 
      icon: CreditCard, 
      desc: 'Accept direct bank-to-bank electronic transfers. Customers must upload transaction receipt proof for cashier verification.', 
      isPremium: false,
      placeholder: 'e.g., Commercial Bank of Ethiopia: 1000123456789 (Aisha Jafar - Bole Road Branch)'
    },
    binance_id: { 
      label: 'Binance Pay (ID)', 
      icon: Wallet, 
      desc: 'Accept fast Binance App transfers via Binance merchant Pay ID.', 
      isPremium: false,
      placeholder: 'e.g., Binance Pay ID: 88776655 (Aisha Gourmet)'
    },
    binance_wallet: { 
      label: 'Binance BEP20 Wallet (Bep20)', 
      icon: Coins, 
      desc: 'Accept direct Binance Smart Chain (BSC BEP20) stablecoin (USDT/USDC) crypto transfers. Pro plan feature.', 
      isPremium: true,
      placeholder: 'e.g., BEP20 Address: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
    }
  };

  // Fallback defaults if none configured yet
  const defaultConfigs: PaymentMethodConfig[] = [
    { id: 'cash', name: 'Cash', enabled: true, requiresProof: false },
    { id: 'stripe', name: 'Stripe', enabled: false, requiresProof: false },
    { id: 'mobile_money', name: 'Mobile Money', enabled: false, requiresProof: true, details: 'Telebirr: 0911223344' },
    { id: 'bank_transfer', name: 'Bank Transfer', enabled: false, requiresProof: true, details: 'Commercial Bank: 1000123456789' },
    { id: 'binance_id', name: 'Binance Pay (ID)', enabled: false, requiresProof: true, details: 'Binance Pay ID: 88776655' },
    { id: 'binance_wallet', name: 'Binance BEP20 Wallet', enabled: false, requiresProof: true, details: 'BEP20 Address: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F' }
  ];

  const currentConfigs = paymentMethodsConfigs[tenantId] || defaultConfigs;

  // Filter out 'card' payment methods as per strict removal mandate
  const filteredConfigs = currentConfigs.filter(c => c.id !== 'card');

  const [configs, setConfigs] = useState<PaymentMethodConfig[]>(filteredConfigs);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setConfigs(filteredConfigs);
  }, [paymentMethodsConfigs, tenantId]);

  const handleToggleEnabled = (id: string) => {
    const meta = paymentMethodDetails[id];
    if (meta?.isPremium && !isProPlan) {
      setToast({ message: `❌ "${meta.label}" is a Pro Tier payment gateway. Please upgrade your business plan under Settings.`, type: 'error' });
      return;
    }

    setConfigs(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, enabled: !c.enabled };
      }
      return c;
    }));
  };

  const handleToggleProof = (id: string) => {
    setConfigs(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, requiresProof: !c.requiresProof };
      }
      return c;
    }));
  };

  const handleDetailsChange = (id: string, value: string) => {
    setConfigs(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, details: value };
      }
      return c;
    }));
  };

  const handleSave = () => {
    // Validate Pro Plan restriction is not bypassed
    const cleanConfigs = configs.map(c => {
      const isPremium = paymentMethodDetails[c.id]?.isPremium;
      if (isPremium && !isProPlan) {
        return { ...c, enabled: false };
      }
      return c;
    });

    updatePaymentMethodConfig(tenantId, cleanConfigs);
    setToast({ message: '✓ Payment methods configuration saved successfully.', type: 'success' });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" id="payment_settings_wrapper">
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Payment Methods</h3>
          <p className="text-xs text-slate-500 mt-0.5">Configure payment options presented to your customers during digital checkout.</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
          <span>Active Plan:</span>
          <span className={`uppercase text-[10px] tracking-wide px-1.5 py-0.5 rounded ${
            isProPlan ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
          }`}>{plan}</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {toast && (
          <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{toast.message}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Active Methods allowed by platform admin */}
          {allowedByPlatform.map((methodId) => {
            const meta = paymentMethodDetails[methodId];
            if (!meta) return null;

            const config = configs.find(c => c.id === methodId) || {
              id: methodId,
              name: meta.label,
              enabled: false,
              requiresProof: false,
              details: ''
            };

            const IconComp = meta.icon;
            const isLocked = meta.isPremium && !isProPlan;

            return (
              <div 
                key={methodId} 
                className={`p-4 rounded-xl border transition-all ${
                  config.enabled 
                    ? 'border-indigo-100 bg-indigo-50/10' 
                    : isLocked 
                      ? 'border-slate-100 bg-slate-50/40 opacity-70' 
                      : 'border-slate-100 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                      config.enabled ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <IconComp className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-800 text-sm">{meta.label}</span>
                        {meta.isPremium && (
                          <span className="rounded bg-amber-100 text-amber-800 text-[8px] font-extrabold uppercase px-1.5 py-0.2 tracking-wider">
                            Pro Gateway
                          </span>
                        )}
                        {!globalSettings.allowedPaymentMethods?.includes(methodId) && (
                          <span className="rounded bg-slate-100 text-slate-500 text-[8px] font-medium px-1.5 py-0.2">
                            Allowed by Platform
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-normal max-w-xl">{meta.desc}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={isLocked}
                      onClick={() => handleToggleEnabled(methodId)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        config.enabled ? 'bg-indigo-600' : 'bg-slate-200'
                      } ${isLocked ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          config.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>

                    {isLocked && (
                      <div className="flex items-center gap-1 text-[9px] font-bold text-amber-600 uppercase">
                        <Lock className="h-3 w-3" />
                        <span>Plan Restricted</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Configuration Fields for Details & Proof verification */}
                {config.enabled && !isLocked && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3.5 animate-in slide-in-from-top-1">
                    {/* Details input for bank transfer or bep20 or mobile money */}
                    {methodId !== 'cash' && methodId !== 'stripe' && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                            Payment Settlement Credentials (Details)
                          </label>
                          <span className="text-[9px] text-indigo-600 font-semibold bg-indigo-50 px-1.5 py-0.2 rounded">
                            Required Input
                          </span>
                        </div>
                        <textarea
                          rows={2}
                          value={config.details || ''}
                          onChange={(e) => handleDetailsChange(methodId, e.target.value)}
                          placeholder={meta.placeholder}
                          className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-indigo-500 font-mono"
                        />
                        <p className="text-[10px] text-slate-400 mt-1 leading-normal flex items-start gap-1">
                          <Info className="h-3.5 w-3.5 text-slate-300 shrink-0 mt-0.5" />
                          <span>These credentials will be securely presented to the Customer at checkout. Let them know where to route funds.</span>
                        </p>
                      </div>
                    )}

                    {/* Proof screenshot toggling */}
                    {methodId !== 'cash' && methodId !== 'stripe' && (
                      <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-xs">
                          <span className="font-bold text-slate-700 block">Require Transaction Proof Receipt</span>
                          <span className="text-[10px] text-slate-400 leading-normal block">Customer must upload a transaction reference screenshot for manual cashier approval.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleProof(methodId)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            config.requiresProof 
                              ? 'bg-slate-900 border-slate-900 text-white' 
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {config.requiresProof ? '✓ Required' : 'Optional'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={handleSave}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}
