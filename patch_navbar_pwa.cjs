const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

code = code.replace(
  'sm:inline-block uppercase tracking-wider">PWA SaaS</span>',
  'lg:inline-block uppercase tracking-wider">PWA SaaS</span>'
);

code = code.replace(
  '<p className="hidden text-[10px] font-bold text-slate-400 md:block uppercase tracking-wide">',
  '<p className="hidden text-[10px] font-bold text-slate-400 lg:block uppercase tracking-wide">'
);

code = code.replace(
  'md:inline-block">\n              Operational\n            </span>',
  'lg:inline-block">\n              Operational\n            </span>'
);

fs.writeFileSync('src/components/Navbar.tsx', code);
