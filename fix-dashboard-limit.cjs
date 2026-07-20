const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerProfileDashboard.tsx', 'utf-8');

const match = `{sub.status === 'active' && c.remaining > 0 && (`;
const replace = `
                                  {(() => {
                                    const subConfig = tenants.find(t => t.id === sub.tenantId)?.mealSubscriptionConfig;
                                    const isFlexible = subConfig?.flexibleRedemption ?? true;
                                    const dailyLimit = subConfig?.dailyRedemptionLimit || 0;
                                    const isToday = sub.lastRedemptionDate && new Date(sub.lastRedemptionDate).toDateString() === new Date().toDateString();
                                    const currentToday = isToday ? (sub.redemptionsToday || 0) : 0;
                                    const limitReached = !isFlexible && dailyLimit > 0 && currentToday >= dailyLimit;
                                    
                                    return sub.status === 'active' && c.remaining > 0 && !limitReached && (
`;

code = code.replace(match, replace);

// Add the closing tag for the IIFE correctly
const buttonCloseMatch = `</button>
                                  )}`;
const newButtonCloseMatch = `</button>
                                    );
                                  })()}`;

code = code.replace(buttonCloseMatch, newButtonCloseMatch);

// We also need to update the subscription when they "Request" from the dashboard
const reqMatch = `alert('Meal requested! Sent to Kitchen.');
                                        }`;
const newReqMatch = `
                                          const newTodayCount = currentToday + 1;
                                          const newCredits = JSON.parse(JSON.stringify(sub.credits));
                                          const targetCred = newCredits.find((x: any) => x.menuItemId === mi.id);
                                          if (targetCred) {
                                            targetCred.remaining -= 1;
                                            targetCred.used += 1;
                                          }
                                          updateCustomerMealSubscription(sub.id, {
                                            credits: newCredits,
                                            totalCreditsRemaining: sub.totalCreditsRemaining - 1,
                                            redemptionsToday: newTodayCount,
                                            lastRedemptionDate: new Date().toISOString()
                                          });
                                          alert('Meal requested! Sent to Kitchen.');
                                        }`;

code = code.replace(reqMatch, newReqMatch);
fs.writeFileSync('src/components/CustomerProfileDashboard.tsx', code);
