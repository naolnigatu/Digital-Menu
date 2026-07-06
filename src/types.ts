export type SubscriptionPlan = 'free' | 'growth' | 'enterprise';

export type UserRole = 'super_admin' | 'owner' | 'manager' | 'cashier' | 'waiter' | 'kitchen' | 'customer';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description: string;
  currency: string;
  currencySymbol: string;
  baseTaxRate: number; // percentage, e.g., 15 for Ethiopia
  serviceCharge: number; // percentage, e.g., 5
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: 'active' | 'suspended' | 'past_due' | 'pending_approval' | 'rejected';
  ownerEmail: string;
  createdAt: string;
  loyaltyPointsRatio: number; // e.g., 1 point per 10 currency spent
  loyaltyMinRedeemPoints: number; // minimum points to start redeeming
  loyaltyRedeemValue: number; // value of 1 point in currency
}

export interface Branch {
  id: string;
  tenantId: string;
  name: string;
  address: string;
  phone: string;
}

export interface PreparationStation {
  id: string;
  branchId: string;
  name: string;
}

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

export interface ModifierGroup {
  id: string;
  name: string;
  minSelect: number;
  maxSelect: number;
  options: ModifierOption[];
}

export interface MenuItem {
  id: string;
  categoryId: string;
  tenantId: string;
  name: string;
  description: string;
  price: number;
  photoUrl?: string;
  allergenTags: string[];
  dietaryTags: string[];
  isAvailable: boolean;
  preparationStationId: string;
  modifiers: ModifierGroup[];
  translations?: Record<string, { name: string; description: string }>; // e.g., 'am' for Amharic
}

export interface Category {
  id: string;
  tenantId: string;
  name: string;
  orderNum: number;
  icon?: string;
  translations?: Record<string, string>; // language code -> translated name
}

export interface Table {
  id: string;
  branchId: string;
  number: string;
  section: 'Indoor' | 'Outdoor' | 'Terrace';
  status: 'empty' | 'waiting' | 'eating' | 'dirty';
  qrUrl: string; // encoded link
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  selectedModifiers: {
    groupName: string;
    optionName: string;
    price: number;
  }[];
  status: 'received' | 'cooking' | 'ready' | 'delivered';
  notes?: string;
  assignedStationId: string;
}

export type OrderStatus = 'draft' | 'submitted' | 'cooking' | 'ready' | 'delivered' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  orderNum: string; // E.g., MF-1024
  tenantId: string;
  branchId: string;
  tableId?: string; // Empty if pre-order pickup
  type: 'dine_in' | 'pickup';
  customerName?: string;
  customerPhone?: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: 'unpaid' | 'paid';
  paymentMethod?: 'cash' | 'card' | 'mobile_money';
  discount: number; // Absolute value
  tax: number; // Absolute value
  serviceCharge: number; // Absolute value
  subtotal: number;
  total: number;
  createdAt: string;
  notes?: string;
  pickupTime?: string; // Time string if pickup
  loyaltyPointsEarned?: number;
  loyaltyPointsRedeemed?: number;
  rating?: number;
  feedback?: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
  branchId: string; // Scoped branch
  stationId?: string; // Scoped station for KDS
  active: boolean;
}

export interface SystemLog {
  id: string;
  tenantId?: string;
  userEmail: string;
  role: UserRole;
  action: string;
  timestamp: string;
  details: string;
}

export interface PlatformStats {
  totalTenants: number;
  activeTenants: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyGrowthRate: number;
}

export interface PlatformAd {
  id: string;
  tenantId?: string; // empty/undefined means global platform-wide ad, otherwise target a specific restaurant
  title: string;
  subtitle: string;
  imageUrl: string;
  actionUrl?: string;
  active: boolean;
  createdAt: string;
}

