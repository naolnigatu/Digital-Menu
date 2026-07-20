const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

code = code.replace(
  /  const handlePlaceOrder = \(\) => \{\n    if \(cart\.length === 0\) return;\n/,
  "  const handlePlaceOrder = () => {\n    if (cart.length === 0 && !isDirectCheckoutOpen) return;\n"
);

code = code.replace(
  /      items: cart\.map\(cartItem => \(\{\n        menuItemId: cartItem\.item\.id,\n        name: getTranslatedText\(cartItem\.item\)\.name,\n        quantity: cartItem\.qty,\n        price: cartItem\.item\.price,\n        notes: cartItem\.selectedMods\.length > 0 \? 'Mods: ' \+ cartItem\.selectedMods\.map\(m => m\.optionName\)\.join\(', '\) : undefined,\n        assignedStationId: cartItem\.item\.preparationStationId\n      \}\)\),/g,
  "      items: (isDirectCheckoutOpen && directCheckoutItem ? [directCheckoutItem] : cart).map(cartItem => ({\n        menuItemId: cartItem.item.id,\n        name: getTranslatedText(cartItem.item).name,\n        quantity: cartItem.qty,\n        price: cartItem.item.price,\n        notes: cartItem.selectedMods.length > 0 ? 'Mods: ' + cartItem.selectedMods.map((m: any) => m.optionName).join(', ') : undefined,\n        assignedStationId: cartItem.item.preparationStationId\n      })),"
);

code = code.replace(
  /        menuItemIds: cart\.map\(c => c\.item\.id\),/g,
  "        menuItemIds: (isDirectCheckoutOpen && directCheckoutItem ? [directCheckoutItem] : cart).map(c => c.item.id),"
);

code = code.replace(
  /    setIsCartOpen\(false\);\n    setCart\(\[\]\);\n/,
  "    setIsCartOpen(false);\n    setIsDirectCheckoutOpen(false);\n    if (!isDirectCheckoutOpen) setCart([]);\n    setDirectCheckoutItem(null);\n"
);


fs.writeFileSync('src/views/CustomerView.tsx', code);
