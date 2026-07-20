const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

const missingStates = `
  const [selectedMods, setSelectedMods] = useState<{ groupName: string; optionName: string; price: number }[]>([]);
  const [itemNote, setItemNote] = useState('');
`;

code = code.replace(
  /  const \[itemQty, setItemQty\] = useState\(1\);\n/m,
  "  const [itemQty, setItemQty] = useState(1);\n" + missingStates
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
