const fs = require('fs');
let code = fs.readFileSync('src/context/DinexContext.tsx', 'utf8');

code = code.replace(
  "const plan: string = activeBusiness.ownerId === 'u-aisha' ? 'growth' : 'free'; // Custom simulation parity",
  "const plan = activeBusiness.subscriptionPlan || 'free';"
);

fs.writeFileSync('src/context/DinexContext.tsx', code);
