const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

content = content.replace(/const \[landingPageConfig, setLandingPageConfig\] = useState<LandingPageConfig>\(\(\) => \{[\s\S]*?return defaultLandingPageConfig;\s*\}\);/g, "const [landingPageConfig, setLandingPageConfig] = useState<LandingPageConfig>(defaultLandingPageConfig);");

content = content.replace(/const \[globalSettings, setGlobalSettings\] = useState<GlobalSettings>\(\(\) => \{[\s\S]*?return \{[\s\S]*?allowedSubscriptionDurations: \['monthly', 'yearly'\],\s*loyaltyEnabled: false\s*\};\s*\}\);/g, `const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({
    platformName: "Dinex Platform",
    platformCurrency: "USD",
    platformCurrencySymbol: "$",
    platformTimezone: "UTC",
    platformContactEmail: "support@dinex.example.com",
    maxBranchesPerTenant: 5,
    maxStaffPerTenant: 50,
    enableMarketplace: true,
    enableReservations: true,
    requireEmailVerification: false,
    allowedDiningServiceTypes: ['dine_in', 'takeaway', 'delivery', 'drive_through', 'pickup', 'meal_subscription'],
    allowedSubscriptionDurations: ['monthly', 'yearly'],
    loyaltyEnabled: false
});`);

// Types fix: they are probably imported in AppContext.tsx or should be MealSubscriptionPlan, CustomerSubscription
// Wait, the errors were:
// Cannot find name 'PaymentMethodsConfig'.
// Cannot find name 'MealSubscriptionPlan'.
// Cannot find name 'CustomerSubscription'.
// Let's see what the types were originally.
