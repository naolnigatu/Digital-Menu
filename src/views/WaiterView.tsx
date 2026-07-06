import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Table, MenuItem, Order, OrderItem } from '../types';
import { 
  Grid, Plus, Utensils, Check, HelpCircle, ShoppingCart, MessageSquare, Clock, CheckCircle2, RotateCcw
} from 'lucide-react';

export default function WaiterView() {
  const { 
    tables, 
    orders, 
    menuItems, 
    activeBranchId, 
    activeTenantId, 
    tenants, 
    updateTableStatus, 
    placeOrder, 
    updateOrderStatus, 
    updateOrderItemStatus 
  } = useApp();

  const tenant = tenants.find(t => t.id === activeTenantId) || tenants[0];
  const branchTables = tables.filter(t => t.branchId === activeBranchId);
  const branchMenuItems = menuItems[activeTenantId] || [];

  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showOrderPanel, setShowOrderPanel] = useState(false);
  
  // Custom Walk-in Order State
  const [cart, setCart] = useState<{ item: MenuItem; qty: number; notes: string; selectedMods: { groupName: string; optionName: string; price: number }[] }[]>([]);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  // Active Order for selected table (if exists)
  const activeOrder = orders.find(o => o.tableId === selectedTable?.id && o.status !== 'completed' && o.status !== 'cancelled');

  const handleClearTable = (tableId: string) => {
    updateTableStatus(tableId, 'empty');
    if (selectedTable?.id === tableId) {
      setSelectedTable(prev => prev ? { ...prev, status: 'empty' } : null);
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    // Basic defaults for simplicity
    const defaultMods = item.modifiers.map(g => ({
      groupName: g.name,
      optionName: g.options[0].name,
      price: g.options[0].price
    }));

    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { item, qty: 1, notes: '', selectedMods: defaultMods }];
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.item.id !== itemId));
  };

  const submitWalkInOrder = () => {
    if (!selectedTable || cart.length === 0) return;

    const orderItems: OrderItem[] = cart.map((cartItem, idx) => ({
      id: `oi-${Date.now()}-${idx}`,
      menuItemId: cartItem.item.id,
      name: cartItem.item.name,
      price: cartItem.item.price,
      quantity: cartItem.qty,
      selectedModifiers: cartItem.selectedMods,
      status: 'received',
      notes: cartItem.notes,
      assignedStationId: cartItem.item.preparationStationId
    }));

    placeOrder({
      tenantId: activeTenantId,
      branchId: activeBranchId,
      tableId: selectedTable.id,
      type: 'dine_in',
      customerName: guestName || 'Walk-in Guest',
      customerPhone: guestPhone || undefined,
      items: orderItems,
      discount: 0,
      subtotal: 0, // AppContext auto-computes calculations
      total: 0
    });

    // Reset Form
    setCart([]);
    setGuestName('');
    setGuestPhone('');
    setShowOrderPanel(false);
    
    // Close selection to show list
    setSelectedTable(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div>
        <h1 className="font-sans font-extrabold text-2xl text-slate-900 tracking-tight">Waiter Floor Service Control</h1>
        <p className="text-xs text-slate-500 mt-1">Live table layout overview for active branch. Place custom tickets on behalf of walk-ins and track meal delivery status.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Table Matrix List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-wider">Table Floor Grid</h3>
          
          <div className="grid gap-3 sm:grid-cols-3">
            {branchTables.map((table) => {
              const hasOrder = orders.some(o => o.tableId === table.id && o.status !== 'completed' && o.status !== 'cancelled');
              const activeTblOrder = orders.find(o => o.tableId === table.id && o.status !== 'completed' && o.status !== 'cancelled');

              return (
                <button
                  key={table.id}
                  onClick={() => setSelectedTable(table)}
                  className={`rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer ${
                    selectedTable?.id === table.id
                      ? 'border-indigo-600 bg-indigo-50/10 ring-1 ring-indigo-600 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-400 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-sans font-bold text-sm text-slate-900">{table.number}</span>
                    <span className={`rounded-full h-2 w-2 ${
                      table.status === 'eating' 
                        ? 'bg-emerald-500' 
                        : table.status === 'waiting' 
                        ? 'bg-amber-400 animate-pulse' 
                        : table.status === 'dirty'
                        ? 'bg-rose-500'
                        : 'bg-slate-300'
                    }`}></span>
                  </div>

                  <p className="text-[10px] text-slate-400 font-semibold mt-1">{table.section} Area</p>

                  <div className="mt-4 pt-2 border-t border-slate-50 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 capitalize font-medium">{table.status}</span>
                    {hasOrder && activeTblOrder && (
                      <span className="font-bold text-indigo-600 uppercase font-mono">{activeTblOrder.orderNum}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Table Sidebar Controls */}
        <div className="space-y-4">
          <h3 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-wider">Room Operations</h3>

          {selectedTable ? (
            <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-lg space-y-5 animate-in slide-in-from-right-3 duration-200">
              
              <div className="flex justify-between items-start border-b border-slate-50 pb-3">
                <div>
                  <h4 className="font-sans font-bold text-sm text-slate-950">{selectedTable.number} Details</h4>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">{selectedTable.section} Dining Space</p>
                </div>
                {selectedTable.status === 'dirty' && (
                  <button
                    onClick={() => handleClearTable(selectedTable.id)}
                    className="flex items-center gap-1 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 px-2 py-1"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Clean & Reset</span>
                  </button>
                )}
              </div>

              {/* Show Active Order info if table has check */}
              {activeOrder ? (
                <div className="space-y-4">
                  <div className="flex justify-between text-xs border-b border-slate-50 pb-2">
                    <span className="text-slate-400">Order ID: <strong className="font-mono text-slate-800">{activeOrder.orderNum}</strong></span>
                    <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 uppercase">
                      {activeOrder.status}
                    </span>
                  </div>

                  {/* Order items status tracker */}
                  <div className="space-y-2.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Item Preparation Checklist</p>
                    
                    {activeOrder.items.map((it) => (
                      <div key={it.id} className="rounded-lg bg-slate-50 p-2 text-xs space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-slate-800">{it.quantity}x {it.name}</span>
                            {it.notes && <p className="text-[10px] text-slate-400 mt-0.5">Note: "{it.notes}"</p>}
                          </div>
                          
                          <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                            it.status === 'delivered' 
                              ? 'bg-slate-200 text-slate-600' 
                              : it.status === 'ready' 
                              ? 'bg-emerald-100 text-emerald-800 animate-pulse' 
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {it.status}
                          </span>
                        </div>

                        {/* Deliver button if cooking is finished */}
                        {it.status === 'ready' && (
                          <button
                            onClick={() => updateOrderItemStatus(activeOrder.id, it.id, 'delivered')}
                            className="w-full flex items-center justify-center gap-1 rounded bg-emerald-600 text-white text-[10px] font-bold py-1 hover:bg-emerald-500 transition-colors"
                          >
                            <Check className="h-3 w-3" />
                            <span>Deliver to Customer</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Financial Total */}
                  <div className="pt-3 border-t border-slate-100 flex justify-between text-xs">
                    <span className="text-slate-400">Active Check Total:</span>
                    <span className="font-bold text-slate-900">{tenant.currencySymbol} {activeOrder.total.toLocaleString()}</span>
                  </div>

                </div>
              ) : (
                <div className="py-6 text-center space-y-4">
                  <p className="text-xs text-slate-400 font-medium">No open checks active on this table.</p>
                  
                  {!showOrderPanel ? (
                    <button
                      onClick={() => setShowOrderPanel(true)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white px-4 py-2 text-xs font-bold shadow transition-colors cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Take Guest Order</span>
                    </button>
                  ) : (
                    <div className="border-t border-slate-100 pt-4 text-left space-y-4">
                      
                      {/* Walk-in Cart and item selector */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Quick Add From Menu</label>
                        <div className="max-h-36 overflow-y-auto border border-slate-100 rounded-lg divide-y divide-slate-50 pr-1">
                          {branchMenuItems.map(item => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleAddToCart(item)}
                              className="w-full text-left p-1.5 flex justify-between items-center text-[11px] hover:bg-slate-50"
                            >
                              <span className="font-medium text-slate-700">{item.name}</span>
                              <span className="font-bold text-slate-400 font-mono">{tenant.currencySymbol} {item.price}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Walk-in Cart list */}
                      {cart.length > 0 && (
                        <div className="space-y-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Cart Checklist ({cart.length})</p>
                          <div className="space-y-1.5">
                            {cart.map(c => (
                              <div key={c.item.id} className="flex justify-between items-center text-[11px]">
                                <span className="font-medium text-slate-800">{c.qty}x {c.item.name}</span>
                                <button 
                                  onClick={() => handleRemoveFromCart(c.item.id)}
                                  className="text-rose-600 font-bold hover:underline"
                                >
                                  Delete
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Guest details */}
                      <div className="grid gap-2 text-xs">
                        <input
                          type="text"
                          placeholder="Guest Name (Optional)"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 px-3 py-1.5"
                        />
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-slate-50">
                        <button
                          onClick={() => setShowOrderPanel(false)}
                          className="w-1/2 rounded-lg border px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={submitWalkInOrder}
                          disabled={cart.length === 0}
                          className="w-1/2 rounded-lg bg-slate-950 text-white py-1.5 text-xs font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors"
                        >
                          Submit to Kitchen
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              )}

            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center bg-white shadow-sm">
              <HelpCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-medium leading-relaxed">Select any Table from the floor plan to view order statuses, trigger deliveries, or take fresh orders.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
