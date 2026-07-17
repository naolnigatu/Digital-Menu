const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

code = code.replace(
  '<div className="flex items-center gap-2 min-w-0">',
  '<div className="flex-1 flex items-center gap-2 min-w-0">'
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
