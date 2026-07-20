const fs = require('fs');
let code = fs.readFileSync('src/views/LandingPageView.tsx', 'utf-8');

code = code.replace(/login\('demo@menuflow\.com'\)/g, "login('naolnigatu2025@gmail.com')");

fs.writeFileSync('src/views/LandingPageView.tsx', code);
