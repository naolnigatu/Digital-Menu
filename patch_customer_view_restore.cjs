const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

// 1. Restore states
const stateVars = `
  const [activeItemDetails, setActiveItemDetails] = useState<MenuItem | null>(null);
  const [selectedMods, setSelectedMods] = useState<{ groupName: string; optionName: string; price: number }[]>([]);
  const [itemNote, setItemNote] = useState('');
  const [itemQty, setItemQty] = useState(1);
  const [selectedPortion, setSelectedPortion] = useState<any>(null);
`;

code = code.replace(
  /  const \[isCartOpen, setIsCartOpen\] = useState\(false\);\n/,
  "  const [isCartOpen, setIsCartOpen] = useState(false);\n" + stateVars
);

// 2. Restore handleOpenItemDetails and friends
const handleLogic = `
  const handleOpenItemDetails = (item: MenuItem) => {
    setActiveItemDetails(item);
    setItemNote('');
    if (item.portions && item.portions.length > 0) {
      setSelectedPortion(item.portions[0]);
    } else {
      setSelectedPortion(null);
    }
    setItemQty(1);
    const defaults = item.modifiers
      ? item.modifiers
          .filter(g => !(g.name || '').toLowerCase().includes('injera'))
          .map(g => ({
            groupName: g.name,
            optionName: g.options[0].name,
            price: g.options[0].price
          }))
      : [];
    setSelectedMods(defaults);
  };

  const handleModifierToggle = (groupName: string, optionName: string, price: number) => {
    setSelectedMods(prev => {
      const alreadySelected = prev.some(m => m.groupName === groupName && m.optionName === optionName);
      const filtered = prev.filter(m => m.groupName !== groupName);
      if (alreadySelected) {
        return filtered;
      }
      return [...filtered, { groupName, optionName, price }];
    });
  };

  const currentItemPrice = useMemo(() => {
    if (!activeItemDetails) return 0;
    let total = activeItemDetails.price;
    selectedMods.forEach(m => { total += m.price; });
    return total * itemQty;
  }, [activeItemDetails, selectedMods, itemQty]);

  const handleAddToCart = () => {
    if (!activeItemDetails) return;
    setCart(prev => {
      const existingIdx = prev.findIndex(
        i => i.item.id === activeItemDetails.id && 
        JSON.stringify(i.selectedMods) === JSON.stringify(selectedMods)
      );

      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].qty += itemQty;
        return copy;
      }
      return [...prev, { item: activeItemDetails, selectedMods, qty: itemQty }];
    });
    setActiveItemDetails(null);
    showToast('Added to cart!');
  };

  const handleOrderNow = () => {
    handleAddToCart();
    setIsCartOpen(true);
  };
`;

code = code.replace(
  /  const handleOpenItemDetails = \(item: MenuItem\) => \{[\s\S]*?showToast\('Added to cart!'\);\n  \};\n/m,
  handleLogic
);

// 3. Restore popup modal
const popupModal = `
          {/* MODIFIER OPTIONS POPUP */}
          {activeItemDetails && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-t-2xl sm:rounded-2xl bg-white p-5 shadow-2xl border border-slate-100 max-h-[80vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom-5 duration-200">
                
                <div className="flex justify-between items-start border-b border-slate-50 pb-3">
                  <div>
                    <h4 className="font-sans font-extrabold text-sm text-slate-900">{getTranslatedText(activeItemDetails).name}</h4>
                    <span className="font-mono text-xs font-extrabold text-slate-500 mt-1 block">Base Price: {activeTenant.currencySymbol} {activeItemDetails.price}</span>
                  </div>
                  <button 
                    onClick={() => setActiveItemDetails(null)}
                    className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                  >
                    Close
                  </button>
                </div>

                {/* Modifiers selector list */}
                <div className="space-y-4">
                  {(activeItemDetails.modifiers || []).filter(g => !(g.name || '').toLowerCase().includes('injera')).map(group => (
                    <div key={group.id} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>{group.name}</span>
                        <span className="text-amber-700">Required</span>
                      </div>
                      
                      <div className="grid gap-2">
                        {group.options.map(opt => {
                          const isSelected = selectedMods.some(m => m.groupName === group.name && m.optionName === opt.name);
                          return (
                            <button
                              key={opt.name}
                              onClick={() => handleModifierToggle(group.name, opt.name, opt.price)}
                              className={\`px-3 py-2 text-left rounded-xl text-xs font-semibold border flex justify-between items-center transition-all \${
                                isSelected 
                                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-2xs' 
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                              }\`}
                            >
                              <span>{opt.name}</span>
                              <span className="font-mono text-[10px]">+{activeTenant.currencySymbol} {opt.price}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-slate-700">Quantity</span>
                    <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-100">
                      <button 
                        onClick={() => setItemQty(Math.max(1, itemQty - 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm text-slate-600 hover:text-indigo-600 font-bold"
                      >-</button>
                      <span className="font-mono font-bold text-sm min-w-[20px] text-center">{itemQty}</span>
                      <button 
                        onClick={() => setItemQty(itemQty + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm text-slate-600 hover:text-indigo-600 font-bold"
                      >+</button>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleAddToCart}
                      className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Add to Cart
                    </button>
                    <button
                      onClick={handleOrderNow}
                      className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center"
                    >
                      Order Now - {activeTenant.currencySymbol} {currentItemPrice.toLocaleString()}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEARCH STATUS ORDER LISTING SCREEN */}
`;

code = code.replace(
  /          \{\/\* SEARCH STATUS ORDER LISTING SCREEN \*\/\}/m,
  popupModal
);

// 4. Restore grid cols 3/4/5/6 layout
const itemCardLayout = `
                  <div 
                    key={item.id} 
                    onClick={isAvailable ? () => handleOpenItemDetails(item) : undefined}
                    className={\`rounded-xl border p-2 shadow-sm flex flex-col gap-2 transition-all duration-200 relative \${
                      isAvailable
                        ? 'border-slate-200 bg-white cursor-pointer hover:border-indigo-500 hover:shadow-md'
                        : 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                    }\`}
                  >
                    {item.photoUrl && (
                      <div className="w-full aspect-[4/3] rounded-lg overflow-hidden shrink-0 border border-slate-50"><img src={item.photoUrl} alt={item.name} className={\`h-full w-full object-cover \${!isAvailable && 'grayscale'}\`} referrerPolicy="no-referrer" /></div>
                    )}
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-1">
                          <h4 className={\`text-[11px] leading-tight font-extrabold \${isAvailable ? 'text-slate-900' : 'text-slate-500 line-through'} line-clamp-2\`}>
                            <span>{info.name}</span>
                          </h4>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isFav) {
                                removeFavoriteItem(profile.id, item.id);
                              } else {
                                addFavoriteItem(profile.id, item.id);
                              }
                            }}
                            className={\`p-1.5 rounded-full shrink-0 transition-colors \${isFav ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-300 hover:text-rose-400'}\`}
                          >
                            <Heart className="h-3 w-3" fill={isFav ? "currentColor" : "none"} />
                          </button>
                        </div>
                        <p className="text-[9px] text-slate-500 line-clamp-2 leading-relaxed">{info.description}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.dietaryTags.map(tag => (
                            <span key={tag} className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[8px] font-bold text-emerald-700">{tag}</span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-50">
                        <span className="font-extrabold text-slate-900 text-[11px] font-mono">{activeTenant.currencySymbol} {item.price}</span>
                        {isAvailable ? (
                          <span className="text-[9px] font-bold text-indigo-600 flex items-center gap-0.5 shrink-0">{(item.modifiers && item.modifiers.length > 0) ? "Customize" : "Select"} <ArrowRight className="h-2.5 w-2.5" /></span>
                        ) : (
                          <span className="text-[9px] font-extrabold text-slate-400 shrink-0">Unavailable</span>
                        )}
                      </div>
                    </div>
                  </div>
`;

code = code.replace(
  /                  <div \n                    key=\{item\.id\} \n                    onClick=\{isAvailable \? \(\) => handleOpenItemDetails\(item\) : undefined\}[\s\S]*?                  <\/div>\n                \);\n              \}\)\}/m,
  itemCardLayout + "\n                );\n              })}"
);

code = code.replace(
  /          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">/m,
  '          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">'
);

// 5. Restore Available Subscription Plans from Cart back to the main view Order Type selector
const planUI = `
                {orderType === 'meal_subscription' && (
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Available Subscription Plans</label>
                    {tenantSubscriptionPlans.length === 0 ? (
                      <p className="text-[10px] text-amber-500 italic">No recurring meal plans defined by merchant.</p>
                    ) : (
                      <select
                        value={selectedSubPlanId}
                        onChange={(e) => setSelectedSubPlanId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-2.5 py-1.5 text-xs font-semibold mt-1 focus:outline-none"
                      >
                        {tenantSubscriptionPlans.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({activeTenant.currencySymbol}{p.monthlyPrice}/mo, {p.mealsPerWeek} meals/wk)
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
`;

code = code.replace(
  /                \{orderType === 'meal_subscription' && \([\s\S]*?<\/select>\n                    \)\}\n                  <\/div>\n                \)\}\n                \{\/\* Dynamic Payment Channel Selection \(Part 1\) \*\/\}/m,
  "                {/* Dynamic Payment Channel Selection (Part 1) */}"
);

code = code.replace(
  /                <label className="text-\[10px\] font-bold text-slate-400 uppercase">Dining Service Type<\/label>[\s\S]*?                <\/select>\n              <\/div>/m,
  `                <label className="text-[10px] font-bold text-slate-400 uppercase">Dining Service Type</label>
                <select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold focus:border-indigo-500 focus:outline-none"
                >
                  {activeTenant.enabledOrderTypes.includes('dine_in') && <option value="dine_in">Dine-In (Table Service)</option>}
                  {activeTenant.enabledOrderTypes.includes('takeaway') && <option value="takeaway">Takeaway (Walk-in)</option>}
                  {activeTenant.enabledOrderTypes.includes('pickup') && <option value="pickup">Pre-Order Pickup</option>}
                  {activeTenant.enabledOrderTypes.includes('delivery') && <option value="delivery">Home Delivery</option>}
                  {activeTenant.enabledOrderTypes.includes('drive_through') && <option value="drive_through">Drive-Through</option>}
                  {activeTenant.enabledOrderTypes.includes('meal_subscription') && <option value="meal_subscription">Meal Subscription (Prepaid Plan)</option>}
                </select>
              </div>
` + planUI
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
