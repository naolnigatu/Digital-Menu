const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  'modifiers: ModifierGroup[];',
  'modifiers: ModifierGroup[];\n  portions?: { name: string; price: number }[];'
);

code = code.replace(
  'selectedModifiers?: { groupName: string; optionName: string; price: number }[];',
  'selectedModifiers?: { groupName: string; optionName: string; price: number }[];\n  portionName?: string;'
);

code = code.replace(
  'export interface Tenant {',
  'export interface Tenant {\n  businessType?: string;'
);

code = code.replace(
  'export interface SubscriptionPlan {',
  'export interface SubscriptionPlan {\n  enabledTabs?: string[];'
);

fs.writeFileSync('src/types.ts', code);
