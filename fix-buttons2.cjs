const fs = require('fs');
let code = fs.readFileSync('src/views/LandingPageView.tsx', 'utf-8');

code = code.replace(
  /className="rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:scale-105 hover:shadow-lg hover:shadow-indigo-500\/25"\s*>\s*Get Started\s*<\/a>\s*<button\s*onClick=\{onEnterApp\}\s*className="text-sm font-semibold leading-6 text-slate-900 group flex items-center gap-2"/g,
  'className="rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25">\n                Get Started\n              </button>\n              <a href="#demo-video" className="text-sm font-semibold leading-6 text-slate-900 group flex items-center gap-2"'
);

fs.writeFileSync('src/views/LandingPageView.tsx', code);
