const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

const newTypes = `
export interface SubscriptionRequest {
  id: string;
  tenantId: string;
  planId: string;
  duration: number; // in months: 1, 3, 6, 12, 24
  paymentMethod: string;
  transactionId?: string;
  proofImageUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}
`;

code = code + newTypes;
fs.writeFileSync('src/types.ts', code);
