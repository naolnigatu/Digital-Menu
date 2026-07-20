const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

const banner = `
          {orderType === 'meal_subscription' && !currentLiveOrder && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-center gap-2 mb-2 animate-in fade-in">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-xs font-bold text-indigo-900">Meal Subscription Mode Active</p>
                <p className="text-[10px] text-indigo-700">Add the items you want in your daily meal to your cart, then checkout to complete your 30-day subscription purchase.</p>
              </div>
            </div>
          )}
`;

code = code.replace(
  /\{!\(activeCategories\.length === 1 && activeCategories\[0\]\.id === 'all'\) && \(/,
  banner + "\n          {!(activeCategories.length === 1 && activeCategories[0].id === 'all') && ("
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
