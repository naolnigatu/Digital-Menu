const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const interfaceReplacement = `  subscriptionRequests: SubscriptionRequest[];
  superAdminPaymentInfo: string;
  setSuperAdminPaymentInfo: (info: string) => void;
  requestSubscriptionUpgrade: (tenantId: string, planId: string, duration: number, paymentMethod: string, transactionId?: string, proofImageUrl?: string) => void;
  approveSubscriptionRequest: (reqId: string) => void;
  rejectSubscriptionRequest: (reqId: string) => void;`;

code = code.replace(
  'updateTenantPlan: (tenantId: string, planId: string) => void;',
  'updateTenantPlan: (tenantId: string, planId: string) => void;\n' + interfaceReplacement
);

// Add state
code = code.replace(
  'const [tenants, setTenants] = useState<Tenant[]>([]);',
  'const [tenants, setTenants] = useState<Tenant[]>([]);\n  const [subscriptionRequests, setSubscriptionRequests] = useState<SubscriptionRequest[]>([]);\n  const [superAdminPaymentInfo, setSuperAdminPaymentInfo] = useState<string>("CBE Account: 1000123456789 (Dinex Inc)\\nPlease transfer and upload receipt.");'
);

// Add functions
const funcs = `
  const requestSubscriptionUpgrade = (tenantId: string, planId: string, duration: number, paymentMethod: string, transactionId?: string, proofImageUrl?: string) => {
    const newReq: SubscriptionRequest = {
      id: Math.random().toString(36).substr(2, 9),
      tenantId,
      planId,
      duration,
      paymentMethod,
      transactionId,
      proofImageUrl,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setSubscriptionRequests(prev => [newReq, ...prev]);
  };

  const approveSubscriptionRequest = (reqId: string) => {
    setSubscriptionRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'approved' } : r));
    const req = subscriptionRequests.find(r => r.id === reqId);
    if (req) {
      setTenants(prev => prev.map(t => {
        if (t.id === req.tenantId) {
          const now = new Date();
          now.setMonth(now.getMonth() + req.duration);
          return {
            ...t,
            subscriptionPlan: req.planId,
            subscriptionStatus: 'active',
            subscriptionExpiry: now.toISOString()
          };
        }
        return t;
      }));
    }
  };

  const rejectSubscriptionRequest = (reqId: string) => {
    setSubscriptionRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'rejected' } : r));
    const req = subscriptionRequests.find(r => r.id === reqId);
    if (req) {
      setTenants(prev => prev.map(t => {
        if (t.id === req.tenantId) {
          return {
            ...t,
            // remain on current plan
          };
        }
        return t;
      }));
    }
  };
`;

code = code.replace(
  'const updateTenantPlan = (tenantId: string, planId: string) => {',
  funcs + '\n  const updateTenantPlan = (tenantId: string, planId: string) => {'
);

// Add to returned object
code = code.replace(
  'updateTenantPlan,',
  'updateTenantPlan,\n      subscriptionRequests,\n      superAdminPaymentInfo,\n      setSuperAdminPaymentInfo,\n      requestSubscriptionUpgrade,\n      approveSubscriptionRequest,\n      rejectSubscriptionRequest,'
);

fs.writeFileSync('src/context/AppContext.tsx', code);
