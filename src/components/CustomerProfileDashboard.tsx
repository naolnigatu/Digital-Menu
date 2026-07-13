import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CustomerProfile, MenuItem, CustomerMealSubscription, MealSubscriptionPlan } from '../types';
import { Award, Heart, MapPin, ClipboardList, Check, Trash2, Plus, Zap, Calendar, Clock, DollarSign, UserCheck } from 'lucide-react';

interface CustomerProfileDashboardProps {
  customerEmail: string;
  onAddFavoriteToCart: (item: MenuItem) => void;
}

export default function CustomerProfileDashboard({ customerEmail, onAddFavoriteToCart }: CustomerProfileDashboardProps) {
  const { 
    customerProfiles, 
    orders, 
    customerSubscriptions, 
    mealSubscriptionPlans, 
    menuItems, 
    tenants,
    addSavedAddress,
    removeSavedAddress,
    removeFavoriteItem,
    loyaltyConfigs
  } = useApp();

  // Get active profile, or fallback to default
  const profile: CustomerProfile = customerProfiles[customerEmail] || {
    id: `cust-temp-${Date.now()}`,
    email: customerEmail,
    name: customerEmail.split('@')[0],
    phone: '',
    savedAddresses: [],
    savedFavorites: [],
    loyaltyPoints: 0,
    loyaltyHistory: []
  };

  const tenantId = 't-01'; // Default tenant
  const tenant = tenants.find(t => t.id === tenantId) || tenants[0];
  const currencySymbol = tenant?.currencySymbol || '$';

  // Active Tab
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'loyalty' | 'subscriptions' | 'favorites'>('profile');

  // Address Forms
  const [newAddressName, setNewAddressName] = useState('');
  const [newAddressValue, setNewAddressValue] = useState('');
  const [addressToast, setAddressToast] = useState('');

  // 1. Filter Orders
  const customerOrders = orders.filter(o => o.customerEmail?.toLowerCase() === customerEmail.toLowerCase());

  // 2. Filter Subscriptions
  const subscriptions = customerSubscriptions.filter(sub => sub.customerId?.toLowerCase() === customerEmail.toLowerCase() || sub.id.includes(profile.id));

  // 3. Resolve Favorites
  const favoritesList = menuItems.filter(item => profile.savedFavorites.includes(item.id));

  // Calculate Loyalty Badge
  const loyaltyConfig = loyaltyConfigs[tenantId];
  let activeBadge = 'Bronze Patron';
  let badgeBonus = 0;
  if (loyaltyConfig && loyaltyConfig.badgeLevels) {
    const sortedLevels = [...loyaltyConfig.badgeLevels].sort((a, b) => b.minPoints - a.minPoints);
    const matched = sortedLevels.find(l => profile.loyaltyPoints >= l.minPoints);
    if (matched) {
      activeBadge = matched.name;
      badgeBonus = matched.discountBonus;
    }
  }

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressName.trim() || !newAddressValue.trim()) return;
    
    addSavedAddress(customerEmail, newAddressName.trim(), newAddressValue.trim());
    setNewAddressName('');
    setNewAddressValue('');
    setAddressToast('Address added successfully!');
    setTimeout(() => setAddressToast(''), 3000);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden max-w-4xl mx-auto">
      
      {/* Profile Header */}
      <div className="bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 px-6 py-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xl border border-indigo-500/30">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-xl tracking-tight text-white">{profile.name}</h3>
            <p className="text-xs text-slate-300 font-mono">{profile.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 shrink-0">
          <Award className="w-5 h-5 text-amber-400" />
          <div className="text-left">
            <span className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest">{activeBadge}</span>
            <span className="block text-sm font-bold font-mono text-white mt-0.5">{profile.loyaltyPoints} Points</span>
          </div>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex border-b border-gray-100 bg-slate-50/50 p-2 overflow-x-auto gap-1">
        {([
          { id: 'profile', label: 'My Profile', icon: UserCheck },
          { id: 'orders', label: 'Order Receipts', icon: ClipboardList },
          { id: 'loyalty', label: 'Loyalty Rewards', icon: Award },
          { id: 'subscriptions', label: 'Meal Subscriptions', icon: Calendar },
          { id: 'favorites', label: 'Favorites', icon: Heart }
        ] as const).map(tab => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-slate-100'
              }`}
            >
              <IconComp className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-6">
        
        {/* Profile Info & Address Manager Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Personal Details */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 text-sm">Personal Telemetry</h4>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3.5 text-xs">
                  <div>
                    <span className="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1">Full Name</span>
                    <span className="text-gray-900 font-semibold text-sm">{profile.name}</span>
                  </div>
                  <div>
                    <span className="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1">Registered Phone</span>
                    <span className="text-gray-900 font-semibold font-mono text-sm">{profile.phone || 'No phone recorded'}</span>
                  </div>
                  <div>
                    <span className="block text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1">Redeemable Rewards Status</span>
                    <span className="text-emerald-600 font-semibold text-xs flex items-center gap-1.5 mt-1">
                      <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                      Extra {badgeBonus}% discount automatically unlocked via {activeBadge}!
                    </span>
                  </div>
                </div>
              </div>

              {/* Saved Addresses */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 text-sm">Saved Delivery Addresses</h4>
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {profile.savedAddresses.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-4">No delivery addresses saved yet.</p>
                  ) : (
                    profile.savedAddresses.map(addr => (
                      <div key={addr.id} className="p-3 bg-white border border-gray-100 rounded-xl flex items-center justify-between gap-3 text-xs shadow-2xs hover:border-indigo-100 transition-colors">
                        <div className="flex items-start gap-2.5">
                          <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-gray-900 block">{addr.name}</span>
                            <span className="text-gray-500 block mt-0.5">{addr.address}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeSavedAddress(customerEmail, addr.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-gray-50 shrink-0"
                          title="Delete Address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Address Form */}
                <form onSubmit={handleAddAddress} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Home"
                      value={newAddressName}
                      onChange={(e) => setNewAddressName(e.target.value)}
                      className="px-2.5 py-1.5 text-xs rounded-md border border-gray-200 bg-white text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-semibold"
                    />
                    <input
                      type="text"
                      placeholder="Address coordinates"
                      value={newAddressValue}
                      onChange={(e) => setNewAddressValue(e.target.value)}
                      className="col-span-2 px-2.5 py-1.5 text-xs rounded-md border border-gray-200 bg-white text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  
                  {addressToast && (
                    <div className="text-[10px] text-emerald-600 font-semibold">{addressToast}</div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Save Coordinates
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* Order History Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h4 className="font-bold text-gray-900 text-sm">Order receipts telemetry ({customerOrders.length})</h4>
            <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
              {customerOrders.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-8 text-center bg-gray-50 rounded-2xl">No orders have been recorded under your email.</p>
              ) : (
                customerOrders.map(order => (
                  <div key={order.id} className="p-4 bg-white border border-gray-200 rounded-2xl shadow-2xs space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-sm">{order.orderNum}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">Type: <span className="capitalize font-semibold text-gray-600">{order.type.replace('_', ' ')}</span></p>
                      </div>
                      
                      <div className="text-right">
                        <span className="font-bold font-mono text-gray-900 text-sm block">{currencySymbol}{order.total}</span>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold mt-1 uppercase tracking-wider ${
                          order.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          order.status === 'cancelled' ? 'bg-gray-100 text-gray-500' :
                          order.status === 'refunded' ? 'bg-red-50 text-red-600 border border-red-100' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/60 divide-y divide-slate-100/40 text-[11px]">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="py-1.5 flex justify-between text-gray-700">
                          <span>{it.quantity}x {it.name}</span>
                          <span className="font-mono text-gray-500">{currencySymbol}{(it.price * it.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {order.refundDetails && (
                      <div className="p-2 bg-red-50 text-red-700 rounded-lg text-[10px] border border-red-100 flex justify-between">
                        <span>Refunded: -{currencySymbol}{order.refundDetails.refundAmount}</span>
                        <span className="italic">Reason: {order.refundDetails.refundReason}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Loyalty History Tab */}
        {activeTab === 'loyalty' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h4 className="font-bold text-gray-900 text-sm">Reward Point Ledger Logs</h4>
            <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
              {profile.loyaltyHistory.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-6 text-center">No reward transactions recorded yet.</p>
              ) : (
                profile.loyaltyHistory.map(lh => (
                  <div key={lh.id} className="p-3.5 flex justify-between items-center text-xs bg-gray-50/20">
                    <div className="space-y-1">
                      <span className="font-semibold text-gray-800 block">{lh.description}</span>
                      <span className="text-[10px] text-gray-400 font-mono block">{new Date(lh.date).toLocaleDateString()} | Order {lh.orderNum || 'N/A'}</span>
                    </div>
                    <span className={`font-mono font-bold text-sm ${lh.type === 'earn' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {lh.type === 'earn' ? '+' : ''}{lh.points}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Meal Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h4 className="font-bold text-gray-900 text-sm">Active Meal Subscriptions</h4>
            
            {subscriptions.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-8 text-center bg-gray-50 rounded-2xl">
                You do not have any active meal subscription memberships. Subscribe in the dining catalog to activate.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subscriptions.map(sub => {
                  const plan = mealSubscriptionPlans[sub.tenantId]?.find(p => p.id === sub.planId);
                  return (
                    <div key={sub.id} className="p-4 bg-white border border-indigo-100 rounded-2xl shadow-xs space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-bold text-gray-900 text-sm">{plan?.name || 'Meal Plan'}</h5>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider mt-1">
                            {sub.status}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-lg">
                          Remaining: {sub.mealsRemainingTotal} meals
                        </span>
                      </div>

                      {/* Statistics Metrics */}
                      <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-center border border-slate-100">
                        <div>
                          <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Served Today</span>
                          <span className="block text-sm font-bold font-mono text-gray-900 mt-0.5">{sub.mealsUsedToday}/{sub.mealsPerDay}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Served Week</span>
                          <span className="block text-sm font-bold font-mono text-gray-900 mt-0.5">{sub.mealsUsedThisWeek}/{sub.mealsPerWeek}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Total Used</span>
                          <span className="block text-sm font-bold font-mono text-gray-900 mt-0.5">{sub.mealsUsedTotal}</span>
                        </div>
                      </div>

                      <div className="text-[10px] text-gray-400 space-y-1 font-mono">
                        <div className="flex justify-between">
                          <span>Active Period:</span>
                          <span className="text-gray-600">{new Date(sub.startDate).toLocaleDateString()} - {new Date(sub.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Next Renewal Date:</span>
                          <span className="text-gray-600">{new Date(sub.nextRenewalDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Favorites List Tab */}
        {activeTab === 'favorites' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h4 className="font-bold text-gray-900 text-sm">Saved Dining Favorites</h4>
            
            {favoritesList.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-8 text-center bg-gray-50 rounded-2xl">
                You have not flagged any items as favorites yet. Click the heart icon in the menu to bookmark dishes!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {favoritesList.map(item => (
                  <div key={item.id} className="p-3 bg-white border border-gray-100 rounded-2xl flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs transition-shadow">
                    <div className="flex items-center gap-3">
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-11 h-11 rounded-xl object-cover shrink-0" 
                          referrerPolicy="no-referrer" 
                        />
                      )}
                      <div>
                        <span className="font-bold text-gray-900 text-xs block">{item.name}</span>
                        <span className="font-mono text-[11px] text-gray-500 block mt-0.5">{currencySymbol}{item.price}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onAddFavoriteToCart(item)}
                        className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-lg transition-colors"
                      >
                        Order Now
                      </button>
                      <button
                        onClick={() => removeFavoriteItem(customerEmail, item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100"
                        title="Remove Favorite"
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
    </div>
  );
}
