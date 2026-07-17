const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

code = code.replace(
  /} else {\n\s*showNotice\(`Google Sign-In Error: \$\{error\?\.message \|\| 'Check network or try again\.'\}`,\s*"error"\);\n\s*}/g,
  "} else if (error?.code !== 'auth/popup-closed-by-user') {\n        showNotice(`Google Sign-In Error: ${error?.message || 'Check network or try again.'}`, \"error\");\n      }"
);

code = code.replace(
  /} else {\n\s*showNotice\(`Google Authentication Error: \$\{error\?\.message \|\| 'Please fill in details manually\.'\}`,\s*"error"\);\n\s*}/g,
  "} else if (error?.code !== 'auth/popup-closed-by-user') {\n        showNotice(`Google Authentication Error: ${error?.message || 'Please fill in details manually.'}`, \"error\");\n      }"
);

fs.writeFileSync('src/components/Navbar.tsx', code);
