const fs = require('fs');
let code = fs.readFileSync('src/views/BusinessOwnerView.tsx', 'utf8');

code = code.replace(
  "const { updateTenantPlan, requestTenantUpgrade } = useApp();",
  "const { updateTenantPlan, requestSubscriptionUpgrade, superAdminPaymentInfo } = useApp();\n  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<string | null>(null);\n  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);\n  const [subDuration, setSubDuration] = useState<number>(1);\n  const [subMethod, setSubMethod] = useState('bank_transfer');\n  const [subTxId, setSubTxId] = useState('');\n  const [subProof, setSubProof] = useState('');"
);

const subscriptionModal = `
      {/* SUBSCRIPTION CHECKOUT MODAL */}
      {showSubscriptionModal && selectedUpgradePlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl border border-slate-100">
            <h3 className="font-sans font-bold text-lg text-slate-900 mb-2">Subscribe to {pricingPlans.find(p => p.id === selectedUpgradePlan)?.name}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Duration</label>
                <select value={subDuration} onChange={(e) => setSubDuration(parseInt(e.target.value))} className="w-full mt-1 rounded-lg border border-slate-200 p-2 text-sm font-semibold">
                  <option value={1}>1 Month</option>
                  <option value={3}>3 Months</option>
                  <option value={6}>6 Months</option>
                  <option value={12}>1 Year</option>
                  <option value={24}>2 Years</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Payment Method</label>
                <select value={subMethod} onChange={(e) => setSubMethod(e.target.value)} className="w-full mt-1 rounded-lg border border-slate-200 p-2 text-sm font-semibold">
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              {subMethod === 'bank_transfer' && (
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Payment Information</label>
                    <p className="text-xs font-mono text-slate-800 whitespace-pre-wrap">{superAdminPaymentInfo}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Transaction ID</label>
                    <input type="text" value={subTxId} onChange={(e) => setSubTxId(e.target.value)} className="w-full mt-1 rounded border border-slate-200 p-1.5 text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Upload Proof (Image URL/Base64)</label>
                    <input type="text" value={subProof} onChange={(e) => setSubProof(e.target.value)} className="w-full mt-1 rounded border border-slate-200 p-1.5 text-xs" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  requestSubscriptionUpgrade(activeTenantId, selectedUpgradePlan, subDuration, subMethod, subTxId, subProof);
                  setShowSubscriptionModal(false);
                  showToast('Subscription requested! Awaiting admin approval.', 'success');
                }}
                className="flex-1 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
`;

code = code.replace("{/* MODALS */}", subscriptionModal + "\n      {/* MODALS */}");

const oldSaaSPlan = `              {pricingPlans.map(plan => {
                const isCurrent = tenant.subscriptionPlan === plan.id;
                const isPending = tenant.subscriptionStatus === 'pending_approval' && isCurrent;
                const displayPrice = tenant.currency === 'ETB' ? \`\${plan.priceETB} ETB\` : \`\$\${plan.priceUSD}\`;
                
                return (
                  <button
                    key={plan.id}
                    type="button"
                    disabled={isCurrent}
                    onClick={() => {
                      if (plan.id === 'free') {
                        updateTenantPlan(activeTenantId, 'free');
                      } else {
                        requestTenantUpgrade(activeTenantId, plan.id);
                        showToast(\`Upgrade request submitted! Awaiting admin approval.\`);
                      }
                    }}
                    className={\`relative rounded-xl border p-3.5 text-left transition-all \${
                      isCurrent
                        ? isPending
                          ? 'border-amber-400 bg-amber-50/20 ring-1 ring-amber-400'
                          : 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                        : 'border-slate-100 hover:bg-slate-50 cursor-pointer'
                    }\`}
                  >
                    <div className="flex justify-between items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs font-bold text-slate-900">{plan.name}</h4>
                      {isPending && (
                        <span className="bg-amber-100 text-amber-800 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded border border-amber-200 animate-pulse">
                          Pending
                        </span>
                      )}
                      {isCurrent && !isPending && (
                        <span className="bg-slate-900 text-white text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">{plan.features.join(', ')}</p>
                    <p className="text-xs font-bold text-slate-800 mt-3">{displayPrice} / mo</p>
                  </button>
                );
              })}`;

const newSaaSPlan = `              {pricingPlans.map(plan => {
                const isCurrent = tenant.subscriptionPlan === plan.id;
                const isPending = tenant.subscriptionStatus === 'pending_approval' && isCurrent;
                const displayPrice = tenant.currency === 'ETB' ? \`\${plan.priceETB} ETB\` : \`\$\${plan.priceUSD}\`;
                const isSelected = selectedUpgradePlan === plan.id;
                
                return (
                  <div
                    key={plan.id}
                    onClick={() => {
                      if (!isCurrent) {
                        if (plan.id === 'free') {
                          updateTenantPlan(activeTenantId, 'free');
                        } else {
                          setSelectedUpgradePlan(plan.id);
                        }
                      }
                    }}
                    className={\`relative rounded-xl border p-3.5 text-left transition-all \${
                      isCurrent
                        ? isPending
                          ? 'border-amber-400 bg-amber-50/20 ring-1 ring-amber-400'
                          : 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                        : isSelected
                          ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500 cursor-pointer'
                          : 'border-slate-100 hover:bg-slate-50 cursor-pointer'
                    }\`}
                  >
                    <div className="flex justify-between items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs font-bold text-slate-900">{plan.name}</h4>
                      {isPending && (
                        <span className="bg-amber-100 text-amber-800 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded border border-amber-200 animate-pulse">
                          Pending
                        </span>
                      )}
                      {isCurrent && !isPending && (
                        <span className="bg-slate-900 text-white text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">{plan.features.join(', ')}</p>
                    <p className="text-xs font-bold text-slate-800 mt-3">{displayPrice} / mo</p>
                    
                    {isSelected && !isCurrent && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowSubscriptionModal(true);
                        }}
                        className="w-full mt-3 rounded-lg bg-indigo-600 py-1.5 text-white text-[10px] font-bold hover:bg-indigo-700"
                      >
                        Subscribe
                      </button>
                    )}
                  </div>
                );
              })}`;

code = code.replace(oldSaaSPlan, newSaaSPlan);

fs.writeFileSync('src/views/BusinessOwnerView.tsx', code);
