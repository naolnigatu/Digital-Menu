import React, { useState, useMemo, useEffect } from 'react';
import { sanitizeName, validatePhone } from '../utils/validation';
import { useApp } from '../context/AppContext';
import { MenuItem, OrderItem, Order, Category, PaymentMethodConfig, MealSubscriptionPackage } from '../types';
import { 
  Search, ShoppingBag, Languages, Flame, Award, Clock, ArrowRight, Star, 
  Smile, ClipboardList, CheckCircle2, ShoppingCart, User, Smartphone, MapPin, Megaphone,
  MessageSquare, RefreshCw, Sparkles, Send, Calendar, Truck, Car, Check, Heart, Lock, LogOut, Ticket,
  AlertTriangle
} from 'lucide-react';
import CustomerProfileDashboard from '../components/CustomerProfileDashboard';
import { useDinexSettings } from '../context/DinexContext';

import { CustomerReservationModal } from '../components/CustomerReservationModal';

export default function CustomerView() {
  const { 
    globalSettings,
    currentUser,
    tenants, 
    categories, 
    menuItems, 
    tables, 
    orders, 
    setCurrentView,
    stations,
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
    updateCustomerMealSubscription,
    mealSubscriptionPlans,
    paymentMethodsConfigs,
    loyaltyConfigs,
    updateOrderStatus,
    acceptDeliveryFee,
    addTip
  } = useApp();

  const { activeSettings } = useDinexSettings();

  const activeTenant = useMemo(() => tenants.find(t => t.id === activeTenantId) || tenants[0], [tenants, activeTenantId]);
  const activeCategories = useMemo(() => categories[activeTenantId] || [], [categories, activeTenantId]);
  const activeItems = useMemo(() => menuItems[activeTenantId] || [], [menuItems, activeTenantId]);
  const activeTables = useMemo(() => tables.filter(t => t.branchId === activeBranchId), [tables, activeBranchId]);

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeZone, setActiveZone] = useState<string>('all');
  const filteredActiveTables = useMemo(() => {
    return activeZone === 'all' 
      ? activeTables 
      : activeTables.filter(t => t.section === activeZone);
  }, [activeTables, activeZone]);
  
  const [activeTableId, setActiveTableId] = useState<string>(() => filteredActiveTables[0]?.id || '');
  const [orderType, setOrderType] = useState<string>('dine_in');

  const activeServiceTypes = useMemo(() => {
    const isFreePlan = activeTenant?.subscriptionPlan === 'free';
    const allTypes = [
      { id: 'dine_in', label: 'Dine-In' },
      { id: 'takeaway', label: 'Takeaway' },
      { id: 'delivery', label: 'Delivery' },
      { id: 'drive_through', label: 'Drive Thru' },
      { id: 'pickup', label: 'Pick Up' },
      { id: 'meal_subscription', label: 'Subscription' }
    ].filter(t => !isFreePlan || t.id !== 'meal_subscription');
    const globalAllowed = globalSettings?.allowedDiningServiceTypes || ['dine_in', 'takeaway', 'delivery', 'drive_through', 'pickup', 'meal_subscription'];
    const bizEnabled = activeSettings?.enabledDiningServiceTypes || ['dine_in', 'takeaway', 'delivery', 'drive_through', 'pickup', 'meal_subscription'];
    return allTypes.filter(t => globalAllowed.includes(t.id) && bizEnabled.includes(t.id));
  }, [globalSettings, activeSettings, activeTenant]);

  useEffect(() => {
    if (activeServiceTypes.length > 0 && !activeServiceTypes.some(t => t.id === orderType)) {
      setOrderType(activeServiceTypes[0].id);
    }
  }, [activeServiceTypes, orderType]);
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryLandmark, setDeliveryLandmark] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [deliveryLat, setDeliveryLat] = useState<number | null>(null);
  const [deliveryLng, setDeliveryLng] = useState<number | null>(null);
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [licensePlate, setLicensePlate] = useState('');
  const [subscriptionDurationDays, setSubscriptionDurationDays] = useState<number>(30);

  const availableDurations = useMemo(() => {
    return activeSettings?.subscriptionDurations || [7, 14, 30];
  }, [activeSettings]);

  useEffect(() => {
    if (availableDurations.length > 0 && !availableDurations.includes(subscriptionDurationDays)) {
      setSubscriptionDurationDays(availableDurations[0]);
    }
  }, [availableDurations, subscriptionDurationDays]);

  // New States: Account Dashboards & Auth
  const [showDirectory, setShowDirectory] = useState(() => {
    const saved = localStorage.getItem('mf_customer_show_directory');
    return saved === 'false' ? false : true;
  });

  useEffect(() => {
    localStorage.setItem('mf_customer_show_directory', String(showDirectory));
  }, [showDirectory]);

  useEffect(() => {
    const handleGoBack = () => {
      if (!showDirectory) {
        setShowDirectory(true);
      } else {
        setCurrentView('landing');
      }
    };
    window.addEventListener('go-back-customer', handleGoBack);
    return () => window.removeEventListener('go-back-customer', handleGoBack);
  }, [showDirectory, setCurrentView]);

  useEffect(() => {
    const handleForceDirectory = () => {
      setShowDirectory(true);
    };
    window.addEventListener('customer-show-directory-updated', handleForceDirectory);
    return () => window.removeEventListener('customer-show-directory-updated', handleForceDirectory);
  }, []);

  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isEmailLoginModalOpen, setIsEmailLoginModalOpen] = useState(false);
  const [showBizSearchModal, setShowBizSearchModal] = useState(false);
  const [bizSearchTerm, setBizSearchTerm] = useState('');
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
  const [useSubscriptionCredits, setUseSubscriptionCredits] = useState(false);

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
    { id: 'cash', name: 'Cash', enabled: true, requiresProof: false },
    { id: 'stripe', name: 'Stripe Pay Online', enabled: false, requiresProof: false },
    { id: 'mobile_money', name: 'Mobile Money Transfer', enabled: false, requiresProof: true, details: 'Telebirr: 0911223344' },
    { id: 'bank_transfer', name: 'Bank Transfer', enabled: false, requiresProof: true, details: 'Commercial Bank: 1000123456789' },
    { id: 'binance_id', name: 'Binance Pay (ID)', enabled: false, requiresProof: true, details: 'Binance Pay ID: 88776655' },
    { id: 'binance_wallet', name: 'Binance BEP20 Wallet', enabled: false, requiresProof: true, details: 'BEP20 Address: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F' }
  ];
  const allowedByPlatform = globalSettings.allowedPaymentMethods || [
    'cash', 'stripe', 'mobile_money', 'bank_transfer', 'binance_id', 'binance_wallet'
  ];
  const enabledPaymentConfigs = activePaymentConfigs.filter(
    c => c.enabled && c.id !== 'card' && allowedByPlatform.includes(c.id)
  );
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
    const [selectedPortion, setSelectedPortion] = useState<{name: string, price: number} | null>(null);
  const [itemQty, setItemQty] = useState<number>(1);

  const [selectedMods, setSelectedMods] = useState<{ groupName: string; optionName: string; price: number }[]>([]);
  const [itemNote, setItemNote] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<string>('');
  const [paymentScreenshotName, setPaymentScreenshotName] = useState<string>('');
  const [paymentRef, setPaymentRef] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [directCheckoutItem, setDirectCheckoutItem] = useState<any>(null);
  const [isDirectCheckoutOpen, setIsDirectCheckoutOpen] = useState(false);

  const [activeItemDetails, setActiveItemDetails] = useState<MenuItem | null>(null);
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
  
  // Subscription Eligibility
  const activeSubs = customerSubscriptions.filter(s => 
    s.status === 'active' && 
    (s.customerId === customerEmailForDashboard || s.customerId === customerPhone) && 
    s.tenantId === activeTenantId
  );
  
  const eligibleSubsToRedeem = activeSubs.filter(sub => {
    // Check if sub has enough credits for ALL cart items
    // (For simplicity, we check if ANY cart item can be fully covered)
    const cartItemIds = cart.map(c => c.item.id);
    let canCoverAll = true;
    const requiredQuantities: Record<string, number> = {};
    cart.forEach(c => {
      requiredQuantities[c.item.id] = (requiredQuantities[c.item.id] || 0) + c.qty;
    });

    let coversAtLeastOne = false;
    for (const [itemId, qty] of Object.entries(requiredQuantities)) {
      const credit = sub.credits?.find(c => c.menuItemId === itemId);
      if (credit && credit.remaining >= qty) {
        coversAtLeastOne = true;
      }
    }
    return coversAtLeastOne && sub.totalCreditsRemaining > 0;
  });
  
  const subConfig = activeTenant?.mealSubscriptionConfig;
  const isFlexible = subConfig?.flexibleRedemption ?? true;
  const dailyLimit = subConfig?.dailyRedemptionLimit || 0;
  
  // Filter eligible subs to respect daily limits if not flexible
  const validSubsToRedeem = eligibleSubsToRedeem.filter(sub => {
    // If not flexible, check daily limit
    if (!isFlexible && dailyLimit > 0) {
      // Check if last redemption was today
      const isToday = sub.lastRedemptionDate && new Date(sub.lastRedemptionDate).toDateString() === new Date().toDateString();
      const currentToday = isToday ? (sub.redemptionsToday || 0) : 0;
      
      // If we've hit the limit today, this sub can't be used
      if (currentToday >= dailyLimit) {
        return false;
      }
    }
    return true;
  });

  const canUseSubscriptionCredits = validSubsToRedeem.length > 0 && orderType !== 'meal_subscription';
  
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
  if (orderType === 'meal_subscription') {
    const plan = tenantSubscriptionPlans.find(p => p.id === selectedSubPlanId);
    if (plan && plan.discountPercentage) {
      finalDiscountPct += plan.discountPercentage;
    } else if ((activeTenant as any).mealSubscriptionDiscountPercent) {
      finalDiscountPct += (activeTenant as any).mealSubscriptionDiscountPercent;
    }
  }
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
        name: (c.name || '').toLowerCase(),
        amName: c.translations?.am ? (c.translations.am || '').toLowerCase() : ''
      };
    }
    return map;
  }, [activeCategories]);

  // Filter items
  const filteredItems = useMemo(() => {
    const term = (searchTerm || '').toLowerCase();
    return activeItems.filter(item => {
      const isAvail = item.availability === undefined || item.availability === 'Available';
      if (!isAvail) return false;

      const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
      if (!matchesCategory) return false;

      if (!term) return true;

      const catInfo = categoryLookup[item.categoryId];
      const catName = catInfo ? catInfo.name : '';
      const catAmName = catInfo ? catInfo.amName : '';

      return (item.name || '').toLowerCase().includes(term) || 
             (item.description || '').toLowerCase().includes(term) ||
             (catName || '').includes(term) ||
             (catAmName || '').includes(term);
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
    if (item.portions && item.portions.length > 0) {
      setSelectedPortion(item.portions[0]);
    } else {
      setSelectedPortion(null);
    }
    setItemQty(1);
    const defaults: {groupName: string, optionName: string, price: number}[] = [];
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

const currentItemPrice = useMemo(() => {
    if (!activeItemDetails) return 0;
    let total = activeItemDetails.price;
    selectedMods.forEach(m => { total += m.price; });
    let finalTotal = total * itemQty;
    if (orderType === 'meal_subscription') {
      finalTotal = finalTotal * subscriptionDurationDays;
      if (activeTenant.mealSubscriptionDiscountPercent) {
        finalTotal = finalTotal - (finalTotal * (activeTenant.mealSubscriptionDiscountPercent / 100));
      }
    }
    return finalTotal;
  }, [activeItemDetails, selectedMods, itemQty, orderType, subscriptionDurationDays, activeTenant.mealSubscriptionDiscountPercent]);

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
      return [...prev, { item: activeItemDetails, selectedMods, qty: itemQty }];
    });
    setActiveItemDetails(null);
    showToast('Added to cart!');
  };

  const handleOrderNow = () => {
    setDirectCheckoutItem({ item: activeItemDetails, selectedMods, qty: itemQty });
    setIsDirectCheckoutOpen(true);
    setActiveItemDetails(null);
  };


  const calculateCartTotal = () => {
    return cart.reduce((acc, curr) => {
      let itemTotal = curr.item.price;
      curr.selectedMods.forEach(m => { itemTotal += m.price; });
      return acc + (itemTotal * curr.qty);
    }, 0);
  };


  const getSubtotalWithSubscription = () => {
    let sub = 0;
    if (isDirectCheckoutOpen && directCheckoutItem) {
      sub = directCheckoutItem.item.price;
      directCheckoutItem.selectedMods.forEach((m: any) => { sub += m.price; });
      sub = sub * directCheckoutItem.qty;
    } else {
      sub = calculateCartTotal();
    }
    
    // Calculate Subscription Discount
    if (orderType === 'meal_subscription') {
      const discountPercent = activeTenant.mealSubscriptionDiscountPercent || 0;
      // If we are doing a 30-day plan? The user said "each meal gets discounted percentage and calculated as per the price after %deduction"
      // So let's multiply by 30 days as standard subscription, or just 1?
      // "each meal gets discounted percentage... " 
      // I'll keep the x30 but apply discount. Or just apply the discount without x30 if they don't want a 30-day multiplier.
      // Wait! The user says "an item or combination of items, the discount % will be calculated he pays the discounted price"
      // Let's assume it's for 30 days, or we use the `subscriptionPeriod` if it exists.
      // I'll use 30 for now and apply the discount.
      sub = sub * subscriptionDurationDays; // dynamic duration meals
      if (discountPercent > 0) {
        sub = sub - (sub * (discountPercent / 100));
      }
    }
    return sub;
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
    if (cart.length === 0 && !isDirectCheckoutOpen) return;

    const chosenConfig = enabledPaymentConfigs.find(c => c.id === selectedPaymentMethodId);
    
    // Validate Prepayments

    const isPrepaidType = ['pickup', 'delivery', 'drive_through', 'meal_subscription'].includes(orderType);
    
    // Require signup for meal subscriptions
    if (orderType === 'meal_subscription' && !customerEmailForDashboard) {
      showToast('Please sign in or register to purchase a meal subscription.', 'error');
      setIsCartOpen(false);
      setIsDirectCheckoutOpen(false);
      setCurrentView('login');
      return;
    }

    if (isPrepaidType) {

      
      const nameCheck = sanitizeName(customerName);
      if (!nameCheck.valid) { showToast(nameCheck.error || 'Invalid name.', 'error'); return; }
      
      const phoneCheck = validatePhone(customerPhone);
      if (!phoneCheck.valid) { showToast(phoneCheck.error || 'Invalid phone.', 'error'); return; }

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

  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsSharingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setDeliveryLat(lat);
        setDeliveryLng(lng);
        setDeliveryAddress(`Shared Location (Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)})`);
        setIsSharingLocation(false);
      },
      (error) => {
        console.error(error);
        alert('Could not detect location. Please enter it manually.');
        setIsSharingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
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
    
    
    let calculatedSubtotal = getSubtotalWithSubscription();
    let creditsToDeduct: {subId: string, itemId: string, qty: number}[] = [];
    
    if (useSubscriptionCredits && canUseSubscriptionCredits) {
      // Very basic deduction: if they apply credits, zero out the price of items covered by credits.
      let cartSubtotal = 0;
      cart.forEach(c => {
        let itemCost = c.item.price;
        c.selectedMods.forEach(m => itemCost += m.price);
        
        let qtyToPayFor = c.qty;
        
        // Find a sub that covers it
        for (const sub of validSubsToRedeem) {
          const cred = sub.credits?.find(x => x.menuItemId === c.item.id);
          if (cred && cred.remaining > 0 && qtyToPayFor > 0) {
            const deductQty = Math.min(cred.remaining, qtyToPayFor);
            qtyToPayFor -= deductQty;
            creditsToDeduct.push({ subId: sub.id, itemId: c.item.id, qty: deductQty });
          }
        }
        
        cartSubtotal += (itemCost * qtyToPayFor);
      });
      calculatedSubtotal = cartSubtotal;
    }
  

    const discountVal = parseFloat(((calculatedSubtotal * finalDiscountPct) / 100).toFixed(2));


    let finalCreditsToDeduct: {subId: string, itemId: string, qty: number}[] = [];
    if (useSubscriptionCredits && canUseSubscriptionCredits) {
      let cartSubtotal = 0;
      cart.forEach(c => {
        let itemCost = c.item.price;
        c.selectedMods.forEach(m => itemCost += m.price);
        let qtyToPayFor = c.qty;
        for (const sub of validSubsToRedeem) {
          const cred = sub.credits?.find(x => x.menuItemId === c.item.id);
          if (cred && cred.remaining > 0 && qtyToPayFor > 0) {
            const deductQty = Math.min(cred.remaining, qtyToPayFor);
            qtyToPayFor -= deductQty;
            finalCreditsToDeduct.push({ subId: sub.id, itemId: c.item.id, qty: deductQty });
          }
        }
      });
      
      // Deduct the credits
      const subUpdates: Record<string, { credits: any[], totalRemaining: number }> = {};
      finalCreditsToDeduct.forEach(d => {
        if (!subUpdates[d.subId]) {
          const sub = validSubsToRedeem.find(s => s.id === d.subId);
          if (sub) subUpdates[d.subId] = { credits: JSON.parse(JSON.stringify(sub.credits)), totalRemaining: sub.totalCreditsRemaining };
        }
        if (subUpdates[d.subId]) {
          const cred = subUpdates[d.subId].credits.find((c: any) => c.menuItemId === d.itemId);
          if (cred) {
            cred.remaining -= d.qty;
            cred.used += d.qty;
            subUpdates[d.subId].totalRemaining -= d.qty;
          }
        }
      });
      
      Object.keys(subUpdates).forEach(subId => {
        updateCustomerMealSubscription(subId, {
          credits: subUpdates[subId].credits,
          totalCreditsRemaining: subUpdates[subId].totalRemaining,
          redemptionsToday: (validSubsToRedeem.find(s => s.id === subId)?.redemptionsToday || 0) + 1,
          lastRedemptionDate: new Date().toISOString()
        });
      });
    }

    const isAutoApproval = activeSettings?.deliveryApprovalMode === 'automatic';
    const initStatus = orderType === 'delivery' 
      ? (isAutoApproval ? 'accepted' : 'pending_approval') 
      : (selectedPaymentMethodId === 'stripe' ? 'accepted' : 'pending');

    const initDeliveryStatus = orderType === 'delivery' 
      ? (isAutoApproval ? 'preparing' : 'pending_approval') 
      : undefined;

    const initDeliveryFee = orderType === 'delivery'
      ? (isAutoApproval ? (activeSettings?.predefinedDeliveryFee || 150) : 0)
      : undefined;

    const submitted = placeOrder({
      tenantId: activeTenantId,
      branchId: activeBranchId,
      tableId: (orderType === 'dine_in' || orderType === 'meal_subscription') ? activeTableId : undefined,
      type: orderType as any,
      customerName: customerName || 'Guest User',
      customerPhone: customerPhone || undefined,
      customerEmail: customerEmailForDashboard || undefined,
      items: orderItems,
      discount: discountVal,
      subtotal: calculatedSubtotal,
      total: 0, // AppContext computes automatically
      status: initStatus as any,
      pickupTime: ['pickup', 'takeaway'].includes(orderType) ? pickupTime : undefined,
      notes: (orderType === 'delivery' ? `Delivery Address: ${deliveryAddress}` : orderType === 'drive_through' ? `Drive-thru Plate: ${licensePlate}` : orderType === 'meal_subscription' ? `Subscription Term: ${subscriptionDurationDays} Days` : ''),
      paymentScreenshotUrl: isPrepaidType ? (paymentScreenshot || undefined) : undefined,
      paymentVerificationStatus: selectedPaymentMethodId === 'stripe' ? 'approved' : isPrepaidType ? 'pending' : undefined,
      advancePaymentRef: isPrepaidType ? (paymentRef || undefined) : undefined,
      paymentMethod: selectedPaymentMethodId as any,
      tip: orderType === 'meal_subscription' ? 0 : selectedTipAmount,
      
      // Inject delivery details
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
      deliveryLandmark: orderType === 'delivery' ? deliveryLandmark : undefined,
      deliveryInstructions: orderType === 'delivery' ? deliveryInstructions : undefined,
      deliveryLatitude: orderType === 'delivery' ? (deliveryLat || undefined) : undefined,
      deliveryLongitude: orderType === 'delivery' ? (deliveryLng || undefined) : undefined,
      deliveryStatus: initDeliveryStatus as any,
      deliveryFee: initDeliveryFee,
    } as any);

    saveOrderId(submitted.id);


    // If subscribed to meal plan
    if (orderType === 'meal_subscription') {
      const plan = tenantSubscriptionPlans.find(p => p.id === selectedSubPlanId);
      
      let credits: any[] = [];
      let totalCredits = 0;
      
      if (plan) {
        if (plan.type === 'fixed') {
          credits = (plan.items || []).map(i => ({
            menuItemId: i.menuItemId,
            total: i.quantity,
            used: 0,
            remaining: i.quantity
          }));
          totalCredits = credits.reduce((a, c) => a + c.total, 0);
        } else {
          // BYO Package -> credits are flexible, handled differently, but let's initialize based on maxCredits
          totalCredits = plan.maxCredits || 30;
          const eligibleIds = plan.eligibleMenuItemIds?.length ? plan.eligibleMenuItemIds : (isDirectCheckoutOpen && directCheckoutItem ? [directCheckoutItem.id] : cart.map(c => c.item.id));
          credits = eligibleIds.map(id => ({
            menuItemId: id,
            total: totalCredits,
            used: 0,
            remaining: totalCredits
          }));
        }
      }

      subscribeToMealPlan({
        customerId: customerEmailForDashboard || customerPhone || 'anonymous',
        tenantId: activeTenantId,
        packageId: selectedSubPlanId,
        credits: credits,
        totalCreditsRemaining: totalCredits,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + (plan ? plan.durationDays : 30) * 24 * 60 * 60 * 1000).toISOString(),
        status: (selectedPaymentMethodId === 'stripe' || !isPrepaidType) ? 'active' : 'pending_approval',
        redemptionsToday: 0
      } as any);
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
    const email = (loginEmailInput || '').toLowerCase().trim();
    const name = loginNameInput.trim() || email.split('@')[0];
    
    localStorage.setItem('mf_customer_logged_email', email);
    setCustomerEmailForDashboard(email);
    updateCustomerProfile(email, { name, tenantId: activeTenantId });
    
    setIsEmailLoginModalOpen(false);
    setIsDashboardOpen(true);
  };


  useEffect(() => {
    const handleOpenDashboard = () => {
      if (customerEmailForDashboard) {
        setIsDashboardOpen(true);
      } else {
        setCurrentView('login');
      }
    };
    window.addEventListener('open-customer-dashboard', handleOpenDashboard);
    return () => window.removeEventListener('open-customer-dashboard', handleOpenDashboard);
  }, [customerEmailForDashboard]);

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
      alert('Please Sign In or Create a Customer Account to add items to your favorites!');
      setCurrentView('login');
      return;
    }
    const isFav = profile.savedFavorites?.includes(itemId);
    if (isFav) {
      removeFavoriteItem(customerEmailForDashboard, itemId);
    } else {
      addFavoriteItem(customerEmailForDashboard, itemId);
    }
  };

  const getTierRank = (plan: string) => {
    const p = (plan || '').toLowerCase();
    if (p === 'sponsored') return 1;
    if (p === 'enterprise') return 2;
    if (p === 'pro' || p === 'growth') return 3;
    if (p === 'basic') return 4;
    if (p === 'free') return 5;
    return 6;
  };

  if (showDirectory) {
    const sortedTenants = [...tenants]
      .filter(t => t.subscriptionPlan !== 'free')
      .sort((a, b) => {
        const rankA = getTierRank(a.subscriptionPlan);
        const rankB = getTierRank(b.subscriptionPlan);
        return rankA - rankB;
      });

    const searchFiltered = sortedTenants.filter(t => {
      const term = bizSearchTerm.toLowerCase().trim();
      return t.name.toLowerCase().includes(term) || (t.description || '').toLowerCase().includes(term);
    });

    return (
      <div className="space-y-8 py-6 px-4 max-w-6xl mx-auto animate-in fade-in duration-300">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Explore Restaurant Menus</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Order directly from our high-fidelity digital partner menus. Browse premium kitchens, sponsored cafes, and gourmet eateries.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-md mx-auto relative shadow-sm rounded-2xl">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search kitchens, cafes, traditional dishes..."
            value={bizSearchTerm}
            onChange={(e) => setBizSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
          />
        </div>

        {/* Business Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchFiltered.map((t) => {
            const plan = t.subscriptionPlan;
            const isSponsored = plan === 'sponsored' || t.name.toLowerCase().includes('sponsored');
            
            return (
              <div 
                key={t.id}
                className="group relative rounded-3xl border border-slate-100 bg-white p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-5"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 font-extrabold text-lg shadow-inner group-hover:scale-105 transition-transform shrink-0">
                      {t.name.charAt(0)}
                    </div>
                    {/* Badge */}
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      plan === 'enterprise' ? 'bg-indigo-50 text-indigo-700' :
                      plan === 'sponsored' || isSponsored ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                      plan === 'pro' || plan === 'growth' ? 'bg-emerald-50 text-emerald-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {plan}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-sans font-extrabold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">{t.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{t.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTenantId(t.id);
                    setShowDirectory(false);
                  }}
                  className="w-full rounded-xl bg-slate-50 border border-slate-100 text-slate-700 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>View Menu & Order</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-lg mx-auto bg-slate-50/50 pb-12 rounded-3xl min-h-[85vh] shadow-inner overflow-hidden border border-slate-100">
      
      {/* 1. CUSTOMER PORTAL HEADER CONFIGS */}
      {!currentLiveOrder ? (
        <>
          <div className="bg-slate-900 text-white p-5 space-y-4 shadow-md rounded-b-2xl">
            <div className="flex flex-row justify-between items-center gap-2">
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <img 
                  src={activeTenant.logoUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=80'} 
                  alt={activeTenant.name} 
                  className="h-8 w-8 shrink-0 rounded-full border border-white/20 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-sans font-extrabold text-sm leading-tight truncate">{activeTenant.name}</span>
                  <button 
                    onClick={() => {
                      setBizSearchTerm('');
                      setShowBizSearchModal(true);
                    }}
                    className="text-[10px] text-indigo-300 font-extrabold text-left hover:text-indigo-200 transition-colors flex items-center gap-1 mt-0.5"
                  >
                    🔍 Switch Business
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                

                {/* Account Dashboard Toggle */}
                {!(activeTenant?.subscriptionPlan === 'free') && (
                  <>
                    <button
                      onClick={() => setIsReservationModalOpen(true)}
                      className="bg-amber-600 hover:bg-amber-500 text-white transition-colors border-none rounded-lg px-2 py-1 text-[10px] font-bold flex items-center gap-0.5 shrink-0 shadow-xs"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="hidden md:inline">Book Table</span>
                    </button>
                    <button
                      onClick={() => {
                        if (customerEmailForDashboard) {
                          setIsDashboardOpen(true);
                        } else {
                          setCurrentView('login');
                        }
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white transition-colors border-none rounded-lg px-2 py-1 text-[10px] font-bold flex items-center gap-0.5 shrink-0 shadow-xs"
                    >
                      <User className="h-3.5 w-3.5" />
                      <span className="hidden md:inline">{customerEmailForDashboard ? 'My Profile' : 'Sign In'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">{activeTenant.description}</p>

            <div className="space-y-3">
              {(orderType === 'dine_in' || orderType === 'meal_subscription') && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Zone / Section</label>
                    <select
                      value={activeZone}
                      onChange={(e) => {
                        setActiveZone(e.target.value);
                        const newZone = e.target.value;
                        const filtered = newZone === 'all' ? activeTables : activeTables.filter(t => t.section === newZone);
                        if (filtered.length > 0) setActiveTableId(filtered[0].id);
                      }}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-2.5 py-1 text-xs font-semibold mt-1"
                    >
                      <option value="all" className="text-slate-900">All Zones</option>
                      {Array.from(new Set(activeTables.map(t => t.section))).map(zone => (
                        <option key={zone} value={zone} className="text-slate-900">{zone}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Self-Serve Table</label>
                    <select
                      value={activeTableId}
                      onChange={(e) => setActiveTableId(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-2.5 py-1 text-xs font-semibold mt-1"
                    >
                      {filteredActiveTables.map(t => (
                        <option key={t.id} value={t.id} className="text-slate-900">{t.number}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase">Dining Service Type</label>
                <div className="grid grid-cols-3 gap-1 mt-1 bg-white/5 rounded-xl p-1 border border-white/10">
                  {activeServiceTypes.map(t => (
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
                <div className="space-y-2.5">
                  <div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Delivery Address</label>
                      <button
                        type="button"
                        onClick={handleShareLocation}
                        disabled={isSharingLocation}
                        className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                      >
                        <span>{isSharingLocation ? "Getting Location..." : "📍 Share My Location"}</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Nearby Landmark</label>
                      <input
                        type="text"
                        
                        value={deliveryLandmark}
                        onChange={(e) => setDeliveryLandmark(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Driver Instructions</label>
                      <input
                        type="text"
                        
                        value={deliveryInstructions}
                        onChange={(e) => setDeliveryInstructions(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {orderType === 'drive_through' && (
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Vehicle License Plate</label>
                  <input
                    type="text"
                    required
                    
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold mt-1"
                  />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
                    className={`rounded-xl border p-2 shadow-sm flex items-center gap-3 transition-all duration-200 relative ${
                      isAvailable
                        ? 'border-slate-200 bg-white cursor-pointer hover:border-indigo-500 hover:shadow-md'
                        : 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {item.photoUrl && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-50"><img src={item.photoUrl} alt={item.name} className={`h-full w-full object-cover ${!isAvailable && 'grayscale'}`} referrerPolicy="no-referrer" /></div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className={`text-[12px] leading-tight font-extrabold ${isAvailable ? 'text-slate-900' : 'text-slate-500 line-through'} truncate`}>
                          <span>{info.name}</span>
                        </h4>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isFav) {
                              removeFavoriteItem(profile.id, item.id);
                            } else {
                              addFavoriteItem(profile.id, item.id);
                            }
                          }}
                          className={`p-1.5 rounded-full shrink-0 transition-colors ${isFav ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-300 hover:text-rose-400'}`}
                        >
                          <Heart className="h-3 w-3" fill={isFav ? "currentColor" : "none"} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-extrabold text-slate-900 text-[11px] font-mono">{activeTenant.currencySymbol} {item.price}</span>
                        {!isAvailable && (
                          <span className="text-[9px] font-extrabold text-slate-400 shrink-0">Unavailable</span>
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
                  {(activeItemDetails.modifiers || []).filter(g => !(g.name || '').toLowerCase().includes('injera')).map(group => (
                    <div key={group.id} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>{group.name}</span>
                        <span className={group.minSelect > 0 ? "text-amber-700" : "text-slate-400"}>
                          {group.minSelect > 0 ? 'Required' : 'Optional'}
                        </span>
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
                              <span className="font-mono text-[10px]">+{activeTenant.currencySymbol} {opt.price}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-slate-700">Quantity</span>
                    <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-100">
                      <button 
                        onClick={() => setItemQty(Math.max(1, itemQty - 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm text-slate-600 hover:text-indigo-600 font-bold"
                      >-</button>
                      <span className="font-mono font-bold text-sm min-w-[20px] text-center">{itemQty}</span>
                      <button 
                        onClick={() => setItemQty(itemQty + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm text-slate-600 hover:text-indigo-600 font-bold"
                      >+</button>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleAddToCart}
                      className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      {orderType === 'meal_subscription' ? 'Add to Subscription' : 'Add to Cart'}
                    </button>
                    <button
                      onClick={handleOrderNow}
                      className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center"
                    >
                      {orderType === 'meal_subscription' ? 'Subscribe Now' : 'Order Now'} - {activeTenant.currencySymbol} {currentItemPrice.toLocaleString()}
                    </button>
                  </div>
                </div>
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
                        (o.customerPhone === query || (o.id || '').includes(query) || (o.orderNum || '').includes(query) || (o.customerEmail || '').toLowerCase() === (query || '').toLowerCase())
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

                  {myOrderIds.length > 0 && (
                    <div className="pt-4 mt-2 border-t border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Recent Device Orders</p>
                      <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                        {orders
                          .filter(o => o.tenantId === activeTenantId && myOrderIds.includes(o.id))
                          .sort((a, b) => b.createdAt - a.createdAt)
                          .map(o => (
                            <button
                              key={o.id}
                              onClick={() => {
                                setActiveCustomerOrder(o);
                                setIsTrackModalOpen(false);
                              }}
                              className="w-full text-left p-2 rounded-lg border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50 transition-colors flex justify-between items-center"
                            >
                              <div>
                                <p className="font-bold text-slate-800">{o.orderNum}</p>
                                <p className="text-[10px] text-slate-500">{new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                o.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                                o.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                                'bg-indigo-100 text-indigo-800'
                              }`}>
                                {o.status}
                              </span>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SHOPPING CART CHECKOUT DRAWER */}
          {(isCartOpen || isDirectCheckoutOpen) && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-t-2xl sm:rounded-2xl bg-white p-5 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom-5">
                
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ShoppingCart className="h-4 w-4" /> Guest Checkout Cart
                  </span>
                  <button 
                    onClick={() => { setIsCartOpen(false); setIsDirectCheckoutOpen(false); setDirectCheckoutItem(null); }}
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
                      
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-gray-900"
                    />
                    <input
                      type="text"
                      
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-gray-900 font-mono"
                    />
                    {['pickup', 'delivery', 'drive_through', 'meal_subscription'].includes(orderType) && (
                      <>
                        {orderType === 'delivery' && (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase">Address & Geolocation</span>
                              <button
                                type="button"
                                onClick={handleShareLocation}
                                disabled={isSharingLocation}
                                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
                              >
                                <span>{isSharingLocation ? "Resolving Location..." : "📍 Share Browser Location"}</span>
                              </button>
                            </div>
                            <input
                              type="text"
                              required
                              
                              value={deliveryAddress}
                              onChange={(e) => setDeliveryAddress(e.target.value)}
                              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-gray-900"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                
                                value={deliveryLandmark}
                                onChange={(e) => setDeliveryLandmark(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-gray-900"
                              />
                              <input
                                type="text"
                                
                                value={deliveryInstructions}
                                onChange={(e) => setDeliveryInstructions(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-gray-900"
                              />
                            </div>
                          </div>
                        )}

                        {orderType === 'drive_through' && (
                          <input
                            type="text"
                            required
                            
                            value={licensePlate}
                            onChange={(e) => setLicensePlate(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-gray-900 font-mono"
                          />
                        )}

                        {['pickup', 'takeaway'].includes(orderType) && (
                          <input
                            type="text"
                            
                            value={pickupTime}
                            onChange={(e) => setPickupTime(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-gray-900"
                          />
                        )}

                        {orderType === 'meal_subscription' && (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase">Select Subscription Package</span>
                            </div>
                            <div className="grid gap-2">
                              {tenantSubscriptionPlans.filter(p => p.isActive).map(pkg => (
                                <button
                                  key={pkg.id}
                                  type="button"
                                  onClick={() => setSelectedSubPlanId(pkg.id)}
                                  className={`flex flex-col text-left p-3 rounded-xl border transition-colors ${
                                    selectedSubPlanId === pkg.id
                                      ? 'bg-indigo-50 border-indigo-200 text-indigo-800'
                                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                  }`}
                                >
                                  <span className="font-bold text-sm">{pkg.name}</span>
                                  <span className="text-xs opacity-75">{pkg.type === 'fixed' ? 'Fixed Bundle' : 'Build Your Own'} • {pkg.durationDays} Days</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                      </>
                    )}
                  </div>
                </div>

                {/* Loyalty Point Redemption Option (Part 7) */}
                                {canUseSubscriptionCredits && (
                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-between gap-2 text-xs mb-3">
                    <div className="space-y-0.5">
                      <span className="font-bold text-amber-900 block">Use Meal Credits</span>
                      <p className="text-[10px] text-amber-700 leading-snug">Redeem credits from your active subscription for eligible items in this order.</p>
                    </div>
                    <button 
                      onClick={() => setUseSubscriptionCredits(!useSubscriptionCredits)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wide transition-all ${useSubscriptionCredits ? 'bg-amber-600 text-white' : 'bg-white border border-amber-200 text-amber-600'}`}
                    >
                      {useSubscriptionCredits ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                )}
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
                        onClick={() => {
                          setSelectedPaymentMethodId(method.id);
                          if (method.id === 'cash') {
                            setSelectedTipAmount(0);
                            setCustomTipActive(false);
                          }
                        }}
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
                              
                              value={stripeCardNum}
                              onChange={(e) => setStripeCardNum(e.target.value)}
                              className="w-full bg-white rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold font-mono text-gray-900"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                maxLength={5}
                                
                                value={stripeExpiry}
                                onChange={(e) => setStripeExpiry(e.target.value)}
                                className="bg-white rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold font-mono text-gray-900 text-center"
                              />
                              <input
                                type="password"
                                maxLength={3}
                                
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
                {orderType !== 'meal_subscription' && selectedPaymentMethodId !== 'cash' && (
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
                          
                          value={customTipValue}
                          onChange={(e) => {
                            setCustomTipValue(e.target.value);
                            setSelectedTipAmount(parseFloat(e.target.value) || 0);
                          }}
                          className="w-full bg-slate-50 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold font-mono text-gray-900"
                        />
                      )}
                    </div>
                )}

                {/* Financial Totals */}
                <div className="rounded-xl bg-slate-50 p-3 space-y-1.5 text-xs">
                  {finalDiscountPct > 0 && (
                    <div className="flex justify-between font-medium text-emerald-600">
                      <span>Discount ({finalDiscountPct}%)</span>
                      <span>-{activeTenant.currencySymbol} {((getSubtotalWithSubscription() * finalDiscountPct) / 100).toFixed(2)}</span>
                    </div>
                  )}
                  {selectedTipAmount > 0 && orderType !== 'meal_subscription' && (
                    <div className="flex justify-between font-medium text-amber-600 font-mono">
                      <span>Staff Support Tip</span>
                      <span>+{activeTenant.currencySymbol} {selectedTipAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-extrabold text-slate-900 text-sm">
                    <span>Cart Total Amount</span>
                    <span>{activeTenant.currencySymbol} {((getSubtotalWithSubscription() * (100 - finalDiscountPct)) / 100 + (orderType === 'meal_subscription' ? 0 : selectedTipAmount)).toFixed(2)}</span>
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
                    <span>Place {orderType === 'dine_in' ? `Dine-in Order ${tables.find(t => t.id === activeTableId)?.number || ''}` : orderType === 'meal_subscription' ? 'Meal Subscription Order' : 'Pickup Pre-order'}</span>
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
                  {/* Delivery Status Banner/Quote Approvals */}
                  {currentLiveOrder.type === 'delivery' && (
                    <div className="mb-4">
                      {currentLiveOrder.deliveryStatus === 'pending_approval' && (
                        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-center space-y-2 animate-pulse">
                          <span className="text-2xl">⏳</span>
                          <h4 className="font-sans font-bold text-sm text-indigo-950">Awaiting Delivery Approval...</h4>
                          <p className="text-[10px] text-indigo-800 leading-normal">
                            Our manager is routing a delivery courier to your address and calculating the local delivery fee. Please hang tight!
                          </p>
                        </div>
                      )}

                      {currentLiveOrder.deliveryStatus === 'pending_acceptance' && (
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3 animate-in fade-in">
                          <div className="text-center space-y-1">
                            <span className="text-2xl">🚴</span>
                            <h4 className="font-sans font-bold text-sm text-amber-950">Delivery Quote Approved!</h4>
                            <p className="text-[10px] text-amber-800 leading-normal">
                              Courier <strong>{currentLiveOrder.deliveryStaffName || 'Dinex Rider'}</strong> has been assigned. Please accept the final quote to start preparation.
                            </p>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-amber-100 text-xs space-y-2.5">
                            <div className="flex justify-between font-medium text-slate-500">
                              <span>Food Subtotal</span>
                              <span>{activeTenant.currencySymbol} {currentLiveOrder.subtotal}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-amber-900 border-b border-dashed border-amber-100 pb-2">
                              <span>Delivery Rider Fee</span>
                              <span>+ {activeTenant.currencySymbol} {currentLiveOrder.deliveryFee || 0}</span>
                            </div>
                            <div className="flex justify-between font-bold text-slate-900 text-sm pt-1">
                              <span>Final Total</span>
                              <span>{activeTenant.currencySymbol} {currentLiveOrder.total}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                updateOrderStatus(currentLiveOrder.id, 'cancelled', 'Customer');
                                showToast('Order cancelled.', 'success');
                              }}
                              className="rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 font-bold py-2 text-xs transition-colors"
                            >
                              Cancel Order
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                acceptDeliveryFee(currentLiveOrder.id);
                                showToast('Delivery accepted! Cooking started.', 'success');
                              }}
                              className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 text-xs transition-colors shadow"
                            >
                              Accept & Prepare
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Display Delivery Progress details */}
                      {['preparing', 'out_for_delivery', 'delivered'].includes(currentLiveOrder.deliveryStatus || '') && (
                        <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50 flex items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100/50 px-2 py-0.5 rounded uppercase">
                              {currentLiveOrder.deliveryStatus === 'preparing' ? 'Preparing Food' : currentLiveOrder.deliveryStatus === 'out_for_delivery' ? 'Out for Delivery' : 'Delivered'}
                            </span>
                            <p className="text-[11px] font-semibold text-slate-700 mt-1">
                              Rider: {currentLiveOrder.deliveryStaffName || 'Assigned Courier'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-slate-400">Delivery Fee</p>
                            <p className="text-xs font-bold text-slate-700">{activeTenant.currencySymbol} {currentLiveOrder.deliveryFee || 0}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                                    {/* Cancelled Items Notification */}
                  {currentLiveOrder.items.some(it => it.status === 'cancelled') && (
                    <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl text-xs space-y-1.5 mb-4 animate-in fade-in">
                      <p className="font-bold text-rose-800 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-rose-600" />
                        <span>Unavailable Items (Cancelled)</span>
                      </p>
                      <p className="text-[10px] text-rose-700 leading-normal mb-1">
                        We apologize, but the following items cannot be prepared and have been cancelled from your order.
                      </p>
                      <ul className="list-disc list-inside text-[10px] text-rose-900 font-medium space-y-0.5">
                        {currentLiveOrder.items.filter(it => it.status === 'cancelled').map(it => (
                          <li key={it.id}>{it.quantity}x {it.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}

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
                        <div className="flex flex-wrap items-center gap-1.5 mt-2 md:mt-0 w-full md:w-auto">
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

      {/* BUSINESS SEARCH & SWITCH MODAL */}
      {showBizSearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-slate-100 flex flex-col max-h-[80vh] animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3.5">
              <h3 className="font-sans font-bold text-sm text-slate-900">Search Businesses</h3>
              <button 
                onClick={() => setShowBizSearchModal(false)}
                className="text-[10px] bg-slate-100 hover:bg-slate-250 text-slate-500 rounded-lg px-2.5 py-1 font-bold"
              >
                Close
              </button>
            </div>

            <p className="text-[11px] text-slate-400 mb-3">Type below to find any business instantly and access their portal without needing to scan a QR code.</p>

            <div className="relative mb-3 shrink-0">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                
                value={bizSearchTerm}
                onChange={(e) => setBizSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:bg-white"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 p-1">
              {(() => {
                const term = bizSearchTerm.toLowerCase().trim();
                const filtered = tenants.filter(t => 
                  t.name.toLowerCase().includes(term) ||
                  (t.description || '').toLowerCase().includes(term)
                );
                
                if (filtered.length === 0) {
                  return (
                    <p className="text-center text-xs text-slate-400 italic py-6">No matching businesses found.</p>
                  );
                }

                return filtered.map(t => {
                  const isActive = t.id === activeTenantId;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setActiveTenantId(t.id);
                        setShowBizSearchModal(false);
                      }}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                        isActive 
                          ? 'border-indigo-500 bg-indigo-50/50 hover:bg-indigo-50' 
                          : 'border-slate-100 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <img 
                        src={t.logoUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=80'} 
                        alt={t.name}
                        className="h-9 w-9 rounded-full border border-slate-200 object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-slate-900 truncate">{t.name}</span>
                          {isActive && (
                            <span className="bg-indigo-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-450 truncate mt-0.5">{t.description || 'Delicious food & fast dining experience.'}</p>
                      </div>
                    </button>
                  );
                });
              })()}
            </div>
          </div>
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
