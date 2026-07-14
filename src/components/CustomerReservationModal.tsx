import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, X, CheckCircle } from 'lucide-react';

export const CustomerReservationModal = ({ tenantId, branchId, onClose }: { tenantId: string, branchId: string, onClose: () => void }) => {
  const { addReservation, currentUser } = useApp();
  const [isSuccess, setIsSuccess] = useState(false);
  const [form, setForm] = useState({
    customerName: currentUser?.name || '',
    customerPhone: '',
    date: '',
    time: '',
    guests: 2,
    specialRequests: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReservation({
      tenantId,
      branchId,
      ...form
    });
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl relative animate-in zoom-in-95 my-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 hover:bg-slate-200 p-2 rounded-full font-bold"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="p-8">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4 animate-in fade-in duration-300">
              <div className="mx-auto h-16 w-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                <CheckCircle className="h-10 w-10" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Request Received!</h2>
                <p className="text-sm font-semibold text-slate-500 mt-2">
                  Your table reservation has been requested successfully. The restaurant staff will review it shortly.
                </p>
              </div>
              <div className="border border-slate-100 bg-slate-50 rounded-2xl p-4 text-xs text-left text-slate-600 space-y-1">
                <p><strong>Name:</strong> {form.customerName}</p>
                <p><strong>Guests:</strong> {form.guests} Guests</p>
                <p><strong>Time:</strong> {new Date(form.date).toLocaleDateString()} at {form.time}</p>
              </div>
              <button 
                onClick={onClose}
                className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Book a Table</h2>
                  <p className="text-sm font-semibold text-slate-500">Reserve your spot in advance</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
                  <input required type="text" value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                  <input required type="tel" value={form.customerPhone} onChange={e => setForm({...form, customerPhone: e.target.value})} className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                    <input required type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold text-slate-700" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Time</label>
                    <input required type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold text-slate-700" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Number of Guests</label>
                  <input required type="number" min="1" max="50" value={form.guests} onChange={e => setForm({...form, guests: Number(e.target.value)})} className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold text-slate-700" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Special Requests (Optional)</label>
                  <textarea value={form.specialRequests} onChange={e => setForm({...form, specialRequests: e.target.value})} rows={3} className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold" placeholder="e.g. Allergy, Window seat..."></textarea>
                </div>
                <button type="submit" className="w-full py-4 mt-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-transform active:scale-[0.98]">
                  Request Reservation
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
