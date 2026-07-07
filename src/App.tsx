/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import SuperAdminView from './views/SuperAdminView';
import BusinessOwnerView from './views/BusinessOwnerView';
import WaiterView from './views/WaiterView';
import KDSView from './views/KDSView';
import CashierView from './views/CashierView';
import CustomerView from './views/CustomerView';
import OnboardingView from './views/OnboardingView';
import { 
  Building, LayoutGrid, CheckCircle2, ShieldCheck, RefreshCw, AlertTriangle
} from 'lucide-react';

function DashboardShell() {
  const { currentUser, tenants, activeTenantId } = useApp();

  const activeTenant = tenants.find(t => t.id === activeTenantId) || tenants[0];

  // Render view depending on logged-in role
  const renderView = () => {
    if (!currentUser) {
      return <CustomerView />;
    }

    // 1. Check if they are an owner and haven't created a business profile yet
    if (currentUser.role === 'owner' && !currentUser.tenantId) {
      return <OnboardingView />;
    }

    // 2. Resolve the business of the logged-in user
    const targetTenantId = currentUser.tenantId || activeTenantId;
    const myTenant = tenants.find(t => t.id === targetTenantId) || activeTenant;

    // 3. Apply subscription/approval state checks for non-super admins
    if (currentUser.role !== 'super_admin' && myTenant) {
      if (myTenant.subscriptionStatus === 'rejected') {
        return (
          <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-8 text-center max-w-md mx-auto my-12 space-y-4">
            <AlertTriangle className="h-12 w-12 text-rose-600 mx-auto" />
            <h2 className="font-sans font-extrabold text-base text-slate-900">Registration Rejected</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Unfortunately, your business profile registration request for <strong>"{myTenant.name}"</strong> was rejected by the platform administrator.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              For queries or to re-apply, please contact <strong>naolnigatu2025@gmail.com</strong>.
            </p>
            <div className="pt-3 border-t border-rose-100/60 text-[11px] font-semibold text-indigo-600">
              💡 Tip: Switch to "Super Admin" role to manage or reactivate this brand!
            </div>
          </div>
        );
      }

      if (myTenant.subscriptionStatus === 'suspended') {
        return (
          <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-8 text-center max-w-md mx-auto my-12 space-y-4">
            <AlertTriangle className="h-12 w-12 text-rose-600 mx-auto" />
            <h2 className="font-sans font-extrabold text-base text-slate-900">Workspace Blocked</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your business account <strong>"{myTenant.name}"</strong> has been blocked or suspended by the platform administrator.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Please contact <strong>naolnigatu2025@gmail.com</strong> for compliance or reactivation support.
            </p>
            <div className="pt-3 border-t border-rose-100/60 text-[11px] font-semibold text-indigo-600">
              💡 Tip: Switch to "Super Admin" role and unlock this workspace instantly!
            </div>
          </div>
        );
      }
    }

    switch (currentUser.role) {
      case 'super_admin':
        return <SuperAdminView />;
      case 'owner':
      case 'manager':
        return <BusinessOwnerView />;
      case 'waiter':
        return <WaiterView />;
      case 'kitchen':
        return <KDSView />;
      case 'cashier':
        return <CashierView />;
      default:
        return <CustomerView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-slate-900 pb-16">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Banner highlighting multi-role integration and simulation flow */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-4 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex gap-2.5 items-start">
            <div className="h-9 w-9 bg-white/10 rounded-lg flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-100">Evaluator Interactive Sandbox</p>
              <p className="text-[10px] text-slate-300 leading-normal">
                MenuFlow is a stateful multi-role SaaS. Set categories and modifiers as <strong>Owner</strong>, order on Table 1 as <strong>Customer</strong>, cook as <strong>Kitchen</strong>, deliver as <strong>Waiter</strong>, and bill as <strong>Cashier</strong>!
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Workspace Container */}
        <div id="app-workspace-body" className="rounded-2xl bg-white p-5 sm:p-6 border border-slate-100/80 shadow-sm min-h-[500px]">
          {renderView()}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <DashboardShell />
    </AppProvider>
  );
}

