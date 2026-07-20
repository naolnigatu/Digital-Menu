const fs = require('fs');
let code = fs.readFileSync('src/views/BusinessOwnerView.tsx', 'utf8');

const verificationBlock = `
                          {selectedOrderDetail.paymentVerificationStatus === 'pending' && selectedOrderDetail.paymentScreenshotUrl && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 space-y-3">
                              <h5 className="text-amber-900 font-bold text-sm">Action Required: Verify Advance Payment</h5>
                              <div className="flex gap-4 items-start">
                                <a href={selectedOrderDetail.paymentScreenshotUrl} target="_blank" rel="noreferrer" className="shrink-0">
                                  <img src={selectedOrderDetail.paymentScreenshotUrl} className="w-24 h-24 object-cover rounded-lg border border-amber-200 hover:opacity-80 transition-opacity" alt="Payment Proof" />
                                </a>
                                <div className="space-y-1 text-xs">
                                  <p><span className="font-bold text-amber-800">Transaction Ref:</span> {selectedOrderDetail.advancePaymentRef || 'Not provided'}</p>
                                  <p><span className="font-bold text-amber-800">Order Amount:</span> {activeBusiness?.currency || 'ETB'} {selectedOrderDetail.total}</p>
                                </div>
                              </div>
                              <div className="flex gap-2 pt-2">
                                <button
                                  onClick={() => {
                                    verifyAdvancePayment(selectedOrderDetail.id, true);
                                    showToast('Payment verified and accepted.');
                                    setSelectedOrderDetail(prev => prev ? { ...prev, paymentVerificationStatus: 'approved' } : null);
                                  }}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 rounded-lg shadow-sm"
                                >
                                  ✓ Approve Payment
                                </button>
                                <button
                                  onClick={() => {
                                    const reason = window.prompt("Reason for rejection:");
                                    if (reason !== null) {
                                      verifyAdvancePayment(selectedOrderDetail.id, false, reason);
                                      showToast('Payment rejected.', 'error');
                                      setSelectedOrderDetail(prev => prev ? { ...prev, paymentVerificationStatus: 'rejected', status: 'cancelled' } : null);
                                    }
                                  }}
                                  className="bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs py-2 px-4 rounded-lg hover:bg-rose-100"
                                >
                                  ✕ Reject
                                </button>
                              </div>
                            </div>
                          )}
`;

code = code.replace(
  /                          \{selectedOrderDetail\.type !== 'delivery' && selectedOrderDetail\.status === 'pending' && \(/,
  verificationBlock + "\n                          {selectedOrderDetail.type !== 'delivery' && selectedOrderDetail.status === 'pending' && ("
);

// We need to add `verifyAdvancePayment` to the destructured `useApp()` in `BusinessOwnerView`
code = code.replace(
  /    addStation,\n    placeOrder,\n    updateOrderStatus,\n/,
  "    addStation,\n    placeOrder,\n    updateOrderStatus,\n    verifyAdvancePayment,\n"
);

fs.writeFileSync('src/views/BusinessOwnerView.tsx', code);
