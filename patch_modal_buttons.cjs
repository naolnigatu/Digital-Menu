const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

code = code.replace(
  /                      <ShoppingBag className="h-4 w-4" \/>\n                      Add to Cart\n                    <\/button>/,
  "                      <ShoppingBag className=\"h-4 w-4\" />\n                      {orderType === 'meal_subscription' ? 'Add to Subscription' : 'Add to Cart'}\n                    </button>"
);

code = code.replace(
  /                      Order Now - \{activeTenant\.currencySymbol\} \{currentItemPrice\.toLocaleString\(\)\}\n                    <\/button>/,
  "                      {orderType === 'meal_subscription' ? 'Subscribe Now' : 'Order Now'} - {activeTenant.currencySymbol} {currentItemPrice.toLocaleString()}\n                    </button>"
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
