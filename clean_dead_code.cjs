const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

// remove currentItemPrice, handleAddToCart, handleOrderNow, and their dependencies
code = code.replace(
  /  const currentItemPrice = useMemo\([\s\S]*?\n  \};\n\n  const calculateCartTotal/m,
  "  const calculateCartTotal"
);

code = code.replace(
  /const \[activeItemDetails, setActiveItemDetails\] = useState<MenuItem \| null>\(null\);\n/m,
  ""
);

code = code.replace(
  /const \[selectedMods, setSelectedMods\] = useState<any\[\]>\(\[\]\);\n  const \[itemNote, setItemNote\] = useState\(''\);\n  const \[itemQty, setItemQty\] = useState\(1\);\n  const \[selectedPortion, setSelectedPortion\] = useState<any>\(null\);\n/m,
  ""
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
