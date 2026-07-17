const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const replacement = `
      updated = {
        ...existing,
        paymentVerificationStatus: 'approved' as const,
        status: 'accepted',
        paymentStatus: 'paid',
        timeline: [
          ...existing.timeline,
          { id: \`ev-\${Date.now()}-vp\`, time: new Date().toISOString(), label: 'Payment Verified', desc: 'Advance payment was verified by management.', actor: 'Manager' }
        ]
      };
      
      // Activate pending meal subscriptions for this customer
      if (existing.customerEmail || existing.customerPhone) {
        setCustomerSubscriptions(prev => {
          const newSubs = prev.map(sub => {
            if (
              (sub.customerId === existing.customerEmail || sub.customerId === existing.customerPhone) &&
              sub.tenantId === existing.tenantId &&
              sub.status === 'pending_approval'
            ) {
              return { ...sub, status: 'active' as const };
            }
            return sub;
          });
          
          newSubs.forEach(sub => {
             if (sub.status === 'active' && prev.find(p => p.id === sub.id)?.status === 'pending_approval') {
               // Update firestore if active
               syncToFirestore('customer_subscriptions', sub.id, sub);
             }
          });
          return newSubs;
        });
      }
`;

code = code.replace(
  /      updated = \{\s*\.\.\.existing,\s*paymentVerificationStatus: 'approved' as const,[\s\S]*?actor: 'Manager' \}\s*\]\s*\};/g,
  replacement
);

fs.writeFileSync('src/context/AppContext.tsx', code);
