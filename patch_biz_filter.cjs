const fs = require('fs');
let code = fs.readFileSync('src/views/BusinessOwnerView.tsx', 'utf8');

code = code.replace(
  '<option value="meal_subscription">Meal Subscription</option>',
  '<option value="meal_subscription">Meal Subscription (Purchase)</option>\n                    <option value="subscription_redemption">Subscription Request</option>'
);

fs.writeFileSync('src/views/BusinessOwnerView.tsx', code);
