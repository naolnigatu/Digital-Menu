const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

const subUIWithButton = `
              {orderType === 'meal_subscription' && (
                <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Available Subscription Plans</label>
                    <button
                      onClick={() => {
                        document.getElementById('menu-catalog')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-lg text-[10px] font-bold shadow-sm transition-colors"
                    >
                      + Add Meals
                    </button>
                  </div>
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
/              \{orderType === 'meal_subscription' && \([\s\S]*?<\/select>\n                  \)\}\n                <\/div>\n              \)\}/m,
subUIWithButton
);

// add id="menu-catalog" to the menu container
code = code.replace(
  /<div className="space-y-8 pb-32">/,
  "<div id=\"menu-catalog\" className=\"space-y-8 pb-32\">"
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
