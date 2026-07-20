const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf-8');

const oldSubRender = `                        {orderType === 'meal_subscription' && (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase">Subscription Duration</span>
                            </div>
                            <div className="flex gap-2">
                              {availableDurations.map(val => ({ val, label: \`\${val} Days\` })).map(d => (
                                <button
                                  key={d.val}
                                  type="button"
                                  onClick={() => setSubscriptionDurationDays(d.val)}
                                  className={\`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors \${
                                    subscriptionDurationDays === d.val
                                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                  }\`}
                                >
                                  {d.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}`;

const newSubRender = `                        {orderType === 'meal_subscription' && (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase">Select Subscription Package</span>
                            </div>
                            <div className="grid gap-2">
                              {tenantSubscriptionPlans.filter(p => p.isActive).map(pkg => (
                                <button
                                  key={pkg.id}
                                  type="button"
                                  onClick={() => setSelectedSubPlanId(pkg.id)}
                                  className={\`flex flex-col text-left p-3 rounded-xl border transition-colors \${
                                    selectedSubPlanId === pkg.id
                                      ? 'bg-indigo-50 border-indigo-200 text-indigo-800'
                                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                  }\`}
                                >
                                  <span className="font-bold text-sm">{pkg.name}</span>
                                  <span className="text-xs opacity-75">{pkg.type === 'fixed' ? 'Fixed Bundle' : 'Build Your Own'} • {pkg.durationDays} Days</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}`;

code = code.replace(oldSubRender, newSubRender);
fs.writeFileSync('src/views/CustomerView.tsx', code);
