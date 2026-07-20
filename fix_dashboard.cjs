const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerProfileDashboard.tsx', 'utf8');

code = code.replace(/o\.type !== 'subscription_redemption'/g, "o.type !== 'meal_subscription'");
code = code.replace(/o\.type === 'subscription_redemption'/g, "o.type === 'meal_subscription'");

fs.writeFileSync('src/components/CustomerProfileDashboard.tsx', code);
