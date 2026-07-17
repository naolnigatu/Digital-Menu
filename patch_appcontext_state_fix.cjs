const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const stateStr = `
  const [subscriptionRequests, setSubscriptionRequests] = useState<SubscriptionRequest[]>([]);
  const [superAdminPaymentInfo, setSuperAdminPaymentInfo] = useState<string>("CBE Account: 1000123456789 (Dinex Inc)\\nPlease transfer and upload receipt.");

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
  };
`;

code = code.replace(
  "export function AppProvider({ children }: { children: React.ReactNode }) {",
  "export function AppProvider({ children }: { children: React.ReactNode }) {\n" + stateStr
);

fs.writeFileSync('src/context/AppContext.tsx', code);
