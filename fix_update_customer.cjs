const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

code = code.replace(
  "id: `cust-${Date.now()}`,",
  "id: currentUser?.uid || `cust-${Date.now()}`,"
);

fs.writeFileSync('src/context/AppContext.tsx', code);
