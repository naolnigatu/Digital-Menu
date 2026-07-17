const fs = require('fs');
let code = fs.readFileSync('src/views/BusinessOwnerView.tsx', 'utf8');

code = code.replace(
  "    updateCustomerProfile,\n  } = useApp();",
  "    updateCustomerProfile,\n    requestSubscriptionUpgrade,\n    superAdminPaymentInfo,\n    updateTenantType,\n  } = useApp();\n\n  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<string | null>(null);\n  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);\n  const [subDuration, setSubDuration] = useState<number>(1);\n  const [subMethod, setSubMethod] = useState('bank_transfer');\n  const [subTxId, setSubTxId] = useState('');\n  const [subProof, setSubProof] = useState('');\n  const [editingBusinessType, setEditingBusinessType] = useState('');\n  const [isEditingBizType, setIsEditingBizType] = useState(false);\n  const activeTenant = tenants.find(t => t.id === activeTenantId);\n  const activePlanDef = activeTenant ? pricingPlans.find(p => p.id === activeTenant.subscriptionPlan) : null;\n  const enabledTabs = activePlanDef?.enabledTabs || ['dashboard', 'orders', 'menu', 'tables', 'settings'];\n  const isTabEnabled = (tabId: string) => enabledTabs.includes(tabId);\n"
);

fs.writeFileSync('src/views/BusinessOwnerView.tsx', code);
