const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

code = code.replace(
  "features: ['1 branch', 'digital menus & QR scans']",
  "features: ['1 branch', 'digital menus & QR scans'],\n        enabledTabs: ['dashboard', 'orders', 'menu', 'tables', 'settings']"
);
code = code.replace(
  "features: ['Multi-branch', 'full KDS', 'automated metrics']",
  "features: ['Multi-branch', 'full KDS', 'automated metrics'],\n        enabledTabs: ['dashboard', 'orders', 'menu', 'tables', 'staff', 'settings', 'payments', 'loyalty', 'reports', 'reservations', 'ads']"
);
code = code.replace(
  "features: ['Custom workflows', 'unlimited everything']",
  "features: ['Custom workflows', 'unlimited everything'],\n        enabledTabs: ['dashboard', 'orders', 'menu', 'tables', 'staff', 'settings', 'payments', 'loyalty', 'reports', 'reservations', 'inventory', 'ads', 'marketplace', 'subscriptions']"
);

// Add to context type
code = code.replace(
  "updatePlanPrice: (planId: SubscriptionPlan, newPriceUSD: number, newPriceETB: number) => void;",
  "updatePlanPrice: (planId: SubscriptionPlan, newPriceUSD: number, newPriceETB: number) => void;\n  updatePlanTabs: (planId: string, enabledTabs: string[]) => void;"
);

// Add the update function
const func = `  const updatePlanTabs = (planId: string, enabledTabs: string[]) => {
    setPricingPlans(prev => prev.map(p => p.id === planId ? { ...p, enabledTabs } : p));
  };`;

code = code.replace(
  "const updatePlanPrice = (planId: SubscriptionPlan, newPriceUSD: number, newPriceETB: number) => {",
  func + "\n  const updatePlanPrice = (planId: SubscriptionPlan, newPriceUSD: number, newPriceETB: number) => {"
);

code = code.replace(
  "updatePlanPrice,",
  "updatePlanPrice,\n      updatePlanTabs,"
);

fs.writeFileSync('src/context/AppContext.tsx', code);
