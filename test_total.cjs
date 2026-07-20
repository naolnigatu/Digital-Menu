const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

const replacementSubtotal = `
    let calculatedSubtotal = calculateCartTotal();
    if (orderType === 'meal_subscription') {
      calculatedSubtotal = calculatedSubtotal * 30; // 30 days of meals
    }
`;

code = code.replace(
  'const calculatedSubtotal = calculateCartTotal();',
  replacementSubtotal
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
