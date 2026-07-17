const fs = require('fs');
let code = fs.readFileSync('src/views/SuperAdminView.tsx', 'utf8');

code = code.replace(
  "pricingPlans,\n    updatePlanPrice,",
  "pricingPlans,\n    updatePlanPrice,\n    updatePlanTabs,"
);

const featureManagerReplace = `
      {activeTab === 'feature_manager' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div>
              <h3 className="font-sans font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <Settings className="h-4.5 w-4.5 text-indigo-600" />
                <span>Granular Tab Access by Plan</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Toggle tabs that businesses can access according to their plans.
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-150">
                    <th className="p-3">Tab Module</th>
                    {pricingPlans.map(plan => (
                      <th key={plan.id} className="p-3 text-center">{plan.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {[
                    { id: 'dashboard', label: 'Dashboard / Reports' },
                    { id: 'orders', label: 'Order Manager' },
                    { id: 'menu', label: 'Menu Designer' },
                    { id: 'tables', label: 'QR Tables' },
                    { id: 'staff', label: 'Staff' },
                    { id: 'payments', label: 'Payments' },
                    { id: 'loyalty', label: 'Loyalty' },
                    { id: 'subscriptions', label: 'Subscriptions' },
                    { id: 'reservations', label: 'Reservations' },
                    { id: 'inventory', label: 'Inventory' },
                    { id: 'ads', label: 'Marketing Ads' },
                    { id: 'marketplace', label: 'Marketplace' },
                    { id: 'settings', label: 'SaaS Plan Settings' }
                  ].map(tab => (
                    <tr key={tab.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="p-3 font-bold text-slate-900">{tab.label}</td>
                      {pricingPlans.map(plan => {
                        const isEnabled = plan.enabledTabs?.includes(tab.id);
                        return (
                          <td key={plan.id} className="p-3 text-center">
                            <button 
                              onClick={() => {
                                const newTabs = isEnabled 
                                  ? (plan.enabledTabs || []).filter(t => t !== tab.id)
                                  : [...(plan.enabledTabs || []), tab.id];
                                updatePlanTabs(plan.id, newTabs);
                              }}
                              className={\`mx-auto rounded px-2.5 py-1 text-[10px] font-bold \${
                                isEnabled 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                  : 'bg-rose-50 text-rose-600 border border-rose-100'
                              }\`}
                            >
                              {isEnabled ? 'ENABLED' : 'HIDDEN'}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
`;

// remove old feature manager
code = code.replace(/\{activeTab === 'feature_manager' && \([\s\S]*?\}\)\]\.map\(\(feat\) => \([\s\S]*?\<\/div>\s*\<\/div>\s*\<\/div>\s*\)\}/g, featureManagerReplace);

// alternative replace if previous failed
const parts = code.split("{activeTab === 'feature_manager' && (");
if (parts.length > 1) {
    const endStr = "          </div>\n        </div>\n      )}";
    const subParts = parts[1].split(endStr);
    if (subParts.length > 1) {
        code = parts[0] + featureManagerReplace + subParts.slice(1).join(endStr);
    }
}


fs.writeFileSync('src/views/SuperAdminView.tsx', code);
