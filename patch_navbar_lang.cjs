const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

code = code.replace(
  /<span className="hidden sm:inline-block">\{language === 'en' \? 'English' : 'አማርኛ'\}<\/span>/,
  `<span className="hidden lg:inline-block">{language === 'en' ? 'English' : 'አማርኛ'}</span>`
);

code = code.replace(
  /<span className="sm:hidden">\{language === 'en' \? 'EN' : 'AM'\}<\/span>/,
  `<span className="lg:hidden">{language === 'en' ? 'EN' : 'AM'}</span>`
);

fs.writeFileSync('src/components/Navbar.tsx', code);
