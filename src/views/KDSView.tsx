import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { OrderItem, Order } from '../types';
import { 
  ChefHat, Clock, Check, Play, BellRing, Settings, RefreshCw, AlertTriangle
} from 'lucide-react';

export default function KDSView() {
  const { 
    orders, 
    stations, 
    activeBranchId, 
    currentUser, 
    updateOrderItemStatus 
  } = useApp();

  const branchStations = stations.filter(s => s.branchId === activeBranchId);
  
  // Default to user's assigned station or fallback to the first station in the branch
  const [activeStationId, setActiveStationId] = useState<string>(() => {
    return currentUser?.stationId || branchStations[0]?.id || '';
  });

  // Force trigger state reload for timers
  const [, setTick] = useState(0);

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

  // Extract all active orders containing items for the selected station
  const stationOrdersList: { orderId: string; orderNum: string; tableNumber: string; orderType: string; createdAt: string; notes?: string; item: OrderItem }[] = [];

  orders.forEach(o => {
    if (o.status === 'completed' || o.status === 'cancelled') return;

    o.items.forEach(it => {
      if (it.assignedStationId === activeStationId) {
        // Table lookup
        const tblNumber = o.tableId ? `Table ${o.tableId.split('-')[1] || o.tableId}` : 'Pre-order';
        stationOrdersList.push({
          orderId: o.id,
          orderNum: o.orderNum,
          tableNumber: tblNumber,
          orderType: o.type,
          createdAt: o.createdAt,
          notes: o.notes,
          item: it
        });
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

  const activeStationName = branchStations.find(s => s.id === activeStationId)?.name || 'Select KDS Station';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans font-extrabold text-2xl text-slate-900 tracking-tight flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-slate-800" />
            <span>Kitchen Display System (KDS)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Real-time ticket routing board. Sounds a physical chime bell when marking items ready for waiter collection.</p>
        </div>

        {/* Station Select Toggle */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase">Station Grid:</label>
          <select 
            value={activeStationId}
            onChange={(e) => setActiveStationId(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            {branchStations.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

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
        <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center bg-white shadow-sm space-y-3">
          <Check className="h-10 w-10 text-emerald-500 mx-auto" />
          <h3 className="font-sans font-bold text-sm text-slate-800">All Kitchen Tickets Clear!</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">No orders routed to {activeStationName} right now. Select "Customer" or "Waiter" view to place some stews or coffees!</p>
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
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{ticket.tableNumber}</span>
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

                  {ticket.item.status === 'cooking' && (
                    <button
                      onClick={() => handleStatusChange(ticket.orderId, ticket.item.id, 'ready')}
                      className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-orange-600 text-white hover:bg-orange-500 py-2 text-xs font-bold transition-colors cursor-pointer animate-pulse"
                    >
                      <BellRing className="h-3.5 w-3.5" />
                      <span>Mark Ready (Chime Bell)</span>
                    </button>
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

    </div>
  );
}
