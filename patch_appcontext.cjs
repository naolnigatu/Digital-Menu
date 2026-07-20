const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

code = code.replace(
  /    if \(orderData.type === 'meal_subscription'\) \{\n      subtotal = subtotal \* 30;/,
  `    if (orderData.type === 'meal_subscription') {
      const durationMatch = orderData.notes?.match(/Subscription Term: (\\d+) Days/);
      const subDays = durationMatch ? parseInt(durationMatch[1]) : 30;
      subtotal = subtotal * subDays;`
);

fs.writeFileSync('src/context/AppContext.tsx', code);
