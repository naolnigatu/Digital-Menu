const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  '  bankAccount?: string; // Bank details for advance payment\n}',
  '  bankAccount?: string; // Bank details for advance payment\n  mealSubscriptionDiscountPercent?: number;\n}'
);

fs.writeFileSync('src/types.ts', code);
