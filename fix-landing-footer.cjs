const fs = require('fs');
let code = fs.readFileSync('src/views/LandingPageView.tsx', 'utf-8');

code = code.replace(
  /<a href="#" className="hover:text-indigo-600">Privacy Policy<\/a>/g,
  '<a href="#privacy" className="hover:text-indigo-600">Privacy Policy</a>'
);
code = code.replace(
  /<a href="#" className="hover:text-indigo-600">Terms<\/a>/g,
  '<a href="#terms" className="hover:text-indigo-600">Terms</a>'
);
code = code.replace(
  /<a href="#" className="hover:text-indigo-600">Contact<\/a>/g,
  '<a href="mailto:naolnigatu2025@gmail.com" className="hover:text-indigo-600">Contact</a>'
);

// Add an ID to the "Why businesses choose Dinex" section to act as About
code = code.replace(
  /<div className="py-12 bg-white sm:py-16">/g,
  '<div id="about" className="py-12 bg-white sm:py-16">'
);

// Update navLinks
code = code.replace(
  /const navLinks = \[\s*\{ name: 'Features', href: '#features' \},\s*\{ name: 'Solutions', href: '#solutions' \},\s*\{ name: 'Pricing', href: '#pricing' \},\s*\{ name: 'Marketplace', href: '#marketplace' \},\s*\{ name: 'FAQ', href: '#faq' \},\s*\];/g,
  "const navLinks = [\n    { name: 'Features', href: '#features' },\n    { name: 'About', href: '#about' },\n    { name: 'Pricing', href: '#pricing' },\n    { name: 'Marketplace', href: '#marketplace' },\n    { name: 'FAQ', href: '#faq' },\n  ];"
);

fs.writeFileSync('src/views/LandingPageView.tsx', code);
