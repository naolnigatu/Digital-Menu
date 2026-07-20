const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerProfileDashboard.tsx', 'utf8');

code = code.replace(
  /    placeOrder,\n    logMealService\n  \} = useApp\(\);/m,
  `    placeOrder,
    logMealService,
    updateOrderStatus
  } = useApp();`
);

fs.writeFileSync('src/components/CustomerProfileDashboard.tsx', code);
