const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const importReplacement = `import { 
  Tenant, Branch, PreparationStation, Category, MenuItem, Table, Order, Staff, SystemLog, UserRole, OrderStatus, OrderItem, SubscriptionPlan, PlatformAd, PlanPricing, TimelineEvent, KitchenNote, 
  PaymentMethodConfig, LoyaltyConfig, MealSubscriptionPlan, CustomerMealSubscription, CustomerProfile, RefundDetails, LoyaltyHistoryEntry, 
  Reservation, Ingredient, StockMovement, MarketplaceExtension, InstalledExtension, DinexNotification, GlobalSettings, SubscriptionRequest
} from '../types';`;

code = code.replace(/import \{[\s\S]*?\} from '\.\.\/types';/, importReplacement);

fs.writeFileSync('src/context/AppContext.tsx', code);
