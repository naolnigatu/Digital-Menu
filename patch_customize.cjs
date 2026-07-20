const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

code = code.replace(
  '<div className="flex justify-between items-center mt-2.5">\n                        <div className="flex gap-1">',
  '<div className="flex justify-between items-end mt-auto pt-2 gap-1">\n                        <div className="flex flex-wrap gap-1 flex-1">'
);

code = code.replace(
  '<span className="text-[9px] font-bold text-indigo-600 flex items-center gap-0.5">Customize <ArrowRight className="h-2.5 w-2.5" /></span>',
  '<span className="text-[9px] font-bold text-indigo-600 flex items-center gap-0.5 shrink-0">Customize <ArrowRight className="h-2.5 w-2.5" /></span>'
);

code = code.replace(
  '<span className="text-[9px] font-extrabold text-slate-400">Unavailable</span>',
  '<span className="text-[9px] font-extrabold text-slate-400 shrink-0">Unavailable</span>'
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
