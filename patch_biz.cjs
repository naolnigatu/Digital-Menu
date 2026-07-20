const fs = require('fs');
let code = fs.readFileSync('src/views/BusinessOwnerView.tsx', 'utf8');

code = code.replace(
  "logoUrl: tenant.logoUrl || ''",
  "logoUrl: tenant.logoUrl || '',\n    mealSubscriptionDiscountPercent: tenant.mealSubscriptionDiscountPercent || 0"
);

code = code.replace(
  "updateTenantProfile(activeTenantId, localSettings.logoUrl, localSettings.bankAccount);",
  "updateTenantProfile(activeTenantId, localSettings.logoUrl, localSettings.bankAccount, localSettings.mealSubscriptionDiscountPercent);"
);

const discountInput = `
              <div className="space-y-1 mt-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  Subscription Discount (%)
                  <span className="bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded text-[8px] font-extrabold tracking-widest">PRO</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">%</span>
                  <input 
                    type="number" 
                    min="0"
                    max="100"
                    value={localSettings.mealSubscriptionDiscountPercent} 
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, mealSubscriptionDiscountPercent: parseFloat(e.target.value) || 0 }))}
                    className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <span className="text-[9px] text-slate-400 block mt-1">
                  Discount percentage applied automatically to customers who subscribe to meal plans.
                </span>
              </div>
`;

code = code.replace(
  '<div className="space-y-1 col-span-2">',
  discountInput + '\n              <div className="space-y-1 col-span-2">'
);

fs.writeFileSync('src/views/BusinessOwnerView.tsx', code);
