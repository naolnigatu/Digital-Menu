const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

code = code.replace(
  /  const handleModifierToggle = \(groupName: string, optionName: string, price: number\) => \{[\s\S]*?\n  \};\n/m,
  ""
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
