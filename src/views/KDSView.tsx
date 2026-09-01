import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { OrderItem, Order, PreparationStation } from '../types';
import { 
  ChefHat, Clock, Check, Play, BellRing, Settings, RefreshCw, AlertTriangle, Plus, Edit, Trash2, X, Sparkles, Building2, Utensils, Users, UserCheck
} from 'lucide-react';

export default function KDSView() {
  const { 
    orders, 
    stations, 
    branches,
    staff,
    activeBranchId, 
    activeTenantId,
    menuItems,
    toggleMenuItemAvailability,
    currentUser, 
    updateOrderItemStatus,
    approveKitchenNote,
    reportOrderItemIssue,
    placeOrder,
    addStation,
    updateStation,
    deleteStation,
    assignStaffToStation
  } = useApp();

  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'received' | 'cooking' | 'ready' | 'delivered'>('all');

  // Station Management Modal States
  const [showStationModal, setShowStationModal] = useState(false);
  const [editingStationId, setEditingStationId] = useState<string | null>(null);
  const [stationName, setStationName] = useState('');
  const [stationBranchId, setStationBranchId] = useState<string>('');
  const [isSavingStation, setIsSavingStation] = useState(false);
  const [stationError, setStationError] = useState<string | null>(null);
  const [confirmDeleteStation, setConfirmDeleteStation] = useState<{ id: string; name: string } | null>(null);

  const STATION_PRESETS = [
    'Main Kitchen',
    'Grill & BBQ',
    'Bar & Beverages',
    'Traditional Coffee',
    'Bakery & Pastry',
    'Salad & Cold Prep',
    'Pizza & Oven',
    'Fast Food & Fryer'
  ];

  const branchStations = useMemo(() => {
    if (!selectedBranchId || selectedBranchId === 'all') return stations;
    const filtered = stations.filter(s => !s.branchId || s.branchId === selectedBranchId);
    return filtered.length > 0 ? filtered : stations;
  }, [stations, selectedBranchId]);
  
  // Default to user's assigned station or 'all' for master view
  const [activeStationId, setActiveStationId] = useState<string>(() => {
    return currentUser?.stationId || 'all';
  });

  // Keep activeStationId synced with user's station if updated
  useEffect(() => {
    if (currentUser?.stationId) {
      setActiveStationId(currentUser.stationId);
    }
  }, [currentUser?.stationId]);

  // Force trigger state reload for timers
  const [, setTick] = useState(0);
  const [showAvailabilityPanel, setShowAvailabilityPanel] = useState(false);
  const [menuSearchQuery, setMenuSearchQuery] = useState('');

  const activeStationName = useMemo(() => {
    if (activeStationId === 'all') return 'All Kitchen Stations';
    const found = branchStations.find(s => s.id === activeStationId);
    return found?.name || 'All Kitchen Stations';
  }, [branchStations, activeStationId]);

  const activeTenantMenuItems = useMemo(() => {
    if (menuItems[activeTenantId] && menuItems[activeTenantId].length > 0) {
      return menuItems[activeTenantId];
    }
    const all = Object.values(menuItems).flat();
    return all.length > 0 ? all : [];
  }, [menuItems, activeTenantId]);

  const stationMenuItems = useMemo(() => {
    if (activeStationId === 'all') return activeTenantMenuItems;
    return activeTenantMenuItems.filter(item => !item.preparationStationId || item.preparationStationId === activeStationId);
  }, [activeTenantMenuItems, activeStationId]);

  const filteredMenu = useMemo(() => {
    const term = (menuSearchQuery || '').toLowerCase();
    return stationMenuItems.filter(item => (item.name || '').toLowerCase().includes(term));
  }, [stationMenuItems, menuSearchQuery]);

  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTick(t => t + 1);
    }, 10000); // refresh elapsed times every 10 seconds
    return () => clearInterval(timer);
  }, []);

  const playKitchenBell = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime); // high pitch ping bell
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
      
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1400, audioCtx.currentTime);
        gain2.gain.setValueAtTime(0.08, audioCtx.currentTime);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.1);
      }, 150);
    } catch (e) {
      // Ignored browser context security block
    }
  };

  const handleStatusChange = (orderId: string, itemId: string, nextStatus: OrderItem['status']) => {
    updateOrderItemStatus(orderId, itemId, nextStatus);
    
    if (nextStatus === 'ready') {
      playKitchenBell();
    }
  };

  const handleOpenAddStation = () => {
    setEditingStationId(null);
    setStationName('');
    setStationBranchId(activeBranchId || (branches[0]?.id || ''));
    setStationError(null);
    setShowStationModal(true);
  };

  const handleOpenEditStation = (station: PreparationStation) => {
    setEditingStationId(station.id);
    setStationName(station.name);
    setStationBranchId(station.branchId || activeBranchId || '');
    setStationError(null);
    setShowStationModal(true);
  };

  const handleSaveStation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!stationName.trim()) {
      setStationError('Station name is required');
      return;
    }

    setIsSavingStation(true);
    setStationError(null);

    try {
      if (editingStationId) {
        await updateStation({
          id: editingStationId,
          name: stationName.trim(),
          branchId: stationBranchId || activeBranchId || 'b-01',
          tenantId: activeTenantId
        });
        showToast('✓ Station updated successfully');
      } else {
        await addStation({
          name: stationName.trim(),
          branchId: stationBranchId || activeBranchId || 'b-01',
          tenantId: activeTenantId
        });
        showToast('✓ Station created successfully');
      }
      setEditingStationId(null);
      setStationName('');
      setShowStationModal(false);
    } catch (err: any) {
      console.error(err);
      setStationError(err?.message || 'Failed to save station');
    } finally {
      setIsSavingStation(false);
    }
  };

  const handleDeleteStationConfirm = async () => {
    if (!confirmDeleteStation) return;
    try {
      await deleteStation(confirmDeleteStation.id);
      showToast(`✓ Station "${confirmDeleteStation.name}" deleted`);
      if (activeStationId === confirmDeleteStation.id) {
        setActiveStationId('all');
      }
      setConfirmDeleteStation(null);
    } catch (err: any) {
      console.error(err);
      showToast('Failed to delete station', 'error');
    }
  };

  const handleCreateTestOrder = async () => {
    const sampleItem = activeTenantMenuItems[0] || {
      id: 'item-demo-1',
      name: 'Special Tibs & Injera',
      price: 250,
      preparationStationId: stations[0]?.id || ''
    };

    await placeOrder({
      tenantId: activeTenantId,
      branchId: activeBranchId || 'b-01',
      type: 'dine_in',
      customerName: 'Kitchen Tester',
      tableId: 't-1',
      items: [
        {
          id: `oi-${Date.now()}-1`,
          menuItemId: sampleItem.id,
          name: sampleItem.name,
          price: sampleItem.price,
          quantity: 2,
          selectedModifiers: [],
          status: 'received',
          assignedStationId: sampleItem.preparationStationId || stations[0]?.id || ''
        }
      ],
      discount: 0,
      tip: 0,
      notes: 'Extra spicy, serve piping hot!'
    });

    showToast("Test ticket created and added to kitchen board!");
  };

  // Extract all active orders containing items for the selected station
  const stationOrdersList: { 
    orderId: string; 
    orderNum: string; 
    tableNumber: string; 
    orderType: string; 
    createdAt: string; 
    notes?: string; 
    item: OrderItem;
    paymentStatus?: string;
    paymentVerificationStatus?: string;
  }[] = [];

  orders.forEach(o => {
    if (o.status === 'completed' || o.status === 'cancelled' || o.status === 'refunded') return;
    if (o.paymentVerificationStatus === 'rejected') return;
    if (selectedBranchId !== 'all' && o.branchId && o.branchId !== selectedBranchId) return;

    // Table lookup / Type label
    const tblNumber = o.tableId ? `Table ${o.tableId.split('-')[1] || o.tableId}` : (
      o.type === 'dine_in' ? 'Dine In' : 
      o.type === 'takeaway' ? 'Takeaway' : 
      o.type === 'delivery' ? 'Delivery' : 
      o.type === 'drive_through' ? 'Drive-Thru' : 
      o.type === 'meal_subscription' ? 'Meal Plan' : 'Order'
    );

    (o.items || []).forEach(it => {
      const isMatch = activeStationId === 'all' 
        || it.assignedStationId === activeStationId
        || (!it.assignedStationId && (branchStations.length <= 1 || activeStationId === branchStations[0]?.id));

      if (isMatch) {
        if (statusFilter === 'all' || it.status === statusFilter) {
          stationOrdersList.push({
            orderId: o.id,
            orderNum: o.orderNum || 'ORD',
            tableNumber: tblNumber,
            orderType: o.type,
            createdAt: o.createdAt || new Date().toISOString(),
            notes: o.notes,
            item: it,
            paymentStatus: o.paymentStatus,
            paymentVerificationStatus: o.paymentVerificationStatus
          });
        }
      }
    });
  });

  // Sort by oldest first so chefs cook in chronological order
  const sortedTickets = stationOrdersList.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const getElapsedTime = (isoString: string) => {
    const elapsedMs = Date.now() - new Date(isoString).getTime();
    const elapsedMins = Math.floor(elapsedMs / (60 * 1000));
    if (elapsedMins < 1) return 'Just now';
    return `${elapsedMins}m ago`;
  };

  const getElapsedColor = (isoString: string) => {
    const elapsedMs = Date.now() - new Date(isoString).getTime();
    const elapsedMins = Math.floor(elapsedMs / (60 * 1000));
    if (elapsedMins > 20) return 'text-rose-600 font-extrabold animate-pulse';
    if (elapsedMins > 10) return 'text-amber-600 font-bold';
    return 'text-slate-400 font-medium';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans font-extrabold text-2xl text-slate-900 tracking-tight flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-slate-800" />
            <span>Kitchen Display System (KDS)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Real-time live kitchen queue. Orders placed via QR, Customers, or Waiters appear immediately here.</p>
        </div>

        {/* Station Select Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleOpenAddStation()}
            className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Add a new kitchen preparation station (Grill, Bar, Pastry, etc.)"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Kitchen Station</span>
          </button>

          <button
            onClick={() => handleCreateTestOrder()}
            className="rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Create a test order to verify tickets in real time"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Test Ticket</span>
          </button>

          <button
            onClick={() => setShowAvailabilityPanel(!showAvailabilityPanel)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
              showAvailabilityPanel 
                ? 'bg-slate-900 border-slate-900 text-white' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Stock Status</span>
          </button>

          {branches.length > 1 && (
            <select 
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer shadow-sm"
            >
              <option value="all">🏢 All Branches</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          )}

          <select 
            value={activeStationId}
            onChange={(e) => setActiveStationId(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer shadow-sm"
          >
            <option value="all">🍽️ All Stations (Master View)</option>
            {branchStations.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Station Filter Pills & Status Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        {branchStations.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <button
              type="button"
              onClick={() => setActiveStationId('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeStationId === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              All Stations ({orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled' && o.status !== 'refunded').reduce((acc, o) => acc + (o.items || []).length, 0)})
            </button>
            {branchStations.map(s => {
              const count = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled' && o.status !== 'refunded')
                .flatMap(o => o.items || [])
                .filter(it => it.assignedStationId === s.id).length;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveStationId(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeStationId === s.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{s.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeStationId === s.id ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
            
            <button
              type="button"
              onClick={() => handleOpenAddStation()}
              className="px-2 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer flex items-center gap-1"
              title="Add a new kitchen preparation station"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Station</span>
            </button>
          </div>
        )}

        {/* Status filters */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 text-[11px] font-extrabold rounded-lg transition-colors cursor-pointer ${statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            All Active
          </button>
          <button
            onClick={() => setStatusFilter('received')}
            className={`px-2.5 py-1 text-[11px] font-extrabold rounded-lg transition-colors cursor-pointer ${statusFilter === 'received' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-700 hover:text-amber-900'}`}
          >
            New
          </button>
          <button
            onClick={() => setStatusFilter('cooking')}
            className={`px-2.5 py-1 text-[11px] font-extrabold rounded-lg transition-colors cursor-pointer ${statusFilter === 'cooking' ? 'bg-indigo-600 text-white shadow-xs' : 'text-indigo-700 hover:text-indigo-900'}`}
          >
            Cooking
          </button>
          <button
            onClick={() => setStatusFilter('ready')}
            className={`px-2.5 py-1 text-[11px] font-extrabold rounded-lg transition-colors cursor-pointer ${statusFilter === 'ready' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 hover:text-emerald-900'}`}
          >
            Ready
          </button>
        </div>
      </div>

      {/* Availability Control Panel */}
      {showAvailabilityPanel && (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-4 animate-in slide-in-from-top duration-200 shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-slate-150 pb-2.5 flex-wrap">
            <div>
              <h3 className="font-sans font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <Settings className="h-4 w-4 text-indigo-600" />
                <span>Cook Item Stock Controller ({activeStationName})</span>
              </h3>
              <p className="text-[11px] text-slate-400">Mark dishes as Out of Stock (Sold Out) to automatically grey them out and prevent customer orders.</p>
            </div>
            
            <input
              type="text"
              
              value={menuSearchQuery}
              onChange={(e) => setMenuSearchQuery(e.target.value)}
              className="bg-white rounded-lg border border-slate-200 px-3 py-1 text-xs w-full sm:w-64 focus:outline-none focus:border-slate-400 font-semibold"
            />
          </div>

          {(() => {
            if (stationMenuItems.length === 0) {
              return <p className="text-xs text-slate-400 text-center py-4">No menu items mapped to the "{activeStationName}" station.</p>;
            }

            return (
              <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {filteredMenu.map(item => (
                  <div 
                    key={item.id} 
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 bg-white shadow-sm transition-all ${
                      item.isAvailable !== false 
                        ? 'border-slate-150' 
                        : 'border-rose-200 bg-rose-50/25'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0">
                      <p className={`text-xs font-bold truncate ${item.isAvailable !== false ? 'text-slate-800' : 'text-slate-400 line-through'}`}>
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        {item.isAvailable !== false ? '🟢 Available' : '🔴 Sold Out'}
                      </p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => toggleMenuItemAvailability(activeTenantId, item.id)}
                      className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md border cursor-pointer transition-all ${
                        item.isAvailable !== false 
                          ? 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800' 
                          : 'bg-rose-600 border-rose-600 text-white hover:bg-rose-700'
                      }`}
                    >
                      {item.isAvailable !== false ? 'OOS' : 'In Stock'}
                    </button>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* Manager Kitchen Notes Security Gatekeeper (Part 6) */}
      {(() => {
        const pendingNotesList: { orderId: string; orderNum: string; noteId: string; text: string; time: string }[] = [];
        orders.forEach(o => {
          if (o.status === 'completed' || o.status === 'cancelled') return;
          if (o.kitchenNotes) {
            o.kitchenNotes.forEach(n => {
              if (!n.approved) {
                pendingNotesList.push({
                  orderId: o.id,
                  orderNum: o.orderNum,
                  noteId: n.id,
                  text: n.text,
                  time: n.time
                });
              }
            });
          }
        });

        if (pendingNotesList.length === 0) return null;

        return (
          <div className="bg-gradient-to-r from-amber-950 to-slate-900 text-white rounded-2xl p-5 border border-amber-500/30 space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="font-sans font-extrabold text-sm text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-400 animate-pulse" />
                  <span>Manager Kitchen Notes Gatekeeper</span>
                </h3>
                <p className="text-[11px] text-slate-300">
                  To prevent line cooks confusion, custom guest instructions are held here. Aisha's branch manager must review & approve before they route to ticket panels.
                </p>
              </div>
              <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-[9px] px-2.5 py-1 rounded-lg uppercase tracking-wider">
                {pendingNotesList.length} Pending Approval
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pendingNotesList.map(note => (
                <div key={note.noteId} className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] font-extrabold text-amber-400">Order #{note.orderNum}</span>
                      <span className="text-[8px] text-slate-400">
                        {new Date(note.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-100 font-medium italic">
                      "{note.text}"
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        approveKitchenNote(note.orderId, note.noteId, false);
                        showToast("Rejected instruction. Cleaned from queue.", "error");
                      }}
                      className="flex-1 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 font-bold py-1.5 text-[10px] cursor-pointer"
                    >
                      Reject Note
                    </button>
                    <button
                      onClick={() => {
                        approveKitchenNote(note.orderId, note.noteId, true);
                        showToast("Successfully Approved note! Rerouted instantly into station ticket cards.");
                      }}
                      className="flex-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-1.5 text-[10px] cursor-pointer shadow"
                    >
                      Approve Note
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Stats of tickets at this station */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-white border border-slate-200 rounded-xl p-4 text-xs text-slate-600 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-slate-500 uppercase tracking-widest text-[10px]">Active Station</span>
          <span className="rounded-lg bg-indigo-50 border border-indigo-100 px-3 py-1 font-extrabold text-indigo-700">{activeStationName}</span>
        </div>
        <div className="hidden sm:block h-6 w-px bg-slate-200"></div>
        <div>
          <span className="font-medium text-slate-500">Pending Tickets: <strong className="text-slate-900 underline decoration-indigo-500 decoration-2 underline-offset-4">{sortedTickets.filter(t => t.item.status !== 'ready' && t.item.status !== 'delivered').length} items</strong></span>
        </div>
      </div>

      {/* Digital Tickets Board Grid */}
      {sortedTickets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center bg-white shadow-sm space-y-4">
          <Check className="h-10 w-10 text-emerald-500 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-sans font-bold text-sm text-slate-800">All Kitchen Tickets Clear!</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">No orders routed to {activeStationName} right now. Place an order from the Customer or Waiter view, or click below to simulate an incoming ticket.</p>
          </div>
          <button
            onClick={() => handleCreateTestOrder()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-extrabold transition-all cursor-pointer shadow-sm"
          >
            <Plus className="h-4 w-4 text-emerald-400" />
            <span>Generate Sample Ticket</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedTickets.map((ticket, idx) => {
            const isLate = (Date.now() - new Date(ticket.createdAt).getTime()) > 15 * 60 * 1000;
            
            let ticketStyle = 'bg-slate-50/40 border-l-4 border-amber-500 border-y border-r border-slate-200 rounded-r-xl';
            if (ticket.item.status === 'cooking') {
              ticketStyle = 'bg-indigo-50/10 border-l-4 border-indigo-500 border-y border-r border-indigo-100 rounded-r-xl';
            } else if (ticket.item.status === 'ready') {
              ticketStyle = 'bg-emerald-50/10 border-l-4 border-emerald-500 border-y border-r border-emerald-100 rounded-r-xl opacity-80';
            } else if (ticket.item.status === 'delivered') {
              ticketStyle = 'bg-slate-100/40 border-l-4 border-slate-400 border-y border-r border-slate-200 rounded-r-xl opacity-60';
            } else if (isLate) {
              ticketStyle = 'bg-rose-50/10 border-l-4 border-rose-500 border-y border-r border-rose-200 rounded-r-xl';
            }

            return (
              <div 
                key={`${ticket.orderId}-${ticket.item.id}`} 
                className={`p-4 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden transition-all duration-200 hover:shadow-md ${ticketStyle}`}
              >
                {/* Hot Alert header if late */}
                {isLate && ticket.item.status !== 'ready' && (
                  <div className="absolute top-0 right-0 left-0 bg-rose-600 text-white text-[9px] font-bold text-center py-0.5 tracking-wider uppercase flex items-center justify-center gap-1">
                    <AlertTriangle className="h-2.5 w-2.5" /> Over 15 mins wait time!
                  </div>
                )}

                <div className="space-y-3">
                  {/* Ticket Header */}
                  <div className="flex justify-between items-start border-b border-slate-50 pb-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{ticket.tableNumber}</span>
                        {activeStationId === 'all' && (
                          <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.25">
                            {stations.find(s => s.id === ticket.item.assignedStationId)?.name || 'General Kitchen'}
                          </span>
                        )}
                        {ticket.paymentVerificationStatus === 'pending' && (
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.25">
                            Pay Pending
                          </span>
                        )}
                      </div>
                      <h4 className="font-sans font-extrabold text-base text-slate-900 leading-none mt-1">{ticket.orderNum}</h4>
                    </div>
                    
                    <div className="flex items-center gap-1 text-[11px]">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span className={getElapsedColor(ticket.createdAt)}>{getElapsedTime(ticket.createdAt)}</span>
                    </div>
                  </div>

                  {/* Main Ingredient Quantities */}
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2.5">
                      <span className="h-6 w-6 rounded-lg bg-slate-900 text-white font-extrabold flex items-center justify-center text-xs shrink-0">
                        {ticket.item.quantity}x
                      </span>
                      <div>
                        <p className="text-xs font-extrabold text-slate-900">{ticket.item.name}</p>
                        
                        {/* Modifier options details */}
                        {ticket.item.selectedModifiers.length > 0 && (
                          <div className="space-y-0.5 mt-1">
                            {ticket.item.selectedModifiers.map((m, mIdx) => (
                              <p key={mIdx} className="text-[10px] text-amber-800 font-bold bg-amber-50 rounded px-1.5 py-0.25 w-fit">
                                + {m.groupName}: {m.optionName}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Customer specific notes/requests */}
                  {ticket.item.notes && (
                    <div className="rounded-lg bg-slate-50 border border-slate-100 p-2 text-[10px] text-slate-500 flex gap-1 items-start">
                      <p className="italic">"{ticket.item.notes}"</p>
                    </div>
                  )}

                  {/* Parent level approved kitchen notes (Part 6) */}
                  {(() => {
                    const parentOrder = orders.find(o => o.id === ticket.orderId);
                    const approvedNotes = parentOrder?.kitchenNotes?.filter(n => n.approved) || [];
                    if (approvedNotes.length === 0) return null;
                    return (
                      <div className="rounded-lg bg-amber-50 border border-amber-200 p-2 text-[10px] text-amber-950 space-y-1">
                        <p className="font-bold uppercase text-[8px] text-amber-800">Approved Special Requests:</p>
                        {approvedNotes.map(n => (
                          <p key={n.id} className="italic font-medium">💡 "{n.text}"</p>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* KDS Kitchen State buttons */}
                <div className="pt-3 border-t border-slate-50">
                  {ticket.item.status === 'received' && (
                    <button
                      onClick={() => handleStatusChange(ticket.orderId, ticket.item.id, 'cooking')}
                      className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 py-2 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Play className="h-3.5 w-3.5" />
                      <span>Start Cooking</span>
                    </button>
                  )}
                  {(ticket.item.status === 'received' || ticket.item.status === 'cooking') && (
                    <button
                      onClick={() => {
                        const reason = window.prompt("Reason for not preparing?");
                        if (reason) {
                          reportOrderItemIssue(ticket.orderId, ticket.item.id, reason);
                          showToast("Issue reported to manager", "info");
                        }
                      }}
                      className="w-full mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 py-1.5 text-[10px] font-bold transition-colors cursor-pointer border border-rose-200"
                    >
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Report Can't Prepare</span>
                    </button>
                  )}

                  {ticket.item.status === 'cooking' && (
                    <button
                      onClick={() => handleStatusChange(ticket.orderId, ticket.item.id, 'ready')}
                      className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-orange-600 text-white hover:bg-orange-500 py-2 text-xs font-bold transition-colors cursor-pointer animate-pulse"
                    >
                      <BellRing className="h-3.5 w-3.5" />
                      <span>Mark Ready (Chime Bell)</span>
                    </button>
                  )}

                  {ticket.item.status === 'issue_reported' && (
                    <div className="w-full flex items-center justify-center gap-1 rounded-lg bg-rose-50 text-rose-800 py-1.5 text-xs font-bold border border-rose-100">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Issue Reported to Manager</span>
                    </div>
                  )}
                  {ticket.item.status === 'ready' && (
                    <div className="w-full flex items-center justify-center gap-1 rounded-lg bg-emerald-50 text-emerald-800 py-1.5 text-xs font-bold border border-emerald-100">
                      <Check className="h-4 w-4" />
                      <span>Ready for Pickup</span>
                    </div>
                  )}

                  {ticket.item.status === 'delivered' && (
                    <div className="w-full flex items-center justify-center gap-1 rounded-lg bg-slate-100 text-slate-500 py-1.5 text-xs font-bold">
                      <Check className="h-4 w-4" />
                      <span>Delivered</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Station Management Modal */}
      {showStationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <ChefHat className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {editingStationId ? 'Edit Kitchen Station' : 'Kitchen Preparation Stations'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Configure routing targets for dishes and kitchen staff</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowStationModal(false);
                  setEditingStationId(null);
                  setStationName('');
                  setStationError(null);
                }} 
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-6">
              
              {/* Add / Edit Form */}
              <form onSubmit={handleSaveStation} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800">
                    {editingStationId ? 'Update Station Details' : 'Add New Station'}
                  </span>
                  {editingStationId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingStationId(null);
                        setStationName('');
                        setStationError(null);
                      }}
                      className="text-[10px] text-slate-500 hover:text-slate-800 font-bold"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Station Name</label>
                  <input
                    type="text"
                    required
                    value={stationName}
                    onChange={(e) => {
                      setStationName(e.target.value);
                      if (stationError) setStationError(null);
                    }}
                    placeholder="e.g. Main Kitchen, Grill & BBQ, Bar, Pastry..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-xs font-semibold bg-white"
                  />
                  {stationError && (
                    <p className="text-[10px] text-rose-600 font-bold mt-1">{stationError}</p>
                  )}
                </div>

                {/* Quick Presets */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Quick Presets</label>
                  <div className="flex flex-wrap gap-1.5">
                    {STATION_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setStationName(preset)}
                        className={`text-[10px] px-2.5 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                          stationName === preset
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Branch Assignment */}
                {branches.length > 1 && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Assign to Branch</label>
                    <select
                      value={stationBranchId || activeBranchId || ''}
                      onChange={(e) => setStationBranchId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-xs font-semibold bg-white cursor-pointer"
                    >
                      {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="pt-1 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingStation || !stationName.trim()}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSavingStation ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    <span>{editingStationId ? 'Save Changes' : '+ Add Station'}</span>
                  </button>
                </div>
              </form>

              {/* Existing Stations List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    Configured Stations ({stations.length})
                  </h4>
                </div>

                {stations.length === 0 ? (
                  <div className="text-center py-8 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <ChefHat className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-600">No kitchen stations configured yet</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Add your first station using the form above</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {stations.map(st => {
                      const branchName = branches.find(b => b.id === st.branchId)?.name || 'All Branches';
                      const assignedItemsCount = menuItems.filter(m => m.preparationStationId === st.id).length;
                      const activeTicketsCount = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled' && o.status !== 'refunded')
                        .flatMap(o => o.items || [])
                        .filter(it => it.assignedStationId === st.id).length;
                      const stationStaffMembers = (staff || []).filter(s => s.stationId === st.id);

                      return (
                        <div 
                          key={st.id} 
                          className="flex flex-col gap-2.5 p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition-all shadow-xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-extrabold text-slate-800">{st.name}</span>
                                <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-600">
                                  {branchName}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium">
                                <span>{assignedItemsCount} dishes routed</span>
                                <span>•</span>
                                <span className={activeTicketsCount > 0 ? 'text-amber-600 font-bold' : ''}>
                                  {activeTicketsCount} active ticket{activeTicketsCount === 1 ? '' : 's'}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 self-end sm:self-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveStationId(st.id);
                                  setShowStationModal(false);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition-colors cursor-pointer"
                                title="Filter KDS display to this station"
                              >
                                Filter Queue
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEditStation(st)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Edit station"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteStation({ id: st.id, name: st.name })}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete station"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Assigned Staff Pills */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-[10px]">
                            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                              <Users className="h-3.5 w-3.5 text-slate-400" />
                              <span>Assigned Chefs / Staff ({stationStaffMembers.length}):</span>
                            </div>
                            <div className="flex items-center gap-1 flex-wrap justify-end">
                              {stationStaffMembers.length === 0 ? (
                                <span className="text-[9px] text-slate-400 italic">None assigned</span>
                              ) : (
                                stationStaffMembers.map(m => (
                                  <span 
                                    key={m.id} 
                                    className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-[9px] flex items-center gap-1"
                                  >
                                    <UserCheck className="h-2.5 w-2.5" />
                                    <span>{m.name || `${m.firstName || ''} ${m.lastName || ''}`.trim() || 'Staff'}</span>
                                  </span>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Kitchen Staff Assignment Section */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-emerald-600" />
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      Assign Kitchen Staff to Stations
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Quick reassignment</span>
                </div>

                <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {staff.filter(s => ['kitchen', 'bar', 'coffee', 'waiter', 'manager'].includes(s.role) || s.stationId).length === 0 ? (
                    <p className="text-[11px] text-slate-400 text-center py-2">No staff members found to assign.</p>
                  ) : (
                    staff
                      .filter(s => ['kitchen', 'bar', 'coffee', 'waiter', 'manager'].includes(s.role) || s.stationId)
                      .map(member => {
                        const memberStation = stations.find(st => st.id === member.stationId);
                        const memberBranch = branches.find(b => b.id === member.branchId)?.name || 'All Branches';
                        
                        return (
                          <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg bg-white border border-slate-200 text-xs">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-[10px] shrink-0 uppercase">
                                {(member.name || 'S').slice(0, 2)}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-slate-800">{member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim()}</span>
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 font-semibold text-slate-500 uppercase">
                                    {member.role}
                                  </span>
                                </div>
                                <p className="text-[9px] text-slate-400">{memberBranch}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center">
                              <select
                                value={member.stationId || ''}
                                onChange={async (e) => {
                                  const targetStationId = e.target.value;
                                  try {
                                    await assignStaffToStation(member.id, targetStationId);
                                    showToast(targetStationId ? `✓ Assigned ${member.name} to station` : `✓ Unassigned ${member.name}`);
                                  } catch (err: any) {
                                    showToast(`Failed to assign staff: ${err.message || err}`, 'error');
                                  }
                                }}
                                className="text-[11px] font-bold py-1 px-2.5 border border-slate-200 rounded-lg bg-slate-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer"
                              >
                                <option value="">No Station (Receives All)</option>
                                {stations.map(st => (
                                  <option key={st.id} value={st.id}>{st.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowStationModal(false);
                  setEditingStationId(null);
                  setStationName('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Delete Station Confirmation Dialog */}
      {confirmDeleteStation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-sm p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Delete Kitchen Station</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Are you sure you want to delete <strong>"{confirmDeleteStation.name}"</strong>?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteStation(null)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteStationConfirm}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                Delete Station
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
            : toast.type === 'error'
            ? 'border-rose-100 bg-rose-50 text-rose-800'
            : 'border-slate-100 bg-slate-50 text-slate-800'
        }`}>
          {toast.type === 'success' ? <Check className="h-4.5 w-4.5 bg-emerald-500 text-white rounded-full p-0.5" /> : <AlertTriangle className="h-4.5 w-4.5 text-rose-500" />}
          <span className="text-xs font-bold">{toast.text}</span>
        </div>
      )}

    </div>
  );
}
