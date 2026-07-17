const fs = require('fs');
let code = fs.readFileSync('src/views/BusinessOwnerView.tsx', 'utf8');

code = code.replace(
  "superAdminPaymentInfo } = useApp();",
  "superAdminPaymentInfo,\n    updateTenantType\n  } = useApp();"
);

const typeCard = `
          {/* General Configuration */}
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <h3 className="font-sans font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <Settings className="h-4.5 w-4.5 text-indigo-600" />
              <span>Business Identity</span>
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Business Type</label>
                {isEditingBizType ? (
                  <div className="flex gap-2 mt-1">
                    <select 
                      value={editingBusinessType} 
                      onChange={e => setEditingBusinessType(e.target.value)}
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Select type...</option>
                      <option value="Restaurant">Restaurant</option>
                      <option value="Cafe">Cafe / Coffee Shop</option>
                      <option value="Bar">Bar / Lounge</option>
                      <option value="Hotel">Hotel Dining</option>
                      <option value="Fast Food">Fast Food</option>
                    </select>
                    <button 
                      onClick={() => {
                        updateTenantType(activeTenantId, editingBusinessType);
                        setIsEditingBizType(false);
                        showToast('Business type updated.', 'success');
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 py-1.5 text-xs font-bold transition-all"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setIsEditingBizType(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg px-3 py-1.5 text-xs font-bold transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm font-semibold text-slate-800">{tenant.businessType || 'Not specified'}</span>
                    <button 
                      onClick={() => {
                        setEditingBusinessType(tenant.businessType || '');
                        setIsEditingBizType(true);
                      }}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 underline"
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
`;

code = code.replace(
  "{activeSubTab === 'settings' && can('business.edit') && (\n        <div className=\"max-w-2xl mx-auto space-y-6\">\n          \n          <div className=\"rounded-xl border border-slate-100 bg-white p-5 shadow-sm space-y-4\">\n            <h3 className=\"font-sans font-bold text-sm text-slate-800 flex items-center gap-1.5\">\n              <Award className=\"h-4.5 w-4.5 text-yellow-500\" />\n              <span>SaaS Subscription Tier</span>",
  "{activeSubTab === 'settings' && can('business.edit') && (\n        <div className=\"max-w-2xl mx-auto space-y-6\">" + "\n" + typeCard + "\n          <div className=\"rounded-xl border border-slate-100 bg-white p-5 shadow-sm space-y-4\">\n            <h3 className=\"font-sans font-bold text-sm text-slate-800 flex items-center gap-1.5\">\n              <Award className=\"h-4.5 w-4.5 text-yellow-500\" />\n              <span>SaaS Subscription Tier</span>"
);

fs.writeFileSync('src/views/BusinessOwnerView.tsx', code);
