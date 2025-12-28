
import React from 'react';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onViewChange: (view: View) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange, onLogout }) => {
  const navItems = [
    { id: 'dashboard' as View, label: 'Home', icon: '🏠' },
    { id: 'bookings' as View, label: 'Bookings', icon: '📝' },
    { id: 'companies' as View, label: 'Clients', icon: '🏢' },
    { id: 'analytics' as View, label: 'Report', icon: '📊' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-amber-600 p-1.5 rounded-lg text-white font-bold text-xl">GP</div>
          <h1 className="text-lg font-bold text-slate-800">GrainBroker <span className="text-amber-600 font-medium italic">Pro</span></h1>
        </div>
        <button 
          onClick={onLogout}
          className="p-2 text-slate-500 hover:text-red-600 transition-colors"
          title="Logout"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto p-4 md:max-w-4xl">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-2 px-4 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex flex-col items-center p-1 min-w-[64px] transition-all ${
              currentView === item.id ? 'text-amber-600' : 'text-slate-400'
            }`}
          >
            <span className="text-2xl mb-1">{item.icon}</span>
            <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
            {currentView === item.id && (
              <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-0.5"></div>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};
