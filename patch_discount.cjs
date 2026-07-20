const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

code = code.replace(
  /  \/\/ Calculate final discount percentage\n  let finalDiscountPct = badgeBonus;\n  if \(orderType === 'meal_subscription' && \(activeTenant as any\)\.mealSubscriptionDiscountPercent\) \{\n    finalDiscountPct \+= \(activeTenant as any\)\.mealSubscriptionDiscountPercent;\n  \}/m,
  `  // Calculate final discount percentage
  let finalDiscountPct = badgeBonus;
  if (orderType === 'meal_subscription') {
    const plan = tenantSubscriptionPlans.find(p => p.id === selectedSubPlanId);
    if (plan && plan.discountPercentage) {
      finalDiscountPct += plan.discountPercentage;
    } else if ((activeTenant as any).mealSubscriptionDiscountPercent) {
      finalDiscountPct += (activeTenant as any).mealSubscriptionDiscountPercent;
    }
  }`
);

// also I see it is using `activeTenant.mealSubscriptionDiscountPercent` which I don't think has `as any`. Let me just replace the exact lines.
