const fs = require('fs');
let code = fs.readFileSync('src/components/ReportsDashboard.tsx', 'utf-8');

// Replace sub.planId with sub.packageId
code = code.replace(/sub\.planId/g, 'sub.packageId');

const oldSubRevenue = `  const activeSubs = customerSubscriptions.filter(s => s.tenantId === tenantId && s.status === 'active');
  const totalSubRevenue = activeSubs.reduce((sum, sub) => {
    const plan = mealSubscriptionPlans[tenantId]?.find(p => p.id === sub.packageId);
    return sum + (plan?.monthlyPrice || 0);
  }, 0);`;

const newSubRevenue = `  const tenantSubs = customerSubscriptions.filter(s => s.tenantId === tenantId);
  const activeSubs = tenantSubs.filter(s => s.status === 'active');
  
  let totalSubRevenue = 0;
  let creditsSold = 0;
  let creditsRedeemed = 0;
  let creditsRemaining = 0;
  let creditsExpired = 0;

  tenantSubs.forEach(sub => {
    const plan = mealSubscriptionPlans[tenantId]?.find(p => p.id === sub.packageId);
    
    // Revenue from packages
    if (plan && (sub.status === 'active' || sub.status === 'expired')) {
      if (plan.type === 'fixed') {
        totalSubRevenue += (plan.price || 0);
      } else {
        totalSubRevenue += (plan.pricePerCredit || 0) * (plan.maxCredits || 0);
      }
    }

    if (sub.credits) {
      sub.credits.forEach(c => {
        creditsSold += c.total;
        creditsRedeemed += c.used;
        if (sub.status === 'active') {
          creditsRemaining += c.remaining;
        } else if (sub.status === 'expired' || sub.status === 'cancelled') {
          creditsExpired += c.remaining;
        }
      });
    }
  });`;

code = code.replace(oldSubRevenue, newSubRevenue);

const oldSubCard = `        {/* Subscriptions Card */}
        <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Active Subscriptions</span>
            <span className="block text-xl font-bold font-mono text-gray-950 mt-1">
              {activeSubs.length} ({currencySymbol}{totalSubRevenue}/mo)
            </span>
          </div>
        </div>`;

const newSubCard = `        {/* Subscriptions & Credits Metrics Card */}
        <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-xs col-span-2 md:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Meal Credit System</span>
                <span className="block text-xl font-bold font-mono text-gray-950 mt-0.5">
                  {currencySymbol}{totalSubRevenue.toLocaleString()} <span className="text-sm font-normal text-gray-500">Sub Rev</span>
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Subs</span>
              <span className="block text-lg font-bold font-mono text-emerald-600 mt-0.5">{activeSubs.length}</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 pt-3 border-t border-gray-100">
            <div className="text-center bg-gray-50 p-2 rounded-lg">
              <span className="block text-[9px] font-bold text-gray-400 uppercase">Sold</span>
              <span className="block text-sm font-bold font-mono text-gray-800">{creditsSold}</span>
            </div>
            <div className="text-center bg-indigo-50 p-2 rounded-lg">
              <span className="block text-[9px] font-bold text-indigo-400 uppercase">Redeemed</span>
              <span className="block text-sm font-bold font-mono text-indigo-700">{creditsRedeemed}</span>
            </div>
            <div className="text-center bg-emerald-50 p-2 rounded-lg">
              <span className="block text-[9px] font-bold text-emerald-500 uppercase">Remaining</span>
              <span className="block text-sm font-bold font-mono text-emerald-700">{creditsRemaining}</span>
            </div>
            <div className="text-center bg-rose-50 p-2 rounded-lg">
              <span className="block text-[9px] font-bold text-rose-400 uppercase">Expired</span>
              <span className="block text-sm font-bold font-mono text-rose-600">{creditsExpired}</span>
            </div>
          </div>
        </div>`;

code = code.replace(oldSubCard, newSubCard);

fs.writeFileSync('src/components/ReportsDashboard.tsx', code);
