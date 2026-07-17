const fs = require('fs');
let code = fs.readFileSync('src/views/BusinessOwnerView.tsx', 'utf8');

const useAppStr = `
  const { 
    tenants, 
    branches, 
    orders, 
    activeTenantId, 
    activeBranchId,
    pricingPlans,
    requestSubscriptionUpgrade, 
    superAdminPaymentInfo,
    updateTenantType
  } = useApp();

  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<string | null>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subDuration, setSubDuration] = useState<number>(1);
  const [subMethod, setSubMethod] = useState('bank_transfer');
  const [subTxId, setSubTxId] = useState('');
  const [subProof, setSubProof] = useState('');
  const [editingBusinessType, setEditingBusinessType] = useState('');
  const [isEditingBizType, setIsEditingBizType] = useState(false);
  
  const activeTenant = tenants.find(t => t.id === activeTenantId);
  const activePlanDef = activeTenant ? pricingPlans.find(p => p.id === activeTenant.subscriptionPlan) : null;
  const enabledTabs = activePlanDef?.enabledTabs || ['dashboard', 'orders', 'menu', 'tables', 'settings'];

  const isTabEnabled = (tabId: string) => enabledTabs.includes(tabId);
`;

code = code.replace(
  "const { tenants, branches, orders, activeTenantId, activeBranchId } = useApp();",
  useAppStr
);

// wait, the previous search said: `superAdminPaymentInfo,\n    updateTenantType\n  } = useApp();` existed. Let's check what useApp actually looks like now.
fs.writeFileSync('src/views/BusinessOwnerView.tsx', code);
