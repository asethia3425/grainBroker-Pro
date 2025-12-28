
import React, { useState } from 'react';
import { Booking, Company, GrainType } from '../types';
import * as XLSX from 'xlsx';

interface BookingsViewProps {
  bookings: Booking[];
  companies: Company[];
  onAddBooking: (booking: Booking) => void;
  onUpdateBooking: (booking: Booking) => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({ bookings, companies, onAddBooking, onUpdateBooking }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // Form State
  const [grainType, setGrainType] = useState<GrainType>(GrainType.WHEAT);
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [brokeragePercent, setBrokeragePercent] = useState('1.5');
  const [fromCompanyId, setFromCompanyId] = useState('');
  const [toCompanyId, setToCompanyId] = useState('');

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setGrainType(booking.grainType as GrainType);
    setQuantity(booking.quantity.toString());
    setPrice(booking.price.toString());
    setBrokeragePercent(booking.brokeragePercent.toString());
    setFromCompanyId(booking.fromCompanyId);
    setToCompanyId(booking.toCompanyId);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromCompanyId || !toCompanyId) return alert('Please select both companies');

    const bookingData: Booking = {
      id: editingBooking?.id || Math.random().toString(36).substr(2, 9),
      grainType,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      brokeragePercent: parseFloat(brokeragePercent),
      fromCompanyId,
      toCompanyId,
      date: editingBooking?.date || new Date().toISOString()
    };

    if (editingBooking) {
      onUpdateBooking(bookingData);
    } else {
      onAddBooking(bookingData);
    }
    
    closeForm();
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingBooking(null);
    resetForm();
  };

  const resetForm = () => {
    setQuantity('');
    setPrice('');
    setFromCompanyId('');
    setToCompanyId('');
  };

  const exportToExcel = () => {
    const data = bookings.map(b => ({
      Date: new Date(b.date).toLocaleDateString(),
      Grain: b.grainType,
      Quantity_Tons: b.quantity,
      Price_Per_Ton: b.price,
      Total_Value: b.quantity * b.price,
      Brokerage_Percent: b.brokeragePercent,
      Brokerage_Amount: (b.quantity * b.price * b.brokeragePercent) / 100,
      Seller: companies.find(c => c.id === b.fromCompanyId)?.name,
      Buyer: companies.find(c => c.id === b.toCompanyId)?.name,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    XLSX.writeFile(workbook, `GrainBookings_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Trade Bookings</h2>
        <div className="flex space-x-2">
          <button 
            onClick={exportToExcel}
            className="bg-green-600 text-white p-2 rounded-lg shadow hover:bg-green-700 transition-all text-xs font-bold uppercase"
          >
            Export Excel
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-amber-600 text-white p-2 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-3 pb-4">
        {bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(booking => {
          const fromComp = companies.find(c => c.id === booking.fromCompanyId);
          const toComp = companies.find(c => c.id === booking.toCompanyId);
          const totalVal = booking.quantity * booking.price;
          const brokerage = (totalVal * booking.brokeragePercent) / 100;

          return (
            <div key={booking.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{booking.grainType}</span>
                    <span className="text-slate-400 text-xs">{new Date(booking.date).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mt-1">{booking.quantity} Tons @ ₹{booking.price}/T</h4>
                </div>
                <button 
                  onClick={() => handleEdit(booking)}
                  className="text-slate-300 hover:text-amber-600"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center text-sm font-medium">
                <div className="flex-1">
                  <div className="text-slate-400 text-[10px] uppercase">Seller</div>
                  <div className="text-slate-700 truncate">{fromComp?.name || 'Unknown'}</div>
                </div>
                <div className="px-4 text-slate-300">→</div>
                <div className="flex-1 text-right">
                  <div className="text-slate-400 text-[10px] uppercase">Buyer</div>
                  <div className="text-slate-700 truncate">{toComp?.name || 'Unknown'}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-50 flex justify-between items-center">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase">Brokerage ({booking.brokeragePercent}%)</div>
                  <div className="text-amber-600 font-bold">₹{brokerage.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400 text-[10px] uppercase">Total Deal Value</div>
                  <div className="text-slate-800 font-bold">₹{totalVal.toLocaleString()}</div>
                </div>
              </div>
            </div>
          );
        })}
        {bookings.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="text-4xl mb-4 text-slate-300">📝</div>
            <p className="text-slate-400">No bookings yet</p>
          </div>
        )}
      </div>

      {/* Modal / Form Overlay */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 animate-in slide-in-from-bottom duration-300 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">{editingBooking ? 'Edit Booking' : 'New Trade Booking'}</h3>
              <button onClick={closeForm} className="text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Grain Type</label>
                  <select 
                    value={grainType} 
                    onChange={e => setGrainType(e.target.value as GrainType)}
                    className="w-full bg-slate-50 border-none px-4 py-3 rounded-xl"
                  >
                    {Object.values(GrainType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Quantity (MT)</label>
                  <input required type="number" step="any" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full bg-slate-50 border-none px-4 py-3 rounded-xl" placeholder="e.g., 50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Price / Ton (₹)</label>
                  <input required type="number" step="any" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-slate-50 border-none px-4 py-3 rounded-xl" placeholder="e.g., 22000" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Brokerage (%)</label>
                  <input required type="number" step="0.1" value={brokeragePercent} onChange={e => setBrokeragePercent(e.target.value)} className="w-full bg-slate-50 border-none px-4 py-3 rounded-xl" placeholder="1.5" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">From (Seller Company)</label>
                <select 
                  required 
                  value={fromCompanyId} 
                  onChange={e => setFromCompanyId(e.target.value)}
                  className="w-full bg-slate-50 border-none px-4 py-3 rounded-xl"
                >
                  <option value="">Select Seller</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">To (Buyer Company)</label>
                <select 
                  required 
                  value={toCompanyId} 
                  onChange={e => setToCompanyId(e.target.value)}
                  className="w-full bg-slate-50 border-none px-4 py-3 rounded-xl"
                >
                  <option value="">Select Buyer</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              
              <button type="submit" className="w-full bg-amber-600 text-white font-bold py-4 rounded-2xl shadow-lg mt-4">
                {editingBooking ? 'Update Booking' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
