import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MenuItem, Category, Table, Staff, ModifierGroup } from '../types';
import { 
  LayoutDashboard, Utensils, QrCode, Users, Settings, Plus, Trash2, Edit, Check, 
  BarChart3, Users2, Shield, Languages, Award, PlusCircle, CreditCard, ChevronRight, FileSpreadsheet,
  Upload, Image, X
} from 'lucide-react';

export default function BusinessOwnerView() {
  const { 
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
    pricingPlans
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'menu' | 'tables' | 'staff' | 'settings'>('dashboard');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateTenantProfile(activeTenantId, event.target.result as string, tenant.bankAccount || '');
        }
      };
      reader.readAsDataURL(file);
    }
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
  const tenantCategories = categories[activeTenantId] || [];
  const tenantItems = menuItems[activeTenantId] || [];
  const tenantBranchTables = tables.filter(t => t.branchId === activeBranchId);
  const tenantStaff = staff.filter(s => s.tenantId === activeTenantId);
  const branchOrders = orders.filter(o => o.branchId === activeBranchId);

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
                alert(`Your request to upgrade to the Growth Plan has been submitted to the platform admin. The features will be unlocked as soon as your payment is approved!`);
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
  const [catName, setCatName] = useState('');
  const [catAmharic, setCatAmharic] = useState('');
  const [catOrderNum, setCatOrderNum] = useState(1);

  const [showItemModal, setShowItemModal] = useState(false);
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
  const [staffRole, setStaffRole] = useState<'waiter' | 'cashier' | 'kitchen' | 'manager'>('waiter');
  const [staffStation, setStaffStation] = useState('');

  // Computations
  const totalSales = branchOrders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((acc, curr) => acc + curr.total, 0);

  const bestSellingItemMap: Record<string, number> = {};
  branchOrders.forEach(o => {
    o.items.forEach(it => {
      bestSellingItemMap[it.name] = (bestSellingItemMap[it.name] || 0) + it.quantity;
    });
  });
  const bestSellers = Object.entries(bestSellingItemMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Handle Menu submissions
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;
    addCategory({
      tenantId: activeTenantId,
      name: catName,
      orderNum: Number(catOrderNum),
      icon: 'Utensils',
      translations: catAmharic ? { am: catAmharic } : undefined
    });
    setCatName('');
    setCatAmharic('');
    setShowCatModal(false);
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

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !itemCat) return;

    addMenuItem({
      categoryId: itemCat,
      tenantId: activeTenantId,
      name: itemName,
      description: itemDesc,
      price: Number(itemPrice),
      isAvailable: true,
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
      } : undefined
    });

    setItemName('');
    setItemDesc('');
    setItemPrice(100);
    setItemAmName('');
    setItemAmDesc('');
    setItemModifiers([]);
    setItemPhotoUrl('');
    setShowItemModal(false);
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
      
      {/* Header with branch select */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business Management</span>
          <h1 className="font-sans font-extrabold text-2xl text-slate-900 tracking-tight">{tenant.name} HQ</h1>
          <p className="text-xs text-slate-500">Plan Status: <strong className="capitalize text-slate-800">{tenant.subscriptionPlan}</strong> tier | Currency: {tenant.currency}</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-400">Branch:</label>
          <select 
            value={activeBranchId}
            onChange={(e) => setActiveBranchId(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            {branches.filter(b => b.tenantId === activeTenantId).map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
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
      
      {(tenant.subscriptionPlan === 'free' || tenant.subscriptionStatus === 'pending_approval') && (activeSubTab === 'dashboard' || activeSubTab === 'tables' || activeSubTab === 'staff') ? (
        renderPaywall(
          activeSubTab === 'dashboard' ? 'Analytics' : activeSubTab === 'tables' ? 'QR Tables' : 'Team Invites',
          activeSubTab === 'dashboard' 
            ? 'Access detailed transaction volume, average customer ticket values, sales charts, and top popular dishes analytics.'
            : activeSubTab === 'tables'
            ? 'Generate QR codes for specific dining tables, manage service orders, and configure virtual table layouts.'
            : 'Invite waitstaff, kitchen chefs, managers, and cashiers to run your restaurant operations collaboratively.'
        )
      ) : (
        <>
          {/* 1. DASHBOARD ANALYTICS */}
          {activeSubTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Net Income ({tenant.currency})</p>
              <p className="text-2xl font-bold text-slate-900 mt-2 underline decoration-indigo-500 decoration-2 underline-offset-4">{tenant.currencySymbol} {totalSales.toLocaleString()}</p>
              <span className="text-[10px] text-slate-400 mt-1 block">Live settled orders</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Order Tickets</p>
              <p className="text-2xl font-bold text-slate-900 mt-2 underline decoration-indigo-500 decoration-2 underline-offset-4">{branchOrders.length}</p>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
                {branchOrders.filter(o => o.status === 'completed').length} completed
              </span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Avg Ticket Spend</p>
              <p className="text-2xl font-bold text-slate-900 mt-2 underline decoration-indigo-500 decoration-2 underline-offset-4">
                {tenant.currencySymbol} {branchOrders.length ? Math.floor(totalSales / branchOrders.length) : 0}
              </p>
              <span className="text-[10px] text-slate-400 mt-1 block">Per customer scan</span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Best Sellers */}
            <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm space-y-3">
              <h3 className="font-sans font-bold text-sm text-slate-800 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-slate-500" />
                <span>Bestselling Dishes & Drinks</span>
              </h3>
              <div className="space-y-2.5">
                {bestSellers.length === 0 ? (
                  <p className="text-xs font-medium text-slate-400 py-6 text-center">Place orders in Customer view to generate real-time metrics!</p>
                ) : (
                  bestSellers.map(([name, qty], index) => (
                    <div key={name} className="flex items-center justify-between border-b border-slate-50 pb-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded bg-slate-100 font-bold text-slate-700 flex items-center justify-center text-[10px]">#{index+1}</span>
                        <span className="font-semibold text-slate-800">{name}</span>
                      </div>
                      <span className="font-bold text-slate-500">{qty} portions sold</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Operating Hours & Settings snapshot */}
            <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
              <h3 className="font-sans font-bold text-sm text-slate-800 flex items-center gap-2">
                <Settings className="h-4 w-4 text-slate-500" />
                <span>Active Branch Configuration</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-50 pb-1.5">
                  <span className="text-slate-400">VAT/Tax Rate</span>
                  <span className="font-bold text-slate-800">{tenant.baseTaxRate}%</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1.5">
                  <span className="text-slate-400">Service Charge</span>
                  <span className="font-bold text-slate-800">{tenant.serviceCharge}%</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1.5">
                  <span className="text-slate-400">Active Stations</span>
                  <span className="font-bold text-slate-800">{stations.filter(s => s.branchId === activeBranchId).map(s => s.name).join(', ')}</span>
                </div>
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
                onClick={() => setShowCatModal(true)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Category</span>
              </button>
              <button
                onClick={() => {
                  if (tenantCategories.length === 0) {
                    alert('Please create a category first!');
                    return;
                  }
                  setItemCat(tenantCategories[0].id);
                  setShowItemModal(true);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800"
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
                {tenantCategories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5">
                    <div>
                      <span className="text-xs font-bold text-slate-800">{cat.name}</span>
                      {cat.translations?.am && (
                        <span className="text-[10px] text-slate-400 ml-1.5 block">አማርኛ: {cat.translations.am}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => deleteCategory(activeTenantId, cat.id)}
                        className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
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
                        <button
                          onClick={() => deleteMenuItem(activeTenantId, item.id)}
                          className="rounded p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* ADD CATEGORY MODAL */}
          {showCatModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
              <form onSubmit={handleAddCategory} className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl border border-slate-100 space-y-4">
                <h4 className="font-sans font-bold text-sm text-slate-900 border-b border-slate-50 pb-2">Add Menu Category</h4>
                
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

                <div className="flex justify-end gap-2 border-t border-slate-50 pt-3">
                  <button type="button" onClick={() => setShowCatModal(false)} className="rounded-lg border px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="rounded-lg bg-slate-950 text-white px-4 py-1.5 text-xs font-bold hover:bg-slate-800">Save</button>
                </div>
              </form>
            </div>
          )}

          {/* ADD MENU ITEM MODAL */}
          {showItemModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
              <form onSubmit={handleAddItem} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl border border-slate-100 max-h-[85vh] overflow-y-auto space-y-4">
                <h4 className="font-sans font-bold text-sm text-slate-900 border-b border-slate-50 pb-2">Create New Dish / Drink</h4>
                
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

                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                  <button type="button" onClick={() => setShowItemModal(false)} className="rounded-lg border px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="rounded-lg bg-slate-950 text-white px-4 py-1.5 text-xs font-bold hover:bg-slate-800">Save Item</button>
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
                      alert(`Successfully generated high-resolution print PDF bundle for ${table.number}! Ready to send to physical cutter.`);
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
        <div className="grid gap-6 lg:grid-cols-3">
          
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
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
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
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Operational Role</label>
                <select
                  value={staffRole}
                  onChange={(e: any) => setStaffRole(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
                >
                  <option value="waiter">Floor Waiter</option>
                  <option value="cashier">Cashier Operator</option>
                  <option value="kitchen">Kitchen Staff (KDS)</option>
                  <option value="manager">Branch Operations Manager</option>
                </select>
              </div>

              {staffRole === 'kitchen' && (
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Assign KDS Station</label>
                  <select
                    value={staffStation}
                    onChange={(e) => setStaffStation(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
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
            <h4 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-wider">Branch Roster list ({tenantStaff.length})</h4>
            
            <div className="rounded-xl border border-slate-100 bg-white overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-100">
                {tenantStaff.map((member) => (
                  <div key={member.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-950">{member.name}</span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 uppercase">
                          {member.role.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{member.email}</p>
                      {member.stationId && (
                        <p className="text-[9px] font-semibold text-amber-700 mt-1">Station: {stations.find(s => s.id === member.stationId)?.name}</p>
                      )}
                    </div>

                    <button
                      onClick={() => toggleStaffStatus(member.id)}
                      className={`rounded px-2.5 py-1 text-[10px] font-bold border transition-colors ${
                        member.active 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100' 
                          : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {member.active ? 'Active' : 'Suspended'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

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
                        alert(`Upgrade request submitted! Awaiting admin approval.`);
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
                    src={tenant.logoUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=120'} 
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
                  value={tenant.bankAccount || ''} 
                  onChange={(e) => updateTenantProfile(activeTenantId, tenant.logoUrl || '', e.target.value)}
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
                  value={tenant.currency}
                  onChange={(e) => {
                    const currency = e.target.value;
                    const symbol = currency === 'USD' ? '$' : 'Br';
                    updateTenantCurrency(activeTenantId, currency, symbol);
                  }}
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

        </div>
      )}
      </>
      )}

    </div>
  );
}
