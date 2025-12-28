
import React, { useState } from 'react';
import { Company } from '../types';

interface CompaniesViewProps {
  companies: Company[];
  onAddCompany: (company: Company) => void;
}

export const CompaniesView: React.FC<CompaniesViewProps> = ({ companies, onAddCompany }) => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  
  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [clientName, setClientName] = useState('');
  const [state, setState] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCompany: Company = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      phone,
      clientName,
      state
    };
    onAddCompany(newCompany);
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setClientName('');
    setState('');
  };

  const filtered = companies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.clientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Company Registry</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-amber-600 text-white p-2 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <div className="relative">
        <input 
          type="text" 
          placeholder="Search by company or client..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white px-10 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none shadow-sm"
        />
        <span className="absolute left-3 top-3.5 text-slate-400">🔍</span>
      </div>

      <div className="grid grid-cols-1 gap-3 pb-4">
        {filtered.map(company => (
          <div key={company.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center group active:bg-slate-50">
            <div className="flex items-center space-x-4">
              <div className="bg-slate-100 h-12 w-12 rounded-xl flex items-center justify-center text-xl">🏢</div>
              <div>
                <h4 className="font-bold text-slate-800">{company.name}</h4>
                <div className="text-slate-500 text-sm font-medium">{company.clientName}</div>
                <div className="text-slate-400 text-xs flex items-center mt-0.5">
                  <span className="mr-2">📞 {company.phone}</span>
                  {company.state && <span>📍 {company.state}</span>}
                </div>
              </div>
            </div>
            <button className="p-2 text-slate-300 group-hover:text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="text-4xl mb-4 text-slate-300">🏢</div>
            <p className="text-slate-400">No companies found</p>
          </div>
        )}
      </div>

      {/* Modal / Form Overlay */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 animate-in slide-in-from-bottom duration-300 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Add New Company</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Company Name</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-amber-500" placeholder="e.g., Global Agro Ltd" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-slate-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-amber-500" placeholder="e.g., 9999999999" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Client Contact Name</label>
                <input required type="text" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full bg-slate-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-amber-500" placeholder="e.g., John Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">State (Optional)</label>
                <input type="text" value={state} onChange={e => setState(e.target.value)} className="w-full bg-slate-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-amber-500" placeholder="e.g., Punjab" />
              </div>
              
              <button type="submit" className="w-full bg-amber-600 text-white font-bold py-4 rounded-2xl shadow-lg mt-4 hover:bg-amber-700 transition-colors">
                Save Company
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
