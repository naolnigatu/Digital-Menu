const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

// 1. Remove from cart
code = code.replace(
/                \{orderType === 'meal_subscription' && \(\s*<div className="space-y-2 pt-3 border-t border-slate-100">\s*<label className="text-\[10px\] font-bold text-slate-400 uppercase">Available Subscription Plans<\/label>[\s\S]*?<\/select>\s*\)\}\s*<\/div>\s*\)\}/,
  ""
);

// 2. Add to main view
const subUI = `
              {orderType === 'meal_subscription' && (
                <div className="mt-3 space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Available Subscription Plans</label>
                  {tenantSubscriptionPlans.length === 0 ? (
                    <p className="text-[10px] text-amber-500 italic">No recurring meal plans defined by merchant.</p>
                  ) : (
                    <select
                      value={selectedSubPlanId}
                      onChange={(e) => setSelectedSubPlanId(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-2.5 py-2 text-xs font-semibold focus:outline-none"
                    >
                      {tenantSubscriptionPlans.map(p => (
                        <option key={p.id} value={p.id} className="text-slate-900">
                          {p.name} ({activeTenant.currencySymbol}{p.monthlyPrice}/mo, {p.mealsPerWeek} meals/wk)
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
`;

code = code.replace(
/              <\/div>\n              \{orderType === 'delivery' && \(/,
  "              </div>\n" + subUI + "\n              {orderType === 'delivery' && ("
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
