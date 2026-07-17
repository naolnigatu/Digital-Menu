const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

code = code.replace(
  '<span className="hidden sm:inline">PWA Offline Mode</span>',
  '<span className="hidden lg:inline">PWA Offline Mode</span>'
);
code = code.replace(
  '<span className="hidden sm:inline">PWA Live Sync</span>',
  '<span className="hidden lg:inline">PWA Live Sync</span>'
);

fs.writeFileSync('src/components/Navbar.tsx', code);
