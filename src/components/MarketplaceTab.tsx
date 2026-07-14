import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, Download, CheckCircle2 } from 'lucide-react';

export const MarketplaceTab = ({ tenantId }: { tenantId: string }) => {
  const { marketplaceExtensions, installedExtensions, installExtension, uninstallExtension } = useApp();
  
  // Sample extensions since the marketplace is new
  const extensions = [
    { id: 'ext-xero', name: 'Xero Accounting', description: 'Sync your daily sales and tax automatically with Xero.', price: 15, category: 'Integration', developer: 'Dinex Partners' },
    { id: 'ext-mailchimp', name: 'Mailchimp Sync', description: 'Sync customer emails and loyalty data for marketing campaigns.', price: 0, category: 'Integration', developer: 'Dinex Labs' },
    { id: 'ext-advanced-analytics', name: 'Advanced AI Analytics', description: 'Predictive inventory and AI-powered sales forecasting.', price: 29, category: 'Premium Feature', developer: 'Dinex Labs' },
    ...marketplaceExtensions
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Dinex Marketplace</h2>
        <p className="text-sm text-slate-500 font-bold bg-slate-100 px-3 py-1 rounded-full">Extend your platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {extensions.map(ext => {
          const isInstalled = installedExtensions.some(i => i.id === ext.id && i.tenantId === tenantId);
          return (
            <div key={ext.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500 block">{ext.category}</span>
                  <span className="font-mono font-bold text-slate-900">{ext.price === 0 ? 'Free' : `$${ext.price}/mo`}</span>
                </div>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{ext.name}</h3>
              <p className="text-sm text-slate-500 mb-4 flex-1">{ext.description}</p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">By {ext.developer}</span>
                {isInstalled ? (
                  <button onClick={() => uninstallExtension(tenantId, ext.id)} className="flex items-center gap-1 text-xs font-bold text-green-600 hover:text-green-700 bg-green-50 px-3 py-1.5 rounded-lg">
                    <CheckCircle2 className="h-4 w-4" /> Installed
                  </button>
                ) : (
                  <button onClick={() => installExtension(tenantId, ext.id)} className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">
                    <Download className="h-4 w-4" /> Install
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
