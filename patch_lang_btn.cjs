const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

code = code.replace(
  /<button\s+onClick=\{[^}]+\}\s+className="bg-white\/10 text-white hover:bg-white\/20 transition-colors border-none rounded-lg px-2.5 py-1 text-\[11px\] font-bold flex items-center gap-1"\s+>\s+<Languages className="h-3 w-3" \/>\s+\{currentLanguage === 'en' \? 'EN' : 'አማ'\}\s+<\/button>/s,
  ''
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
