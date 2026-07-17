const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

code = code.replace(
  "const [activeItemDetails, setActiveItemDetails] = useState<MenuItem | null>(null);",
  "const [activeItemDetails, setActiveItemDetails] = useState<MenuItem | null>(null);\n  const [selectedPortion, setSelectedPortion] = useState<{name: string, price: number} | null>(null);"
);

code = code.replace(
  "setItemNote('');",
  "setItemNote('');\n    if (item.portions && item.portions.length > 0) {\n      setSelectedPortion(item.portions[0]);\n    } else {\n      setSelectedPortion(null);\n    }"
);

// Add Portion UI to modal
const portionUI = `
                  {/* Portions */}
                  {activeItemDetails.portions && activeItemDetails.portions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider">Select Portion</h4>
                      <div className="flex flex-wrap gap-2">
                        {activeItemDetails.portions.map(p => (
                          <button
                            key={p.name}
                            onClick={() => setSelectedPortion(p)}
                            className={\`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all \${
                              selectedPortion?.name === p.name 
                                ? 'bg-indigo-600 border-indigo-600 text-white' 
                                : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'
                            }\`}
                          >
                            {p.name} (+{tenant.currencySymbol}{p.price})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
`;

code = code.replace(
  "{/* Kitchen Note */}",
  portionUI + "\n                  {/* Kitchen Note */}"
);

// handleAddToCart calculate price
code = code.replace(
  "const basePrice = activeItemDetails.price;",
  "const basePrice = selectedPortion ? selectedPortion.price : activeItemDetails.price;"
);

// cart update
code = code.replace(
  "selectedModifiers: selectedMods,",
  "selectedModifiers: selectedMods,\n        portionName: selectedPortion?.name,"
);

// UI rendering selected portion
const cartItemReplace = `                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-extrabold text-slate-900">{item.name}</p>
                          {item.portionName && <p className="text-[10px] font-bold text-slate-500">Portion: {item.portionName}</p>}`;

code = code.replace(
  /\<div className="flex justify-between items-start"\>\s*\<div\>\s*\<p className="text-xs font-extrabold text-slate-900"\>\{item\.name\}\<\/p\>/g,
  cartItemReplace
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
