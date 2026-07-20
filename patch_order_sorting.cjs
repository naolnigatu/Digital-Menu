const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerProfileDashboard.tsx', 'utf8');

const groupingLogic = `
            <div className="space-y-6 max-h-[360px] overflow-y-auto pr-1">
              {customerOrders.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-8 text-center bg-gray-50 rounded-2xl">No orders have been recorded under your email.</p>
              ) : (
                <>
                  {customerOrders.filter(o => o.type !== 'subscription_redemption').length > 0 && (
                    <div className="space-y-3.5">
                      <h5 className="font-bold text-gray-600 text-xs border-b border-gray-100 pb-1">Regular Orders</h5>
                      {customerOrders.filter(o => o.type !== 'subscription_redemption').map(order => (
                        <div key={order.id} className="p-4 bg-white border border-gray-200 rounded-2xl shadow-2xs space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900 text-sm">{order.orderNum}</span>
                                <span className="text-[10px] text-gray-400 font-mono">{new Date(order.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-[10px] text-gray-400 font-mono mt-0.5">Type: <span className="capitalize font-semibold text-gray-600">{order.type.replace('_', ' ')}</span></p>
                            </div>
                            
                            <div className="text-right">
                              <span className="font-bold font-mono text-gray-900 text-sm block">{currencySymbol}{order.total}</span>
                              <span className={\`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold mt-1 uppercase tracking-wider \${
                                order.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                order.status === 'cancelled' ? 'bg-gray-100 text-gray-500' :
                                order.status === 'refunded' ? 'bg-red-50 text-red-600 border border-red-100' :
                                'bg-amber-50 text-amber-700 border border-amber-200'
                              }\`}>
                                {order.status}
                              </span>
                            </div>
                          </div>

                          <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/60 divide-y divide-slate-100/40 text-[11px]">
                            {order.items.map((it, idx) => (
                              <div key={idx} className="py-1.5 flex justify-between text-gray-700">
                                <span>{it.quantity}x {it.name}</span>
                                <span className="font-mono text-gray-500">{currencySymbol}{(it.price * it.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>

                          {order.refundDetails && (
                            <div className="p-2 bg-red-50 text-red-700 rounded-lg text-[10px] border border-red-100 flex justify-between">
                              <span>Refunded: -{currencySymbol}{order.refundDetails.refundAmount}</span>
                              <span className="italic">Reason: {order.refundDetails.refundReason}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {customerOrders.filter(o => o.type === 'subscription_redemption').length > 0 && (
                    <div className="space-y-3.5 mt-4">
                      <h5 className="font-bold text-indigo-600 text-xs border-b border-indigo-100 pb-1">Subscription Meal Requests</h5>
                      {customerOrders.filter(o => o.type === 'subscription_redemption').map(order => (
                        <div key={order.id} className="p-4 bg-indigo-50/30 border border-indigo-100 rounded-2xl shadow-2xs space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900 text-sm">{order.orderNum}</span>
                                <span className="text-[10px] text-gray-400 font-mono">{new Date(order.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-[10px] text-indigo-400 font-mono mt-0.5">Type: <span className="capitalize font-semibold text-indigo-600">Meal Plan Delivery</span></p>
                            </div>
                            
                            <div className="text-right">
                              <span className="font-bold font-mono text-gray-900 text-sm block">Prepaid</span>
                              <span className={\`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold mt-1 uppercase tracking-wider \${
                                order.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                order.status === 'served' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                                order.status === 'cancelled' ? 'bg-gray-100 text-gray-500' :
                                'bg-amber-50 text-amber-700 border border-amber-200'
                              }\`}>
                                {order.status}
                              </span>
                            </div>
                          </div>

                          <div className="bg-white p-2.5 rounded-xl border border-indigo-50 divide-y divide-slate-100/40 text-[11px]">
                            {order.items.map((it, idx) => (
                              <div key={idx} className="py-1.5 flex justify-between text-gray-700">
                                <span>{it.quantity}x {it.name}</span>
                                <span className="font-mono text-gray-500">Plan</span>
                              </div>
                            ))}
                          </div>
                          {order.status === 'served' && (
                            <button
                              onClick={() => {
                                updateOrderStatus(order.id, 'completed');
                                if (order.advancePaymentRef) {
                                  logMealService(order.advancePaymentRef);
                                }
                                alert('Completion marked for the day!');
                              }}
                              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Mark Completion For Today
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
`;

code = code.replace(
  /            <div className="space-y-3\.5 max-h-\[360px\] overflow-y-auto pr-1">[\s\S]*?            <\/div>\n          <\/div>\n        \)\}/m,
  groupingLogic + "\n          </div>\n        )}"
);

fs.writeFileSync('src/components/CustomerProfileDashboard.tsx', code);
