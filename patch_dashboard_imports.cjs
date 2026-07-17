const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerProfileDashboard.tsx', 'utf8');

code = code.replace(
  '    loyaltyConfigs\n  } = useApp();',
  '    loyaltyConfigs,\n    placeOrder,\n    logMealService\n  } = useApp();'
);

fs.writeFileSync('src/components/CustomerProfileDashboard.tsx', code);
