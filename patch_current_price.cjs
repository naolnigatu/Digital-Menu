const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

const updatedCurrentPrice = `
  const currentItemPrice = useMemo(() => {
    if (!activeItemDetails) return 0;
    let total = activeItemDetails.price;
    selectedMods.forEach(m => { total += m.price; });
    let finalTotal = total * itemQty;
    if (orderType === 'meal_subscription') {
      finalTotal = finalTotal * subscriptionDurationDays;
      if (activeTenant.mealSubscriptionDiscountPercent) {
        finalTotal = finalTotal - (finalTotal * (activeTenant.mealSubscriptionDiscountPercent / 100));
      }
    }
    return finalTotal;
  }, [activeItemDetails, selectedMods, itemQty, orderType, subscriptionDurationDays, activeTenant.mealSubscriptionDiscountPercent]);
`;

code = code.replace(
  /  const currentItemPrice = useMemo\(\(\) => \{[\s\S]*?  \}, \[activeItemDetails, selectedMods, itemQty\]\);/,
  updatedCurrentPrice.trim()
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
