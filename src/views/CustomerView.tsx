import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MenuItem, OrderItem, Order, Category, PaymentMethodConfig, MealSubscriptionPlan } from '../types';
import { 
  Search, ShoppingBag, Languages, Flame, Award, Clock, ArrowRight, Star, 
  Smile, ClipboardList, CheckCircle2, ShoppingCart, User, Smartphone, MapPin, Megaphone,
  MessageSquare, RefreshCw, Sparkles, Send, Calendar, Truck, Car, Check, Heart, Lock, LogOut, Ticket,
  AlertTriangle
} from 'lucide-react';
import CustomerProfileDashboard from '../components/CustomerProfileDashboard';

import { CustomerReservationModal } from '../components/CustomerReservationModal';

export default function CustomerView() {
  const { 
    currentUser,
    tenants, 
    categories, 
    menuItems, 
    tables, 
    orders, 
    activeTenantId, 
    setActiveTenantId,
    activeBranchId,
    placeOrder, 
    currentLanguage, 
    setLanguage,
    rateAndFeedback,
    ads,
    addKitchenNote,
    customerProfiles,
    updateCustomerProfile,
    addFavoriteItem,
    removeFavoriteItem,
    customerSubscriptions,
    subscribeToMealPlan,
    mealSubscriptionPlans,
    paymentMethodsConfigs,
    loyaltyConfigs,
    updateOrderStatus,
    addTip
  } = useApp();

  const activeTenant = useMemo(() => tenants.find(t => t.id === activeTenantId) || tenants[0], [tenants, activeTenantId]);
  const activeCategories = useMemo(() => categories[activeTenantId] || [], [categories, activeTenantId]);
  const activeItems = useMemo(() => menuItems[activeTenantId] || [], [menuItems, activeTenantId]);
  const activeTables = useMemo(() => tables.filter(t => t.branchId === activeBranchId), [tables, activeBranchId]);

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTableId, setActiveTableId] = useState<string>(() => activeTables[0]?.id || '');
  const [orderType, setOrderType] = useState<string>('dine_in');
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [subscriptionPeriod, setSubscriptionPeriod] = useState('weekly');

  // New States: Account Dashboards & Auth
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isEmailLoginModalOpen, setIsEmailLoginModalOpen] = useState(false);
  const [customerEmailForDashboard, setCustomerEmailForDashboard] = useState(() => {
    return localStorage.getItem('mf_customer_logged_email') || '';
  });
  const [loginEmailInput, setLoginEmailInput] = useState('');
  const [loginNameInput, setLoginNameInput] = useState('');

  // Selected Subscription Plan during subscription checkout
  const tenantSubscriptionPlans = mealSubscriptionPlans[activeTenantId] || [];
  const [selectedSubPlanId, setSelectedSubPlanId] = useState<string>(() => tenantSubscriptionPlans[0]?.id || '');

  // Active loyalty points redemption toggle
  const [redeemPointsActive, setRedeemPointsActive] = useState(false);

  // Waiter tip selected during checkout
  const [selectedTipAmount, setSelectedTipAmount] = useState<number>(0);
  const [customTipActive, setCustomTipActive] = useState(false);
  const [customTipValue, setCustomTipValue] = useState('');

  // Stripe simulated card checkout inputs
  const [stripeCardNum, setStripeCardNum] = useState('');
  const [stripeExpiry, setStripeExpiry] = useState('');
  const [stripeCvc, setStripeCvc] = useState('');
  const [stripeProcessing, setStripeProcessing] = useState(false);

  // Customer Profile & Cart State
  const [customerName, setCustomerName] = useState(() => localStorage.getItem('mf_cust_name') || '');
  const [customerPhone, setCustomerPhone] = useState(() => localStorage.getItem('mf_cust_phone') || '');
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };
  const [pickupTime, setPickupTime] = useState('ASAP');
  const [cart, setCart] = useState<{ 
    item: MenuItem; 
    qty: number; 
    notes: string; 
    selectedMods: { groupName: string; optionName: string; price: number }[] 
  }[]>([]);

  // Auto-sync customer details from logged email profile
  React.useEffect(() => {
    if (customerEmailForDashboard && customerProfiles[customerEmailForDashboard]) {
      const p = customerProfiles[customerEmailForDashboard];
      if (p.name) setCustomerName(p.name);
      if (p.phone) setCustomerPhone(p.phone);
    }
  }, [customerEmailForDashboard, customerProfiles]);

  // Fallback default payment methods if not customized by business
  const activePaymentConfigs = paymentMethodsConfigs[activeTenantId] || [
    { id: 'cash', name: 'Cash Payment', enabled: true, requiresProof: false },
    { id: 'card', name: 'Credit/Debit Card', enabled: true, requiresProof: false },
    { id: 'stripe', name: 'Stripe Pay Online', enabled: true, requiresProof: false },
    { id: 'bank_transfer', name: 'Bank Transfer (CBE)', enabled: true, requiresProof: true, details: 'CBE: 1000123456789 (Aisha Jafar)' }
  ];
  const enabledPaymentConfigs = activePaymentConfigs.filter(c => c.enabled);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>(() => {
    return enabledPaymentConfigs[0]?.id || 'cash';
  });

  React.useEffect(() => {
    localStorage.setItem('mf_cust_name', customerName);
  }, [customerName]);

  React.useEffect(() => {
    localStorage.setItem('mf_cust_phone', customerPhone);
  }, [customerPhone]);

  // Modals & Tracking
  const [activeItemDetails, setActiveItemDetails] = useState<MenuItem | null>(null);
  const [selectedMods, setSelectedMods] = useState<{ groupName: string; optionName: string; price: number }[]>([]);
  const [itemNote, setItemNote] = useState('');
  const [itemQty, setItemQty] = useState<number>(1);
  const [paymentScreenshot, setPaymentScreenshot] = useState<string>('');
  const [paymentScreenshotName, setPaymentScreenshotName] = useState<string>('');
  const [paymentRef, setPaymentRef] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCustomerOrder, setActiveCustomerOrder] = useState<Order | null>(null);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [trackSearchQuery, setTrackSearchQuery] = useState('');
  const [trackError, setTrackError] = useState('');
  const [myOrderIds, setMyOrderIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('mf_my_orders') || '[]');
    } catch {
      return [];
    }
  });

  const saveOrderId = (id: string) => {
    setMyOrderIds(prev => {
      const next = [...new Set([...prev, id])];
      localStorage.setItem('mf_my_orders', JSON.stringify(next));
      return next;
    });
  };

  // Resolve Customer loyalty points
  const profile = customerEmailForDashboard ? (customerProfiles[customerEmailForDashboard] || { loyaltyPoints: 0, savedFavorites: [] as string[] }) : { loyaltyPoints: 0, savedFavorites: [] as string[] };
  const loyaltyConfig = loyaltyConfigs[activeTenantId];
  
  // Calculate Badge
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

  // Calculate final discount percentage
  let finalDiscountPct = badgeBonus;
  let pointsToRedeem = 0;
  if (redeemPointsActive && loyaltyConfig?.enabled && profile.loyaltyPoints >= loyaltyConfig.minPointsToRedeem) {
    finalDiscountPct += loyaltyConfig.discountPercentage;
    pointsToRedeem = loyaltyConfig.minPointsToRedeem;
  }

  // Review state
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Pre-index categories by ID for O(1) lookup during item filtering
  const categoryLookup = useMemo(() => {
    const map: Record<string, { name: string; amName: string }> = {};
    for (const c of activeCategories) {
      map[c.id] = {
        name: c.name.toLowerCase(),
        amName: c.translations?.am ? c.translations.am.toLowerCase() : ''
      };
    }
    return map;
  }, [activeCategories]);

  // Filter items
  const filteredItems = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return activeItems.filter(item => {
      const isAvail = item.availability === undefined || item.availability === 'Available';
      if (!isAvail) return false;

      const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
      if (!matchesCategory) return false;

      if (!term) return true;

      const catInfo = categoryLookup[item.categoryId];
      const catName = catInfo ? catInfo.name : '';
      const catAmName = catInfo ? catInfo.amName : '';

      return item.name.toLowerCase().includes(term) || 
             item.description.toLowerCase().includes(term) ||
             catName.includes(term) ||
             catAmName.includes(term);
    });
  }, [activeItems, categoryLookup, selectedCategory, searchTerm]);

  const getTranslatedText = (item: MenuItem) => {
    if (currentLanguage === 'am' && item.translations?.am) {
      return {
        name: item.translations.am.name,
        description: item.translations.am.description
      };
    }
    return {
      name: item.name,
      description: item.description
    };
  };

  const getTranslatedCategory = (cat: Category) => {
    if (currentLanguage === 'am' && cat.translations?.am) {
      return cat.translations.am;
    }
    return cat.name;
  };

  // Modifier modal handlers
  const handleOpenItemDetails = (item: MenuItem) => {
    setActiveItemDetails(item);
    setItemNote('');
    setItemQty(1);
    const defaults = item.modifiers
      .filter(g => !g.name.toLowerCase().includes('injera'))
      .map(g => ({
        groupName: g.name,
        optionName: g.options[0].name,
        price: g.options[0].price
      }));
    setSelectedMods(defaults);
  };

  const handleModifierToggle = (groupName: string, optionName: string, price: number) => {
    setSelectedMods(prev => {
      const alreadySelected = prev.some(m => m.groupName === groupName && m.optionName === optionName);
      const filtered = prev.filter(m => m.groupName !== groupName);
      if (alreadySelected) {
        return filtered;
      }
      return [...filtered, { groupName, optionName, price }];
    });
  };

  const handleAddToCart = () => {
    if (!activeItemDetails) return;
    setCart(prev => {
      const existingIdx = prev.findIndex(
        i => i.item.id === activeItemDetails.id && 
        JSON.stringify(i.selectedMods) === JSON.stringify(selectedMods)
      );

      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].qty += itemQty;
        return copy;
      }

      return [...prev, { 
        item: activeItemDetails, 
        qty: itemQty, 
        notes: itemNote, 
        selectedMods 
      }];
    });
    setActiveItemDetails(null);
  };

  const calculateCartTotal = () => {
    return cart.reduce((acc, curr) => {
      let itemTotal = curr.item.price;
      curr.selectedMods.forEach(m => { itemTotal += m.price; });
      return acc + (itemTotal * curr.qty);
    }, 0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentScreenshotName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPaymentScreenshot(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Process checkout order placement
  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    const chosenConfig = enabledPaymentConfigs.find(c => c.id === selectedPaymentMethodId);
    
    // Validate Prepayments
    const isPrepaidType = ['pickup', 'delivery', 'drive_through', 'meal_subscription'].includes(orderType);
    if (isPrepaidType) {
      if (!customerName.trim() || !customerPhone.trim()) {
        showToast('Please enter your name and phone details before proceeding.', 'error');
        return;
      }
      if (chosenConfig?.requiresProof && !paymentScreenshot) {
        showToast('This business requires advance payment verification. Please upload payment screenshot/receipt.', 'error');
        return;
      }
    }

    // Stripe checkout simulated processing latency
    if (selectedPaymentMethodId === 'stripe') {
      if (!stripeCardNum || !stripeExpiry || !stripeCvc) {
        showToast('Please fill out all Stripe card billing inputs.', 'error');
        return;
      }
      setStripeProcessing(true);
      setTimeout(() => {
        setStripeProcessing(false);
        executeOrderSubmission();
      }, 1500);
    } else {
      executeOrderSubmission();
    }
  };

  const executeOrderSubmission = () => {
    const chosenConfig = enabledPaymentConfigs.find(c => c.id === selectedPaymentMethodId);
    
    const orderItems: OrderItem[] = cart.map((cartItem, idx) => ({
      id: `oi-${Date.now()}-${idx}`,
      menuItemId: cartItem.item.id,
      name: cartItem.item.name,
      price: cartItem.item.price,
      quantity: cartItem.qty,
      selectedModifiers: cartItem.selectedMods,
      status: 'received',
      notes: cartItem.notes || undefined,
      assignedStationId: cartItem.item.preparationStationId
    }));

    const isPrepaidType = ['pickup', 'delivery', 'drive_through', 'meal_subscription'].includes(orderType);
    const calculatedSubtotal = calculateCartTotal();
    const discountVal = parseFloat(((calculatedSubtotal * finalDiscountPct) / 100).toFixed(2));

    const submitted = placeOrder({
      tenantId: activeTenantId,
      branchId: activeBranchId,
      tableId: orderType === 'dine_in' ? activeTableId : undefined,
      type: orderType as any,
      customerName: customerName || 'Guest User',
      customerPhone: customerPhone || undefined,
      customerEmail: customerEmailForDashboard || undefined,
      items: orderItems,
      discount: discountVal,
      subtotal: calculatedSubtotal,
      total: 0, // AppContext computes automatically
      pickupTime: ['pickup', 'takeaway'].includes(orderType) ? pickupTime : undefined,
      notes: orderType === 'delivery' ? `Delivery Address: ${deliveryAddress}` : orderType === 'drive_through' ? `Drive-thru Plate: ${licensePlate}` : orderType === 'meal_subscription' ? `Subscription Term: ${subscriptionPeriod}` : undefined,
      paymentScreenshotUrl: isPrepaidType ? (paymentScreenshot || undefined) : undefined,
      paymentVerificationStatus: selectedPaymentMethodId === 'stripe' ? 'approved' : isPrepaidType ? 'pending' : undefined,
      advancePaymentRef: isPrepaidType ? (paymentRef || undefined) : undefined,
      paymentMethod: selectedPaymentMethodId as any,
      tip: selectedTipAmount
    });

    saveOrderId(submitted.id);

    // If subscribed to meal plan
    if (orderType === 'meal_subscription' && selectedSubPlanId) {
      subscribeToMealPlan({
        customerId: customerEmailForDashboard || customerPhone || 'anonymous',
        tenantId: activeTenantId,
        planId: selectedSubPlanId,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        mealsUsedToday: 0,
        mealsUsedThisWeek: 0,
        mealsUsedTotal: 0,
        mealsRemainingTotal: 30,
        mealsPerDay: 1,
        mealsPerWeek: 5,
        nextRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    // Process customer profiles loyalty logic if logged in
    if (customerEmailForDashboard) {
      updateCustomerProfile(customerEmailForDashboard, {
        loyaltyPoints: Math.max(0, profile.loyaltyPoints + Math.floor(calculatedSubtotal * 0.05) - pointsToRedeem)
      });
    }

    // Reset checkout states
    setPaymentScreenshot('');
    setPaymentScreenshotName('');
    setPaymentRef('');
    setRedeemPointsActive(false);
    setSelectedTipAmount(0);
    setStripeCardNum('');
    setStripeExpiry('');
    setStripeCvc('');

    setActiveCustomerOrder(submitted);
    setCart([]);
    setIsCartOpen(false);
    setReviewSubmitted(false);
    setFeedback('');
    setRating(5);
  };

  const handleCustomerLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmailInput.trim()) return;
    const email = loginEmailInput.toLowerCase().trim();
    const name = loginNameInput.trim() || email.split('@')[0];
    
    localStorage.setItem('mf_customer_logged_email', email);
    setCustomerEmailForDashboard(email);
    updateCustomerProfile(email, { name });
    
    setIsEmailLoginModalOpen(false);
    setIsDashboardOpen(true);
  };

  const currentLiveOrder = activeCustomerOrder 
    ? orders.find(o => o.id === activeCustomerOrder.id) 
    : null;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLiveOrder) return;
    rateAndFeedback(currentLiveOrder.id, rating, feedback);
    setReviewSubmitted(true);
  };

  // Add/remove bookmarks
  const handleToggleFavorite = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    if (!customerEmailForDashboard) {
      setIsEmailLoginModalOpen(true);
      return;
    }
    const isFav = profile.savedFavorites?.includes(itemId);
    if (isFav) {
      removeFavoriteItem(customerEmailForDashboard, itemId);
    } else {
      addFavoriteItem(customerEmailForDashboard, itemId);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-lg mx-auto bg-slate-50/50 pb-12 rounded-3xl min-h-[85vh] shadow-inner overflow-hidden border border-slate-100">
      
      {/* 1. CUSTOMER PORTAL HEADER CONFIGS */}
      {!currentLiveOrder ? (
        <>
          <div className="bg-slate-900 text-white p-5 space-y-4 shadow-md rounded-b-2xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img 
                  src={activeTenant.logoUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=80'} 
                  alt={activeTenant.name} 
                  className="h-8 w-8 rounded-full border border-white/20 object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="font-sans font-extrabold text-sm">{activeTenant.name}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setLanguage(currentLanguage === 'en' ? 'am' : 'en')}
                  className="bg-white/10 text-white hover:bg-white/20 transition-colors border-none rounded-lg px-2.5 py-1 text-[11px] font-bold flex items-center gap-1"
                >
                  <Languages className="h-3 w-3" />
                  {currentLanguage === 'en' ? 'EN' : 'አማ'}
                </button>

                {/* Account Dashboard Toggle */}
                <button
                  onClick={() => setIsReservationModalOpen(true)}
                  className="bg-amber-600 hover:bg-amber-500 text-white transition-colors border-none rounded-lg px-3 py-1 text-[11px] font-bold flex items-center gap-1 shrink-0 shadow-xs"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  Book Table
                </button>
                <button
                  onClick={() => {
                    if (customerEmailForDashboard) {
                      setIsDashboardOpen(true);
                    } else {
                      setIsEmailLoginModalOpen(true);
                    }
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white transition-colors border-none rounded-lg px-3 py-1 text-[11px] font-bold flex items-center gap-1 shrink-0 shadow-xs"
                >
                  <User className="h-3.5 w-3.5" />
                  {customerEmailForDashboard ? 'My Profile' : 'Sign In'}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">{activeTenant.description}</p>

            <div className="space-y-3">
              {orderType === 'dine_in' && (
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Self-Serve Table</label>
                  <select
                    value={activeTableId}
                    onChange={(e) => setActiveTableId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-2.5 py-1 text-xs font-semibold mt-1"
                  >
                    {activeTables.map(t => (
                      <option key={t.id} value={t.id} className="text-slate-900">{t.number} ({t.section})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase">Dining Service Type</label>
                <div className="grid grid-cols-3 gap-1 mt-1 bg-white/5 rounded-xl p-1 border border-white/10">
                  {[
                    { id: 'dine_in', label: 'Dine-In' },
                    { id: 'takeaway', label: 'Takeaway' },
                    { id: 'delivery', label: 'Delivery' },
                    { id: 'drive_through', label: 'Drive Thru' },
                    { id: 'pickup', label: 'Pick Up' },
                    { id: 'meal_subscription', label: 'Subscription' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setOrderType(t.id)}
                      className={`py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                        orderType === t.id 
                          ? 'bg-white text-slate-900 shadow-sm' 
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {orderType === 'delivery' && (
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Delivery Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your street/apartment address..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold mt-1"
                  />
                </div>
              )}

              {orderType === 'drive_through' && (
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Vehicle License Plate</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AA 2-B34567"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold mt-1"
                  />
                </div>
              )}

              {orderType === 'meal_subscription' && (
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Available Subscription Plans</label>
                  {tenantSubscriptionPlans.length === 0 ? (
                    <p className="text-[10px] text-amber-300 italic">No recurring meal plans defined by merchant.</p>
                  ) : (
                    <select
                      value={selectedSubPlanId}
                      onChange={(e) => setSelectedSubPlanId(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-2.5 py-1 text-xs font-semibold mt-1"
                    >
                      {tenantSubscriptionPlans.map(p => (
                        <option key={p.id} value={p.id} className="text-slate-900">
                          {p.name} ({activeTenant.currencySymbol}{p.monthlyPrice}/mo, {p.mealsPerWeek} meals/wk)
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* DYNAMIC CAMPAIGN ADS BANNER */}
          {(() => {
            const activeAds = (ads || []).filter(a => a.active && (!a.tenantId || a.tenantId === activeTenantId));
            if (activeAds.length === 0) return null;
            return (
              <div className="px-4 pt-1">
                <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/85 to-purple-50/85 p-3 shadow-sm relative flex items-center gap-3 animate-in slide-in-from-top duration-300">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="bg-indigo-600 text-white font-extrabold text-[7px] uppercase tracking-wider px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shrink-0">
                        <Megaphone className="h-2 w-2 animate-pulse" /> Ad
                      </span>
                      <span className="text-[9px] font-bold text-indigo-800">Sponsor Promotion</span>
                    </div>
                    <h4 className="font-sans font-extrabold text-[11px] text-slate-900 leading-tight">
                      {activeAds[0].title}
                    </h4>
                    <p className="text-[9px] text-slate-500 leading-snug">
                      {activeAds[0].subtitle}
                    </p>
                  </div>
                  <img 
                    src={activeAds[0].imageUrl} 
                    alt={activeAds[0].title} 
                    className="h-12 w-16 rounded-xl object-cover border border-slate-100 shadow-sm shrink-0" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            );
          })()}
        </>
      ) : (
        /* Live tracker banner when order placed */
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between rounded-b-2xl">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
            <div>
              <p className="text-xs font-bold">Active Live Ticket {currentLiveOrder.orderNum}</p>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">{currentLiveOrder.status}</span>
            </div>
          </div>
          <button
            onClick={() => setActiveCustomerOrder(null)}
            className="text-[10px] font-bold text-slate-400 border border-white/10 rounded-lg px-2.5 py-1.5 hover:text-white"
          >
            Browse Menu
          </button>
        </div>
      )}

      {/* 2. ORDERING CATALOG WORKFLOW */}
      {!currentLiveOrder ? (
        <div className="px-4 space-y-4">
          
          {/* Cart launcher float button */}
          {cart.length > 0 && (
            <button
              id="cust-cart-launcher"
              onClick={() => setIsCartOpen(true)}
              className="fixed bottom-6 right-6 z-50 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl px-4 py-3 font-extrabold text-xs flex items-center gap-2 animate-bounce cursor-pointer"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              <span>Checkout Cart ({cart.length})</span>
            </button>
          )}

          {/* CUSTOMER LOYALTY CARD */}
          {(customerName || customerPhone || customerEmailForDashboard) && (
            <div className="mx-0 mt-1 p-3 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 rounded-2xl text-white flex items-center justify-between gap-3 shadow-sm border border-indigo-500/20">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-[8px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-yellow-400" />
                    <span>{activeBadge} Status</span>
                  </p>
                </div>
                <h4 className="font-sans font-extrabold text-xs text-white flex items-center gap-1.5 flex-wrap">
                  {customerName || 'Valued Patron'} 
                  {profile.loyaltyPoints >= 50 && (
                    <span className="bg-amber-400 text-slate-950 font-extrabold text-[8px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      👑 VIP Member
                    </span>
                  )}
                </h4>
                <div className="flex gap-2 items-center">
                  <p className="text-[10px] text-slate-300 leading-normal font-mono">
                    Points Balance: <strong className="text-yellow-400 font-bold">{profile.loyaltyPoints} PTS</strong>
                  </p>
                  <button 
                    onClick={() => setIsDashboardOpen(true)}
                    className="text-[9px] font-bold bg-white/10 hover:bg-white/20 text-indigo-200 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1 border border-white/5"
                  >
                    <ClipboardList className="h-3 w-3" /> Dashboard
                  </button>
                </div>
              </div>

              <div className="bg-amber-400/20 border border-amber-400/30 p-2 rounded-xl text-center shrink-0">
                <span className="text-xs font-bold text-amber-300">Extra {badgeBonus}% Off</span>
              </div>
            </div>
          )}

          {/* Search Input & Track */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={currentLanguage === 'en' ? 'Search dishes or drinks...' : 'ምግብ ወይም መጠጥ ፈልግ...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>
            <button
              onClick={() => {
                setTrackSearchQuery(customerPhone || '');
                setTrackError('');
                setIsTrackModalOpen(true);
              }}
              className="bg-slate-900 text-white px-3 py-2 rounded-xl text-[10px] font-bold shadow-sm whitespace-nowrap hover:bg-slate-800 flex items-center gap-1.5"
            >
              <ClipboardList className="h-3.5 w-3.5" />
              Track Status
            </button>
          </div>

          {/* Categories Horizontal */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold transition-all whitespace-nowrap ${
                selectedCategory === 'all' 
                  ? 'bg-slate-950 text-white shadow-xs' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {currentLanguage === 'en' ? 'All Dishes' : 'ሁሉንም ምግቦች'}
            </button>

            {activeCategories
              .filter(cat => {
                try {
                  const disabledCats = JSON.parse(localStorage.getItem('mf_disabled_categories') || '[]');
                  if (disabledCats.includes(cat.id)) return false;
                } catch {}
                return true;
              })
              .map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold transition-all whitespace-nowrap ${
                    selectedCategory === cat.id 
                      ? 'bg-slate-950 text-white shadow-xs' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {getTranslatedCategory(cat)}
                </button>
              ))}
          </div>

          {/* Items catalog list */}
          <div className="space-y-3">
            {filteredItems
              .filter(item => {
                try {
                  const disabledCats = JSON.parse(localStorage.getItem('mf_disabled_categories') || '[]');
                  if (disabledCats.includes(item.categoryId)) return false;
                } catch {}
                return true;
              })
              .map(item => {
                const info = getTranslatedText(item);
                const isAvailable = item.isAvailable !== false;
                const isFav = profile.savedFavorites?.includes(item.id);

                return (
                  <div 
                    key={item.id} 
                    onClick={isAvailable ? () => handleOpenItemDetails(item) : undefined}
                    className={`rounded-2xl border p-3 shadow-sm flex gap-3 transition-all duration-200 relative ${
                      isAvailable
                        ? 'border-slate-200 bg-white cursor-pointer hover:border-indigo-500 hover:shadow-md'
                        : 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {item.photoUrl && (
                      <img 
                        src={item.photoUrl} 
                        alt={item.name} 
                        className={`h-20 w-20 rounded-xl object-cover shrink-0 border border-slate-50 ${!isAvailable && 'grayscale'}`}
                        referrerPolicy="no-referrer"
                      />
                    )}
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-1">
                          <h4 className={`text-xs font-extrabold ${isAvailable ? 'text-slate-900' : 'text-slate-500 line-through'} flex flex-wrap items-center gap-1`}>
                            <span>{info.name}</span>
                            {item.featured && (
                              <span className="bg-amber-100 text-amber-800 text-[8px] font-extrabold px-1.5 py-0.5 rounded tracking-wider uppercase">
                                ★ Featured
                              </span>
                            )}
                            {item.recommended && (
                              <span className="bg-emerald-100 text-emerald-800 text-[8px] font-extrabold px-1.5 py-0.5 rounded tracking-wider uppercase">
                                👍 Recommended
                              </span>
                            )}
                          </h4>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Favorites Heart Bookmark (Part 9) */}
                            <button
                              type="button"
                              onClick={(e) => handleToggleFavorite(e, item.id)}
                              className="p-1 text-slate-300 hover:text-red-500 hover:scale-110 transition-all rounded-full bg-slate-50 border border-slate-100 shrink-0"
                              title="Bookmark Favorite"
                            >
                              <Heart className={`w-3.5 h-3.5 ${isFav ? 'text-red-500 fill-red-500' : ''}`} />
                            </button>
                            {isAvailable ? (
                              <span className="font-mono text-xs font-bold text-slate-900">{activeTenant.currencySymbol} {item.price}</span>
                            ) : (
                              <span className="text-[9px] font-extrabold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded uppercase">Sold Out</span>
                            )}
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">{info.description}</p>
                        {item.prepTime && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] text-slate-400 font-semibold mt-0.5 bg-slate-100 px-1.5 py-0.5 rounded">
                            ⏱ {item.prepTime} mins prep
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-2.5">
                        <div className="flex gap-1">
                          {item.dietaryTags.map(tag => (
                            <span key={tag} className="rounded-md bg-emerald-50 px-1.5 py-0.25 text-[8px] font-bold text-emerald-700">{tag}</span>
                          ))}
                        </div>
                        {isAvailable ? (
                          <span className="text-[9px] font-bold text-indigo-600 flex items-center gap-0.5">Customize <ArrowRight className="h-2.5 w-2.5" /></span>
                        ) : (
                          <span className="text-[9px] font-extrabold text-slate-400">Unavailable</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* MODIFIER OPTIONS POPUP */}
          {activeItemDetails && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-t-2xl sm:rounded-2xl bg-white p-5 shadow-2xl border border-slate-100 max-h-[80vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom-5 duration-200">
                
                <div className="flex justify-between items-start border-b border-slate-50 pb-3">
                  <div>
                    <h4 className="font-sans font-extrabold text-sm text-slate-900">{getTranslatedText(activeItemDetails).name}</h4>
                    <span className="font-mono text-xs font-extrabold text-slate-500 mt-1 block">Base Price: {activeTenant.currencySymbol} {activeItemDetails.price}</span>
                  </div>
                  <button 
                    onClick={() => setActiveItemDetails(null)}
                    className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                  >
                    Close
                  </button>
                </div>

                {/* Modifiers selector list */}
                <div className="space-y-4">
                  {activeItemDetails.modifiers.filter(g => !g.name.toLowerCase().includes('injera')).map(group => (
                    <div key={group.id} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>{group.name}</span>
                        <span className="text-amber-700">Required</span>
                      </div>
                      
                      <div className="grid gap-2">
                        {group.options.map(opt => {
                          const isSelected = selectedMods.some(m => m.groupName === group.name && m.optionName === opt.name);
                          return (
                            <button
                              key={opt.name}
                              onClick={() => handleModifierToggle(group.name, opt.name, opt.price)}
                              className={`px-3 py-2 text-left rounded-xl text-xs font-semibold border flex justify-between items-center transition-all ${
                                isSelected 
                                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-2xs' 
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                              }`}
                            >
                              <span>{opt.name}</span>
                              <span className="font-mono text-[10px] text-slate-400">+{activeTenant.currencySymbol} {opt.price}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Quantity selector */}
                  <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Quantity</span>
                    <div className="flex items-center gap-3">
                      <button 
                        type="button" 
                        onClick={() => setItemQty(prev => Math.max(1, prev - 1))}
                        className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm"
                      >
                        -
                      </button>
                      <span className="font-bold text-sm font-mono">{itemQty}</span>
                      <button 
                        type="button" 
                        onClick={() => setItemQty(prev => prev + 1)}
                        className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Special note input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block">Kitchen instructions (optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Medium rare / Extra cheese..."
                      value={itemNote}
                      onChange={(e) => setItemNote(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-indigo-600 outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 mt-4"
                >
                  <ShoppingBag className="h-4.5 w-4.5" />
                  Add to Cart
                </button>

              </div>
            </div>
          )}

          {/* SEARCH STATUS ORDER LISTING SCREEN */}
          {isTrackModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95">
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ClipboardList className="h-4 w-4 text-indigo-600" /> Track Live Cooking
                  </span>
                  <button 
                    onClick={() => setIsTrackModalOpen(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <p className="text-[10px] text-slate-500">
                    Enter a phone number or exact Order ID to track progress.
                  </p>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Phone or Order ID</label>
                    <input
                      type="text"
                      placeholder="e.g. 0911... or ORD-1234"
                      value={trackSearchQuery}
                      onChange={(e) => setTrackSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold mt-1"
                    />
                  </div>
                  {trackError && (
                    <p className="text-[10px] text-rose-600 font-bold bg-rose-50 p-1.5 rounded">{trackError}</p>
                  )}
                  <button
                    onClick={() => {
                      const query = trackSearchQuery.trim();
                      if (!query) {
                        setTrackError("Please enter a phone number or order ID.");
                        return;
                      }
                      
                      const foundOrder = orders.find(o => 
                        o.tenantId === activeTenantId && 
                        (o.customerPhone === query || o.id.includes(query) || o.orderNum.includes(query) || o.customerEmail?.toLowerCase() === query.toLowerCase())
                      );

                      if (foundOrder) {
                        setActiveCustomerOrder(foundOrder);
                        setIsTrackModalOpen(false);
                      } else {
                        setTrackError("No orders found matching your query.");
                      }
                    }}
                    className="w-full rounded-lg bg-indigo-600 text-white font-bold py-2 text-xs hover:bg-indigo-500 transition-colors"
                  >
                    Search & Track
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SHOPPING CART CHECKOUT DRAWER */}
          {isCartOpen && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-t-2xl sm:rounded-2xl bg-white p-5 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom-5">
                
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ShoppingCart className="h-4 w-4" /> Guest Checkout Cart
                  </span>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                  >
                    Close
                  </button>
                </div>

                {/* Items in Cart */}
                <div className="space-y-3.5">
                  {cart.map((c, index) => {
                    let pricePlusMods = c.item.price;
                    c.selectedMods.forEach(m => { pricePlusMods += m.price; });
                    return (
                      <div key={index} className="flex justify-between text-xs border-b border-slate-50 pb-2">
                        <div>
                          <p className="font-bold text-slate-900">{c.qty}x {getTranslatedText(c.item).name}</p>
                          <p className="text-[9px] text-amber-800 mt-0.5">{c.selectedMods.map(m => m.optionName).join(', ')}</p>
                          {c.notes && <p className="text-[10px] text-slate-400 italic">"{c.notes}"</p>}
                        </div>
                        <span className="font-bold text-slate-700 font-mono">{activeTenant.currencySymbol} {pricePlusMods * c.qty}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Contact forms */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Customer Profile Information</p>
                  
                  <div className="grid gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Your Name (e.g., Sarah)"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-gray-900"
                    />
                    <input
                      type="text"
                      placeholder="Phone (for prep notifications)"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-gray-900 font-mono"
                    />
                    {['pickup', 'delivery', 'drive_through', 'meal_subscription'].includes(orderType) && (
                      <>
                        {orderType === 'delivery' && (
                          <input
                            type="text"
                            required
                            placeholder="Street / Delivery Address"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-gray-900"
                          />
                        )}

                        {orderType === 'drive_through' && (
                          <input
                            type="text"
                            required
                            placeholder="Vehicle License Plate (e.g. AA 2-B34567)"
                            value={licensePlate}
                            onChange={(e) => setLicensePlate(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-gray-900 font-mono"
                          />
                        )}

                        {['pickup', 'takeaway'].includes(orderType) && (
                          <input
                            type="text"
                            placeholder="Pickup Time (e.g. 12:30 PM)"
                            value={pickupTime}
                            onChange={(e) => setPickupTime(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-gray-900"
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Loyalty Point Redemption Option (Part 7) */}
                {loyaltyConfig?.enabled && profile.loyaltyPoints >= loyaltyConfig.minPointsToRedeem && (
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between gap-2 text-xs">
                    <div className="space-y-0.5">
                      <span className="font-bold text-indigo-900 block">Redeem Points</span>
                      <p className="text-[10px] text-indigo-700 leading-snug">Deduct {loyaltyConfig.minPointsToRedeem} points for flat {loyaltyConfig.discountPercentage}% discount!</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRedeemPointsActive(!redeemPointsActive)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${redeemPointsActive ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-200'}`}
                    >
                      {redeemPointsActive ? 'Redeeming' : 'Redeem Now'}
                    </button>
                  </div>
                )}

                {/* Dynamic Payment Channel Selection (Part 1) */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Select Payment Method</p>
                  
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {enabledPaymentConfigs.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedPaymentMethodId(method.id)}
                        className={`p-2 rounded-xl border text-left font-semibold transition-all ${
                          selectedPaymentMethodId === method.id
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="block truncate">{method.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Payment Details / Proof Requirements (Part 2) */}
                  {(() => {
                    const chosenConfig = enabledPaymentConfigs.find(c => c.id === selectedPaymentMethodId);
                    if (!chosenConfig) return null;

                    return (
                      <div className="space-y-2 p-2.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 mt-1 animate-in fade-in duration-200">
                        {chosenConfig.requiresProof && (
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <p className="text-[9px] font-bold text-slate-400 uppercase">Pre-Arrival Advance Payment</p>
                              <div className="bg-white rounded-lg p-2 border border-slate-100 text-[10px] text-slate-800 space-y-1 shadow-xs">
                                <p className="font-bold">Coordinates for {chosenConfig.name}:</p>
                                <p className="font-mono text-indigo-700 leading-normal whitespace-pre-wrap">{chosenConfig.details || 'CBE: 1000123456789'}</p>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400 uppercase block">Upload Receipt/Screenshot</label>
                              <label className="cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 rounded-lg py-1 px-2.5 flex items-center justify-center gap-1 text-[10px] text-slate-600 transition-all font-semibold shadow-2xs">
                                <span>📁 Choose Screenshot...</span>
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={handleFileChange} 
                                  className="hidden" 
                                  required
                                />
                              </label>
                              {paymentScreenshotName && (
                                <p className="text-[9px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                                  ✓ {paymentScreenshotName}
                                </p>
                              )}
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400 uppercase block">Transaction Reference</label>
                              <input
                                type="text"
                                placeholder="e.g., CBE-TXN987"
                                value={paymentRef}
                                onChange={(e) => setPaymentRef(e.target.value)}
                                className="w-full bg-white rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-gray-900"
                              />
                            </div>
                          </div>
                        )}

                        {chosenConfig.id === 'stripe' && (
                          <div className="space-y-2.5 animate-in fade-in duration-200">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Secure Stripe Card Input</p>
                            <input
                              type="text"
                              maxLength={19}
                              placeholder="Card Number (4242 4242 ...)"
                              value={stripeCardNum}
                              onChange={(e) => setStripeCardNum(e.target.value)}
                              className="w-full bg-white rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold font-mono text-gray-900"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                maxLength={5}
                                placeholder="MM/YY"
                                value={stripeExpiry}
                                onChange={(e) => setStripeExpiry(e.target.value)}
                                className="bg-white rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold font-mono text-gray-900 text-center"
                              />
                              <input
                                type="password"
                                maxLength={3}
                                placeholder="CVC"
                                value={stripeCvc}
                                onChange={(e) => setStripeCvc(e.target.value)}
                                className="bg-white rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold font-mono text-gray-900 text-center"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Waiter Tip Selection Options (Part 6) */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Support the wait staff (Waiter Tip)</p>
                  <div className="grid grid-cols-5 gap-1.5 text-xs text-center">
                    {[0, 1, 3, 5].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setSelectedTipAmount(amt);
                          setCustomTipActive(false);
                        }}
                        className={`py-1.5 rounded-lg border font-mono font-bold transition-all ${
                          selectedTipAmount === amt && !customTipActive
                            ? 'bg-amber-500 border-amber-500 text-slate-950'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {amt === 0 ? 'No Tip' : `${activeTenant.currencySymbol}${amt}`}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setCustomTipActive(true)}
                      className={`py-1.5 rounded-lg border font-bold transition-all ${
                        customTipActive
                          ? 'bg-amber-500 border-amber-500 text-slate-950'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      Custom
                    </button>
                  </div>
                  {customTipActive && (
                    <input
                      type="number"
                      placeholder="e.g. 10"
                      value={customTipValue}
                      onChange={(e) => {
                        setCustomTipValue(e.target.value);
                        setSelectedTipAmount(parseFloat(e.target.value) || 0);
                      }}
                      className="w-full bg-slate-50 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold font-mono text-gray-900"
                    />
                  )}
                </div>

                {/* Financial Totals */}
                <div className="rounded-xl bg-slate-50 p-3 space-y-1.5 text-xs">
                  {finalDiscountPct > 0 && (
                    <div className="flex justify-between font-medium text-emerald-600">
                      <span>Loyalty / Badge Discount ({finalDiscountPct}%)</span>
                      <span>-{activeTenant.currencySymbol} {((calculateCartTotal() * finalDiscountPct) / 100).toFixed(2)}</span>
                    </div>
                  )}
                  {selectedTipAmount > 0 && (
                    <div className="flex justify-between font-medium text-amber-600 font-mono">
                      <span>Staff Support Tip</span>
                      <span>+{activeTenant.currencySymbol} {selectedTipAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-extrabold text-slate-900 text-sm">
                    <span>Cart Total Amount</span>
                    <span>{activeTenant.currencySymbol} {((calculateCartTotal() * (100 - finalDiscountPct)) / 100 + selectedTipAmount).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={stripeProcessing}
                  className="w-full rounded-lg bg-emerald-600 text-white font-extrabold py-2.5 text-xs hover:bg-emerald-500 transition-all flex items-center justify-center gap-1"
                >
                  {stripeProcessing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Simulating Card Clearing...</span>
                    </>
                  ) : (
                    <span>Place {orderType === 'dine_in' ? `Dine-in Order ${tables.find(t => t.id === activeTableId)?.number || ''}` : 'Pickup Pre-order'}</span>
                  )}
                </button>

              </div>
            </div>
          )}

        </div>
      ) : (
        /* 3. REAL-TIME LIVE PROGRESS TRACKER TIMELINE */
        <div className="px-5 space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-5">
            <div className="text-center space-y-1">
              <span className="rounded bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700 uppercase">
                {currentLiveOrder.status}
              </span>
              <h3 className="font-sans font-bold text-lg text-slate-900 mt-2">Cooking Progress Tracker</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">Watch your meal's progress in real time. Kitchen updates will trigger below instantly.</p>
            </div>

            {/* Step Timeline */}
            <div className="space-y-4 pt-2">
              {currentLiveOrder.paymentVerificationStatus === 'pending' ? (
                <div className="text-center p-4 space-y-3 bg-amber-50/50 rounded-2xl border border-amber-100 animate-pulse">
                  <span className="text-2xl">⏳</span>
                  <h4 className="font-sans font-bold text-sm text-amber-800">Awaiting Bank Transfer Verification</h4>
                  <p className="text-[11px] text-amber-700 leading-normal">
                    Your advance payment details have reached the cashier. Once your transfer is verified, your order will reach the kitchen cooks!
                  </p>
                  <div className="bg-white p-3 rounded-xl text-left border border-amber-200 text-[10px] space-y-1 mt-2 shadow-sm">
                    <p className="text-slate-400 font-bold">YOUR TRANSFER INFORMATION:</p>
                    <p className="font-semibold text-slate-700">Bank CBE Account: {activeTenant.bankAccount || '1000123456789'}</p>
                    {currentLiveOrder.advancePaymentRef && <p className="font-semibold text-slate-700">Ref ID: {currentLiveOrder.advancePaymentRef}</p>}
                    <p className="text-[9px] text-amber-600 font-bold italic mt-1">Cashier is auditing the receipt screenshot now.</p>
                  </div>
                </div>
              ) : currentLiveOrder.paymentVerificationStatus === 'rejected' ? (
                <div className="text-center p-4 space-y-3 bg-rose-50 rounded-2xl border border-rose-100">
                  <span className="text-2xl">❌</span>
                  <h4 className="font-sans font-bold text-sm text-rose-800">Payment Audit Rejected</h4>
                  <p className="text-[11px] text-rose-700 leading-normal">
                    The cashier rejected this bank transfer screenshot or transaction reference. Please place a new order.
                  </p>
                  {currentLiveOrder.notes && currentLiveOrder.notes.includes('[Rejected:') && (
                    <div className="bg-white p-2 rounded-lg text-[10px] text-rose-800 border border-rose-100 italic text-left">
                      <strong>Reason: </strong> {currentLiveOrder.notes.split('[Rejected:')[1].replace(']', '')}
                    </div>
                  )}
                  <button
                    onClick={() => setActiveCustomerOrder(null)}
                    className="mt-2 w-full rounded-lg bg-rose-950 text-white font-bold py-2 text-xs hover:bg-rose-800 transition-colors"
                  >
                    Go Back & Order Again
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Visual Progress Steps */}
                  <div className="grid grid-cols-5 gap-1 border-b border-slate-50 pb-4">
                    {[
                      { label: 'Received', status: 'pending' },
                      { label: 'Accepted', status: 'accepted' },
                      { label: 'Preparing', status: 'preparing' },
                      { label: 'Ready', status: 'ready' },
                      { label: 'Served', status: 'served' }
                    ].map((step, idx) => {
                      const statuses = ['pending', 'accepted', 'preparing', 'ready', 'served', 'completed'];
                      const stepIdx = statuses.indexOf(step.status);
                      const currentIdx = statuses.indexOf(currentLiveOrder.status);
                      const isFinished = currentIdx >= stepIdx;
                      const isCurrent = currentLiveOrder.status === step.status;

                      return (
                        <div key={idx} className="flex flex-col items-center text-center space-y-1">
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center border text-[9px] font-bold ${
                            isFinished 
                              ? 'bg-emerald-600 text-white border-emerald-600' 
                              : 'bg-slate-50 text-slate-300 border-slate-200'
                          }`}>
                            {isFinished ? '✓' : idx + 1}
                          </div>
                          <span className={`text-[8px] font-bold tracking-tight ${isCurrent ? 'text-indigo-600' : isFinished ? 'text-slate-800' : 'text-slate-400'}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Customer Delivered Check (Part 6) */}
                  {['ready', 'served', 'preparing'].includes(currentLiveOrder.status) && (
                    <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex items-center justify-between text-xs animate-pulse">
                      <div className="space-y-0.5">
                        <span className="font-bold text-indigo-900 flex items-center gap-1">
                          <Truck className="w-4 h-4 text-indigo-600" /> Confirm Delivery
                        </span>
                        <p className="text-[10px] text-indigo-700">Mark your food order as safely received!</p>
                      </div>
                      <button
                        onClick={() => {
                          updateOrderStatus(currentLiveOrder.id, 'completed', 'Customer');
                          showToast('Awesome! Your receipt is completed. Enjoy your dining!');
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs shrink-0"
                      >
                        Delivered
                      </button>
                    </div>
                  )}

                  {/* Loyalty Account Creation Prompt for Guest checkout */}
                  {showAccountPrompt && !currentUser && !customerEmailForDashboard && (
                    <div className="bg-gradient-to-r from-amber-50 to-indigo-50 border border-indigo-100 rounded-2xl p-4 space-y-3 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">✨</span>
                          <h4 className="font-sans font-extrabold text-xs text-indigo-950 uppercase">Unlock Guest Benefits</h4>
                        </div>
                        <button onClick={() => setShowAccountPrompt(false)} className="text-slate-400 hover:text-slate-600 text-[10px] font-bold">✕ Dismiss</button>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-normal font-medium">
                        Create a free account to unlock Loyalty, Meal Subscription, Saved Orders and future rewards.
                      </p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setIsEmailLoginModalOpen(true);
                            setShowAccountPrompt(false);
                          }}
                          className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 text-[10px] cursor-pointer"
                        >
                          Sign In / Register
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Approved Kitchen Notes Updates */}
                  {currentLiveOrder.kitchenNotes && currentLiveOrder.kitchenNotes.filter(n => n.approved).length > 0 && (
                    <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 space-y-1.5 text-xs">
                      <p className="font-bold text-emerald-800 flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Manager Approved Kitchen Updates</span>
                      </p>
                      <div className="divide-y divide-emerald-100/50">
                        {currentLiveOrder.kitchenNotes.filter(n => n.approved).map((note) => (
                          <p key={note.id} className="text-[11px] text-emerald-700 py-1.5 font-medium leading-relaxed">
                            💡 "{note.text}"
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Send a new Kitchen Note / Instruction */}
                  {currentLiveOrder.status !== 'completed' && currentLiveOrder.status !== 'cancelled' && (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Submit Special Instruction / Note</p>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          id="new-kitchen-note-input"
                          placeholder="e.g., Please serve tea steaming hot..."
                          className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById('new-kitchen-note-input') as HTMLInputElement;
                            const val = input?.value.trim();
                            if (val) {
                              addKitchenNote(currentLiveOrder.id, val);
                              input.value = '';
                              showToast("Special instruction sent! Manager must review and approve it.", "info");
                            }
                          }}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer whitespace-nowrap"
                        >
                          Add Note
                        </button>
                      </div>
                      <p className="text-[9px] text-slate-400 italic leading-snug">
                        * Note: To prevent kitchen chaos, custom notes are flagged for Manager approval first.
                      </p>
                    </div>
                  )}

                  {/* Detailed Order Action Log */}
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="h-3 w-3 text-indigo-500 animate-spin" />
                      <span>Detailed Order Action History Log</span>
                    </h4>
                    <div className="space-y-4 pl-2.5 border-l border-indigo-100 ml-1.5">
                      {currentLiveOrder.timeline && currentLiveOrder.timeline.length > 0 ? (
                        currentLiveOrder.timeline.map((event, idx) => (
                          <div key={event.id || idx} className="relative pl-3.5 space-y-0.5">
                            <span className="absolute left-[-14.5px] top-1.5 h-2 w-2 rounded-full bg-indigo-500 border border-white"></span>
                            <div className="flex justify-between items-center text-[11px]">
                              <p className="font-extrabold text-slate-800">{event.label}</p>
                              <span className="text-[9px] text-slate-400 font-mono">
                                {new Date(event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-normal font-medium">{event.desc}</p>
                            {event.actor && (
                              <span className="inline-block bg-slate-100 text-slate-600 font-extrabold text-[8px] px-1.5 py-0.5 rounded mt-1 uppercase tracking-wider">
                                Role: {event.actor}
                              </span>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] text-slate-400 italic">No historical timeline actions captured yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Feedback & Review Form once cooking starts */}
          {currentLiveOrder.status !== 'submitted' && (
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
              <h4 className="font-sans font-extrabold text-sm text-slate-950 flex items-center gap-1.5">
                <Smile className="h-4.5 w-4.5 text-yellow-500 animate-bounce" /> Rate Aisha's Flavors
              </h4>

              {reviewSubmitted ? (
                <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 text-center text-[11px] text-emerald-800 font-semibold space-y-1">
                  <p>✓ Feedback submitted successfully!</p>
                  <p className="font-normal">Your ratings help audit our kitchen chefs.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Portion Quality (Stars)</label>
                    <div className="flex gap-2 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star className={`h-6 w-6 ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Leave comments or reviews</label>
                    <textarea
                      required
                      placeholder="e.g. Food was absolutely sensational!"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs min-h-[50px] text-gray-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-slate-950 text-white font-bold py-2 text-xs hover:bg-slate-800 transition-colors"
                  >
                    Submit Review & Comments
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      )}

      {/* RESERVATION MODAL */}
      {isReservationModalOpen && (
        <CustomerReservationModal 
          tenantId={activeTenant.id} 
          branchId={activeBranchId} 
          onClose={() => setIsReservationModalOpen(false)} 
        />
      )}

      {/* MY ACCOUNT DASHBOARD MODAL */}
      {isDashboardOpen && customerEmailForDashboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl relative animate-in zoom-in-95 my-8">
            <button
              onClick={() => setIsDashboardOpen(false)}
              className="absolute right-4 top-4 z-50 text-slate-400 hover:text-white transition-colors bg-black/40 hover:bg-black/60 p-2 rounded-full font-bold"
              title="Close Profile"
            >
              ✕
            </button>
            <div className="max-h-[85vh] overflow-y-auto rounded-3xl">
              <CustomerProfileDashboard 
                customerEmail={customerEmailForDashboard} 
                onAddFavoriteToCart={(item) => {
                  handleOpenItemDetails(item);
                  setIsDashboardOpen(false);
                }}
              />
            </div>
            <div className="p-4 bg-gray-50 rounded-b-3xl border-t border-gray-100 flex justify-between items-center">
              <span className="text-[10px] text-gray-400">Dinex Patron Service Coordinates</span>
              <button
                onClick={() => {
                  localStorage.removeItem('mf_customer_logged_email');
                  setCustomerEmailForDashboard('');
                  setIsDashboardOpen(false);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMAIL SIGN IN / REGISTER MODAL */}
      {isEmailLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <form onSubmit={handleCustomerLoginSubmit} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95">
            <div className="text-center space-y-1">
              <span className="text-2xl">✨</span>
              <h3 className="font-sans font-bold text-base text-slate-900">Sign In to Dinex Patrons</h3>
              <p className="text-xs text-slate-400">Unlock custom reward status levels, meal subscriptions, and favorite dishes.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label htmlFor="login-email" className="block text-[10px] font-bold text-gray-400 uppercase">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  required
                  placeholder="naolnigatu2025@gmail.com"
                  value={loginEmailInput}
                  onChange={(e) => setLoginEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2 mt-1 rounded-lg border border-gray-200 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label htmlFor="login-name" className="block text-[10px] font-bold text-gray-400 uppercase">Your Name (Optional)</label>
                <input
                  id="login-name"
                  type="text"
                  placeholder="Naol Nigatu"
                  value={loginNameInput}
                  onChange={(e) => setLoginNameInput(e.target.value)}
                  className="w-full px-3.5 py-2 mt-1 rounded-lg border border-gray-200 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEmailLoginModalOpen(false)}
                  className="flex-1 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                >
                  Sign In / Register
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Toast Notification Banner */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl border p-4 shadow-xl animate-in slide-in-from-bottom-5 fade-in duration-300 ${
          toast.type === 'success' 
            ? 'border-emerald-100 bg-emerald-50 text-emerald-800' 
            : toast.type === 'error'
            ? 'border-rose-100 bg-rose-50 text-rose-800'
            : 'border-indigo-100 bg-indigo-50 text-indigo-800'
        }`}>
          {toast.type === 'success' ? (
            <Check className="h-4 w-4 bg-emerald-500 text-white rounded-full p-0.5" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          )}
          <span className="text-xs font-bold">{toast.text}</span>
        </div>
      )}

    </div>
  );
}
