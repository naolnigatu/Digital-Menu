import React, { createContext, useContext, useState, useEffect } from 'react';
import { Business, Membership, DinexBranch, BusinessSettings, BusinessType, SubscriptionPlan, CustomRole, Tenant, Branch } from '../types';
import { useApp } from './AppContext';
import { Lock, AlertTriangle } from 'lucide-react';

// ==========================================
// 1. CONTEXT DECLARATIONS & HOOKS
// ==========================================

// Auth Context
interface AuthContextType {
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
  userRole: string | null;
  isAuthenticated: boolean;
  loginDinex: (email: string) => boolean;
  logoutDinex: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useDinexAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useDinexAuth must be used within AuthProvider');
  return context;
};

// Business Context
interface BusinessContextType {
  businesses: Business[];
  activeBusiness: Business | null;
  myMemberships: Membership[];
  activeMembership: Membership | null;
  setActiveBusinessId: (id: string) => void;
  createBusiness: (data: {
    name: string;
    businessType: BusinessType;
    country: string;
    city: string;
    phone: string;
    email: string;
    currency: string;
    language: string;
  }) => Business;
  updateBusinessStatus: (id: string, status: Business['status']) => void;
}
const BusinessContext = createContext<BusinessContextType | undefined>(undefined);
export const useDinexBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) throw new Error('useDinexBusiness must be used within BusinessProvider');
  return context;
};

// Branch Context
interface BranchContextType {
  branches: DinexBranch[];
  activeBranch: DinexBranch | null;
  setActiveBranchId: (id: string | null) => void;
  createBranch: (name: string, location: string, phone: string) => DinexBranch;
  updateBranch: (id: string, name: string, location: string, phone: string) => void;
  deleteBranch: (id: string) => void;
  updateBranchStatus: (id: string, status: DinexBranch['status']) => void;
}
const BranchContext = createContext<BranchContextType | undefined>(undefined);
export const useDinexBranch = () => {
  const context = useContext(BranchContext);
  if (!context) throw new Error('useDinexBranch must be used within BranchProvider');
  return context;
};

// Settings Context (for Business Settings CRUD)
interface SettingsContextType {
  settings: Record<string, BusinessSettings>; // businessId -> settings
  activeSettings: BusinessSettings | null;
  updateSettings: (businessId: string, newSettings: BusinessSettings) => void;
}
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);
export const useDinexSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useDinexSettings must be used within SettingsProvider');
  return context;
};

// Permission Context
interface PermissionContextType {
  permissions: string[];
  can: (permission: string) => boolean;
  customRoles: CustomRole[];
  addCustomRole: (name: string, permissions: string[]) => void;
  updateCustomRole: (roleId: string, name: string, permissions: string[]) => void;
  deleteCustomRole: (roleId: string) => void;
}
const PermissionContext = createContext<PermissionContextType | undefined>(undefined);
export const useDinexPermission = () => {
  const context = useContext(PermissionContext);
  if (!context) throw new Error('useDinexPermission must be used within PermissionProvider');
  return context;
};

// Feature Context
interface FeatureContextType {
  isFeatureEnabled: (featureName: string) => boolean;
}
const FeatureContext = createContext<FeatureContextType | undefined>(undefined);
export const useDinexFeature = () => {
  const context = useContext(FeatureContext);
  if (!context) throw new Error('useDinexFeature must be used within FeatureProvider');
  return context;
};

// ==========================================
// 2. SEED / INITIALIZATION MOCK DATA
// ==========================================

const DEFAULT_MEMBERSHIPS: Membership[] = [
  // Aisha
  {
    userId: 'u-aisha',
    businessId: 'biz-01',
    role: 'Owner',
    branchIds: ['br-01', 'br-02'],
    permissions: ['business.edit', 'menu.create', 'orders.manage', 'payments.verify', 'staff.manage', 'reports.view'],
    status: 'active',
    createdAt: '2026-01-15T08:00:00Z',
  },
  // Carlos
  {
    userId: 'u-carlos',
    businessId: 'biz-02',
    role: 'Owner',
    branchIds: ['br-03'],
    permissions: ['business.edit', 'menu.create', 'orders.manage', 'payments.verify', 'staff.manage', 'reports.view'],
    status: 'active',
    createdAt: '2026-03-10T09:30:00Z',
  },
  // Yohannes (Kitchen) at Aisha's Traditional Kitchen
  {
    userId: 'u-yohannes',
    businessId: 'biz-01',
    role: 'Kitchen',
    branchIds: ['br-01'],
    permissions: ['orders.manage'],
    status: 'active',
    createdAt: '2026-01-16T12:00:00Z',
  },
  // Fatima (Waiter) at Aisha's Traditional Kitchen
  {
    userId: 'u-fatima',
    businessId: 'biz-01',
    role: 'Waiter',
    branchIds: ['br-01'],
    permissions: ['orders.manage'],
    status: 'active',
    createdAt: '2026-01-16T12:00:00Z',
  },
  // Kebron (Cashier) at Aisha's Traditional Kitchen
  {
    userId: 'u-kebron',
    businessId: 'biz-01',
    role: 'Cashier',
    branchIds: ['br-01'],
    permissions: ['orders.manage', 'payments.verify'],
    status: 'active',
    createdAt: '2026-01-16T12:00:00Z',
  }
];

const DEFAULT_BUSINESSES: Business[] = [
  {
    id: 'biz-01',
    name: "Aisha's Traditional Kitchen",
    businessType: 'Ethiopian Restaurant',
    logo: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=150&auto=format&fit=crop&q=80',
    country: 'Ethiopia',
    city: 'Addis Ababa',
    phone: '+251 11 662 4589',
    email: 'aisha@menuflow.com',
    currency: 'ETB',
    language: 'am',
    ownerId: 'u-aisha',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z',
    status: 'active',
  },
  {
    id: 'biz-02',
    name: "Carlos's Specialty Espresso",
    businessType: 'Coffee House',
    logo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=150&auto=format&fit=crop&q=80',
    country: 'Kenya',
    city: 'Nairobi',
    phone: '+254 20 444 1234',
    email: 'carlos@menuflow.com',
    currency: 'USD',
    language: 'en',
    ownerId: 'u-carlos',
    createdAt: '2026-03-10T09:30:00Z',
    updatedAt: '2026-03-10T09:30:00Z',
    status: 'active',
  },
];

const DEFAULT_BRANCHES: DinexBranch[] = [
  {
    id: 'br-01',
    businessId: 'biz-01',
    name: 'Bole Road Branch',
    location: 'Cameroon Street, Bole, Addis Ababa, Ethiopia',
    phone: '+251 11 662 4589',
    status: 'active',
    createdAt: '2026-01-15T08:05:00Z',
  },
  {
    id: 'br-02',
    businessId: 'biz-01',
    name: 'Sarbet Branch',
    location: 'Pushkin Square, Sarbet, Addis Ababa, Ethiopia',
    phone: '+251 11 371 8944',
    status: 'active',
    createdAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'br-03',
    businessId: 'biz-02',
    name: 'Westlands Roastery',
    location: 'Woodvale Grove, Westlands, Nairobi, Kenya',
    phone: '+254 20 444 1234',
    status: 'active',
    createdAt: '2026-03-10T09:35:00Z',
  },
];

const DEFAULT_SETTINGS: Record<string, BusinessSettings> = {
  'biz-01': {
    orderingEnabled: true,
    tableManagementEnabled: true,
    reservationEnabled: false,
    loyaltyEnabled: true,
    tipsEnabled: true,
    customerAccountsEnabled: true,
    kitchenEnabled: true,
    takeawayEnabled: true,
    deliveryEnabled: false,
    deliveryApprovalMode: 'manual',
    predefinedDeliveryFee: 150,
    enabledDiningServiceTypes: ['dine_in', 'takeaway', 'delivery', 'drive_through', 'pickup', 'meal_subscription'],
    subscriptionDurations: [7, 14, 30],
  },
  'biz-02': {
    orderingEnabled: true,
    tableManagementEnabled: false,
    reservationEnabled: true,
    loyaltyEnabled: true,
    tipsEnabled: false,
    customerAccountsEnabled: true,
    kitchenEnabled: true,
    takeawayEnabled: true,
    deliveryEnabled: true,
    deliveryApprovalMode: 'automatic',
    predefinedDeliveryFee: 120,
    enabledDiningServiceTypes: ['dine_in', 'takeaway', 'delivery', 'drive_through', 'pickup', 'meal_subscription'],
    subscriptionDurations: [7, 14, 30],
  },
};

// ==========================================
// 3. PROVIDERS IMPLEMENTATION
// ==========================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, login, logout } = useApp();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      // Map email to static user IDs for mock parity
      if (currentUser.email === 'aisha@menuflow.com') setUserId('u-aisha');
      else if (currentUser.email === 'carlos@menuflow.com') setUserId('u-carlos');
      else if (currentUser.email === 'yohannes@menuflow.com') setUserId('u-yohannes');
      else if (currentUser.email === 'fatima@menuflow.com') setUserId('u-fatima');
      else if (currentUser.email === 'cashier@menuflow.com') setUserId('u-kebron');
      else if (currentUser.email === 'naolnigatu2025@gmail.com' ) setUserId('u-admin');
      else setUserId(`u-${currentUser.email.split('@')[0]}`);
    } else {
      setUserId(null);
    }
  }, [currentUser]);

  const loginDinex = (email: string): boolean => {
    return login(email);
  };

  const logoutDinex = () => {
    logout();
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        userEmail: currentUser?.email || null,
        userName: currentUser?.name || null,
        userRole: currentUser?.role || null,
        isAuthenticated: !!currentUser,
        loginDinex,
        logoutDinex,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const { userId, userRole, userEmail } = useDinexAuth();
  const { activeTenantId, setActiveTenantId, tenants, syncToFirestore, currentUser } = useApp();

  // Single source of truth: Map tenants from AppContext (which syncs directly with Firestore)
  const businesses: Business[] = tenants.map((tenant) => ({
    id: tenant.id,
    name: tenant.name,
    businessType: (tenant.businessType as BusinessType) || 'Ethiopian Restaurant',
    logo: tenant.logoUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=150&auto=format&fit=crop&q=80',
    country: 'Ethiopia',
    city: 'Addis Ababa',
    phone: '+251 911 000 000',
    email: tenant.ownerEmail,
    currency: tenant.currency || 'ETB',
    language: 'am',
    ownerId: tenant.ownerEmail === 'naolnigatu2025@gmail.com' ? 'u-admin' : `u-${(tenant.ownerEmail || 'owner').split('@')[0]}`,
    createdAt: tenant.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: tenant.subscriptionStatus === 'active' ? 'active' : tenant.subscriptionStatus === 'suspended' ? 'suspended' : tenant.subscriptionStatus === 'rejected' ? 'rejected' : 'pending_approval',
    subscriptionPlan: tenant.subscriptionPlan || 'free',
  }));

  const myMemberships: Membership[] = businesses.map(b => ({
    userId: userId || 'u-user',
    businessId: b.id,
    role: userRole || 'Owner',
    branchIds: [],
    permissions: ['business.edit', 'menu.create', 'orders.manage', 'payments.verify', 'staff.manage', 'reports.view'],
    status: 'active',
    createdAt: b.createdAt
  }));

  const myBusinesses = (userRole === 'super_admin' || currentUser?.role === 'super_admin')
    ? businesses
    : (userRole === 'owner' || userRole === 'business_owner' || currentUser?.role === 'business_owner' || currentUser?.role === 'owner')
    ? businesses.filter((b) => {
        const isOwner = (b.email && userEmail && b.email.toLowerCase() === userEmail.toLowerCase()) ||
                        (b.email && currentUser?.email && b.email.toLowerCase() === currentUser.email.toLowerCase()) ||
                        b.ownerId === userId ||
                        (currentUser?.id && (b as any).ownerUid === currentUser.id) ||
                        b.id === currentUser?.tenantId ||
                        myMemberships.some(m => m.businessId === b.id);
        return isOwner;
      })
    : businesses.filter((b) => b.status !== 'suspended' && b.status !== 'rejected');

  const activeBusiness = myBusinesses.find((b) => b.id === activeTenantId) || myBusinesses[0] || null;

  const setActiveBusinessId = (id: string) => {
    setActiveTenantId(id);
  };

  const activeMembership = myMemberships.find(
    (m) => m.businessId === (activeBusiness?.id || '')
  ) || null;

  const createBusiness = (data: {
    name: string;
    businessType: BusinessType;
    country: string;
    city: string;
    phone: string;
    email: string;
    currency: string;
    language: string;
  }): Business => {
    const newId = `t-${Date.now()}`;
    const ownerEmail = (data.email || currentUser?.email || '').toLowerCase().trim();

    const newTenant: Tenant & { tenantId?: string; ownerUid?: string } = {
      id: newId,
      tenantId: newId,
      name: data.name,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      businessType: data.businessType,
      description: `Welcome to ${data.name}!`,
      currency: data.currency || 'ETB',
      currencySymbol: data.currency === 'USD' ? '$' : 'Br',
      baseTaxRate: 15,
      serviceCharge: 0,
      subscriptionPlan: 'free',
      subscriptionStatus: 'active',
      ownerEmail,
      ownerUid: currentUser?.id,
      createdAt: new Date().toISOString(),
      loyaltyPointsRatio: 0.05,
      loyaltyMinRedeemPoints: 10,
      loyaltyRedeemValue: 1,
    };

    const newBiz: Business & { tenantId?: string; ownerUid?: string } = {
      id: newId,
      tenantId: newId,
      name: data.name,
      businessType: data.businessType,
      country: data.country,
      city: data.city,
      phone: data.phone,
      email: data.email,
      currency: data.currency,
      language: data.language,
      ownerId: ownerEmail === 'naolnigatu2025@gmail.com' ? 'u-admin' : `u-${ownerEmail.split('@')[0]}`,
      ownerUid: currentUser?.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      subscriptionPlan: 'free',
    };

    // Write directly to Firestore so all clients get real-time update
    syncToFirestore('tenants', newId, newTenant);
    syncToFirestore('businesses', newId, newBiz);

    // Set as active tenant
    setActiveTenantId(newId);

    return newBiz;
  };

  const updateBusinessStatus = (id: string, status: Business['status']) => {
    const existing = tenants.find(t => t.id === id);
    if (existing) {
      const updatedTenant: Tenant = {
        ...existing,
        subscriptionStatus: status === 'active' ? 'active' : status === 'suspended' ? 'suspended' : status === 'rejected' ? 'rejected' : 'pending_approval'
      };
      syncToFirestore('tenants', id, updatedTenant);
      syncToFirestore('businesses', id, updatedTenant);
    }
  };

  return (
    <BusinessContext.Provider
      value={{
        businesses: myBusinesses,
        activeBusiness,
        myMemberships,
        activeMembership,
        setActiveBusinessId,
        createBusiness,
        updateBusinessStatus,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function BranchProvider({ children }: { children: React.ReactNode }) {
  const { activeBusiness } = useDinexBusiness();
  const { branches: appBranches, activeBranchId, setActiveBranchId, syncToFirestore, deleteFromFirestore, activeTenantId } = useApp();

  const branches: DinexBranch[] = appBranches.map(b => ({
    id: b.id,
    businessId: b.tenantId || activeTenantId,
    name: b.name,
    location: b.address || 'Default Location',
    phone: b.phone || '',
    status: 'active',
    createdAt: new Date().toISOString()
  }));

  const activeBranch = branches.find(b => b.id === activeBranchId) || branches[0] || null;

  const createBranch = (name: string, location: string, phone: string): DinexBranch => {
    const targetTenantId = activeBusiness?.id || activeTenantId;
    const newId = `b-${Date.now()}`;
    const newBranch: Branch = {
      id: newId,
      tenantId: targetTenantId,
      name,
      address: location,
      phone
    };
    const newDinexBranch: DinexBranch = {
      id: newId,
      businessId: targetTenantId,
      name,
      location,
      phone,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    syncToFirestore('branches', newId, newBranch);
    setActiveBranchId(newId);
    return newDinexBranch;
  };

  const updateBranch = (id: string, name: string, location: string, phone: string) => {
    const found = appBranches.find(b => b.id === id);
    if (found) {
      syncToFirestore('branches', id, { ...found, name, address: location, phone });
    }
  };

  const deleteBranch = (id: string) => {
    if (activeBranchId === id) {
      setActiveBranchId(null);
    }
    deleteFromFirestore('branches', id);
  };

  const updateBranchStatus = (id: string, status: DinexBranch['status']) => {
    const found = appBranches.find(b => b.id === id);
    if (found) {
      syncToFirestore('branches', id, { ...found, status });
    }
  };

  return (
    <BranchContext.Provider
      value={{
        branches,
        activeBranch,
        setActiveBranchId,
        createBranch,
        updateBranch,
        deleteBranch,
        updateBranchStatus,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { activeBusiness } = useDinexBusiness();
  const [settings, setSettings] = useState<Record<string, BusinessSettings>>(() => {
    const local = localStorage.getItem('dinex_settings');
    if (local) {
      const parsed = JSON.parse(local);
      // Ensure all business settings have the new properties
      Object.keys(parsed).forEach(bizId => {
        if (!parsed[bizId].enabledDiningServiceTypes) {
          parsed[bizId].enabledDiningServiceTypes = ['dine_in', 'takeaway', 'delivery', 'drive_through', 'pickup', 'meal_subscription'];
        }
        if (!parsed[bizId].subscriptionDurations) {
          parsed[bizId].subscriptionDurations = [7, 14, 30];
        }
      });
      return parsed;
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('dinex_settings', JSON.stringify(settings));
  }, [settings]);

  const activeSettings = activeBusiness ? (settings[activeBusiness.id] || {
    orderingEnabled: true,
    tableManagementEnabled: true,
    reservationEnabled: false,
    loyaltyEnabled: false,
    tipsEnabled: true,
    customerAccountsEnabled: true,
    kitchenEnabled: true,
    takeawayEnabled: true,
    deliveryEnabled: true,
    deliveryApprovalMode: 'manual',
    predefinedDeliveryFee: 150,
    enabledDiningServiceTypes: ['dine_in', 'takeaway', 'delivery', 'drive_through', 'pickup', 'meal_subscription'],
    subscriptionDurations: [7, 14, 30],
  }) : null;

  const updateSettings = (businessId: string, newSettings: BusinessSettings) => {
    setSettings((prev) => ({
      ...prev,
      [businessId]: newSettings,
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, activeSettings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const { activeBusiness, activeMembership } = useDinexBusiness();
  const { userRole, userId, userEmail } = useDinexAuth();
  const { staff } = useApp();

  const [customRoles, setCustomRoles] = useState<CustomRole[]>(() => {
    const local = localStorage.getItem('dinex_custom_roles');
    return local ? JSON.parse(local) : [];
  });

  useEffect(() => {
    localStorage.setItem('dinex_custom_roles', JSON.stringify(customRoles));
  }, [customRoles]);

  const addCustomRole = (name: string, permissions: string[]) => {
    if (!activeBusiness) return;
    const newRole: CustomRole = {
      id: `role-${Math.random().toString(36).substr(2, 9)}`,
      businessId: activeBusiness.id,
      name,
      permissions,
      createdBy: userId || 'unknown'
    };
    setCustomRoles(prev => [...prev, newRole]);
  };

  const updateCustomRole = (roleId: string, name: string, permissions: string[]) => {
    setCustomRoles(prev => prev.map(r => r.id === roleId ? { ...r, name, permissions } : r));
  };

  const deleteCustomRole = (roleId: string) => {
    setCustomRoles(prev => prev.filter(r => r.id !== roleId));
  };

  const getRolePermissions = (roleNameOrId: string): string[] => {
    // Check if it's a custom role ID first
    const custom = customRoles.find(r => r.id === roleNameOrId && r.businessId === activeBusiness?.id);
    if (custom) return custom.permissions;

    // Check custom role by name (for tolerance)
    const customByName = customRoles.find(
      r => (r.name || '').toLowerCase() === (roleNameOrId || '').toLowerCase() && r.businessId === activeBusiness?.id
    );
    if (customByName) return customByName.permissions;

    // Otherwise standard default roles
    switch ((roleNameOrId || '').toLowerCase()) {
      case 'owner':
        return ['business.edit', 'menu.create', 'orders.manage', 'payments.verify', 'staff.manage', 'roles.manage', 'reports.view'];
      case 'manager':
        return ['menu.create', 'orders.manage', 'payments.verify', 'staff.manage'];
      case 'cashier':
        return ['orders.manage', 'payments.verify'];
      case 'waiter':
        return ['orders.manage'];
      case 'kitchen':
        return ['orders.manage'];
      case 'delivery':
        return ['delivery.view', 'delivery.accept', 'delivery.update', 'payments.collect'];
      default:
        return [];
    }
  };

  // Let's resolve the user's role for the active business
  const getActiveUserRole = (): string => {
    if (userRole === 'super_admin') return 'Owner';
    if (activeMembership) return activeMembership.role;
    // Check if there's a staff record with this user's email
    const staffRec = staff.find(s => s.email === userEmail && s.tenantId === activeBusiness?.id);
    if (staffRec) return staffRec.role;
    return '';
  };

  const getStaffPermissions = (): string[] => {
    if (userRole === 'super_admin') {
      return ['do.all', 'business.edit', 'menu.create', 'orders.manage', 'payments.verify', 'staff.manage', 'roles.manage', 'reports.view'];
    }
    const staffRec = staff.find(s => (s.email || '').toLowerCase().trim() === (userEmail || '').toLowerCase().trim() && s.tenantId === activeBusiness?.id);
    if (staffRec) {
      if ((staffRec.role || '').toLowerCase() === 'owner') {
        return ['do.all', 'business.edit', 'menu.create', 'orders.manage', 'payments.verify', 'staff.manage', 'roles.manage', 'reports.view'];
      }
      if (staffRec.permissions) {
        return staffRec.permissions;
      }
      return getRolePermissions(staffRec.role);
    }
    return getRolePermissions(activeRole);
  };

  const activeRole = getActiveUserRole();
  const permissions = getStaffPermissions();

  const can = (permission: string): boolean => {
    if (userRole === 'super_admin') return true;
    if ((activeRole || '').toLowerCase() === 'owner') return true; // Owners always pass everything
    const currentPerms = getStaffPermissions();
    if (currentPerms.includes('do.all')) return true;
    return currentPerms.includes(permission);
  };

  return (
    <PermissionContext.Provider value={{ permissions, can, customRoles, addCustomRole, updateCustomRole, deleteCustomRole }}>
      {children}
    </PermissionContext.Provider>
  );
}

export function FeatureProvider({ children }: { children: React.ReactNode }) {
  const { activeBusiness } = useDinexBusiness();
  const { activeSettings } = useDinexSettings();

  const isFeatureEnabled = (featureName: string): boolean => {
    if (!activeBusiness) return false;

    // Plan limits
    const plan = activeBusiness.subscriptionPlan || 'free';
    
    // settings checks
    if (featureName === 'ordering' && activeSettings && !activeSettings.orderingEnabled) return false;
    if (featureName === 'tables' && activeSettings && !activeSettings.tableManagementEnabled) return false;
    if (featureName === 'reservations' && activeSettings && !activeSettings.reservationEnabled) return false;
    if (featureName === 'loyalty' && activeSettings && !activeSettings.loyaltyEnabled) return false;
    if (featureName === 'tips' && activeSettings && !activeSettings.tipsEnabled) return false;
    if (featureName === 'kitchen' && activeSettings && !activeSettings.kitchenEnabled) return false;
    if (featureName === 'takeaway' && activeSettings && !activeSettings.takeawayEnabled) return false;
    if (featureName === 'delivery' && activeSettings && !activeSettings.deliveryEnabled) return false;

    // Subscription Plan restrictions
    if (featureName === 'loyalty' && plan === 'free') return false; // Loyalty requires growth/enterprise
    if (featureName === 'reservations' && plan === 'free') return false; // Reservations require growth/enterprise
    if (featureName === 'inventory' && plan !== 'enterprise') return false; // Inventory is enterprise-only

    return true;
  };

  return (
    <FeatureContext.Provider value={{ isFeatureEnabled }}>
      {children}
    </FeatureContext.Provider>
  );
}

// ==========================================
// 4. COMBINED DINEX PROVIDER
// ==========================================

export function DinexProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <BusinessProvider>
        <BranchProvider>
          <SettingsProvider>
            <PermissionProvider>
              <FeatureProvider>
                {children}
              </FeatureProvider>
            </PermissionProvider>
          </SettingsProvider>
        </BranchProvider>
      </BusinessProvider>
    </AuthProvider>
  );
}

// ==========================================
// 5. REUSABLE PERMISSION GUARD COMPONENT
// ==========================================

interface PermissionGuardProps {
  permission: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGuard({ permission, fallback, children }: PermissionGuardProps) {
  const { can } = useDinexPermission();

  if (!can(permission)) {
    if (fallback !== undefined) return <>{fallback}</>;
    return (
      <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-6 text-center space-y-3">
        <Lock className="h-8 w-8 text-slate-400 mx-auto animate-pulse" />
        <h4 className="font-sans font-bold text-xs text-slate-800">Permission Restricted</h4>
        <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
          Your active membership role does not have the <strong>"{permission}"</strong> permission. Contact your business owner to upgrade credentials.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
