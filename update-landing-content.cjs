const fs = require('fs');
let code = fs.readFileSync('src/views/LandingPageView.tsx', 'utf-8');

code = code.replace(
  /const navLinks = \[/,
  `const config = globalSettings.landingPageConfig || {
    heroTitle: "Run Your Restaurant Business with AI",
    heroSubtitle: "Dinex is the ultimate all-in-one platform for modern restaurants, cafes, and multi-branch food chains.",
    heroBackgroundType: 'video',
    heroBackgroundUrl: 'https://cdn.pixabay.com/video/2015/09/25/744-139366606_tiny.mp4',
    aboutTitle: "Why businesses choose Dinex",
    aboutText: "Join thousands of restaurants that have transformed their operations, increased revenue, and delighted customers using our platform.",
    featuresTitle: "Everything you need to succeed",
    featuresSubtitle: "From digital menus to kitchen displays, we've got your entire restaurant operation covered.",
    contactEmail: "naolnigatu2025@gmail.com"
  };
  
  const navLinks = [`
);

// Replace hero content
code = code.replace(
  /<h1 className="mx-auto max-w-4xl font-display text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl">\s*Modern Digital Restaurant & <br className="hidden sm:block" \/>\s*<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Business Management Platform<\/span>\s*<\/h1>/g,
  `<h1 className="mx-auto max-w-4xl font-display text-5xl font-extrabold tracking-tight text-white sm:text-7xl drop-shadow-lg">\n              {config.heroTitle}\n            </h1>`
);
code = code.replace(
  /<p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">\s*Manage menus, orders, staff, kitchen, reservations, delivery, customers, payments, analytics, and more—all from one platform.\s*<\/p>/g,
  `<p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-200 drop-shadow-md">\n              {config.heroSubtitle}\n            </p>`
);

// Replace about content
code = code.replace(
  /<h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Why businesses choose Dinex<\/h2>\s*<p className="mt-6 text-lg leading-8 text-slate-600">\s*Join thousands of restaurants that have transformed their operations, increased revenue, and delighted customers using our platform.\s*<\/p>/g,
  `<h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{config.aboutTitle}</h2>\n            <p className="mt-6 text-lg leading-8 text-slate-600">\n              {config.aboutText}\n            </p>`
);

// Replace features content
code = code.replace(
  /<h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Everything you need to succeed<\/h2>\s*<p className="mt-6 text-lg leading-8 text-slate-600">\s*From digital menus to kitchen displays, we've got your entire restaurant operation covered.\s*<\/p>/g,
  `<h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{config.featuresTitle}</h2>\n            <p className="mt-6 text-lg leading-8 text-slate-600">\n              {config.featuresSubtitle}\n            </p>`
);

// Contact email update
code = code.replace(
  /naolnigatu2025@gmail\.com/g,
  `{config.contactEmail}`
);

fs.writeFileSync('src/views/LandingPageView.tsx', code);
