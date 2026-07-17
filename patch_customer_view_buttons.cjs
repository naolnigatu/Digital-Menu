const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

code = code.replace(
  '<span className="hidden sm:inline">Book Table</span>',
  '<span className="hidden md:inline">Book Table</span>'
);

code = code.replace(
  "<span className=\"hidden sm:inline\">{customerEmailForDashboard ? 'My Profile' : 'Sign In'}</span>",
  "<span className=\"hidden md:inline\">{customerEmailForDashboard ? 'My Profile' : 'Sign In'}</span>"
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
