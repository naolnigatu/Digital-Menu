const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

code = code.replace(
  /  const \[selectedMods, setSelectedMods\] = useState[\s\S]*?\n/m,
  ""
);

code = code.replace(
  /  const \[itemNote, setItemNote\] = useState\(''\);\n/m,
  ""
);

code = code.replace(
  /  const \[itemQty, setItemQty\] = useState\(1\);\n/m,
  ""
);

code = code.replace(
  /  const \[selectedPortion, setSelectedPortion\] = useState<any>\(null\);\n/m,
  ""
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
