import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Tenant, Branch, PreparationStation, Category, MenuItem, Table, Order, Staff, SystemLog, UserRole, OrderStatus, OrderItem
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
  
  // Table Actions
  addTable: (table: Omit<Table, 'id' | 'qrUrl'>) => void;
  updateTableStatus: (tableId: string, status: Table['status']) => void;
  
  // Station Actions
  addStation: (station: Omit<PreparationStation, 'id'>) => void;
  
  // Order Actions
  placeOrder: (order: Omit<Order, 'id' | 'orderNum' | 'createdAt' | 'status' | 'paymentStatus' | 'subtotal' | 'tax' | 'serviceCharge' | 'total'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderItemStatus: (orderId: string, itemId: string, status: OrderItem['status']) => void;
  processPayment: (orderId: string, paymentMethod: Order['paymentMethod'], discountPercentage: number, redeemPoints?: number) => void;
  rateAndFeedback: (orderId: string, rating: number, feedback: string) => void;
  cancelOrder: (orderId: string, reason: string) => void;
  
  // Staff Actions
  addStaffMember: (member: Omit<Staff, 'id' | 'active'>) => void;
  toggleStaffStatus: (staffId: string) => void;
  
  // Super Admin Actions
  toggleTenantStatus: (tenantId: string) => void;
  updateTenantPlan: (tenantId: string, plan: Tenant['subscriptionPlan']) => void;
  
  // General helper
  addLog: (action: string, details: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
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
      id: `log-${Date.now()}`,
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
    const cleanEmail = email.toLowerCase();
    if (cleanEmail === 'admin@menuflow.com' || cleanEmail === 'naolnigatu2025@gmail.com') {
      const name = cleanEmail === 'naolnigatu2025@gmail.com' ? 'Naol Nigatu (Platform Admin)' : 'Super Administrator';
      const user = { email: cleanEmail, role: 'super_admin' as const, name };
      setCurrentUser(user);
      addLog('Login', `${name} logged in.`);
      return true;
    }

    // 2. Check Staff list
    const foundStaff = staff.find(s => s.email.toLowerCase() === email.toLowerCase() && s.active);
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
    const foundTenant = tenants.find(t => t.ownerEmail.toLowerCase() === email.toLowerCase());
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
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now()}`
    };
    setCategories(prev => {
      const list = prev[catData.tenantId] || [];
      return {
        ...prev,
        [catData.tenantId]: [...list, newCat].sort((a, b) => a.orderNum - b.orderNum)
      };
    });
    addLog('Create Category', `Created menu category: ${catData.name}`);
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
  };

  // Menu Items
  const addMenuItem = (itemData: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...itemData,
      id: `item-${Date.now()}`
    };
    setMenuItems(prev => {
      const list = prev[itemData.tenantId] || [];
      return {
        ...prev,
        [itemData.tenantId]: [...list, newItem]
      };
    });
    addLog('Create Menu Item', `Created menu item: ${itemData.name}`);
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
  };

  const updateTableStatus = (tableId: string, status: Table['status']) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status } : t));
  };

  // Stations
  const addStation = (stationData: Omit<PreparationStation, 'id'>) => {
    const newStation: PreparationStation = {
      ...stationData,
      id: `st-${Date.now()}`
    };
    setStations(prev => [...prev, newStation]);
    addLog('Create Station', `Created preparation station: ${stationData.name}`);
  };

  // Orders
  const placeOrder = (orderData: Omit<Order, 'id' | 'orderNum' | 'createdAt' | 'status' | 'paymentStatus' | 'subtotal' | 'tax' | 'serviceCharge' | 'total'>) => {
    const tenant = tenants.find(t => t.id === orderData.tenantId) || mockTenants[0];
    
    // Calculate financial subtotals
    let subtotal = 0;
    orderData.items.forEach(it => {
      let itemCost = it.price;
      it.selectedModifiers.forEach(m => {
        itemCost += m.price;
      });
      subtotal += itemCost * it.quantity;
    });

    const taxAmount = parseFloat(((subtotal * tenant.baseTaxRate) / 100).toFixed(2));
    const serviceChargeAmount = parseFloat(((subtotal * tenant.serviceCharge) / 100).toFixed(2));
    const totalAmount = parseFloat((subtotal + taxAmount + serviceChargeAmount - orderData.discount).toFixed(2));

    const hrId = `MF-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNum: hrId,
      status: 'submitted',
      paymentStatus: 'unpaid',
      subtotal,
      tax: taxAmount,
      serviceCharge: serviceChargeAmount,
      total: totalAmount,
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);

    // Update table status if dine-in
    if (orderData.type === 'dine_in' && orderData.tableId) {
      updateTableStatus(orderData.tableId, 'waiting');
    }

    addLog('Place Order', `New order ${hrId} placed. Total: ${tenant.currencySymbol} ${totalAmount}`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      
      // Update items status recursively for quick overrides
      let items = [...o.items];
      if (status === 'cooking') {
        items = items.map(it => it.status === 'received' ? { ...it, status: 'cooking' as const } : it);
      } else if (status === 'ready') {
        items = items.map(it => it.status === 'received' || it.status === 'cooking' ? { ...it, status: 'ready' as const } : it);
      } else if (status === 'delivered') {
        items = items.map(it => ({ ...it, status: 'delivered' as const }));
      }

      return { ...o, status, items };
    }));

    // Trigger table update
    const ord = orders.find(o => o.id === orderId);
    if (ord && ord.tableId && ord.type === 'dine_in') {
      if (status === 'cooking' || status === 'ready') {
        updateTableStatus(ord.tableId, 'waiting');
      } else if (status === 'delivered') {
        updateTableStatus(ord.tableId, 'eating');
      } else if (status === 'completed') {
        updateTableStatus(ord.tableId, 'empty');
      }
    }

    addLog('Update Order Status', `Order ID ${orderId} status set to: ${status}`);
  };

  const updateOrderItemStatus = (orderId: string, itemId: string, itemStatus: OrderItem['status']) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;

      const updatedItems = o.items.map(it => it.id === itemId ? { ...it, status: itemStatus } : it);
      
      // Compute overarching order status based on item states
      let overarchingStatus: OrderStatus = o.status;
      const allDelivered = updatedItems.every(it => it.status === 'delivered');
      const anyDelivered = updatedItems.some(it => it.status === 'delivered');
      const allReady = updatedItems.every(it => it.status === 'ready' || it.status === 'delivered');
      const anyCooking = updatedItems.some(it => it.status === 'cooking' || it.status === 'ready');

      if (allDelivered) {
        overarchingStatus = 'delivered';
      } else if (allReady) {
        overarchingStatus = 'ready';
      } else if (anyCooking) {
        overarchingStatus = 'cooking';
      }

      // Sync table state automatically
      if (o.tableId && o.type === 'dine_in') {
        if (allDelivered) {
          updateTableStatus(o.tableId, 'eating');
        } else if (anyDelivered || allReady || anyCooking) {
          updateTableStatus(o.tableId, 'waiting');
        }
      }

      return {
        ...o,
        items: updatedItems,
        status: overarchingStatus
      };
    }));
  };

  const processPayment = (orderId: string, paymentMethod: Order['paymentMethod'], discountPercentage: number, redeemPoints = 0) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;

      const tenant = tenants.find(t => t.id === o.tenantId) || mockTenants[0];
      const discountVal = parseFloat(((o.subtotal * discountPercentage) / 100).toFixed(2));
      const pointsDiscount = redeemPoints * tenant.loyaltyRedeemValue;
      const finalDiscount = discountVal + pointsDiscount;
      const taxAmount = parseFloat(((o.subtotal * tenant.baseTaxRate) / 100).toFixed(2));
      const serviceChargeAmount = parseFloat(((o.subtotal * tenant.serviceCharge) / 100).toFixed(2));
      const finalTotal = parseFloat((o.subtotal + taxAmount + serviceChargeAmount - finalDiscount).toFixed(2));

      // Calculate loyalty points earned
      const loyaltyEarned = Math.floor(finalTotal * tenant.loyaltyPointsRatio);

      // Clean table status if dine_in
      if (o.tableId && o.type === 'dine_in') {
        updateTableStatus(o.tableId, 'dirty');
      }

      return {
        ...o,
        status: 'completed' as const,
        paymentStatus: 'paid' as const,
        paymentMethod,
        discount: finalDiscount,
        total: finalTotal,
        loyaltyPointsEarned: loyaltyEarned,
        loyaltyPointsRedeemed: redeemPoints
      };
    }));

    addLog('Record Payment', `Order ${orderId} fully paid via ${paymentMethod}.`);
  };

  const rateAndFeedback = (orderId: string, rating: number, feedback: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, rating, feedback } : o));
    addLog('Customer Review', `Received ${rating}-star rating for order: ${orderId}`);
  };

  const cancelOrder = (orderId: string, reason: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      if (o.tableId && o.type === 'dine_in') {
        updateTableStatus(o.tableId, 'empty');
      }
      return { ...o, status: 'cancelled' as const };
    }));
    addLog('Cancel Order', `Order ${orderId} was cancelled. Reason: ${reason}`);
  };

  // Staff
  const addStaffMember = (memberData: Omit<Staff, 'id' | 'active'>) => {
    const newStaff: Staff = {
      ...memberData,
      id: `s-${Date.now()}`,
      active: true
    };
    setStaff(prev => [...prev, newStaff]);
    addLog('Invite Staff', `Invited employee ${memberData.name} as ${memberData.role}.`);
  };

  const toggleStaffStatus = (staffId: string) => {
    setStaff(prev => prev.map(s => {
      if (s.id !== staffId) return s;
      const newState = !s.active;
      addLog('Toggle Staff Status', `Staff member ${s.name} ${newState ? 'activated' : 'deactivated'}.`);
      return { ...s, active: newState };
    }));
  };

  // Super Admin
  const toggleTenantStatus = (tenantId: string) => {
    setTenants(prev => prev.map(t => {
      if (t.id !== tenantId) return t;
      const nextStatus = t.subscriptionStatus === 'active' ? 'suspended' : 'active';
      addLog('Platform Admin Override', `Tenant ${t.name} subscription status updated to: ${nextStatus}`);
      return { ...t, subscriptionStatus: nextStatus };
    }));
  };

  const updateTenantPlan = (tenantId: string, plan: Tenant['subscriptionPlan']) => {
    setTenants(prev => prev.map(t => {
      if (t.id !== tenantId) return t;
      addLog('Platform Admin Override', `Tenant ${t.name} subscription plan updated to: ${plan}`);
      return { ...t, subscriptionPlan: plan };
    }));
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
      addTable,
      updateTableStatus,
      addStation,
      placeOrder,
      updateOrderStatus,
      updateOrderItemStatus,
      processPayment,
      rateAndFeedback,
      cancelOrder,
      addStaffMember,
      toggleStaffStatus,
      toggleTenantStatus,
      updateTenantPlan,
      addLog
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
