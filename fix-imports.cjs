const fs = require('fs');
let code = fs.readFileSync('src/views/SuperAdminView.tsx', 'utf-8');

code = code.replace(
  /Compass, Laptop, ShieldCheck, Mail, Radio, Key, ToggleLeft, HelpCircle,/,
  'Compass, Laptop, ShieldCheck, Mail, Radio, Key, ToggleLeft, HelpCircle, Globe,'
);

fs.writeFileSync('src/views/SuperAdminView.tsx', code);
