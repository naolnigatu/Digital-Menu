const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

code = code.replace(
  "updateTenantCurrency: (tenantId: string, currency: string, currencySymbol: string) => void;",
  "updateTenantCurrency: (tenantId: string, currency: string, currencySymbol: string) => void;\n  updateTenantType: (tenantId: string, businessType: string) => void;"
);

const func = `
  const updateTenantType = (tenantId: string, businessType: string) => {
    setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, businessType } : t));
  };
`;

code = code.replace(
  "const updateTenantCurrency = (tenantId: string, currency: string, currencySymbol: string) => {",
  func + "\n  const updateTenantCurrency = (tenantId: string, currency: string, currencySymbol: string) => {"
);

code = code.replace(
  "updateTenantCurrency,",
  "updateTenantCurrency,\n      updateTenantType,"
);

fs.writeFileSync('src/context/AppContext.tsx', code);
