const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

const replacementTotal = `
                  {orderType === 'meal_subscription' && (
                    <div className="flex justify-between font-medium text-slate-500">
                      <span>Subscription Duration</span>
                      <span>30 Days (30 Meals)</span>
                    </div>
                  )}
                  {finalDiscountPct > 0 && (
                    <div className="flex justify-between font-medium text-emerald-600">
                      <span>Discount ({finalDiscountPct}%)</span>
                      <span>-{activeTenant.currencySymbol} {(((orderType === 'meal_subscription' ? calculateCartTotal() * 30 : calculateCartTotal()) * finalDiscountPct) / 100).toFixed(2)}</span>
                    </div>
                  )}
                  {selectedTipAmount > 0 && (
                    <div className="flex justify-between font-medium text-amber-600 font-mono">
                      <span>Staff Support Tip</span>
                      <span>+{activeTenant.currencySymbol} {selectedTipAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-extrabold text-slate-900 text-sm">
                    <span>Cart Total Amount</span>
                    <span>{activeTenant.currencySymbol} {(((orderType === 'meal_subscription' ? calculateCartTotal() * 30 : calculateCartTotal()) * (100 - finalDiscountPct)) / 100 + selectedTipAmount).toFixed(2)}</span>
                  </div>
`;

code = code.replace(
  /                  \{finalDiscountPct > 0 && \([\s\S]*?<\/span>[\s\S]*?<\/span>[\s\S]*?<\/div>[\s\S]*?\}\)[\s\S]*?\{selectedTipAmount > 0 && \([\s\S]*?<\/span>[\s\S]*?<\/span>[\s\S]*?<\/div>[\s\S]*?\}\)[\s\S]*?<div className="flex justify-between font-extrabold text-slate-900 text-sm">[\s\S]*?<span>Cart Total Amount<\/span>[\s\S]*?<\/span>[\s\S]*?<\/div>/m,
  replacementTotal
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
