const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

code = code.replace(
  '<span className="text-[9px] font-bold text-indigo-600 flex items-center gap-0.5 shrink-0">Customize <ArrowRight className="h-2.5 w-2.5" /></span>',
  '<span className="text-[9px] font-bold text-indigo-600 flex items-center gap-0.5 shrink-0">{item.modifiers && item.modifiers.length > 0 ? "Customize" : "Select"} <ArrowRight className="h-2.5 w-2.5" /></span>'
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
