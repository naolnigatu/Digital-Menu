const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

code = code.replace(
  /\{isAvailable \? \([\s\S]*?<span className="text-\[9px\] font-bold text-indigo-600 flex items-center gap-0\.5 shrink-0">\{item.modifiers && item.modifiers.length > 0 \? "Customize" : "Select"\} <ArrowRight className="h-2\.5 w-2\.5" \/><\/span>\s*\) : \(\s*<span className="text-\[9px\] font-extrabold text-slate-400 shrink-0">Unavailable<\/span>\s*\)\}/m,
  "{!isAvailable && (\n                          <span className=\"text-[9px] font-extrabold text-slate-400 shrink-0\">Unavailable</span>\n                        )}"
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
