const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

code = code.replace(
  '<span>Log In / Register</span>',
  '<span className="hidden md:inline">Log In / Register</span>'
);

fs.writeFileSync('src/components/Navbar.tsx', code);
