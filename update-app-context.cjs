const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

const defaultLandingConfig = `      if (!parsed.landingPageConfig) {
        parsed.landingPageConfig = {
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
      }`;

code = code.replace(
  /if \(\!parsed\.allowedPaymentMethods\) \{/,
  defaultLandingConfig + '\n      if (!parsed.allowedPaymentMethods) {'
);

const newDefault = `      allowedPaymentMethods: ['cash', 'stripe', 'mobile_money', 'bank_transfer', 'binance_id', 'binance_wallet'],
      landingPageConfig: {
        heroTitle: "Run Your Restaurant Business with AI",
        heroSubtitle: "Dinex is the ultimate all-in-one platform for modern restaurants, cafes, and multi-branch food chains.",
        heroBackgroundType: 'video',
        heroBackgroundUrl: 'https://cdn.pixabay.com/video/2015/09/25/744-139366606_tiny.mp4',
        aboutTitle: "Why businesses choose Dinex",
        aboutText: "Join thousands of restaurants that have transformed their operations, increased revenue, and delighted customers using our platform.",
        featuresTitle: "Everything you need to succeed",
        featuresSubtitle: "From digital menus to kitchen displays, we've got your entire restaurant operation covered.",
        contactEmail: "naolnigatu2025@gmail.com"
      }`;

code = code.replace(
  /allowedPaymentMethods: \['cash', 'stripe', 'mobile_money', 'bank_transfer', 'binance_id', 'binance_wallet'\]/,
  newDefault
);

fs.writeFileSync('src/context/AppContext.tsx', code);
