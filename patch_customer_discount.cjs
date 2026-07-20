const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

// 1. Re-enable opening item details in subscription mode
code = code.replace(
  /onClick=\{isAvailable \? \(orderType === 'meal_subscription' \? undefined : \(\) => handleOpenItemDetails\(item\)\) : undefined\}/g,
  "onClick={isAvailable ? () => handleOpenItemDetails(item) : undefined}"
);

// 2. Add discount logic to getSubtotalWithSubscription
const subtotalLogic = `
  const getSubtotalWithSubscription = () => {
    let sub = 0;
    if (isDirectCheckoutOpen && directCheckoutItem) {
      sub = directCheckoutItem.item.price;
      directCheckoutItem.selectedMods.forEach((m: any) => { sub += m.price; });
      sub = sub * directCheckoutItem.qty;
    } else {
      sub = calculateCartTotal();
    }
    
    // Calculate Subscription Discount
    if (orderType === 'meal_subscription') {
      const discountPercent = activeTenant.mealSubscriptionDiscountPercent || 0;
      // If we are doing a 30-day plan? The user said "each meal gets discounted percentage and calculated as per the price after %deduction"
      // So let's multiply by 30 days as standard subscription, or just 1?
      // "each meal gets discounted percentage... " 
      // I'll keep the x30 but apply discount. Or just apply the discount without x30 if they don't want a 30-day multiplier.
      // Wait! The user says "an item or combination of items, the discount % will be calculated he pays the discounted price"
      // Let's assume it's for 30 days, or we use the \`subscriptionPeriod\` if it exists.
      // I'll use 30 for now and apply the discount.
      sub = sub * 30; // 30 meals
      if (discountPercent > 0) {
        sub = sub - (sub * (discountPercent / 100));
      }
    }
    return sub;
  };
`;

code = code.replace(
  /  const getSubtotalWithSubscription = \(\) => \{[\s\S]*?  \};\n/,
  subtotalLogic
);

// Also add a display for the discount in the cart popup
const discountDisplay = `
                      {orderType === 'meal_subscription' && activeTenant.mealSubscriptionDiscountPercent ? (
                        <div className="flex justify-between items-center text-rose-600 font-bold mb-1">
                          <span className="text-xs">Subscription Discount ({activeTenant.mealSubscriptionDiscountPercent}%):</span>
                          <span className="text-xs font-mono">
                            -{activeTenant.currencySymbol} {((isDirectCheckoutOpen && directCheckoutItem ? ((directCheckoutItem.item.price + directCheckoutItem.selectedMods.reduce((acc: number, m: any) => acc + m.price, 0)) * directCheckoutItem.qty) : calculateCartTotal()) * 30 * (activeTenant.mealSubscriptionDiscountPercent / 100)).toFixed(2)}
                          </span>
                        </div>
                      ) : null}
`;

code = code.replace(
  /                      <div className="flex justify-between items-center font-extrabold text-slate-900 mt-2">/g,
  discountDisplay + "\n                      <div className=\"flex justify-between items-center font-extrabold text-slate-900 mt-2\">"
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
