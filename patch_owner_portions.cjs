const fs = require('fs');
let code = fs.readFileSync('src/views/BusinessOwnerView.tsx', 'utf8');

// State
code = code.replace(
  "const [itemModifiers, setItemModifiers] = useState<ModifierGroup[]>([]);",
  "const [itemModifiers, setItemModifiers] = useState<ModifierGroup[]>([]);\n  const [itemPortions, setItemPortions] = useState<{name: string, price: number}[]>([]);\n  const [newPortionName, setNewPortionName] = useState('');\n  const [newPortionPrice, setNewPortionPrice] = useState(0);"
);

// Reset in handleAddItem success
code = code.replace(
  "setItemModifiers([]);\n        setItemPhotoUrl('');",
  "setItemModifiers([]);\n        setItemPortions([]);\n        setItemPhotoUrl('');"
);

// Reset when Add Item is clicked
code = code.replace(
  "setItemModifiers([]);\n                  setNewModName('');",
  "setItemModifiers([]);\n                  setItemPortions([]);\n                  setNewPortionName('');\n                  setNewPortionPrice(0);\n                  setNewModName('');"
);

// Setup when Edit is clicked
code = code.replace(
  "setItemModifiers(item.modifiers || []);\n                              setItemPhotoUrl",
  "setItemModifiers(item.modifiers || []);\n                              setItemPortions(item.portions || []);\n                              setItemPhotoUrl"
);

// handleAddItem payload
code = code.replace(
  "modifiers: itemModifiers,",
  "modifiers: itemModifiers,\n        portions: itemPortions,"
);

// UI for Portions
const portionsUI = `
                  {/* Portions */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Item Portions (Optional)</label>
                    {itemPortions.length > 0 && (
                      <div className="space-y-1.5 mb-3">
                        {itemPortions.map((p, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-lg p-2 text-xs">
                            <span className="font-semibold text-slate-800">{p.name} - {tenant.currencySymbol}{p.price}</span>
                            <button type="button" onClick={() => setItemPortions(prev => prev.filter((_, i) => i !== idx))} className="text-rose-500 hover:text-rose-700">
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Portion Name (e.g. Small, Large)</label>
                        <input type="text" value={newPortionName} onChange={e => setNewPortionName(e.target.value)} placeholder="e.g. Medium" className="w-full mt-1 rounded border border-slate-200 px-2 py-1.5 text-xs font-medium" />
                      </div>
                      <div className="flex-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Price ({tenant.currencySymbol})</label>
                        <input type="number" value={newPortionPrice} onChange={e => setNewPortionPrice(Number(e.target.value))} placeholder="Price" className="w-full mt-1 rounded border border-slate-200 px-2 py-1.5 text-xs font-medium" />
                      </div>
                      <button 
                        type="button" 
                        onClick={() => {
                          if (newPortionName && newPortionPrice >= 0) {
                            setItemPortions(prev => [...prev, { name: newPortionName, price: newPortionPrice }]);
                            setNewPortionName('');
                            setNewPortionPrice(0);
                          }
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
`;

code = code.replace(
  "{/* Device Image Upload Component */}",
  portionsUI + "\n                  {/* Device Image Upload Component */}"
);

fs.writeFileSync('src/views/BusinessOwnerView.tsx', code);
