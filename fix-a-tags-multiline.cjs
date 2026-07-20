const fs = require('fs');
let code = fs.readFileSync('src/views/LandingPageView.tsx', 'utf-8');

code = code.replace(/<a([^>]+)>\s*([^<]+)\s*<\/button>/g, '<a$1>\n                    $2\n                  </a>');

fs.writeFileSync('src/views/LandingPageView.tsx', code);
