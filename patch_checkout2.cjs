const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

// Modify the render condition for the Cart popup
code = code.replace(
  /\{isCartOpen && \(/,
  "{(isCartOpen || isDirectCheckoutOpen) && ("
);

// When clicking Close, close both
code = code.replace(
  /onClick=\{\(\) => setIsCartOpen\(false\)\}/g,
  "onClick={() => { setIsCartOpen(false); setIsDirectCheckoutOpen(false); setDirectCheckoutItem(null); }}"
);

// Also replace the cart loop that renders items to conditionally use directCheckoutItem if it exists
const renderItemsStr = `
                    <div className="space-y-3">
                      {(isDirectCheckoutOpen && directCheckoutItem ? [directCheckoutItem] : cart).map((cartItem, idx) => {
                        const info = getTranslatedText(cartItem.item);
                        return (
                          <div key={idx} className="flex gap-3 bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs relative">
                            {cartItem.item.photoUrl && (
                              <img src={cartItem.item.photoUrl} alt={info.name} className="w-14 h-14 object-cover rounded-lg" referrerPolicy="no-referrer" />
                            )}
                            <div className="flex-1">
                              <h4 className="text-xs font-bold text-slate-800">{info.name}</h4>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{activeTenant.currencySymbol} {cartItem.item.price}</p>
                              {cartItem.selectedMods.length > 0 && (
                                <ul className="mt-1 space-y-0.5">
                                  {cartItem.selectedMods.map((m: any, midx: number) => (
                                    <li key={midx} className="text-[9px] text-slate-400 flex justify-between">
                                      <span>+ {m.optionName}</span>
                                      <span className="font-mono">{activeTenant.currencySymbol} {m.price}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                            <div className="flex flex-col items-end justify-between">
                              <span className="text-xs font-extrabold text-slate-900 font-mono">
                                {activeTenant.currencySymbol} {((cartItem.item.price + cartItem.selectedMods.reduce((acc: number, m: any) => acc + m.price, 0)) * cartItem.qty).toFixed(2)}
                              </span>
                              {!isDirectCheckoutOpen && (
                                <div className="flex items-center gap-2 bg-slate-50 rounded-md p-0.5 border border-slate-100 mt-2">
                                  <button onClick={() => updateCartQty(idx, -1)} className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-rose-500 font-bold bg-white rounded shadow-sm">-</button>
                                  <span className="text-[10px] font-bold min-w-[12px] text-center">{cartItem.qty}</span>
                                  <button onClick={() => updateCartQty(idx, 1)} className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-indigo-500 font-bold bg-white rounded shadow-sm">+</button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
`;

code = code.replace(
  /<div className="space-y-3">[\s\S]*?<\/div>\n                    \n                    \{orderType === 'dine_in' && \(/m,
  renderItemsStr + "\n                    \n                    {orderType === 'dine_in' && ("
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
