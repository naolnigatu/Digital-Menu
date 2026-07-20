const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf-8');

const match = `const canUseSubscriptionCredits = eligibleSubsToRedeem.length > 0 && orderType !== 'meal_subscription';`;
const replace = `
  const subConfig = activeTenant.mealSubscriptionConfig;
  const isFlexible = subConfig?.flexibleRedemption ?? true;
  const dailyLimit = subConfig?.dailyRedemptionLimit || 0;
  
  // Filter eligible subs to respect daily limits if not flexible
  const validSubsToRedeem = eligibleSubsToRedeem.filter(sub => {
    // If not flexible, check daily limit
    if (!isFlexible && dailyLimit > 0) {
      // Check if last redemption was today
      const isToday = sub.lastRedemptionDate && new Date(sub.lastRedemptionDate).toDateString() === new Date().toDateString();
      const currentToday = isToday ? (sub.redemptionsToday || 0) : 0;
      
      // If we've hit the limit today, this sub can't be used
      if (currentToday >= dailyLimit) {
        return false;
      }
    }
    return true;
  });

  const canUseSubscriptionCredits = validSubsToRedeem.length > 0 && orderType !== 'meal_subscription';`;
  
code = code.replace(match, replace);
fs.writeFileSync('src/views/CustomerView.tsx', code);
