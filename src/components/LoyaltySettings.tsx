import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LoyaltyConfig } from '../types';
import { Check, Save, X, Plus, Trash2, Award, Zap } from 'lucide-react';

interface LoyaltySettingsProps {
  tenantId: string;
  onClose?: () => void;
}

export default function LoyaltySettings({ tenantId, onClose }: LoyaltySettingsProps) {
  const { loyaltyConfigs, updateLoyaltyConfig } = useApp();
  const currentConfig = loyaltyConfigs[tenantId] || {
    enabled: true,
    pointsPerPurchase: 1,
    minPointsToRedeem: 10,
    discountPercentage: 10,
    badgeLevels: []
  };

  // Local state
  const [enabled, setEnabled] = useState(currentConfig.enabled);
  const [pointsPerPurchase, setPointsPerPurchase] = useState(currentConfig.pointsPerPurchase);
  const [minPointsToRedeem, setMinPointsToRedeem] = useState(currentConfig.minPointsToRedeem);
  const [discountPercentage, setDiscountPercentage] = useState(currentConfig.discountPercentage);
  const [badgeLevels, setBadgeLevels] = useState(() => [...currentConfig.badgeLevels]);
  const [toast, setToast] = useState<string | null>(null);

  const handleAddTier = () => {
    setBadgeLevels(prev => [
      ...prev,
      { name: 'New Tier', minPoints: 100, discountBonus: 2 }
    ]);
  };

  const handleRemoveTier = (idx: number) => {
    setBadgeLevels(prev => prev.filter((_, i) => i !== idx));
  };

  const handleTierChange = (idx: number, field: 'name' | 'minPoints' | 'discountBonus', value: any) => {
    setBadgeLevels(prev => prev.map((t, i) => {
      if (i === idx) {
        return { ...t, [field]: value };
      }
      return t;
    }));
  };

  const handleSave = () => {
    // Sort tiers by points to keep neat
    const sortedTiers = [...badgeLevels].sort((a, b) => a.minPoints - b.minPoints);
    
    updateLoyaltyConfig(tenantId, {
      enabled,
      pointsPerPurchase,
      minPointsToRedeem,
      discountPercentage,
      badgeLevels: sortedTiers
    });
    
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
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500 animate-pulse" />
            Loyalty & Rewards Program
          </h3>
          <p className="text-xs text-gray-500 mt-1">Configure customer reward multiplier schemes, minimum redemption thresholds, and patron status tiers.</p>
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
        {/* Toggle Switch */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
          <div className="space-y-0.5">
            <span className="font-semibold text-gray-900 text-sm">Enable Loyalty Program</span>
            <p className="text-xs text-gray-500">Allow customers to accumulate loyalty points during transactions and redeem them for cart discounts.</p>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              enabled ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {enabled && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Core parameters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="points-per-purchase" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Points Earned Per Dollar/Birr
                </label>
                <input
                  id="points-per-purchase"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={pointsPerPurchase}
                  onChange={(e) => setPointsPerPurchase(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-transparent text-gray-900 font-mono text-sm"
                />
              </div>

              <div>
                <label htmlFor="min-points-to-redeem" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Min Points to Redeem
                </label>
                <input
                  id="min-points-to-redeem"
                  type="number"
                  min="1"
                  value={minPointsToRedeem}
                  onChange={(e) => setMinPointsToRedeem(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-transparent text-gray-900 font-mono text-sm"
                />
              </div>

              <div>
                <label htmlFor="discount-percentage" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Redemption Discount (%)
                </label>
                <input
                  id="discount-percentage"
                  type="number"
                  min="1"
                  max="100"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-transparent text-gray-900 font-mono text-sm"
                  
                />
              </div>
            </div>

            {/* Custom status levels / patron badges */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-gray-900 font-semibold text-sm">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Patron Tier Badges & Extra Discounts</span>
                </div>
                <button
                  onClick={handleAddTier}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors border border-indigo-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Badge Tier
                </button>
              </div>

              <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
                {badgeLevels.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-400 italic">
                    No custom status badge levels configured. Click "Add Badge Tier" to establish tiers.
                  </div>
                ) : (
                  badgeLevels.map((tier, idx) => (
                    <div key={idx} className="p-3.5 flex flex-wrap md:flex-nowrap items-center gap-3 bg-gray-50/40">
                      <div className="flex-1 min-w-[120px]">
                        <input
                          type="text"
                          value={tier.name}
                          onChange={(e) => handleTierChange(idx, 'name', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-md border border-gray-200 bg-white font-medium text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                          
                        />
                      </div>
                      
                      <div className="w-[110px]">
                        <input
                          type="number"
                          value={tier.minPoints}
                          onChange={(e) => handleTierChange(idx, 'minPoints', parseInt(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-md border border-gray-200 bg-white font-mono text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                          
                        />
                      </div>

                      <div className="w-[130px] flex items-center gap-1.5">
                        <input
                          type="number"
                          value={tier.discountBonus}
                          onChange={(e) => handleTierChange(idx, 'discountBonus', parseInt(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-md border border-gray-200 bg-white font-mono text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                          
                        />
                        <span className="text-xs text-gray-400">%</span>
                      </div>

                      <button
                        onClick={() => handleRemoveTier(idx)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-md hover:bg-gray-100 shrink-0"
                        title="Delete Tier"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Success Toast */}
        {toast && (
          <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200 flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
            <Check className="w-4 h-4 bg-emerald-500 text-white rounded-full p-0.5" />
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
