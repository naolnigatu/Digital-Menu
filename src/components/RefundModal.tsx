import React, { useState } from 'react';
import { validateMultilineText } from '../utils/validation';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { X, RefreshCcw, AlertTriangle } from 'lucide-react';

interface RefundModalProps {
  order: Order;
  onClose: () => void;
}

export default function RefundModal({ order, onClose }: RefundModalProps) {
  const { refundOrder, currentUser, tenants } = useApp();
  const [amount, setAmount] = useState<number>(order.total);
  const [reason, setReason] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const tenant = tenants.find(t => t.id === order.tenantId) || tenants[0];
  const currencySymbol = tenant?.currencySymbol || '$';

  const handleInitiate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (amount <= 0) {
      setError('Refund amount must be greater than zero.');
      return;
    }
    if (amount > order.total) {
      setError(`Refund amount cannot exceed the order total of ${currencySymbol}${order.total}.`);
      return;
    }
        const reasonCheck = validateMultilineText(reason);
    if (!reasonCheck.valid) { setError(reasonCheck.error || 'Invalid characters.'); return; }
    if (!reason.trim()) {
      setError('A valid reason for the refund is required.');
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirm = () => {
    const actorName = currentUser ? currentUser.name : 'Owner';
    refundOrder(order.id, amount, reason.trim(), actorName);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <RefreshCcw className="w-5 h-5 text-red-600 animate-spin-slow" />
            <h3 className="font-semibold text-gray-900 text-lg">Refund Order {order.orderNum}</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!showConfirm ? (
          <form onSubmit={handleInitiate} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Order Total
              </label>
              <div className="p-3 bg-gray-50 rounded-lg text-gray-700 font-mono text-sm">
                {currencySymbol}{order.total} (including tax & fees)
              </div>
            </div>

            <div>
              <label htmlFor="refund-amount" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Refund Amount ({currencySymbol})
              </label>
              <input
                id="refund-amount"
                type="number"
                step="0.01"
                max={order.total}
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-gray-950 font-medium"
                
              />
            </div>

            <div>
              <label htmlFor="refund-reason" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Reason for Refund
              </label>
              <textarea
                id="refund-reason"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-950 text-sm"
                
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 rounded-lg text-xs font-medium text-red-600 border border-red-100 flex gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-xs hover:shadow-md"
              >
                Next
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="text-gray-950 font-bold text-base">Confirm Refund Payout?</h4>
              <p className="text-sm text-gray-500">
                You are about to issue a refund of <strong className="text-red-600">{currencySymbol}{amount}</strong> for order {order.orderNum}. This action is irreversible.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl space-y-2 border border-gray-100 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Refund Amount:</span>
                <span className="font-mono text-gray-800 font-semibold">{currencySymbol}{amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Reason:</span>
                <span className="text-gray-800 italic text-right max-w-[200px] truncate" title={reason}>{reason}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Refunded By:</span>
                <span className="text-gray-800 font-medium">{currentUser?.name || 'Owner'}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-xs"
              >
                Confirm Refund
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
