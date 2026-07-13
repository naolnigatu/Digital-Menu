import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MenuItem, Category, Table, Staff, ModifierGroup, BusinessType, Order, OrderItem } from '../types';
import { 
  LayoutDashboard, Utensils, QrCode, Users, Settings, Plus, Trash2, Edit, Check, 
  BarChart3, Users2, Shield, Languages, Award, PlusCircle, CreditCard, ChevronRight, FileSpreadsheet,
  Upload, Image, X, Sparkles, MapPin, Phone, Mail, HelpCircle, AlertTriangle, XCircle, ShieldAlert,
  ChevronUp, ChevronDown, EyeOff, Eye, Search
} from 'lucide-react';
import { 
  useDinexBusiness, 
  useDinexBranch, 
  useDinexSettings, 
  useDinexPermission, 
  useDinexFeature,
  PermissionGuard 
} from '../context/DinexContext';
import PaymentSettings from '../components/PaymentSettings';
import LoyaltySettings from '../components/LoyaltySettings';
import MealSubscriptionSettings from '../components/MealSubscriptionSettings';
import ReportsDashboard from '../components/ReportsDashboard';

const PERMISSION_MODULES = [
  {
    name: 'Business',
    permissions: [
      { id: 'business.edit', name: 'Modify Business Profile', desc: 'Allows editing bank details, brand logo, and currency.' },
      { id: 'business.view', name: 'View Business Profile', desc: 'Allows viewing business details and operational profiles.' }
    ]
  },
  {
    name: 'Menu',
    permissions: [
      { id: 'menu.create', name: 'Create Menu Categories & Dishes', desc: 'Allows adding new categories and items.' },
      { id: 'menu.edit', name: 'Modify Menu Items & Pricing', desc: 'Allows changing prices, descriptions, and modifiers.' },
      { id: 'menu.delete', name: 'Delete Menu Items & Categories', desc: 'Allows permanent deletion of menu structures.' }
    ]
  },
  {
    name: 'Kitchen',
    permissions: [
      { id: 'kitchen.view', name: 'Access Kitchen Display Screen', desc: 'Allows kitchen screens to view received orders.' },
      { id: 'kitchen.manage', name: 'Update Station Assignments', desc: 'Allows editing preparation targets and states.' }
    ]
  },
  {
    name: 'Orders',
    permissions: [
      { id: 'orders.create', name: 'Create New Orders', desc: 'Allows waiters to submit orders for tables.' },
      { id: 'orders.manage', name: 'Coordinate Kitchen Orders', desc: 'Allows updating order progress and cooking status.' }
    ]
  },
  {
    name: 'Payments',
    permissions: [
      { id: 'payments.verify', name: 'Verify Advance Payments', desc: 'Allows validating pre-payment transfer slips.' },
      { id: 'payments.settle', name: 'Settle Bills', desc: 'Allows settling tables and marking checks as paid.' }
    ]
  },
  {
    name: 'Customers',
    permissions: [
      { id: 'customers.view', name: 'View Customer Profiles', desc: 'Allows accessing customer names and order histories.' },
      { id: 'customers.manage', name: 'Manage Loyalty & Discounts', desc: 'Allows applying customer discount and points deductions.' }
    ]
  },
  {
    name: 'Staff',
    permissions: [
      { id: 'staff.manage', name: 'Manage Crew Roster', desc: 'Allows inviting staff, deactivating accounts, and managing roster.' }
    ]
  },
  {
    name: 'Reports',
    permissions: [
      { id: 'reports.view', name: 'Access Sales Reports', desc: 'Allows viewing interactive sales reports and charts.' }
    ]
  },
  {
    name: 'Promotions',
    permissions: [
      { id: 'promotions.manage', name: 'Manage Banner Ads & Campaigns', desc: 'Allows publishing platform promotions and specials.' }
    ]
  },
  {
    name: 'Reservations',
    permissions: [
      { id: 'reservations.manage', name: 'Coordinate Table Reservations', desc: 'Allows adding, viewing, and deleting customer reservations.' }
    ]
  },
  {
    name: 'Tables',
    permissions: [
      { id: 'tables.manage', name: 'Configure Table Layouts', desc: 'Allows defining table sections, sections, and table numbers.' }
    ]
  },
  {
    name: 'QR',
    permissions: [
      { id: 'qr.generate', name: 'Export Branch QR Codes', desc: 'Allows downloading QR codes for tables.' }
    ]
  },
  {
    name: 'Notifications',
    permissions: [
      { id: 'notifications.view', name: 'View Service Alerts', desc: 'Allows receiving order submittals and call-waiter bells.' }
    ]
  },
  {
    name: 'Inventory',
    permissions: [
      { id: 'inventory.manage', name: 'Track Stock Levels', desc: 'Allows updating dish ingredient counts and low-stock indicators.' }
    ]
  }
];

const TEMPLATES: Record<string, string[]> = {
  manager: [
    'business.edit', 'business.view',
    'menu.create', 'menu.edit', 'menu.delete',
    'kitchen.view', 'kitchen.manage',
    'orders.create', 'orders.manage',
    'payments.verify', 'payments.settle',
    'customers.view', 'customers.manage',
    'staff.manage',
    'reports.view',
    'promotions.manage',
    'reservations.manage',
    'tables.manage',
    'qr.generate',
    'notifications.view',
    'inventory.manage'
  ],
  cashier: [
    'orders.manage',
    'payments.verify', 'payments.settle',
    'customers.view',
    'notifications.view'
  ],
  waiter: [
    'orders.create', 'orders.manage',
    'reservations.manage',
    'notifications.view'
  ],
  kitchen: [
    'kitchen.view', 'kitchen.manage',
    'orders.manage'
  ],
  receptionist: [
    'reservations.manage',
    'customers.view',
    'notifications.view'
  ],
  custom: []
};

const getStaffDefaultRolePermissions = (roleName: string): string[] => {
  switch (roleName.toLowerCase()) {
    case 'owner':
      return ['do.all', 'business.edit', 'menu.create', 'orders.manage', 'payments.verify', 'staff.manage', 'roles.manage', 'reports.view'];
    case 'manager':
      return [
        'business.edit', 'business.view',
        'menu.create', 'menu.edit', 'menu.delete',
        'kitchen.view', 'kitchen.manage',
        'orders.create', 'orders.manage',
        'payments.verify', 'payments.settle',
        'customers.view', 'customers.manage',
        'staff.manage',
        'reports.view',
        'promotions.manage',
        'reservations.manage',
        'tables.manage',
        'qr.generate',
        'notifications.view',
        'inventory.manage'
      ];
    case 'cashier':
      return ['orders.manage', 'payments.verify', 'payments.settle', 'customers.view', 'notifications.view'];
    case 'waiter':
      return ['orders.create', 'orders.manage', 'reservations.manage', 'notifications.view'];
    case 'kitchen':
      return ['kitchen.view', 'kitchen.manage', 'orders.manage'];
    case 'receptionist':
      return ['reservations.manage', 'customers.view', 'notifications.view'];
    default:
      return [];
  }
};

export default function BusinessOwnerView() {
  const { 
    addCategory, 
    updateCategory, 
    deleteCategory,
    addMenuItem, 
    updateMenuItem, 
    deleteMenuItem,
    addTable,
    addStaffMember, 
    toggleStaffStatus,
    updateTenantPlan,
    requestTenantUpgrade,
    updateTenantCurrency,
    updateTenantProfile,
    pricingPlans,
    tenants,
    branches,
    stations,
    categories,
    menuItems,
    tables,
    orders,
    staff,
    activeTenantId,
    activeBranchId,
    setActiveBranchId,
    updateStaffPermissions,
    placeOrder,
    updateOrderStatus,
    processPayment,
    cancelOrder,
  } = useApp();

  const { activeBusiness, businesses, setActiveBusinessId, createBusiness } = useDinexBusiness();
  const { activeBranch: dinexActiveBranch, branches: dinexBranches, setActiveBranchId: setDinexBranchId, createBranch: createDinexBranch } = useDinexBranch();
  const { activeSettings, updateSettings } = useDinexSettings();
  const { can, customRoles, addCustomRole, updateCustomRole, deleteCustomRole } = useDinexPermission();
  const { isFeatureEnabled } = useDinexFeature();

  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'orders' | 'menu' | 'tables' | 'staff' | 'settings' | 'payments' | 'loyalty' | 'subscriptions' | 'reports'>('dashboard');

  // --- Order Management State ---
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [filterOrderType, setFilterOrderType] = useState<string>('all');
  const [filterOrderStatus, setFilterOrderStatus] = useState<string>('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>('all');
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<Order | null>(null);

  // New Order Creation Form State
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  const [newOrderCustomer, setNewOrderCustomer] = useState('Guest Customer');
  const [newOrderPhone, setNewOrderPhone] = useState('');
  const [newOrderType, setNewOrderType] = useState<'dine_in' | 'takeaway' | 'delivery' | 'drive_through' | 'pickup' | 'meal_subscription'>('dine_in');
  const [newOrderTableId, setNewOrderTableId] = useState('');
  const [newOrderWaiterId, setNewOrderWaiterId] = useState('');
  const [newOrderDiscount, setNewOrderDiscount] = useState<number>(0);
  const [newOrderTip, setNewOrderTip] = useState<number>(0);
  const [newOrderNotes, setNewOrderNotes] = useState('');
  
  // Selected items in the new order draft
  const [draftOrderItems, setDraftOrderItems] = useState<OrderItem[]>([]);
  const [currentDraftItem, setCurrentDraftItem] = useState<string>(''); // menuItemId
  const [currentDraftQty, setCurrentDraftQty] = useState<number>(1);
  const [selectedModifiersDraft, setSelectedModifiersDraft] = useState<{ groupName: string; optionName: string; price: number }[]>([]);

  // Calculations for Draft Order
  const draftSubtotal = draftOrderItems.reduce((acc, it) => {
    const itemCost = it.price + it.selectedModifiers.reduce((sum, m) => sum + m.price, 0);
    return acc + (itemCost * it.quantity);
  }, 0);

  const draftTax = (() => {
    const tempTenant = tenants.find(t => t.id === activeTenantId) || tenants[0];
    return parseFloat(((draftSubtotal * (tempTenant?.baseTaxRate || 15)) / 100).toFixed(2));
  })();

  const draftServiceCharge = (() => {
    const tempTenant = tenants.find(t => t.id === activeTenantId) || tenants[0];
    return parseFloat(((draftSubtotal * (tempTenant?.serviceCharge || 0)) / 100).toFixed(2));
  })();

  const draftTotal = parseFloat((draftSubtotal + draftTax + draftServiceCharge + Number(newOrderTip) - Number(newOrderDiscount)).toFixed(2));

  const handleAddDraftItem = () => {
    if (!currentDraftItem) return;
    const item = (menuItems[activeTenantId] || []).find(i => i.id === currentDraftItem);
    if (!item) return;

    const newItem: OrderItem = {
      id: `draft-item-${Date.now()}-${Math.random()}`,
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: currentDraftQty,
      selectedModifiers: [...selectedModifiersDraft],
      status: 'received',
      assignedStationId: item.preparationStationId || ''
    };

    setDraftOrderItems(prev => [...prev, newItem]);
    setCurrentDraftItem('');
    setCurrentDraftQty(1);
    setSelectedModifiersDraft([]);
  };

  const handlePlaceOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (draftOrderItems.length === 0) {
      showToast('Please add at least one item to your order.', 'error');
      return;
    }

    const orderPayload = {
      tenantId: activeTenantId,
      branchId: activeBranchId,
      tableId: newOrderTableId || undefined,
      type: newOrderType,
      customerName: newOrderCustomer,
      customerPhone: newOrderPhone || undefined,
      customerAccount: false,
      items: draftOrderItems,
      discount: Number(newOrderDiscount),
      tip: Number(newOrderTip),
      notes: newOrderNotes || undefined,
      waiterId: newOrderWaiterId || undefined,
      waiterName: newOrderWaiterId ? (staff.filter(s => s.branchId === activeBranchId)).find(s => s.id === newOrderWaiterId)?.name : undefined,
    };

    const placed = placeOrder(orderPayload);
    showToast(`Order #${placed.orderNum} registered successfully.`);
    
    // Reset draft fields
    setDraftOrderItems([]);
    setNewOrderCustomer('Guest Customer');
    setNewOrderPhone('');
    setNewOrderTableId('');
    setNewOrderWaiterId('');
    setNewOrderDiscount(0);
    setNewOrderTip(0);
    setNewOrderNotes('');
    setShowCreateOrderModal(false);
  };

  // Local Dinex Settings State for manual Save/Cancel actions (Task 4)
  const [localDinexSettings, setLocalDinexSettings] = useState({
    orderingEnabled: true,
    tableManagementEnabled: true,
    reservationEnabled: false,
    loyaltyEnabled: false,
    tipsEnabled: true,
    customerAccountsEnabled: true,
    kitchenEnabled: true,
    takeawayEnabled: true,
    deliveryEnabled: true,
  });

  useEffect(() => {
    if (activeSettings) {
      setLocalDinexSettings(activeSettings);
    }
  }, [activeSettings]);

  // Create Business Modal states (Task 3)
  const [showCreateBizModal, setShowCreateBizModal] = useState(false);
  const [newBizName, setNewBizName] = useState('');
  const [newBizType, setNewBizType] = useState<BusinessType>('Ethiopian Restaurant');
  const [newBizCountry, setNewBizCountry] = useState('Ethiopia');
  const [newBizCity, setNewBizCity] = useState('Addis Ababa');
  const [newBizPhone, setNewBizPhone] = useState('');
  const [newBizEmail, setNewBizEmail] = useState('');
  const [newBizCurrency, setNewBizCurrency] = useState('ETB');
  const [newBizLanguage, setNewBizLanguage] = useState('am');

  const handleCreateBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName || !newBizPhone || !newBizEmail) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }
    const created = createBusiness({
      name: newBizName,
      businessType: newBizType,
      country: newBizCountry,
      city: newBizCity,
      phone: newBizPhone,
      email: newBizEmail,
      currency: newBizCurrency,
      language: newBizLanguage,
    });
    showToast(`"${created.name}" provisioned successfully.`);
    setShowCreateBizModal(false);
    setNewBizName('');
    setNewBizPhone('');
    setNewBizEmail('');
  };

  // Tenant reference
  const tenant = tenants.find(t => t.id === activeTenantId) || tenants[0] || {
    id: activeTenantId || 't-01',
    name: 'My Restaurant',
    slug: 'my-restaurant',
    logoUrl: '',
    description: '',
    currency: 'ETB',
    currencySymbol: 'Br',
    baseTaxRate: 15,
    serviceCharge: 0,
    subscriptionPlan: 'free',
    subscriptionStatus: 'pending_approval',
    ownerEmail: '',
    createdAt: new Date().toISOString()
  };
  const activeBranch = branches.find(b => b.id === activeBranchId) || branches[0] || {
    id: activeBranchId || 'b-01',
    tenantId: tenant.id,
    name: 'Main Branch',
    address: 'Addis Ababa, Ethiopia',
    phone: ''
  };

  // Filters
  const tenantCategories = React.useMemo(() => categories[activeTenantId] || [], [categories, activeTenantId]);
  const tenantItems = React.useMemo(() => menuItems[activeTenantId] || [], [menuItems, activeTenantId]);
  const tenantBranchTables = React.useMemo(() => tables.filter(t => t.branchId === activeBranchId), [tables, activeBranchId]);
  const branchStaff = React.useMemo(() => staff.filter(s => s.branchId === activeBranchId), [staff, activeBranchId]);
  const branchOrders = React.useMemo(() => orders.filter(o => o.branchId === activeBranchId), [orders, activeBranchId]);

  const renderPaywall = (featureName: string, description: string) => {
    const growthPlan = pricingPlans.find(p => p.id === 'growth');
    const displayPrice = tenant.currency === 'ETB' ? `${growthPlan?.priceETB} ETB` : `$${growthPlan?.priceUSD}`;
    const isPending = tenant.subscriptionStatus === 'pending_approval';

    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50/20 p-8 text-center max-w-lg mx-auto my-12 space-y-6">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 mx-auto">
          <Award className="h-6 w-6 animate-bounce" />
        </div>
        <div className="space-y-2">
          <span className="inline-block rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-600 border border-amber-500/20 uppercase tracking-wider">
            Premium Operations Feature
          </span>
          <h2 className="font-sans font-extrabold text-lg text-slate-900">Unlock {featureName}</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 text-left space-y-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold text-slate-700">Multi-branch and waiter terminals integration</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold text-slate-700">Detailed sales reports and financial analysis charts</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold text-slate-700">Invite waitstaff, kitchen chefs, and cashiers to collaborate</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {isPending ? (
            <div className="w-full sm:w-auto rounded-xl bg-amber-100 text-amber-800 px-5 py-2.5 text-xs font-bold border border-amber-200 flex items-center justify-center gap-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping"></span>
              <span>Upgrade Pending Admin Approval</span>
            </div>
          ) : (
            <button
              onClick={() => {
                requestTenantUpgrade(tenant.id, 'growth');
                // The status must also change so the Admin can approve it
                showToast(`Upgrade request submitted! Awaiting admin approval.`);
              }}
              className="w-full sm:w-auto rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CreditCard className="h-4 w-4" />
              Request Upgrade to Growth ({displayPrice}/mo)
            </button>
          )}
          
          <button
            onClick={() => setActiveSubTab('menu')}
            className="w-full sm:w-auto rounded-xl bg-slate-100 text-slate-700 px-5 py-2.5 text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer"
          >
            Continue with Free Menu Service
          </button>
        </div>
      </div>
    );
  };

  // --- Menu Forms State ---
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catName, setCatName] = useState('');
  const [catAmharic, setCatAmharic] = useState('');
  const [catOrderNum, setCatOrderNum] = useState(1);
  const [isSavingCat, setIsSavingCat] = useState(false);
  const [catStatusMessage, setCatStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [disabledCategoryIds, setDisabledCategoryIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('mf_disabled_categories') || '[]');
    } catch {
      return [];
    }
  });

  const handleToggleCategoryDisable = (catId: string) => {
    setDisabledCategoryIds(prev => {
      const next = prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId];
      localStorage.setItem('mf_disabled_categories', JSON.stringify(next));
      return next;
    });
  };

  const handleMoveCategory = (catId: string, direction: 'up' | 'down') => {
    const sorted = [...tenantCategories].sort((a, b) => a.orderNum - b.orderNum);
    const index = sorted.findIndex(c => c.id === catId);
    if (index === -1) return;
    
    if (direction === 'up' && index > 0) {
      const prev = sorted[index - 1];
      const temp = prev.orderNum;
      prev.orderNum = sorted[index].orderNum;
      sorted[index].orderNum = temp;
      updateCategory(prev);
      updateCategory(sorted[index]);
    } else if (direction === 'down' && index < sorted.length - 1) {
      const next = sorted[index + 1];
      const temp = next.orderNum;
      next.orderNum = sorted[index].orderNum;
      sorted[index].orderNum = temp;
      updateCategory(next);
      updateCategory(sorted[index]);
    }
  };

  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemPrice, setItemPrice] = useState(100);
  const [itemCat, setItemCat] = useState('');
  const [itemStation, setItemStation] = useState('');
  const [itemAllergens, setItemAllergens] = useState('');
  const [itemDietary, setItemDietary] = useState('');
  const [itemAmName, setItemAmName] = useState('');
  const [itemAmDesc, setItemAmDesc] = useState('');
  const [itemModifiers, setItemModifiers] = useState<ModifierGroup[]>([]);
  const [newModName, setNewModName] = useState('');
  const [newModOptionStr, setNewModOptionStr] = useState(''); // "Standard:0, Double:40"
  const [itemPhotoUrl, setItemPhotoUrl] = useState('');

  // Extended Menu Item states
  const [itemPrepTime, setItemPrepTime] = useState(15);
  const [itemAvailability, setItemAvailability] = useState<'Available' | 'Sold Out' | 'Hidden'>('Available');
  const [itemFeatured, setItemFeatured] = useState(false);
  const [itemRecommended, setItemRecommended] = useState(false);
  const [itemTaxEnabled, setItemTaxEnabled] = useState(true);
  const [isSavingItem, setIsSavingItem] = useState(false);
  const [itemStatusMessage, setItemStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFileLoad = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setItemPhotoUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- Table Forms State ---
  const [tableName, setTableName] = useState('');
  const [tableSection, setTableSection] = useState<'Indoor' | 'Outdoor' | 'Terrace'>('Indoor');

  // --- Staff Forms State ---
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffRole, setStaffRole] = useState<string>('waiter');
  const [staffStation, setStaffStation] = useState('');

  // Dinex Custom Role states
  const [staffViewTab, setStaffViewTab] = useState<'roster' | 'roles'>('roster');
  
  // --- Improved Staff Permission Management State ---
  const [selectedPermissionStaffId, setSelectedPermissionStaffId] = useState<string>('');
  const [selectedStaffPermissions, setSelectedStaffPermissions] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('custom');
  const [permStatusMessage, setPermStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSavingPerms, setIsSavingPerms] = useState(false);
  const [staffPermSearchQuery, setStaffPermSearchQuery] = useState('');

  // List of active employees of the current business (excluding owners)
  const currentBusinessEmployees = React.useMemo(() => {
    return staff.filter(s => s.tenantId === activeTenantId && s.role.toLowerCase() !== 'owner');
  }, [staff, activeTenantId]);

  // Handle staff dropdown selection change
  React.useEffect(() => {
    if (currentBusinessEmployees.length > 0) {
      if (!selectedPermissionStaffId || !currentBusinessEmployees.some(s => s.id === selectedPermissionStaffId)) {
        setSelectedPermissionStaffId(currentBusinessEmployees[0].id);
      }
    } else {
      setSelectedPermissionStaffId('');
    }
  }, [currentBusinessEmployees, selectedPermissionStaffId]);

  // Load selected staff permissions
  React.useEffect(() => {
    if (selectedPermissionStaffId) {
      const currentStaff = currentBusinessEmployees.find(s => s.id === selectedPermissionStaffId);
      if (currentStaff) {
        const currentPerms = currentStaff.permissions || getStaffDefaultRolePermissions(currentStaff.role);
        setSelectedStaffPermissions(currentPerms);
        
        // Match template
        let matchedTemplate = 'custom';
        const sortedPerms = [...currentPerms].filter(p => p !== 'do.all').sort().join(',');
        for (const [key, value] of Object.entries(TEMPLATES)) {
          if (key === 'custom') continue;
          const sortedValue = [...value].sort().join(',');
          if (sortedPerms === sortedValue) {
            matchedTemplate = key;
            break;
          }
        }
        setSelectedTemplate(matchedTemplate);
        setPermStatusMessage(null);
      }
    } else {
      setSelectedStaffPermissions([]);
      setSelectedTemplate('custom');
      setPermStatusMessage(null);
    }
  }, [selectedPermissionStaffId, currentBusinessEmployees]);

  const handleToggleDoAll = () => {
    const isDoAll = selectedStaffPermissions.includes('do.all');
    if (isDoAll) {
      setSelectedStaffPermissions(prev => prev.filter(p => p !== 'do.all'));
    } else {
      const allPerms = ['do.all', ...PERMISSION_MODULES.flatMap(m => m.permissions.map(p => p.id))];
      setSelectedStaffPermissions(allPerms);
    }
  };

  const handleTemplateChange = (tmplKey: string) => {
    setSelectedTemplate(tmplKey);
    if (tmplKey === 'custom') {
      return;
    }
    const targetPerms = TEMPLATES[tmplKey] || [];
    setSelectedStaffPermissions(targetPerms);
  };

  const handleSaveStaffPermissions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPermissionStaffId) return;
    setIsSavingPerms(true);
    setPermStatusMessage(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulated network delay
      updateStaffPermissions(selectedPermissionStaffId, selectedStaffPermissions);
      setPermStatusMessage({
        type: 'success',
        text: '✓ Saved successfully.'
      });
    } catch (err: any) {
      setPermStatusMessage({
        type: 'error',
        text: err?.message || 'Error saving staff permissions.'
      });
    } finally {
      setIsSavingPerms(false);
    }
  };

  // Unified Destructive Actions Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'Today' | 'This Week' | 'This Month' | '3Months' | '6Months' | 'This Year'>('Today');

  const [localSettings, setLocalSettings] = useState({
    bankAccount: tenant.bankAccount || '',
    currency: tenant.currency || 'ETB',
    logoUrl: tenant.logoUrl || ''
  });

  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsStatusMessage, setSettingsStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [isSavingFeatures, setIsSavingFeatures] = useState(false);
  const [featuresStatusMessage, setFeaturesStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  React.useEffect(() => {
    setLocalSettings({
      bankAccount: tenant.bankAccount || '',
      currency: tenant.currency || 'ETB',
      logoUrl: tenant.logoUrl || ''
    });
  }, [tenant]);

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    setSettingsStatusMessage(null);
    try {
      // Simulate real-time server response delay
      await new Promise(resolve => setTimeout(resolve, 800));
      updateTenantProfile(activeTenantId, localSettings.logoUrl, localSettings.bankAccount);
      const symbol = localSettings.currency === 'USD' ? '$' : 'Br';
      updateTenantCurrency(activeTenantId, localSettings.currency, symbol);
      setSettingsStatusMessage({ type: 'success', text: '✓ Saved successfully.' });
    } catch (err: any) {
      setSettingsStatusMessage({ type: 'error', text: err?.message || 'System error: Unable to update business profile settings.' });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleCancelSettings = () => {
    setLocalSettings({
      bankAccount: tenant.bankAccount || '',
      currency: tenant.currency || 'ETB',
      logoUrl: tenant.logoUrl || ''
    });
    setSettingsStatusMessage(null);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLocalSettings(prev => ({ ...prev, logoUrl: event.target?.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Computations
  const filteredBranchOrders = React.useMemo(() => {
    const now = new Date();
    return branchOrders.filter(o => {
      const orderDate = new Date(o.createdAt);
      switch (analyticsTimeframe) {
        case 'Today':
          return orderDate.toDateString() === now.toDateString();
        case 'This Week': {
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          return orderDate >= startOfWeek;
        }
        case 'This Month':
          return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
        case '3Months': {
          const threeMonthsAgo = new Date(now);
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          return orderDate >= threeMonthsAgo;
        }
        case '6Months': {
          const sixMonthsAgo = new Date(now);
          sixMonthsAgo.setMonth(now.getMonth() - 6);
          return orderDate >= sixMonthsAgo;
        }
        case 'This Year':
          return orderDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  }, [branchOrders, analyticsTimeframe]);

  const totalSales = React.useMemo(() => {
    return filteredBranchOrders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((acc, curr) => acc + curr.total, 0);
  }, [filteredBranchOrders]);

  const bestSellers = React.useMemo(() => {
    const bestSellingItemMap: Record<string, number> = {};
    filteredBranchOrders.forEach(o => {
      o.items.forEach(it => {
        bestSellingItemMap[it.name] = (bestSellingItemMap[it.name] || 0) + it.quantity;
      });
    });
    return Object.entries(bestSellingItemMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [filteredBranchOrders]);

  // Handle Menu submissions
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName || isSavingCat) return;
    setIsSavingCat(true);
    setCatStatusMessage(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 600)); // Network delay
      if (editingCatId) {
        updateCategory({
          id: editingCatId,
          tenantId: activeTenantId,
          name: catName,
          orderNum: Number(catOrderNum),
          icon: 'Utensils',
          translations: catAmharic ? { am: catAmharic } : undefined
        });
      } else {
        addCategory({
          tenantId: activeTenantId,
          name: catName,
          orderNum: Number(catOrderNum),
          icon: 'Utensils',
          translations: catAmharic ? { am: catAmharic } : undefined
        });
      }
      setCatStatusMessage({ type: 'success', text: '✓ Saved successfully.' });
      setTimeout(() => {
        setEditingCatId(null);
        setCatName('');
        setCatAmharic('');
        setShowCatModal(false);
        setCatStatusMessage(null);
      }, 700);
    } catch (err: any) {
      setCatStatusMessage({ type: 'error', text: err?.message || 'Error saving category.' });
    } finally {
      setIsSavingCat(false);
    }
  };

  const handleAddModifier = () => {
    if (!newModName) return;
    const parsedOptions = newModOptionStr.split(',').map((opt, idx) => {
      const [optName, optPrice] = opt.split(':');
      return {
        id: `opt-${Date.now()}-${idx}`,
        name: optName.trim(),
        price: Number(optPrice) || 0
      };
    });
    setItemModifiers(prev => [
      ...prev,
      {
        id: `mod-${Date.now()}`,
        name: newModName,
        minSelect: 1,
        maxSelect: 1,
        options: parsedOptions
      }
    ]);
    setNewModName('');
    setNewModOptionStr('');
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !itemCat || isSavingItem) return;
    setIsSavingItem(true);
    setItemStatusMessage(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 600)); // Network delay
      const payload = {
        categoryId: itemCat,
        tenantId: activeTenantId,
        name: itemName,
        description: itemDesc,
        price: Number(itemPrice),
        isAvailable: itemAvailability === 'Available',
        photoUrl: itemPhotoUrl || undefined,
        preparationStationId: itemStation || stations.find(s => s.branchId === activeBranchId)?.id || '',
        allergenTags: itemAllergens ? itemAllergens.split(',').map(a => a.trim()) : [],
        dietaryTags: itemDietary ? itemDietary.split(',').map(d => d.trim()) : [],
        modifiers: itemModifiers,
        translations: itemAmName ? {
          am: {
            name: itemAmName,
            description: itemAmDesc
          }
        } : undefined,
        prepTime: Number(itemPrepTime),
        availability: itemAvailability,
        featured: itemFeatured,
        recommended: itemRecommended,
        taxEnabled: itemTaxEnabled
      };

      if (editingItemId) {
        updateMenuItem({
          id: editingItemId,
          ...payload
        });
      } else {
        addMenuItem(payload);
      }
      setItemStatusMessage({ type: 'success', text: '✓ Saved successfully.' });
      setTimeout(() => {
        setEditingItemId(null);
        setItemName('');
        setItemDesc('');
        setItemPrice(100);
        setItemAmName('');
        setItemAmDesc('');
        setItemModifiers([]);
        setItemPhotoUrl('');
        setItemPrepTime(15);
        setItemAvailability('Available');
        setItemFeatured(false);
        setItemRecommended(false);
        setItemTaxEnabled(true);
        setShowItemModal(false);
        setItemStatusMessage(null);
      }, 700);
    } catch (err: any) {
      setItemStatusMessage({ type: 'error', text: err?.message || 'Error saving menu item.' });
    } finally {
      setIsSavingItem(false);
    }
  };

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableName) return;
    addTable({
      branchId: activeBranchId,
      number: tableName,
      section: tableSection,
      status: 'empty'
    });
    setTableName('');
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName || !staffEmail) return;
    addStaffMember({
      name: staffName,
      email: staffEmail,
      role: staffRole,
      tenantId: activeTenantId,
      branchId: activeBranchId,
      stationId: staffRole === 'kitchen' ? staffStation : undefined
    });
    setStaffName('');
    setStaffEmail('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Dinex SaaS Header with business switcher, branch select & brand registration */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded bg-indigo-50 px-2 py-0.5 text-[9px] font-extrabold text-indigo-700 uppercase tracking-wider border border-indigo-100/50">
              <Sparkles className="h-3 w-3 animate-spin-slow text-indigo-500" />
              Dinex SaaS Core
            </span>
            <span className="rounded bg-slate-200 px-2 py-0.5 text-[9px] font-extrabold text-slate-700 uppercase">
              {activeBusiness?.businessType || 'Restaurant'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="font-sans font-extrabold text-xl text-slate-900 tracking-tight">
              {activeBusiness?.name || tenant.name}
            </h1>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">
            Plan Tier: <strong className="capitalize text-slate-800">{activeBusiness?.ownerId === 'u-aisha' ? 'Growth' : 'Free'}</strong> | 
            Currency: <strong className="text-slate-700">{activeBusiness?.currency || tenant.currency}</strong> | 
            Owner ID: <span className="font-mono">{activeBusiness?.ownerId || 'u-unknown'}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Business Selector */}
          <div className="space-y-0.5">
            <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wide">Select Business</label>
            <select 
              value={activeBusiness?.id || ''}
              onChange={(e) => {
                const selectedId = e.target.value;
                if (selectedId) setActiveBusinessId(selectedId);
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm transition-all"
            >
              {businesses.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Branch Selector */}
          <div className="space-y-0.5">
            <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wide">Active Branch</label>
            <select 
              value={activeBranchId}
              onChange={(e) => setActiveBranchId(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm transition-all"
            >
              {branches.filter(b => b.tenantId === activeTenantId).map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Provision New Business Button */}
          <button 
            type="button"
            onClick={() => setShowCreateBizModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 text-white px-3.5 py-2 text-xs font-extrabold hover:bg-indigo-700 transition-colors shadow-sm mt-3.5"
            title="Register an additional brand or store under your membership"
          >
            <Plus className="h-4 w-4" />
            <span>New Business</span>
          </button>
        </div>
      </div>

      {/* Internal Subtabs Navigation */}
      <div className="flex border-b border-slate-100 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveSubTab('dashboard')}
          className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-bold transition-all shrink-0 ${
            activeSubTab === 'dashboard' 
              ? 'border-slate-900 text-slate-900' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Analytics</span>
          {tenant.subscriptionPlan === 'free' && (
            <span className="ml-1 rounded-full bg-amber-500/10 px-1.5 py-0.2 text-[8px] font-extrabold text-amber-600 border border-amber-500/20 uppercase tracking-tight">
              Upgrade
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('orders')}
          className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-bold transition-all shrink-0 ${
            activeSubTab === 'orders' 
              ? 'border-slate-900 text-slate-900' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <FileSpreadsheet className="h-4 w-4 text-indigo-600 animate-pulse" />
          <span>Order Manager</span>
          <span className="ml-1 rounded-full bg-indigo-500/10 px-1.5 py-0.2 text-[8px] font-extrabold text-indigo-600 border border-indigo-500/20 uppercase tracking-tight">
            Core Engine
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('menu')}
          className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-bold transition-all shrink-0 ${
            activeSubTab === 'menu' 
              ? 'border-slate-900 text-slate-900' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Utensils className="h-4 w-4" />
          <span>Menu Designer</span>
          <span className="ml-1 rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-[8px] font-extrabold text-emerald-600 border border-emerald-500/20 uppercase tracking-tight">
            Free
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('tables')}
          className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-bold transition-all shrink-0 ${
            activeSubTab === 'tables' 
              ? 'border-slate-900 text-slate-900' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <QrCode className="h-4 w-4" />
          <span>QR Tables</span>
          {tenant.subscriptionPlan === 'free' && (
            <span className="ml-1 rounded-full bg-amber-500/10 px-1.5 py-0.2 text-[8px] font-extrabold text-amber-600 border border-amber-500/20 uppercase tracking-tight">
              Upgrade
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('staff')}
          className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-bold transition-all shrink-0 ${
            activeSubTab === 'staff' 
              ? 'border-slate-900 text-slate-900' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Team Invites</span>
          {tenant.subscriptionPlan === 'free' && (
            <span className="ml-1 rounded-full bg-amber-500/10 px-1.5 py-0.2 text-[8px] font-extrabold text-amber-600 border border-amber-500/20 uppercase tracking-tight">
              Upgrade
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('payments')}
          className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-bold transition-all shrink-0 ${
            activeSubTab === 'payments' 
              ? 'border-slate-900 text-slate-900' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <CreditCard className="h-4 w-4" />
          <span>Payments</span>
        </button>

        <button
          onClick={() => setActiveSubTab('loyalty')}
          className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-bold transition-all shrink-0 ${
            activeSubTab === 'loyalty' 
              ? 'border-slate-900 text-slate-900' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Award className="h-4 w-4" />
          <span>Loyalty</span>
        </button>

        <button
          onClick={() => setActiveSubTab('subscriptions')}
          className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-bold transition-all shrink-0 ${
            activeSubTab === 'subscriptions' 
              ? 'border-slate-900 text-slate-900' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Subscriptions</span>
        </button>

        <button
          onClick={() => setActiveSubTab('reports')}
          className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-bold transition-all shrink-0 ${
            activeSubTab === 'reports' 
              ? 'border-slate-900 text-slate-900' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Reports</span>
        </button>

        <button
          onClick={() => setActiveSubTab('settings')}
          className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-bold transition-all shrink-0 ${
            activeSubTab === 'settings' 
              ? 'border-slate-900 text-slate-900' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>SaaS Plan</span>
        </button>
      </div>

      {/* SUBTAB CONTENTS */}
      
      {(tenant.subscriptionPlan === 'free' || tenant.subscriptionStatus === 'pending_approval') && (activeSubTab === 'tables' || activeSubTab === 'staff') ? (
        renderPaywall(
          activeSubTab === 'tables' ? 'QR Tables' : 'Team Invites',
          activeSubTab === 'tables'
            ? 'Generate QR codes for specific dining tables, manage service orders, and configure virtual table layouts.'
            : 'Invite waitstaff, kitchen chefs, managers, and cashiers to run your restaurant operations collaboratively.'
        )
      ) : (
        <>
          {/* 1. DYNAMIC DINEX DASHBOARD CORE */}
          {activeSubTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* TOP SUMMARY STRIP */}
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Branch Tickets</span>
                  <div className="text-lg font-extrabold text-slate-800">{branchOrders.length}</div>
                  <span className="text-[9px] text-slate-400 font-medium block">All-time totals</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Active Orders</span>
                  <div className="text-lg font-extrabold text-amber-600 flex items-center gap-1.5">
                    <span>{branchOrders.filter(o => ['pending', 'accepted', 'preparing', 'ready', 'served'].includes(o.status)).length}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping"></span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium block">Uncompleted queue</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Completed Gross</span>
                  <div className="text-lg font-extrabold text-slate-800">
                    {activeBusiness?.currency || tenant.currency} {branchOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0).toLocaleString()}
                  </div>
                  <span className="text-[9px] text-emerald-600 font-semibold block">Settled successfully</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Tips</span>
                  <div className="text-lg font-extrabold text-indigo-600">
                    {activeBusiness?.currency || tenant.currency} {branchOrders.reduce((sum, o) => sum + (o.tip || 0), 0).toLocaleString()}
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium block">Waiter tips collected</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Discounts</span>
                  <div className="text-lg font-extrabold text-rose-600">
                    {activeBusiness?.currency || tenant.currency} {branchOrders.reduce((sum, o) => sum + (o.discount || 0), 0).toLocaleString()}
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium block">Promo campaigns applied</span>
                </div>
              </div>

              {/* CONTROLS & CREATE ORDER ACTIONS */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-150">
                <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
                  <div className="relative w-full sm:w-48">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search #no or customer..."
                      value={orderSearchTerm}
                      onChange={(e) => setOrderSearchTerm(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 pl-8 pr-2.5 py-1.5 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <select
                    value={filterOrderType}
                    onChange={(e) => setFilterOrderType(e.target.value)}
                    className="rounded-lg border border-slate-200 p-1.5 text-xs font-bold text-slate-700 bg-white"
                  >
                    <option value="all">All Types</option>
                    <option value="dine_in">Dine In</option>
                    <option value="takeaway">Takeaway</option>
                    <option value="delivery">Delivery</option>
                    <option value="drive_through">Drive Through</option>
                    <option value="pickup">Pick Up</option>
                    <option value="meal_subscription">Meal Subscription</option>
                  </select>

                  <select
                    value={filterOrderStatus}
                    onChange={(e) => setFilterOrderStatus(e.target.value)}
                    className="rounded-lg border border-slate-200 p-1.5 text-xs font-bold text-slate-700 bg-white"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="served">Served</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <select
                    value={filterPaymentStatus}
                    onChange={(e) => setFilterPaymentStatus(e.target.value)}
                    className="rounded-lg border border-slate-200 p-1.5 text-xs font-bold text-slate-700 bg-white"
                  >
                    <option value="all">All Payments</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="partially_paid">Partially Paid</option>
                    <option value="refunded">Refunded</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setDraftOrderItems([]);
                    setShowCreateOrderModal(true);
                  }}
                  className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 flex items-center gap-1 cursor-pointer shrink-0 self-end sm:self-center shadow"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Order</span>
                </button>
              </div>

              {/* DUAL COLUMN SECTION */}
              <div className="grid gap-6 lg:grid-cols-3">
                
                {/* LEFT LIST PANEL */}
                <div className="lg:col-span-1 space-y-3">
                  <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
                      <h3 className="font-sans font-bold text-xs text-slate-700 uppercase tracking-wider">Branch Tickets Queue</h3>
                    </div>

                    <div className="divide-y divide-slate-100 max-h-[550px] overflow-y-auto">
                      {branchOrders
                        .filter(o => {
                          const matchesSearch = 
                            o.orderNum.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
                            (o.customerName || '').toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
                            (o.customerPhone || '').includes(orderSearchTerm);
                          const matchesType = filterOrderType === 'all' || o.type === filterOrderType;
                          const matchesStatus = filterOrderStatus === 'all' || o.status === filterOrderStatus;
                          const matchesPayment = filterPaymentStatus === 'all' || o.paymentStatus === filterPaymentStatus;
                          return matchesSearch && matchesType && matchesStatus && matchesPayment;
                        })
                        .map(o => (
                          <div 
                            key={o.id} 
                            onClick={() => setSelectedOrderDetail(o)}
                            className={`p-3.5 space-y-2 cursor-pointer transition-colors ${
                              selectedOrderDetail?.id === o.id ? 'bg-indigo-50/50' : 'hover:bg-slate-50/50'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-mono text-xs font-bold text-slate-900">#{o.orderNum}</span>
                                <span className="rounded bg-indigo-50 text-indigo-700 text-[8px] font-extrabold px-1.5 py-0.2 border border-indigo-100/50 uppercase ml-2">
                                  {o.type.replace('_', ' ')}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-semibold">{new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>

                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-xs font-bold text-slate-700">{o.customerName || 'Walk-in Guest'}</p>
                                <p className="text-[9px] text-slate-400 font-medium">Items: {o.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-extrabold text-slate-800">{activeBusiness?.currency || tenant.currency} {o.total.toLocaleString()}</p>
                                <span className={`rounded-full px-1.5 py-0.2 text-[8px] font-extrabold uppercase inline-block ${
                                  o.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                                  o.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                                  'bg-amber-100 text-amber-800'
                                }`}>
                                  {o.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}

                      {branchOrders.length === 0 && (
                        <div className="p-8 text-center text-slate-400 text-xs font-bold">
                          No orders registered in this branch yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT DETAIL PREVIEW */}
                <div className="lg:col-span-2">
                  {selectedOrderDetail ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-6">
                      
                      {/* RECEIPT HEADER */}
                      <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                        <div className="space-y-1">
                          <span className="text-[9px] font-extrabold bg-indigo-600 text-white rounded px-1.5 py-0.5 uppercase tracking-wider">
                            Order Receipt #{selectedOrderDetail.orderNum}
                          </span>
                          <h4 className="font-sans font-extrabold text-sm text-slate-900 pt-1">
                            {selectedOrderDetail.customerName || 'Walk-in Guest'}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-semibold">
                            Phone: {selectedOrderDetail.customerPhone || 'N/A'} | Table: {selectedOrderDetail.tableId ? tables.find(t => t.id === selectedOrderDetail.tableId)?.number || 'Table' : 'No Table'}
                          </p>
                        </div>

                        <div className="text-right space-y-1">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                            selectedOrderDetail.status === 'completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                            selectedOrderDetail.status === 'cancelled' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                            'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            Status: {selectedOrderDetail.status}
                          </span>
                          <p className="text-[10px] text-slate-400 font-mono">
                            Created: {new Date(selectedOrderDetail.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* ITEM DETAILS */}
                      <div className="space-y-3">
                        <h5 className="font-sans font-extrabold text-xs text-slate-400 uppercase tracking-wider">Order Items</h5>
                        <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-slate-50/30">
                          {selectedOrderDetail.items.map((it) => (
                            <div key={it.id} className="p-3 flex justify-between items-start text-xs font-semibold">
                              <div className="space-y-0.5">
                                <p className="text-slate-800 font-bold">{it.quantity}x {it.name}</p>
                                {it.selectedModifiers && it.selectedModifiers.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {it.selectedModifiers.map((mod, idx) => (
                                      <span key={idx} className="bg-slate-100 text-slate-500 rounded px-1 text-[9px]">
                                        +{mod.optionName}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <span className="text-slate-600 font-mono">{activeBusiness?.currency || tenant.currency} {((it.price + it.selectedModifiers.reduce((sum, m) => sum + m.price, 0)) * it.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CALCULATIONS BREAKDOWN */}
                      <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-xs font-semibold border border-slate-150">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Subtotal:</span>
                          <span className="text-slate-800 font-mono">{activeBusiness?.currency || tenant.currency} {selectedOrderDetail.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">VAT Tax ({tenant.baseTaxRate}%):</span>
                          <span className="text-slate-800 font-mono">{activeBusiness?.currency || tenant.currency} {selectedOrderDetail.tax.toLocaleString()}</span>
                        </div>
                        {selectedOrderDetail.serviceCharge > 0 && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Service Charge ({tenant.serviceCharge}%):</span>
                            <span className="text-slate-800 font-mono">{activeBusiness?.currency || tenant.currency} {selectedOrderDetail.serviceCharge.toLocaleString()}</span>
                          </div>
                        )}
                        {selectedOrderDetail.discount > 0 && (
                          <div className="flex justify-between text-rose-600 font-bold">
                            <span>Discount Campaign:</span>
                            <span className="font-mono">-{activeBusiness?.currency || tenant.currency} {selectedOrderDetail.discount.toLocaleString()}</span>
                          </div>
                        )}
                        {selectedOrderDetail.tip > 0 && (
                          <div className="flex justify-between text-indigo-600 font-bold">
                            <span>Recorded Waiter Tip:</span>
                            <span className="font-mono">+{activeBusiness?.currency || tenant.currency} {selectedOrderDetail.tip.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between border-t border-slate-200/80 pt-2 text-sm font-extrabold text-slate-950">
                          <span>Final Total Amount:</span>
                          <span className="font-mono">{activeBusiness?.currency || tenant.currency} {selectedOrderDetail.total.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* INTERACTIVE ACTIONS PARADIGM */}
                      <div className="space-y-3">
                        <h5 className="font-sans font-extrabold text-xs text-slate-400 uppercase tracking-wider">Operational Action Board</h5>
                        <div className="flex flex-wrap gap-2">
                          {selectedOrderDetail.status === 'pending' && (
                            <>
                              <button
                                onClick={() => {
                                  updateOrderStatus(selectedOrderDetail.id, 'accepted', 'Owner');
                                  showToast('Order Accepted.');
                                  setSelectedOrderDetail(prev => prev ? { ...prev, status: 'accepted' } : null);
                                }}
                                className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 cursor-pointer shadow-sm"
                              >
                                ✓ Accept Order
                              </button>
                              <button
                                onClick={() => {
                                  cancelOrder(selectedOrderDetail.id, 'Cancelled by Admin/Owner');
                                  showToast('Order Cancelled.', 'error');
                                  setSelectedOrderDetail(prev => prev ? { ...prev, status: 'cancelled' } : null);
                                }}
                                className="rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-4 py-2 cursor-pointer border border-rose-200"
                              >
                                ✕ Cancel Order
                              </button>
                            </>
                          )}

                          {selectedOrderDetail.status === 'accepted' && (
                            <button
                              onClick={() => {
                                updateOrderStatus(selectedOrderDetail.id, 'preparing', 'Owner');
                                showToast('Cooking commenced.');
                                setSelectedOrderDetail(prev => prev ? { ...prev, status: 'preparing' } : null);
                              }}
                              className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 cursor-pointer shadow-sm"
                            >
                              👨‍🍳 Start Cooking (Preparing)
                            </button>
                          )}

                          {selectedOrderDetail.status === 'preparing' && (
                            <button
                              onClick={() => {
                                updateOrderStatus(selectedOrderDetail.id, 'ready', 'Owner');
                                showToast('Dish is ready.');
                                setSelectedOrderDetail(prev => prev ? { ...prev, status: 'ready' } : null);
                              }}
                              className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 cursor-pointer shadow-sm"
                            >
                              🔔 Mark Ready
                            </button>
                          )}

                          {selectedOrderDetail.status === 'ready' && (
                            <button
                              onClick={() => {
                                updateOrderStatus(selectedOrderDetail.id, 'served', 'Owner');
                                showToast('Order served.');
                                setSelectedOrderDetail(prev => prev ? { ...prev, status: 'served' } : null);
                              }}
                              className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 cursor-pointer shadow-sm"
                            >
                              🍽️ Mark Served
                            </button>
                          )}

                          {selectedOrderDetail.status === 'served' && (
                            <button
                              onClick={() => {
                                updateOrderStatus(selectedOrderDetail.id, 'completed', 'Owner');
                                showToast('Ticket settled and complete.');
                                setSelectedOrderDetail(prev => prev ? { ...prev, status: 'completed' } : null);
                              }}
                              className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 cursor-pointer shadow-sm"
                            >
                              ✓ Settle &amp; Close Ticket
                            </button>
                          )}

                          {selectedOrderDetail.paymentStatus !== 'paid' && selectedOrderDetail.status !== 'cancelled' && (
                            <button
                              onClick={() => {
                                processPayment(selectedOrderDetail.id, 'cash', 0);
                                showToast('Payment marked as PAID.');
                                setSelectedOrderDetail(prev => prev ? { ...prev, paymentStatus: 'paid' } : null);
                              }}
                              className="rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs px-4 py-2 cursor-pointer"
                            >
                              💰 Force Settle Payment (Paid)
                            </button>
                          )}
                        </div>
                      </div>

                      {/* TIMELINE TRACK */}
                      <div className="space-y-3">
                        <h5 className="font-sans font-extrabold text-xs text-slate-400 uppercase tracking-wider">Audit Timeline Trace</h5>
                        <div className="relative border-l-2 border-slate-100 pl-4 space-y-4">
                          {(selectedOrderDetail.timeline || []).map((ev) => (
                            <div key={ev.id} className="relative">
                              <span className="absolute -left-5 top-1 h-2.5 w-2.5 rounded-full bg-indigo-600 border border-white"></span>
                              <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                                <span className="text-slate-800 font-bold">{ev.label}</span>
                                <span>{new Date(ev.time).toLocaleTimeString()}</span>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-0.5">{ev.desc} | Actor: {ev.actor || 'System'}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-400 font-bold text-xs">
                      Select an active order ticket to view receipts, calculate modifications, process advance payments, or trace audits.
                    </div>
                  )}
                </div>

              </div>

              {/* NEW ORDER CREATION MODAL */}
              {showCreateOrderModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm overflow-y-auto">
                  <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl border border-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
                    
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <h3 className="font-sans font-extrabold text-base text-slate-900 flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5 text-indigo-600" />
                        <span>Place New Order Ticket</span>
                      </h3>
                      <button 
                        onClick={() => setShowCreateOrderModal(false)}
                        className="rounded-lg p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <form onSubmit={handlePlaceOrderSubmit} className="space-y-6">
                      
                      {/* DRAFT ORDER METADATA */}
                      <div className="grid gap-4 sm:grid-cols-2 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Customer Name</label>
                          <input
                            type="text"
                            required
                            value={newOrderCustomer}
                            onChange={(e) => setNewOrderCustomer(e.target.value)}
                            placeholder="Guest Customer"
                            className="w-full rounded-lg border border-slate-200 p-2 text-xs font-semibold focus:border-indigo-400 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Customer Phone (Optional)</label>
                          <input
                            type="text"
                            value={newOrderPhone}
                            onChange={(e) => setNewOrderPhone(e.target.value)}
                            placeholder="e.g. +251 912345678"
                            className="w-full rounded-lg border border-slate-200 p-2 text-xs font-semibold focus:border-indigo-400 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Order Type</label>
                          <select
                            value={newOrderType}
                            onChange={(e) => setNewOrderType(e.target.value as any)}
                            className="w-full rounded-lg border border-slate-200 p-2 text-xs font-bold text-slate-700 bg-white"
                          >
                            <option value="dine_in">Dine In</option>
                            <option value="takeaway">Takeaway</option>
                            <option value="delivery">Delivery</option>
                            <option value="drive_through">Drive Through</option>
                            <option value="pickup">Pick Up</option>
                            <option value="meal_subscription">Meal Subscription</option>
                          </select>
                        </div>

                        {newOrderType === 'dine_in' ? (
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Select Dining Table</label>
                            <select
                              value={newOrderTableId}
                              onChange={(e) => setNewOrderTableId(e.target.value)}
                              className="w-full rounded-lg border border-slate-200 p-2 text-xs font-bold text-slate-700 bg-white"
                            >
                              <option value="">No Table Assignment</option>
                              {tenantBranchTables.map(t => (
                                <option key={t.id} value={t.id}>Table {t.number} ({t.section})</option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Pre-order Details</label>
                            <div className="p-2 bg-slate-50 rounded-lg text-[10px] text-slate-500 font-semibold border border-slate-100">
                              Guest pickup or home delivery ticket. No table reservation assigned.
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Assigned Waiter / Crew</label>
                          <select
                            value={newOrderWaiterId}
                            onChange={(e) => setNewOrderWaiterId(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 p-2 text-xs font-bold text-slate-700 bg-white"
                          >
                            <option value="">No Waiter</option>
                            {branchStaff.map(s => (
                              <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* ADD ITEM WORKFLOW */}
                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4">
                        <h4 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-wider">Item Builder & Modifiers</h4>
                        
                        <div className="grid gap-3 sm:grid-cols-3 items-end">
                          <div className="sm:col-span-2">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Menu Dish</label>
                            <select
                              value={currentDraftItem}
                              onChange={(e) => {
                                setCurrentDraftItem(e.target.value);
                                setSelectedModifiersDraft([]);
                              }}
                              className="w-full rounded-lg border border-slate-200 p-2 text-xs font-bold text-slate-700 bg-white"
                            >
                              <option value="">-- Choose Menu Item --</option>
                              {tenantItems.map(i => (
                                <option key={i.id} value={i.id}>{i.name} ({activeBusiness?.currency || tenant.currency} {i.price})</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Qty</label>
                            <input
                              type="number"
                              min={1}
                              value={currentDraftQty}
                              onChange={(e) => setCurrentDraftQty(Math.max(1, Number(e.target.value)))}
                              className="w-full rounded-lg border border-slate-200 p-2 text-xs font-bold focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* RENDER DYNAMIC MODIFIERS SELECT */}
                        {currentDraftItem && tenantItems.find(i => i.id === currentDraftItem)?.modifiers && (
                          <div className="space-y-3 pt-2 border-t border-slate-200/50">
                            {tenantItems.find(i => i.id === currentDraftItem)?.modifiers.map(g => (
                              <div key={g.id} className="space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">{g.name}</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {g.options.map(o => {
                                    const isChecked = selectedModifiersDraft.some(sm => sm.groupName === g.name && sm.optionName === o.name);
                                    return (
                                      <button
                                        key={o.id}
                                        type="button"
                                        onClick={() => {
                                          if (isChecked) {
                                            setSelectedModifiersDraft(prev => prev.filter(sm => !(sm.groupName === g.name && sm.optionName === o.name)));
                                          } else {
                                            let filtered = selectedModifiersDraft;
                                            if (g.maxSelect === 1) {
                                              filtered = selectedModifiersDraft.filter(sm => sm.groupName !== g.name);
                                            }
                                            setSelectedModifiersDraft([...filtered, { groupName: g.name, optionName: o.name, price: o.price }]);
                                          }
                                        }}
                                        className={`rounded-lg px-2.5 py-1 text-[11px] font-bold border transition-all cursor-pointer ${
                                          isChecked 
                                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm' 
                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                        }`}
                                      >
                                        {o.name} (+{tenant.currencySymbol} {o.price})
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={handleAddDraftItem}
                          disabled={!currentDraftItem}
                          className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold py-2 shadow transition-colors cursor-pointer"
                        >
                          + Append to Order Ticket
                        </button>
                      </div>

                      {/* DRAFT ITEMS TABLE */}
                      {draftOrderItems.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Selected Ticket Checklist</span>
                          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                            {draftOrderItems.map((it, idx) => (
                              <div key={it.id} className="p-3 bg-white flex justify-between items-center font-semibold">
                                <div>
                                  <span className="font-bold text-slate-900">{it.quantity}x {it.name}</span>
                                  {it.selectedModifiers.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {it.selectedModifiers.map((mod, mIdx) => (
                                        <span key={mIdx} className="bg-slate-100 text-[10px] text-slate-500 rounded px-1">
                                          +{mod.optionName}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-slate-800">{activeBusiness?.currency || tenant.currency} {((it.price + it.selectedModifiers.reduce((sum, m) => sum + m.price, 0)) * it.quantity).toLocaleString()}</span>
                                  <button
                                    type="button"
                                    onClick={() => setDraftOrderItems(prev => prev.filter((_, iIdx) => iIdx !== idx))}
                                    className="text-rose-600 p-1 hover:bg-rose-50 rounded cursor-pointer"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* DISCOUNTS, TIPS AND NOTES */}
                      <div className="grid gap-4 sm:grid-cols-3 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Discount Campaign</label>
                          <input
                            type="number"
                            min={0}
                            value={newOrderDiscount}
                            onChange={(e) => setNewOrderDiscount(Number(e.target.value))}
                            className="w-full rounded-lg border border-slate-200 p-2 text-xs font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Waiter Tip</label>
                          <input
                            type="number"
                            min={0}
                            value={newOrderTip}
                            onChange={(e) => setNewOrderTip(Number(e.target.value))}
                            className="w-full rounded-lg border border-slate-200 p-2 text-xs font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Kitchen / Delivery Notes</label>
                          <input
                            type="text"
                            value={newOrderNotes}
                            onChange={(e) => setNewOrderNotes(e.target.value)}
                            placeholder="e.g. No onion, fast prep"
                            className="w-full rounded-lg border border-slate-200 p-2 text-xs font-bold focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* MATH LIVE SUMMARY */}
                      {draftOrderItems.length > 0 && (
                        <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 text-xs font-bold space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Items Subtotal:</span>
                            <span className="text-slate-800 font-mono">{activeBusiness?.currency || tenant.currency} {draftSubtotal.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">VAT Tax ({tenant.baseTaxRate}%):</span>
                            <span className="text-slate-800 font-mono">{activeBusiness?.currency || tenant.currency} {draftTax.toLocaleString()}</span>
                          </div>
                          {tenant.serviceCharge > 0 && (
                            <div className="flex justify-between">
                              <span className="text-slate-400">Service Charge ({tenant.serviceCharge}%):</span>
                              <span className="text-slate-800 font-mono">{activeBusiness?.currency || tenant.currency} {draftServiceCharge.toLocaleString()}</span>
                            </div>
                          )}
                          {newOrderDiscount > 0 && (
                            <div className="flex justify-between text-rose-600">
                              <span>Campaign Discount:</span>
                              <span className="font-mono">-{activeBusiness?.currency || tenant.currency} {newOrderDiscount.toLocaleString()}</span>
                            </div>
                          )}
                          {newOrderTip > 0 && (
                            <div className="flex justify-between text-indigo-600">
                              <span>Added Tip:</span>
                              <span className="font-mono">+{activeBusiness?.currency || tenant.currency} {newOrderTip.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex justify-between border-t border-slate-200/80 pt-2 text-sm font-extrabold text-slate-900">
                            <span>Calculated Grand Total:</span>
                            <span className="font-mono">{activeBusiness?.currency || tenant.currency} {draftTotal.toLocaleString()}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end gap-2.5 border-t border-slate-100 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowCreateOrderModal(false)}
                          className="rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={draftOrderItems.length === 0}
                          className="rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold px-5 py-2 cursor-pointer shadow"
                        >
                          ✓ Submit &amp; Place Order Ticket
                        </button>
                      </div>

                    </form>

                  </div>
                </div>
              )}

            </div>
          )}

          {/* 1. DYNAMIC DINEX DASHBOARD CORE */}
          {activeSubTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Dynamic Overview banner */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-6 shadow-lg border border-slate-800 relative overflow-hidden">
                <div className="absolute right-0 top-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-2xl"></div>
                <div className="absolute left-1/3 bottom-0 h-20 w-20 bg-emerald-500/10 rounded-full blur-xl"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <span className="inline-flex items-center gap-1 bg-indigo-500/20 text-indigo-300 rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase border border-indigo-500/30">
                      <Sparkles className="h-3 w-3 text-indigo-400" />
                      Live Control Center
                    </span>
                    <h2 className="text-xl font-extrabold tracking-tight">Welcome back, Aisha!</h2>
                    <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                      Managing <strong>{businesses.length} active business portfolio</strong> with real-time analytics sync across your digital menu nodes.
                    </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 text-left min-w-[200px]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Portfolio Status</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-xs font-bold text-white">{businesses.length} Brands Provisioned</span>
                    </div>
                    <span className="text-[9px] text-slate-400 block mt-2">Active brand currency: {activeBusiness?.currency || 'ETB'}</span>
                  </div>
                </div>
              </div>

              {/* Real-time KPI Metric grid */}
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
                {/* Revenue card */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Net Revenue</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-extrabold text-slate-900">
                      {activeBusiness?.currency === 'ETB' ? 'Br' : '$'}{branchOrders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0).toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[9px] text-emerald-600 font-bold block bg-emerald-50 px-1.5 py-0.5 rounded w-fit">Live Paid</span>
                </div>

                {/* Today's Orders */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Today's Orders</span>
                  <div className="text-xl font-extrabold text-slate-900">
                    {branchOrders.length}
                  </div>
                  <span className="text-[9px] text-slate-400 block">Total ticket scans</span>
                </div>

                {/* Pending Orders */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Pending Orders</span>
                  <div className="text-xl font-extrabold text-amber-600 flex items-center gap-1.5">
                    <span>{branchOrders.filter(o => o.status === 'pending').length}</span>
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                  </div>
                  <span className="text-[9px] text-slate-400 block">Awaiting cashier accept</span>
                </div>

                {/* Preparing Orders */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Preparing Orders</span>
                  <div className="text-xl font-extrabold text-indigo-600">
                    {branchOrders.filter(o => o.status === 'preparing').length}
                  </div>
                  <span className="text-[9px] text-slate-400 block">Active station cooking</span>
                </div>

                {/* Completed Orders */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Completed Orders</span>
                  <div className="text-xl font-extrabold text-emerald-600">
                    {branchOrders.filter(o => o.status === 'completed').length}
                  </div>
                  <span className="text-[9px] text-slate-400 block">Settled & served</span>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {/* Quick Actions Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  <h3 className="font-sans font-extrabold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                    <span>Dinex Quick Actions</span>
                  </h3>
                  <div className="grid gap-2">
                    <button 
                      onClick={() => setActiveSubTab('menu')}
                      className="w-full text-left rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 p-3 hover:border-indigo-100 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Launch Menu Designer</span>
                        <p className="text-[9px] text-slate-400 mt-0.5">Configure items, modifiers, and stations</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <button 
                      onClick={() => setActiveSubTab('tables')}
                      className="w-full text-left rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 p-3 hover:border-indigo-100 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Deploy QR Coasters</span>
                        <p className="text-[9px] text-slate-400 mt-0.5">Generate high-fidelity table links</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <button 
                      onClick={() => setActiveSubTab('staff')}
                      className="w-full text-left rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 p-3 hover:border-indigo-100 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Invite Operations Staff</span>
                        <p className="text-[9px] text-slate-400 mt-0.5">Register chefs, waiters, and cashiers</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <button 
                      onClick={() => setActiveSubTab('settings')}
                      className="w-full text-left rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 p-3 hover:border-indigo-100 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Configure Feature Settings</span>
                        <p className="text-[9px] text-slate-400 mt-0.5">Manual toggle of Dinex core modules</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <button 
                      onClick={() => setShowCreateBizModal(true)}
                      className="w-full text-left rounded-xl border border-slate-100 bg-indigo-50/20 hover:bg-indigo-50/50 p-3 border-dashed hover:border-indigo-200 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <span className="text-xs font-bold text-indigo-950 block">Register Additional Brand</span>
                        <p className="text-[9px] text-indigo-600 mt-0.5">Provision a separate restaurant/café store</p>
                      </div>
                      <PlusCircle className="h-4.5 w-4.5 text-indigo-600 group-hover:scale-105 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* SaaS Feature Matrix Tracker */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 lg:col-span-2">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <h3 className="font-sans font-extrabold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="h-4 w-4 text-indigo-500" />
                      <span>Dinex SaaS Feature Matrix</span>
                    </h3>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Plan: {activeBusiness?.ownerId === 'u-aisha' ? 'Growth' : 'Free'}
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 text-xs">
                    {[
                      { name: 'Core Ordering Platform', prop: 'orderingEnabled', desc: 'Allows customer scanning and cashier order taking.' },
                      { name: 'Table QR Management', prop: 'tableManagementEnabled', desc: 'Custom branch physical table setups.' },
                      { name: 'Advance Reservations', prop: 'reservationEnabled', desc: 'Pre-book dining seats and arrival slots.', premium: true },
                      { name: 'Gamified Loyalty Rewards', prop: 'loyaltyEnabled', desc: 'Automatic points engine to retain diners.', premium: true },
                      { name: 'Dynamic Service Tips', prop: 'tipsEnabled', desc: 'Gratuities flow for waiters.', premium: true },
                      { name: 'Customer Portal Accounts', prop: 'customerAccountsEnabled', desc: 'Stored payment history and allergies.' },
                      { name: 'Kitchen Display (KDS)', prop: 'kitchenEnabled', desc: 'Real-time chef station dispatch terminals.', premium: true },
                      { name: 'Click-and-Collect Takeaway', prop: 'takeawayEnabled', desc: 'In-app ordering bypass for quick takeout.' },
                      { name: 'Direct Delivery Engine', prop: 'deliveryEnabled', desc: 'Local courier dispatch portal.', premium: true }
                    ].map((feat) => {
                      const settingsEnabled = activeSettings ? (activeSettings as any)[feat.prop] : true;
                      const planAllowed = isFeatureEnabled(feat.prop as any);
                      const fullyActive = planAllowed && settingsEnabled;

                      return (
                        <div key={feat.name} className="p-3 rounded-xl border border-slate-50 bg-slate-50/30 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">{feat.name}</span>
                            {fullyActive ? (
                              <span className="rounded bg-emerald-100 text-emerald-800 text-[8px] font-extrabold uppercase px-1.5 py-0.2 tracking-wider">
                                Active
                              </span>
                            ) : !planAllowed ? (
                              <span className="rounded bg-rose-50 text-rose-600 text-[8px] font-extrabold uppercase px-1.5 py-0.2 tracking-wider border border-rose-100">
                                Plan Restr.
                              </span>
                            ) : (
                              <span className="rounded bg-slate-200 text-slate-600 text-[8px] font-extrabold uppercase px-1.5 py-0.2 tracking-wider">
                                Disabled
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 leading-normal">{feat.desc}</p>
                          <div className="pt-1 flex items-center justify-between text-[9px]">
                            <span className="text-slate-400">Settings Switch: {settingsEnabled ? 'ON' : 'OFF'}</span>
                            {!planAllowed && (
                              <button 
                                onClick={() => setActiveSubTab('settings')}
                                className="text-indigo-600 font-bold hover:underline"
                              >
                                Upgrade Tier
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          )}

      {/* 2. MENU DESIGNER */}
      {activeSubTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-sm text-slate-800">Branch Categories & Dishes</h3>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingCatId(null);
                  setCatName('');
                  setCatAmharic('');
                  setCatOrderNum(tenantCategories.length + 1);
                  setCatStatusMessage(null);
                  setShowCatModal(true);
                }}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Category</span>
              </button>
              <button
                onClick={() => {
                  if (tenantCategories.length === 0) {
                    showToast('Please create a category first!', 'error');
                    return;
                  }
                  setEditingItemId(null);
                  setItemName('');
                  setItemDesc('');
                  setItemPrice(100);
                  setItemCat(tenantCategories[0].id);
                  setItemStation(stations.filter(s => s.branchId === activeBranchId)[0]?.id || '');
                  setItemAllergens('');
                  setItemDietary('');
                  setItemAmName('');
                  setItemAmDesc('');
                  setItemModifiers([]);
                  setNewModName('');
                  setNewModOptionStr('');
                  setItemPhotoUrl('');
                  setItemPrepTime(15);
                  setItemAvailability('Available');
                  setItemFeatured(false);
                  setItemRecommended(false);
                  setItemTaxEnabled(true);
                  setItemStatusMessage(null);
                  setShowItemModal(true);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Menu Item</span>
              </button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            
            {/* Categories list */}
            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm space-y-3">
              <h4 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-wider">Active Categories</h4>
              <div className="space-y-2">
                {tenantCategories.map((cat, catIdx) => {
                  const isDisabled = disabledCategoryIds.includes(cat.id);
                  return (
                    <div key={cat.id} className={`flex items-center justify-between rounded-lg p-2.5 border transition-all ${
                      isDisabled ? 'bg-slate-100/70 border-slate-200/60 opacity-75' : 'bg-slate-50 border-transparent hover:border-slate-200'
                    }`}>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-xs font-bold ${isDisabled ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{cat.name}</span>
                          {isDisabled && (
                            <span className="bg-amber-100 text-amber-800 text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                              Disabled
                            </span>
                          )}
                        </div>
                        {cat.translations?.am && (
                          <span className="text-[10px] text-slate-400 block">አማርኛ: {cat.translations.am}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Reorder Up */}
                        <button
                          type="button"
                          disabled={catIdx === 0}
                          onClick={() => handleMoveCategory(cat.id, 'up')}
                          className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move Up"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        {/* Reorder Down */}
                        <button
                          type="button"
                          disabled={catIdx === tenantCategories.length - 1}
                          onClick={() => handleMoveCategory(cat.id, 'down')}
                          className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move Down"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>

                        {/* Enable/Disable Toggle */}
                        <button
                          type="button"
                          onClick={() => {
                            handleToggleCategoryDisable(cat.id);
                            showToast('✓ Category status updated.');
                          }}
                          className={`rounded p-1 transition-colors ${
                            isDisabled ? 'text-amber-600 hover:bg-amber-100/50' : 'text-slate-400 hover:bg-slate-200 hover:text-slate-700'
                          }`}
                          title={isDisabled ? 'Enable Category' : 'Disable Category'}
                        >
                          {isDisabled ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" /> }
                        </button>

                        <button 
                          onClick={() => {
                            setEditingCatId(cat.id);
                            setCatName(cat.name);
                            setCatAmharic(cat.translations?.am || '');
                            setCatOrderNum(cat.orderNum);
                            setShowCatModal(true);
                          }}
                          className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-indigo-600 transition-colors"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: 'Delete Menu Category',
                              message: `Are you sure you want to delete the category "${cat.name}"? This action cannot be undone.`,
                              onConfirm: () => {
                                deleteCategory(activeTenantId, cat.id);
                                setConfirmDialog(null);
                                showToast('✓ Deleted successfully.');
                              }
                            });
                          }}
                          className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-wider">Dishes & Pricing</h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {tenantItems.map((item) => {
                  const itemCatObj = tenantCategories.find(c => c.id === item.categoryId);
                  return (
                    <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-all duration-200">
                      <div className="flex gap-3">
                        {item.photoUrl && (
                          <img 
                            src={item.photoUrl} 
                            alt={item.name}
                            className="h-14 w-14 rounded-lg object-cover border border-slate-100 shrink-0"
                          />
                        )}
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0">
                              <span className="text-[9px] font-bold text-slate-400 uppercase">{itemCatObj?.name || 'Uncategorized'}</span>
                              <h5 className="text-xs font-bold text-slate-900 mt-0.5 truncate">{item.name}</h5>
                              {item.translations?.am?.name && (
                                <span className="text-[10px] text-slate-400 block font-semibold truncate">አማርኛ: {item.translations.am.name}</span>
                              )}
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.featured && (
                                  <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                                    ★ Featured
                                  </span>
                                )}
                                {item.recommended && (
                                  <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                                    👍 Recommended
                                  </span>
                                )}
                                {(item.availability === 'Sold Out' || item.isAvailable === false) && (
                                  <span className="bg-rose-50 border border-rose-100 text-rose-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                                    Sold Out
                                  </span>
                                )}
                                {item.availability === 'Hidden' && (
                                  <span className="bg-slate-100 border border-slate-200 text-slate-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                                    Hidden
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="font-mono text-xs font-bold text-slate-800 shrink-0">{tenant.currencySymbol} {item.price}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{item.description}</p>
                          
                          {(item.modifiers || []).length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {(item.modifiers || []).map(mod => (
                                <span key={mod.id} className="rounded-md bg-amber-50 border border-amber-100 px-1.5 py-0.5 text-[9px] font-semibold text-amber-800">
                                  + {mod.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-slate-100 mt-3 pt-2 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-medium">Station: {stations.find(s => s.id === item.preparationStationId)?.name || 'None'}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingItemId(item.id);
                              setItemName(item.name);
                              setItemDesc(item.description);
                              setItemPrice(item.price);
                              setItemCat(item.categoryId);
                              setItemStation(item.preparationStationId);
                              setItemAllergens(item.allergenTags.join(', '));
                              setItemDietary(item.dietaryTags.join(', '));
                              setItemAmName(item.translations?.am?.name || '');
                              setItemAmDesc(item.translations?.am?.description || '');
                              setItemModifiers(item.modifiers || []);
                              setItemPhotoUrl(item.photoUrl || '');
                              setItemPrepTime(item.prepTime || 15);
                              setItemAvailability(item.availability || (item.isAvailable !== false ? 'Available' : 'Sold Out'));
                              setItemFeatured(!!item.featured);
                              setItemRecommended(!!item.recommended);
                              setItemTaxEnabled(item.taxEnabled !== false);
                              setShowItemModal(true);
                            }}
                            className="rounded p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setConfirmDialog({
                                isOpen: true,
                                title: 'Delete Menu Dish',
                                message: `Are you sure you want to delete the menu item "${item.name}"? This action cannot be undone.`,
                                onConfirm: () => {
                                  deleteMenuItem(activeTenantId, item.id);
                                  setConfirmDialog(null);
                                  showToast('✓ Deleted successfully.');
                                }
                              });
                            }}
                            className="rounded p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* ADD/EDIT CATEGORY MODAL */}
          {showCatModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
              <form onSubmit={handleAddCategory} className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl border border-slate-100 space-y-4">
                <h4 className="font-sans font-bold text-sm text-slate-900 border-b border-slate-50 pb-2">
                  {editingCatId ? 'Edit Menu Category' : 'Add Menu Category'}
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">English Category Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Traditional Stews"
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Amharic Translation (Optional)</label>
                    <input
                      type="text"
                      placeholder="አማርኛ (e.g., ባህላዊ ወጦች)"
                      value={catAmharic}
                      onChange={(e) => setCatAmharic(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium focus:ring-1 focus:ring-slate-900 font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Sort Order Rank</label>
                    <input
                      type="number"
                      value={catOrderNum}
                      onChange={(e) => setCatOrderNum(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
                    />
                  </div>
                </div>

                {catStatusMessage && (
                  <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-1.5 ${
                    catStatusMessage.type === 'success' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {catStatusMessage.type === 'success' ? '✓' : '⚠️'} {catStatusMessage.text}
                  </div>
                )}

                <div className="flex justify-end gap-2 border-t border-slate-50 pt-3">
                  <button type="button" onClick={() => setShowCatModal(false)} className="rounded-lg border px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="rounded-lg bg-slate-950 text-white px-4 py-1.5 text-xs font-bold hover:bg-slate-800">Save</button>
                </div>
              </form>
            </div>
          )}

          {/* ADD/EDIT MENU ITEM MODAL */}
          {showItemModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
              <form onSubmit={handleAddItem} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl border border-slate-100 max-h-[85vh] overflow-y-auto space-y-4">
                <h4 className="font-sans font-bold text-sm text-slate-900 border-b border-slate-50 pb-2">
                  {editingItemId ? 'Edit Dish / Drink' : 'Create New Dish / Drink'}
                </h4>
                
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Dish Name (EN)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Tibs Platter"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Price ({tenant.currencySymbol})</label>
                      <input
                        type="number"
                        required
                        value={itemPrice}
                        onChange={(e) => setItemPrice(Number(e.target.value))}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">English Description</label>
                    <textarea
                      placeholder="Describe flavors, ingredients..."
                      value={itemDesc}
                      onChange={(e) => setItemDesc(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium min-h-[50px]"
                    />
                  </div>

                  {/* Device Image Upload Component */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Dish / Drink Image</label>
                    {itemPhotoUrl ? (
                      <div className="mt-1 relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-video flex items-center justify-center">
                        <img 
                          src={itemPhotoUrl} 
                          alt="Dish Preview" 
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setItemPhotoUrl('')}
                          className="absolute top-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white p-1.5 rounded-full shadow-md hover:scale-105 transition-all cursor-pointer"
                          title="Remove image"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const file = e.dataTransfer.files?.[0];
                          if (file) {
                            handleFileLoad(file);
                          }
                        }}
                        onClick={() => {
                          document.getElementById('dish-image-uploader')?.click();
                        }}
                        className="mt-1 border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 bg-slate-50 hover:bg-indigo-50/10 cursor-pointer transition-all group"
                      >
                        <Upload className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        <div className="text-center">
                          <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600">Upload from device</span>
                          <p className="text-[9px] text-slate-400 mt-0.5">Drag and drop, or click to browse files</p>
                        </div>
                        <input 
                          type="file" 
                          id="dish-image-uploader" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileLoad(file);
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Amharic Title (አማርኛ)</label>
                      <input
                        type="text"
                        placeholder="ልዩ ጥብስ"
                        value={itemAmName}
                        onChange={(e) => setItemAmName(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Amharic Description</label>
                      <input
                        type="text"
                        placeholder="በትኩስ መሶብ የሚቀርብ..."
                        value={itemAmDesc}
                        onChange={(e) => setItemAmDesc(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Select Category</label>
                      <select
                        required
                        value={itemCat}
                        onChange={(e) => setItemCat(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
                      >
                        {tenantCategories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">KDS Routing Station</label>
                      <select
                        value={itemStation}
                        onChange={(e) => setItemStation(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
                      >
                        {stations.filter(s => s.branchId === activeBranchId).map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Allergen Tags (comma-sep)</label>
                      <input
                        type="text"
                        placeholder="Dairy, Gluten, Nuts"
                        value={itemAllergens}
                        onChange={(e) => setItemAllergens(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Dietary Tags (comma-sep)</label>
                      <input
                        type="text"
                        placeholder="Vegan, Halal, Spicy"
                        value={itemDietary}
                        onChange={(e) => setItemDietary(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
                      />
                    </div>
                  </div>

                  {/* Modifiers Generator */}
                  <div className="border-t border-slate-100 pt-3 space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Item Modifiers (e.g. Extra toppings)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Option Name (e.g. Extra Teff)"
                        value={newModName}
                        onChange={(e) => setNewModName(e.target.value)}
                        className="w-1/3 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Value list (Label:Price, Label2:Price)"
                        value={newModOptionStr}
                        onChange={(e) => setNewModOptionStr(e.target.value)}
                        className="w-2/3 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
                      />
                      <button
                        type="button"
                        onClick={handleAddModifier}
                        className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-200"
                      >
                        Add
                      </button>
                    </div>

                    <div className="space-y-1">
                      {itemModifiers.map((mod) => (
                        <div key={mod.id} className="flex justify-between items-center bg-amber-50/50 rounded p-1.5 text-[10px]">
                          <span><strong className="text-amber-800">{mod.name}:</strong> {mod.options.map(o => `${o.name} (+${o.price})`).join(', ')}</span>
                          <button 
                            type="button" 
                            onClick={() => setItemModifiers(prev => prev.filter(p => p.id !== mod.id))}
                            className="text-slate-400 hover:text-rose-600 font-bold"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Advanced Item Attributes */}
                  <div className="border-t border-slate-100 pt-3 space-y-3">
                    <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Advanced Attributes</h5>
                    
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Prep Time (mins)</label>
                        <input
                          type="number"
                          min="1"
                          value={itemPrepTime}
                          onChange={(e) => setItemPrepTime(Number(e.target.value))}
                          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Availability State</label>
                        <select
                          value={itemAvailability}
                          onChange={(e) => setItemAvailability(e.target.value as any)}
                          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium bg-white"
                        >
                          <option value="Available">Available / Active</option>
                          <option value="Sold Out">Sold Out / Out of Stock</option>
                          <option value="Hidden">Hidden / Unlisted</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-1.5">
                      <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={itemFeatured}
                          onChange={(e) => setItemFeatured(e.target.checked)}
                          className="rounded border-slate-300 text-indigo-600 h-3.5 w-3.5 cursor-pointer"
                        />
                        <span>★ Featured Dish</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={itemRecommended}
                          onChange={(e) => setItemRecommended(e.target.checked)}
                          className="rounded border-slate-300 text-indigo-600 h-3.5 w-3.5 cursor-pointer"
                        />
                        <span>👍 Recommended</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={itemTaxEnabled}
                          onChange={(e) => setItemTaxEnabled(e.target.checked)}
                          className="rounded border-slate-300 text-indigo-600 h-3.5 w-3.5 cursor-pointer"
                        />
                        <span>Tax Enabled (15% VAT)</span>
                      </label>
                    </div>
                  </div>

                </div>

                {itemStatusMessage && (
                  <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-1.5 ${
                    itemStatusMessage.type === 'success' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {itemStatusMessage.type === 'success' ? '✓' : '⚠️'} {itemStatusMessage.text}
                  </div>
                )}

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                  <button type="button" onClick={() => setShowItemModal(false)} className="rounded-lg border px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 cursor-pointer">Cancel</button>
                  <button type="submit" disabled={isSavingItem} className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 text-xs font-bold transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed">
                    {isSavingItem ? 'Saving...' : 'Save Item'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      )}

      {/* 3. TABLES & QR ENGINE */}
      {activeSubTab === 'tables' && (
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Create Table Card */}
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm space-y-4 h-fit">
            <h3 className="font-sans font-bold text-sm text-slate-800">Table & Coaster Generator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Instantly add dine-in tables. MenuFlow generates fully scannable vector links mapping the tenant ID and table mapping.</p>
            
            <form onSubmit={handleAddTable} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Table Label/Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Table 12, Patio Seat 2"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Restaurant Section</label>
                <select
                  value={tableSection}
                  onChange={(e) => setTableSection(e.target.value as any)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
                >
                  <option value="Indoor">Indoor Dining</option>
                  <option value="Outdoor">Outdoor Garden</option>
                  <option value="Terrace">Terrace Lounge</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-slate-950 text-white py-2 text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Provision Table QR
              </button>
            </form>
          </div>

          {/* Active Tables Grid */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-wider">Branch Table Coasters ({tenantBranchTables.length})</h4>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {tenantBranchTables.map((table) => (
                <div key={table.id} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-sans font-bold text-sm text-slate-900">{table.number}</h5>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 uppercase mt-1 inline-block">
                        {table.section}
                      </span>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      table.status === 'eating' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : table.status === 'waiting' 
                        ? 'bg-amber-50 text-amber-700' 
                        : 'bg-slate-50 text-slate-600'
                    }`}>
                      {table.status}
                    </span>
                  </div>

                  {/* Coaster Rendering */}
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white p-1 border border-slate-100 shadow-sm">
                      {/* Simulated high fidelity QR matrix */}
                      <div className="grid grid-cols-4 gap-1 w-full h-full p-0.5">
                        <div className="bg-slate-900 rounded-[2px]"></div>
                        <div className="bg-slate-900 rounded-[2px]"></div>
                        <div className="bg-slate-900 rounded-[2px]"></div>
                        <div className="bg-slate-200 rounded-[2px]"></div>
                        <div className="bg-slate-900 rounded-[2px]"></div>
                        <div className="bg-slate-100 rounded-[2px]"></div>
                        <div className="bg-slate-900 rounded-[2px]"></div>
                        <div className="bg-slate-900 rounded-[2px]"></div>
                        <div className="bg-slate-900 rounded-[2px]"></div>
                        <div className="bg-slate-900 rounded-[2px]"></div>
                        <div className="bg-slate-100 rounded-[2px]"></div>
                        <div className="bg-slate-900 rounded-[2px]"></div>
                        <div className="bg-slate-200 rounded-[2px]"></div>
                        <div className="bg-slate-900 rounded-[2px]"></div>
                        <div className="bg-slate-900 rounded-[2px]"></div>
                        <div className="bg-slate-900 rounded-[2px]"></div>
                      </div>
                    </div>
                    
                    <div className="text-[10px] space-y-0.5">
                      <p className="font-bold text-slate-800">Scan Table Coaster</p>
                      <p className="font-mono text-[9px] text-slate-400 tracking-tight line-clamp-1">{table.qrUrl}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      showToast(`Generated print PDF bundle for ${table.number}.`);
                    }}
                    className="w-full rounded bg-slate-50 border border-slate-100 hover:bg-slate-100 text-[10px] font-bold text-slate-700 py-1 transition-colors"
                  >
                    Download Vector PDF Coaster
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 4. TEAM INVITES & ROLES */}
      {activeSubTab === 'staff' && (
        <div className="space-y-6">
          
          {/* Sub Navigation */}
          <div className="flex border-b border-slate-100 pb-1 gap-4 overflow-x-auto">
            <button
              onClick={() => setStaffViewTab('roster')}
              className={`pb-2.5 text-xs font-bold border-b-2 transition-colors shrink-0 ${
                staffViewTab === 'roster' 
                  ? 'border-indigo-600 text-indigo-600 font-extrabold' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Operational Roster & Invites
            </button>
            <button
              onClick={() => setStaffViewTab('roles')}
              className={`pb-2.5 text-xs font-bold border-b-2 transition-colors shrink-0 ${
                staffViewTab === 'roles' 
                  ? 'border-indigo-600 text-indigo-600 font-extrabold' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Staff Permission Management
            </button>
          </div>

          {staffViewTab === 'roster' ? (
            <div className="grid gap-6 lg:grid-cols-3">
              
              {/* Invite Form */}
              <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm space-y-4 h-fit">
                <h3 className="font-sans font-bold text-sm text-slate-800">Invite Operational Staff</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Add team members to specific access groups. They can login instantly with their email credentials.</p>
                
                <form onSubmit={handleAddStaff} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Samuel Abera"
                      value={staffName}
                      onChange={(e) => setStaffName(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium focus:border-slate-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Operational Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="staff@menuflow.com"
                      value={staffEmail}
                      onChange={(e) => setStaffEmail(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium focus:border-slate-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Operational Role</label>
                    <select
                      value={staffRole}
                      onChange={(e: any) => setStaffRole(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium bg-white focus:outline-none focus:border-slate-400"
                    >
                      <optgroup label="Standard Roles">
                        <option value="waiter">Floor Waiter</option>
                        <option value="cashier">Cashier Operator</option>
                        <option value="kitchen">Kitchen Staff (KDS)</option>
                        <option value="manager">Branch Operations Manager</option>
                      </optgroup>
                      {customRoles.filter(cr => cr.businessId === activeTenantId).length > 0 && (
                        <optgroup label="Custom Access Roles (Dinex Core)">
                          {customRoles.filter(cr => cr.businessId === activeTenantId).map(cr => (
                            <option key={cr.id} value={cr.id}>{cr.name}</option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  </div>

                  {staffRole === 'kitchen' && (
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Assign KDS Station</label>
                      <select
                        value={staffStation}
                        onChange={(e) => setStaffStation(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium bg-white focus:outline-none"
                      >
                        <option value="">Choose preparation target...</option>
                        {stations.filter(s => s.branchId === activeBranchId).map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-slate-950 text-white py-2 text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    Send Invitation Token
                  </button>
                </form>
              </div>

              {/* Invited Staff Table */}
              <div className="lg:col-span-2 space-y-4">
                <h4 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-wider">Branch Roster list ({branchStaff.length})</h4>
                
                <div className="rounded-xl border border-slate-100 bg-white overflow-hidden shadow-sm">
                  <div className="divide-y divide-slate-100">
                    {branchStaff.map((member) => {
                      const displayRoleName = (roleVal: string) => {
                        const foundCustom = customRoles.find(cr => cr.id === roleVal && cr.businessId === activeTenantId);
                        if (foundCustom) return foundCustom.name;
                        return roleVal.replace('_', ' ');
                      };

                      return (
                        <div key={member.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-950">{member.name}</span>
                              <span className="rounded bg-indigo-50 border border-indigo-100/40 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700 uppercase">
                                {displayRoleName(member.role)}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">{member.email}</p>
                            {member.stationId && (
                              <p className="text-[9px] font-semibold text-amber-700 mt-1">Station: {stations.find(s => s.id === member.stationId)?.name}</p>
                            )}
                          </div>

                          <button
                            onClick={() => {
                              const nextStateStr = member.active ? 'suspend/deactivate' : 'reactivate';
                              setConfirmDialog({
                                isOpen: true,
                                title: `${member.active ? 'Suspend' : 'Reactivate'} Staff Member`,
                                message: `Are you sure you want to ${nextStateStr} "${member.name}"? This will modify their login credentials immediately.`,
                                onConfirm: () => {
                                  toggleStaffStatus(member.id);
                                  setConfirmDialog(null);
                                }
                              });
                            }}
                            className={`rounded px-2.5 py-1 text-[10px] font-bold border transition-colors cursor-pointer ${
                              member.active 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100' 
                                : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {member.active ? 'Active' : 'Suspended'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* Staff Permission Management Tab */
            <div>
              {!can('staff.manage') ? (
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-6 text-center space-y-3">
                  <ShieldAlert className="h-8 w-8 text-rose-500 mx-auto animate-pulse" />
                  <h4 className="font-sans font-bold text-xs text-slate-850">Access Restriction Policy</h4>
                  <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                    You do not have the <strong>"staff.manage"</strong> permission required to manage staff credentials and permissions. Please request delegation permissions from your owner.
                  </p>
                </div>
              ) : currentBusinessEmployees.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center bg-white shadow-sm space-y-3">
                  <Users className="h-10 w-10 text-slate-300 mx-auto" />
                  <h4 className="font-sans font-bold text-sm text-slate-700">No Operational Staff Registered</h4>
                  <p className="text-xs text-slate-450 max-w-xs mx-auto">
                    Your business does not have any operational employees yet. Please navigate to the <strong>"Operational Roster & Invites"</strong> tab to invite your first employee.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 lg:grid-cols-3">
                  
                  {/* Left Sidebar: Selection & Presets */}
                  <div className="space-y-4 lg:col-span-1">
                    
                    {/* Owner Notification Banner */}
                    <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 text-xs text-amber-800 leading-relaxed space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Shield className="h-4 w-4 text-amber-600" />
                        <span>Owner Policy Guard active</span>
                      </div>
                      <p className="text-[11px] text-amber-700">
                        Owners always possess <strong>do.all</strong> master permissions automatically. To protect platform integrity, owners are excluded from edit selectors and cannot have their clearances downgraded.
                      </p>
                    </div>

                    {/* Staff Selector */}
                    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5">1. Select Employee</label>
                        {/* Search Input Box */}
                        <div className="relative mb-2">
                          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Type to search staff..."
                            value={staffPermSearchQuery}
                            onChange={(e) => setStaffPermSearchQuery(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 bg-slate-50/50"
                          />
                        </div>
                        <select
                          value={selectedPermissionStaffId}
                          onChange={(e) => {
                            setSelectedPermissionStaffId(e.target.value);
                            setPermStatusMessage(null);
                          }}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold bg-white focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                        >
                          {(() => {
                            const filtered = currentBusinessEmployees.filter(emp =>
                              emp.name.toLowerCase().includes(staffPermSearchQuery.toLowerCase()) ||
                              emp.email.toLowerCase().includes(staffPermSearchQuery.toLowerCase()) ||
                              emp.role.toLowerCase().includes(staffPermSearchQuery.toLowerCase())
                            );
                            if (filtered.length === 0) {
                              return <option value="">No matching employee</option>;
                            }
                            return filtered.map((emp) => (
                              <option key={emp.id} value={emp.id}>
                                {emp.name} ({emp.role.replace('_', ' ')})
                              </option>
                            ));
                          })()}
                        </select>
                      </div>

                      {/* Selected Employee Info */}
                      {(() => {
                        const activeEmp = currentBusinessEmployees.find(s => s.id === selectedPermissionStaffId);
                        if (!activeEmp) return null;
                        return (
                          <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                                {activeEmp.name.charAt(0)}
                              </div>
                              <div className="text-[11px]">
                                <span className="font-bold text-slate-800 block leading-tight">{activeEmp.name}</span>
                                <span className="text-slate-400 block mt-0.5">{activeEmp.email}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center text-[10px] pt-2 border-t border-slate-200/60">
                              <span className="text-slate-400">Current Role:</span>
                              <span className="font-extrabold text-indigo-600 uppercase tracking-wider text-[9px] bg-indigo-50 px-1.5 py-0.5 rounded">
                                {activeEmp.role.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Built-in Templates */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-50">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">2. Choose Permission Template</label>
                        <p className="text-[10px] text-slate-400 leading-relaxed mb-2">Apply a pre-configured baseline of clearances. This will overwrite current checkboxes.</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { key: 'manager', label: 'Manager' },
                            { key: 'cashier', label: 'Cashier' },
                            { key: 'waiter', label: 'Waiter' },
                            { key: 'kitchen', label: 'Kitchen Staff' },
                            { key: 'receptionist', label: 'Receptionist' },
                            { key: 'custom', label: 'Custom' }
                          ].map(tpl => {
                            const isActive = selectedTemplate === tpl.key;
                            return (
                              <button
                                key={tpl.key}
                                type="button"
                                onClick={() => handleTemplateChange(tpl.key)}
                                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all text-center ${
                                  isActive
                                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                {tpl.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Right Column: Permission Matrix Grid */}
                  <div className="lg:col-span-2 space-y-4">
                    
                    <form onSubmit={handleSaveStaffPermissions} className="space-y-4">
                      
                      {/* Form Header Action Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                        <div className="text-xs">
                          <h4 className="font-bold text-slate-800">Clearances and Access Bounds</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">Toggle specific functional paths for the selected crew member.</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              const activeEmp = currentBusinessEmployees.find(s => s.id === selectedPermissionStaffId);
                              if (activeEmp) {
                                setSelectedStaffPermissions(activeEmp.permissions || getStaffDefaultRolePermissions(activeEmp.role));
                              }
                              setPermStatusMessage(null);
                            }}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                          >
                            Cancel Changes
                          </button>
                          <button
                            type="submit"
                            disabled={isSavingPerms}
                            className="rounded-lg bg-indigo-600 text-white px-4 py-1.5 text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed"
                          >
                            {isSavingPerms ? 'Saving...' : 'Save Permissions'}
                          </button>
                        </div>
                      </div>

                      {/* Master Bypass Selector Banner */}
                      {(() => {
                        const isDoAll = selectedStaffPermissions.includes('do.all');
                        return (
                          <label className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                            isDoAll 
                              ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900' 
                              : 'bg-white border-slate-100 text-slate-700 hover:border-indigo-100'
                          }`}>
                            <input
                              type="checkbox"
                              checked={isDoAll}
                              onChange={handleToggleDoAll}
                              className="mt-1 h-4 w-4 rounded border-slate-350 text-indigo-600 focus:ring-indigo-500 shrink-0"
                            />
                            <div className="text-xs leading-tight">
                              <span className="font-extrabold text-slate-900 block flex items-center gap-1.5">
                                Allow Everything (do.all)
                                <span className="rounded bg-indigo-100 text-indigo-800 text-[8px] font-extrabold px-1.5 py-0.5 uppercase tracking-wider">
                                  MASTER CLEARANCE
                                </span>
                              </span>
                              <span className={`text-[10.5px] mt-1 block leading-relaxed ${isDoAll ? 'text-indigo-700' : 'text-slate-400'}`}>
                                Supercharge credentials with full administrative bypass. When active, all individual module permissions are fully authorized automatically and checkboxes are locked to active.
                              </span>
                            </div>
                          </label>
                        );
                      })()}

                      {/* Status Alerts */}
                      {permStatusMessage && (
                        <div className={`p-3 rounded-lg text-xs font-medium flex items-center gap-1.5 animate-in fade-in duration-200 ${
                          permStatusMessage.type === 'success' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {permStatusMessage.type === 'success' ? '✓' : '⚠️'} {permStatusMessage.text}
                        </div>
                      )}

                      {/* Permissions Bento Grid */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        {PERMISSION_MODULES.map((mod) => {
                          return (
                            <div key={mod.name} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm space-y-3">
                              <h5 className="font-sans font-bold text-xs text-slate-850 border-b border-slate-50 pb-1.5 uppercase tracking-wider flex items-center justify-between">
                                <span>{mod.name} Module</span>
                                <span className="text-[9px] text-slate-400 font-medium normal-case">
                                  {mod.permissions.filter(p => selectedStaffPermissions.includes('do.all') || selectedStaffPermissions.includes(p.id)).length} of {mod.permissions.length} active
                                </span>
                              </h5>
                              <div className="space-y-2.5">
                                {mod.permissions.map((perm) => {
                                  const isDoAll = selectedStaffPermissions.includes('do.all');
                                  const isChecked = isDoAll || selectedStaffPermissions.includes(perm.id);
                                  const isDisabled = isDoAll;
                                  
                                  return (
                                    <label 
                                      key={perm.id} 
                                      className={`flex items-start gap-2.5 p-2 rounded-lg transition-all border ${
                                        isDisabled 
                                          ? 'bg-slate-50/50 border-transparent opacity-80 cursor-not-allowed'
                                          : isChecked
                                            ? 'bg-indigo-50/20 border-indigo-100/50 hover:bg-indigo-50/30'
                                            : 'bg-white border-transparent hover:bg-slate-50'
                                      } cursor-pointer`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        disabled={isDisabled}
                                        onChange={() => {
                                          if (isChecked) {
                                            setSelectedStaffPermissions(prev => prev.filter(p => p !== perm.id));
                                          } else {
                                            setSelectedStaffPermissions(prev => [...prev, perm.id]);
                                          }
                                        }}
                                        className="mt-0.5 rounded border-slate-350 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 shrink-0"
                                      />
                                      <div className="text-[11px] leading-tight">
                                        <span className="font-bold text-slate-800 block flex items-center gap-1">
                                          {perm.name}
                                          {isDoAll && (
                                            <span className="text-[8px] font-extrabold text-indigo-600 tracking-tighter">(do.all)</span>
                                          )}
                                        </span>
                                        <span className="text-[9.5px] text-slate-400 leading-relaxed block mt-0.5">{perm.desc}</span>
                                      </div>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </form>

                  </div>

                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* 5. BILLING & SAAS SETTINGS */}
      {activeSubTab === 'settings' && (
        <div className="max-w-2xl mx-auto space-y-6">
          
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <h3 className="font-sans font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <Award className="h-4.5 w-4.5 text-yellow-500" />
              <span>SaaS Subscription Tier</span>
            </h3>
            
            <div className="grid gap-3 sm:grid-cols-3">
              {pricingPlans.map(plan => {
                const isCurrent = tenant.subscriptionPlan === plan.id;
                const isPending = tenant.subscriptionStatus === 'pending_approval' && isCurrent;
                const displayPrice = tenant.currency === 'ETB' ? `${plan.priceETB} ETB` : `$${plan.priceUSD}`;
                
                return (
                  <button
                    key={plan.id}
                    type="button"
                    disabled={isCurrent}
                    onClick={() => {
                      if (plan.id === 'free') {
                        updateTenantPlan(activeTenantId, 'free');
                      } else {
                        requestTenantUpgrade(activeTenantId, plan.id);
                        showToast(`Upgrade request submitted! Awaiting admin approval.`);
                      }
                    }}
                    className={`relative rounded-xl border p-3.5 text-left transition-all ${
                      isCurrent
                        ? isPending
                          ? 'border-amber-400 bg-amber-50/20 ring-1 ring-amber-400'
                          : 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                        : 'border-slate-100 hover:bg-slate-50 cursor-pointer'
                    }`}
                  >
                    <div className="flex justify-between items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs font-bold text-slate-900">{plan.name}</h4>
                      {isPending && (
                        <span className="bg-amber-100 text-amber-800 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded border border-amber-200 animate-pulse">
                          Pending
                        </span>
                      )}
                      {isCurrent && !isPending && (
                        <span className="bg-slate-900 text-white text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">{plan.features.join(', ')}</p>
                    <p className="text-xs font-bold text-slate-800 mt-3">{displayPrice} / mo</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dinex Manual Feature Control Panel (Task 4 Core settings) */}
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
              <h3 className="font-sans font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <Shield className="h-4.5 w-4.5 text-indigo-600" />
                <span>Manual Feature Settings</span>
              </h3>
            </div>

            <p className="text-xs text-slate-400">
              Select which functional modules are active for your customers and crew. Premium modules require an active Growth plan.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { name: 'Ordering Platform', prop: 'orderingEnabled', desc: 'Allow menu scans and cashier orders.' },
                { name: 'Table QR Layout', prop: 'tableManagementEnabled', desc: 'Configure digital table layouts.' },
                { name: 'Advance Reservations', prop: 'reservationEnabled', desc: 'Seat pre-bookings and arrival slots.', premium: true },
                { name: 'Gamified Loyalty', prop: 'loyaltyEnabled', desc: 'Points accumulation for regular diners.', premium: true },
                { name: 'Dynamic Service Tips', prop: 'tipsEnabled', desc: 'Optional tips flow for waiting staff.', premium: true },
                { name: 'Customer Accounts', prop: 'customerAccountsEnabled', desc: 'Let users save dietary allergies.' },
                { name: 'Kitchen Display (KDS)', prop: 'kitchenEnabled', desc: 'Send order tickets to chef stations.', premium: true },
                { name: 'Click-and-Collect Takeaway', prop: 'takeawayEnabled', desc: 'In-app pickup pre-orders.' },
                { name: 'Direct Delivery Engine', prop: 'deliveryEnabled', desc: 'Dispatch local couriers on-demand.', premium: true }
              ].map((feat) => {
                const isPremium = feat.premium;
                const isAllowedByPlan = isFeatureEnabled(feat.prop as any);
                const localVal = (localDinexSettings as any)[feat.prop];

                return (
                  <div key={feat.name} className="flex items-start justify-between p-3 rounded-xl border border-slate-50 bg-slate-50/20">
                    <div className="space-y-0.5 max-w-[80%] animate-in fade-in">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800">{feat.name}</span>
                        {isPremium && (
                          <span className="text-[8px] font-extrabold text-amber-600 bg-amber-50 px-1.5 rounded border border-amber-200 uppercase">
                            Growth
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">{feat.desc}</p>
                    </div>

                    <div className="flex items-center">
                      <button
                        type="button"
                        disabled={!isAllowedByPlan}
                        onClick={() => {
                          setLocalDinexSettings(prev => ({
                            ...prev,
                            [feat.prop]: !localVal
                          }));
                        }}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          !isAllowedByPlan 
                            ? 'bg-slate-100 cursor-not-allowed opacity-55' 
                            : localVal 
                            ? 'bg-indigo-600' 
                            : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            localVal ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Feature Status Alerts */}
            {featuresStatusMessage && (
              <div className={`p-3 rounded-lg text-xs font-medium flex items-center gap-1.5 mt-3 ${
                featuresStatusMessage.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {featuresStatusMessage.type === 'success' ? '✓' : '⚠️'} {featuresStatusMessage.text}
              </div>
            )}

            {/* Feature Action Buttons */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-50 mt-4">
              <button
                type="button"
                onClick={() => {
                  if (activeSettings) {
                    setLocalDinexSettings(activeSettings);
                  }
                  setFeaturesStatusMessage(null);
                }}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
              >
                Cancel Changes
              </button>
              <button
                type="button"
                disabled={isSavingFeatures}
                onClick={async () => {
                  if (!activeBusiness) return;
                  setIsSavingFeatures(true);
                  setFeaturesStatusMessage(null);
                  try {
                    await new Promise(resolve => setTimeout(resolve, 800)); // Simulated real-time delay
                    updateSettings(activeBusiness.id, localDinexSettings);
                    setFeaturesStatusMessage({ type: 'success', text: '✓ Saved successfully.' });
                  } catch (err: any) {
                    setFeaturesStatusMessage({ type: 'error', text: err?.message || 'Error: Unable to update core features.' });
                  } finally {
                    setIsSavingFeatures(false);
                  }
                }}
                className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition-colors shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {isSavingFeatures ? 'Saving...' : 'Save Feature Settings'}
              </button>
            </div>
          </div>

          {/* Business Profile Identity & Payments */}
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <h3 className="font-sans font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <Upload className="h-4.5 w-4.5 text-indigo-600" />
              <span>Business Profile & Bank Details</span>
            </h3>

            <div className="space-y-4">
              {/* Profile image upload */}
              <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="relative shrink-0">
                  <img 
                    src={localSettings.logoUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=120'} 
                    alt={tenant.name}
                    className="h-16 w-16 rounded-full object-cover border-2 border-indigo-100 bg-white shadow-sm"
                  />
                  <label className="absolute bottom-0 right-0 rounded-full bg-indigo-600 p-1.5 text-white hover:bg-indigo-700 shadow-md cursor-pointer flex items-center justify-center">
                    <Upload className="h-3 w-3" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Business Profile Logo</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                    Upload your official branding banner or storefront image from your device. Recommended: 1:1 ratio square image.
                  </p>
                </div>
              </div>

              {/* CBE Bank account number */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Pre-arrival Advance Payment Bank Account (CBE)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 1000123456789"
                  value={localSettings.bankAccount} 
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, bankAccount: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <span className="text-[9px] text-slate-400 block mt-1">
                  Customers who place pickup pre-orders will see this Commercial Bank of Ethiopia (CBE) account number to transfer funds in advance.
                </span>
              </div>
            </div>
          </div>

          {/* Regional Settings */}
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <h3 className="font-sans font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <Languages className="h-4.5 w-4.5 text-indigo-500" />
              <span>Regional & Currency Settings</span>
            </h3>
            
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Base Currency</label>
                <select 
                  value={localSettings.currency}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="ETB">ETB (Br)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loyalty Rules & Loyalty settings */}
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <h3 className="font-sans font-bold text-sm text-slate-800 flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-slate-500" />
              <span>Customer Loyalty & Rewards</span>
            </h3>
            
            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Points Ratio (Points / Spent)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={tenant.loyaltyPointsRatio} 
                  disabled
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-slate-500 bg-slate-50" 
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">For Aisha: 0.1 means 1 point per 10 ETB spent.</span>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Min Redemption Balance (Points)</label>
                <input 
                  type="number" 
                  value={tenant.loyaltyMinRedeemPoints} 
                  disabled
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-slate-500 bg-slate-50" 
                />
              </div>
            </div>
          </div>

          {/* Profile Settings Status Alerts */}
          {settingsStatusMessage && (
            <div className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-1.5 ${
              settingsStatusMessage.type === 'success' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {settingsStatusMessage.type === 'success' ? '✓' : '⚠️'} {settingsStatusMessage.text}
            </div>
          )}

          {/* Profile Settings Action Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCancelSettings}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSavingSettings}
              onClick={handleSaveSettings}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-colors shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {isSavingSettings ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

        </div>
      )}

      {/* PAYMENTS SUBTAB */}
      {activeSubTab === 'payments' && activeBusiness && (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
          <PaymentSettings tenantId={activeBusiness.id} />
        </div>
      )}

      {/* LOYALTY SUBTAB */}
      {activeSubTab === 'loyalty' && activeBusiness && (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
          <LoyaltySettings tenantId={activeBusiness.id} />
        </div>
      )}

      {/* SUBSCRIPTIONS SUBTAB */}
      {activeSubTab === 'subscriptions' && activeBusiness && (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
          <MealSubscriptionSettings tenantId={activeBusiness.id} />
        </div>
      )}

      {/* REPORTS SUBTAB */}
      {activeSubTab === 'reports' && activeBusiness && (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
          <ReportsDashboard tenantId={activeBusiness.id} />
        </div>
      )}
      </>
      )}

      {/* Create Business Modal (Task 3 On-the-fly provisioning) */}
      {showCreateBizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl animate-in fade-in duration-200">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-sans font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                  <span>Register Dinex Business</span>
                </h3>
                <p className="text-xs text-slate-500">Create a new restaurant, café, or shop instance in your SaaS portfolio.</p>
              </div>
              <button 
                onClick={() => setShowCreateBizModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBusinessSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Business Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gursha Habesha, Café Joy"
                  value={newBizName}
                  onChange={(e) => setNewBizName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Business Type *</label>
                  <select
                    value={newBizType}
                    onChange={(e) => setNewBizType(e.target.value as BusinessType)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-slate-700 bg-white focus:outline-none"
                  >
                    <option value="Hotel">Hotel</option>
                    <option value="Ethiopian Restaurant">Ethiopian Restaurant</option>
                    <option value="Cafe">Cafe</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Pizza Restaurant">Pizza Restaurant</option>
                    <option value="Burger House">Burger House</option>
                    <option value="Fast Food">Fast Food</option>
                    <option value="Street Food">Street Food</option>
                    <option value="Juice Bar">Juice Bar</option>
                    <option value="Dessert Shop">Dessert Shop</option>
                    <option value="Bar">Bar</option>
                    <option value="Coffee House">Coffee House</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+251 911..."
                    value={newBizPhone}
                    onChange={(e) => setNewBizPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={newBizCountry}
                    onChange={(e) => setNewBizCountry(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={newBizCity}
                    onChange={(e) => setNewBizCity(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Contact Email *</label>
                <input
                  type="email"
                  required
                  placeholder="contact@mybrand.com"
                  value={newBizEmail}
                  onChange={(e) => setNewBizEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Currency *</label>
                  <select
                    value={newBizCurrency}
                    onChange={(e) => setNewBizCurrency(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold bg-white"
                  >
                    <option value="ETB">ETB (Ethiopian Birr)</option>
                    <option value="USD">USD (US Dollar)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Primary Language *</label>
                  <select
                    value={newBizLanguage}
                    onChange={(e) => setNewBizLanguage(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold bg-white"
                  >
                    <option value="am">አማርኛ (Amharic)</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="h-4 w-4" />
                <span>Provision Business Brand & Core</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Unified Destructive Confirmation Modal */}
      {confirmDialog && confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-5 shadow-2xl animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-600">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <h4 className="font-sans font-bold text-sm text-slate-900">{confirmDialog.title}</h4>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              {confirmDialog.message}
            </p>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
              >
                No, Cancel
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className="flex-1 rounded-lg bg-rose-600 text-white px-3 py-1.5 text-xs font-bold hover:bg-rose-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Banner */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl border p-4 shadow-xl animate-in slide-in-from-bottom-5 fade-in duration-300 ${
          toast.type === 'success' 
            ? 'border-emerald-100 bg-emerald-50 text-emerald-800' 
            : 'border-rose-100 bg-rose-50 text-rose-800'
        }`}>
          {toast.type === 'success' ? <Check className="h-4.5 w-4.5 bg-emerald-500 text-white rounded-full p-0.5 animate-bounce" /> : <AlertTriangle className="h-4.5 w-4.5 text-rose-500" />}
          <span className="text-xs font-bold">{toast.text}</span>
        </div>
      )}

    </div>
  );
}
