const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

const calcStr = `
  const getSubtotalWithSubscription = () => {
    let sub = calculateCartTotal();
    if (orderType === 'meal_subscription') {
      sub = sub * 30;
    }
    return sub;
  };
`;

code = code.replace(
  /  const calculateCartTotal = \(\) => \{[\s\S]*?  \};\n/,
  "  const calculateCartTotal = () => {\n" +
  "    return cart.reduce((acc, curr) => {\n" +
  "      let itemTotal = curr.item.price;\n" +
  "      curr.selectedMods.forEach(m => { itemTotal += m.price; });\n" +
  "      return acc + (itemTotal * curr.qty);\n" +
  "    }, 0);\n" +
  "  };\n" + calcStr
);

code = code.replace(
/<span>-\{activeTenant\.currencySymbol\} \{\(\(calculateCartTotal\(\) \* finalDiscountPct\) \/ 100\)\.toFixed\(2\)\}<\/span>/g,
"<span>-{activeTenant.currencySymbol} {((getSubtotalWithSubscription() * finalDiscountPct) / 100).toFixed(2)}</span>"
);

code = code.replace(
/<span>\{activeTenant\.currencySymbol\} \{\(\(calculateCartTotal\(\) \* \(100 - finalDiscountPct\)\) \/ 100 \+ selectedTipAmount\)\.toFixed\(2\)\}<\/span>/g,
"<span>{activeTenant.currencySymbol} {((getSubtotalWithSubscription() * (100 - finalDiscountPct)) / 100 + selectedTipAmount).toFixed(2)}</span>"
);

// also in handlePlaceOrder:
code = code.replace(
/    let calculatedSubtotal = calculateCartTotal\(\);\n    if \(orderType === 'meal_subscription'\) \{\n      calculatedSubtotal = calculatedSubtotal \* 30; \/\/ 30 days of meals\n    \}/g,
"    let calculatedSubtotal = getSubtotalWithSubscription();"
);


fs.writeFileSync('src/views/CustomerView.tsx', code);
