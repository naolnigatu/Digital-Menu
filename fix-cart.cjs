const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf-8');

const oldSubscribe = `    // If subscribed to meal plan
    if (orderType === 'meal_subscription') {
      subscribeToMealPlan({
        customerId: customerEmailForDashboard || customerPhone || 'anonymous',
        tenantId: activeTenantId,
        planId: selectedSubPlanId || 'custom_plan',
        menuItemIds: (isDirectCheckoutOpen && directCheckoutItem ? [directCheckoutItem] : cart).map(c => c.item.id),
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + subscriptionDurationDays * 24 * 60 * 60 * 1000).toISOString(),
        status: (selectedPaymentMethodId === 'stripe' || !isPrepaidType) ? 'active' : 'pending_approval',
        mealsUsedToday: 0,
        mealsUsedThisWeek: 0,
        mealsUsedTotal: 0,
        mealsRemainingTotal: subscriptionDurationDays,
        mealsPerDay: 1,
        mealsPerWeek: 5,
        nextRenewalDate: new Date(Date.now() + subscriptionDurationDays * 24 * 60 * 60 * 1000).toISOString()
      });
    }`;

const newSubscribe = `    // If subscribed to meal plan
    if (orderType === 'meal_subscription') {
      const plan = tenantSubscriptionPlans.find(p => p.id === selectedSubPlanId);
      
      let credits: any[] = [];
      let totalCredits = 0;
      
      if (plan) {
        if (plan.type === 'fixed') {
          credits = (plan.items || []).map(i => ({
            menuItemId: i.menuItemId,
            total: i.quantity,
            used: 0,
            remaining: i.quantity
          }));
          totalCredits = credits.reduce((a, c) => a + c.total, 0);
        } else {
          // BYO Package -> credits are flexible, handled differently, but let's initialize based on maxCredits
          totalCredits = plan.maxCredits || 30;
          const eligibleIds = plan.eligibleMenuItemIds?.length ? plan.eligibleMenuItemIds : (isDirectCheckoutOpen && directCheckoutItem ? [directCheckoutItem.id] : cart.map(c => c.item.id));
          credits = eligibleIds.map(id => ({
            menuItemId: id,
            total: totalCredits,
            used: 0,
            remaining: totalCredits
          }));
        }
      }

      subscribeToMealPlan({
        customerId: customerEmailForDashboard || customerPhone || 'anonymous',
        tenantId: activeTenantId,
        packageId: selectedSubPlanId,
        credits: credits,
        totalCreditsRemaining: totalCredits,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + (plan ? plan.durationDays : 30) * 24 * 60 * 60 * 1000).toISOString(),
        status: (selectedPaymentMethodId === 'stripe' || !isPrepaidType) ? 'active' : 'pending_approval',
        redemptionsToday: 0
      } as any);
    }`;

code = code.replace(oldSubscribe, newSubscribe);
fs.writeFileSync('src/views/CustomerView.tsx', code);
