const fs = require('fs');
let code = fs.readFileSync('src/views/LandingPageView.tsx', 'utf-8');

code = code.replace(
  /<button\s+onClick=\{onEnterApp\}\s+className="inline-flex[^>]+>\s*View Demo\s*<\/button>/g,
  '<a href="#demo-video" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all hover:scale-105">View Demo</a>'
);

code = code.replace(
  /<button\s+onClick=\{onEnterApp\}\s+className="w-full text-center[^>]+>\s*View Demo\s*<\/button>/g,
  '<a href="#demo-video" className="w-full block text-center py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-500">View Demo</a>'
);

code = code.replace(
  /<button\s+className="text-sm font-semibold leading-6 text-white group flex items-center gap-2">\s*View Demo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" \/>\s*<\/button>/g,
  '<a href="#demo-video" className="text-sm font-semibold leading-6 text-white group flex items-center gap-2">View Demo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></a>'
);

code = code.replace(
  /<button\s+className="text-sm font-semibold leading-6 text-slate-900 group flex items-center gap-2">\s*View Demo <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" \/>\s*<\/button>/g,
  '<a href="#demo-video" className="text-sm font-semibold leading-6 text-slate-900 group flex items-center gap-2">View Demo <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></a>'
);

// We don't need onEnterApp prop anymore!
code = code.replace(/export default function LandingPageView\(\{ onEnterApp \}: \{ onEnterApp: \(\) => void \}\) \{/g, 'export default function LandingPageView() {');

fs.writeFileSync('src/views/LandingPageView.tsx', code);
