const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

// Header layout changes
code = code.replace(
  'className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3"',
  'className="flex flex-row justify-between items-center gap-2"'
);
code = code.replace(
  'className="flex flex-wrap items-center gap-1.5 mt-2 md:mt-0 w-full md:w-auto"',
  'className="flex items-center gap-1 shrink-0"'
);

// Reduce button padding if needed
code = code.replace(
  'className="bg-amber-600 hover:bg-amber-500 text-white transition-colors border-none rounded-lg px-3 py-1 text-[11px] font-bold flex items-center gap-1 shrink-0 shadow-xs"',
  'className="bg-amber-600 hover:bg-amber-500 text-white transition-colors border-none rounded-lg px-2 py-1 text-[10px] font-bold flex items-center gap-0.5 shrink-0 shadow-xs"'
);

code = code.replace(
  'className="bg-indigo-600 hover:bg-indigo-500 text-white transition-colors border-none rounded-lg px-3 py-1 text-[11px] font-bold flex items-center gap-1 shrink-0 shadow-xs"',
  'className="bg-indigo-600 hover:bg-indigo-500 text-white transition-colors border-none rounded-lg px-2 py-1 text-[10px] font-bold flex items-center gap-0.5 shrink-0 shadow-xs"'
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
