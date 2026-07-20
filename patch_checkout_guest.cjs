const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

const validationLogic = `
    const isPrepaidType = ['pickup', 'delivery', 'drive_through', 'meal_subscription'].includes(orderType);
    
    // Require signup for meal subscriptions
    if (orderType === 'meal_subscription' && !customerEmailForDashboard) {
      showToast('Please sign in or register to purchase a meal subscription.', 'error');
      setIsCartOpen(false);
      setIsDirectCheckoutOpen(false);
      setIsEmailLoginModalOpen(true);
      return;
    }

    if (isPrepaidType) {
`;

code = code.replace(
  /    const isPrepaidType = \['pickup', 'delivery', 'drive_through', 'meal_subscription'\].includes\(orderType\);\n    if \(isPrepaidType\) \{/g,
  validationLogic
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
