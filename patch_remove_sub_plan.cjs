const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

code = code.replace(
  /\{orderType === 'meal_subscription' && \([\s\S]*?<\/select>\s*\)\}\s*<\/div>\s*\)\}/,
  ""
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
