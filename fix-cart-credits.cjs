const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf-8');

// 1. Add toggle state
code = code.replace(
  `const [redeemPointsActive, setRedeemPointsActive] = useState(false);`,
  `const [redeemPointsActive, setRedeemPointsActive] = useState(false);\n  const [useSubscriptionCredits, setUseSubscriptionCredits] = useState(false);`
);

// 2. Compute eligible credits
code = code.replace(
  `const profile = customerEmailForDashboard ? (customerProfiles[customerEmailForDashboard] || { loyaltyPoints: 0, savedFavorites: [] as string[] }) : { loyaltyPoints: 0, savedFavorites: [] as string[] };`,
  `const profile = customerEmailForDashboard ? (customerProfiles[customerEmailForDashboard] || { loyaltyPoints: 0, savedFavorites: [] as string[] }) : { loyaltyPoints: 0, savedFavorites: [] as string[] };
  
  // Subscription Eligibility
  const activeSubs = customerSubscriptions.filter(s => 
    s.status === 'active' && 
    (s.customerId === customerEmailForDashboard || s.customerId === customerPhone) && 
    s.tenantId === activeTenantId
  );
  
  const eligibleSubsToRedeem = activeSubs.filter(sub => {
    // Check if sub has enough credits for ALL cart items
    // (For simplicity, we check if ANY cart item can be fully covered)
    const cartItemIds = cart.map(c => c.item.id);
    let canCoverAll = true;
    const requiredQuantities: Record<string, number> = {};
    cart.forEach(c => {
      requiredQuantities[c.item.id] = (requiredQuantities[c.item.id] || 0) + c.qty;
    });

    let coversAtLeastOne = false;
    for (const [itemId, qty] of Object.entries(requiredQuantities)) {
      const credit = sub.credits?.find(c => c.menuItemId === itemId);
      if (credit && credit.remaining >= qty) {
        coversAtLeastOne = true;
      }
    }
    return coversAtLeastOne && sub.totalCreditsRemaining > 0;
  });
  const canUseSubscriptionCredits = eligibleSubsToRedeem.length > 0 && orderType !== 'meal_subscription';
  `
);

// 3. Render the toggle in UI (before loyalty redemption)
const loyaltyMatch = `{loyaltyConfig?.enabled && profile.loyaltyPoints >= loyaltyConfig.minPointsToRedeem && (`
const toggleHtml = `                {canUseSubscriptionCredits && (
                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-between gap-2 text-xs mb-3">
                    <div className="space-y-0.5">
                      <span className="font-bold text-amber-900 block">Use Meal Credits</span>
                      <p className="text-[10px] text-amber-700 leading-snug">Redeem credits from your active subscription for eligible items in this order.</p>
                    </div>
                    <button 
                      onClick={() => setUseSubscriptionCredits(!useSubscriptionCredits)}
                      className={\`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wide transition-all \${useSubscriptionCredits ? 'bg-amber-600 text-white' : 'bg-white border border-amber-200 text-amber-600'}\`}
                    >
                      {useSubscriptionCredits ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                )}
                `;
code = code.replace(loyaltyMatch, toggleHtml + loyaltyMatch);

// 4. Zero the price if credits are used!
code = code.replace(
  `let calculatedSubtotal = getSubtotalWithSubscription();`,
  `
    let calculatedSubtotal = getSubtotalWithSubscription();
    let creditsToDeduct: {subId: string, itemId: string, qty: number}[] = [];
    
    if (useSubscriptionCredits && canUseSubscriptionCredits) {
      // Very basic deduction: if they apply credits, zero out the price of items covered by credits.
      let cartSubtotal = 0;
      cart.forEach(c => {
        let itemCost = c.item.price;
        c.selectedMods.forEach(m => itemCost += m.price);
        
        let qtyToPayFor = c.qty;
        
        // Find a sub that covers it
        for (const sub of eligibleSubsToRedeem) {
          const cred = sub.credits?.find(x => x.menuItemId === c.item.id);
          if (cred && cred.remaining > 0 && qtyToPayFor > 0) {
            const deductQty = Math.min(cred.remaining, qtyToPayFor);
            qtyToPayFor -= deductQty;
            creditsToDeduct.push({ subId: sub.id, itemId: c.item.id, qty: deductQty });
          }
        }
        
        cartSubtotal += (itemCost * qtyToPayFor);
      });
      calculatedSubtotal = cartSubtotal;
    }
  `
);

// 5. In \`executeOrderSubmission\`, we need to actually deduct the credits!
// Wait, \`executeOrderSubmission\` is inside the component. But how do we mutate the sub?
// We need \`updateMealSubscription\` in AppContext! Wait, we don't have it. We have to add it.
fs.writeFileSync('src/views/CustomerView.tsx', code);
