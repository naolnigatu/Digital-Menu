const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

code = code.replace(
  `subscribeToMealPlan: (subscription: Omit<CustomerMealSubscription, 'id'>) => void;`,
  `subscribeToMealPlan: (subscription: Omit<CustomerMealSubscription, 'id'>) => void;
  updateCustomerMealSubscription: (subId: string, updates: Partial<CustomerMealSubscription>) => void;`
);

const oldSubFunc = `  const subscribeToMealPlan = (subData: Omit<CustomerMealSubscription, 'id'>) => {
    const id = \`cust-sub-\${Date.now()}\`;
    const newSub: CustomerMealSubscription = { ...subData, id };
    setCustomerSubscriptions(prev => [...prev, newSub]);
    addLog('Meal Plan Subscription', \`Customer subscribed to meal plan ID: \${subData.packageId}\`);
    syncToFirestore('customer_subscriptions', id, newSub);
  };`;

const newSubFunc = `  const subscribeToMealPlan = (subData: Omit<CustomerMealSubscription, 'id'>) => {
    const id = \`cust-sub-\${Date.now()}\`;
    const newSub: CustomerMealSubscription = { ...subData, id };
    setCustomerSubscriptions(prev => [...prev, newSub]);
    addLog('Meal Plan Subscription', \`Customer subscribed to meal plan ID: \${subData.packageId}\`);
    syncToFirestore('customer_subscriptions', id, newSub);
  };

  const updateCustomerMealSubscription = (subId: string, updates: Partial<CustomerMealSubscription>) => {
    setCustomerSubscriptions(prev => {
      const existing = prev.find(s => s.id === subId);
      if (!existing) return prev;
      const updated = { ...existing, ...updates };
      syncToFirestore('customer_subscriptions', subId, updated);
      return prev.map(s => s.id === subId ? updated : s);
    });
  };`;
code = code.replace(oldSubFunc, newSubFunc);

code = code.replace(
  `subscribeToMealPlan,`,
  `subscribeToMealPlan,
      updateCustomerMealSubscription,`
);

fs.writeFileSync('src/context/AppContext.tsx', code);
