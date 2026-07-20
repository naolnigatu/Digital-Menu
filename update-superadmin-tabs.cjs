const fs = require('fs');
let code = fs.readFileSync('src/views/SuperAdminView.tsx', 'utf-8');

code = code.replace(
  /\{ id: 'health', label: 'Platform Health', icon: Activity, emoji: '🌍' \},/,
  `{ id: 'health', label: 'Platform Health', icon: Activity, emoji: '🌍' },\n    { id: 'landing_page', label: 'Landing Page', icon: Globe, emoji: '🌐' },`
);

fs.writeFileSync('src/views/SuperAdminView.tsx', code);
