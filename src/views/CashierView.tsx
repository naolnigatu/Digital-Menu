import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { 
  CreditCard, Coins, QrCode, Percent, ArrowRight, Printer, CheckCircle, Ticket, User, HelpCircle
} from 'lucide-react';

export default function CashierView() {
  const { 
    orders, 
    activeBranchId, 
    activeTenantId, 
    tenants, 
    branches,
    tables,
    processPayment 
  } = useApp();

  const tenant = tenants.find(t => t.id === activeTenantId) || tenants[0];
  const branchObj = branches.find(b => b.id === activeBranchId) || branches[0];

  const activeUnpaidOrders = orders.filter(
    o => o.branchId === activeBranchId && o.paymentStatus === 'unpaid' && o.status !== 'cancelled'
  );

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [splitCount, setSplitCount] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mobile_money'>('cash');
  const [loyaltyPointsRedeem, setLoyaltyPointsRedeem] = useState<number>(0);

  // Receipt Modal State
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  const handleSettleOrder = () => {
    if (!selectedOrder) return;
    
    // Process payment in global state
    processPayment(selectedOrder.id, paymentMethod, discountPercent, loyaltyPointsRedeem);
    
    // Grab copy for printing simulation before clearing
    const closedOrderCopy = {
      ...selectedOrder,
      paymentMethod,
      discount: (selectedOrder.subtotal * discountPercent) / 100 + (loyaltyPointsRedeem * tenant.loyaltyRedeemValue),
      total: selectedOrder.subtotal + selectedOrder.tax + selectedOrder.serviceCharge - ((selectedOrder.subtotal * discountPercent) / 100 + (loyaltyPointsRedeem * tenant.loyaltyRedeemValue))
    };

    setReceiptOrder(closedOrderCopy);
    setShowReceipt(true);
    setSelectedOrder(null);
    setDiscountPercent(0);
    setSplitCount(1);
    setLoyaltyPointsRedeem(0);
  };

  const getTableLabel = (tableId?: string) => {
    if (!tableId) return 'Pre-order';
    const tbl = tables.find(t => t.id === tableId);
    return tbl ? tbl.number : 'Table';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div>
        <h1 className="font-sans font-extrabold text-2xl text-slate-900 tracking-tight">Cashier Checkout Desk</h1>
        <p className="text-xs text-slate-500 mt-1">Settle open tables, apply discount campaigns, split checks, and generate print-ready thermal receipts.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Unpaid active tickets list */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-wider">Unresolved checks ({activeUnpaidOrders.length})</h3>
          
          {activeUnpaidOrders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center bg-white shadow-sm space-y-3">
              <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto" />
              <h4 className="font-sans font-bold text-sm text-slate-800">No Unpaid Checks!</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">All active dine-in table balances are settled. Order meals from the customer portal to populate checks here.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {activeUnpaidOrders.map((ord) => (
                <button
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className={`rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer ${
                    selectedOrder?.id === ord.id
                      ? 'border-indigo-600 bg-indigo-50/10 ring-1 ring-indigo-600 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-400 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{getTableLabel(ord.tableId)}</span>
                      <h4 className="font-sans font-extrabold text-base text-slate-900 leading-none mt-1">{ord.orderNum}</h4>
                    </div>
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded">
                      Unpaid
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2 line-clamp-1">Items: {ord.items.map(it => `${it.quantity}x ${it.name}`).join(', ')}</p>

                  <div className="mt-4 pt-2 border-t border-slate-50 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Time: {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="font-bold text-slate-800">{tenant.currencySymbol} {ord.total.toLocaleString()}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected check billing actions */}
        <div className="space-y-4">
          <h3 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-wider">Settlement Portal</h3>

          {selectedOrder ? (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg space-y-5 animate-in slide-in-from-right-3 duration-200">
              
              <div className="border-b border-slate-50 pb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{getTableLabel(selectedOrder.tableId)} Check</span>
                <h4 className="font-sans font-extrabold text-base text-slate-950">{selectedOrder.orderNum} Settle Panel</h4>
              </div>

              {/* Items Summary list */}
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 text-xs">
                {selectedOrder.items.map(it => (
                  <div key={it.id} className="flex justify-between text-slate-700">
                    <span>{it.quantity}x {it.name}</span>
                    <span className="font-mono">{tenant.currencySymbol} {it.price * it.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-3">
                
                {/* 1. Split Bill Tool */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Group Bill Splitter</label>
                    <span className="font-semibold text-slate-600">Split into {splitCount} ways</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map(ways => (
                      <button
                        key={ways}
                        onClick={() => setSplitCount(ways)}
                        className={`flex-1 py-1 text-xs font-bold border rounded ${
                          splitCount === ways 
                            ? 'bg-slate-950 text-white border-slate-950' 
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {ways === 1 ? 'Single' : `${ways}-way`}
                      </button>
                    ))}
                  </div>
                  {splitCount > 1 && (
                    <p className="text-[10px] font-bold text-amber-700 bg-amber-50 rounded px-2 py-1 mt-1 text-center">
                      Split Total: {tenant.currencySymbol} {Math.floor(selectedOrder.total / splitCount).toLocaleString()} per person
                    </p>
                  )}
                </div>

                {/* 2. Discounts Selector */}
                <div className="space-y-1 text-xs">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Apply Promo Campaign</label>
                  <div className="flex gap-2">
                    {[0, 10, 15, 20].map(pct => (
                      <button
                        key={pct}
                        onClick={() => setDiscountPercent(pct)}
                        className={`flex-1 py-1 text-xs font-bold border rounded ${
                          discountPercent === pct 
                            ? 'bg-slate-950 text-white border-slate-950' 
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {pct === 0 ? 'None' : `${pct}% Off`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Loyalty redemption */}
                <div className="space-y-1 text-xs">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Redeem Member Loyalty Points</label>
                  <div className="flex gap-2">
                    <input 
                      type="number"
                      placeholder="Enter points (e.g. 50)"
                      value={loyaltyPointsRedeem || ''}
                      onChange={(e) => setLoyaltyPointsRedeem(Number(e.target.value))}
                      className="w-2/3 rounded-lg border border-slate-200 px-3 py-1 text-xs"
                    />
                    <div className="w-1/3 bg-slate-50 border border-slate-100 rounded text-[9px] font-bold text-slate-500 flex items-center justify-center">
                      - {tenant.currencySymbol} {loyaltyPointsRedeem * tenant.loyaltyRedeemValue}
                    </div>
                  </div>
                </div>

                {/* 4. Payment Methods */}
                <div className="space-y-1 text-xs">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Recording Channel</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPaymentMethod('cash')}
                      className={`flex-1 py-1.5 flex flex-col items-center gap-1 border rounded text-[10px] font-bold ${
                        paymentMethod === 'cash' ? 'bg-slate-50 border-slate-950' : 'bg-white border-slate-200'
                      }`}
                    >
                      <Coins className="h-3.5 w-3.5 text-slate-700" />
                      <span>Cash</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`flex-1 py-1.5 flex flex-col items-center gap-1 border rounded text-[10px] font-bold ${
                        paymentMethod === 'card' ? 'bg-slate-50 border-slate-950' : 'bg-white border-slate-200'
                      }`}
                    >
                      <CreditCard className="h-3.5 w-3.5 text-slate-700" />
                      <span>Card Desk</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('mobile_money')}
                      className={`flex-1 py-1.5 flex flex-col items-center gap-1 border rounded text-[10px] font-bold ${
                        paymentMethod === 'mobile_money' ? 'bg-slate-50 border-slate-950' : 'bg-white border-slate-200'
                      }`}
                    >
                      <QrCode className="h-3.5 w-3.5 text-slate-700" />
                      <span>Mobile</span>
                    </button>
                  </div>
                </div>

                {/* Calculations preview */}
                <div className="rounded-xl bg-slate-50 p-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span>{tenant.currencySymbol} {selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Promo Discount ({discountPercent}%)</span>
                      <span>- {tenant.currencySymbol} {(selectedOrder.subtotal * discountPercent / 100).toLocaleString()}</span>
                    </div>
                  )}
                  {loyaltyPointsRedeem > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Loyalty Redemptions</span>
                      <span>- {tenant.currencySymbol} {(loyaltyPointsRedeem * tenant.loyaltyRedeemValue).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>Gov VAT / Service Taxes</span>
                    <span>{tenant.currencySymbol} {(selectedOrder.tax + selectedOrder.serviceCharge).toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-slate-200 my-1"></div>
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Settlement Total</span>
                    <span>
                      {tenant.currencySymbol} {
                        Math.max(0, parseFloat((
                          selectedOrder.subtotal + 
                          selectedOrder.tax + 
                          selectedOrder.serviceCharge - 
                          ((selectedOrder.subtotal * discountPercent) / 100) - 
                          (loyaltyPointsRedeem * tenant.loyaltyRedeemValue)
                        ).toFixed(2))).toLocaleString()
                      }
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSettleOrder}
                  className="w-full rounded-lg bg-emerald-600 text-white font-bold py-2.5 text-xs hover:bg-emerald-500 transition-colors cursor-pointer"
                >
                  Confirm Settle & Print Receipt
                </button>

              </div>

            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center bg-white shadow-sm">
              <HelpCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-medium leading-relaxed">Select any open table ticket from the list to apply cashier settlement procedures.</p>
            </div>
          )}

        </div>

      </div>

      {/* Styled Thermal Receipt Modal */}
      {showReceipt && receiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 space-y-4">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Printer className="h-4 w-4" /> Receipt Generated
              </span>
              <button 
                onClick={() => setShowReceipt(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Done
              </button>
            </div>

            {/* Thermal Slip Simulation */}
            <div className="border border-slate-200 bg-slate-50 p-4 rounded-xl font-mono text-xs text-slate-800 space-y-3 shadow-inner">
              <div className="text-center space-y-1">
                <h4 className="font-bold text-sm tracking-tight">{tenant.name}</h4>
                <p className="text-[10px] text-slate-500">{branchObj.name}</p>
                <p className="text-[10px] text-slate-500">{branchObj.address}</p>
                <p className="text-[10px] text-slate-500">Tel: {branchObj.phone}</p>
              </div>

              <div className="border-t border-dashed border-slate-300 my-2"></div>

              <div className="space-y-1 text-[10px] text-slate-600">
                <p>Order Ref: {receiptOrder.orderNum}</p>
                <p>Date: {new Date(receiptOrder.createdAt).toLocaleDateString()}</p>
                <p>Time: {new Date().toLocaleTimeString()}</p>
                <p>Type: Dine-In ({getTableLabel(receiptOrder.tableId)})</p>
                <p>Cashier ID: #{receiptOrder.id.split('-')[1] || '01'}</p>
              </div>

              <div className="border-t border-dashed border-slate-300 my-2"></div>

              {/* Items Table */}
              <div className="space-y-1.5 text-[10px]">
                {receiptOrder.items.map(it => (
                  <div key={it.id} className="flex justify-between">
                    <span>{it.quantity}x {it.name}</span>
                    <span>{tenant.currencySymbol} {it.price * it.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-slate-300 my-2"></div>

              {/* Financial Calculations */}
              <div className="space-y-1 text-[10px] text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{tenant.currencySymbol} {receiptOrder.subtotal.toLocaleString()}</span>
                </div>
                {receiptOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount / Points:</span>
                    <span>- {tenant.currencySymbol} {receiptOrder.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>VAT / Svc Tax:</span>
                  <span>{tenant.currencySymbol} {(receiptOrder.tax + receiptOrder.serviceCharge).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-xs pt-1">
                  <span>GRAND TOTAL:</span>
                  <span>{tenant.currencySymbol} {Math.max(0, receiptOrder.total).toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-300 my-2"></div>

              <div className="text-center text-[10px] text-slate-400 font-bold tracking-wider">
                <p>PAID VIA {receiptOrder.paymentMethod?.replace('_', ' ').toUpperCase()}</p>
                <p className="mt-2 text-[9px] font-normal">Thank you for dining with us!</p>
                <p className="text-[8px] font-normal">Powered by MenuFlow SaaS</p>
              </div>

            </div>

            <button
              onClick={() => {
                alert('Sent thermal packet to ESC/POS Bluetooth printer successfully!');
              }}
              className="w-full rounded-lg bg-slate-950 text-white font-bold py-2 text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <Printer className="h-4 w-4" />
              <span>Print Hard Copy</span>
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
