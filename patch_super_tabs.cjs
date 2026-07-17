const fs = require('fs');
let code = fs.readFileSync('src/views/SuperAdminView.tsx', 'utf8');

code = code.replace(
  "{ id: 'advertisements', label: 'Ads Manager', icon: Megaphone, emoji: '📣' },",
  "{ id: 'advertisements', label: 'Ads Manager', icon: Megaphone, emoji: '📣' },\n    { id: 'subscriptions', label: 'Subscription Approvals', icon: ShieldCheck, emoji: '💳' },"
);

code = code.replace(
  "staff\n  } = useApp();",
  "staff,\n    subscriptionRequests,\n    approveSubscriptionRequest,\n    rejectSubscriptionRequest,\n    superAdminPaymentInfo,\n    setSuperAdminPaymentInfo\n  } = useApp();"
);

const subscriptionTabContent = `
        {/* SUBSCRIPTION APPROVALS TAB */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-2 mb-4">Payment Information Config</h3>
              <p className="text-xs text-slate-500 mb-2">Configure the payment details (like CBE account number) that Business Owners will see when they request an upgrade via Bank Transfer.</p>
              <textarea 
                value={superAdminPaymentInfo}
                onChange={(e) => setSuperAdminPaymentInfo(e.target.value)}
                rows={3}
                className="w-full text-sm font-mono border border-slate-200 rounded p-3"
              />
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-lg">Pending Upgrade Requests</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {subscriptionRequests.filter(req => req.status === 'pending').length === 0 && (
                  <p className="p-5 text-sm text-slate-500 italic">No pending requests.</p>
                )}
                {subscriptionRequests.filter(req => req.status === 'pending').map(req => {
                  const tenant = tenants.find(t => t.id === req.tenantId);
                  const plan = pricingPlans.find(p => p.id === req.planId);
                  return (
                    <div key={req.id} className="p-5 flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-slate-900">{tenant?.name} <span className="text-xs text-slate-500">is requesting {plan?.name}</span></h4>
                        <p className="text-xs text-slate-600 mt-1">Duration: {req.duration} Month(s)</p>
                        <p className="text-xs text-slate-600">Method: {req.paymentMethod}</p>
                        {req.transactionId && <p className="text-xs font-mono text-indigo-700 mt-1">TX ID: {req.transactionId}</p>}
                        {req.proofImageUrl && (
                          <div className="mt-2">
                            <a href={req.proofImageUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 underline">View Proof Image</a>
                          </div>
                        )}
                        <p className="text-[10px] text-slate-400 mt-2">Requested: {new Date(req.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="flex flex-col gap-2 min-w-[120px]">
                        <button 
                          onClick={() => approveSubscriptionRequest(req.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded text-xs"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => rejectSubscriptionRequest(req.id)}
                          className="border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold py-2 rounded text-xs"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-lg">Processed Requests History</h3>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {subscriptionRequests.filter(req => req.status !== 'pending').length === 0 && (
                  <p className="p-5 text-sm text-slate-500 italic">No history.</p>
                )}
                {subscriptionRequests.filter(req => req.status !== 'pending').map(req => {
                  const tenant = tenants.find(t => t.id === req.tenantId);
                  const plan = pricingPlans.find(p => p.id === req.planId);
                  return (
                    <div key={req.id} className="p-3 text-xs flex justify-between">
                      <div>
                        <span className="font-bold">{tenant?.name}</span> -> {plan?.name} ({req.duration}M)
                      </div>
                      <div>
                        <span className={\`font-bold \${req.status === 'approved' ? 'text-emerald-600' : 'text-rose-600'}\`}>{req.status.toUpperCase()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
`;

code = code.replace("{/* MODALS */}", subscriptionTabContent + "\n        {/* MODALS */}");
fs.writeFileSync('src/views/SuperAdminView.tsx', code);
