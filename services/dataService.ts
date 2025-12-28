
import { Company, Booking } from '../types';

const COMPANIES_KEY = 'gb_companies';
const BOOKINGS_KEY = 'gb_bookings';

export const mockDataService = {
  getCompanies: (): Company[] => {
    const data = localStorage.getItem(COMPANIES_KEY);
    return data ? JSON.parse(data) : [
      { id: '1', name: 'AgroCorp India', phone: '9876543210', clientName: 'Rajesh Kumar', state: 'Punjab' },
      { id: '2', name: 'Bharat Grains Ltd', phone: '9123456789', clientName: 'Suresh Patel', state: 'Gujarat' }
    ];
  },
  saveCompanies: (companies: Company[]) => {
    localStorage.setItem(COMPANIES_KEY, JSON.stringify(companies));
  },
  getBookings: (): Booking[] => {
    const data = localStorage.getItem(BOOKINGS_KEY);
    return data ? JSON.parse(data) : [
      { 
        id: '101', 
        grainType: 'Wheat', 
        quantity: 50, 
        price: 24000, 
        brokeragePercent: 1.5, 
        fromCompanyId: '1', 
        toCompanyId: '2', 
        date: new Date().toISOString() 
      }
    ];
  },
  saveBookings: (bookings: Booking[]) => {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }
};
