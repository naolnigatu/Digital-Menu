const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

const itemCardAdditions = `
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-50">
                      <span className="font-extrabold text-slate-900 text-[11px] font-mono">{activeTenant.currencySymbol} {item.price}</span>
                      {isAvailable ? (
                        orderType === 'meal_subscription' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const inCart = cart.find(c => c.item.id === item.id);
                              if (inCart) {
                                setCart(prev => prev.filter(c => c.item.id !== item.id));
                              } else {
                                setCart(prev => [...prev, { item, selectedMods: [], qty: 1 }]);
                                showToast('Added to subscription plan');
                              }
                            }}
                            className={\`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border \${cart.some(c => c.item.id === item.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-300'}\`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-[9px] font-bold text-indigo-600 flex items-center gap-0.5 shrink-0">{(item.modifiers && item.modifiers.length > 0) ? "Customize" : "Select"} <ArrowRight className="h-2.5 w-2.5" /></span>
                        )
                      ) : (
                        <span className="text-[9px] font-extrabold text-slate-400 shrink-0">Unavailable</span>
                      )}
                    </div>
`;

code = code.replace(
  /                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-50">[\s\S]*?<\/div>\n                  <\/div>/,
  itemCardAdditions + "                  </div>"
);

// Add a "Continue" floating bar for Meal Subscription
const floatingBar = `
      {/* MEAL SUBSCRIPTION CONTINUE BAR */}
      {orderType === 'meal_subscription' && cart.length > 0 && !isCartOpen && !isDirectCheckoutOpen && (
        <div className="fixed bottom-24 sm:bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-indigo-600 text-white p-3 rounded-2xl shadow-2xl flex items-center justify-between z-40 animate-in slide-in-from-bottom-10">
          <div>
            <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider">Subscription Bundle</p>
            <p className="font-extrabold text-sm">{cart.length} Meals Selected</p>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-colors shadow-sm"
          >
            Continue
          </button>
        </div>
      )}
`;

code = code.replace(
  /      \{\/\* CUSTOMER VIEW CONTENT \*\/\}/,
  "      {/* CUSTOMER VIEW CONTENT */}\n" + floatingBar
);

// Also remove `handleOpenItemDetails` click if it's meal_subscription
code = code.replace(
  /onClick=\{isAvailable \? \(\) => handleOpenItemDetails\(item\) : undefined\}/,
  "onClick={isAvailable ? (orderType === 'meal_subscription' ? undefined : () => handleOpenItemDetails(item)) : undefined}"
);


fs.writeFileSync('src/views/CustomerView.tsx', code);
