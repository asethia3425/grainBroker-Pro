
import React, { useState, useEffect } from 'react';
import { Booking, Company, User, View } from '../types';
import { getMarketInsights } from '../services/geminiService';

interface DashboardViewProps {
  bookings: Booking[];
  companies: Company[];
  user: User;
  onNavigate: (view: View) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ bookings, companies, user, onNavigate }) => {
  const [aiInsight, setAiInsight] = useState<string>("Analyzing market trends...");

  useEffect(() => {
    const fetchInsight = async () => {
      const insight = await getMarketInsights(bookings, companies);
      setAiInsight(insight);
    };
    fetchInsight();
  }, [bookings, companies]);

  const totalRevenue = bookings.reduce((acc, curr) => acc + (curr.quantity * curr.price * (curr.brokeragePercent / 100)), 0);
  const totalVolume = bookings.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col">
        <span className="text-slate-500 text-sm font-medium">Welcome back,</span>
        <h2 className="text-2xl font-bold text-slate-800">{user.name} 👋</h2>
      </div>

      {/* AI Market Insight Card */}
      <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-3">
            <span className="p-1 bg-white/20 rounded-md">✨</span>
            <span className="font-semibold text-sm uppercase tracking-wider opacity-90">Market AI Insight</span>
          </div>
          <p className="text-amber-50 leading-relaxed font-medium">
            "{aiInsight}"
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wide mb-1">Total Brokerage</div>
          <div className="text-xl font-bold text-slate-800">₹{totalRevenue.toLocaleString()}</div>
          <div className="text-green-500 text-[10px] font-bold mt-1">↑ 12% from last month</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wide mb-1">Total Volume</div>
          <div className="text-xl font-bold text-slate-800">{totalVolume.toLocaleString()} T</div>
          <div className="text-amber-500 text-[10px] font-bold mt-1">Active trading</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-3">
          <button 
            onClick={() => onNavigate('bookings')}
            className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm active:bg-slate-50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600 text-xl">📝</div>
              <div className="text-left">
                <div className="font-bold text-slate-800 text-sm">Add New Booking</div>
                <div className="text-slate-400 text-xs">Register a new trade transaction</div>
              </div>
            </div>
            <span className="text-slate-300">→</span>
          </button>

          <button 
            onClick={() => onNavigate('companies')}
            className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm active:bg-slate-50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600 text-xl">🏢</div>
              <div className="text-left">
                <div className="font-bold text-slate-800 text-sm">Register Company</div>
                <div className="text-slate-400 text-xs">Add a buyer or seller company</div>
              </div>
            </div>
            <span className="text-slate-300">→</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">Recent Bookings</h3>
        <div className="space-y-2">
          {bookings.slice(0, 3).map(booking => (
            <div key={booking.id} className="bg-white p-3 rounded-xl border border-slate-100 flex justify-between items-center">
              <div>
                <div className="font-bold text-slate-800 text-sm">{booking.grainType} ({booking.quantity}T)</div>
                <div className="text-slate-400 text-[10px]">
                  {companies.find(c => c.id === booking.fromCompanyId)?.name} → {companies.find(c => c.id === booking.toCompanyId)?.name}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-amber-600 text-sm">₹{booking.price}</div>
                <div className="text-slate-400 text-[10px] uppercase font-medium">{new Date(booking.date).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
          {bookings.length === 0 && (
            <div className="text-center py-6 text-slate-400 text-sm italic">No bookings yet. Start by adding one!</div>
          )}
        </div>
      </div>
    </div>
  );
};
