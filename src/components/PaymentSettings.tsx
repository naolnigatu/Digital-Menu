import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMethodConfig } from '../types';
import { Check, ShieldCheck, HelpCircle, Save, X, ToggleLeft, ToggleRight, Info } from 'lucide-react';

interface PaymentSettingsProps {
  tenantId: string;
  onClose?: () => void;
}

export default function PaymentSettings({ tenantId, onClose }: PaymentSettingsProps) {
  const { paymentMethodsConfigs, updatePaymentMethodConfig } = useApp();
  const currentConfigs = paymentMethodsConfigs[tenantId] || [];

  // Local state for configuration modifications
  const [configs, setConfigs] = useState<PaymentMethodConfig[]>(() => {
    return JSON.parse(JSON.stringify(currentConfigs));
  });

  const [toast, setToast] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setConfigs(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, enabled: !c.enabled };
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
    updatePaymentMethodConfig(tenantId, configs);
    showToast('✓ Saved successfully.');
    if (onClose) {
      setTimeout(onClose, 800);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Payment Engine Configuration</h3>
          <p className="text-xs text-gray-500 mt-1">Configure accepted payment methods and account coordinates for your business.</p>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {configs.map((method) => {
            const hasDetails = method.requiresProof;

            return (
              <div 
                key={method.id} 
                className={`p-4 rounded-xl border transition-all ${
                  method.enabled 
                    ? 'border-indigo-100 bg-indigo-50/10' 
                    : 'border-gray-200 bg-gray-50/50 grayscale opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">{method.name}</span>
                      {method.requiresProof && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <ShieldCheck className="w-3 h-3" />
                          Requires Screenshot Proof
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {method.id === 'cash' && 'In-person payments completed directly with cashiers.'}
                      {method.id === 'card' && 'In-person POS terminal card swaps (Visa, Mastercard, etc.)'}
                      {method.id === 'stripe' && 'Automated card payments processed instantly on checkout.'}
                      {method.id === 'mobile_money' && 'Mobile money transfers. Customer will upload a transfer screenshot.'}
                      {method.id === 'bank_transfer' && 'Direct wire transfers to your bank coordinates.'}
                      {method.id === 'binance_id' && 'Instant Binance Pay transfers using customized merchant ID.'}
                      {method.id === 'binance_wallet' && 'BEP20 network tokens deposited directly to your cold storage.'}
                    </p>
                  </div>

                  <button 
                    onClick={() => handleToggle(method.id)}
                    className="shrink-0 transition-colors focus:outline-hidden p-1 rounded-lg"
                    aria-label={`Toggle ${method.name}`}
                  >
                    {method.enabled ? (
                      <ToggleRight className="w-12 h-8 text-indigo-600 cursor-pointer" />
                    ) : (
                      <ToggleLeft className="w-12 h-8 text-gray-300 cursor-pointer" />
                    )}
                  </button>
                </div>

                {method.enabled && hasDetails && (
                  <div className="mt-3.5 pt-3 border-t border-dashed border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200">
                    <label htmlFor={`details-${method.id}`} className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-gray-400" />
                      Recipient Coordinates / Instructions
                    </label>
                    <textarea
                      id={`details-${method.id}`}
                      rows={2}
                      value={method.details || ''}
                      onChange={(e) => handleDetailsChange(method.id, e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-transparent font-mono text-gray-900 bg-white"
                      placeholder="e.g., Bank Name: CBE | Account Number: 1000... | Name: Dinex Corp"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Floating Success Toast */}
        {toast && (
          <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200 flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
            <Check className="w-4 h-4 shrink-0 bg-emerald-500 text-white rounded-full p-0.5" />
            <span>{toast}</span>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          {onClose && (
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
