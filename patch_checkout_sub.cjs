const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

const replacement = `
    // If subscribed to meal plan
    if (orderType === 'meal_subscription') {
      subscribeToMealPlan({
        customerId: customerEmailForDashboard || customerPhone || 'anonymous',
        tenantId: activeTenantId,
        planId: selectedSubPlanId || 'custom_plan',
        menuItemIds: cart.map(c => c.item.id),
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: (selectedPaymentMethodId === 'stripe' || !isPrepaidType) ? 'active' : 'pending_approval',
        mealsUsedToday: 0,
        mealsUsedThisWeek: 0,
        mealsUsedTotal: 0,
        mealsRemainingTotal: 30,
        mealsPerDay: 1,
        mealsPerWeek: 5,
        nextRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
`;

code = code.replace(
  /    \/\/ If subscribed to meal plan\s*if \(orderType === 'meal_subscription' && selectedSubPlanId\) \{.*?\n    \}/s,
  replacement
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
