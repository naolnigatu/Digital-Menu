const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

code = code.replace(
  '  // Calculate final discount percentage\n  let finalDiscountPct = badgeBonus;',
  `  // Calculate final discount percentage\n  let finalDiscountPct = badgeBonus;\n  if (orderType === 'meal_subscription' && activeTenant.mealSubscriptionDiscountPercent) {\n    finalDiscountPct += activeTenant.mealSubscriptionDiscountPercent;\n  }`
);

code = code.replace(
  '{finalDiscountPct > 0 && (\n                    <div className="flex justify-between font-medium text-emerald-600">\n                      <span>Loyalty / Badge Discount ({finalDiscountPct}%)</span>',
  '{finalDiscountPct > 0 && (\n                    <div className="flex justify-between font-medium text-emerald-600">\n                      <span>Discount ({finalDiscountPct}%)</span>'
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
