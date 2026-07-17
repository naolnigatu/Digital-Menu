const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

code = code.replace(
  '        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">\n        \n        {/* Brand Logo & Name */}\n        <div className="flex items-center gap-3">\n          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-sm">\n            M\n          </div>\n          <div className="flex items-center gap-2.5">\n            <div>\n              <div className="flex items-center gap-1.5">\n                <span className="font-sans font-extrabold text-base tracking-tight text-slate-900">MenuFlow</span>',
  `        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-2 sm:px-4 lg:px-8">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <div 
            onClick={() => {
              logout();
              window.location.hash = '';
              window.location.reload();
            }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-sm cursor-pointer hover:opacity-90"
            title="Go to Landing Page"
          >
            M
          </div>
          <div className="flex items-center gap-1 sm:gap-2.5 min-w-0">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span 
                  onClick={() => {
                    logout();
                    window.location.hash = '';
                    window.location.reload();
                  }}
                  className="font-sans font-extrabold text-base tracking-tight text-slate-900 cursor-pointer hover:opacity-80 truncate"
                >
                  MenuFlow
                </span>`
);

code = code.replace(
  '        {/* Action Controls & Info */}\n        <div className="flex items-center gap-3">',
  '        {/* Action Controls & Info */}\n        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">'
);

code = code.replace(
  'className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"',
  'className="flex items-center gap-1 sm:gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"'
);

code = code.replace(
  'className="flex items-center gap-1.5 rounded-lg bg-indigo-600 text-white px-3.5 py-1.5 text-xs font-extrabold hover:bg-indigo-700 transition-colors cursor-pointer shadow-sm"',
  'className="flex items-center gap-1 sm:gap-1.5 rounded-lg bg-indigo-600 text-white px-2 sm:px-3.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-extrabold hover:bg-indigo-700 transition-colors cursor-pointer shadow-sm"'
);

code = code.replace(
  'className="flex items-center gap-1.5 rounded-lg bg-indigo-50 text-indigo-700 px-3 py-1.5 text-xs font-extrabold border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-pointer shadow-sm"',
  'className="flex items-center gap-1 sm:gap-1.5 rounded-lg bg-indigo-50 text-indigo-700 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-extrabold border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-pointer shadow-sm"'
);

code = code.replace(
  'className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-200',
  'className="flex items-center gap-1 sm:gap-1.5 rounded-lg px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium transition-all duration-200'
);

fs.writeFileSync('src/components/Navbar.tsx', code);
