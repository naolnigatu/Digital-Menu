import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MealSubscriptionPackage, MenuItem, SubscriptionConfig } from '../types';
import { Check, Save, X, Plus, Trash2, Calendar, Clock, DollarSign, ListPlus, Edit3, Settings } from 'lucide-react';

interface MealSubscriptionSettingsProps {
  tenantId: string;
  onClose?: () => void;
}

export default function MealSubscriptionSettings({ tenantId, onClose }: MealSubscriptionSettingsProps) {
  const { 
    mealSubscriptionPlans, 
    addMealSubscriptionPackage, 
    updateMealSubscriptionPackage, 
    deleteMealSubscriptionPackage,
    menuItems,
    tenants,
    updateTenant
  } = useApp();

  const tenant = tenants?.find(t => t.id === tenantId);
  const currencySymbol = tenant?.currencySymbol || '$';
  
  const packagesList = (mealSubscriptionPlans && Array.isArray(mealSubscriptionPlans[tenantId])) 
    ? mealSubscriptionPlans[tenantId] 
    : [];

  const tenantMenuItems = menuItems?.[tenantId] || [];

  const [activeTab, setActiveTab] = useState<'packages' | 'config'>('packages');

  // Config State
  const [flexibleRedemption, setFlexibleRedemption] = useState(tenant?.mealSubscriptionConfig?.flexibleRedemption ?? true);
  const [dailyRedemptionLimit, setDailyRedemptionLimit] = useState(tenant?.mealSubscriptionConfig?.dailyRedemptionLimit || 0);
  const [allowedOrderTypes, setAllowedOrderTypes] = useState<string[]>(tenant?.mealSubscriptionConfig?.allowedOrderTypes || ['dine_in', 'takeaway', 'pickup', 'delivery', 'drive_through']);

  // Package Form State
  const [editingPackage, setEditingPackage] = useState<MealSubscriptionPackage | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'fixed' | 'build_your_own'>('fixed');
  const [durationDays, setDurationDays] = useState(30);
  const [price, setPrice] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Fixed specific
  const [fixedItems, setFixedItems] = useState<{menuItemId: string, quantity: number}[]>([]);
  // BYO specific
  const [maxCredits, setMaxCredits] = useState(30);
  const [pricePerCredit, setPricePerCredit] = useState(10);
  const [eligibleMenuItemIds, setEligibleMenuItemIds] = useState<string[]>([]);

  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState('');

  const resetForm = () => {
    setName('');
    setDescription('');
    setType('fixed');
    setDurationDays(30);
    setPrice(0);
    setIsActive(true);
    setFixedItems([]);
    setMaxCredits(30);
    setPricePerCredit(10);
    setEligibleMenuItemIds([]);
    setError('');
  };

  const handleStartAdd = () => {
    resetForm();
    setEditingPackage(null);
    setIsAddingNew(true);
  };

  const handleStartEdit = (pkg: MealSubscriptionPackage) => {
    setEditingPackage(pkg);
    setName(pkg.name);
    setDescription(pkg.description);
    setType(pkg.type);
    setDurationDays(pkg.durationDays);
    setPrice(pkg.price);
    setIsActive(pkg.isActive);
    setFixedItems(pkg.items || []);
    setMaxCredits(pkg.maxCredits || 30);
    setPricePerCredit(pkg.pricePerCredit || 10);
    setEligibleMenuItemIds(pkg.eligibleMenuItemIds || []);
    setIsAddingNew(false);
  };

  const handleSaveConfig = () => {
    if (tenant) {
      updateTenant({
        ...tenant,
        mealSubscriptionConfig: {
          flexibleRedemption,
          dailyRedemptionLimit: dailyRedemptionLimit > 0 ? dailyRedemptionLimit : undefined,
          allowedOrderTypes: allowedOrderTypes as any
        }
      });
      showToast('Global settings updated!');
    }
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Name is required.');
    
    if (type === 'fixed' && fixedItems.length === 0) {
      return setError('Fixed packages require at least one item.');
    }

    if (type === 'build_your_own' && maxCredits <= 0) {
      return setError('Max credits must be greater than 0.');
    }

    const payload: Omit<MealSubscriptionPackage, 'id'> = {
      tenantId,
      name,
      description,
      type,
      durationDays,
      price,
      isActive,
      items: type === 'fixed' ? fixedItems : undefined,
      maxCredits: type === 'build_your_own' ? maxCredits : undefined,
      pricePerCredit: type === 'build_your_own' ? pricePerCredit : undefined,
      eligibleMenuItemIds: type === 'build_your_own' ? eligibleMenuItemIds : undefined
    };

    if (editingPackage) {
      updateMealSubscriptionPackage({ ...payload, id: editingPackage.id });
      showToast('Package updated successfully!');
    } else {
      addMealSubscriptionPackage(payload);
      showToast('Package created successfully!');
    }

    setEditingPackage(null);
    setIsAddingNew(false);
    resetForm();
  };

  const handleDelete = (pkgId: string) => {
    if (confirm('Are you sure you want to delete this subscription package?')) {
      deleteMealSubscriptionPackage(tenantId, pkgId);
      showToast('Package deleted!');
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleEligibleItem = (id: string) => {
    setEligibleMenuItemIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const addFixedItem = (menuItemId: string) => {
    setFixedItems(prev => {
      const exists = prev.find(i => i.menuItemId === menuItemId);
      if (exists) {
        return prev.map(i => i.menuItemId === menuItemId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { menuItemId, quantity: 1 }];
    });
  };

  const updateFixedItemQty = (menuItemId: string, delta: number) => {
    setFixedItems(prev => {
      return prev.map(i => {
        if (i.menuItemId === menuItemId) {
          const newQ = i.quantity + delta;
          return { ...i, quantity: newQ };
        }
        return i;
      }).filter(i => i.quantity > 0);
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
        <div>
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Meal Credit Subscription System
          </h3>
          <p className="text-xs text-gray-500 mt-1">Configure meal packages, flexible credits, and redemption settings.</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex border-b border-gray-100">
        <button 
          onClick={() => setActiveTab('packages')} 
          className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'packages' ? 'border-b-2 border-indigo-600 text-indigo-700 bg-indigo-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          Packages
        </button>
        <button 
          onClick={() => setActiveTab('config')} 
          className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'config' ? 'border-b-2 border-indigo-600 text-indigo-700 bg-indigo-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          Global Settings
        </button>
      </div>

      {toast && (
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 text-xs font-bold text-center border-b border-emerald-100 animate-in slide-in-from-top-2">
          {toast}
        </div>
      )}

      {activeTab === 'config' && (
        <div className="p-6 space-y-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">Redemption Rules</label>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" checked={flexibleRedemption} onChange={e => setFlexibleRedemption(e.target.checked)} className="rounded text-indigo-600" />
                Flexible Redemption (Customers can redeem multiple meals at once)
              </label>
            </div>
            {!flexibleRedemption && (
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Daily Redemption Limit</label>
                <input 
                  type="number" min="0" 
                  value={dailyRedemptionLimit} 
                  onChange={e => setDailyRedemptionLimit(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
                <p className="text-[10px] text-gray-400 mt-1">Set to 0 for no limit</p>
              </div>
            )}
            
            <button onClick={handleSaveConfig} className="bg-indigo-600 text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Save Settings
            </button>
          </div>
        </div>
      )}

      {activeTab === 'packages' && (
        <div className="p-6">
          {(isAddingNew || editingPackage) ? (
            <div className="space-y-6 max-w-3xl">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-indigo-500" />
                  {isAddingNew ? 'Create New Package' : 'Edit Package'}
                </h4>
                <button 
                  type="button"
                  onClick={() => { setIsAddingNew(false); setEditingPackage(null); resetForm(); }}
                  className="text-xs text-gray-400 hover:text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>

              {error && (
                <div className="bg-rose-50 text-rose-700 p-3 rounded-lg text-xs font-semibold border border-rose-100">
                  {error}
                </div>
              )}

              <form onSubmit={handleSavePackage} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Package Name</label>
                    <input 
                      type="text" required 
                      value={name} onChange={e => setName(e.target.value)}
                      placeholder="e.g. Monthly Lunch Bundle"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Description</label>
                    <input 
                      type="text" 
                      value={description} onChange={e => setDescription(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Package Type</label>
                    <select 
                      value={type} onChange={e => setType(e.target.value as any)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium"
                    >
                      <option value="fixed">Fixed Package (Preset Items)</option>
                      <option value="build_your_own">Build Your Own (Credit System)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Duration (Days)</label>
                    <input 
                      type="number" min="1" required 
                      value={durationDays} onChange={e => setDurationDays(Number(e.target.value))}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium"
                    />
                  </div>
                </div>

                {type === 'fixed' && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Total Package Price ({currencySymbol})</label>
                      <input 
                        type="number" min="0" required 
                        value={price} onChange={e => setPrice(Number(e.target.value))}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium bg-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">Included Items</label>
                      <div className="grid grid-cols-2 gap-2 mb-3 max-h-48 overflow-y-auto pr-2">
                        {tenantMenuItems.map(item => (
                          <button
                            key={item.id} type="button"
                            onClick={() => addFixedItem(item.id)}
                            className="text-left text-xs p-2 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 transition-colors truncate"
                          >
                            + {item.name}
                          </button>
                        ))}
                      </div>

                      {fixedItems.length > 0 && (
                        <div className="space-y-2">
                          {fixedItems.map(fi => {
                            const mi = tenantMenuItems.find(i => i.id === fi.menuItemId);
                            if (!mi) return null;
                            return (
                              <div key={fi.menuItemId} className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-200 text-sm">
                                <span className="font-bold text-slate-800">{mi.name}</span>
                                <div className="flex items-center gap-3">
                                  <button type="button" onClick={() => updateFixedItemQty(fi.menuItemId, -1)} className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200">-</button>
                                  <span className="font-mono font-bold">{fi.quantity}</span>
                                  <button type="button" onClick={() => updateFixedItemQty(fi.menuItemId, 1)} className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200">+</button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {type === 'build_your_own' && (
                  <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Max Total Credits</label>
                        <input 
                          type="number" min="1" required 
                          value={maxCredits} onChange={e => setMaxCredits(Number(e.target.value))}
                          className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Price Per Credit ({currencySymbol})</label>
                        <input 
                          type="number" min="0" required 
                          value={pricePerCredit} onChange={e => setPricePerCredit(Number(e.target.value))}
                          className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">Eligible Items (Leave empty for all)</label>
                      <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                        {tenantMenuItems.map(item => {
                          const isSelected = eligibleMenuItemIds.includes(item.id);
                          return (
                            <button
                              key={item.id} type="button"
                              onClick={() => toggleEligibleItem(item.id)}
                              className={`text-left text-xs p-2 rounded-lg border transition-colors truncate ${isSelected ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                              {item.name}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer pt-2">
                  <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="rounded text-indigo-600" />
                  Package is Active (Visible to Customers)
                </label>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                  <button 
                    type="submit"
                    className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Package
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                  <ListPlus className="w-5 h-5 text-gray-400" />
                  Configured Packages
                </h4>
                <button 
                  onClick={handleStartAdd}
                  className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create Package
                </button>
              </div>

              {packagesList.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                  <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium text-sm">No packages created yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Start by creating a fixed or build-your-own package.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {packagesList.map(pkg => (
                    <div key={pkg.id} className={`border rounded-2xl p-5 relative overflow-hidden group ${pkg.isActive ? 'border-gray-200 bg-white shadow-xs' : 'border-gray-200 bg-gray-50 opacity-80'}`}>
                      {!pkg.isActive && (
                        <div className="absolute top-0 right-0 bg-gray-200 text-gray-600 text-[9px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
                          Inactive
                        </div>
                      )}
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h5 className="font-bold text-gray-900 text-base">{pkg.name}</h5>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{pkg.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-extrabold text-indigo-700 text-lg">
                            {pkg.type === 'fixed' ? `${currencySymbol}${pkg.price}` : `${currencySymbol}${pkg.pricePerCredit}/cr`}
                          </p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                            {pkg.durationDays} Days
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 space-y-1.5 border border-gray-100 mb-4">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-500">Type</span>
                          <span className="font-bold text-gray-800">{pkg.type === 'fixed' ? 'Fixed Bundle' : 'Build Your Own'}</span>
                        </div>
                        {pkg.type === 'fixed' ? (
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-500">Items</span>
                            <span className="font-bold text-gray-800">{pkg.items?.reduce((a, b) => a + b.quantity, 0)} meals</span>
                          </div>
                        ) : (
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-500">Max Credits</span>
                            <span className="font-bold text-gray-800">{pkg.maxCredits}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-5 right-5">
                        <button 
                          onClick={() => handleStartEdit(pkg)}
                          className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                          title="Edit Plan"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(pkg.id)}
                          className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                          title="Delete Plan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
