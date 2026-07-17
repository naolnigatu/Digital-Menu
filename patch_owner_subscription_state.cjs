const fs = require('fs');
let code = fs.readFileSync('src/views/BusinessOwnerView.tsx', 'utf8');

const missingState = `
  const { requestSubscriptionUpgrade, superAdminPaymentInfo } = useApp();
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<string | null>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subDuration, setSubDuration] = useState<number>(1);
  const [subMethod, setSubMethod] = useState('bank_transfer');
  const [subTxId, setSubTxId] = useState('');
  const [subProof, setSubProof] = useState('');
  const [editingBusinessType, setEditingBusinessType] = useState('');
  const [isEditingBizType, setIsEditingBizType] = useState(false);
`;

code = code.replace(
  "const activePlanDef = pricingPlans.find(p => p.id === tenant.subscriptionPlan);",
  missingState + "\n  const activePlanDef = pricingPlans.find(p => p.id === tenant.subscriptionPlan);"
);

fs.writeFileSync('src/views/BusinessOwnerView.tsx', code);
