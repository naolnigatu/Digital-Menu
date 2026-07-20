const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

code = code.replace(
  '<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">',
  '<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">'
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
