const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

code = code.replace(
  '<div className="space-y-3">\n            {filteredItems',
  '<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">\n            {filteredItems'
);

code = code.replace(
  /className=\{`rounded-2xl border p-3 shadow-sm flex gap-3 transition-all duration-200 relative \$\{/g,
  'className={`rounded-xl border p-2 shadow-sm flex flex-col gap-2 transition-all duration-200 relative ${'
);

code = code.replace(
  /<img\s+src=\{item.photoUrl\}\s+alt=\{item.name\}\s+className=\{`h-20 w-20 rounded-xl object-cover shrink-0 border border-slate-50 \$\{!isAvailable && 'grayscale'\}`\}\s+referrerPolicy="no-referrer"\s+\/>/g,
  `<div className="w-full aspect-[4/3] rounded-lg overflow-hidden shrink-0 border border-slate-50"><img src={item.photoUrl} alt={item.name} className={\`h-full w-full object-cover \${!isAvailable && 'grayscale'}\`} referrerPolicy="no-referrer" /></div>`
);

code = code.replace(
  /className=\{`text-xs font-extrabold \$\{isAvailable \? 'text-slate-900' : 'text-slate-500 line-through'\} flex flex-wrap items-center gap-1`\}/g,
  "className={`text-[11px] leading-tight font-extrabold ${isAvailable ? 'text-slate-900' : 'text-slate-500 line-through'} line-clamp-2`}"
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
