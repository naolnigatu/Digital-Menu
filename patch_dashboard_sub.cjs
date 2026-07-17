const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerProfileDashboard.tsx', 'utf8');

const replacement = `
                      <div className="text-[10px] text-gray-400 space-y-1 font-mono">
                        <div className="flex justify-between">
                          <span>Start Date: {new Date(sub.startDate).toLocaleDateString()}</span>
                          <span>End Date: {new Date(sub.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {sub.status === 'active' && sub.mealsUsedToday < sub.mealsPerDay && sub.mealsRemainingTotal > 0 && (
                        <button
                          onClick={() => {
                            if (window.confirm('Request a meal from this subscription to the kitchen?')) {
                              logMealService(sub.id);
                              
                              const tenantItems = menuItems[sub.tenantId] || [];
                              const selectedItems = tenantItems.filter(i => sub.menuItemIds?.includes(i.id));
                              
                              const itemsToOrder = selectedItems.length > 0 ? selectedItems : [tenantItems[0]].filter(Boolean);
                              
                              placeOrder({
                                customerName: profile.name || customerEmail,
                                customerEmail: customerEmail,
                                tenantId: sub.tenantId,
                                orderType: 'dine_in',
                                paymentMethod: 'cash', // Prepaid
                                paymentVerificationStatus: 'approved',
                                discount: 0,
                                items: itemsToOrder.map(i => ({
                                  menuItemId: i.id,
                                  name: i.name,
                                  price: 0, // Prepaid
                                  quantity: 1,
                                  status: 'received',
                                  assignedStationId: i.preparationStationId
                                }))
                              });
                              alert('Meal requested! Sent to Kitchen.');
                            }
                          }}
                          className="w-full mt-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          Request Meal Now
                        </button>
                      )}
                    </div>
                  );
`;

code = code.replace(
  /                      <div className="text-\[10px\] text-gray-400 space-y-1 font-mono">.*?<\/div>\s*<\/div>\s*\);\s*\}\)/s,
  replacement + '                })'
);

fs.writeFileSync('src/components/CustomerProfileDashboard.tsx', code);
