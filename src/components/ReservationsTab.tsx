import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Check, X, MapPin } from 'lucide-react';

export const ReservationsTab = ({ tenantId, branchId }: { tenantId: string, branchId: string }) => {
  const { reservations, updateReservationStatus } = useApp();
  const branchReservations = reservations.filter(r => r.branchId === branchId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Reservations</h2>
      </div>
      
      {branchReservations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <MapPin className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Reservations</h3>
          <p className="text-slate-500 max-w-sm mx-auto">No reservations have been made for this branch yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {branchReservations.map(res => (
            <div key={res.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between md:items-center">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-slate-900">{res.customerName}</h3>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider
                    ${res.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      res.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                      res.status === 'completed' ? 'bg-green-100 text-green-700' :
                      res.status === 'rejected' || res.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}
                  >
                    {res.status}
                  </span>
                </div>
                <div className="text-sm text-slate-500 space-y-1">
                  <p><strong>Phone:</strong> {res.customerPhone}</p>
                  <p><strong>Date & Time:</strong> {new Date(res.date).toLocaleDateString()} at {res.time}</p>
                  <p><strong>Guests:</strong> {res.guests}</p>
                  {res.specialRequests && <p><strong>Requests:</strong> {res.specialRequests}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                {res.status === 'pending' && (
                  <>
                    <button onClick={() => updateReservationStatus(res.id, 'approved')} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">Approve</button>
                    <button onClick={() => updateReservationStatus(res.id, 'rejected')} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors">Reject</button>
                  </>
                )}
                {res.status === 'approved' && (
                  <button onClick={() => updateReservationStatus(res.id, 'completed')} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors">Mark Completed</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
