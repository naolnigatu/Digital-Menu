import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MealSubscriptionPlan, MenuItem } from '../types';
import { Check, Save, X, Plus, Trash2, Calendar, Clock, DollarSign, ListPlus, Edit3 } from 'lucide-react';

interface MealSubscriptionSettingsProps {
  tenantId: string;
  onClose?: () => void;
}

export default function MealSubscriptionSettings({ tenantId, onClose }: MealSubscriptionSettingsProps) {
  const { 
    mealSubscriptionPlans, 
    addMealSubscriptionPlan, 
    updateMealSubscriptionPlan, 
    deleteMealSubscriptionPlan,
    menuItems,
    tenants
  } = useApp();

  const tenant = tenants.find(t => t.id === tenantId) || tenants[0];
  const currencySymbol = tenant?.currencySymbol || '$';
  const plansList = mealSubscriptionPlans[tenantId] || [];
  const tenantMenuItems = menuItems.filter(item => item.tenantId === tenantId);

  // Editing state
  const [editingPlan, setEditingPlan] = useState<MealSubscriptionPlan | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form Fields State
  const [name, setName] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState<number>(100);
  const [discountPercentage, setDiscountPercentage] = useState<number>(20);
  const [durationDays, setDurationDays] = useState<number>(30);
  const [mealsPerDay, setMealsPerDay] = useState<number>(1);
  const [mealsPerWeek, setMealsPerWeek] = useState<number>(5);
  const [allowedOrderingTimes, setAllowedOrderingTimes] = useState('11:00-14:30');
  const [selectedMenuItemIds, setSelectedMenuItemIds] = useState<string[]>([]);
  
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState('');

  const resetForm = () => {
    setName('');
    setMonthlyPrice(100);
    setDiscountPercentage(20);
    setDurationDays(30);
    setMealsPerDay(1);
    setMealsPerWeek(5);
    setAllowedOrderingTimes('11:00-14:30');
    setSelectedMenuItemIds([]);
    setError('');
  };

  const handleStartAdd = () => {
    resetForm();
    setEditingPlan(null);
    setIsAddingNew(true);
  };

  const handleStartEdit = (plan: MealSubscriptionPlan) => {
    setEditingPlan(plan);
    setName(plan.name);
    setMonthlyPrice(plan.monthlyPrice);
    setDiscountPercentage(plan.discountPercentage);
    setDurationDays(plan.durationDays);
    setMealsPerDay(plan.mealsPerDay);
    setMealsPerWeek(plan.mealsPerWeek);
    setAllowedOrderingTimes(plan.allowedOrderingTimes);
    setSelectedMenuItemIds(plan.menuItemIds || []);
    setIsAddingNew(false);
  };

  const handleToggleMenuItem = (itemId: string) => {
    setSelectedMenuItemIds(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Plan name is required.');
      return;
    }
    if (selectedMenuItemIds.length === 0) {
      setError('Please select at least one menu item for this subscription plan.');
      return;
    }

    if (editingPlan) {
      updateMealSubscriptionPlan({
        ...editingPlan,
        name,
        monthlyPrice,
        discountPercentage,
        durationDays,
        mealsPerDay,
        mealsPerWeek,
        allowedOrderingTimes,
        menuItemIds: selectedMenuItemIds
      });
      showToast('Subscription plan updated successfully!');
    } else {
      addMealSubscriptionPlan({
        tenantId,
        name,
        monthlyPrice,
        discountPercentage,
        durationDays,
        mealsPerDay,
        mealsPerWeek,
        allowedOrderingTimes,
        menuItemIds: selectedMenuItemIds
      });
      showToast('Subscription plan created successfully!');
    }

    setEditingPlan(null);
    setIsAddingNew(false);
    resetForm();
  };

  const handleDelete = (planId: string) => {
    if (confirm('Are you sure you want to delete this meal subscription plan?')) {
      deleteMealSubscriptionPlan(tenantId, planId);
      showToast('Subscription plan deleted!');
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
            <Calendar className="w-5 h-5 text-indigo-600" />
            Meal Subscription Architect
          </h3>
          <p className="text-xs text-gray-500 mt-1">Design recurring meal plans with daily/weekly limits and eligible menu items for corporate or routine patrons.</p>
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

      <div className="p-6">
        {!isAddingNew && !editingPlan ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-900 font-semibold text-sm">Active Subscription Plans ({plansList.length})</span>
              <button
                onClick={handleStartAdd}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                Create New Plan
              </button>
            </div>

            {plansList.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400 italic border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                No meal subscription plans configured. Create a subscription plan to allow regular customers to pre-purchase dining slots.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plansList.map(plan => (
                  <div key={plan.id} className="p-4 rounded-xl border border-gray-200 bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-900 text-sm">{plan.name}</h4>
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {currencySymbol}{plan.monthlyPrice}/mo
                        </span>
                      </div>
                      
                      <div className="space-y-1.5 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{plan.durationDays} Days Duration | {plan.mealsPerDay} meal/day | {plan.mealsPerWeek} meals/week</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>Ordering Windows: <strong className="font-medium text-gray-700">{plan.allowedOrderingTimes}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ListPlus className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>Eligible Items: <strong className="font-medium text-indigo-600">{plan.menuItemIds?.length || 0} items attached</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gray-50 mt-4 justify-end">
                      <button
                        onClick={() => handleStartEdit(plan)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-md transition-colors border border-gray-200"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(plan.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSavePlan} className="space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <h4 className="font-bold text-gray-900 text-sm">
              {editingPlan ? `Edit Subscription Plan: ${editingPlan.name}` : 'Create Brand New Meal Plan'}
            </h4>

            {error && (
              <div className="p-3 bg-red-50 rounded-lg text-xs font-semibold text-red-600 border border-red-100">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="plan-name" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Plan Name
                </label>
                <input
                  id="plan-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-sm text-gray-900"
                  placeholder="e.g. Daily Power Lunch Sub"
                />
              </div>

              <div>
                <label htmlFor="monthly-price" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Monthly Subscription Fee ({currencySymbol})
                </label>
                <input
                  id="monthly-price"
                  type="number"
                  min="0"
                  value={monthlyPrice}
                  onChange={(e) => setMonthlyPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-sm text-gray-900 font-mono"
                />
              </div>

              <div>
                <label htmlFor="discount-pct" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Order Discount (%)
                </label>
                <input
                  id="discount-pct"
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-sm text-gray-900 font-mono"
                />
              </div>

              <div>
                <label htmlFor="duration-days" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Duration (Days)
                </label>
                <input
                  id="duration-days"
                  type="number"
                  min="1"
                  value={durationDays}
                  onChange={(e) => setDurationDays(parseInt(e.target.value) || 30)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-sm text-gray-900 font-mono"
                />
              </div>

              <div>
                <label htmlFor="meals-per-day" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Meals Allowed Per Day
                </label>
                <input
                  id="meals-per-day"
                  type="number"
                  min="1"
                  value={mealsPerDay}
                  onChange={(e) => setMealsPerDay(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-sm text-gray-900 font-mono"
                />
              </div>

              <div>
                <label htmlFor="meals-per-week" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Meals Allowed Per Week
                </label>
                <input
                  id="meals-per-week"
                  type="number"
                  min="1"
                  value={mealsPerWeek}
                  onChange={(e) => setMealsPerWeek(parseInt(e.target.value) || 5)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-sm text-gray-900 font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="ordering-hours" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Allowed Order Hours (e.g. 11:30-14:30)
                </label>
                <input
                  id="ordering-hours"
                  type="text"
                  value={allowedOrderingTimes}
                  onChange={(e) => setAllowedOrderingTimes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-sm text-gray-900 font-mono"
                  placeholder="e.g. 11:30-14:30, 18:00-21:00"
                />
              </div>
            </div>

            {/* Menu Items eligible */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Eligible Menu Items (Attached list)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 p-3 rounded-xl border border-gray-100 max-h-[160px] overflow-y-auto bg-gray-50/50">
                {tenantMenuItems.map(item => {
                  const isChecked = selectedMenuItemIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleToggleMenuItem(item.id)}
                      className={`px-3 py-2 text-left rounded-lg text-xs font-medium border flex items-center gap-2 transition-all ${
                        isChecked 
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-2xs' 
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 text-white ${isChecked ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </span>
                      <span className="truncate">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingPlan(null);
                  resetForm();
                }}
                className="flex-1 py-2.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                {editingPlan ? 'Update Plan' : 'Save Plan'}
              </button>
            </div>
          </form>
        )}

        {/* Success Toast */}
        {toast && (
          <div className="p-3 mt-4 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200 flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
            <Check className="w-4 h-4 bg-emerald-500 text-white rounded-full p-0.5" />
            <span>{toast}</span>
          </div>
        )}
      </div>
    </div>
  );
}
