import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tenant, Branch, PreparationStation, Category, MenuItem, Table, Order, Staff, SystemLog, PlatformAd, PlanPricing, SubscriptionPlan, Reservation, Ingredient, StockMovement, DinexNotification, MarketplaceExtension, InstalledExtension, GlobalSettings, LandingPageConfig, CustomerProfile, PaymentMethodConfig, LoyaltyConfig, MealSubscriptionPackage, CustomerMealSubscription, UserRole, OrderStatus, TimelineEvent, OrderItem, LoyaltyHistoryEntry, KitchenNote, RefundDetails } from '../types';


export const AppContext = createContext<any>(undefined as any);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  // Currently logged-in operational user (Simulated)
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({
      platformName: "Dinex Platform",
      platformCurrency: "USD",
      platformCurrencySymbol: "$",
      platformTimezone: "UTC",
      platformContactEmail: "support@dinex.example.com",
      maxBranchesPerTenant: 5,
      maxStaffPerTenant: 50,
      enableMarketplace: true,
      enableReservations: true,
      requireEmailVerification: false,
      allowedDiningServiceTypes: ['dine_in', 'takeaway', 'delivery', 'drive_through', 'pickup', 'meal_subscription'],
      allowedSubscriptionDurations: [7, 14, 30],
      allowedPaymentMethods: ['cash', 'stripe', 'mobile_money', 'bank_transfer', 'binance_id', 'binance_wallet'],
      stripeIntegrationEnabled: true,
      supportedCountries: ['Ethiopia', 'Kenya', 'Rwanda', 'Nigeria', 'South Africa'],
      supportedCurrencies: ['ETB', 'KES', 'RWF', 'NGN', 'ZAR', 'USD'],
      maintenanceMode: false,
      announcements: [],
      globalFeatureFlags: {}
  });

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [stations, setStations] = useState<PreparationStation[]>([]);
  const [categories, setCategories] = useState<Record<string, Category[]>>({});
  const [menuItems, setMenuItems] = useState<Record<string, MenuItem[]>>({});
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [pricingPlans, setPricingPlans] = useState<PlanPricing[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [notifications, setNotifications] = useState<DinexNotification[]>([]);
  const [marketplaceExtensions, setMarketplaceExtensions] = useState<MarketplaceExtension[]>([]);
  const [installedExtensions, setInstalledExtensions] = useState<InstalledExtension[]>([]);
  const [ads, setAds] = useState<PlatformAd[]>([]);
  const [paymentMethodsConfigs, setPaymentMethodsConfigs] = useState<Record<string, PaymentMethodConfig>>({});
  const [loyaltyConfigs, setLoyaltyConfigs] = useState<Record<string, LoyaltyConfig>>({});
  const [mealSubscriptionPlans, setMealSubscriptionPackages] = useState<MealSubscriptionPackage[]>([]);
  const [customerSubscriptions, setCustomerSubscriptions] = useState<CustomerMealSubscription[]>([]);
  const [subscriptionRequests, setSubscriptionRequests] = useState<any[]>([]);
  const [superAdminPaymentInfo, setSuperAdminPaymentInfo] = useState<any>(null);
  
  // Active configurations
  const [activeTenantId, setActiveTenantId] = useState<string>('t-01');
  const [activeBranchId, setActiveBranchId] = useState<string>('t-01');
  const [currentLanguage, setLanguage] = useState<'en' | 'am'>('en');
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'signup' | 'customer' | 'dashboard'>('landing');

  const requestSubscriptionUpgrade = async () => {};
  const approveSubscriptionRequest = async () => {};
  const rejectSubscriptionRequest = async () => {};

  
  const [landingPageConfig, setLandingPageConfig] = useState<any>({});
  const defaultLandingPageConfig: any = {
    heroTitle: "Run Your Restaurant Business with AI",
    heroSubtitle: "Dinex is the ultimate all-in-one platform for modern restaurants, cafes, and multi-branch food chains.",
    heroBackgroundType: 'video',
    heroBackgroundUrl: 'https://cdn.pixabay.com/video/2015/09/25/744-139366606_tiny.mp4',
    aboutTitle: "Why businesses choose Dinex",
    aboutText: "Join thousands of restaurants that have transformed their operations, increased revenue, and delighted customers using our platform.",
    featuresTitle: "Everything you need to succeed",
    featuresSubtitle: "From digital menus to kitchen displays, we've got your entire restaurant operation covered.",
    contactEmail: "naolnigatu2025@gmail.com"
  };
  useEffect(() => {
    let unsubscribeFn: (() => void) | undefined;
    const initializeListeners = async () => {
      try {
        const { query, where, documentId } = await import('firebase/firestore');
        const {
          getDB
        } = await import('../lib/firebase');
        const db = getDB();
        if (db) {
          const {
            collection,
            onSnapshot,
            doc: firestoreDoc
          } = await import('firebase/firestore');
          const targetTenantId = activeTenantId || currentUser?.tenantId;
          const isGuest = !currentUser || currentUser?.role === 'customer';
          const emptyQuery = query(collection(db, 'categories'), where('id', '==', 'NONE_GUEST'));
          const emptyQueryOrders = query(collection(db, 'orders'), where('id', '==', 'NONE_GUEST'));
          const emptyQueryUsers = query(collection(db, 'users'), where('id', '==', 'NONE_GUEST'));
          const emptyQueryStaff = query(collection(db, 'staff'), where('id', '==', 'NONE_GUEST'));
          const emptyQueryReservations = query(collection(db, 'reservations'), where('id', '==', 'NONE_GUEST'));
          const emptyQueryIngredients = query(collection(db, 'ingredients'), where('id', '==', 'NONE_GUEST'));
          const emptyQueryStock = query(collection(db, 'stock_movements'), where('id', '==', 'NONE_GUEST'));
          const emptyQueryTables = query(collection(db, 'tables'), where('id', '==', 'NONE_GUEST'));
          const emptyQueryStations = query(collection(db, 'stations'), where('id', '==', 'NONE_GUEST'));
          const emptyQueryNotifications = query(collection(db, 'notifications'), where('id', '==', 'NONE_GUEST'));
          const emptyQueryExtensions = query(collection(db, 'installed_extensions'), where('id', '==', 'NONE_GUEST'));

          let tenantsQuery;
          if (currentUser?.role === 'super_admin') {
            tenantsQuery = collection(db, 'tenants');
          } else if (currentUser?.role === 'customer' || !currentUser) {
            tenantsQuery = collection(db, 'tenants');
          } else {
            // Any business role (owner, manager, waiter, etc.)
            if (currentUser.tenantId) {
              tenantsQuery = query(collection(db, 'tenants'), where('id', '==', currentUser.tenantId));
            } else if (currentUser.role === 'owner' && currentUser.id) {
              tenantsQuery = query(collection(db, 'tenants'), where('ownerUid', '==', currentUser.id));
            } else {
              tenantsQuery = collection(db, 'tenants');
            }
          }

          const unsubscribeTenants = onSnapshot(tenantsQuery, snapshot => {
            const list: Tenant[] = [];
            snapshot.forEach(docSnap => {
              const data = docSnap.data() as Tenant;
              if (!currentUser || currentUser.role === 'customer') {
                if (data.subscriptionStatus === 'suspended' || data.subscriptionStatus === 'rejected') return;
              }
              list.push({
                id: docSnap.id,
                ...data
              });
            });
            setTenants(prev => {
              if (currentUser?.role === 'business_owner' || currentUser?.role === 'owner') {
                return list;
              }
              const map = new Map<string, Tenant>(prev.map(t => [t.id, t]));
              list.forEach(t => {
                map.set(t.id, t);
              });
              return Array.from(map.values());
            });
          }, err => console.warn("Tenants listener error:", err));

          let businessesQuery;
          if (currentUser?.role === 'super_admin') {
            businessesQuery = collection(db, 'businesses');
          } else if (currentUser?.role === 'customer' || !currentUser) {
            businessesQuery = collection(db, 'businesses');
          } else {
            if (currentUser.tenantId) {
              businessesQuery = query(collection(db, 'businesses'), where('id', '==', currentUser.tenantId));
            } else if (currentUser.role === 'owner' && currentUser.id) {
              businessesQuery = query(collection(db, 'businesses'), where('ownerUid', '==', currentUser.id));
            } else {
              businessesQuery = collection(db, 'businesses');
            }
          }

          const unsubscribeBusinesses = onSnapshot(businessesQuery, snapshot => {
            const list: Tenant[] = [];
            snapshot.forEach(docSnap => {
              const data = docSnap.data() as Tenant;
              if (!currentUser || currentUser.role === 'customer') {
                if (data.subscriptionStatus === 'suspended' || data.subscriptionStatus === 'rejected') return;
              }
              list.push({
                id: docSnap.id,
                ...data
              });
            });
            setTenants(prev => {
              if (currentUser?.role === 'business_owner' || currentUser?.role === 'owner') {
                return list;
              }
              const map = new Map<string, Tenant>(prev.map(t => [t.id, t]));
              list.forEach(t => {
                map.set(t.id, t);
              });
              return Array.from(map.values());
            });
          }, err => console.warn("Businesses listener error:", err));

          const categoriesQuery = currentUser?.role === 'super_admin' ? collection(db, 'categories') : (targetTenantId ? query(collection(db, 'categories'), where('tenantId', '==', targetTenantId)) : emptyQuery);

          const unsubscribeCategories = onSnapshot(categoriesQuery, snapshot => {
            const grouped: Record<string, Category[]> = {};
            snapshot.forEach(docSnap => {
              const data = { id: docSnap.id, ...docSnap.data() } as Category;
              if (data.tenantId) {
                if (!grouped[data.tenantId]) grouped[data.tenantId] = [];
                grouped[data.tenantId].push(data);
              }
            });
            Object.keys(grouped).forEach(tId => {
              grouped[tId].sort((a, b) => (a.orderNum || 0) - (b.orderNum || 0));
            });
            setCategories(prev => ({
              ...prev,
              ...grouped
            }));
          }, err => console.warn("Categories listener error:", err));

          const menuItemsQuery = currentUser?.role === 'super_admin' ? collection(db, 'menu_items') : (targetTenantId ? query(collection(db, 'menu_items'), where('tenantId', '==', targetTenantId)) : emptyQuery);

          const unsubscribeMenuItems = onSnapshot(menuItemsQuery, snapshot => {
            const grouped: Record<string, MenuItem[]> = {};
            snapshot.forEach(docSnap => {
              const data = { id: docSnap.id, ...docSnap.data() } as MenuItem;
              if (data.tenantId) {
                if (!grouped[data.tenantId]) grouped[data.tenantId] = [];
                grouped[data.tenantId].push(data);
              }
            });
            setMenuItems(prev => ({
              ...prev,
              ...grouped
            }));
          }, err => console.warn("MenuItems listener error:", err));

          const staffQuery = currentUser?.role === 'super_admin' ? collection(db, 'staff') : (isGuest ? emptyQueryStaff : (targetTenantId ? query(collection(db, 'staff'), where('tenantId', '==', targetTenantId)) : emptyQueryStaff));

          const unsubscribeStaff = onSnapshot(staffQuery, snapshot => {
            const list: Staff[] = [];
            snapshot.forEach(docSnap => {
              const data = docSnap.data();
              if (data.email) list.push({
                id: docSnap.id,
                ...data
              } as Staff);
            });
            if (list.length > 0) {
              setStaff(prev => {
                const map = new Map<string, Staff>(prev.map(s => [s.id, s]));
                list.forEach(s => {
                  const existing = map.get(s.id);
                  map.set(s.id, existing ? Object.assign({}, existing, s) : s);
                });
                return Array.from(map.values());
              });
            }
          }, err => console.warn("Staff listener error:", err));

          let usersQuery;
          if (currentUser?.role === 'super_admin') {
            usersQuery = collection(db, 'users');
          } else if (currentUser?.role === 'customer' && currentUser?.email) {
            usersQuery = query(collection(db, 'users'), where('email', '==', currentUser.email));
          } else if (!isGuest && targetTenantId) {
            usersQuery = query(collection(db, 'users'), where('tenantId', '==', targetTenantId));
          } else {
            usersQuery = emptyQueryUsers;
          }

          const unsubscribeUsers = onSnapshot(usersQuery, snapshot => {
            const staffList: Staff[] = [];
            const custMap: Record<string, CustomerProfile> = {};
            snapshot.forEach(docSnap => {
              const data = docSnap.data();
              if (data.email) {
                const cleanEmail = data.email.toLowerCase().trim();
                if (data.role && data.role !== 'customer') {
                  staffList.push({
                    id: docSnap.id,
                    ...data
                  } as Staff);
                } else {
                  custMap[cleanEmail] = {
                    id: docSnap.id,
                    ...data
                  } as CustomerProfile;
                }
              }
            });
            if (staffList.length > 0) {
              setStaff(prev => {
                const map = new Map<string, Staff>(prev.map(s => [s.id, s]));
                staffList.forEach(s => {
                  const existing = map.get(s.id);
                  map.set(s.id, existing ? Object.assign({}, existing, s) : s);
                });
                return Array.from(map.values());
              });
            }
            if (Object.keys(custMap).length > 0) {
              setCustomerProfiles(prev => ({
                ...prev,
                ...custMap
              }));
            }
          }, err => console.warn("Users listener error:", err));

          const branchesQuery = currentUser?.role === 'super_admin' ? collection(db, 'branches') : (targetTenantId ? query(collection(db, 'branches'), where('tenantId', '==', targetTenantId)) : emptyQuery);

          const unsubscribeBranches = onSnapshot(branchesQuery, snapshot => {
            const list: Branch[] = [];
            snapshot.forEach(docSnap => {
              list.push({
                id: docSnap.id,
                ...docSnap.data()
              } as Branch);
            });
            if (list.length > 0) {
              setBranches(prev => {
                const map = new Map<string, Branch>(prev.map(b => [b.id, b]));
                list.forEach(b => {
                  const existing = map.get(b.id);
                  map.set(b.id, existing ? Object.assign({}, existing, b) : b);
                });
                return Array.from(map.values());
              });
            }
          }, err => console.warn("Branches listener error:", err));

          const tablesQuery = currentUser?.role === 'super_admin' ? collection(db, 'tables') : (targetTenantId ? query(collection(db, 'tables'), where('tenantId', '==', targetTenantId)) : emptyQueryTables);

          const unsubscribeTables = onSnapshot(tablesQuery, snapshot => {
            const list: Table[] = [];
            snapshot.forEach(docSnap => {
              list.push({
                id: docSnap.id,
                ...docSnap.data()
              } as Table);
            });
            setTables(list);
          }, err => console.warn("Tables listener error:", err));

          const stationsQuery = currentUser?.role === 'super_admin' ? collection(db, 'stations') : (targetTenantId ? query(collection(db, 'stations'), where('tenantId', '==', targetTenantId)) : emptyQueryStations);

          const unsubscribeStations = onSnapshot(stationsQuery, snapshot => {
            const list: PreparationStation[] = [];
            snapshot.forEach(docSnap => {
              list.push({
                id: docSnap.id,
                ...docSnap.data()
              } as PreparationStation);
            });
            setStations(list);
          }, err => console.warn("Stations listener error:", err));
          const unsubscribeReservations = onSnapshot((currentUser?.role === 'super_admin' || !currentUser?.tenantId ? collection(db, 'reservations') : query(collection(db, 'reservations'), where('tenantId', '==', currentUser?.tenantId))), snapshot => {
            const list: Reservation[] = [];
            snapshot.forEach(docSnap => {
              list.push({
                id: docSnap.id,
                ...docSnap.data()
              } as Reservation);
            });
            setReservations(list);
          }, err => {
            console.warn("Firestore reservations listener error:", err);
          });
          const unsubscribeIngredients = onSnapshot((currentUser?.role === 'super_admin' || !currentUser?.tenantId ? collection(db, 'ingredients') : query(collection(db, 'ingredients'), where('tenantId', '==', currentUser?.tenantId))), snapshot => {
            const list: Ingredient[] = [];
            snapshot.forEach(docSnap => {
              list.push({
                id: docSnap.id,
                ...docSnap.data()
              } as Ingredient);
            });
            setIngredients(list);
          }, err => {
            console.warn("Firestore ingredients listener error:", err);
          });
          const unsubscribeStockMovements = onSnapshot((currentUser?.role === 'super_admin' || !currentUser?.tenantId ? collection(db, 'stock_movements') : query(collection(db, 'stock_movements'), where('tenantId', '==', currentUser?.tenantId))), snapshot => {
            const list: StockMovement[] = [];
            snapshot.forEach(docSnap => {
              list.push({
                id: docSnap.id,
                ...docSnap.data()
              } as StockMovement);
            });
            setStockMovements(list);
          }, err => {
            console.warn("Firestore stock movements listener error:", err);
          });
          const unsubscribeNotifications = onSnapshot((currentUser?.role === 'super_admin' || !currentUser?.tenantId ? collection(db, 'notifications') : query(collection(db, 'notifications'), where('tenantId', '==', currentUser?.tenantId))), snapshot => {
            const list: DinexNotification[] = [];
            snapshot.forEach(docSnap => {
              list.push({
                id: docSnap.id,
                ...docSnap.data()
              } as DinexNotification);
            });
            list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setNotifications(list);
          }, err => {
            console.warn("Firestore notifications listener error:", err);
          });
          const unsubscribeMarketplaceExtensions = onSnapshot(collection(db, 'marketplace_extensions'), snapshot => {
            const list: MarketplaceExtension[] = [];
            snapshot.forEach(docSnap => {
              list.push({
                id: docSnap.id,
                ...docSnap.data()
              } as MarketplaceExtension);
            });
            setMarketplaceExtensions(list);
          }, err => {
            console.warn("Firestore marketplace extensions listener error:", err);
          });
          const unsubscribeInstalledExtensions = onSnapshot((currentUser?.role === 'super_admin' || !currentUser?.tenantId ? collection(db, 'installed_extensions') : query(collection(db, 'installed_extensions'), where('tenantId', '==', currentUser?.tenantId))), snapshot => {
            const list: InstalledExtension[] = [];
            snapshot.forEach(docSnap => {
              list.push({
                id: docSnap.id,
                ...docSnap.data()
              } as InstalledExtension);
            });
            setInstalledExtensions(list);
          }, err => {
            console.warn("Firestore installed extensions listener error:", err);
          });
          const unsubscribeLandingPageConfig = onSnapshot(firestoreDoc(db, 'landing_page_settings', 'global'), docSnapshot => {
            if (docSnapshot.exists()) {
              setLandingPageConfig(docSnapshot.data() as LandingPageConfig);
            }
          }, err => {
            console.warn("Firestore landing page settings listener error:", err);
          });
          const unsubscribeGlobalSettings = onSnapshot(firestoreDoc(db, 'system_settings', 'global'), docSnapshot => {
            if (docSnapshot.exists()) {
              setGlobalSettings(docSnapshot.data() as GlobalSettings);
            }
          }, err => {
            console.warn("Firestore global settings listener error:", err);
          });
          const targetOrdersTenantId = activeTenantId || currentUser?.tenantId;
          let ordersQuery;
          if (currentUser?.role === 'super_admin') {
            ordersQuery = collection(db, 'orders');
          } else if (currentUser?.role === 'customer' && currentUser?.email) {
            ordersQuery = query(collection(db, 'orders'), where('customerEmail', '==', currentUser.email));
          } else if (targetOrdersTenantId) {
            ordersQuery = query(collection(db, 'orders'), where('tenantId', '==', targetOrdersTenantId));
          } else {
            ordersQuery = collection(db, 'orders');
          }
          const unsubscribeOrders = onSnapshot(ordersQuery, snapshot => {
            const list: Order[] = [];
            snapshot.forEach(docSnap => {
              list.push({
                id: docSnap.id,
                ...docSnap.data()
              } as Order);
            });
            list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
            setOrders(list);
          }, err => {
            console.warn("Firestore orders listener error:", err);
          });
          return () => {
            unsubscribeTenants();
            unsubscribeBusinesses();
            unsubscribeCategories();
            unsubscribeMenuItems();
            unsubscribeStaff();
            unsubscribeUsers();
            unsubscribeBranches();
            unsubscribeTables();
            unsubscribeStations();
            unsubscribeReservations();
            unsubscribeIngredients();
            unsubscribeStockMovements();
            unsubscribeNotifications();
            unsubscribeMarketplaceExtensions();
            unsubscribeInstalledExtensions();
            unsubscribeGlobalSettings();
            unsubscribeLandingPageConfig();
            unsubscribeOrders();
          };
        }
      } catch (err) {
        console.warn("Error setting up Firestore realtime listeners:", err);
      }
    };
    initializeListeners().then(unsub => {
      unsubscribeFn = unsub;
    });
    return () => {
      if (unsubscribeFn) {
        unsubscribeFn();
      }
    };
  }, [currentUser, activeTenantId]);

  useEffect(() => {
    let unsubAuth: (() => void) | undefined;
    const setupAuthObserver = async () => {
      try {
        const {
          getAuth,
          onAuthStateChanged
        } = await import('firebase/auth');
        const {
          initializeFirebase
        } = await import('../lib/firebase');
        const init = initializeFirebase();
        if (init && init.auth) {
          unsubAuth = onAuthStateChanged(init.auth, async firebaseUser => {
            if (firebaseUser && firebaseUser.email) {
              await login(firebaseUser.email, firebaseUser.uid);
            }
          });
        }
      } catch (err) {
        console.warn("Auth observer setup skipped:", err);
      }
    };
    setupAuthObserver();
    return () => {
      if (unsubAuth) {
        unsubAuth();
      }
    };
  }, []);

  // 5. Customer Profiles State
  const [customerProfiles, setCustomerProfiles] = useState<Record<string, CustomerProfile>>({});
  useEffect(() => {}, [customerProfiles]);
  useEffect(() => {}, [currentView]);

  useEffect(() => {
    if (currentUser) {
      setCurrentView('dashboard');
    } else if (currentView === 'dashboard') {
      setCurrentView('landing');
    }
  }, [currentUser]);

  // Sync to local storage on state changes
  useEffect(() => {}, [tenants]);
  useEffect(() => {}, [branches]);
  useEffect(() => {}, [stations]);
  useEffect(() => {}, [categories]);
  useEffect(() => {}, [menuItems]);
  useEffect(() => {}, [tables]);
  useEffect(() => {}, [orders]);
  useEffect(() => {}, [staff]);
  useEffect(() => {}, [logs]);
  useEffect(() => {
    // Auto-update active branch when tenant changes
    const tenantBranches = branches.filter(b => b.tenantId === activeTenantId);
    if (tenantBranches.length > 0 && !tenantBranches.some(b => b.id === activeBranchId)) {
      setActiveBranchId(tenantBranches[0].id);
    }
  }, [activeTenantId, branches, activeBranchId]);
  useEffect(() => {}, [activeBranchId]);
  useEffect(() => {
    if (currentUser) {} else {}
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
  const login = async (emailOrInput: string, uid?: string): Promise<{
    success: boolean;
    message: string;
    user?: any;
  }> => {
    const cleanEmail = (typeof emailOrInput === 'string' ? emailOrInput : '').toLowerCase().trim();

    // 1. Check Super Admin
    if (cleanEmail === 'naolnigatu2025@gmail.com') {
      const name = 'Naol Nigatu (Platform Admin)';
      const user = {
        id: uid || 'sa-01',
        uid: uid || 'sa-01',
        email: cleanEmail,
        role: 'super_admin' as const,
        name
      };
      setCurrentUser(user);
      addLog('Login', `${name} logged in.`);
      return {
        success: true,
        message: "Signed in as Platform Admin",
        user
      };
    }

    // 2. PRIMARY LOOKUP: Query Firestore by UID or Email directly from database
    try {
      const {
        getDB
      } = await import('../lib/firebase');
      const db = getDB();
      if (db) {
        const {
          doc,
          getDoc,
          collection,
          query,
          where,
          getDocs
        } = await import('firebase/firestore');
        let userDocData: any = null;
        let userDocId: string = uid || '';

        // 1. Check 'staff' collection FIRST (Staff take priority over generic customer accounts)
        if (uid) {
          try {
            const sSnap = await getDoc(doc(db, 'staff', uid));
            if (sSnap.exists()) {
              userDocData = sSnap.data();
              userDocId = sSnap.id;
            }
          } catch (e) {
            console.warn("Staff lookup by UID failed:", e);
          }
        }
        if (!userDocData && cleanEmail) {
          try {
            const sQuery = query(collection(db, 'staff'), where('email', '==', cleanEmail));
            const sQuerySnap = await getDocs(sQuery);
            if (!sQuerySnap.empty) {
              userDocData = sQuerySnap.docs[0].data();
              userDocId = sQuerySnap.docs[0].id;
            }
          } catch (e) {
            console.warn("Staff query by email failed:", e);
          }
        }

        // 2. If not staff, check 'users' collection
        if (!userDocData && uid) {
          try {
            const uSnap = await getDoc(doc(db, 'users', uid));
            if (uSnap.exists()) {
              userDocData = uSnap.data();
              userDocId = uSnap.id;
            }
          } catch (e) {
            console.warn("User lookup by UID failed:", e);
          }
        }
        if (!userDocData && cleanEmail) {
          try {
            const uQuery = query(collection(db, 'users'), where('email', '==', cleanEmail));
            const uQuerySnap = await getDocs(uQuery);
            if (!uQuerySnap.empty) {
              userDocData = uQuerySnap.docs[0].data();
              userDocId = uQuerySnap.docs[0].id;
            }
          } catch (e) {
            console.warn("User query by email failed:", e);
          }
        }
        if (userDocData) {
          const role = (userDocData.role || 'customer') as UserRole;
          const tenantId = userDocData.tenantId || '';
          let loadedBusiness: Tenant | null = null;
          let loadedPermissions: string[] = userDocData.permissions || [];
          if (role !== 'customer' && tenantId) {
            // Load Business from Firestore defensively
            try {
              const bSnap = await getDoc(doc(db, 'businesses', tenantId));
              if (bSnap.exists()) {
                loadedBusiness = {
                  id: bSnap.id,
                  ...bSnap.data()
                } as Tenant;
              } else {
                const tSnap = await getDoc(doc(db, 'tenants', tenantId));
                if (tSnap.exists()) {
                  loadedBusiness = {
                    id: tSnap.id,
                    ...tSnap.data()
                  } as Tenant;
                }
              }
            } catch (err) {
              console.warn("Business doc load failed during login:", err);
            }

            // Load Permissions from Firestore defensively
            try {
              const permSnap = await getDoc(doc(db, 'permissions', `perm-${userDocId}`));
              if (permSnap.exists() && permSnap.data().permissions?.length) {
                loadedPermissions = permSnap.data().permissions;
              }
            } catch (err) {
              console.warn("Permissions doc load failed during login:", err);
            }
          }
          const businessId = tenantId || loadedBusiness?.id || '';
          const userObj = {
            ...userDocData,
            id: userDocId,
            uid: uid || userDocId,
            firstName: userDocData.firstName || '',
            lastName: userDocData.lastName || '',
            phone: userDocData.phone || '',
            email: cleanEmail || userDocData.email,
            role,
            tenantId: businessId,
            branchId: userDocData.branchId || '',
            businessId: businessId,
            permissions: loadedPermissions,
            name: userDocData.name || (userDocData.firstName ? `${userDocData.firstName} ${userDocData.lastName || ''}`.trim() : cleanEmail.split('@')[0])
          };
          
          if (loadedBusiness) {
            setTenants(prev => {
              const exists = prev.find(t => t.id === loadedBusiness!.id);
              if (exists) return prev.map(t => t.id === loadedBusiness!.id ? loadedBusiness! : t);
              return [...prev, loadedBusiness!];
            });
          }
          
          if (userObj.tenantId) {
            setActiveTenantId(userObj.tenantId);
          }
          if (userObj.branchId) {
            setActiveBranchId(userObj.branchId);
          }
          
          // Ensure local staff list includes this staff member
          if (role !== 'customer' && role !== 'owner' && role !== 'super_admin') {
            setStaff(prev => {
              if (prev.some(s => s.id === userDocId || (uid && s.uid === uid) || (cleanEmail && s.email.toLowerCase() === cleanEmail))) {
                return prev.map(s => (s.id === userDocId || (uid && s.uid === uid) || (cleanEmail && s.email.toLowerCase() === cleanEmail)) ? { ...s, ...userObj, active: true } : s);
              }
              return [...prev, {
                id: userDocId,
                uid: uid || userDocId,
                tenantId: userObj.tenantId,
                branchId: userObj.branchId,
                name: userObj.name,
                firstName: userDocData.firstName || '',
                lastName: userDocData.lastName || '',
                phone: userDocData.phone || '',
                email: userObj.email,
                role: userObj.role,
                active: true,
                permissions: userObj.permissions
              }];
            });
          }

          setCurrentUser(userObj);
          addLog('Login', `User ${userObj.name} (${userObj.role}) loaded from Firestore.`);
          return {
            success: true,
            message: "Workspace loaded successfully",
            user: userObj
          };
        }

        // D. Direct check for Tenant/Business ownership
        let tenantSnapDocs: any[] = [];
        if (uid) {
          const tByUid = query(collection(db, 'tenants'), where('ownerUid', '==', uid));
          const tByUidSnap = await getDocs(tByUid);
          if (!tByUidSnap.empty) tenantSnapDocs = tByUidSnap.docs;
        }
        if (tenantSnapDocs.length === 0 && cleanEmail) {
          const tByEmail = query(collection(db, 'tenants'), where('ownerEmail', '==', cleanEmail));
          const tByEmailSnap = await getDocs(tByEmail);
          if (!tByEmailSnap.empty) tenantSnapDocs = tByEmailSnap.docs;
        }
        if (tenantSnapDocs.length === 0 && cleanEmail) {
          const bByEmail = query(collection(db, 'businesses'), where('ownerEmail', '==', cleanEmail));
          const bByEmailSnap = await getDocs(bByEmail);
          if (!bByEmailSnap.empty) tenantSnapDocs = bByEmailSnap.docs;
        }
        if (tenantSnapDocs.length > 0) {
          const docSnap = tenantSnapDocs[0];
          const data = docSnap.data();
          const tenantObj = {
            id: docSnap.id,
            ...data
          } as Tenant;
          setTenants(prev => [...prev.filter(t => t.id !== docSnap.id), tenantObj]);
          const userObj = {
            id: uid || docSnap.id,
            uid: uid || docSnap.id,
            email: cleanEmail || data.ownerEmail,
            role: 'owner' as const,
            name: data.ownerName || data.name || 'Owner',
            tenantId: docSnap.id,
            branchId: ''
          };
          setCurrentUser(userObj);
          setActiveTenantId(docSnap.id);
          addLog('Login', `Tenant Owner (${userObj.email}) loaded from Firestore business record.`);
          return {
            success: true,
            message: "Business workspace loaded successfully",
            user: userObj
          };
        }
      }
    } catch (err) {
      console.warn("Firestore profile loading error during login:", err);
    }

    // 3. Fallback for Hardcoded Demo Accounts
    if (cleanEmail === 'aisha@menuflow.com') {
      const u = {
        id: 's-01',
        email: cleanEmail,
        role: 'owner' as const,
        name: 'Aisha Jafar',
        tenantId: 't-01',
        branchId: 'b-01'
      };
      setCurrentUser(u);
      setActiveTenantId('t-01');
      setActiveBranchId('b-01');
      return {
        success: true,
        message: "Demo account loaded",
        user: u
      };
    }
    if (cleanEmail === 'carlos@menuflow.com') {
      const u = {
        id: 's-02',
        email: cleanEmail,
        role: 'owner' as const,
        name: 'Carlos Mwangi',
        tenantId: 't-02',
        branchId: 'b-03'
      };
      setCurrentUser(u);
      setActiveTenantId('t-02');
      setActiveBranchId('b-03');
      return {
        success: true,
        message: "Demo account loaded",
        user: u
      };
    }
    if (cleanEmail === 'fatima@menuflow.com') {
      const u = {
        id: 's-03',
        email: cleanEmail,
        role: 'waiter' as const,
        name: 'Fatima Ahmed',
        tenantId: 't-01',
        branchId: 'b-01'
      };
      setCurrentUser(u);
      setActiveTenantId('t-01');
      setActiveBranchId('b-01');
      return {
        success: true,
        message: "Demo account loaded",
        user: u
      };
    }
    if (cleanEmail === 'yohannes@menuflow.com') {
      const u = {
        id: 's-04',
        email: cleanEmail,
        role: 'kitchen' as const,
        name: 'Yohannes Bekele',
        tenantId: 't-01',
        branchId: 'b-01',
        stationId: 'st-01'
      };
      setCurrentUser(u);
      setActiveTenantId('t-01');
      setActiveBranchId('b-01');
      return {
        success: true,
        message: "Demo account loaded",
        user: u
      };
    }

    // 4. In-Memory fallback for active session
    const foundStaff = staff.find(s => (s.email || '').toLowerCase().trim() === cleanEmail && s.active !== false);
    if (foundStaff) {
      const user = {
        id: foundStaff.id,
        email: foundStaff.email,
        role: foundStaff.role,
        name: foundStaff.name,
        tenantId: foundStaff.tenantId || '',
        branchId: foundStaff.branchId || '',
        stationId: foundStaff.stationId
      };
      setCurrentUser(user);
      if (foundStaff.tenantId) setActiveTenantId(foundStaff.tenantId);
      if (foundStaff.branchId) setActiveBranchId(foundStaff.branchId);
      return {
        success: true,
        message: "Staff profile loaded",
        user
      };
    }
    const foundTenant = tenants.find(t => (t.ownerEmail || '').toLowerCase().trim() === cleanEmail);
    if (foundTenant) {
      const tenantBranch = branches.find(b => b.tenantId === foundTenant.id);
      const user = {
        id: uid || foundTenant.id,
        email: cleanEmail,
        role: 'owner' as const,
        name: foundTenant.name + ' Owner',
        tenantId: foundTenant.id,
        branchId: tenantBranch?.id || ''
      };
      setCurrentUser(user);
      setActiveTenantId(foundTenant.id);
      if (tenantBranch) setActiveBranchId(tenantBranch.id);
      return {
        success: true,
        message: "Business profile loaded",
        user
      };
    }
    const foundCustomer = customerProfiles[cleanEmail];
    if (foundCustomer) {
      const user = {
        id: foundCustomer.id,
        email: cleanEmail,
        role: 'customer' as const,
        name: foundCustomer.name,
        tenantId: '',
        branchId: ''
      };
      setCurrentUser(user);
      return {
        success: true,
        message: "Customer profile loaded",
        user
      };
    }
    return {
      success: false,
      message: "Account not found in our records. Please sign up."
    };
  };
  const logout = async () => {
    try {
      const {
        logOut
      } = await import('../lib/firebase');
      await logOut();
    } catch (e) {
      console.warn("Firebase logout error:", e);
    }
    addLog('Logout', `User logged out.`);
    setCurrentUser(null);
    setCurrentView('landing');
  };

  // Menu Categories
  const addCategory = async (catData: Omit<Category, 'id'>) => {
    const id = `cat-${Date.now()}`;
    const newCat: Category = {
      ...catData,
      id
    };
    setCategories(prev => {
      const tenantCats = prev[catData.tenantId] || [];
      if (tenantCats.some(c => c.id === id)) return prev;
      return {
        ...prev,
        [catData.tenantId]: [...tenantCats, newCat]
      };
    });
    addLog('Create Category', `Created menu category: ${catData.name}`);
    await syncToFirestore('categories', id, newCat);
  };
  const updateCategory = async (updatedCat: Category) => {
    setCategories(prev => {
      const tenantCats = prev[updatedCat.tenantId] || [];
      return {
        ...prev,
        [updatedCat.tenantId]: tenantCats.map(c => c.id === updatedCat.id ? updatedCat : c)
      };
    });
    addLog('Update Category', `Updated menu category: ${updatedCat.name}`);
    await syncToFirestore('categories', updatedCat.id, updatedCat);
  };
  const deleteCategory = async (tenantId: string, categoryId: string) => {
    const catName = categories[tenantId]?.find(c => c.id === categoryId)?.name || '';
    setCategories(prev => {
      const tenantCats = prev[tenantId] || [];
      return {
        ...prev,
        [tenantId]: tenantCats.filter(c => c.id !== categoryId)
      };
    });
    addLog('Delete Category', `Deleted menu category: ${catName}`);
    await deleteFromFirestore('categories', categoryId);
  };

  // Menu Items
  const addMenuItem = async (itemData: Omit<MenuItem, 'id'>) => {
    const id = `item-${Date.now()}`;
    const newItem: MenuItem = {
      ...itemData,
      id
    };
    setMenuItems(prev => {
      const tenantItems = prev[itemData.tenantId] || [];
      if (tenantItems.some(i => i.id === id)) return prev;
      return {
        ...prev,
        [itemData.tenantId]: [...tenantItems, newItem]
      };
    });
    addLog('Create Menu Item', `Created menu item: ${itemData.name}`);
    await syncToFirestore('menu_items', id, newItem);
  };
  const updateMenuItem = async (updatedItem: MenuItem) => {
    setMenuItems(prev => {
      const tenantItems = prev[updatedItem.tenantId] || [];
      return {
        ...prev,
        [updatedItem.tenantId]: tenantItems.map(i => i.id === updatedItem.id ? updatedItem : i)
      };
    });
    addLog('Update Menu Item', `Updated menu item: ${updatedItem.name}`);
    await syncToFirestore('menu_items', updatedItem.id, updatedItem);
  };
  const deleteMenuItem = async (tenantId: string, itemId: string) => {
    const itemName = menuItems[tenantId]?.find(i => i.id === itemId)?.name || '';
    setMenuItems(prev => {
      const tenantItems = prev[tenantId] || [];
      return {
        ...prev,
        [tenantId]: tenantItems.filter(i => i.id !== itemId)
      };
    });
    addLog('Delete Menu Item', `Deleted menu item: ${itemName}`);
    await deleteFromFirestore('menu_items', itemId);
  };
  const toggleMenuItemAvailability = async (tenantId: string, itemId: string) => {
    const currentItem = menuItems[tenantId]?.find(i => i.id === itemId);
    if (currentItem) {
      const updated = {
        ...currentItem,
        isAvailable: !currentItem.isAvailable
      };
      setMenuItems(prev => {
        const tenantItems = prev[tenantId] || [];
        return {
          ...prev,
          [tenantId]: tenantItems.map(i => i.id === itemId ? updated : i)
        };
      });
      addLog('Toggle Availability', `Toggled availability for menu item ${currentItem.name} to ${!currentItem.isAvailable ? 'available' : 'unavailable'}`);
      await syncToFirestore('menu_items', itemId, updated);
    }
  };

  // Tables
  const addTable = async (tableData: Omit<Table, 'id' | 'qrUrl'>) => {
    const id = `tab-${Date.now()}`;
    const newTable: Table = {
      ...tableData,
      tenantId: tableData.tenantId || activeTenantId,
      id,
      qrUrl: `https://menuflow.io/${activeTenantId}/${tableData.branchId}/${id}`
    };
    setTables(prev => [...prev, newTable]);
    addLog('Create Table', `Created Table: ${tableData.number} in ${tableData.section}`);
    await syncToFirestore('tables', id, newTable);
  };
  const updateTableStatus = async (tableId: string, status: Table['status']) => {
    setTables(prev => prev.map(t => t.id === tableId ? {
      ...t,
      status
    } : t));
    const tbl = tables.find(t => t.id === tableId);
    if (tbl) {
      await syncToFirestore('tables', tableId, {
        ...tbl,
        status
      });
    }
  };

  // Stations
  const addStation = async (stationData: Omit<PreparationStation, 'id'>) => {
    const id = `st-${Date.now()}`;
    const newStation: PreparationStation = {
      ...stationData,
      tenantId: stationData.tenantId || activeTenantId,
      id
    };
    setStations(prev => {
      if (prev.some(s => s.id === id)) return prev;
      return [...prev, newStation];
    });
    addLog('Create Station', `Created preparation station: ${stationData.name}`);
    await syncToFirestore('stations', id, newStation);
  };

  const updateStation = async (updatedStation: PreparationStation) => {
    setStations(prev => prev.map(s => s.id === updatedStation.id ? updatedStation : s));
    addLog('Update Station', `Updated preparation station: ${updatedStation.name}`);
    await syncToFirestore('stations', updatedStation.id, updatedStation);
  };

  const deleteStation = async (stationId: string) => {
    const stationName = stations.find(s => s.id === stationId)?.name || '';
    setStations(prev => prev.filter(s => s.id !== stationId));
    addLog('Delete Station', `Deleted preparation station: ${stationName}`);
    await deleteFromFirestore('stations', stationId);
  };

  // Orders
  const placeOrder = async (orderData: Omit<Order, 'id' | 'orderNum' | 'createdAt' | 'status' | 'paymentStatus' | 'subtotal' | 'tax' | 'serviceCharge' | 'total' | 'timeline' | 'kitchenNotes'> & {
    tip?: number;
  }) => {
    const tenant = tenants.find(t => t.id === orderData.tenantId);
    if (!tenant) return null;

    // Calculate financial subtotals

    let subtotal = 0;
    orderData.items.forEach(it => {
      let itemCost = it.price;
      (it.selectedModifiers || []).forEach(m => {
        itemCost += m.price;
      });
      subtotal += itemCost * it.quantity;
    });
    if (orderData.type === 'meal_subscription') {
      const durationMatch = orderData.notes?.match(/Subscription Term: (\d+) Days/);
      const subDays = durationMatch ? parseInt(durationMatch[1]) : 30;
      subtotal = subtotal * subDays;
      if (tenant.mealSubscriptionDiscountPercent && tenant.mealSubscriptionDiscountPercent > 0) {
        subtotal = subtotal - subtotal * (tenant.mealSubscriptionDiscountPercent / 100);
      }
    }
    const taxAmount = parseFloat((subtotal * tenant.baseTaxRate / 100).toFixed(2));
    const serviceChargeAmount = parseFloat((subtotal * tenant.serviceCharge / 100).toFixed(2));
    const tipAmount = orderData.tip || 0;
    const deliveryFeeAmount = (orderData as any).deliveryFee || 0;
    const totalAmount = parseFloat((subtotal + taxAmount + serviceChargeAmount + tipAmount + deliveryFeeAmount - orderData.discount).toFixed(2));
    const hrId = `MF-${Math.floor(1000 + Math.random() * 9000)}`;
    const initialPaymentStatus = orderData.paymentVerificationStatus === 'approved' ? 'paid' as const : 'pending' as const;
    const initialStatus = (orderData as any).status || (orderData.paymentVerificationStatus === 'approved' ? 'accepted' as const : 'pending' as const);
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
      timeline: [{
        id: `ev-${Date.now()}-1`,
        time: new Date().toISOString(),
        label: 'Order Placed',
        desc: `New order registered. Payment via ${orderData.paymentMethod}`,
        actor: 'Customer'
      }],
      kitchenNotes: []
    };
    setOrders(prev => [newOrder, ...prev]);

    // Update table status if dine-in
    if (orderData.type === 'dine_in' && orderData.tableId) {
      updateTableStatus(orderData.tableId, 'waiting');
    }
    addLog('Place Order', `New order ${hrId} placed. Total: ${tenant.currencySymbol} ${totalAmount}`);
    await syncToFirestore('orders', newOrder.id, newOrder);
    return newOrder;
  };
  const updateOrderStatus = async (orderId: string, status: OrderStatus, actor?: string) => {
    const existing = orders.find(o => o.id === orderId);
    if (!existing) return;
    let items = [...existing.items];
    let estimatedReadyTime = existing.estimatedReadyTime;
    if (status === 'accepted' && !estimatedReadyTime) {
      let maxPrep = 15;
      existing.items.forEach(it => {
        const p = it.item.prepTime || 15;
        if (p > maxPrep) maxPrep = p;
      });
      estimatedReadyTime = new Date(Date.now() + maxPrep * 60000).toISOString();
    }
    if (status === 'preparing') {
      items = items.map(it => it.status === 'received' ? {
        ...it,
        status: 'cooking' as const
      } : it);
    } else if (status === 'ready') {
      items = items.map(it => it.status === 'received' || it.status === 'cooking' ? {
        ...it,
        status: 'ready' as const
      } : it);
    } else if (status === 'served') {
      items = items.map(it => ({
        ...it,
        status: 'delivered' as const
      }));
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
      estimatedReadyTime,
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
    await syncToFirestore('orders', orderId, updated);
  };
  const assignDelivery = async (orderId: string, staffId: string, staffName: string, deliveryFee: number) => {
    const existing = orders.find(o => o.id === orderId);
    if (!existing) return;
    const deliveryFeeAmount = deliveryFee || 0;
    const newTotal = parseFloat((existing.subtotal + existing.tax + existing.serviceCharge + (existing.tip || 0) + deliveryFeeAmount - existing.discount).toFixed(2));
    const newEvent = {
      id: `ev-${Date.now()}`,
      time: new Date().toISOString(),
      label: 'Delivery Assigned',
      desc: `Assigned to ${staffName} with delivery fee ${deliveryFee}`,
      actor: 'Manager'
    };
    const updated: Order = {
      ...existing,
      deliveryStatus: 'pending_acceptance',
      deliveryStaffId: staffId,
      deliveryStaffName: staffName,
      deliveryFee: deliveryFeeAmount,
      total: newTotal,
      timeline: [...(existing.timeline || []), newEvent]
    };
    setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    addLog('Assign Delivery', `Order ${existing.orderNum} assigned to ${staffName} (Fee: ${deliveryFee})`);
    await syncToFirestore('orders', orderId, updated);
  };
  const acceptDeliveryFee = async (orderId: string) => {
    const existing = orders.find(o => o.id === orderId);
    if (!existing) return;
    const newEvent = {
      id: `ev-${Date.now()}`,
      time: new Date().toISOString(),
      label: 'Delivery Accepted',
      desc: 'Customer accepted the delivery fee and confirmed the order.',
      actor: 'Customer'
    };
    const updated: Order = {
      ...existing,
      status: 'accepted',
      deliveryStatus: 'preparing',
      timeline: [...(existing.timeline || []), newEvent]
    };
    setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    addLog('Accept Delivery Fee', `Customer accepted delivery fee for order ${existing.orderNum}`);
    await syncToFirestore('orders', orderId, updated);
  };
  const reportOrderItemIssue = async (orderId: string, itemId: string, reason: string) => {
    const existing = orders.find(o => o.id === orderId);
    if (!existing) return;
    const updated: Order = {
      ...existing,
      items: existing.items.map(it => it.id === itemId ? {
        ...it,
        status: 'issue_reported' as const,
        issueReason: reason
      } : it),
      updatedAt: new Date().toISOString()
    };
    setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    await syncToFirestore('orders', orderId, updated);
  };
  const resolveOrderItemIssue = async (orderId: string, itemId: string, approved: boolean) => {
    const existing = orders.find(o => o.id === orderId);
    if (!existing) return;
    const updated: Order = {
      ...existing,
      items: existing.items.map(it => {
        if (it.id !== itemId) return it;
        return {
          ...it,
          status: approved ? ('cancelled' as const) : ('received' as const),
          issueReason: undefined
        };
      }),
      updatedAt: new Date().toISOString()
    };
    setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    await syncToFirestore('orders', orderId, updated);
  };
  const updateOrderItemStatus = async (orderId: string, itemId: string, itemStatus: OrderItem['status'], actor?: string) => {
    const existing = orders.find(o => o.id === orderId);
    if (!existing) return;
    const updatedItems = existing.items.map(it => it.id === itemId ? {
      ...it,
      status: itemStatus
    } : it);

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
    await syncToFirestore('orders', orderId, updated);
  };
  const processPayment = async (orderId: string, paymentMethod: Order['paymentMethod'], discountPercentage: number, redeemPoints = 0, tipAmount = 0) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;
    const tenant = tenants.find(t => t.id === targetOrder.tenantId);
    if (!tenant) return;
    const discountVal = parseFloat((targetOrder.subtotal * discountPercentage / 100).toFixed(2));
    const pointsDiscount = redeemPoints * tenant.loyaltyRedeemValue;
    const finalDiscount = discountVal + pointsDiscount;
    const taxAmount = parseFloat((targetOrder.subtotal * tenant.baseTaxRate / 100).toFixed(2));
    const serviceChargeAmount = parseFloat((targetOrder.subtotal * tenant.serviceCharge / 100).toFixed(2));
    const finalTotal = parseFloat((targetOrder.subtotal + taxAmount + serviceChargeAmount + tipAmount - finalDiscount).toFixed(2));
    const loyaltyEarned = Math.floor(finalTotal * tenant.loyaltyPointsRatio);

    // Loyalty integration
    if (targetOrder.customerEmail) {
      const email = targetOrder.customerEmail;
      
        const current = customerProfiles[email] || {
          id: currentUser?.uid || `cust-${Date.now()}`,
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
      setCustomerProfiles(prev => ({
          ...prev,
          [email]: updatedProfile
        }));
      syncToFirestore('users', updatedProfile.id, updatedProfile);
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
    await syncToFirestore('orders', orderId, updated);
  };
  const rateAndFeedback = async (orderId: string, rating: number, feedback: string) => {
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
    await syncToFirestore('orders', orderId, updated);
  };
  const cancelOrder = async (orderId: string, reason: string) => {
    const existing = orders.find(o => o.id === orderId);
    if (!existing) return;
    if (existing.tableId && existing.type === 'dine_in') {
      updateTableStatus(existing.tableId, 'empty');
    }
    const updated: Order = {
      ...existing,
      status: 'cancelled' as const,
      updatedAt: new Date().toISOString(),
      timeline: [...(existing.timeline || []), {
        id: `ev-${Date.now()}`,
        time: new Date().toISOString(),
        label: 'Order Cancelled',
        desc: `Reason: ${reason}`,
        actor: 'Staff'
      }]
    };
    setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    addLog('Cancel Order', `Order ${orderId} was cancelled. Reason: ${reason}`);
    await syncToFirestore('orders', orderId, updated);
  };
  const verifyAdvancePayment = async (orderId: string, approve: boolean, rejectionReason?: string) => {
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
        timeline: [...(existing.timeline || []), {
          id: `ev-${Date.now()}`,
          time: new Date().toISOString(),
          label: 'Advance Payment Approved',
          desc: 'Advance payment verified by cashier',
          actor: 'Cashier'
        }]
      };
    } else {
      updated = {
        ...existing,
        paymentVerificationStatus: 'rejected' as const,
        paymentStatus: 'failed' as const,
        status: 'cancelled' as const,
        notes: rejectionReason ? `${existing.notes || ''} [Rejected: ${rejectionReason}]` : existing.notes,
        updatedAt: new Date().toISOString(),
        timeline: [...(existing.timeline || []), {
          id: `ev-${Date.now()}`,
          time: new Date().toISOString(),
          label: 'Advance Payment Rejected',
          desc: `Advance payment rejected. Reason: ${rejectionReason}`,
          actor: 'Cashier'
        }]
      };
    }
    setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    addLog('Verify Advance Payment', `Advance payment for order ${orderId} was ${approve ? 'approved' : 'rejected'}.`);
    await syncToFirestore('orders', orderId, updated);
  };
  const addKitchenNote = async (orderId: string, text: string) => {
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
    await syncToFirestore('orders', orderId, updated);
  };
  const approveKitchenNote = async (orderId: string, noteId: string, approve: boolean) => {
    const existing = orders.find(o => o.id === orderId);
    if (!existing) return;
    const updatedNotes = (existing.kitchenNotes || []).map(note => {
      if (note.id !== noteId) return note;
      return {
        ...note,
        approved: approve,
        rejected: !approve
      };
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
    await syncToFirestore('orders', orderId, updated);
  };
  const addTip = async (orderId: string, amount: number) => {
    const existing = orders.find(o => o.id === orderId);
    if (!existing) return;
    const updated: Order = {
      ...existing,
      tip: (existing.tip || 0) + amount,
      total: parseFloat((existing.total + amount).toFixed(2)),
      updatedAt: new Date().toISOString(),
      timeline: [...(existing.timeline || []), {
        id: `ev-${Date.now()}`,
        time: new Date().toISOString(),
        label: 'Tip Added',
        desc: `Recorded tip amount of ${amount}`,
        actor: 'Staff'
      }]
    };
    setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    addLog('Add Tip', `Recorded tip of ${amount} for order: ${orderId}`);
    await syncToFirestore('orders', orderId, updated);
  };
  const deliverTip = async (orderId: string) => {
    const existing = orders.find(o => o.id === orderId);
    if (!existing) return;
    const updated: Order = {
      ...existing,
      tipStatus: 'delivered' as const,
      updatedAt: new Date().toISOString(),
      timeline: [...(existing.timeline || []), {
        id: `ev-${Date.now()}`,
        time: new Date().toISOString(),
        label: 'Tip Delivered',
        desc: 'Tip payout delivered to staff',
        actor: 'Cashier'
      }]
    };
    setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    addLog('Deliver Tip', `Tip delivered for order: ${orderId}`);
    await syncToFirestore('orders', orderId, updated);
  };

  // Staff
  const addStaffMember = async (memberData: Omit<Staff, 'id' | 'active'>, tempPassword?: string) => {
    let id = `s-${Date.now()}`;
    const cleanEmail = (memberData.email || '').trim().toLowerCase();
    
    // Check permissions
    if (currentUser) {
      const allowedRolesForOwner = ['manager', 'cashier', 'waiter', 'kitchen', 'bar', 'coffee', 'delivery', 'reception', 'inventory'];
      const allowedRolesForManager = ['cashier', 'waiter', 'kitchen', 'bar', 'coffee', 'delivery', 'reception', 'inventory'];
      
      if (currentUser.role === 'manager' && !allowedRolesForManager.includes(memberData.role)) {
        throw new Error("Branch Managers cannot create staff with role: " + memberData.role);
      }
      if ((currentUser.role === 'owner' || currentUser.role === 'super_admin') && !allowedRolesForOwner.includes(memberData.role)) {
        throw new Error("Owners cannot create staff with role: " + memberData.role);
      }
    }

    let uid = undefined;
    let authUserObj: any = null;
    if (tempPassword && cleanEmail) {
      try {
        const { createSecondaryUser } = await import('../lib/firebase');
        authUserObj = await createSecondaryUser(cleanEmail, tempPassword);
        if (authUserObj) {
          id = authUserObj.uid;
          uid = authUserObj.uid;
        }
      } catch (err: any) {
        console.error("Error creating auth user:", err);
        throw new Error(err.message || "Failed to create authentication account");
      }
    }

    const defaultPerms = memberData.permissions || (
      memberData.role === 'manager' ? ['dashboard.view', 'reports.view', 'menu.manage', 'orders.manage', 'tables.manage', 'staff.view', 'inventory.manage', 'kds.view', 'pos.manage', 'delivery.manage'] :
      memberData.role === 'cashier' ? ['pos.manage', 'orders.manage', 'tables.manage', 'payments.manage'] :
      memberData.role === 'waiter' ? ['tables.manage', 'orders.manage', 'menu.view', 'pos.orders'] :
      ['kitchen', 'bar', 'coffee'].includes(memberData.role) ? ['kds.view', 'orders.view', 'orders.status'] :
      memberData.role === 'delivery' ? ['delivery.manage', 'orders.view'] :
      memberData.role === 'reception' ? ['tables.manage', 'reservations.manage', 'orders.view'] :
      memberData.role === 'inventory' ? ['inventory.manage', 'menu.view'] :
      ['menu.view', 'orders.create']
    );

    const newStaff: Staff & { mustChangePassword?: boolean } = {
      ...memberData,
      email: cleanEmail,
      id,
      uid: uid || id,
      tenantId: (currentUser?.role === 'super_admin' || currentUser?.role === 'owner') ? activeTenantId : (currentUser?.tenantId || activeTenantId),
      branchId: (currentUser?.role === 'manager' || currentUser?.role === 'cashier') ? (currentUser.branchId || memberData.branchId) : (memberData.branchId || activeBranchId),
      permissions: defaultPerms,
      active: true,
      status: 'active',
      mustChangePassword: true,
      createdAt: new Date().toISOString(),
      createdBy: currentUser ? currentUser.id : 'system'
    };

    try {
      // 1. Sync to staff collection
      await syncToFirestore('staff', id, newStaff);
      // 2. Also sync to users collection for complete compatibility
      await syncToFirestore('users', id, newStaff);
      // 3. Sync permissions doc
      await syncToFirestore('permissions', `perm-${id}`, {
        id: `perm-${id}`,
        userId: id,
        tenantId: newStaff.tenantId,
        permissions: defaultPerms,
        updatedAt: new Date().toISOString()
      });

      setStaff(prev => {
        if (prev.some(s => s.id === id)) {
          return prev.map(s => s.id === id ? newStaff : s);
        }
        return [...prev, newStaff];
      });
      addLog('Add Staff', `Added employee ${memberData.name || memberData.firstName} as ${memberData.role}.`);
    } catch (err: any) {
      console.error("Error creating staff doc:", err);
      if (authUserObj && tempPassword && cleanEmail) {
        try {
          const { rollbackSecondaryUser } = await import('../lib/firebase');
          await rollbackSecondaryUser(cleanEmail, tempPassword);
        } catch (delErr) {
          console.error("Failed to rollback auth user:", delErr);
        }
      }
      throw new Error("Failed to create staff record. Document creation failed: " + (err.message || err));
    }
  };
  const toggleStaffStatus = async (staffId: string) => {
    const existing = staff.find(s => s.id === staffId);
    if (!existing) return;
    const newState = !existing.active;
    addLog('Toggle Staff Status', `Staff member ${existing.name} ${newState ? 'activated' : 'deactivated'}.`);
    const updated = {
      ...existing,
      active: newState
    };
    setStaff(prev => prev.map(s => s.id === staffId ? updated : s));
    await syncToFirestore('users', staffId, updated);
  };
  const updateStaffPermissions = async (staffId: string, permissions: string[]) => {
    const existing = staff.find(s => s.id === staffId);
    if (!existing) return;
    const updated = {
      ...existing,
      permissions
    };
    setStaff(prev => prev.map(s => s.id === staffId ? updated : s));
    await syncToFirestore('users', staffId, updated);
    addLog('Update Staff Permissions', `Updated custom permissions for employee: ${existing.name}.`);
  };

  // Super Admin
  const toggleTenantStatus = async (tenantId: string) => {
    const existing = tenants.find(t => t.id === tenantId);
    if (!existing) return;
    const nextStatus: Tenant['subscriptionStatus'] = existing.subscriptionStatus === 'active' ? 'suspended' : 'active';
    addLog('Platform Admin Override', `Tenant ${existing.name} subscription status updated to: ${nextStatus}`);
    const updated = {
      ...existing,
      subscriptionStatus: nextStatus
    };
    setTenants(prev => prev.map(t => t.id === tenantId ? updated : t));
    await syncToFirestore('businesses', tenantId, updated);
    await syncToFirestore('tenants', tenantId, updated);
  };
  const updateTenantPlan = async (tenantId: string, plan: Tenant['subscriptionPlan']) => {
    const existing = tenants.find(t => t.id === tenantId);
    if (!existing) return;
    addLog('Platform Admin Override', `Tenant ${existing.name} subscription plan updated to: ${plan}`);
    const updated = {
      ...existing,
      subscriptionPlan: plan
    };
    setTenants(prev => prev.map(t => t.id === tenantId ? updated : t));
    await syncToFirestore('businesses', tenantId, updated);
    await syncToFirestore('tenants', tenantId, updated);
  };
  const requestTenantUpgrade = async (tenantId: string, plan: Tenant['subscriptionPlan']) => {
    const existing = tenants.find(t => t.id === tenantId);
    if (!existing) return;
    addLog('Subscription', `Tenant ${existing.name} requested upgrade to: ${plan}. Status changed to pending_approval.`);
    const updated = {
      ...existing,
      subscriptionPlan: plan,
      subscriptionStatus: 'pending_approval' as const
    };
    setTenants(prev => prev.map(t => t.id === tenantId ? updated : t));
    await syncToFirestore('businesses', tenantId, updated);
    await syncToFirestore('tenants', tenantId, updated);
  };
  const updateTenantType = async (tenantId: string, businessType: string) => {
    const existing = tenants.find(t => t.id === tenantId);
    if (!existing) return;
    const updated = {
      ...existing,
      businessType
    };
    setTenants(prev => prev.map(t => t.id === tenantId ? updated : t));
    await syncToFirestore('businesses', tenantId, updated);
    await syncToFirestore('tenants', tenantId, updated);
  };
  const updateTenantCurrency = async (tenantId: string, currency: string, currencySymbol: string) => {
    const existing = tenants.find(t => t.id === tenantId);
    if (!existing) return;
    addLog('Settings Override', `Tenant ${existing.name} currency updated to: ${currency} (${currencySymbol})`);
    const updated = {
      ...existing,
      currency,
      currencySymbol
    };
    setTenants(prev => prev.map(t => t.id === tenantId ? updated : t));
    await syncToFirestore('businesses', tenantId, updated);
    await syncToFirestore('tenants', tenantId, updated);
  };
  const updateTenantProfile = async (tenantId: string, logoUrl: string, bankAccount: string, mealSubscriptionDiscountPercent?: number) => {
    const existing = tenants.find(t => t.id === tenantId);
    if (!existing) return;
    addLog('Settings Override', `Tenant ${existing.name} logo and bank details updated.`);
    const updated = {
      ...existing,
      logoUrl,
      bankAccount,
      mealSubscriptionDiscountPercent
    };
    setTenants(prev => prev.map(t => t.id === tenantId ? updated : t));
    await syncToFirestore('businesses', tenantId, updated);
    await syncToFirestore('tenants', tenantId, updated);
  };
  const approveTenantStatus = async (tenantId: string) => {
    const existing = tenants.find(t => t.id === tenantId);
    if (!existing) return;
    addLog('Platform Admin Approval', `Business "${existing.name}" registration request has been APPROVED.`);
    const updated = {
      ...existing,
      subscriptionStatus: 'active' as const
    };
    setTenants(prev => prev.map(t => t.id === tenantId ? updated : t));
    await syncToFirestore('businesses', tenantId, updated);
    await syncToFirestore('tenants', tenantId, updated);
  };
  const rejectTenantStatus = async (tenantId: string) => {
    const existing = tenants.find(t => t.id === tenantId);
    if (!existing) return;
    addLog('Platform Admin Approval', `Business "${existing.name}" registration request has been REJECTED.`);
    const updated = {
      ...existing,
      subscriptionStatus: 'rejected' as const
    };
    setTenants(prev => prev.map(t => t.id === tenantId ? updated : t));
    await syncToFirestore('businesses', tenantId, updated);
    await syncToFirestore('tenants', tenantId, updated);
  };
  const addAd = async (adData: Omit<PlatformAd, 'id' | 'createdAt' | 'active'>) => {
    const id = `ad-${Date.now()}`;
    const newAd: PlatformAd = {
      ...adData,
      id,
      active: true,
      createdAt: new Date().toISOString()
    };
    setAds(prev => [newAd, ...prev]);
    addLog('Ad Operations', `Published platform ad: ${adData.title}`);
    await syncToFirestore('ads', id, newAd);
  };
  const toggleAdStatus = async (id: string) => {
    const existing = ads.find(a => a.id === id);
    if (!existing) return;
    const nextActive = !existing.active;
    addLog('Ad Operations', `Ad "${existing.title}" is now ${nextActive ? 'Active' : 'Paused'}`);
    const updated = {
      ...existing,
      active: nextActive
    };
    setAds(prev => prev.map(ad => ad.id === id ? updated : ad));
    await syncToFirestore('ads', id, updated);
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
  const updatePlanTabs = (planId: string, enabledTabs: string[]) => {
    setPricingPlans(prev => prev.map(p => p.id === planId ? {
      ...p,
      enabledTabs
    } : p));
  };
  const updatePlanPrice = async (planId: SubscriptionPlan, newPriceUSD: number, newPriceETB: number) => {
    const existing = pricingPlans.find(p => p.id === planId);
    if (!existing) return;
    addLog('Pricing Operations', `Updated ${existing.name} price to USD ${newPriceUSD} / ETB ${newPriceETB}`);
    const updated = {
      ...existing,
      priceUSD: newPriceUSD,
      priceETB: newPriceETB
    };
    setPricingPlans(prev => prev.map(p => p.id === planId ? updated : p));
    await syncToFirestore('pricing_plans', planId, updated);
  };
  const registerTenant = async (data: {
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
    const ownerUid = currentUser?.uid || currentUser?.id || ownerId;
    const newTenant: Tenant & { tenantId?: string; ownerUid?: string } = {
      id: tenantId,
      tenantId,
      ownerUid: ownerUid,
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
      loyaltyRedeemValue: 1
    };
    const newBranch: Branch & { ownerUid?: string } = {
      id: branchId,
      tenantId,
      ownerUid: ownerUid,
      name: 'Main Branch',
      address: 'Addis Ababa, Ethiopia',
      phone: '+251 911 000 000'
    };
    const newStaff: Staff = {
      id: ownerId,
      uid: ownerUid,
      name: data.ownerName,
      email: (data.ownerEmail || '').toLowerCase().trim(),
      role: 'owner',
      tenantId,
      branchId,
      active: true
    };
    const catId1 = `cat-1-${Date.now()}`;
    const catId2 = `cat-2-${Date.now()}`;

    // Default categories
    const newCategories = [{
      id: catId1,
      tenantId,
      name: 'Specialties',
      orderNum: 1,
      icon: 'Utensils'
    }, {
      id: catId2,
      tenantId,
      name: 'Beverages',
      orderNum: 2,
      icon: 'Coffee'
    }];

    // Default menu items
    const newMenuItemsList = [{
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
    }, {
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
    }];
    setTenants(prev => [...prev, newTenant]);
    setBranches(prev => [...prev, newBranch]);
    setStaff(prev => {
        if (prev.some(s => s.id === ownerId)) {
          return prev.map(s => s.id === ownerId ? newStaff : s);
        }
        return [...prev, newStaff];
      });
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
    await syncToFirestore('businesses', tenantId, newTenant);
    await syncToFirestore('tenants', tenantId, newTenant);
    await syncToFirestore('branches', branchId, newBranch);
    await syncToFirestore('users', ownerId, newStaff);
    for (const cat of newCategories) {
      await syncToFirestore('categories', cat.id, cat);
    }
    for (const item of newMenuItemsList) {
      await syncToFirestore('menu_items', item.id, item);
    }

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
      branchId
    };
    setCurrentUser(loggedUser);
  };
  const signUpOwnerOnly = async (name: string, email: string) => {
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
      tenantId: '',
      // No business profile created yet!
      branchId: '',
      active: true
    };
    setStaff(prev => {
        if (prev.some(s => s.id === ownerId)) {
          return prev.map(s => s.id === ownerId ? newStaff : s);
        }
        return [...prev, newStaff];
      });
    addLog('Platform Owner Sign Up', `Owner signed up: ${name} (${cleanEmail}). Business profile pending creation.`);
    await syncToFirestore('users', ownerId, newStaff);
    const loggedUser = {
      id: ownerId,
      email: cleanEmail,
      role: 'owner' as const,
      name,
      tenantId: '',
      branchId: ''
    };
    setCurrentUser(loggedUser);
  };
  const registerUser = async (userParam: {
    uid: string;
    email: string;
  } | string, nameParam?: string, roleParam: 'customer' | 'owner' = 'owner', uidParam?: string) => {
    let email = '';
    let name = '';
    let role: 'customer' | 'owner' = 'owner';
    let uid = '';
    if (typeof userParam === 'string') {
      email = userParam;
      name = nameParam || '';
      role = roleParam;
      uid = uidParam || '';
    } else if (userParam && typeof userParam === 'object') {
      email = userParam.email || '';
      uid = userParam.uid || '';
      name = nameParam || '';
      role = roleParam;
    }
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail) throw new Error("Email address is required for registration.");
    const userUid = uid || `uid-${Date.now()}`;
    const createdAt = new Date().toISOString();
    if (role === 'customer') {
      const customerProfile = {
        id: userUid,
        uid: userUid,
        email: cleanEmail,
        name: name || cleanEmail.split('@')[0],
        phone: '',
        savedAddresses: [],
        savedFavorites: [],
        loyaltyPoints: 0,
        loyaltyHistory: [],
        role: 'customer' as const,
        createdAt,
        updatedAt: createdAt
      };
      try {
        const {
          getDB
        } = await import('../lib/firebase');
        const db = getDB();
        if (!db) {
          throw new Error("Firestore database instance (db) is null. Initialization failed.");
        }
        console.log("Starting Firestore batch write for customer signup...");
        const {
          doc,
          writeBatch
        } = await import('firebase/firestore');
        const batch = writeBatch(db);
        console.log(`Writing users/${userUid}`);
        batch.set(doc(db, 'users', userUid), customerProfile, {
          merge: true
        });
        console.log("Committing batch to Firestore...");
        await batch.commit();
        console.log("Batch commit successful.");
      } catch (err: any) {
        console.error("FATAL: Batch write failed for customer signup:", err);
        throw new Error(`Failed to create customer profile in database: ${err.message || err}`);
      }
      setCustomerProfiles(prev => ({
        ...prev,
        [cleanEmail]: customerProfile
      }));
      addLog('Customer Signup', `Customer registered: ${name} (${cleanEmail})`);
    } else if (role === 'owner') {
      const tenantId = `tenant-${userUid}`;
      const branchId = `branch-${userUid}`;
      const userProfile = {
        id: userUid,
        uid: userUid,
        email: cleanEmail,
        name: name || cleanEmail.split('@')[0],
        role: 'owner' as const,
        tenantId,
        branchId,
        createdAt,
        updatedAt: createdAt
      };
      const businessDoc = {
        id: tenantId,
        name: `${name || 'Restaurant'}'s Business`,
        ownerEmail: cleanEmail,
        ownerUid: userUid,
        currency: 'USD',
        currencySymbol: '$',
        timezone: 'UTC',
        subscriptionPlan: 'free',
        planStatus: 'active',
        taxPercent: 0,
        diningServiceTypes: ['dine_in', 'takeaway', 'delivery'],
        createdAt,
        updatedAt: createdAt
      };
      const membershipDoc = {
        id: `mem-${userUid}`,
        userId: userUid,
        userEmail: cleanEmail,
        tenantId,
        role: 'owner',
        status: 'active',
        createdAt
      };
      const roleDoc = {
        id: `role-${userUid}`,
        userId: userUid,
        tenantId,
        role: 'owner',
        title: 'Business Owner',
        createdAt
      };
      const permissionDoc = {
        id: `perm-${userUid}`,
        userId: userUid,
        tenantId,
        permissions: ['all', 'manage_business', 'manage_menu', 'manage_orders', 'manage_staff', 'manage_tables', 'manage_finances', 'view_reports'],
        createdAt
      };
      const branchDoc = {
        id: branchId,
        tenantId,
        ownerUid: userUid,
        name: 'Main Branch',
        isMain: true,
        createdAt
      };
      const staffDoc = {
        id: userUid,
        uid: userUid,
        ownerUid: userUid,
        tenantId,
        branchId,
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        role: 'owner' as const,
        active: true,
        createdAt
      };
      try {
        const {
          getDB
        } = await import('../lib/firebase');
        const db = getDB();
        if (!db) {
          throw new Error("Firestore database instance (db) is null. Initialization failed.");
        }
        console.log("Starting Firestore batch write for owner signup...");
        const {
          doc,
          writeBatch
        } = await import('firebase/firestore');
        const batch = writeBatch(db);
        console.log(`Writing users/${userUid}`);
        batch.set(doc(db, 'users', userUid), userProfile, {
          merge: true
        });
        console.log(`Writing businesses/${tenantId}`);
        batch.set(doc(db, 'businesses', tenantId), businessDoc, {
          merge: true
        });
        console.log(`Writing tenants/${tenantId}`);
        batch.set(doc(db, 'tenants', tenantId), businessDoc, {
          merge: true
        });
        console.log(`Writing memberships/${membershipDoc.id}`);
        batch.set(doc(db, 'memberships', membershipDoc.id), membershipDoc, {
          merge: true
        });
        console.log(`Writing roles/${roleDoc.id}`);
        batch.set(doc(db, 'roles', roleDoc.id), roleDoc, {
          merge: true
        });
        console.log(`Writing permissions/${permissionDoc.id}`);
        batch.set(doc(db, 'permissions', permissionDoc.id), permissionDoc, {
          merge: true
        });
        console.log(`Writing branches/${branchId}`);
        batch.set(doc(db, 'branches', branchId), branchDoc, {
          merge: true
        });
        console.log(`Writing staff/${userUid}`);
        batch.set(doc(db, 'staff', userUid), staffDoc, {
          merge: true
        });
        console.log("Committing batch to Firestore...");
        await batch.commit();
        console.log("Batch commit successful.");
      } catch (err: any) {
        console.error("FATAL: Batch write failed for owner signup:", err);
        throw new Error(`Failed to create business profile in database: ${err.message || err}`);
      }
      setTenants(prev => [...prev.filter(t => t.id !== tenantId), businessDoc as any]);
      setBranches(prev => [...prev.filter(b => b.id !== branchId), branchDoc as any]);
      setStaff(prev => [...prev.filter(s => s.id !== userUid), staffDoc as any]);
      addLog('Owner Signup', `Owner registered: ${name} (${cleanEmail}), Tenant: ${tenantId}`);
    }
  };
  const registerCustomer = async (name: string, email: string, phone: string) => {
    const cleanEmail = (email || '').toLowerCase().trim();
    const id = `cust-${Date.now()}`;
    const newProfile = {
      id,
      email: cleanEmail,
      name,
      phone,
      savedAddresses: [],
      savedFavorites: [],
      loyaltyPoints: 0,
      loyaltyHistory: []
    };
    setCustomerProfiles(prev => ({
      ...prev,
      [cleanEmail]: newProfile
    }));
    await syncToFirestore('users', id, newProfile);
    const loggedUser = {
      id,
      email: cleanEmail,
      role: 'customer' as const,
      name,
      tenantId: '',
      branchId: ''
    };
    setCurrentUser(loggedUser);
    addLog('Customer Signup', `Customer registered: ${name} (${cleanEmail})`);
  };

  // Sync to Firestore Helper (dynamic, safe imports)
  const syncToFirestore = async (collectionName: string, docId: string, data: any) => {
    try {
      const {
        getDB
      } = await import('../lib/firebase');
      const db = getDB();
      if (!db) throw new Error("Firestore DB instance is null");
      const {
        doc,
        setDoc
      } = await import('firebase/firestore');

      const cleanData = (obj: any): any => {
        if (obj === null || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return obj.map(cleanData);
        const cleaned: any = {};
        for (const key of Object.keys(obj)) {
          if (obj[key] !== undefined) {
            cleaned[key] = cleanData(obj[key]);
          }
        }
        return cleaned;
      };

      await setDoc(doc(db, collectionName, docId), cleanData(data), {
        merge: true
      });
    } catch (e: any) {
      console.error(`FATAL: Firestore sync failed for ${collectionName}/${docId}:`, e);
      throw e;
    }
  };
  
  const fetchOrderById = async (orderId: string): Promise<Order | null> => {
    try {
      const { getDB } = await import('../lib/firebase');
      const db = getDB();
      if (!db) return null;
      const { doc, getDoc } = await import('firebase/firestore');
      const snap = await getDoc(doc(db, 'orders', orderId));
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Order;
      }
      return null;
    } catch (err) {
      console.warn("fetchOrderById error:", err);
      return null;
    }
  };

  const deleteFromFirestore = async (collectionName: string, docId: string) => {
    try {
      const {
        getDB
      } = await import('../lib/firebase');
      const db = getDB();
      if (!db) throw new Error("Firestore DB instance is null");
      const {
        doc,
        deleteDoc
      } = await import('firebase/firestore');
      await deleteDoc(doc(db, collectionName, docId));
    } catch (e: any) {
      console.error(`FATAL: Firestore delete failed for ${collectionName}/${docId}:`, e);
      throw e;
    }
  };
  const updatePaymentMethodConfig = async (tenantId: string, configs: PaymentMethodConfig[]) => {
    setPaymentMethodsConfigs(prev => ({
      ...prev,
      [tenantId]: configs
    }));
    addLog('Update Payment Config', `Updated payment methods configurations for tenant ${tenantId}.`);
    await syncToFirestore('businesses', tenantId, {
      paymentMethods: configs
    });
  };
  const updateLoyaltyConfig = async (tenantId: string, config: LoyaltyConfig) => {
    setLoyaltyConfigs(prev => ({
      ...prev,
      [tenantId]: config
    }));
    addLog('Update Loyalty Config', `Updated loyalty program settings for tenant ${tenantId}.`);
    await syncToFirestore('businesses', tenantId, {
      loyaltyConfig: config
    });
  };
  const addMealSubscriptionPackage = async (plan: Omit<MealSubscriptionPackage, 'id'>) => {
    const id = `sub-plan-${Date.now()}`;
    const newPlan: MealSubscriptionPackage = {
      ...plan,
      id
    };
    setMealSubscriptionPackages(prev => {
      const list = prev[plan.tenantId] || [];
      return {
        ...prev,
        [plan.tenantId]: [...list, newPlan]
      };
    });
    addLog('Create Meal Subscription Plan', `Created meal subscription plan: ${plan.name}`);
    await syncToFirestore('meal_subscription_plans', id, newPlan);
  };
  const updateMealSubscriptionPackage = async (plan: MealSubscriptionPackage) => {
    setMealSubscriptionPackages(prev => {
      const list = prev[plan.tenantId] || [];
      return {
        ...prev,
        [plan.tenantId]: list.map(p => p.id === plan.id ? plan : p)
      };
    });
    addLog('Update Meal Subscription Plan', `Updated meal subscription plan: ${plan.name}`);
    await syncToFirestore('meal_subscription_plans', plan.id, plan);
  };
  const deleteMealSubscriptionPackage = (tenantId: string, planId: string) => {
    setMealSubscriptionPackages(prev => {
      const list = prev[tenantId] || [];
      return {
        ...prev,
        [tenantId]: list.filter(p => p.id !== planId)
      };
    });
    addLog('Delete Meal Subscription Plan', `Deleted meal subscription plan ID: ${planId}`);
    deleteFromFirestore('meal_subscription_plans', planId);
  };
  const subscribeToMealPlan = async (subData: Omit<CustomerMealSubscription, 'id'>) => {
    const id = `cust-sub-${Date.now()}`;
    const newSub: CustomerMealSubscription = {
      ...subData,
      id
    };
    setCustomerSubscriptions(prev => [...prev, newSub]);
    addLog('Meal Plan Subscription', `Customer subscribed to meal plan ID: ${subData.packageId}`);
    await syncToFirestore('customer_subscriptions', id, newSub);
  };
  const updateCustomerMealSubscription = (subId: string, updates: Partial<CustomerMealSubscription>) => {
    setCustomerSubscriptions(async prev => {
      const existing = prev.find(s => s.id === subId);
      if (!existing) return prev;
      const updated = {
        ...existing,
        ...updates
      };
      await syncToFirestore('customer_subscriptions', subId, updated);
      return prev.map(s => s.id === subId ? updated : s);
    });
  };
  const logMealService = async (subscriptionId: string) => {
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
    await syncToFirestore('customer_subscriptions', subscriptionId, updated);
  };
  const refundOrder = async (orderId: string, amount: number, reason: string, actor: string) => {
    const existing = orders.find(o => o.id === orderId);
    if (!existing) return;
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
    const updatedOrder: Order = {
      ...existing,
      status: 'refunded' as const,
      paymentStatus: 'refunded' as const,
      refundDetails,
      updatedAt: new Date().toISOString(),
      timeline: [...(existing.timeline || []), newEvent]
    };
    setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    addLog('Order Refunded', `Order ${orderId} refunded for amount: ${amount}. Reason: ${reason}`);
    await syncToFirestore('orders', orderId, updatedOrder);
  };
  const updateCustomerProfile = (email: string, profileData: Partial<CustomerProfile>) => {
    const current = customerProfiles[email] || {
      id: currentUser?.uid || `cust-${Date.now()}`,
      email,
      name: profileData.name || email.split('@')[0],
      phone: profileData.phone || '',
      savedAddresses: [],
      savedFavorites: [],
      loyaltyPoints: 0,
      loyaltyHistory: []
    };
    const updated = {
      ...current,
      ...profileData
    };
    setCustomerProfiles(prev => ({
      ...prev,
      [email]: updated
    }));
    syncToFirestore('users', updated.id, updated);
  };
  const addFavoriteItem = (email: string, menuItemId: string) => {
    const current = customerProfiles[email] || {
      id: currentUser?.uid || `cust-${Date.now()}`,
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
    setCustomerProfiles(prev => ({
      ...prev,
      [email]: updated
    }));
    syncToFirestore('users', updated.id, updated);
  };
  const removeFavoriteItem = (email: string, menuItemId: string) => {
    const current = customerProfiles[email];
    if (!current) return;
    const updated = {
      ...current,
      savedFavorites: current.savedFavorites.filter(id => id !== menuItemId)
    };
    setCustomerProfiles(prev => ({
      ...prev,
      [email]: updated
    }));
    syncToFirestore('users', updated.id, updated);
  };
  const addSavedAddress = (email: string, name: string, address: string) => {
    const current = customerProfiles[email] || {
      id: currentUser?.uid || `cust-${Date.now()}`,
      email,
      name: email.split('@')[0],
      phone: '',
      savedAddresses: [],
      savedFavorites: [],
      loyaltyPoints: 0,
      loyaltyHistory: []
    };
    const newAddress = {
      id: `addr-${Date.now()}`,
      name,
      address
    };
    const updated = {
      ...current,
      savedAddresses: [...current.savedAddresses, newAddress]
    };
    setCustomerProfiles(prev => ({
      ...prev,
      [email]: updated
    }));
    syncToFirestore('users', updated.id, updated);
  };
  const removeSavedAddress = (email: string, addressId: string) => {
    const current = customerProfiles[email];
    if (!current) return;
    const updated = {
      ...current,
      savedAddresses: current.savedAddresses.filter(a => a.id !== addressId)
    };
    setCustomerProfiles(prev => ({
      ...prev,
      [email]: updated
    }));
    syncToFirestore('users', updated.id, updated);
  };
  const updateTipStatus = async (orderId: string, status: 'pending' | 'delivered' | 'accepted') => {
    const existing = orders.find(o => o.id === orderId);
    if (!existing) return;
    const newEvent: TimelineEvent = {
      id: `ev-${Date.now()}`,
      time: new Date().toISOString(),
      label: status === 'delivered' ? 'Tip Delivered' : status === 'accepted' ? 'Tip Accepted by Staff' : 'Tip Logged',
      desc: status === 'delivered' ? 'Tip has been delivered to staff by Cashier' : 'Staff accepted the tip payout',
      actor: status === 'delivered' ? 'Cashier' : 'Waiter'
    };
    const updated: Order = {
      ...existing,
      tipStatus: status,
      updatedAt: new Date().toISOString(),
      timeline: [...(existing.timeline || []), newEvent]
    };
    setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    addLog('Update Tip Status', `Order ${orderId} tip status updated to: ${status}`);
    await syncToFirestore('orders', orderId, updated);
  };

  // Final Features Actions
  const addReservation = async (reservation: Omit<Reservation, 'id' | 'createdAt' | 'timeline' | 'status'>) => {
    const id = `res-${Date.now()}`;
    const newReservation: Reservation = {
      ...reservation,
      id,
      status: 'pending',
      timeline: [{
        id: `te-${Date.now()}`,
        time: new Date().toISOString(),
        label: 'Created',
        desc: 'Reservation requested'
      }],
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
        timeline: [...res.timeline, {
          id: `te-${Date.now()}`,
          time: new Date().toISOString(),
          label: `Status updated`,
          desc: `Reservation ${status}`
        }]
      };
    }));
    try {
      const res = reservations.find(r => r.id === id);
      if (res) {
        const updated = {
          ...res,
          status,
          tableId: tableId || res.tableId,
          timeline: [...res.timeline, {
            id: `te-${Date.now()}`,
            time: new Date().toISOString(),
            label: `Status updated`,
            desc: `Reservation ${status}`
          }]
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
    const newIngredient = {
      ...ingredient,
      id
    };
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
    const newMovement: StockMovement = {
      ...movement,
      id,
      date: new Date().toISOString()
    };
    setStockMovements(prev => [...prev, newMovement]);

    // Update ingredient stock
    const targetIng = ingredients.find(ing => ing.id === movement.ingredientId);
    if (targetIng) {
      let newStock = targetIng.stockQuantity;
      if (movement.type === 'in') newStock += movement.quantity;
      else if (movement.type === 'out' || movement.type === 'waste') newStock -= movement.quantity;
      else if (movement.type === 'adjustment') newStock = movement.quantity;
      const updatedIngredient = {
        ...targetIng,
        stockQuantity: newStock
      };
      setIngredients(prev => prev.map(ing => ing.id === movement.ingredientId ? updatedIngredient : ing));
      await syncToFirestore('ingredients', targetIng.id, updatedIngredient);
    }
    try {
      await syncToFirestore('stock_movements', id, newMovement);
      addLog('Stock Movement Processed', `Recorded ${movement.type} movement of ${movement.quantity} units for ingredient ID ${movement.ingredientId}.`);
    } catch (err: any) {
      addLog('Stock Movement Error', `Failed to log stock movement: ${err.message || err}`);
    }
  };
  const markNotificationRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? {
      ...n,
      read: true
    } : n));
    try {
      const notif = notifications.find(n => n.id === id);
      if (notif) {
        const updated = {
          ...notif,
          read: true
        };
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
    const newNotif = {
      ...notification,
      id,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
    try {
      await syncToFirestore('notifications', id, newNotif);
    } catch (err: any) {
      console.error("Failed to add notification:", err);
    }
  };
  const installExtension = async (tenantId: string, extensionId: string) => {
    const id = `${tenantId}_${extensionId}`;
    const newInstalled = {
      id: extensionId,
      tenantId,
      installedAt: new Date().toISOString(),
      status: 'active' as const
    };
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
  const updateLandingPageConfig = async (settings: Partial<LandingPageConfig>) => {
    const updated = {
      ...landingPageConfig,
      ...settings
    };
    setLandingPageConfig(updated);
    try {
      await syncToFirestore('landing_page_settings', 'global', updated);
      addLog('Update Landing Page Settings Success', `Successfully updated landing page configuration.`);
    } catch (err: any) {
      console.error("Update Landing Page Settings Error:", err);
      addLog('Update Landing Page Settings Error', `Failed to update landing page settings: ${err.message || err}`);
    }
  };
  const updateGlobalSettings = async (settings: Partial<GlobalSettings>) => {
    const updated = {
      ...globalSettings,
      ...settings
    };
    setGlobalSettings(updated);
    try {
      await syncToFirestore('system_settings', 'global', updated);
      addLog('Update Global Settings Success', `Successfully updated system-wide configuration.`);
    } catch (err: any) {
      addLog('Update Global Settings Error', `Failed to update global settings: ${err.message || err}`);
    }
  };
  return <AppContext.Provider value={{
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
    registerUser,
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
    updateStation,
    deleteStation,
    placeOrder,
    updateOrderStatus,
    assignDelivery,
    acceptDeliveryFee,
    updateOrderItemStatus,
    reportOrderItemIssue,
    resolveOrderItemIssue,
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
    subscriptionRequests,
    superAdminPaymentInfo,
    setSuperAdminPaymentInfo,
    requestSubscriptionUpgrade,
    approveSubscriptionRequest,
    rejectSubscriptionRequest,
    requestTenantUpgrade,
    updateTenantCurrency,
    updateTenantType,
    updateTenantProfile,
    approveTenantStatus,
    rejectTenantStatus,
    ads,
    addAd,
    toggleAdStatus,
    deleteAd,
    pricingPlans,
    updatePlanPrice,
    updatePlanTabs,
    registerTenant,
    signUpOwnerOnly,
    registerCustomer,
    currentView,
    setCurrentView,
    addLog,
    paymentMethodsConfigs,
    updatePaymentMethodConfig,
    loyaltyConfigs,
    updateLoyaltyConfig,
    mealSubscriptionPlans,
    customerSubscriptions,
    addMealSubscriptionPackage,
    updateMealSubscriptionPackage,
    deleteMealSubscriptionPackage,
    subscribeToMealPlan,
    updateCustomerMealSubscription,
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
    updateGlobalSettings,
    landingPageConfig,
    updateLandingPageConfig,
    fetchOrderById,
    syncToFirestore,
    deleteFromFirestore
  }}>
      {children}
    </AppContext.Provider>;
}
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}