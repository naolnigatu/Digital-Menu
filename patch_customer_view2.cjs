const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

code = code.replace(
  '<MapPin className="h-3.5 w-3.5" />\n                  Book Table',
  '<MapPin className="h-3.5 w-3.5" />\n                  <span className="hidden sm:inline">Book Table</span>'
);

code = code.replace(
  "<User className=\"h-3.5 w-3.5\" />\n                  {customerEmailForDashboard ? 'My Profile' : 'Sign In'}",
  "<User className=\"h-3.5 w-3.5\" />\n                  <span className=\"hidden sm:inline\">{customerEmailForDashboard ? 'My Profile' : 'Sign In'}</span>"
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
