const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

const correctCard = `
                return (
                  <div 
                    key={item.id} 
                    onClick={isAvailable ? () => handleOpenItemDetails(item) : undefined}
                    className={\`rounded-xl border p-2 shadow-sm flex items-center gap-3 transition-all duration-200 relative \${
                      isAvailable
                        ? 'border-slate-200 bg-white cursor-pointer hover:border-indigo-500 hover:shadow-md'
                        : 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                    }\`}
                  >
                    {item.photoUrl && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-50"><img src={item.photoUrl} alt={item.name} className={\`h-full w-full object-cover \${!isAvailable && 'grayscale'}\`} referrerPolicy="no-referrer" /></div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className={\`text-[12px] leading-tight font-extrabold \${isAvailable ? 'text-slate-900' : 'text-slate-500 line-through'} truncate\`}>
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
                      
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-extrabold text-slate-900 text-[11px] font-mono">{activeTenant.currencySymbol} {item.price}</span>
                        {!isAvailable && (
                          <span className="text-[9px] font-extrabold text-slate-400 shrink-0">Unavailable</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
`;

code = code.replace(
  /                return \([\s\S]*?<div \n                    key=\{item\.id\} \n                    onClick=\{isAvailable \? \(\) => handleOpenItemDetails\(item\) : undefined\}\n                    className=\{`rounded-xl border p-2 shadow-sm flex flex-col gap-2 transition-all duration-200 relative \$\{[\s\S]*?<\/div>\n                  <\/div>\n                \);/m,
  correctCard
);

code = code.replace(
  /<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">/,
  '<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">'
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
