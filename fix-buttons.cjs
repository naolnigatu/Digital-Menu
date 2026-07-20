const fs = require('fs');
let code = fs.readFileSync('src/views/LandingPageView.tsx', 'utf-8');

code = code.replace(
  /<a href="#demo-video" onClick=\{handleLogin\} className=\{`mt-8 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors \$\{isPopular \? 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600' : 'bg-slate-50 text-slate-900 ring-1 ring-inset ring-slate-200 hover:ring-slate-300'\}`\}>\s*Get Started\s*<\/a>/g,
  "<button onClick={handleLogin} className={`mt-8 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors ${isPopular ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600' : 'bg-slate-50 text-slate-900 ring-1 ring-inset ring-slate-200 hover:ring-slate-300'}`}>Get Started</button>"
);

fs.writeFileSync('src/views/LandingPageView.tsx', code);
