const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerProfileDashboard.tsx', 'utf8');

code = code.replace(
  "orderType: 'dine_in',",
  "orderType: 'subscription_redemption',"
);

fs.writeFileSync('src/components/CustomerProfileDashboard.tsx', code);
