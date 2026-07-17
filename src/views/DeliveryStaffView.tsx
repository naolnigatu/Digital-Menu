import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useDinexSettings } from '../context/DinexContext';
import { Bike, MapPin, Phone, DollarSign, CheckCircle2, Navigation, ClipboardList, RefreshCw, Landmark } from 'lucide-react';

export default function DeliveryStaffView() {
  const { 
    orders, 
    currentUser, 
    updateOrderStatus, 
    activeTenantId, 
    activeBranchId,
    placeOrder // to get active currency
  } = useApp();

  const { activeSettings } = useDinexSettings();
  const [activeTab, setActiveTab] = useState<'tasks' | 'earnings'>('tasks');
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter orders assigned to this delivery staff
  const assignedOrders = orders.filter(o => 
    o.tenantId === activeTenantId &&
    o.branchId === activeBranchId &&
    o.type === 'delivery' &&
    o.deliveryStaffId === currentUser?.id
  );

  // Active or pending tasks
  const activeTasks = assignedOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
  const completedTasks = assignedOrders.filter(o => o.status === 'completed');

  // Sum cash collections
  const totalCashCollected = completedTasks
    .filter(o => o.paymentMethod === 'cash')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  // Handle Accept delivery assign
  const handleAcceptAssignment = async (orderId: string) => {
    setLoadingOrderId(orderId);
    try {
      // Transition from pending_acceptance to preparing/accepted
      const order = orders.find(o => o.id === orderId);
      if (!order) return;
      
      // Update order state
      await updateOrderStatus(orderId, 'accepted', currentUser?.name || 'Rider');
      
      // We manually update deliveryStatus as well through standard updateOrderStatus timeline or AppContext updates
      // Under the hood, AppContext's acceptDeliveryFee or updateOrderStatus handles the payload.
      // Let's make sure the deliveryStatus is set to preparing
      const orderRef = orders.find(o => o.id === orderId);
      if (orderRef) {
        orderRef.deliveryStatus = 'preparing';
      }

      showToast('Delivery assignment accepted! Standby for preparation.', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Error accepting assignment.', 'error');
    } finally {
      setLoadingOrderId(null);
    }
  };

  // Handle Mark Out For Delivery
  const handleOutForDelivery = async (orderId: string) => {
    setLoadingOrderId(orderId);
    try {
      // Set deliveryStatus to out_for_delivery
      const orderRef = orders.find(o => o.id === orderId);
      if (orderRef) {
        orderRef.deliveryStatus = 'out_for_delivery';
        // Add status update
        await updateOrderStatus(orderId, 'ready', currentUser?.name || 'Rider');
      }
      showToast('Status updated: Out for Delivery!', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Error updating status.', 'error');
    } finally {
      setLoadingOrderId(null);
    }
  };

  // Handle Mark Delivered
  const handleMarkDelivered = async (orderId: string) => {
    setLoadingOrderId(orderId);
    try {
      const orderRef = orders.find(o => o.id === orderId);
      if (orderRef) {
        orderRef.deliveryStatus = 'delivered';
        // Mark as served
        await updateOrderStatus(orderId, 'served', currentUser?.name || 'Rider');
      }
      showToast('Order delivered successfully!', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Error marking delivered.', 'error');
    } finally {
      setLoadingOrderId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-0">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl shadow-lg border text-xs font-bold animate-bounce ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
            : 'bg-rose-50 border-rose-100 text-rose-800'
        }`}>
          {toastMessage.type === 'success' ? '✓ ' : '✕ '}
          {toastMessage.text}
        </div>
      )}

      {/* RIDER STATS HERO */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-10">
          <Bike className="h-48 w-48" />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5">
            <span className="rounded bg-indigo-500/20 px-2.5 py-0.5 text-[10px] font-extrabold text-indigo-300 uppercase tracking-wider">
              On Duty • Direct Delivery Partner
            </span>
            <h2 className="font-sans font-extrabold text-xl">Welcome back, {currentUser?.name || 'Partner'}!</h2>
            <p className="text-xs text-slate-400">
              Assigned to: <strong className="text-white">Dinex Branch Office</strong>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full sm:flex sm:w-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-center w-full sm:w-32">
              <span className="block text-[9px] font-extrabold text-slate-400 uppercase">Cash Collected</span>
              <span className="font-mono text-base font-extrabold text-emerald-400 mt-1 block">
                ETB {totalCashCollected.toLocaleString()}
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-center w-full sm:w-32">
              <span className="block text-[9px] font-extrabold text-slate-400 uppercase">Jobs Done</span>
              <span className="font-mono text-base font-extrabold text-indigo-400 mt-1 block">
                {completedTasks.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION TABS */}
      <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2.5 font-bold text-xs flex items-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'tasks' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          <span>Active Tasks ({activeTasks.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('earnings')}
          className={`px-4 py-2.5 font-bold text-xs flex items-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'earnings' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Landmark className="h-4 w-4" />
          <span>Cash Collection Logs ({completedTasks.filter(o => o.paymentMethod === 'cash').length})</span>
        </button>
      </div>

      {/* TAB CONTENT: ACTIVE TASKS */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {activeTasks.length === 0 ? (
            <div className="bg-white border border-slate-150 rounded-2xl p-10 text-center space-y-3">
              <Bike className="h-8 w-8 text-slate-300 mx-auto animate-pulse" />
              <h3 className="font-sans font-bold text-slate-700 text-sm">No Active Deliveries</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Any incoming delivery tasks assigned to you by the store manager will appear here in real time.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {activeTasks.map(task => {
                const isPendingAccept = task.deliveryStatus === 'pending_acceptance';
                const isPreparing = task.deliveryStatus === 'preparing';
                const isOutForDelivery = task.deliveryStatus === 'out_for_delivery';
                const isDelivered = task.deliveryStatus === 'delivered';

                return (
                  <div key={task.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      
                      {/* Card Header */}
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[10px] font-extrabold bg-slate-100 text-slate-700 rounded px-1.5 py-0.5 font-mono">
                            #{task.orderNum}
                          </span>
                          <h4 className="font-sans font-bold text-sm text-slate-800">{task.customerName}</h4>
                        </div>
                        <span className={`text-[9px] font-extrabold rounded px-2 py-0.5 uppercase tracking-wider ${
                          isPendingAccept ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse' :
                          isPreparing ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                          isOutForDelivery ? 'bg-indigo-600 text-white' :
                          'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {task.deliveryStatus || 'Pending Accept'}
                        </span>
                      </div>

                      {/* Customer Details */}
                      <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-2.5 border border-slate-100">
                        <div className="flex items-start gap-2 text-slate-600">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-700">Delivery Address:</p>
                            <p className="text-slate-500 font-sans mt-0.5">{task.deliveryAddress}</p>
                            {task.deliveryLandmark && (
                              <p className="text-[10px] text-indigo-600 font-bold mt-1">📍 Landmark: {task.deliveryLandmark}</p>
                            )}
                            {task.deliveryInstructions && (
                              <p className="text-[10px] text-amber-600 font-bold mt-0.5">📝 Notes: {task.deliveryInstructions}</p>
                            )}
                          </div>
                        </div>

                        {task.customerPhone && (
                          <div className="flex items-center gap-2 text-slate-600 pt-1.5 border-t border-slate-200/50">
                            <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <div className="flex justify-between items-center w-full">
                              <span className="font-mono font-bold text-slate-700">{task.customerPhone}</span>
                              <a 
                                href={`tel:${task.customerPhone}`}
                                className="text-[10px] font-extrabold text-indigo-600 hover:underline"
                              >
                                Call Client
                              </a>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Financial Breakdown */}
                      <div className="flex justify-between items-center text-xs font-semibold px-1">
                        <span className="text-slate-400">Payment Mode:</span>
                        <span className="uppercase text-slate-700">{task.paymentMethod === 'cash' ? '💵 Cash On Delivery' : '💳 Paid Online'}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold px-1">
                        <span className="text-slate-400">Total collection amount:</span>
                        <span className="font-mono text-sm font-bold text-slate-800">
                          ETB {task.total.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Operational Action Buttons */}
                    <div className="pt-2 border-t border-slate-100">
                      {isPendingAccept && (
                        <button
                          disabled={loadingOrderId === task.id}
                          onClick={() => handleAcceptAssignment(task.id)}
                          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-2 rounded-lg cursor-pointer transition-colors shadow flex items-center justify-center gap-1.5"
                        >
                          <RefreshCw className={`h-3.5 w-3.5 ${loadingOrderId === task.id ? 'animate-spin' : ''}`} />
                          <span>Accept Delivery Route</span>
                        </button>
                      )}

                      {isPreparing && (
                        <div className="text-center p-2 bg-slate-50 rounded-lg border border-slate-100 text-[11px] font-bold text-slate-500 animate-pulse flex items-center justify-center gap-2">
                          <span>⏳ Awaiting Food Preparation...</span>
                          <button
                            onClick={() => handleOutForDelivery(task.id)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-[10px]"
                          >
                            Force Out for Delivery
                          </button>
                        </div>
                      )}

                      {isOutForDelivery && (
                        <button
                          disabled={loadingOrderId === task.id}
                          onClick={() => handleMarkDelivered(task.id)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-lg cursor-pointer transition-colors shadow flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Confirm Handover (Delivered)</span>
                        </button>
                      )}

                      {isDelivered && (
                        <div className="text-center p-2 bg-emerald-50 rounded-lg border border-emerald-100 text-[11px] font-bold text-emerald-700">
                          ✓ Delivery Complete! Store Manager closing ticket.
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: CASH COLLECTION LOGS */}
      {activeTab === 'earnings' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
            <h3 className="font-sans font-bold text-sm text-slate-700 flex items-center gap-1.5">
              <Landmark className="h-4 w-4 text-emerald-500" />
              <span>Cash-on-Delivery Collection Audits</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Review daily cash collection metrics to submit to the main cashier.</p>
          </div>

          <div className="divide-y divide-slate-100">
            {completedTasks.filter(o => o.paymentMethod === 'cash').length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No cash collections logged on your roster yet.
              </div>
            ) : (
              completedTasks.filter(o => o.paymentMethod === 'cash').map(log => (
                <div key={log.id} className="p-4 flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800">Order #{log.orderNum}</p>
                    <p className="text-slate-400 font-sans">Delivered to: {log.customerName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Date: {new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="rounded bg-emerald-50 text-emerald-700 px-2 py-0.5 font-extrabold text-[9px] uppercase border border-emerald-100">
                      Collected Cash
                    </span>
                    <p className="font-mono font-extrabold text-sm text-slate-800 mt-1">
                      ETB {log.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}
