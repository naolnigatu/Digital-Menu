const fs = require('fs');
let code = fs.readFileSync('src/views/LandingPageView.tsx', 'utf-8');

code = code.replace(
  `const { login } = useApp();`,
  `const { login, pricingPlans, marketplaceExtensions } = useApp();`
);

fs.writeFileSync('src/views/LandingPageView.tsx', code);
