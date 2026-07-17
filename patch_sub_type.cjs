const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  "  status: 'active' | 'expired' | 'cancelled';",
  "  status: 'active' | 'expired' | 'cancelled' | 'pending_approval';"
);

fs.writeFileSync('src/types.ts', code);
