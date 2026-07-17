const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

code = code.replace(
  '<div className="text-left">',
  '<div className="text-left hidden md:block">'
);

fs.writeFileSync('src/components/Navbar.tsx', code);
