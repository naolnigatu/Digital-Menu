const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

code = code.replace(
  "updateTenantProfile: (tenantId: string, logoUrl: string, bankAccount: string) => void;",
  "updateTenantProfile: (tenantId: string, logoUrl: string, bankAccount: string, mealSubscriptionDiscountPercent?: number) => void;"
);

code = code.replace(
  "const updateTenantProfile = (tenantId: string, logoUrl: string, bankAccount: string) => {",
  "const updateTenantProfile = (tenantId: string, logoUrl: string, bankAccount: string, mealSubscriptionDiscountPercent?: number) => {"
);

code = code.replace(
  "const updated = { ...t, logoUrl, bankAccount };",
  "const updated = { ...t, logoUrl, bankAccount, mealSubscriptionDiscountPercent };"
);

fs.writeFileSync('src/context/AppContext.tsx', code);
