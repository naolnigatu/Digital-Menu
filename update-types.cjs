const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf-8');

const landingPageConfigType = `
export interface LandingPageConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroBackgroundType: 'image' | 'video' | 'color';
  heroBackgroundUrl: string;
  aboutTitle: string;
  aboutText: string;
  featuresTitle: string;
  featuresSubtitle: string;
  contactEmail: string;
}

`;

code = code.replace(
  /export interface GlobalSettings {/,
  landingPageConfigType + 'export interface GlobalSettings {\n  landingPageConfig?: LandingPageConfig;'
);

fs.writeFileSync('src/types.ts', code);
