
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { AuthView } from './views/AuthView';
import { DashboardView } from './views/DashboardView';
import { CompaniesView } from './views/CompaniesView';
import { BookingsView } from './views/BookingsView';
import { AnalyticsView } from './views/AnalyticsView';
import { User, View, Company, Booking } from './types';
import { mockDataService } from './services/dataService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('grainbroker_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    // Initial data load
    setCompanies(mockDataService.getCompanies());
    setBookings(mockDataService.getBookings());
    setLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('grainbroker_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('grainbroker_user');
    setCurrentView('dashboard');
  };

  const handleAddCompany = (company: Company) => {
    const updated = [...companies, company];
    setCompanies(updated);
    mockDataService.saveCompanies(updated);
  };

  const handleAddBooking = (booking: Booking) => {
    const updated = [...bookings, booking];
    setBookings(updated);
    mockDataService.saveBookings(updated);
  };

  const handleUpdateBooking = (booking: Booking) => {
    const updated = bookings.map(b => b.id === booking.id ? booking : b);
    setBookings(updated);
    mockDataService.saveBookings(updated);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthView onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView bookings={bookings} companies={companies} user={currentUser} onNavigate={setCurrentView} />;
      case 'companies':
        return <CompaniesView companies={companies} onAddCompany={handleAddCompany} />;
      case 'bookings':
        return (
          <BookingsView 
            bookings={bookings} 
            companies={companies} 
            onAddBooking={handleAddBooking} 
            onUpdateBooking={handleUpdateBooking}
          />
        );
      case 'analytics':
        return <AnalyticsView bookings={bookings} companies={companies} />;
      default:
        return <DashboardView bookings={bookings} companies={companies} user={currentUser} onNavigate={setCurrentView} />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView} onLogout={handleLogout}>
      {renderView()}
    </Layout>
  );
};

export default App;
