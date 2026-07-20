const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerProfileDashboard.tsx', 'utf8');

if (!code.includes('updateOrderStatus,')) {
  code = code.replace(
    /    placeOrder,\n    logMealService\n  \} = useApp\(\);/m,
    `    placeOrder,
    logMealService,
    updateOrderStatus
  } = useApp();`
  );
}

// And fix the dummy `useApp` var inside my previous patch!
code = code.replace(
  /const \{ updateOrderStatus, logMealService \} = useApp; \/\/ wait, this is inside render, I should use the hook vars/m,
  ""
);

fs.writeFileSync('src/components/CustomerProfileDashboard.tsx', code);
