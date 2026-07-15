import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Tenant, Branch, PreparationStation, Category, MenuItem, Table, Order, Staff, SystemLog, UserRole, OrderStatus, OrderItem, SubscriptionPlan, PlatformAd, PlanPricing, TimelineEvent, KitchenNote,
  PaymentMethodConfig, LoyaltyConfig, MealSubscriptionPlan, CustomerMealSubscription, CustomerProfile, RefundDetails, LoyaltyHistoryEntry,
  Reservation, Ingredient, StockMovement, MarketplaceExtension, InstalledExtension, DinexNotification, GlobalSettings
} from '../types';
import { 
  mockTenants, mockBranches, mockStations, mockCategories, mockMenuItems, mockTables, mockStaff, mockOrders, mockSystemLogs 
} from '../data/mockData';

interface AppContextType {
  tenants: Tenant[];
  branches: Branch[];
  stations: PreparationStation[];
  categories: Record<string, Category[]>;
  menuItems: Record<string, MenuItem[]>;
  tables: Table[];
  orders: Order[];
  staff: Staff[];
  logs: SystemLog[];
  currentUser: {
    id?: string;
    email: string;
    role: UserRole;
    name: string;
    tenantId?: string;
    branchId?: string;
    stationId?: string;
  } | null;
  activeTenantId: string;
  activeBranchId: string;
  currentLanguage: 'en' | 'am';

  // Reservations
  reservations: Reservation[];
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt' | 'timeline' | 'status'>) => void;
  updateReservationStatus: (id: string, status: Reservation['status'], tableId?: string) => void;

  // Inventory
  ingredients: Ingredient[];
  addIngredient: (ingredient: Omit<Ingredient, 'id'>) => void;
  updateIngredient: (ingredient: Ingredient) => void;
  stockMovements: StockMovement[];
  addStockMovement: (movement: Omit<StockMovement, 'id' | 'date'>) => void;

  // Notifications
  notifications: DinexNotification[];
  markNotificationRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  addNotification: (notification: Omit<DinexNotification, 'id' | 'createdAt' | 'read'>) => void;

  // Marketplace
  marketplaceExtensions: MarketplaceExtension[];
  installedExtensions: InstalledExtension[];
  installExtension: (tenantId: string, extensionId: string) => void;
  uninstallExtension: (tenantId: string, extensionId: string) => void;

  // Platform Settings
  globalSettings: GlobalSettings;
  updateGlobalSettings: (settings: Partial<GlobalSettings>) => void;
  
  // Actions
  login: (email: string) => boolean;
  logout: () => void;
  setActiveTenantId: (id: string) => void;
  setActiveBranchId: (id: string) => void;
  setLanguage: (lang: 'en' | 'am') => void;
  
  // Menu Category Actions
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (tenantId: string, categoryId: string) => void;
  
  // Menu Item Actions
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (tenantId: string, itemId: string) => void;
  toggleMenuItemAvailability: (tenantId: string, itemId: string) => void;
  
  // Table Actions
  addTable: (table: Omit<Table, 'id' | 'qrUrl'>) => void;
  updateTableStatus: (tableId: string, status: Table['status']) => void;
  
  // Station Actions
  addStation: (station: Omit<PreparationStation, 'id'>) => void;
  
  // Order Actions
  placeOrder: (order: Omit<Order, 'id' | 'orderNum' | 'createdAt' | 'status' | 'paymentStatus' | 'subtotal' | 'tax' | 'serviceCharge' | 'total' | 'timeline' | 'kitchenNotes'> & { tip?: number }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, actor?: string) => void;
  updateOrderItemStatus: (orderId: string, itemId: string, status: OrderItem['status'], actor?: string) => void;
  processPayment: (orderId: string, paymentMethod: Order['paymentMethod'], discountPercentage: number, redeemPoints?: number, tipAmount?: number) => void;
  rateAndFeedback: (orderId: string, rating: number, feedback: string) => void;
  cancelOrder: (orderId: string, reason: string) => void;
  verifyAdvancePayment: (orderId: string, approve: boolean, rejectionReason?: string) => void;
  addKitchenNote: (orderId: string, text: string) => void;
  approveKitchenNote: (orderId: string, noteId: string, approve: boolean) => void;
  addTip: (orderId: string, amount: number) => void;
  deliverTip: (orderId: string) => void;
  
  // Staff Actions
  addStaffMember: (member: Omit<Staff, 'id' | 'active'>) => void;
  toggleStaffStatus: (staffId: string) => void;
  updateStaffPermissions: (staffId: string, permissions: string[]) => void;
  
  // Super Admin Actions
  toggleTenantStatus: (tenantId: string) => void;
  updateTenantPlan: (tenantId: string, plan: Tenant['subscriptionPlan']) => void;
  requestTenantUpgrade: (tenantId: string, plan: Tenant['subscriptionPlan']) => void;
  updateTenantCurrency: (tenantId: string, currency: string, currencySymbol: string) => void;
  updateTenantProfile: (tenantId: string, logoUrl: string, bankAccount: string) => void;
  approveTenantStatus: (tenantId: string) => void;
  rejectTenantStatus: (tenantId: string) => void;
  
  // Platform Ads Actions
  ads: PlatformAd[];
  addAd: (adData: Omit<PlatformAd, 'id' | 'createdAt' | 'active'>) => void;
  toggleAdStatus: (id: string) => void;
  deleteAd: (id: string) => void;
  
  // Pricing Actions
  pricingPlans: PlanPricing[];
  updatePlanPrice: (planId: SubscriptionPlan, newPriceUSD: number, newPriceETB: number) => void;

  // Register Tenant Action
  registerTenant: (tenantData: {
    name: string;
    slug: string;
    description: string;
    currency: string;
    subscriptionPlan: SubscriptionPlan;
    ownerEmail: string;
    ownerName: string;
  }) => void;
  signUpOwnerOnly: (name: string, email: string) => void;
  
  // General helper
  addLog: (action: string, details: string) => void;

  // Payment configuration
  paymentMethodsConfigs: Record<string, PaymentMethodConfig[]>;
  updatePaymentMethodConfig: (tenantId: string, configs: PaymentMethodConfig[]) => void;

  // Loyalty Program
  loyaltyConfigs: Record<string, LoyaltyConfig>;
  updateLoyaltyConfig: (tenantId: string, config: LoyaltyConfig) => void;

  // Meal Subscription
  mealSubscriptionPlans: Record<string, MealSubscriptionPlan[]>;
  customerSubscriptions: CustomerMealSubscription[];
  addMealSubscriptionPlan: (plan: Omit<MealSubscriptionPlan, 'id'>) => void;
  updateMealSubscriptionPlan: (plan: MealSubscriptionPlan) => void;
  deleteMealSubscriptionPlan: (tenantId: string, planId: string) => void;
  subscribeToMealPlan: (subscription: Omit<CustomerMealSubscription, 'id'>) => void;
  logMealService: (subscriptionId: string) => void;

  // Refunds
  refundOrder: (orderId: string, amount: number, reason: string, actor: string) => void;

  // Customer Profile
  customerProfiles: Record<string, CustomerProfile>;
  updateCustomerProfile: (email: string, profile: Partial<CustomerProfile>) => void;
  addFavoriteItem: (email: string, menuItemId: string) => void;
  removeFavoriteItem: (email: string, menuItemId: string) => void;
  addSavedAddress: (email: string, name: string, address: string) => void;
  removeSavedAddress: (email: string, addressId: string) => void;

  // Tips
  updateTipStatus: (orderId: string, status: 'pending' | 'delivered' | 'accepted') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const CACHE_VERSION = 'v5_order_engine';

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Clear cache if version mismatch to purge old KSh mock data
  useEffect(() => {
    const ver = localStorage.getItem('mf_version');
    if (ver !== CACHE_VERSION) {
      localStorage.removeItem('mf_tenants');
      localStorage.removeItem('mf_branches');
      localStorage.removeItem('mf_stations');
      localStorage.removeItem('mf_categories');
      localStorage.removeItem('mf_menu_items');
      localStorage.removeItem('mf_tables');
      localStorage.removeItem('mf_orders');
      localStorage.removeItem('mf_staff');
      localStorage.removeItem('mf_logs');
      localStorage.removeItem('mf_ads');
      localStorage.setItem('mf_version', CACHE_VERSION);
      // Reload the page to grab fresh mockData
      window.location.reload();
    }
  }, []);

  // Load state from local storage or fallback to mock data
  const [tenants, setTenants] = useState<Tenant[]>(() => {
    const local = localStorage.getItem('mf_tenants');
    return local ? JSON.parse(local) : mockTenants;
  });

  const [branches, setBranches] = useState<Branch[]>(() => {
    const local = localStorage.getItem('mf_branches');
    return local ? JSON.parse(local) : mockBranches;
  });

  const [stations, setStations] = useState<PreparationStation[]>(() => {
    const local = localStorage.getItem('mf_stations');
    return local ? JSON.parse(local) : mockStations;
  });

  const [categories, setCategories] = useState<Record<string, Category[]>>(() => {
    const local = localStorage.getItem('mf_categories');
    return local ? JSON.parse(local) : mockCategories;
  });

  const [menuItems, setMenuItems] = useState<Record<string, MenuItem[]>>(() => {
    const local = localStorage.getItem('mf_menu_items');
    return local ? JSON.parse(local) : mockMenuItems;
  });

  const [tables, setTables] = useState<Table[]>(() => {
    const local = localStorage.getItem('mf_tables');
    return local ? JSON.parse(local) : mockTables;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const local = localStorage.getItem('mf_orders');
    return local ? JSON.parse(local) : mockOrders;
  });

  const [staff, setStaff] = useState<Staff[]>(() => {
    const local = localStorage.getItem('mf_staff');
    return local ? JSON.parse(local) : mockStaff;
  });

  const [logs, setLogs] = useState<SystemLog[]>(() => {
    const local = localStorage.getItem('mf_logs');
    return local ? JSON.parse(local) : mockSystemLogs;
  });

  const [pricingPlans, setPricingPlans] = useState<PlanPricing[]>(() => {
    const local = localStorage.getItem('mf_pricing');
    if (local) return JSON.parse(local);
    return [
      {
        id: 'free',
        name: 'Free Tier',
        priceUSD: 0,
        priceETB: 0,
        description: 'Get menu service for free! Basic digital menu, QR scanning, and self-serve dine-in ordering.',
        features: ['1 branch', 'digital menus & QR scans']
      },
      {
        id: 'growth',
        name: 'Growth Plan',
        priceUSD: 29,
        priceETB: 1500,
        description: 'Unlock multi-branch sync, interactive kitchen/waiter stations, detailed reporting & CRM.',
        features: ['Multi-branch', 'full KDS', 'automated metrics']
      },
      {
        id: 'enterprise',
        name: 'Enterprise Plan',
        priceUSD: 99,
        priceETB: 5000,
        description: 'Unlimited branches, customized branding, high-frequency Live API, and 24/7 dedicated account manager.',
        features: ['SLA guarantee', 'central controls', 'custom branding']
      }
    ];
  });

  const [ads, setAds] = useState<PlatformAd[]>(() => {
    const local = localStorage.getItem('mf_ads');
    if (local) return JSON.parse(local);
    return [
      {
        id: 'ad-01',
        tenantId: 't-01',
        title: 'Weekend 20% Off Espresso Specials!',
        subtitle: 'Get Carlos Specialty Brews with a 20% discount this Saturday and Sunday only.',
        imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop&q=80',
        active: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'ad-02',
        title: 'Discover Premium Dining',
        subtitle: 'Order directly from any registered brand on MenuFlow. Scan or pre-order instantly!',
        imageUrl: 'https://images.unsplash.com/photo-1526367790999-015078648c7e?w=800&auto=format&fit=crop&q=80',
        active: true,
        createdAt: new Date().toISOString()
      }
    ];
  });

  // Sync to local storage on state changes
  useEffect(() => {
    localStorage.setItem('mf_pricing', JSON.stringify(pricingPlans));
  }, [pricingPlans]);

  useEffect(() => {
    localStorage.setItem('mf_ads', JSON.stringify(ads));
  }, [ads]);

  // 1. Payment Methods Configs State
  const [paymentMethodsConfigs, setPaymentMethodsConfigs] = useState<Record<string, PaymentMethodConfig[]>>(() => {
    const local = localStorage.getItem('mf_payment_methods');
    if (local) return JSON.parse(local);
    
    const defaultConfigs: PaymentMethodConfig[] = [
      { id: 'cash', name: 'Cash', enabled: true, requiresProof: false },
      { id: 'card', name: 'Card', enabled: true, requiresProof: false },
      { id: 'stripe', name: 'Stripe', enabled: true, requiresProof: false },
      { id: 'mobile_money', name: 'Mobile Money', enabled: true, requiresProof: true, details: 'Telebirr: 0911223344, CBE Birr: +251911223344' },
      { id: 'bank_transfer', name: 'Bank Transfer', enabled: true, requiresProof: true, details: 'Commercial Bank of Ethiopia: 1000123456789 (Dinex PLC)' },
      { id: 'binance_id', name: 'Binance Pay (ID)', enabled: true, requiresProof: true, details: 'Binance Pay ID: 88776655' },
      { id: 'binance_wallet', name: 'Binance BEP20 Wallet', enabled: true, requiresProof: true, details: 'BEP20 Address: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F' }
    ];
    return {
      't-01': defaultConfigs,
      't-02': defaultConfigs
    };
  });

  useEffect(() => {
    localStorage.setItem('mf_payment_methods', JSON.stringify(paymentMethodsConfigs));
  }, [paymentMethodsConfigs]);

  // 2. Loyalty Configurations State
  const [loyaltyConfigs, setLoyaltyConfigs] = useState<Record<string, LoyaltyConfig>>(() => {
    const local = localStorage.getItem('mf_loyalty_configs');
    if (local) return JSON.parse(local);
    
    const defaultConfig: LoyaltyConfig = {
      enabled: true,
      pointsPerPurchase: 1,
      minPointsToRedeem: 10,
      discountPercentage: 10,
      badgeLevels: [
        { name: 'Bronze Patron', minPoints: 10, discountBonus: 1 },
        { name: 'Silver Patron', minPoints: 50, discountBonus: 3 },
        { name: 'Gold Patron', minPoints: 150, discountBonus: 5 },
        { name: 'Platinum Patron', minPoints: 300, discountBonus: 10 }
      ]
    };
    return {
      't-01': defaultConfig,
      't-02': defaultConfig
    };
  });

  useEffect(() => {
    localStorage.setItem('mf_loyalty_configs', JSON.stringify(loyaltyConfigs));
  }, [loyaltyConfigs]);

  // 3. Meal Subscription Plans State
  const [mealSubscriptionPlans, setMealSubscriptionPlans] = useState<Record<string, MealSubscriptionPlan[]>>(() => {
    const local = localStorage.getItem('mf_meal_subscription_plans');
    if (local) return JSON.parse(local);
    
    return {
      't-01': [
        {
          id: 'sub-plan-01',
          tenantId: 't-01',
          name: 'Daily Power Lunch Sub',
          monthlyPrice: 150,
          discountPercentage: 20,
          durationDays: 30,
          mealsPerDay: 1,
          mealsPerWeek: 5,
          allowedOrderingTimes: '11:30-14:30',
          menuItemIds: ['item-1', 'item-1-t-01', 'item-2-t-01']
        },
        {
          id: 'sub-plan-02',
          tenantId: 't-01',
          name: 'Traditional Coffee & Pastry Plan',
          monthlyPrice: 50,
          discountPercentage: 15,
          durationDays: 30,
          mealsPerDay: 1,
          mealsPerWeek: 7,
          allowedOrderingTimes: '07:00-11:00',
          menuItemIds: ['item-2', 'item-2-t-01']
        }
      ]
    };
  });

  useEffect(() => {
    localStorage.setItem('mf_meal_subscription_plans', JSON.stringify(mealSubscriptionPlans));
  }, [mealSubscriptionPlans]);

  // 4. Customer Meal Subscriptions State
  const [customerSubscriptions, setCustomerSubscriptions] = useState<CustomerMealSubscription[]>(() => {
    const local = localStorage.getItem('mf_customer_subscriptions');
    return local ? JSON.parse(local) : [];
  });

  useEffect(() => {
    localStorage.setItem('mf_customer_subscriptions', JSON.stringify(customerSubscriptions));
  }, [customerSubscriptions]);

  // 4a. Final Features State (Fully migrated to Firestore with realtime listeners & localStorage fallback)
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const local = localStorage.getItem('mf_reservations');
    return local ? JSON.parse(local) : [];
  });
  useEffect(() => { localStorage.setItem('mf_reservations', JSON.stringify(reservations)); }, [reservations]);

  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
    const local = localStorage.getItem('mf_ingredients');
    return local ? JSON.parse(local) : [];
  });
  useEffect(() => { localStorage.setItem('mf_ingredients', JSON.stringify(ingredients)); }, [ingredients]);

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    const local = localStorage.getItem('mf_stock_movements');
    return local ? JSON.parse(local) : [];
  });
  useEffect(() => { localStorage.setItem('mf_stock_movements', JSON.stringify(stockMovements)); }, [stockMovements]);

  const [notifications, setNotifications] = useState<DinexNotification[]>(() => {
    const local = localStorage.getItem('mf_notifications');
    return local ? JSON.parse(local) : [];
  });
  useEffect(() => { localStorage.setItem('mf_notifications', JSON.stringify(notifications)); }, [notifications]);

  const [marketplaceExtensions, setMarketplaceExtensions] = useState<MarketplaceExtension[]>(() => {
    const local = localStorage.getItem('mf_marketplace_extensions');
    return local ? JSON.parse(local) : [];
  });
  useEffect(() => { localStorage.setItem('mf_marketplace_extensions', JSON.stringify(marketplaceExtensions)); }, [marketplaceExtensions]);

  const [installedExtensions, setInstalledExtensions] = useState<InstalledExtension[]>(() => {
    const local = localStorage.getItem('mf_installed_extensions');
    return local ? JSON.parse(local) : [];
  });
  useEffect(() => { localStorage.setItem('mf_installed_extensions', JSON.stringify(installedExtensions)); }, [installedExtensions]);

  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(() => {
    const local = localStorage.getItem('mf_global_settings');
    return local ? JSON.parse(local) : {
      supportedCountries: ['Ethiopia', 'Kenya', 'Rwanda', 'Nigeria', 'South Africa'],
      supportedCurrencies: ['ETB', 'KES', 'RWF', 'NGN', 'ZAR', 'USD'],
      maintenanceMode: false,
      announcements: [],
      globalFeatureFlags: {}
    };
  });
  useEffect(() => { localStorage.setItem('mf_global_settings', JSON.stringify(globalSettings)); }, [globalSettings]);

  useEffect(() => {
    const initializeListeners = async () => {
      try {
        const { getDB } = await import('../lib/firebase');
        const db = getDB();
        if (db) {
          const { collection, onSnapshot, doc: firestoreDoc } = await import('firebase/firestore');

          const unsubscribeReservations = onSnapshot(collection(db, 'reservations'), (snapshot) => {
            const list: Reservation[] = [];
            snapshot.forEach((docSnap) => {
              list.push({ id: docSnap.id, ...docSnap.data() } as Reservation);
            });
            setReservations(list);
          }, (err) => {
            console.error("Firestore reservations listener error:", err);
          });

          const unsubscribeIngredients = onSnapshot(collection(db, 'ingredients'), (snapshot) => {
            const list: Ingredient[] = [];
            snapshot.forEach((docSnap) => {
              list.push({ id: docSnap.id, ...docSnap.data() } as Ingredient);
            });
            setIngredients(list);
          }, (err) => {
            console.error("Firestore ingredients listener error:", err);
          });

          const unsubscribeStockMovements = onSnapshot(collection(db, 'stock_movements'), (snapshot) => {
            const list: StockMovement[] = [];
            snapshot.forEach((docSnap) => {
              list.push({ id: docSnap.id, ...docSnap.data() } as StockMovement);
            });
            setStockMovements(list);
          }, (err) => {
            console.error("Firestore stock movements listener error:", err);
          });

          const unsubscribeNotifications = onSnapshot(collection(db, 'notifications'), (snapshot) => {
            const list: DinexNotification[] = [];
            snapshot.forEach((docSnap) => {
              list.push({ id: docSnap.id, ...docSnap.data() } as DinexNotification);
            });
            list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setNotifications(list);
          }, (err) => {
            console.error("Firestore notifications listener error:", err);
          });

          const unsubscribeMarketplaceExtensions = onSnapshot(collection(db, 'marketplace_extensions'), (snapshot) => {
            const list: MarketplaceExtension[] = [];
            snapshot.forEach((docSnap) => {
              list.push({ id: docSnap.id, ...docSnap.data() } as MarketplaceExtension);
            });
            setMarketplaceExtensions(list);
          }, (err) => {
            console.error("Firestore marketplace extensions listener error:", err);
          });

          const unsubscribeInstalledExtensions = onSnapshot(collection(db, 'installed_extensions'), (snapshot) => {
            const list: InstalledExtension[] = [];
            snapshot.forEach((docSnap) => {
              list.push({ id: docSnap.id, ...docSnap.data() } as InstalledExtension);
            });
            setInstalledExtensions(list);
          }, (err) => {
            console.error("Firestore installed extensions listener error:", err);
          });

          const unsubscribeGlobalSettings = onSnapshot(firestoreDoc(db, 'system_settings', 'global'), (docSnapshot) => {
            if (docSnapshot.exists()) {
              setGlobalSettings(docSnapshot.data() as GlobalSettings);
            }
          }, (err) => {
            console.error("Firestore global settings listener error:", err);
          });

          return () => {
            unsubscribeReservations();
            unsubscribeIngredients();
            unsubscribeStockMovements();
            unsubscribeNotifications();
            unsubscribeMarketplaceExtensions();
            unsubscribeInstalledExtensions();
            unsubscribeGlobalSettings();
          };
        }
      } catch (err) {
        console.warn("Error setting up Firestore realtime listeners:", err);
      }
    };

    let unsubscribeFn: (() => void) | undefined;
    initializeListeners().then((unsub) => {
      unsubscribeFn = unsub;
    });

    return () => {
      if (unsubscribeFn) {
        unsubscribeFn();
      }
    };
  }, []);

  // 5. Customer Profiles State
  const [customerProfiles, setCustomerProfiles] = useState<Record<string, CustomerProfile>>(() => {
    const local = localStorage.getItem('mf_customer_profiles');
    if (local) return JSON.parse(local);

    return {
      'naolnigatu2025@gmail.com': {
        id: 'cust-naol',
        email: 'naolnigatu2025@gmail.com',
        name: 'Naol Nigatu',
        phone: '+251 912 345 678',
        savedAddresses: [
          { id: 'addr-1', name: 'Home', address: 'Bole, District 3, Addis Ababa' },
          { id: 'addr-2', name: 'Office', address: 'Dinex Tech Hub, Level 4, Addis Ababa' }
        ],
        savedFavorites: ['item-1', 'item-2'],
        loyaltyPoints: 340,
        loyaltyHistory: [
          { id: 'lh-1', date: '2026-07-10T12:00:00Z', points: 150, type: 'earn', orderNum: 'MF-4412', description: 'Earned on ordering House Special Dish' },
          { id: 'lh-2', date: '2026-07-11T15:30:00Z', points: 200, type: 'earn', orderNum: 'MF-8821', description: 'Earned on ordering Ethio-Macchiato' },
          { id: 'lh-3', date: '2026-07-12T09:00:00Z', points: -10, type: 'redeem', orderNum: 'MF-1102', description: 'Redeemed points for $10.00 discount' }
        ]
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('mf_customer_profiles', JSON.stringify(customerProfiles));
  }, [customerProfiles]);

  // Active configurations
  const [activeTenantId, setActiveTenantId] = useState<string>(() => {
    return localStorage.getItem('mf_active_tenant_id') || 't-01';
  });

  const [activeBranchId, setActiveBranchId] = useState<string>(() => {
    return localStorage.getItem('mf_active_branch_id') || 'b-01';
  });

  const [currentLanguage, setLanguage] = useState<'en' | 'am'>('en');

  // Currently logged-in operational user (Simulated)
  const [currentUser, setCurrentUser] = useState<AppContextType['currentUser']>(() => {
    const saved = localStorage.getItem('mf_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Sync to local storage on state changes
  useEffect(() => {
    localStorage.setItem('mf_tenants', JSON.stringify(tenants));
  }, [tenants]);

  useEffect(() => {
    localStorage.setItem('mf_branches', JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem('mf_stations', JSON.stringify(stations));
  }, [stations]);

  useEffect(() => {
    localStorage.setItem('mf_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('mf_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('mf_tables', JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem('mf_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('mf_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('mf_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('mf_active_tenant_id', activeTenantId);
    // Auto-update active branch when tenant changes
    const tenantBranches = branches.filter(b => b.tenantId === activeTenantId);
    if (tenantBranches.length > 0 && !tenantBranches.some(b => b.id === activeBranchId)) {
      setActiveBranchId(tenantBranches[0].id);
    }
  }, [activeTenantId, branches, activeBranchId]);

  useEffect(() => {
    localStorage.setItem('mf_active_branch_id', activeBranchId);
  }, [activeBranchId]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mf_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mf_current_user');
    }
  }, [currentUser]);

  // Actions implementation
  const addLog = (action: string, details: string) => {
    const newLog: SystemLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      tenantId: currentUser?.tenantId,
      userEmail: currentUser?.email || 'guest@menuflow.com',
      role: currentUser?.role || 'customer',
      action,
      timestamp: new Date().toISOString(),
      details
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const login = (email: string): boolean => {
    // 1. Check Super Admin
    const cleanEmail = (email || '').toLowerCase().trim();
    if (cleanEmail === 'admin@menuflow.com' || cleanEmail === 'naolnigatu2025@gmail.com') {
      const name = cleanEmail === 'naolnigatu2025@gmail.com' ? 'Naol Nigatu (Platform Admin)' : 'Super Administrator';
      const user = { email: cleanEmail, role: 'super_admin' as const, name };
      setCurrentUser(user);
      addLog('Login', `${name} logged in.`);
      return true;
    }

    // 2. Check Staff list
    const foundStaff = staff.find(s => (s.email || '').toLowerCase().trim() === cleanEmail && s.active);
    if (foundStaff) {
      const tenantObj = tenants.find(t => t.id === foundStaff.tenantId);
      const user = {
        id: foundStaff.id,
        email: foundStaff.email,
        role: foundStaff.role,
        name: foundStaff.name,
        tenantId: foundStaff.tenantId,
        branchId: foundStaff.branchId,
        stationId: foundStaff.stationId
      };
      setCurrentUser(user);
      setActiveTenantId(foundStaff.tenantId);
      setActiveBranchId(foundStaff.branchId);
      addLog('Login', `Staff ${foundStaff.name} logged in as ${foundStaff.role}.`);
      return true;
    }

    // 3. Check Owner signups from tenants list (fallback)
    const foundTenant = tenants.find(t => (t.ownerEmail || '').toLowerCase().trim() === cleanEmail);
    if (foundTenant) {
      const tenantBranch = branches.find(b => b.tenantId === foundTenant.id);
      const user = {
        email,
        role: 'owner' as const,
        name: foundTenant.name + ' Owner',
        tenantId: foundTenant.id,
        branchId: tenantBranch?.id || ''
      };
      setCurrentUser(user);
      setActiveTenantId(foundTenant.id);
      if (tenantBranch) setActiveBranchId(tenantBranch.id);
      addLog('Login', `Tenant Owner (${email}) logged in.`);
      return true;
    }

    return false;
  };

  const logout = () => {
    addLog('Logout', `User logged out.`);
    setCurrentUser(null);
  };

  // Menu Categories
  const addCategory = (catData: Omit<Category, 'id'>) => {
    const id = `cat-${Date.now()}`;
    const newCat: Category = {
      ...catData,
      id
    };
    setCategories(prev => {
      const list = prev[catData.tenantId] || [];
      return {
        ...prev,
        [catData.tenantId]: [...list, newCat].sort((a, b) => a.orderNum - b.orderNum)
      };
    });
    addLog('Create Category', `Created menu category: ${catData.name}`);
    syncToFirestore('categories', id, newCat);
  };

  const updateCategory = (updatedCat: Category) => {
    setCategories(prev => {
      const list = prev[updatedCat.tenantId] || [];
      const updated = list.map(c => c.id === updatedCat.id ? updatedCat : c);
      return {
        ...prev,
        [updatedCat.tenantId]: updated.sort((a, b) => a.orderNum - b.orderNum)
      };
    });
    addLog('Update Category', `Updated menu category: ${updatedCat.name}`);
    syncToFirestore('categories', updatedCat.id, updatedCat);
  };

  const deleteCategory = (tenantId: string, categoryId: string) => {
    const catName = categories[tenantId]?.find(c => c.id === categoryId)?.name || '';
    setCategories(prev => {
      const list = prev[tenantId] || [];
      return {
        ...prev,
        [tenantId]: list.filter(c => c.id !== categoryId)
      };
    });
    addLog('Delete Category', `Deleted menu category: ${catName}`);
    deleteFromFirestore('categories', categoryId);
  };

  // Menu Items
  const addMenuItem = (itemData: Omit<MenuItem, 'id'>) => {
    const id = `item-${Date.now()}`;
    const newItem: MenuItem = {
      ...itemData,
      id
    };
    setMenuItems(prev => {
      const list = prev[itemData.tenantId] || [];
      return {
        ...prev,
        [itemData.tenantId]: [...list, newItem]
      };
    });
    addLog('Create Menu Item', `Created menu item: ${itemData.name}`);
    syncToFirestore('menu_items', id, newItem);
  };

  const updateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems(prev => {
      const list = prev[updatedItem.tenantId] || [];
      return {
        ...prev,
        [updatedItem.tenantId]: list.map(i => i.id === updatedItem.id ? updatedItem : i)
      };
    });
    addLog('Update Menu Item', `Updated menu item: ${updatedItem.name}`);
    syncToFirestore('menu_items', updatedItem.id, updatedItem);
  };

  const deleteMenuItem = (tenantId: string, itemId: string) => {
    const itemName = menuItems[tenantId]?.find(i => i.id === itemId)?.name || '';
    setMenuItems(prev => {
      const list = prev[tenantId] || [];
      return {
        ...prev,
        [tenantId]: list.filter(i => i.id !== itemId)
      };
    });
    addLog('Delete Menu Item', `Deleted menu item: ${itemName}`);
    deleteFromFirestore('menu_items', itemId);
  };

  const toggleMenuItemAvailability = (tenantId: string, itemId: string) => {
    const itemName = menuItems[tenantId]?.find(i => i.id === itemId)?.name || '';
    setMenuItems(prev => {
      const list = prev[tenantId] || [];
      return {
        ...prev,
        [tenantId]: list.map(i => i.id === itemId ? { ...i, isAvailable: !i.isAvailable } : i)
      };
    });
    const currentItem = menuItems[tenantId]?.find(i => i.id === itemId);
    if (currentItem) {
      addLog('Toggle Availability', `Toggled availability for menu item ${itemName} to ${!currentItem.isAvailable ? 'available' : 'unavailable'}`);
      syncToFirestore('menu_items', itemId, { ...currentItem, isAvailable: !currentItem.isAvailable });
    }
  };

  // Tables
  const addTable = (tableData: Omit<Table, 'id' | 'qrUrl'>) => {
    const id = `tab-${Date.now()}`;
    const newTable: Table = {
      ...tableData,
      id,
      qrUrl: `https://menuflow.io/${activeTenantId}/${tableData.branchId}/${id}`
    };
    setTables(prev => [...prev, newTable]);
    addLog('Create Table', `Created Table: ${tableData.number} in ${tableData.section}`);
    syncToFirestore('tables', id, newTable);
  };

  const updateTableStatus = (tableId: string, status: Table['status']) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status } : t));
    const tbl = tables.find(t => t.id === tableId);
    if (tbl) {
      syncToFirestore('tables', tableId, { ...tbl, status });
    }
  };

  // Stations
  const addStation = (stationData: Omit<PreparationStation, 'id'>) => {
    const id = `st-${Date.now()}`;
    const newStation: PreparationStation = {
      ...stationData,
      id
    };
    setStations(prev => [...prev, newStation]);
    addLog('Create Station', `Created preparation station: ${stationData.name}`);
    syncToFirestore('stations', id, newStation);
  };

  // Orders
  const placeOrder = (orderData: Omit<Order, 'id' | 'orderNum' | 'createdAt' | 'status' | 'paymentStatus' | 'subtotal' | 'tax' | 'serviceCharge' | 'total' | 'timeline' | 'kitchenNotes'> & { tip?: number }) => {
    const tenant = tenants.find(t => t.id === orderData.tenantId) || mockTenants[0];
    
    // Calculate financial subtotals
    let subtotal = 0;
    orderData.items.forEach(it => {
      let itemCost = it.price;
      (it.selectedModifiers || []).forEach(m => {
        itemCost += m.price;
      });
      subtotal += itemCost * it.quantity;
    });

    const taxAmount = parseFloat(((subtotal * tenant.baseTaxRate) / 100).toFixed(2));
    const serviceChargeAmount = parseFloat(((subtotal * tenant.serviceCharge) / 100).toFixed(2));
    const tipAmount = orderData.tip || 0;
    const totalAmount = parseFloat((subtotal + taxAmount + serviceChargeAmount + tipAmount - orderData.discount).toFixed(2));

    const hrId = `MF-${Math.floor(1000 + Math.random() * 9000)}`;

    const initialPaymentStatus = orderData.paymentVerificationStatus === 'approved' ? ('paid' as const) : ('pending' as const);
    const initialStatus = orderData.paymentVerificationStatus === 'approved' ? ('accepted' as const) : ('pending' as const);

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNum: hrId,
      status: initialStatus,
      paymentStatus: initialPaymentStatus,
      subtotal,
      tax: taxAmount,
      serviceCharge: serviceChargeAmount,
      tip: tipAmount,
      total: totalAmount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        { id: `ev-${Date.now()}-1`, time: new Date().toISOString(), label: 'Order Placed', desc: `New order registered. Payment via ${orderData.paymentMethod}`, actor: 'Customer' }
      ],
      kitchenNotes: []
    };

    setOrders(prev => [newOrder, ...prev]);

    // Update table status if dine-in
    if (orderData.type === 'dine_in' && orderData.tableId) {
      updateTableStatus(orderData.tableId, 'waiting');
    }

    addLog('Place Order', `New order ${hrId} placed. Total: ${tenant.currencySymbol} ${totalAmount}`);
    syncToFirestore('orders', newOrder.id, newOrder);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, actor?: string) => {
    const existing = orders.find(o => o.id === orderId);
    if (!existing) return;

    let items = [...existing.items];
    if (status === 'preparing') {
      items = items.map(it => it.status === 'received' ? { ...it, status: 'cooking' as const } : it);
    } else if (status === 'ready') {
      items = items.map(it => it.status === 'received' || it.status === 'cooking' ? { ...it, status: 'ready' as const } : it);
    } else if (status === 'served') {
      items = items.map(it => ({ ...it, status: 'delivered' as const }));
    }

    const statusLabels: Record<OrderStatus, string> = {
      pending: 'Pending',
      accepted: 'Accepted',
      preparing: 'Preparing',
      ready: 'Ready',
      served: 'Served',
      completed: 'Completed',
      cancelled: 'Cancelled',
      refunded: 'Refunded'
    };

    const newEvent: TimelineEvent = {
      id: `ev-${Date.now()}`,
      time: new Date().toISOString(),
      label: `Status: ${statusLabels[status]}`,
      desc: `Order status set to ${statusLabels[status]}`,
      actor: actor || 'Staff'
    };

    const updated: Order = { 
      ...existing, 
      status, 
      items,
      updatedAt: new Date().toISOString(),
      timeline: [...(existing.timeline || []), newEvent]
    };

    setOrders(prev => prev.map(o => o.id === orderId ? updated : o));

    if (updated.tableId && updated.type === 'dine_in') {
      if (status === 'accepted' || status === 'preparing' || status === 'ready') {
        updateTableStatus(updated.tableId, 'waiting');
      } else if (status === 'served') {
        updateTableStatus(updated.tableId, 'eating');
      } else if (status === 'completed' || status === 'cancelled') {
        updateTableStatus(updated.tableId, 'empty');
      }
    }

    addLog('Update Order Status', `Order ID ${orderId} status set to: ${status}`);
    syncToFirestore('orders', orderId, updated);
  };

  const updateOrderItemStatus = (orderId: string, itemId: string, itemStatus: OrderItem['status'], actor?: string) => {
    const existing = orders.find(o => o.id === orderId);
    if (!existing) return;

    const updatedItems = existing.items.map(it => it.id === itemId ? { ...it, status: itemStatus } : it);
    
    // Compute overarching order status based on item states
    let overarchingStatus: OrderStatus = existing.status;
    const allDelivered = updatedItems.every(it => it.status === 'delivered');
    const anyDelivered = updatedItems.some(it => it.status === 'delivered');
    const allReady = updatedItems.every(it => it.status === 'ready' || it.status === 'delivered');
    const anyCooking = updatedItems.some(it => it.status === 'cooking' || it.status === 'ready');

    if (allDelivered) {
      overarchingStatus = 'served';
    } else if (allReady) {
      overarchingStatus = 'ready';
    } else if (anyCooking) {
      overarchingStatus = 'preparing';
    }

    // Sync table state automatically
    if (existing.tableId && existing.type === 'dine_in') {
      if (allDelivered) {
        updateTableStatus(existing.tableId, 'eating');
      } else if (anyDelivered || allReady || anyCooking) {
        updateTableStatus(existing.tableId, 'waiting');
      }
    }

    const itemObj = existing.items.find(it => it.id === itemId);
    const newEvent: TimelineEvent = {
      id: `ev-${Date.now()}`,
      time: new Date().toISOString(),
      label: `Item: ${itemObj?.name || 'Item'} status is ${itemStatus}`,
      desc: `Item moved to ${itemStatus}`,
      actor: actor || 'Staff'
    };

    const updated: Order = {
      ...existing,
      items: updatedItems,
      status: overarchingStatus,
      updatedAt: new Date().toISOString(),
      timeline: [...(existing.timeline || []), newEvent]
    };

    setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    addLog('Update Order Item Status', `Item ${itemObj?.name || itemId} status set to: ${itemStatus}`);
    syncToFirestore('orders', orderId, updated);
  };

  const processPayment = (orderId: string, paymentMethod: Order['paymentMethod'], discountPercentage: number, redeemPoints = 0, tipAmount = 0) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    const tenant = tenants.find(t => t.id === targetOrder.tenantId) || mockTenants[0];
    const discountVal = parseFloat(((targetOrder.subtotal * discountPercentage) / 100).toFixed(2));
    const pointsDiscount = redeemPoints * tenant.loyaltyRedeemValue;
    const finalDiscount = discountVal + pointsDiscount;
    const taxAmount = parseFloat(((targetOrder.subtotal * tenant.baseTaxRate) / 100).toFixed(2));
    const serviceChargeAmount = parseFloat(((targetOrder.subtotal * tenant.serviceCharge) / 100).toFixed(2));
    const finalTotal = parseFloat((targetOrder.subtotal + taxAmount + serviceChargeAmount + tipAmount - finalDiscount).toFixed(2));
    const loyaltyEarned = Math.floor(finalTotal * tenant.loyaltyPointsRatio);

    // Loyalty integration
    if (targetOrder.customerEmail) {
      const email = targetOrder.customerEmail;
      setCustomerProfiles(prev => {
        const current = prev[email] || {
          id: `cust-${Date.now()}`,
          email,
          name: targetOrder.customerName || email.split('@')[0],
          phone: targetOrder.customerPhone || '',
          savedAddresses: [],
          savedFavorites: [],
          loyaltyPoints: 0,
          loyaltyHistory: []
        };
        const updatedPoints = Math.max(0, current.loyaltyPoints + loyaltyEarned - redeemPoints);
        const newHistoryEntry: LoyaltyHistoryEntry = {
          id: `lh-${Date.now()}`,
          date: new Date().toISOString(),
          points: loyaltyEarned,
          type: 'earn',
          orderNum: targetOrder.orderNum,
          description: `Earned on order ${targetOrder.orderNum}`
        };
        const redeemHistoryEntry: LoyaltyHistoryEntry[] = redeemPoints > 0 ? [{
          id: `lh-${Date.now()}-red`,
          date: new Date().toISOString(),
          points: -redeemPoints,
          type: 'redeem' as const,
          orderNum: targetOrder.orderNum,
          description: `Redeemed on order ${targetOrder.orderNum}`
        }] : [];
        const updatedProfile = {
          ...current,
          loyaltyPoints: updatedPoints,
          loyaltyHistory: [...current.loyaltyHistory, newHistoryEntry, ...redeemHistoryEntry]
        };
        syncToFirestore('users', updatedProfile.id, updatedProfile);
        return {
          ...prev,
          [email]: updatedProfile
        };
      });
    }

    // Clean table status if dine_in
    if (targetOrder.tableId && targetOrder.type === 'dine_in') {
      updateTableStatus(targetOrder.tableId, 'dirty');
    }

    const newEvent: TimelineEvent = {
      id: `ev-${Date.now()}`,
      time: new Date().toISOString(),
      label: 'Payment Completed',
      desc: `Paid ${tenant.currencySymbol} ${finalTotal} via ${paymentMethod}. Tip: ${tenant.currencySymbol} ${tipAmount}`,
      actor: 'Cashier'
    };

    const updated: Order = {
      ...targetOrder,
      status: 'completed' as const,
      paymentStatus: 'paid' as const,
      paymentMethod,
      discount: finalDiscount,
      tip: tipAmount,
      total: finalTotal,
      loyaltyPointsEarned: loyaltyEarned,
      loyaltyPointsRedeemed: redeemPoints,
      updatedAt: new Date().toISOString(),
      timeline: [...(targetOrder.timeline || []), newEvent]
    };

    setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    addLog('Record Payment', `Order ${orderId} fully paid via ${paymentMethod}.`);
    syncToFirestore('orders', orderId, updated);
  };

  const rateAndFeedback = (orderId: string, rating: number, feedback: string) => {
    const existing = orders.find(o => o.id === orderId);
    if (!existing) return;

    const updated: Order = {
      ...existing,
      rating,
      feedback,
      updatedAt: new Date().toISOString()
    };

    setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    addLog('Customer Review', `Received ${rating}-star rating for order: ${orderId}`);
    syncToFirestore('orders', orderId, updated);
  };

  const cancelOrder = (orderId: string, reason: string) => {
    const existing = orders.find(o => o.id === orderId);
    if (!existing) return;

    if (existing.tableId && existing.type === 'dine_in') {
      updateTableStatus(existing.tableId, 'empty');
    }

    const updated: Order = {
      ...existing,
      status: 'cancelled' as const,
      updatedAt: new Date().toISOString(),
      timeline: [...(existing.timeline || []), { id: `ev-${Date.now()}`, time: new Date().toISOString(), label: 'Order Cancelled', desc: `Reason: ${reason}`, actor: 'Staff' }]
    };

    setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    addLog('Cancel Order', `Order ${orderId} was cancelled. Reason: ${reason}`);
    syncToFirestore('orders', orderId, updated);
  };

  const verifyAdvancePayment = (orderId: string, approve: boolean, rejectionReason?: string) => {
    const existing = orders.find(o => o.id === orderId);
    if (!existing) return;

    let updated: Order;
    if (approve) {
      updated = {
        ...existing,
        paymentVerificationStatus: 'approved' as const,
        paymentStatus: 'paid' as const,
        status: 'accepted' as const,
        updatedAt: new Date().toISOString(),
        timeline: [...(existing.timeline || []), { id: `ev-${Date.now()}`, time: new Date().toISOString(), label: 'Advance Payment Approved', desc: 'Advance payment verified by cashier', actor: 'Cashier' }]
      };
    } else {
      updated = {
        ...existing,
        paymentVerificationStatus: 'rejected' as const,
        paymentStatus: 'failed' as const,
        status: 'cancelled' as const,
        notes: rejectionReason ? `${existing.notes || ''} [Rejected: ${rejectionReason}]` : existing.notes,
        updatedAt: new Date().toISOString(),
        timeline: [...(existing.timeline || []), { id: `ev-${Date.now()}`, time: new Date().toISOString(), label: 'Advance Payment Rejected', desc: `Advance payment rejected. Reason: ${rejectionReason}`, actor: 'Cashier' }]
      };
    }

    setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    addLog('Verify Advance Payment', `Advance payment for order ${orderId} was ${approve ? 'approved' : 'rejected'}.`);
    syncToFirestore('orders', orderId, updated);
  };

  const addKitchenNote = (orderId: string, text: string) => {
    const existing = orders.find(o => o.id === orderId);
    if (!existing) return;

    const newNote: KitchenNote = {
      id: `kn-${Date.now()}`,
      text,
      approved: false // requires Manager approval
    };

    const updated: Order = {
      ...existing,
      kitchenNotes: [...(existing.kitchenNotes || []), newNote],
      updatedAt: new Date().toISOString()
    };

    setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    addLog('Add Kitchen Note', `Kitchen note added to Order ${orderId}: "${text}" (Awaiting manager approval)`);
    syncToFirestore('orders', orderId, updated);
  };

  const approveKitchenNote = (orderId: string, noteId: string, approve: boolean) => {
    const existing = orders.find(o => o.id === orderId);
    if (!existing) return;

    const updatedNotes = (existing.kitchenNotes || []).map(note => {
      if (note.id !== noteId) return note;
      return { ...note, approved: approve, rejected: !approve };
    }).filter(note => approve ? true : false); // remove if rejected
    
    const newEvent: TimelineEvent = {
      id: `ev-${Date.now()}`,
      time: new Date().toISOString(),
      label: `Kitchen Note ${approve ? 'Approved' : 'Rejected'}`,
      desc: `Manager ${approve ? 'approved' : 'rejected'} a kitchen note`,
      actor: 'Manager'
    };

    const updated: Order = {
      ...existing,
      kitchenNotes: updatedNotes,
      updatedAt: new Date().toISOString(),
      timeline: [...(existing.timeline || []), newEvent]
    };

    setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    addLog('Approve Kitchen Note', `Manager ${approve ? 'approved' : 'rejected'} kitchen note ${noteId} for Order ${orderId}`);
    syncToFirestore('orders', orderId, updated);
  };

  const addTip = (orderId: string, amount: number) => {
    const existing = orders.find(o => o.id === orderId);
    if (!existing) return;

    const updated: Order = {
      ...existing,
      tip: (existing.tip || 0) + amount,
      total: parseFloat((existing.total + amount).toFixed(2)),
      updatedAt: new Date().toISOString(),
      timeline: [...(existing.timeline || []), { id: `ev-${Date.now()}`, time: new Date().toISOString(), label: 'Tip Added', desc: `Recorded tip amount of ${amount}`, actor: 'Staff' }]
    };

    setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    addLog('Add Tip', `Recorded tip of ${amount} for order: ${orderId}`);
    syncToFirestore('orders', orderId, updated);
  };

  const deliverTip = (orderId: string) => {
    const existing = orders.find(o => o.id === orderId);
    if (!existing) return;

    const updated: Order = {
      ...existing,
      tipStatus: 'delivered' as const,
      updatedAt: new Date().toISOString(),
      timeline: [...(existing.timeline || []), { id: `ev-${Date.now()}`, time: new Date().toISOString(), label: 'Tip Delivered', desc: 'Tip payout delivered to staff', actor: 'Cashier' }]
    };

    setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    addLog('Deliver Tip', `Tip delivered for order: ${orderId}`);
    syncToFirestore('orders', orderId, updated);
  };

  // Staff
  const addStaffMember = (memberData: Omit<Staff, 'id' | 'active'>) => {
    const id = `s-${Date.now()}`;
    const newStaff: Staff = {
      ...memberData,
      id,
      active: true
    };
    setStaff(prev => [...prev, newStaff]);
    addLog('Invite Staff', `Invited employee ${memberData.name} as ${memberData.role}.`);
    syncToFirestore('users', id, newStaff);
  };

  const toggleStaffStatus = (staffId: string) => {
    setStaff(prev => prev.map(s => {
      if (s.id !== staffId) return s;
      const newState = !s.active;
      addLog('Toggle Staff Status', `Staff member ${s.name} ${newState ? 'activated' : 'deactivated'}.`);
      const updated = { ...s, active: newState };
      syncToFirestore('users', staffId, updated);
      return updated;
    }));
  };

  const updateStaffPermissions = (staffId: string, permissions: string[]) => {
    setStaff(prev => prev.map(s => {
      if (s.id !== staffId) return s;
      const updated = { ...s, permissions };
      syncToFirestore('users', staffId, updated);
      return updated;
    }));
    const found = staff.find(s => s.id === staffId);
    if (found) {
      addLog('Update Staff Permissions', `Updated custom permissions for employee: ${found.name}.`);
    }
  };

  // Super Admin
  const toggleTenantStatus = (tenantId: string) => {
    setTenants(prev => prev.map(t => {
      if (t.id !== tenantId) return t;
      const nextStatus = t.subscriptionStatus === 'active' ? 'suspended' : 'active';
      addLog('Platform Admin Override', `Tenant ${t.name} subscription status updated to: ${nextStatus}`);
      const updated = { ...t, subscriptionStatus: nextStatus };
      syncToFirestore('businesses', tenantId, updated);
      return updated;
    }));
  };

  const updateTenantPlan = (tenantId: string, plan: Tenant['subscriptionPlan']) => {
    setTenants(prev => prev.map(t => {
      if (t.id !== tenantId) return t;
      addLog('Platform Admin Override', `Tenant ${t.name} subscription plan updated to: ${plan}`);
      const updated = { ...t, subscriptionPlan: plan };
      syncToFirestore('businesses', tenantId, updated);
      return updated;
    }));
  };

  const requestTenantUpgrade = (tenantId: string, plan: Tenant['subscriptionPlan']) => {
    setTenants(prev => prev.map(t => {
      if (t.id !== tenantId) return t;
      addLog('Subscription', `Tenant ${t.name} requested upgrade to: ${plan}. Status changed to pending_approval.`);
      const updated = { ...t, subscriptionPlan: plan, subscriptionStatus: 'pending_approval' };
      syncToFirestore('businesses', tenantId, updated);
      return updated;
    }));
  };

  const updateTenantCurrency = (tenantId: string, currency: string, currencySymbol: string) => {
    setTenants(prev => prev.map(t => {
      if (t.id !== tenantId) return t;
      addLog('Settings Override', `Tenant ${t.name} currency updated to: ${currency} (${currencySymbol})`);
      const updated = { ...t, currency, currencySymbol };
      syncToFirestore('businesses', tenantId, updated);
      return updated;
    }));
  };

  const updateTenantProfile = (tenantId: string, logoUrl: string, bankAccount: string) => {
    setTenants(prev => prev.map(t => {
      if (t.id !== tenantId) return t;
      addLog('Settings Override', `Tenant ${t.name} logo and bank details updated.`);
      const updated = { ...t, logoUrl, bankAccount };
      syncToFirestore('businesses', tenantId, updated);
      return updated;
    }));
  };

  const approveTenantStatus = (tenantId: string) => {
    setTenants(prev => prev.map(t => {
      if (t.id !== tenantId) return t;
      addLog('Platform Admin Approval', `Business "${t.name}" registration request has been APPROVED.`);
      const updated = { ...t, subscriptionStatus: 'active' };
      syncToFirestore('businesses', tenantId, updated);
      return updated;
    }));
  };

  const rejectTenantStatus = (tenantId: string) => {
    setTenants(prev => prev.map(t => {
      if (t.id !== tenantId) return t;
      addLog('Platform Admin Approval', `Business "${t.name}" registration request has been REJECTED.`);
      const updated = { ...t, subscriptionStatus: 'rejected' };
      syncToFirestore('businesses', tenantId, updated);
      return updated;
    }));
  };

  const addAd = (adData: Omit<PlatformAd, 'id' | 'createdAt' | 'active'>) => {
    const id = `ad-${Date.now()}`;
    const newAd: PlatformAd = {
      ...adData,
      id,
      active: true,
      createdAt: new Date().toISOString()
    };
    setAds(prev => [newAd, ...prev]);
    addLog('Ad Operations', `Published platform ad: ${adData.title}`);
    syncToFirestore('ads', id, newAd);
  };

  const toggleAdStatus = (id: string) => {
    setAds(prev => prev.map(ad => {
      if (ad.id !== id) return ad;
      const nextActive = !ad.active;
      addLog('Ad Operations', `Ad "${ad.title}" is now ${nextActive ? 'Active' : 'Paused'}`);
      const updated = { ...ad, active: nextActive };
      syncToFirestore('ads', id, updated);
      return updated;
    }));
  };

  const deleteAd = (id: string) => {
    setAds(prev => {
      const ad = prev.find(a => a.id === id);
      if (ad) {
        addLog('Ad Operations', `Deleted ad: ${ad.title}`);
        deleteFromFirestore('ads', id);
      }
      return prev.filter(a => a.id !== id);
    });
  };

  const updatePlanPrice = (planId: SubscriptionPlan, newPriceUSD: number, newPriceETB: number) => {
    setPricingPlans(prev => prev.map(p => {
      if (p.id !== planId) return p;
      addLog('Pricing Operations', `Updated ${p.name} price to USD ${newPriceUSD} / ETB ${newPriceETB}`);
      const updated = { ...p, priceUSD: newPriceUSD, priceETB: newPriceETB };
      syncToFirestore('pricing_plans', planId, updated);
      return updated;
    }));
  };

  const registerTenant = (data: {
    name: string;
    slug: string;
    description: string;
    currency: string;
    subscriptionPlan: SubscriptionPlan;
    ownerEmail: string;
    ownerName: string;
  }) => {
    const tenantId = `t-${Date.now()}`;
    const branchId = `b-${Date.now()}`;
    const ownerId = `s-${Date.now()}`;

    const newTenant: Tenant = {
      id: tenantId,
      name: data.name,
      slug: data.slug || (data.name || '').toLowerCase().replace(/\s+/g, '-'),
      logoUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=150&auto=format&fit=crop&q=80',
      description: data.description || `Welcome to ${data.name}!`,
      currency: data.currency,
      currencySymbol: data.currency === 'USD' ? '$' : 'Br',
      baseTaxRate: 15,
      serviceCharge: 0,
      subscriptionPlan: data.subscriptionPlan,
      subscriptionStatus: 'pending_approval',
      ownerEmail: (data.ownerEmail || '').toLowerCase().trim(),
      createdAt: new Date().toISOString(),
      loyaltyPointsRatio: 0.05,
      loyaltyMinRedeemPoints: 10,
      loyaltyRedeemValue: 1,
    };

    const newBranch: Branch = {
      id: branchId,
      tenantId,
      name: 'Main Branch',
      address: 'Addis Ababa, Ethiopia',
      phone: '+251 911 000 000',
    };

    const newStaff: Staff = {
      id: ownerId,
      name: data.ownerName,
      email: (data.ownerEmail || '').toLowerCase().trim(),
      role: 'owner',
      tenantId,
      branchId,
      active: true,
    };

    const catId1 = `cat-1-${Date.now()}`;
    const catId2 = `cat-2-${Date.now()}`;

    // Default categories
    const newCategories = [
      { id: catId1, tenantId, name: 'Specialties', orderNum: 1, icon: 'Utensils' },
      { id: catId2, tenantId, name: 'Beverages', orderNum: 2, icon: 'Coffee' },
    ];

    // Default menu items
    const newMenuItemsList = [
      {
        id: `item-1-${Date.now()}`,
        tenantId,
        categoryId: catId1,
        name: 'House Special Dish',
        description: 'A delicious chef specialty signature dish crafted with premium locally sourced ingredients.',
        price: data.currency === 'USD' ? 12.99 : 450,
        photoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
        allergenTags: [],
        dietaryTags: ['Popular'],
        isAvailable: true,
        modifiers: [],
        preparationStationId: ''
      },
      {
        id: `item-2-${Date.now()}`,
        tenantId,
        categoryId: catId2,
        name: 'Ethio-Macchiato / Coffee',
        description: 'Authentic rich espresso topped with beautifully textured milk micro-foam.',
        price: data.currency === 'USD' ? 2.50 : 80,
        photoUrl: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=500&auto=format&fit=crop&q=80',
        allergenTags: ['Dairy'],
        dietaryTags: ['Vegetarian'],
        isAvailable: true,
        modifiers: [],
        preparationStationId: ''
      }
    ];

    setTenants(prev => [...prev, newTenant]);
    setBranches(prev => [...prev, newBranch]);
    setStaff(prev => [...prev, newStaff]);
    setCategories(prev => ({
      ...prev,
      [tenantId]: newCategories
    }));
    setMenuItems(prev => ({
      ...prev,
      [tenantId]: newMenuItemsList
    }));

    addLog('Tenant Registration', `Registered new tenant: ${data.name} owned by ${data.ownerName}`);

    // Sync newly created entities to Firestore
    syncToFirestore('businesses', tenantId, newTenant);
    syncToFirestore('branches', branchId, newBranch);
    syncToFirestore('users', ownerId, newStaff);
    newCategories.forEach(cat => syncToFirestore('categories', cat.id, cat));
    newMenuItemsList.forEach(item => syncToFirestore('menu_items', item.id, item));

    // Set active values
    setActiveTenantId(tenantId);
    setActiveBranchId(branchId);

    // Login as the registered owner
    const loggedUser = {
      id: ownerId,
      email: (data.ownerEmail || '').toLowerCase().trim(),
      role: 'owner' as const,
      name: data.ownerName,
      tenantId,
      branchId,
    };
    setCurrentUser(loggedUser);
  };

  const signUpOwnerOnly = (name: string, email: string) => {
    const cleanEmail = (email || '').toLowerCase().trim();
    // Check if they are already in the system
    const exists = staff.find(s => (s.email || '').toLowerCase().trim() === cleanEmail);
    if (exists) {
      login(cleanEmail);
      return;
    }

    const ownerId = `s-${Date.now()}`;
    const newStaff: Staff = {
      id: ownerId,
      name,
      email: cleanEmail,
      role: 'owner',
      tenantId: '', // No business profile created yet!
      branchId: '',
      active: true,
    };

    setStaff(prev => [...prev, newStaff]);
    addLog('Platform Owner Sign Up', `Owner signed up: ${name} (${cleanEmail}). Business profile pending creation.`);
    syncToFirestore('users', ownerId, newStaff);

    const loggedUser = {
      id: ownerId,
      email: cleanEmail,
      role: 'owner' as const,
      name,
      tenantId: '',
      branchId: '',
    };
    setCurrentUser(loggedUser);
  };

  // Sync to Firestore Helper (dynamic, safe imports)
  const syncToFirestore = async (collectionName: string, docId: string, data: any) => {
    try {
      const { getDB } = await import('../lib/firebase');
      const db = getDB();
      if (db) {
        const { doc, setDoc } = await import('firebase/firestore');
        await setDoc(doc(db, collectionName, docId), data, { merge: true });
      }
    } catch (e) {
      console.warn("Firestore sync skipped/failed:", e);
    }
  };

  const deleteFromFirestore = async (collectionName: string, docId: string) => {
    try {
      const { getDB } = await import('../lib/firebase');
      const db = getDB();
      if (db) {
        const { doc, deleteDoc } = await import('firebase/firestore');
        await deleteDoc(doc(db, collectionName, docId));
      }
    } catch (e) {
      console.warn("Firestore delete skipped/failed:", e);
    }
  };

  const updatePaymentMethodConfig = (tenantId: string, configs: PaymentMethodConfig[]) => {
    setPaymentMethodsConfigs(prev => ({
      ...prev,
      [tenantId]: configs
    }));
    addLog('Update Payment Config', `Updated payment methods configurations for tenant ${tenantId}.`);
    syncToFirestore('businesses', tenantId, { paymentMethods: configs });
  };

  const updateLoyaltyConfig = (tenantId: string, config: LoyaltyConfig) => {
    setLoyaltyConfigs(prev => ({
      ...prev,
      [tenantId]: config
    }));
    addLog('Update Loyalty Config', `Updated loyalty program settings for tenant ${tenantId}.`);
    syncToFirestore('businesses', tenantId, { loyaltyConfig: config });
  };

  const addMealSubscriptionPlan = (plan: Omit<MealSubscriptionPlan, 'id'>) => {
    const id = `sub-plan-${Date.now()}`;
    const newPlan: MealSubscriptionPlan = { ...plan, id };
    setMealSubscriptionPlans(prev => {
      const list = prev[plan.tenantId] || [];
      return {
        ...prev,
        [plan.tenantId]: [...list, newPlan]
      };
    });
    addLog('Create Meal Subscription Plan', `Created meal subscription plan: ${plan.name}`);
    syncToFirestore('meal_subscription_plans', id, newPlan);
  };

  const updateMealSubscriptionPlan = (plan: MealSubscriptionPlan) => {
    setMealSubscriptionPlans(prev => {
      const list = prev[plan.tenantId] || [];
      return {
        ...prev,
        [plan.tenantId]: list.map(p => p.id === plan.id ? plan : p)
      };
    });
    addLog('Update Meal Subscription Plan', `Updated meal subscription plan: ${plan.name}`);
    syncToFirestore('meal_subscription_plans', plan.id, plan);
  };

  const deleteMealSubscriptionPlan = (tenantId: string, planId: string) => {
    setMealSubscriptionPlans(prev => {
      const list = prev[tenantId] || [];
      return {
        ...prev,
        [tenantId]: list.filter(p => p.id !== planId)
      };
    });
    addLog('Delete Meal Subscription Plan', `Deleted meal subscription plan ID: ${planId}`);
    deleteFromFirestore('meal_subscription_plans', planId);
  };

  const subscribeToMealPlan = (subData: Omit<CustomerMealSubscription, 'id'>) => {
    const id = `cust-sub-${Date.now()}`;
    const newSub: CustomerMealSubscription = { ...subData, id };
    setCustomerSubscriptions(prev => [...prev, newSub]);
    addLog('Meal Plan Subscription', `Customer subscribed to meal plan ID: ${subData.planId}`);
    syncToFirestore('customer_subscriptions', id, newSub);
  };

  const logMealService = (subscriptionId: string) => {
    const existing = customerSubscriptions.find(sub => sub.id === subscriptionId);
    if (!existing) return;

    const todayUsed = existing.mealsUsedToday + 1;
    const weekUsed = existing.mealsUsedThisWeek + 1;
    const totalUsed = existing.mealsUsedTotal + 1;
    const remaining = Math.max(0, existing.mealsRemainingTotal - 1);

    const updated: CustomerMealSubscription = {
      ...existing,
      mealsUsedToday: todayUsed,
      mealsUsedThisWeek: weekUsed,
      mealsUsedTotal: totalUsed,
      mealsRemainingTotal: remaining
    };

    setCustomerSubscriptions(prev => prev.map(sub => sub.id === subscriptionId ? updated : sub));
    addLog('Log Subscription Meal Served', `Served subscription meal on sub ${subscriptionId}`);
    syncToFirestore('customer_subscriptions', subscriptionId, updated);
  };

  const refundOrder = (orderId: string, amount: number, reason: string, actor: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const refundDetails: RefundDetails = {
        refundAmount: amount,
        refundReason: reason,
        refundDate: new Date().toISOString(),
        refundedBy: actor
      };
      
      const newEvent: TimelineEvent = {
        id: `ev-${Date.now()}`,
        time: new Date().toISOString(),
        label: 'Order Refunded',
        desc: `Refunded amount: ${amount} | Reason: ${reason} | Refunded by: ${actor}`,
        actor
      };

      const updatedOrder = {
        ...o,
        status: 'refunded' as const,
        paymentStatus: 'refunded' as const,
        refundDetails,
        timeline: [...(o.timeline || []), newEvent]
      };
      
      syncToFirestore('orders', orderId, updatedOrder);
      return updatedOrder;
    }));
    addLog('Order Refunded', `Order ${orderId} refunded for amount: ${amount}. Reason: ${reason}`);
  };

  const updateCustomerProfile = (email: string, profileData: Partial<CustomerProfile>) => {
    setCustomerProfiles(prev => {
      const current = prev[email] || {
        id: `cust-${Date.now()}`,
        email,
        name: profileData.name || email.split('@')[0],
        phone: profileData.phone || '',
        savedAddresses: [],
        savedFavorites: [],
        loyaltyPoints: 0,
        loyaltyHistory: []
      };
      const updated = { ...current, ...profileData };
      syncToFirestore('users', updated.id, updated);
      return {
        ...prev,
        [email]: updated
      };
    });
  };

  const addFavoriteItem = (email: string, menuItemId: string) => {
    setCustomerProfiles(prev => {
      const current = prev[email] || {
        id: `cust-${Date.now()}`,
        email,
        name: email.split('@')[0],
        phone: '',
        savedAddresses: [],
        savedFavorites: [],
        loyaltyPoints: 0,
        loyaltyHistory: []
      };
      const updated = {
        ...current,
        savedFavorites: [...new Set([...current.savedFavorites, menuItemId])]
      };
      syncToFirestore('users', updated.id, updated);
      return {
        ...prev,
        [email]: updated
      };
    });
  };

  const removeFavoriteItem = (email: string, menuItemId: string) => {
    setCustomerProfiles(prev => {
      const current = prev[email];
      if (!current) return prev;
      const updated = {
        ...current,
        savedFavorites: current.savedFavorites.filter(id => id !== menuItemId)
      };
      syncToFirestore('users', updated.id, updated);
      return {
        ...prev,
        [email]: updated
      };
    });
  };

  const addSavedAddress = (email: string, name: string, address: string) => {
    setCustomerProfiles(prev => {
      const current = prev[email] || {
        id: `cust-${Date.now()}`,
        email,
        name: email.split('@')[0],
        phone: '',
        savedAddresses: [],
        savedFavorites: [],
        loyaltyPoints: 0,
        loyaltyHistory: []
      };
      const newAddress = { id: `addr-${Date.now()}`, name, address };
      const updated = {
        ...current,
        savedAddresses: [...current.savedAddresses, newAddress]
      };
      syncToFirestore('users', updated.id, updated);
      return {
        ...prev,
        [email]: updated
      };
    });
  };

  const removeSavedAddress = (email: string, addressId: string) => {
    setCustomerProfiles(prev => {
      const current = prev[email];
      if (!current) return prev;
      const updated = {
        ...current,
        savedAddresses: current.savedAddresses.filter(a => a.id !== addressId)
      };
      syncToFirestore('users', updated.id, updated);
      return {
        ...prev,
        [email]: updated
      };
    });
  };

  const updateTipStatus = (orderId: string, status: 'pending' | 'delivered' | 'accepted') => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      
      const newEvent: TimelineEvent = {
        id: `ev-${Date.now()}`,
        time: new Date().toISOString(),
        label: status === 'delivered' ? 'Tip Delivered' : status === 'accepted' ? 'Tip Accepted by Staff' : 'Tip Logged',
        desc: status === 'delivered' ? 'Tip has been delivered to staff by Cashier' : 'Staff accepted the tip payout',
        actor: status === 'delivered' ? 'Cashier' : 'Waiter'
      };

      const updated = {
        ...o,
        tipStatus: status,
        timeline: [...(o.timeline || []), newEvent]
      };
      syncToFirestore('orders', orderId, updated);
      return updated;
    }));
    addLog('Update Tip Status', `Order ${orderId} tip status updated to: ${status}`);
  };

  // Final Features Actions
  const addReservation = async (reservation: Omit<Reservation, 'id' | 'createdAt' | 'timeline' | 'status'>) => {
    const id = `res-${Date.now()}`;
    const newReservation: Reservation = {
      ...reservation,
      id,
      status: 'pending',
      timeline: [{ id: `te-${Date.now()}`, time: new Date().toISOString(), label: 'Created', desc: 'Reservation requested' }],
      createdAt: new Date().toISOString()
    };
    setReservations(prev => [...prev, newReservation]);
    try {
      await syncToFirestore('reservations', id, newReservation);
      addLog('Create Reservation Success', `Successfully submitted reservation for ${reservation.customerName} on ${reservation.date} at ${reservation.time}.`);
    } catch (err: any) {
      addLog('Create Reservation Error', `Failed to create reservation: ${err.message || err}`);
    }
  };

  const updateReservationStatus = async (id: string, status: Reservation['status'], tableId?: string) => {
    setReservations(prev => prev.map(res => {
      if (res.id !== id) return res;
      return {
        ...res,
        status,
        tableId: tableId || res.tableId,
        timeline: [
          ...res.timeline,
          { id: `te-${Date.now()}`, time: new Date().toISOString(), label: `Status updated`, desc: `Reservation ${status}` }
        ]
      };
    }));

    try {
      const res = reservations.find(r => r.id === id);
      if (res) {
        const updated = { 
          ...res, 
          status, 
          tableId: tableId || res.tableId,
          timeline: [
            ...res.timeline,
            { id: `te-${Date.now()}`, time: new Date().toISOString(), label: `Status updated`, desc: `Reservation ${status}` }
          ]
        };
        await syncToFirestore('reservations', id, updated);
      }
      addLog('Update Reservation Status Success', `Successfully updated reservation status of ID ${id} to ${status}.`);
    } catch (err: any) {
      addLog('Update Reservation Status Error', `Failed to update reservation status: ${err.message || err}`);
    }
  };

  const addIngredient = async (ingredient: Omit<Ingredient, 'id'>) => {
    const id = `ing-${Date.now()}`;
    const newIngredient = { ...ingredient, id };
    setIngredients(prev => [...prev, newIngredient]);
    try {
      await syncToFirestore('ingredients', id, newIngredient);
      addLog('Add Ingredient Success', `Successfully added ingredient ${ingredient.name} with stock ${ingredient.stockQuantity} ${ingredient.unit}.`);
    } catch (err: any) {
      addLog('Add Ingredient Error', `Failed to add ingredient: ${err.message || err}`);
    }
  };

  const updateIngredient = async (ingredient: Ingredient) => {
    setIngredients(prev => prev.map(ing => ing.id === ingredient.id ? ingredient : ing));
    try {
      await syncToFirestore('ingredients', ingredient.id, ingredient);
      addLog('Update Ingredient Success', `Successfully updated ingredient ${ingredient.name}.`);
    } catch (err: any) {
      addLog('Update Ingredient Error', `Failed to update ingredient: ${err.message || err}`);
    }
  };

  const addStockMovement = async (movement: Omit<StockMovement, 'id' | 'date'>) => {
    const id = `sm-${Date.now()}`;
    const newMovement: StockMovement = { ...movement, id, date: new Date().toISOString() };
    setStockMovements(prev => [...prev, newMovement]);

    // Update ingredient stock locally
    setIngredients(prev => prev.map(ing => {
      if (ing.id !== movement.ingredientId) return ing;
      let newStock = ing.stockQuantity;
      if (movement.type === 'in') newStock += movement.quantity;
      else if (movement.type === 'out' || movement.type === 'waste') newStock -= movement.quantity;
      else if (movement.type === 'adjustment') newStock = movement.quantity;
      
      const updatedIngredient = { ...ing, stockQuantity: newStock };
      // Sync the updated ingredient to Firestore in the background
      syncToFirestore('ingredients', ing.id, updatedIngredient);
      return updatedIngredient;
    }));

    try {
      await syncToFirestore('stock_movements', id, newMovement);
      addLog('Stock Movement Processed', `Recorded ${movement.type} movement of ${movement.quantity} units for ingredient ID ${movement.ingredientId}.`);
    } catch (err: any) {
      addLog('Stock Movement Error', `Failed to log stock movement: ${err.message || err}`);
    }
  };

  const markNotificationRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      const notif = notifications.find(n => n.id === id);
      if (notif) {
        const updated = { ...notif, read: true };
        await syncToFirestore('notifications', id, updated);
      }
    } catch (err: any) {
      console.error("Failed to mark notification read:", err);
    }
  };

  const deleteNotification = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      await deleteFromFirestore('notifications', id);
    } catch (err: any) {
      console.error("Failed to delete notification:", err);
    }
  };

  const addNotification = async (notification: Omit<DinexNotification, 'id' | 'createdAt' | 'read'>) => {
    const id = `notif-${Date.now()}`;
    const newNotif = { ...notification, id, read: false, createdAt: new Date().toISOString() };
    setNotifications(prev => [newNotif, ...prev]);
    try {
      await syncToFirestore('notifications', id, newNotif);
    } catch (err: any) {
      console.error("Failed to add notification:", err);
    }
  };

  const installExtension = async (tenantId: string, extensionId: string) => {
    const id = `${tenantId}_${extensionId}`;
    const newInstalled = { id: extensionId, tenantId, installedAt: new Date().toISOString(), status: 'active' as const };
    setInstalledExtensions(prev => [...prev, newInstalled]);
    try {
      await syncToFirestore('installed_extensions', id, newInstalled);
      addLog('Install Extension Success', `Successfully installed extension ${extensionId} for tenant ${tenantId}.`);
    } catch (err: any) {
      addLog('Install Extension Error', `Failed to install extension: ${err.message || err}`);
    }
  };

  const uninstallExtension = async (tenantId: string, extensionId: string) => {
    const id = `${tenantId}_${extensionId}`;
    setInstalledExtensions(prev => prev.filter(inst => !(inst.tenantId === tenantId && inst.id === extensionId)));
    try {
      await deleteFromFirestore('installed_extensions', id);
      addLog('Uninstall Extension Success', `Successfully uninstalled extension ${extensionId} for tenant ${tenantId}.`);
    } catch (err: any) {
      addLog('Uninstall Extension Error', `Failed to uninstall extension: ${err.message || err}`);
    }
  };

  const updateGlobalSettings = async (settings: Partial<GlobalSettings>) => {
    const updated = { ...globalSettings, ...settings };
    setGlobalSettings(updated);
    try {
      await syncToFirestore('system_settings', 'global', updated);
      addLog('Update Global Settings Success', `Successfully updated system-wide configuration.`);
    } catch (err: any) {
      addLog('Update Global Settings Error', `Failed to update global settings: ${err.message || err}`);
    }
  };

  return (
    <AppContext.Provider value={{
      tenants,
      branches,
      stations,
      categories,
      menuItems,
      tables,
      orders,
      staff,
      logs,
      currentUser,
      activeTenantId,
      activeBranchId,
      currentLanguage,
      login,
      logout,
      setActiveTenantId,
      setActiveBranchId,
      setLanguage,
      addCategory,
      updateCategory,
      deleteCategory,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      toggleMenuItemAvailability,
      addTable,
      updateTableStatus,
      addStation,
      placeOrder,
      updateOrderStatus,
      updateOrderItemStatus,
      processPayment,
      rateAndFeedback,
      cancelOrder,
      verifyAdvancePayment,
      addKitchenNote,
      approveKitchenNote,
      addTip,
      deliverTip,
      addStaffMember,
      toggleStaffStatus,
      updateStaffPermissions,
      toggleTenantStatus,
      updateTenantPlan,
      requestTenantUpgrade,
      updateTenantCurrency,
      updateTenantProfile,
      approveTenantStatus,
      rejectTenantStatus,
      ads,
      addAd,
      toggleAdStatus,
      deleteAd,
      pricingPlans,
      updatePlanPrice,
      registerTenant,
      signUpOwnerOnly,
      addLog,
      
      paymentMethodsConfigs,
      updatePaymentMethodConfig,
      loyaltyConfigs,
      updateLoyaltyConfig,
      mealSubscriptionPlans,
      customerSubscriptions,
      addMealSubscriptionPlan,
      updateMealSubscriptionPlan,
      deleteMealSubscriptionPlan,
      subscribeToMealPlan,
      logMealService,
      refundOrder,
      customerProfiles,
      updateCustomerProfile,
      addFavoriteItem,
      removeFavoriteItem,
      addSavedAddress,
      removeSavedAddress,
      updateTipStatus,

      reservations,
      addReservation,
      updateReservationStatus,

      ingredients,
      addIngredient,
      updateIngredient,
      stockMovements,
      addStockMovement,

      notifications,
      markNotificationRead,
      deleteNotification,
      addNotification,

      marketplaceExtensions,
      installedExtensions,
      installExtension,
      uninstallExtension,

      globalSettings,
      updateGlobalSettings
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
