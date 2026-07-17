const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

code = code.replace(
  "const cleanEmail = (email || '').toLowerCase().trim();",
  "const cleanEmail = (typeof email === 'string' ? email : '').toLowerCase().trim();"
);

fs.writeFileSync('src/context/AppContext.tsx', code);
