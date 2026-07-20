const fs = require('fs');
let code = fs.readFileSync('src/components/ReportsDashboard.tsx', 'utf-8');

const calcStr = `  const topItems = Object.values(itemCounts)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);`;
    
const newCalcStr = `  const topItems = Object.values(itemCounts)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const subItemCounts: Record<string, { name: string; qty: number }> = {};
  completedOrders.filter(o => o.type === 'subscription_redemption').forEach(o => {
    o.items.forEach(it => {
      if (!subItemCounts[it.menuItemId]) subItemCounts[it.menuItemId] = { name: it.name, qty: 0 };
      subItemCounts[it.menuItemId].qty += it.quantity;
    });
  });
  const topSubItems = Object.values(subItemCounts).sort((a, b) => b.qty - a.qty).slice(0, 3);`;

code = code.replace(calcStr, newCalcStr);


const htmlMatch = `              <div className="space-y-4">
                {topItems.map((item, idx) => (`;
const newHtmlMatch = `              {topSubItems.length > 0 && (
                <div className="mb-4 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                  <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-2 block">Top Subscription Redeems</span>
                  <div className="space-y-2">
                    {topSubItems.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700 truncate">{item.name}</span>
                        <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">{item.qty}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-4">
                {topItems.map((item, idx) => (`;

code = code.replace(htmlMatch, newHtmlMatch);

fs.writeFileSync('src/components/ReportsDashboard.tsx', code);
