import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MenuItem, OrderItem, Order, Category } from '../types';
import { 
  Search, ShoppingBag, Languages, Flame, Award, Clock, ArrowRight, Star, 
  Smile, ClipboardList, CheckCircle2, ShoppingCart, User, Smartphone, MapPin, Megaphone
} from 'lucide-react';

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
    ads
  } = useApp();

  const activeTenant = tenants.find(t => t.id === activeTenantId) || tenants[0];
  const activeCategories = categories[activeTenantId] || [];
  const activeItems = menuItems[activeTenantId] || [];
  const activeTables = tables.filter(t => t.branchId === activeBranchId);

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTableId, setActiveTableId] = useState<string>(() => activeTables[0]?.id || '');
  const [orderType, setOrderType] = useState<'dine_in' | 'pickup'>('dine_in');

  // Customer Profile & Cart State
  const [customerName, setCustomerName] = useState(() => localStorage.getItem('mf_cust_name') || '');
  const [customerPhone, setCustomerPhone] = useState(() => localStorage.getItem('mf_cust_phone') || '');
  const [pickupTime, setPickupTime] = useState('ASAP');
  const [cart, setCart] = useState<{ 
    item: MenuItem; 
    qty: number; 
    notes: string; 
    selectedMods: { groupName: string; optionName: string; price: number }[] 
  }[]>([]);

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

  // Loyalty Badge calculations
  const currentPhone = customerPhone.trim();
  const currentName = customerName.trim();
  const customerCompletedCount = orders.filter(o => 
    o.tenantId === activeTenantId && 
    o.status === 'completed' && 
    (
      (currentPhone && o.customerPhone === currentPhone) || 
      (currentName && o.customerName === currentName)
    )
  ).length;

  const hasLoyaltyBadge = customerCompletedCount >= 10;

  // Review state
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Filter items
  const filteredItems = activeItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
    setItemQty(1); // Reset quantity to 1
    // Default select first option of each modifier group EXCEPT if it contains "injera"
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
        // Toggle off if already selected
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
        copy[existingIdx].qty += itemQty; // Respect itemQty instead of defaulting to 1
        return copy;
      }

      return [...prev, { 
        item: activeItemDetails, 
        qty: itemQty, // Respect itemQty instead of defaulting to 1
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

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    // Validate payment screenshot for pickup pre-orders
    if (orderType === 'pickup') {
      if (!customerName.trim() || !customerPhone.trim()) {
        alert('Please provide your Name and Phone Number for your pickup order.');
        return;
      }
      if (!paymentScreenshot) {
        alert('Please pay in advance and upload your payment screenshot to place a pickup order.');
        return;
      }
    }

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

    const submitted = placeOrder({
      tenantId: activeTenantId,
      branchId: activeBranchId,
      tableId: orderType === 'dine_in' ? activeTableId : undefined,
      type: orderType,
      customerName: customerName || 'Guest User',
      customerPhone: customerPhone || undefined,
      customerEmail: currentUser?.email || undefined,
      items: orderItems,
      discount: 0,
      subtotal: 0, // context auto-computes calculations
      total: 0,
      pickupTime: orderType === 'pickup' ? pickupTime : undefined,
      paymentScreenshotUrl: orderType === 'pickup' ? (paymentScreenshot || undefined) : undefined,
      paymentVerificationStatus: orderType === 'pickup' ? 'pending' : undefined,
      advancePaymentRef: orderType === 'pickup' ? (paymentRef || undefined) : undefined,
      paymentMethod: orderType === 'pickup' ? 'bank_transfer' : undefined,
    });

    saveOrderId(submitted.id);

    // Reset payment upload states
    setPaymentScreenshot('');
    setPaymentScreenshotName('');
    setPaymentRef('');

    // Set order for live tracking
    setActiveCustomerOrder(submitted);
    setCart([]);
    setIsCartOpen(false);
    setReviewSubmitted(false);
    setFeedback('');
    setRating(5);
  };

  const handleDirectOrder = () => {
    if (!activeItemDetails) return;

    // Validate for pickup pre-orders
    if (orderType === 'pickup') {
      if (!customerName.trim() || !customerPhone.trim()) {
        alert('Please enter your Name and Phone Number in the checkout fields first so the restaurant can contact you!');
        setIsCartOpen(true); // Open cart to show profile inputs
        return;
      }
      if (!paymentScreenshot) {
        alert(`Aisha's Traditional Kitchen requires advance payment for pickup orders. Please upload a payment screenshot in the cart checkout panel first.`);
        setIsCartOpen(true); // Open cart to show payment fields
        return;
      }
    }

    const orderItems: OrderItem[] = [{
      id: `oi-${Date.now()}-direct`,
      menuItemId: activeItemDetails.id,
      name: activeItemDetails.name,
      price: activeItemDetails.price,
      quantity: itemQty,
      selectedModifiers: selectedMods,
      status: 'received',
      notes: itemNote || undefined,
      assignedStationId: activeItemDetails.preparationStationId
    }];

    const submitted = placeOrder({
      tenantId: activeTenantId,
      branchId: activeBranchId,
      tableId: orderType === 'dine_in' ? activeTableId : undefined,
      type: orderType,
      customerName: customerName || 'Guest User',
      customerPhone: customerPhone || undefined,
      customerEmail: currentUser?.email || undefined,
      items: orderItems,
      discount: 0,
      subtotal: 0,
      total: 0,
      pickupTime: orderType === 'pickup' ? pickupTime : undefined,
      paymentScreenshotUrl: orderType === 'pickup' ? (paymentScreenshot || undefined) : undefined,
      paymentVerificationStatus: orderType === 'pickup' ? 'pending' : undefined,
      advancePaymentRef: orderType === 'pickup' ? (paymentRef || undefined) : undefined,
      paymentMethod: orderType === 'pickup' ? 'bank_transfer' : undefined,
    });

    saveOrderId(submitted.id);

    // Reset payment states
    setPaymentScreenshot('');
    setPaymentScreenshotName('');
    setPaymentRef('');

    // Set order for live tracking
    setActiveCustomerOrder(submitted);
    setActiveItemDetails(null);
    setCart([]);
    setIsCartOpen(false);
    setReviewSubmitted(false);
    setFeedback('');
    setRating(5);
  };

  // Find live tracking status
  const currentLiveOrder = activeCustomerOrder 
    ? orders.find(o => o.id === activeCustomerOrder.id) 
    : null;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLiveOrder) return;
    rateAndFeedback(currentLiveOrder.id, rating, feedback);
    setReviewSubmitted(true);
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

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLanguage(currentLanguage === 'en' ? 'am' : 'en')}
                  className="bg-white/10 text-white hover:bg-white/20 transition-colors border-none rounded px-2 py-1 text-[11px] font-bold flex items-center gap-1"
                >
                  <Languages className="h-3 w-3" />
                  {currentLanguage === 'en' ? 'EN' : 'አማ'}
                </button>

                {/* Tenant switcher for testing */}
                <select
                  value={activeTenantId}
                  onChange={(e) => {
                    setActiveTenantId(e.target.value);
                    setCart([]);
                  }}
                  className="bg-white/10 text-white border-none rounded px-2 py-1 text-[11px] font-bold"
                  title="Simulation: Switch digital menus"
                >
                  {tenants.map(t => (
                    <option key={t.id} value={t.id} className="text-slate-900">{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">{activeTenant.description}</p>

            <div className="grid gap-2 grid-cols-2">
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
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase">Meal Option</label>
                <div className="flex bg-white/10 rounded-lg p-0.5 mt-1">
                  <button
                    onClick={() => setOrderType('dine_in')}
                    className={`flex-1 py-0.5 text-[10px] font-bold rounded-md ${orderType === 'dine_in' ? 'bg-white text-slate-900' : 'text-slate-300'}`}
                  >
                    Dine In
                  </button>
                  <button
                    onClick={() => setOrderType('pickup')}
                    className={`flex-1 py-0.5 text-[10px] font-bold rounded-md ${orderType === 'pickup' ? 'bg-white text-slate-900' : 'text-slate-300'}`}
                  >
                    Take-away
                  </button>
                </div>
              </div>
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
          {(customerName || customerPhone) && (
            <div className="mx-0 mt-1 p-3 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 rounded-2xl text-white flex items-center justify-between gap-3 shadow-sm border border-indigo-500/20">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-[8px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-yellow-400" />
                    <span>Patron Status Profile</span>
                  </p>
                </div>
                <h4 className="font-sans font-extrabold text-xs text-white flex items-center gap-1.5 flex-wrap">
                  {customerName || 'Valued Guest'} 
                  {hasLoyaltyBadge && (
                    <span className="bg-amber-400 text-slate-950 font-extrabold text-[8px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      👑 10x Loyalty Badge
                    </span>
                  )}
                </h4>
                <div className="flex gap-2 items-center">
                  <p className="text-[10px] text-slate-300 leading-normal">
                    Completed orders: <strong>{customerCompletedCount}</strong>
                  </p>
                  <button 
                    onClick={() => setIsTrackModalOpen(true)}
                    className="text-[9px] font-bold bg-white/10 hover:bg-white/20 text-indigo-200 px-2 py-0.5 rounded-full transition-colors flex items-center gap-1 border border-white/5"
                  >
                    <ClipboardList className="h-3 w-3" /> My Order Stories
                  </button>
                </div>
              </div>

              {!hasLoyaltyBadge ? (
                <div className="text-right space-y-1 shrink-0">
                  <div className="w-20 bg-white/25 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-400 h-full rounded-full" 
                      style={{ width: `${Math.min(100, (customerCompletedCount / 10) * 100)}%` }} 
                    />
                  </div>
                  <span className="text-[8px] text-slate-300 font-semibold block">{customerCompletedCount}/10 for Loyalty Badge</span>
                </div>
              ) : (
                <div className="bg-amber-400/20 border border-amber-400/30 p-1.5 rounded-xl text-center shrink-0">
                  <span className="text-xs">👑 Gold</span>
                </div>
              )}
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
              My Order Stories
            </button>
          </div>

          {/* Category Badges scroll */}
          <div className="flex gap-1.5 overflow-x-auto pb-1.5 pr-1 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold shrink-0 transition-colors ${
                selectedCategory === 'all' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {currentLanguage === 'en' ? 'All Dishes' : 'ሁሉንም'}
            </button>

            {activeCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold shrink-0 transition-colors ${
                  selectedCategory === cat.id 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {getTranslatedCategory(cat)}
              </button>
            ))}
          </div>

          {/* Items catalog list */}
          <div className="space-y-3">
            {filteredItems.map(item => {
              const info = getTranslatedText(item);
              const isAvailable = item.isAvailable !== false;

              return (
                <div 
                  key={item.id} 
                  onClick={isAvailable ? () => handleOpenItemDetails(item) : undefined}
                  className={`rounded-2xl border p-3 shadow-sm flex gap-3 transition-all duration-200 ${
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
                        <h4 className={`text-xs font-extrabold ${isAvailable ? 'text-slate-900' : 'text-slate-500 line-through'}`}>{info.name}</h4>
                        {isAvailable ? (
                          <span className="font-mono text-xs font-bold text-slate-900 shrink-0">{activeTenant.currencySymbol} {item.price}</span>
                        ) : (
                          <span className="text-[9px] font-extrabold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded uppercase shrink-0">Sold Out</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">{info.description}</p>
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
                              key={opt.id}
                              type="button"
                              onClick={() => handleModifierToggle(group.name, opt.name, opt.price)}
                              className={`rounded-lg border p-2.5 text-left text-xs font-semibold flex justify-between transition-all ${
                                isSelected 
                                  ? 'border-slate-900 bg-slate-50 text-slate-950 shadow-sm' 
                                  : 'border-slate-150 bg-white text-slate-600'
                              }`}
                            >
                              <span>{opt.name}</span>
                              <span className="font-mono text-slate-400">{opt.price > 0 ? `+ ${activeTenant.currencySymbol} ${opt.price}` : 'Free'}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Item Quantity Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">How many pieces / portions?</label>
                    <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-1.5 max-w-[140px] border border-slate-150">
                      <button
                        type="button"
                        onClick={() => setItemQty(prev => Math.max(1, prev - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 cursor-pointer text-xs"
                      >
                        -
                      </button>
                      <span className="font-sans font-bold text-xs text-slate-800 text-center flex-1">{itemQty}</span>
                      <button
                        type="button"
                        onClick={() => setItemQty(prev => prev + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 cursor-pointer text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Cooking Note field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Preparation requests / Notes</label>
                    <input
                      type="text"
                      placeholder="e.g., No onions, extra spicy..."
                      value={itemNote}
                      onChange={(e) => setItemNote(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50">
                  <button
                    onClick={handleAddToCart}
                    className="w-full rounded-lg bg-slate-100 text-slate-800 border border-slate-200 font-bold py-2.5 text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleDirectOrder}
                    className="w-full rounded-lg bg-slate-950 text-white font-bold py-2.5 text-xs hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Order now
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TRACK ORDER / MY ORDERS MODAL */}
          {isTrackModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ClipboardList className="h-4 w-4" /> My Order Stories
                  </span>
                  <button 
                    onClick={() => setIsTrackModalOpen(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                  >
                    Cancel
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Show recent orders if we have a phone number, saved orders, or are signed in */}
                  {(customerPhone || myOrderIds.length > 0 || currentUser) && (
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Recent Order Stories</label>
                      {(() => {
                        const userOrders = orders.filter(o => 
                          o.tenantId === activeTenantId && 
                          (
                            myOrderIds.includes(o.id) || 
                            (customerPhone && o.customerPhone === customerPhone) ||
                            (currentUser && o.customerEmail === currentUser.email)
                          )
                        );

                        if (userOrders.length > 0) {
                          return (
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {userOrders
                                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                .map(order => (
                                  <button
                                    key={order.id}
                                    onClick={() => {
                                      setActiveCustomerOrder(order);
                                      setIsTrackModalOpen(false);
                                    }}
                                    className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors flex justify-between items-center"
                                  >
                                    <div>
                                      <p className="font-bold text-xs text-slate-800">{order.orderNum}</p>
                                      <p className="text-[10px] text-slate-500">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {order.items.length} items</p>
                                    </div>
                                    <div className="text-right">
                                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                                        order.status === 'completed' || order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                                        order.status === 'cancelled' ? 'bg-rose-100 text-rose-700' :
                                        'bg-indigo-100 text-indigo-700'
                                      }`}>
                                        {order.status.toUpperCase()}
                                      </span>
                                      <p className="text-[10px] font-mono text-slate-600 mt-1">{activeTenant.currencySymbol} {order.total}</p>
                                    </div>
                                  </button>
                                ))}
                            </div>
                          );
                        } else {
                          return <p className="text-[10px] text-slate-400 italic">No recent orders found.</p>;
                        }
                      })()}
                      
                      <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-slate-100"></div>
                        <span className="flex-shrink-0 mx-2 text-[9px] text-slate-400 font-semibold uppercase">Or Track Another</span>
                        <div className="flex-grow border-t border-slate-100"></div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
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
                          (o.customerPhone === query || o.id.includes(query) || o.orderNum.includes(query))
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
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5"
                    />
                    <input
                      type="text"
                      placeholder="Phone (for prep notifications)"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5"
                    />
                    {orderType === 'pickup' && (
                      <>
                        <input
                          type="text"
                          placeholder="Pickup Time (e.g. 12:30 PM)"
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 px-3 py-1.5"
                        />
                        
                        <div className="space-y-2 p-2.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 mt-1">
                          <div className="space-y-1">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Pre-Arrival Advance Payment</p>
                            <p className="text-[10px] text-slate-500">
                              Please transfer the total of <strong className="font-mono text-slate-900">{activeTenant.currencySymbol} {calculateCartTotal()}</strong> to:
                            </p>
                            <div className="bg-white rounded-lg p-2 border border-slate-100 text-[10px] text-slate-800 space-y-1 shadow-sm">
                              <p className="font-bold">🏦 Commercial Bank of Ethiopia (CBE)</p>
                              <p>Account: <strong className="font-mono text-indigo-700">{activeTenant.bankAccount || '1000123456789'}</strong></p>
                              <p>Name: <strong>{activeTenant.name} Kitchen</strong></p>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase block">Upload Receipt/Screenshot</label>
                            <label className="cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 rounded-lg py-1 px-2.5 flex items-center justify-center gap-1 text-[10px] text-slate-600 transition-all font-semibold shadow-sm">
                              <span>📁 Choose Screenshot...</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileChange} 
                                className="hidden" 
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
                              className="w-full bg-white rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Financial Totals */}
                <div className="rounded-xl bg-slate-50 p-3 space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Cart Total Amount</span>
                    <span>{activeTenant.currencySymbol} {calculateCartTotal()}</span>
                  </div>
                  <p className="text-[9px] text-slate-400">Tax and Service Charge calculated on checkout receipt.</p>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full rounded-lg bg-emerald-600 text-white font-bold py-2.5 text-xs hover:bg-emerald-500 transition-colors"
                >
                  Place {orderType === 'dine_in' ? `Dine-in Order ${tables.find(t => t.id === activeTableId)?.number || ''}` : 'Pickup Pre-order'}
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
                    Your advance payment details have reached the cashier. Once your CBE transfer is verified, your order will reach the kitchen cooks!
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
                [
                  { label: 'Order Submitted', status: 'submitted', desc: 'SaaS routed your ticket to kitchen stations.' },
                  { label: 'Chef Preparing Dishes', status: 'cooking', desc: 'Food is slow-cooking on stove grills.' },
                  { label: 'Plated & Ready for Pick', status: 'ready', desc: 'Ready at station counter for floor waiter.' },
                  { label: 'Meal Delivered to Table', status: 'delivered', desc: 'Tasty traditional food arrived. Enjoy!' }
                ].map((step, idx) => {
                  const statuses = ['submitted', 'cooking', 'ready', 'delivered', 'completed'];
                  const stepIdx = statuses.indexOf(step.status);
                  const currentIdx = statuses.indexOf(currentLiveOrder.status);
                  const isFinished = currentIdx >= stepIdx;
                  const isCurrent = currentLiveOrder.status === step.status;

                  return (
                    <div key={idx} className="flex gap-3">
                      <div className="flex flex-col items-center shrink-0">
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center border text-xs font-bold ${
                          isFinished 
                            ? 'bg-emerald-600 text-white border-emerald-600' 
                            : 'bg-white text-slate-300 border-slate-200'
                        }`}>
                          {isFinished ? '✓' : idx + 1}
                        </div>
                        {idx < 3 && <div className={`h-8 w-0.5 ${isFinished ? 'bg-emerald-500' : 'bg-slate-100'}`}></div>}
                      </div>
                      <div className="space-y-0.5">
                        <p className={`text-xs font-bold ${isCurrent ? 'text-indigo-600' : isFinished ? 'text-slate-800' : 'text-slate-400'}`}>
                          {step.label}
                        </p>
                        <p className="text-[10px] text-slate-400">{step.desc}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Feedback & Review Form (FR-ORD-07) once cooking starts */}
          {currentLiveOrder.status !== 'submitted' && (
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
              <h4 className="font-sans font-extrabold text-sm text-slate-950 flex items-center gap-1.5">
                <Smile className="h-4.5 w-4.5 text-yellow-500 animate-bounce" /> Rate Aisha's Flavors
              </h4>

              {reviewSubmitted ? (
                <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 text-center text-[11px] text-emerald-800 font-semibold space-y-1">
                  <p>✓ Feedback submitted successfully!</p>
                  <p className="font-normal">Your ratings help Aisha Jafar audit her kitchen chefs.</p>
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
                      placeholder="e.g. Doro Wat was sensational!"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs min-h-[50px]"
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

    </div>
  );
}
