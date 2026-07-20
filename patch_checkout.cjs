const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

// Add states
code = code.replace(
  /  const \[isCartOpen, setIsCartOpen\] = useState\(false\);\n/,
  "  const [isCartOpen, setIsCartOpen] = useState(false);\n  const [directCheckoutItem, setDirectCheckoutItem] = useState<any>(null);\n  const [isDirectCheckoutOpen, setIsDirectCheckoutOpen] = useState(false);\n"
);

// Modify handleOrderNow
code = code.replace(
/  const handleOrderNow = \(\) => \{[\s\S]*?  \};\n/,
  "  const handleOrderNow = () => {\n" +
  "    setDirectCheckoutItem({ item: activeItemDetails, selectedMods, qty: itemQty });\n" +
  "    setIsDirectCheckoutOpen(true);\n" +
  "    setActiveItemDetails(null);\n" +
  "  };\n"
);

// Ensure the calculateCartTotal uses the direct checkout item if open
code = code.replace(
/  const getSubtotalWithSubscription = \(\) => \{[\s\S]*?  \};\n/,
  "  const getSubtotalWithSubscription = () => {\n" +
  "    let sub = 0;\n" +
  "    if (isDirectCheckoutOpen && directCheckoutItem) {\n" +
  "      sub = directCheckoutItem.item.price;\n" +
  "      directCheckoutItem.selectedMods.forEach((m: any) => { sub += m.price; });\n" +
  "      sub = sub * directCheckoutItem.qty;\n" +
  "    } else {\n" +
  "      sub = calculateCartTotal();\n" +
  "    }\n" +
  "    if (orderType === 'meal_subscription') {\n" +
  "      sub = sub * 30;\n" +
  "    }\n" +
  "    return sub;\n" +
  "  };\n"
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
