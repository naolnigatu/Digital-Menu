const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

// 1. Replace state
code = code.replace(
  /const \[subscriptionPeriod, setSubscriptionPeriod\] = useState\('weekly'\);/,
  "const [subscriptionDurationDays, setSubscriptionDurationDays] = useState<number>(30);"
);

// 2. Replace notes
code = code.replace(
  /Subscription Term: \$\{subscriptionPeriod\}/,
  "Subscription Term: ${subscriptionDurationDays} Days"
);

// 3. Replace hardcoded 30 in getSubtotalWithSubscription
code = code.replace(
  /sub = sub \* 30; \/\/ 30 meals/,
  "sub = sub * subscriptionDurationDays; // dynamic duration meals"
);

// 4. Update the cart discount display
code = code.replace(
  /calculateCartTotal\(\)\) \* 30 \*/,
  "calculateCartTotal()) * subscriptionDurationDays *"
);

// 5. Update placeOrder logic (subscribeToMealPlan)
code = code.replace(
  /endDate: new Date\(Date\.now\(\) \+ 30 \* 24 \* 60 \* 60 \* 1000\)\.toISOString\(\),/,
  "endDate: new Date(Date.now() + subscriptionDurationDays * 24 * 60 * 60 * 1000).toISOString(),"
);
code = code.replace(
  /mealsRemainingTotal: 30,/,
  "mealsRemainingTotal: subscriptionDurationDays,"
);
code = code.replace(
  /nextRenewalDate: new Date\(Date\.now\(\) \+ 30 \* 24 \* 60 \* 60 \* 1000\)\.toISOString\(\)/,
  "nextRenewalDate: new Date(Date.now() + subscriptionDurationDays * 24 * 60 * 60 * 1000).toISOString()"
);

// 6. Add UI for subscription duration selection
const durationUI = `
                        {orderType === 'meal_subscription' && (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase">Subscription Duration</span>
                            </div>
                            <div className="flex gap-2">
                              {[
                                { val: 7, label: '7 Days' },
                                { val: 14, label: '14 Days' },
                                { val: 30, label: '30 Days' }
                              ].map(d => (
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
                        )}
`;

code = code.replace(
  /                        \{\['pickup', 'takeaway'\].includes\(orderType\) && \(\n                          <input\n                            type="text"\n                            \n                            value=\{pickupTime\}\n                            onChange=\{\(e\) => setPickupTime\(e\.target\.value\)\}\n                            className="w-full rounded-lg border border-slate-200 px-3 py-1\.5 text-gray-900"\n                          \/>\n                        \)\}/,
  "                        {['pickup', 'takeaway'].includes(orderType) && (\n                          <input\n                            type=\"text\"\n                            \n                            value={pickupTime}\n                            onChange={(e) => setPickupTime(e.target.value)}\n                            className=\"w-full rounded-lg border border-slate-200 px-3 py-1.5 text-gray-900\"\n                          />\n                        )}\n" + durationUI
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
