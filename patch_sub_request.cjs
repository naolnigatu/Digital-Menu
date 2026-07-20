const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerProfileDashboard.tsx', 'utf8');

// 1. Remove logMealService from the request, and add advancePaymentRef: sub.id
code = code.replace(
  /                              logMealService\(sub\.id\);\n                              \n                              const tenantItems/m,
  "                              const tenantItems"
);

code = code.replace(
  /                                orderType: 'subscription_redemption',\n                                paymentMethod: 'cash', \/\/ Prepaid/m,
  `                                orderType: 'subscription_redemption',
                                paymentMethod: 'cash', // Prepaid
                                advancePaymentRef: sub.id,`
);

// 2. Add Mark Completion button for orders
const markCompleteBtn = `
                    <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/60 divide-y divide-slate-100/40 text-[11px]">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="py-1.5 flex justify-between text-gray-700">
                          <span>{it.quantity}x {it.name}</span>
                          <span className="font-mono text-gray-500">{currencySymbol}{(it.price * it.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    {order.type === 'subscription_redemption' && order.status === 'served' && (
                      <button
                        onClick={() => {
                          const { updateOrderStatus, logMealService } = useApp; // wait, this is inside render, I should use the hook vars
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
`;

code = code.replace(
  /                    <div className="bg-slate-50\/50 p-2\.5 rounded-xl border border-slate-100\/60 divide-y divide-slate-100\/40 text-\[11px\]">\n                      \{order\.items\.map\(\(it, idx\) => \(\n                        <div key=\{idx\} className="py-1\.5 flex justify-between text-gray-700">\n                          <span>\{it\.quantity\}x \{it\.name\}<\/span>\n                          <span className="font-mono text-gray-500">\{currencySymbol\}\{\(it\.price \* it\.quantity\)\.toFixed\(2\)\}<\/span>\n                        <\/div>\n                      \)\)\}\n                    <\/div>/m,
  markCompleteBtn
);

// Oh wait, `updateOrderStatus` is not destructured from `useApp()` in CustomerProfileDashboard.tsx.
// Let's add it.

fs.writeFileSync('src/components/CustomerProfileDashboard.tsx', code);
