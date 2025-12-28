
import React, { useState, useMemo, useRef } from 'react';
import { Booking, Company } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell, PieChart, Pie
} from 'recharts';

interface AnalyticsViewProps {
  bookings: Booking[];
  companies: Company[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ bookings, companies }) => {
  const [filterCompany, setFilterCompany] = useState<string>('all');
  const [filterTime, setFilterTime] = useState<'monthly' | 'yearly'>('monthly');
  const reportRef = useRef<HTMLDivElement>(null);

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchCompany = filterCompany === 'all' || b.fromCompanyId === filterCompany || b.toCompanyId === filterCompany;
      return matchCompany;
    });
  }, [bookings, filterCompany]);

  const chartData = useMemo(() => {
    const data: Record<string, { month: string, brokerage: number, quantity: number }> = {};
    
    filteredBookings.forEach(b => {
      const date = new Date(b.date);
      const key = filterTime === 'monthly' 
        ? date.toLocaleString('default', { month: 'short' })
        : date.getFullYear().toString();
      
      const brokerage = (b.quantity * b.price * b.brokeragePercent) / 100;
      
      if (!data[key]) {
        data[key] = { month: key, brokerage: 0, quantity: 0 };
      }
      data[key].brokerage += brokerage;
      data[key].quantity += b.quantity;
    });

    return Object.values(data);
  }, [filteredBookings, filterTime]);

  const grainStats = useMemo(() => {
    const stats: Record<string, number> = {};
    filteredBookings.forEach(b => {
      stats[b.grainType] = (stats[b.grainType] || 0) + b.quantity;
    });
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [filteredBookings]);

  const COLORS = ['#d97706', '#2563eb', '#16a34a', '#dc2626', '#9333ea'];

  const handleDownloadImage = () => {
    // Basic screenshot mechanism for browser
    // In a real mobile app, we might use a library like html-to-image
    alert("In a browser, please use the browser's screenshot or right-click to save relevant charts. In production, this would trigger an image generation of the element.");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-8" ref={reportRef}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Performance Report</h2>
        <button 
          onClick={handleDownloadImage}
          className="bg-slate-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1"
        >
          <span>📸</span>
          <span>SAVE IMAGE</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilterTime('monthly')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${filterTime === 'monthly' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-50 text-slate-500'}`}
          >
            MONTHLY
          </button>
          <button 
            onClick={() => setFilterTime('yearly')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${filterTime === 'yearly' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-50 text-slate-500'}`}
          >
            YEARLY
          </button>
        </div>
        
        <select 
          value={filterCompany} 
          onChange={e => setFilterCompany(e.target.value)}
          className="w-full bg-slate-50 border-none px-4 py-2.5 rounded-xl text-xs font-medium focus:ring-amber-500"
        >
          <option value="all">All Companies</option>
          {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Charts Section */}
      <div className="space-y-4">
        {/* Brokerage Chart */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-400 uppercase mb-6 flex items-center">
            <span className="w-1 h-4 bg-amber-500 rounded-full mr-2"></span>
            Brokerage Revenue (₹)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="brokerage" fill="#d97706" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quantity Chart */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-400 uppercase mb-6 flex items-center">
             <span className="w-1 h-4 bg-blue-500 rounded-full mr-2"></span>
             Quantity Shipped (MT)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Line type="monotone" dataKey="quantity" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grain Distribution */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-400 uppercase mb-6 flex items-center">
             <span className="w-1 h-4 bg-green-500 rounded-full mr-2"></span>
             Grain Distribution
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={grainStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {grainStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {grainStats.map((stat, i) => (
              <div key={stat.name} className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                <span className="text-[10px] font-bold text-slate-600 truncate">{stat.name}: {stat.value}T</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
