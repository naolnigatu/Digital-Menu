const fs = require('fs');
let code = fs.readFileSync('src/views/LandingPageView.tsx', 'utf-8');

code = code.replace(/<a href="([^"]+)"([^>]*)>([^<]+)<\/button>/g, '<a href="$1"$2>$3</a>');
code = code.replace(/<a href="#demo-video" className="text-sm font-semibold leading-6 text-slate-900 group flex items-center gap-2">\s*View Demo <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" \/><\/button>/g, '<a href="#demo-video" className="text-sm font-semibold leading-6 text-slate-900 group flex items-center gap-2">View Demo <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></a>');
code = code.replace(/<a href="#demo-video" className="text-sm font-semibold leading-6 text-white group flex items-center gap-2">View Demo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" \/><\/button>/g, '<a href="#demo-video" className="text-sm font-semibold leading-6 text-white group flex items-center gap-2">View Demo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></a>');

// Now, fix the Get Started button in the Hero
code = code.replace(
  /<button\s*onClick=\{handleLogin\}\s*className="rounded-full bg-indigo-600 px-8 py-3\.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:scale-105 hover:shadow-lg hover:shadow-indigo-500\/25"\s*>\s*Get Started\s*<\/a>/g,
  '<button onClick={handleLogin} className="rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25">\n                Get Started\n              </button>'
);

fs.writeFileSync('src/views/LandingPageView.tsx', code);
