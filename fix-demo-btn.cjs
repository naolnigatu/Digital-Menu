const fs = require('fs');
let code = fs.readFileSync('src/views/LandingPageView.tsx', 'utf-8');

const isColor = "config.heroBackgroundType === 'color' || !config.heroBackgroundUrl";

code = code.replace(
  /<button\s+className="text-sm font-semibold leading-6 text-slate-900 group flex items-center gap-2"\s*>\s*View Demo <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" \/>\s*<\/button>/g,
  `<a href="#demo-video" className={\`text-sm font-semibold leading-6 group flex items-center gap-2 \${${isColor} ? 'text-slate-900' : 'text-white'}\`}>\n                View Demo <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />\n              </a>`
);

// We should also replace the Get Started button, it says `<a href="#demo-video" onClick={handleLogin}` which is wrong, it should be a `<button>` 
// Oh wait, `handleLogin` navigates you inside the app, so it should be a `<button onClick={handleLogin}>Get Started</button>`

code = code.replace(
  /<a href="#demo-video"\s*onClick=\{handleLogin\}\s*className="rounded-full bg-indigo-600 px-8 py-3\.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:scale-105 hover:shadow-lg hover:shadow-indigo-500\/25"\s*>\s*Get Started\s*<\/a>/g,
  `<button onClick={handleLogin} className="rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25">\n                Get Started\n              </button>`
);

fs.writeFileSync('src/views/LandingPageView.tsx', code);
