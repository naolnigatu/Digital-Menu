const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

const correctCard = `
                return (
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
                        {!isAvailable && (
                          <span className="text-[9px] font-extrabold text-slate-400 shrink-0">Unavailable</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
`;

code = code.replace(
  /                return \([\s\S]*?<div \n                    key=\{item\.id\} \n                    onClick=\{!isAvailable && \([\s\S]*?<\/span>\n                        \)\}\n                      <\/div>\n                    <\/div>\n                  <\/div>\n                \);/m,
  correctCard
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
