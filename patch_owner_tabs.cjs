const fs = require('fs');
let code = fs.readFileSync('src/views/BusinessOwnerView.tsx', 'utf8');

const replacement = `const { 
    tenants, 
    branches, 
    orders, 
    activeTenantId, 
    activeBranchId,
    pricingPlans
  } = useApp();

  const activePlanDef = pricingPlans.find(p => p.id === tenant.subscriptionPlan);
  const enabledTabs = activePlanDef?.enabledTabs || ['dashboard', 'orders', 'menu', 'tables', 'settings'];

  const isTabEnabled = (tabId) => enabledTabs.includes(tabId);`;

code = code.replace(
  "const { \n    tenants, \n    branches, \n    orders, \n    activeTenantId, \n    activeBranchId\n  } = useApp();",
  replacement
);

code = code.replace(
  "const { tenants, branches, orders, activeTenantId, activeBranchId } = useApp();",
  replacement
);

// We need to modify the buttons to only show if isTabEnabled(tabId) is true.
// E.g. `{can('reports.view') && isTabEnabled('dashboard') && (`

code = code.replace(/\{can\('reports\.view'\) && \(/g, "{can('reports.view') && isTabEnabled('dashboard') && (");
code = code.replace(/\{can\('orders\.manage'\) && \(/g, "{can('orders.manage') && isTabEnabled('orders') && (");
code = code.replace(/\{can\('menu\.create'\) && \(/g, "{can('menu.create') && isTabEnabled('menu') && (");
code = code.replace(/\{can\('business\.edit'\) && \(\s*<button\s*onClick=\{([^}]+)\setActiveSubTab\('tables'\)/g, "{can('business.edit') && isTabEnabled('tables') && (\n          <button\n            onClick={() => setActiveSubTab('tables')}");
code = code.replace(/\{can\('staff\.manage'\) && \(\s*<button\s*onClick=\{([^}]+)\setActiveSubTab\('staff'\)/g, "{can('staff.manage') && isTabEnabled('staff') && (\n          <button\n            onClick={() => setActiveSubTab('staff')}");
code = code.replace(/\{can\('payments\.verify'\) && \(\s*<button\s*onClick=\{([^}]+)\setActiveSubTab\('payments'\)/g, "{can('payments.verify') && isTabEnabled('payments') && (\n          <button\n            onClick={() => setActiveSubTab('payments')}");
code = code.replace(/\{can\('business\.edit'\) && \(\s*<button\s*onClick=\{([^}]+)\setActiveSubTab\('loyalty'\)/g, "{can('business.edit') && isTabEnabled('loyalty') && (\n          <button\n            onClick={() => setActiveSubTab('loyalty')}");
code = code.replace(/\{can\('business\.edit'\) && \(\s*<button\s*onClick=\{([^}]+)\setActiveSubTab\('subscriptions'\)/g, "{can('business.edit') && isTabEnabled('subscriptions') && (\n          <button\n            onClick={() => setActiveSubTab('subscriptions')}");
code = code.replace(/\{isFeatureEnabled\('reservations'\) && can\('orders\.manage'\) && \(\s*<button\s*onClick=\{([^}]+)\setActiveSubTab\('reservations'\)/g, "{isFeatureEnabled('reservations') && can('orders.manage') && isTabEnabled('reservations') && (\n          <button\n            onClick={() => setActiveSubTab('reservations')}");
code = code.replace(/\{tenant\.subscriptionPlan === 'enterprise' && can\('business\.edit'\) && \(\s*<button\s*onClick=\{([^}]+)\setActiveSubTab\('inventory'\)/g, "{tenant.subscriptionPlan === 'enterprise' && can('business.edit') && isTabEnabled('inventory') && (\n          <button\n            onClick={() => setActiveSubTab('inventory')}");
code = code.replace(/\{can\('business\.edit'\) && \(\s*<button\s*onClick=\{([^}]+)\setActiveSubTab\('ads'\)/g, "{can('business.edit') && isTabEnabled('ads') && (\n          <button\n            onClick={() => setActiveSubTab('ads')}");
code = code.replace(/\{can\('business\.edit'\) && \(\s*<button\s*onClick=\{([^}]+)\setActiveSubTab\('marketplace'\)/g, "{can('business.edit') && isTabEnabled('marketplace') && (\n          <button\n            onClick={() => setActiveSubTab('marketplace')}");
code = code.replace(/\{can\('business\.edit'\) && \(\s*<button\s*onClick=\{([^}]+)\setActiveSubTab\('settings'\)/g, "{can('business.edit') && isTabEnabled('settings') && (\n          <button\n            onClick={() => setActiveSubTab('settings')}");

fs.writeFileSync('src/views/BusinessOwnerView.tsx', code);
