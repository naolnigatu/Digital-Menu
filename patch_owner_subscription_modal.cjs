const fs = require('fs');
let code = fs.readFileSync('src/views/BusinessOwnerView.tsx', 'utf8');

const subscriptionModal = `
      {/* SUBSCRIPTION CHECKOUT MODAL */}
      {showSubscriptionModal && selectedUpgradePlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
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
                    <input type="text" value={subTxId} onChange={(e) => setSubTxId(e.target.value)} className="w-full mt-1 rounded border border-slate-200 p-1.5 text-xs font-mono" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Upload Proof (Image URL/Base64)</label>
                    <input type="text" value={subProof} onChange={(e) => setSubProof(e.target.value)} className="w-full mt-1 rounded border border-slate-200 p-1.5 text-xs font-mono" />
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

code = code.replace(
  "{/* ADD/EDIT CATEGORY MODAL */}",
  subscriptionModal + "\n          {/* ADD/EDIT CATEGORY MODAL */}"
);

fs.writeFileSync('src/views/BusinessOwnerView.tsx', code);
