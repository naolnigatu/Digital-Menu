import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Calendar, DollarSign, TrendingUp, Users, Heart, Award, Gift, RefreshCw, ChevronRight } from 'lucide-react';

interface ReportsDashboardProps {
  tenantId: string;
}

export default function ReportsDashboard({ tenantId }: ReportsDashboardProps) {
  const { orders, staff, tenants, customerProfiles, customerSubscriptions, mealSubscriptionPlans } = useApp();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  const tenant = tenants.find(t => t.id === tenantId) || tenants[0];
  const currencySymbol = tenant?.currencySymbol || '$';

  // Filter orders for this tenant
  const tenantOrders = orders.filter(o => o.tenantId === tenantId);
  const completedOrders = tenantOrders.filter(o => o.status === 'completed');
  const refundedOrders = tenantOrders.filter(o => o.status === 'refunded' || o.paymentStatus === 'refunded');

  // 1. Calculations: Sales Volumes
  const totalSalesVal = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const totalRefundsVal = refundedOrders.reduce((sum, o) => {
    return sum + (o.refundDetails?.refundAmount || o.total);
  }, 0);

  // Timeframe sales breakdown
  const dailySales = completedOrders
    .filter(o => {
      const today = new Date().toISOString().split('T')[0];
      return (o.createdAt || '').startsWith(today);
    })
    .reduce((sum, o) => sum + o.total, 0);

  const weeklySales = completedOrders
    .filter(o => {
      const orderDate = new Date(o.createdAt);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return orderDate >= oneWeekAgo;
    })
    .reduce((sum, o) => sum + o.total, 0);

  const selectedSalesVal = timeframe === 'daily' ? dailySales : timeframe === 'weekly' ? weeklySales : totalSalesVal;

  // 2. Calculation: Top Items
  const itemCounts: Record<string, { name: string; qty: number; revenue: number }> = {};
  completedOrders.forEach(o => {
    o.items.forEach(it => {
      if (!itemCounts[it.menuItemId]) {
        itemCounts[it.menuItemId] = { name: it.name, qty: 0, revenue: 0 };
      }
      itemCounts[it.menuItemId].qty += it.quantity;
      itemCounts[it.menuItemId].revenue += it.price * it.quantity;
    });
  });
  const topItems = Object.values(itemCounts)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  // 3. Calculation: Top Customers
  const customerCounts: Record<string, { name: string; count: number; spend: number }> = {};
  completedOrders.forEach(o => {
    if (o.customerEmail) {
      const email = o.customerEmail;
      if (!customerCounts[email]) {
        customerCounts[email] = { name: o.customerName || email.split('@')[0], count: 0, spend: 0 };
      }
      customerCounts[email].count += 1;
      customerCounts[email].spend += o.total;
    }
  });
  const topCustomers = Object.values(customerCounts)
    .sort((a, b) => b.spend - a.spend)
    .slice(0, 5);

  // 4. Calculation: Top Staff & Tips
  const staffTips: Record<string, { name: string; tips: number; ordersCount: number }> = {};
  completedOrders.forEach(o => {
    if (o.waiterId) {
      const wid = o.waiterId;
      if (!staffTips[wid]) {
        const staffObj = staff.find(s => s.id === wid);
        staffTips[wid] = { name: staffObj?.name || o.waiterName || 'Staff Member', tips: 0, ordersCount: 0 };
      }
      staffTips[wid].tips += o.tip || 0;
      staffTips[wid].ordersCount += 1;
    }
  });
  const staffTipsList = Object.values(staffTips).sort((a, b) => b.tips - a.tips);

  // 5. Calculation: Payment Methods Distribution
  const paymentDistribution: Record<string, { name: string; count: number; total: number }> = {};
  completedOrders.forEach(o => {
    const pm = o.paymentMethod || 'cash';
    if (!paymentDistribution[pm]) {
      paymentDistribution[pm] = { name: pm.replace('_', ' ').toUpperCase(), count: 0, total: 0 };
    }
    paymentDistribution[pm].count += 1;
    paymentDistribution[pm].total += o.total;
  });
  const paymentMethodsList = Object.values(paymentDistribution).sort((a, b) => b.total - a.total);

  // 6. Subscriptions count
  const activeSubs = customerSubscriptions.filter(s => s.tenantId === tenantId && s.status === 'active');
  const totalSubRevenue = activeSubs.reduce((sum, sub) => {
    const plan = mealSubscriptionPlans[tenantId]?.find(p => p.id === sub.planId);
    return sum + (plan?.monthlyPrice || 0);
  }, 0);

  return (
    <div className="space-y-6">
      
      {/* Filters & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Platform Performance Matrix</h3>
          <p className="text-xs text-gray-500">Real-time analytical metrics, sales telemetry, staff commission audits, and loyalty points audits.</p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg shrink-0">
          {(['daily', 'weekly', 'monthly'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${
                timeframe === t 
                  ? 'bg-white text-gray-950 shadow-2xs font-bold' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Core Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sales Card */}
        <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">{timeframe} sales</span>
            <span className="block text-xl font-bold font-mono text-gray-950 mt-1">
              {currencySymbol}{selectedSalesVal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Subscriptions Card */}
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
        </div>

        {/* Tips Card */}
        <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Commissions & Tips</span>
            <span className="block text-xl font-bold font-mono text-gray-950 mt-1">
              {currencySymbol}{staffTipsList.reduce((sum, s) => sum + s.tips, 0).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Refunds Card */}
        <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Refunds Settled</span>
            <span className="block text-xl font-bold font-mono text-gray-950 mt-1">
              {currencySymbol}{totalRefundsVal.toFixed(2)} ({refundedOrders.length})
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Selling Menu Items */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-4">
          <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            Top Selling Menu Items
          </h4>
          <div className="space-y-3.5">
            {topItems.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-6">No purchase data available yet.</p>
            ) : (
              topItems.map((item, idx) => {
                const pct = topItems[0].qty > 0 ? (item.qty / topItems[0].qty) * 100 : 0;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium text-gray-800">
                      <span>{item.name}</span>
                      <span className="font-mono text-gray-500">{item.qty} units ({currencySymbol}{item.revenue.toFixed(2)})</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Payment Methods Distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-4">
          <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            Payment Channel Shares
          </h4>
          <div className="space-y-3.5">
            {paymentMethodsList.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-6">No transaction records logged.</p>
            ) : (
              paymentMethodsList.map((method, idx) => {
                const totalRevs = paymentMethodsList.reduce((sum, m) => sum + m.total, 0);
                const pct = totalRevs > 0 ? (method.total / totalRevs) * 100 : 0;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium text-gray-800">
                      <span>{method.name}</span>
                      <span className="font-mono text-gray-500">{pct.toFixed(1)}% ({currencySymbol}{method.total.toFixed(2)})</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Waiters & Tips Commission Audit */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-4">
          <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-500" />
            Tips & Staff Commissions Leaderboard
          </h4>
          <div className="divide-y divide-gray-100">
            {staffTipsList.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-6">No waiter commissions tracked yet.</p>
            ) : (
              staffTipsList.map((st, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-gray-400 font-bold">#{idx + 1}</span>
                    <span className="font-semibold text-gray-800">{st.name}</span>
                  </div>
                  <div className="flex gap-4 font-mono text-gray-500">
                    <span>{st.ordersCount} orders serv</span>
                    <span className="text-amber-600 font-bold font-mono">{currencySymbol}{st.tips.toFixed(2)} tips</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Routine Patrons */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-4">
          <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Gift className="w-4 h-4 text-indigo-600" />
            Top Routine Patrons
          </h4>
          <div className="divide-y divide-gray-100">
            {topCustomers.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-6">No repeat customer profiles found.</p>
            ) : (
              topCustomers.map((cust, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-gray-400 font-bold">#{idx + 1}</span>
                    <span className="font-semibold text-gray-800">{cust.name}</span>
                  </div>
                  <div className="flex gap-4 font-mono text-gray-500">
                    <span>{cust.count} orders</span>
                    <span className="text-indigo-600 font-bold font-mono">{currencySymbol}{cust.spend.toFixed(2)} spent</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
