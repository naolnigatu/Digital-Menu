const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

code = code.replace(
  /<span>Place \{orderType === 'dine_in' \? `Dine-in Order \$\{tables\.find\(t => t\.id === activeTableId\)\?\.number \|\| ''\}` : 'Pickup Pre-order'\}<\/span>/,
  "<span>Place {orderType === 'dine_in' ? `Dine-in Order ${tables.find(t => t.id === activeTableId)?.number || ''}` : orderType === 'meal_subscription' ? 'Meal Subscription Order' : 'Pickup Pre-order'}</span>"
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
