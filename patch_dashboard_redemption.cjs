const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerProfileDashboard.tsx', 'utf8');

code = code.replace(/o\.type !== 'meal_subscription'/g, "o.type !== 'subscription_redemption'");
code = code.replace(/o\.type === 'meal_subscription'/g, "o.type === 'subscription_redemption'");

fs.writeFileSync('src/components/CustomerProfileDashboard.tsx', code);
