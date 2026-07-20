const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

code = code.replace(
  /          \{\/\* Localized Language Switcher \(Aisha Amharic support\) \*\/\}[\s\S]*?<\/button>\s*\)\}/,
  ''
);

fs.writeFileSync('src/components/Navbar.tsx', code);
