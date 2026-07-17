const fs = require('fs');
let code = fs.readFileSync('src/views/LandingPageView.tsx', 'utf8');

code = code.replace(
  /login\(\{\s*id: 'user-1',\s*name: 'Demo Owner',\s*email: 'demo@menuflow\.com',\s*role: 'owner',\s*tenantId: 'tenant-1'\s*\}\);/,
  "login('demo@menuflow.com');"
);

fs.writeFileSync('src/views/LandingPageView.tsx', code);
