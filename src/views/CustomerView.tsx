import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MenuItem, OrderItem, Order, Category } from '../types';
import { 
  Search, ShoppingBag, Languages, Flame, Award, Clock, ArrowRight, Star, 
  Smile, ClipboardList, CheckCircle2, ShoppingCart, User, Smartphone, MapPin
} from 'lucide-react';

export default function CustomerView() {
  const { 
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
    rateAndFeedback 
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
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupTime, setPickupTime] = useState('ASAP');
  const [cart, setCart] = useState<{ 
    item: MenuItem; 
    qty: number; 
    notes: string; 
    selectedMods: { groupName: string; optionName: string; price: number }[] 
  }[]>([]);

  // Modals & Tracking
  const [activeItemDetails, setActiveItemDetails] = useState<MenuItem | null>(null);
  const [selectedMods, setSelectedMods] = useState<{ groupName: string; optionName: string; price: number }[]>([]);
  const [itemNote, setItemNote] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCustomerOrder, setActiveCustomerOrder] = useState<Order | null>(null);

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
    // Default select first option of each modifier group
    const defaults = item.modifiers.map(g => ({
      groupName: g.name,
      optionName: g.options[0].name,
      price: g.options[0].price
    }));
    setSelectedMods(defaults);
  };

  const handleModifierToggle = (groupName: string, optionName: string, price: number) => {
    setSelectedMods(prev => {
      const filtered = prev.filter(m => m.groupName !== groupName);
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
        copy[existingIdx].qty += 1;
        return copy;
      }

      return [...prev, { 
        item: activeItemDetails, 
        qty: 1, 
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

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

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
      items: orderItems,
      discount: 0,
      subtotal: 0, // context auto-computes calculations
      total: 0,
      pickupTime: orderType === 'pickup' ? pickupTime : undefined
    });

    // Set order for live tracking
    setActiveCustomerOrder(submitted);
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
                  Pickup
                </button>
              </div>
            </div>
          </div>
        </div>
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

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={currentLanguage === 'en' ? 'Search dishes or drinks...' : 'ምግብ ወይም መጠጥ ፈልግ...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
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
              const hasAmharic = !!item.translations?.am;

              return (
                <div 
                  key={item.id} 
                  onClick={() => handleOpenItemDetails(item)}
                  className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm flex gap-3 cursor-pointer hover:border-indigo-500 hover:shadow-md transition-all duration-200"
                >
                  {item.photoUrl && (
                    <img 
                      src={item.photoUrl} 
                      alt={item.name} 
                      className="h-20 w-20 rounded-xl object-cover shrink-0 border border-slate-50"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="text-xs font-extrabold text-slate-900">{info.name}</h4>
                        <span className="font-mono text-xs font-bold text-slate-900 shrink-0">{activeTenant.currencySymbol} {item.price}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">{info.description}</p>
                    </div>

                    <div className="flex justify-between items-center mt-2.5">
                      <div className="flex gap-1">
                        {item.dietaryTags.map(tag => (
                          <span key={tag} className="rounded-md bg-emerald-50 px-1.5 py-0.25 text-[8px] font-bold text-emerald-700">{tag}</span>
                        ))}
                      </div>
                      <span className="text-[9px] font-bold text-indigo-600 flex items-center gap-0.5">Customize <ArrowRight className="h-2.5 w-2.5" /></span>
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
                  {activeItemDetails.modifiers.map(group => (
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

                <button
                  onClick={handleAddToCart}
                  className="w-full rounded-lg bg-slate-950 text-white font-bold py-2.5 text-xs hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Add to Cart
                </button>

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
                      <input
                        type="text"
                        placeholder="Pickup Time (e.g. 12:30 PM)"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5"
                      />
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
              {[
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
              })}
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
