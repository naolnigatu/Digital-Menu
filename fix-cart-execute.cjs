const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf-8');

// I also need to add \`updateCustomerMealSubscription\` to the destructuring of \`useApp\`
code = code.replace(
  `subscribeToMealPlan,`,
  `subscribeToMealPlan,
    updateCustomerMealSubscription,`
);

// We need to inject the credit deduction logic into \`executeOrderSubmission\`
const executeOrderStart = `    const isAutoApproval = activeSettings?.deliveryApprovalMode === 'automatic';`;
const newExecuteOrderStart = `
    let finalCreditsToDeduct: {subId: string, itemId: string, qty: number}[] = [];
    if (useSubscriptionCredits && canUseSubscriptionCredits) {
      let cartSubtotal = 0;
      cart.forEach(c => {
        let itemCost = c.item.price;
        c.selectedMods.forEach(m => itemCost += m.price);
        let qtyToPayFor = c.qty;
        for (const sub of eligibleSubsToRedeem) {
          const cred = sub.credits?.find(x => x.menuItemId === c.item.id);
          if (cred && cred.remaining > 0 && qtyToPayFor > 0) {
            const deductQty = Math.min(cred.remaining, qtyToPayFor);
            qtyToPayFor -= deductQty;
            finalCreditsToDeduct.push({ subId: sub.id, itemId: c.item.id, qty: deductQty });
          }
        }
      });
      
      // Deduct the credits
      const subUpdates: Record<string, { credits: any[], totalRemaining: number }> = {};
      finalCreditsToDeduct.forEach(d => {
        if (!subUpdates[d.subId]) {
          const sub = eligibleSubsToRedeem.find(s => s.id === d.subId);
          if (sub) subUpdates[d.subId] = { credits: JSON.parse(JSON.stringify(sub.credits)), totalRemaining: sub.totalCreditsRemaining };
        }
        if (subUpdates[d.subId]) {
          const cred = subUpdates[d.subId].credits.find((c: any) => c.menuItemId === d.itemId);
          if (cred) {
            cred.remaining -= d.qty;
            cred.used += d.qty;
            subUpdates[d.subId].totalRemaining -= d.qty;
          }
        }
      });
      
      Object.keys(subUpdates).forEach(subId => {
        updateCustomerMealSubscription(subId, {
          credits: subUpdates[subId].credits,
          totalCreditsRemaining: subUpdates[subId].totalRemaining,
          redemptionsToday: (eligibleSubsToRedeem.find(s => s.id === subId)?.redemptionsToday || 0) + 1,
          lastRedemptionDate: new Date().toISOString()
        });
      });
    }

    const isAutoApproval = activeSettings?.deliveryApprovalMode === 'automatic';`;

code = code.replace(executeOrderStart, newExecuteOrderStart);

fs.writeFileSync('src/views/CustomerView.tsx', code);
