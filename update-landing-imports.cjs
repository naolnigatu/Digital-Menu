const fs = require('fs');
let code = fs.readFileSync('src/views/LandingPageView.tsx', 'utf-8');

code = code.replace(
  /const \{ login, pricingPlans, marketplaceExtensions \} = useApp\(\);/,
  'const { login, pricingPlans, marketplaceExtensions, globalSettings } = useApp();'
);

fs.writeFileSync('src/views/LandingPageView.tsx', code);
