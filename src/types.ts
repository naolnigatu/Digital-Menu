export type SubscriptionPlan = 'free' | 'growth' | 'enterprise';

export type UserRole = 'super_admin' | 'owner' | 'manager' | 'cashier' | 'waiter' | 'kitchen' | 'customer' | 'delivery';

export interface Tenant {
  businessType?: string;
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
  bankAccount?: string; // Bank details for advance payment
  mealSubscriptionDiscountPercent?: number;
  mealSubscriptionConfig?: SubscriptionConfig;
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
  portions?: { name: string; price: number }[];
  translations?: Record<string, { name: string; description: string }>; // e.g., 'am' for Amharic
  prepTime?: number; // prep time in minutes
  availability?: 'Available' | 'Sold Out' | 'Hidden';
  featured?: boolean;
  recommended?: boolean;
  taxEnabled?: boolean;
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
  issueReason?: string;
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
  status: 'received' | 'cooking' | 'ready' | 'delivered' | 'issue_reported' | 'cancelled';
  issueReason?: string;
  notes?: string;
  assignedStationId: string;
}

export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'partially_paid' | 'refunded' | 'failed';

export interface TimelineEvent {
  id: string;
  time: string;
  label: string;
  desc: string;
  actor?: string;
}

export interface KitchenNote {
  id: string;
  text: string;
  approved: boolean;
  rejected?: boolean;
}

export interface Order {
  id: string;
  orderNum: string; // E.g., MF-1024
  tenantId: string;
  branchId: string;
  tableId?: string; // Empty if pre-order pickup
  type: 'dine_in' | 'takeaway' | 'delivery' | 'drive_through' | 'pickup' | 'meal_subscription' | string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAccount?: boolean;
  items: OrderItem[];
  status: OrderStatus;
  issueReason?: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: 'cash' | 'card' | 'mobile_money' | 'bank_transfer' | string;
  discount: number; // Absolute value
  tip: number; // tip amount recorded
  tipStatus?: 'pending' | 'delivered' | 'accepted'; // status of tip
  tax: number; // Absolute value
  serviceCharge: number; // Absolute value
  subtotal: number;
  total: number;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
  pickupTime?: string; // Time string if pickup
  loyaltyPointsEarned?: number;
  loyaltyPointsRedeemed?: number;
  rating?: number;
  feedback?: string;
  paymentScreenshotUrl?: string; // payment screenshot uploaded by customer
  paymentVerificationStatus?: 'pending' | 'approved' | 'rejected'; // For advance payments
  advancePaymentRef?: string;
  waiterId?: string;
  waiterName?: string;
  timeline: TimelineEvent[];
  kitchenNotes?: KitchenNote[];
  refundDetails?: RefundDetails;
  
  // Delivery Module fields
  deliveryAddress?: string;
  deliveryLandmark?: string;
  deliveryInstructions?: string;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  deliveryFee?: number;
  deliveryStatus?: 'pending_approval' | 'pending_acceptance' | 'accepted' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'received' | 'issue' | string;
  deliveryStaffId?: string;
  deliveryStaffName?: string;
  deliveryRating?: number;
  deliveryComment?: string;
  deliveryPaymentCollected?: boolean;
  deliveryPaymentNote?: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: UserRole | string;
  tenantId: string;
  branchId: string; // Scoped branch
  stationId?: string; // Scoped station for KDS
  active: boolean;
  permissions?: string[];
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

export interface PlanPricing {
  id: SubscriptionPlan;
  name: string;
  priceUSD: number;
  priceETB: number;
  description: string;
  features: string[];
}

export type BusinessType =
  | 'Hotel'
  | 'Ethiopian Restaurant'
  | 'Cafe'
  | 'Bakery'
  | 'Pizza Restaurant'
  | 'Burger House'
  | 'Fast Food'
  | 'Street Food'
  | 'Juice Bar'
  | 'Dessert Shop'
  | 'Bar'
  | 'Coffee House'
  | 'Custom';

export interface PlatformAd {
  id: string;
  tenantId?: string; // empty/undefined means global platform-wide ad, otherwise target a specific restaurant
  title: string;
  subtitle: string;
  description?: string;
  imageUrl: string;
  actionUrl?: string;
  active: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'disabled' | 'removed';
  issueReason?: string;
  startDate?: string;
  endDate?: string;
  targetAudience?: string;
  createdAt: string;
}

export interface Reservation {
  id: string;
  tenantId: string;
  branchId: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';
  issueReason?: string;
  tableId?: string;
  specialRequests?: string;
  timeline: TimelineEvent[];
  createdAt: string;
}

export interface Ingredient {
  id: string;
  tenantId: string;
  branchId: string;
  name: string;
  stockQuantity: number;
  unit: string;
  reorderLevel: number;
  supplier?: string;
}

export interface StockMovement {
  id: string;
  ingredientId: string;
  tenantId: string;
  branchId: string;
  type: 'in' | 'out' | 'waste' | 'adjustment';
  quantity: number;
  date: string;
  note?: string;
  actor: string;
}

export interface MarketplaceExtension {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: 'Integration' | 'Premium Feature' | 'Hardware';
  developer: string;
  status: 'active' | 'deprecated';
  issueReason?: string;
}

export interface InstalledExtension {
  id: string; // extension ID
  tenantId: string;
  installedAt: string;
  status: 'active' | 'suspended';
  issueReason?: string;
}

export interface DinexNotification {
  id: string;
  tenantId: string;
  userId?: string;
  type: 'order_ready' | 'payment_verified' | 'reservation_approved' | 'reservation_cancelled' | 'subscription_expiring' | 'staff_invite' | 'low_inventory' | 'ad_approved' | 'system';
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}


export interface LandingPageConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroBackgroundType: 'image' | 'video' | 'color';
  heroBackgroundUrl: string;
  aboutTitle: string;
  aboutText: string;
  featuresTitle: string;
  featuresSubtitle: string;
  contactEmail: string;
}

export interface GlobalSettings {
  landingPageConfig?: LandingPageConfig;
  supportedCountries: string[];
  supportedCurrencies: string[];
  maintenanceMode: boolean;
  announcements: string[];
  globalFeatureFlags: Record<string, boolean>;
  allowedDiningServiceTypes?: string[];
  allowedSubscriptionDurations?: number[];
  allowedPaymentMethods?: string[];
}

export interface Business {
  id: string;
  name: string;
  businessType: BusinessType;
  logo?: string;
  country: string;
  city: string;
  phone: string;
  email: string;
  currency: string;
  language: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'suspended' | 'pending_approval' | 'rejected';
  issueReason?: string;
  subscriptionPlan?: SubscriptionPlan;
}

export interface Membership {
  userId: string;
  businessId: string;
  role: 'Owner' | 'Manager' | 'Cashier' | 'Waiter' | 'Kitchen' | 'Customer' | string;
  branchIds: string[];
  permissions: string[];
  status: 'active' | 'pending' | 'suspended';
  issueReason?: string;
  createdAt: string;
}

export interface DinexBranch {
  id: string;
  businessId: string;
  name: string;
  location: string;
  phone: string;
  status: 'active' | 'inactive';
  issueReason?: string;
  createdAt: string;
}

export interface BusinessSettings {
  orderingEnabled: boolean;
  tableManagementEnabled: boolean;
  reservationEnabled: boolean;
  loyaltyEnabled: boolean;
  tipsEnabled: boolean;
  customerAccountsEnabled: boolean;
  kitchenEnabled: boolean;
  takeawayEnabled: boolean;
  deliveryEnabled: boolean;
  deliveryApprovalMode?: 'manual' | 'automatic';
  predefinedDeliveryFee?: number;
  enabledDiningServiceTypes?: string[];
  subscriptionDurations?: number[];
}

export interface CustomRole {
  id: string;
  businessId: string;
  name: string;
  permissions: string[];
  createdBy: string;
}

export interface PaymentMethodConfig {
  id: string;
  name: string;
  enabled: boolean;
  requiresProof: boolean;
  details?: string;
}

export interface LoyaltyConfig {
  enabled: boolean;
  pointsPerPurchase: number;
  minPointsToRedeem: number;
  discountPercentage: number;
  badgeLevels: { name: string; minPoints: number; discountBonus: number }[];
}

export interface LoyaltyHistoryEntry {
  id: string;
  date: string;
  points: number;
  type: 'earn' | 'redeem';
  orderNum?: string;
  description: string;
}

export interface MealSubscriptionPackage {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  type: 'fixed' | 'build_your_own';
  durationDays: number;
  
  // Fixed Package Rules
  price: number;
  items?: { menuItemId: string, quantity: number }[]; // Array of items and their bundled quantities
  
  // Build Your Own Rules
  maxCredits?: number;
  pricePerCredit?: number; // E.g., if 1 credit = $5
  eligibleMenuItemIds?: string[]; // Empty means all allowed
  
  isActive: boolean;
}

export interface CustomerMealSubscription {
  id: string;
  customerId: string;
  tenantId: string;
  packageId: string;
  
  credits: {
    menuItemId: string;
    total: number;
    used: number;
    remaining: number;
  }[];
  totalCreditsRemaining: number;
  
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending_approval';
  
  redemptionsToday: number; // calculated transiently or stored
  lastRedemptionDate?: string; 
  
  issueReason?: string; // e.g. for rejected approvals
}

export interface MealRedemptionHistory {
  id: string;
  tenantId: string;
  subscriptionId: string;
  customerId: string;
  menuItemId: string;
  orderId: string;
  redeemedAt: string;
}

export interface SubscriptionConfig {
  flexibleRedemption: boolean; // default true
  dailyRedemptionLimit?: number; // max meals per day
  allowedRedemptionHours?: { start: string; end: string }; // e.g. "09:00", "17:00"
  allowedOrderTypes: ('dine_in' | 'takeaway' | 'pickup' | 'delivery' | 'drive_through')[];
}


export interface SavedAddress {
  id: string;
  name: string;
  address: string;
}

export interface CustomerProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  tenantId?: string; // Associated business
  savedAddresses: SavedAddress[];
  savedFavorites: string[];
  loyaltyPoints: number;
  loyaltyHistory: LoyaltyHistoryEntry[];
}

export interface RefundDetails {
  refundAmount: number;
  refundReason: string;
  refundDate: string;
  refundedBy: string;
}



export interface SubscriptionRequest {
  id: string;
  tenantId: string;
  planId: string;
  duration: number; // in months: 1, 3, 6, 12, 24
  paymentMethod: string;
  transactionId?: string;
  proofImageUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}
