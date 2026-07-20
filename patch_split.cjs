const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerProfileDashboard.tsx', 'utf8');

code = code.replace(
  /name: customerEmail\.split\('@'\)\[0\],/,
  "name: (customerEmail || '').split('@')[0] || 'Guest',"
);

fs.writeFileSync('src/components/CustomerProfileDashboard.tsx', code);
