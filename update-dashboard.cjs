const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerProfileDashboard.tsx', 'utf-8');

// Replace sub.planId with sub.packageId
code = code.replace(/sub\.planId/g, 'sub.packageId');

// Find the Active Meal Subscriptions section and replace it
const startToken = `            {subscriptions.length === 0 ? (`;
const endToken = `        {activeTab === 'favorites' && (`;

const before = code.substring(0, code.indexOf(startToken));
const after = code.substring(code.indexOf(endToken));

const newSection = `            {subscriptions.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-8 text-center bg-gray-50 rounded-2xl">
                You do not have any active meal subscription memberships. Subscribe in the dining catalog to activate.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subscriptions.map(sub => {
                  const plan = mealSubscriptionPlans[sub.tenantId]?.find(p => p.id === sub.packageId);
                  const tenantItems = menuItems[sub.tenantId] || [];
                  const activeCredits = sub.credits || [];
                  
                  return (
                    <div key={sub.id} className="p-4 bg-white border border-indigo-100 rounded-2xl shadow-xs space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-bold text-gray-900 text-sm">{plan?.name || 'Meal Plan'}</h5>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider mt-1">
                            {sub.status}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-lg">
                          Remaining: {sub.totalCreditsRemaining} credits
                        </span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                        <h6 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Available Credits</h6>
                        <div className="space-y-2">
                          {activeCredits.map(c => {
                            const mi = tenantItems.find(i => i.id === c.menuItemId);
                            if (!mi) return null;
                            return (
                              <div key={c.menuItemId} className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-gray-700">{mi.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-gray-500">{c.remaining} rem</span>
                                  {sub.status === 'active' && c.remaining > 0 && (
                                    <button 
                                      onClick={() => {
                                        if (window.confirm(\`Request \${mi.name} from your subscription?\`)) {
                                          placeOrder({
                                            customerName: profile.name || customerEmail,
                                            customerEmail: customerEmail,
                                            tenantId: sub.tenantId,
                                            type: 'subscription_redemption',
                                            paymentMethod: 'cash', // Prepaid
                                            advancePaymentRef: sub.id,
                                            paymentVerificationStatus: 'approved',
                                            discount: 0,
                                            items: [{
                                              menuItemId: mi.id,
                                              name: mi.name,
                                              price: 0, 
                                              quantity: 1,
                                              status: 'received',
                                              assignedStationId: mi.preparationStationId
                                            }]
                                          });
                                          alert('Meal requested! Sent to Kitchen.');
                                        }
                                      }}
                                      className="bg-indigo-600 text-white px-2 py-1 rounded text-[10px] font-bold hover:bg-indigo-700 transition-colors"
                                    >
                                      Request
                                    </button>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div className="text-[10px] text-gray-400 space-y-1 font-mono">
                        <div className="flex justify-between">
                          <span>Start Date: {new Date(sub.startDate).toLocaleDateString()}</span>
                          <span>End Date: {new Date(sub.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

`;

fs.writeFileSync('src/components/CustomerProfileDashboard.tsx', before + newSection + after);
