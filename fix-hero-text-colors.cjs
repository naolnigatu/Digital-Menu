const fs = require('fs');
let code = fs.readFileSync('src/views/LandingPageView.tsx', 'utf-8');

const isColor = "config.heroBackgroundType === 'color' || !config.heroBackgroundUrl";

code = code.replace(
  /<h1 className="mx-auto max-w-4xl font-display text-5xl font-extrabold tracking-tight text-white sm:text-7xl drop-shadow-lg">/g,
  `<h1 className={\`mx-auto max-w-4xl font-display text-5xl font-extrabold tracking-tight sm:text-7xl \${${isColor} ? 'text-slate-900' : 'text-white drop-shadow-lg'}\`}>`
);

code = code.replace(
  /<p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-200 drop-shadow-md">/g,
  `<p className={\`mx-auto mt-6 max-w-2xl text-lg leading-8 \${${isColor} ? 'text-slate-600' : 'text-slate-200 drop-shadow-md'}\`}>`
);

// also fix the "View Demo" text color if needed, but it's okay.

fs.writeFileSync('src/views/LandingPageView.tsx', code);
