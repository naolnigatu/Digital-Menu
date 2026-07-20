const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const subtotalLogic = `
    let subtotal = 0;
    orderData.items.forEach(it => {
      let itemCost = it.price;
      (it.selectedModifiers || []).forEach(m => {
        itemCost += m.price;
      });
      subtotal += itemCost * it.quantity;
    });

    if (orderData.type === 'meal_subscription') {
      subtotal = subtotal * 30;
      if (tenant.mealSubscriptionDiscountPercent && tenant.mealSubscriptionDiscountPercent > 0) {
        subtotal = subtotal - (subtotal * (tenant.mealSubscriptionDiscountPercent / 100));
      }
    }
`;

code = code.replace(
/    let subtotal = 0;\n    orderData\.items\.forEach\(it => \{\n      let itemCost = it\.price;\n      \(it\.selectedModifiers \|\| \[\]\)\.forEach\(m => \{\n        itemCost \+= m\.price;\n      \}\);\n      subtotal \+= itemCost \* it\.quantity;\n    \}\);/,
subtotalLogic
);

fs.writeFileSync('src/context/AppContext.tsx', code);
