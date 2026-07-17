import React, { useState } from 'react';
import { Save } from 'lucide-react';

interface PaymentSettingsProps {
  tenantId: string;
  onClose?: () => void;
}

export default function PaymentSettings({ tenantId, onClose }: PaymentSettingsProps) {
  const [toast, setToast] = useState<string | null>(null);

  const handleSave = () => {
    setToast('✓ Saved successfully.');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/70">
        <h3 className="font-bold text-gray-900 text-lg">Payments</h3>
        <p className="text-xs text-gray-500 mt-1">There is nothing configurable here at the moment.</p>
      </div>
      <div className="p-6 space-y-6">
        {toast && (
          <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200">
            {toast}
          </div>
        )}
        <button
          onClick={handleSave}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
        >
          <Save className="w-4 h-4 inline mr-2" />
          Save
        </button>
      </div>
    </div>
  );
}
