
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Company {
  id: string;
  name: string;
  phone: string;
  clientName: string;
  state?: string;
}

export interface Booking {
  id: string;
  grainType: string;
  quantity: number; // in metric tons
  price: number; // price per ton
  brokeragePercent: number;
  fromCompanyId: string;
  toCompanyId: string;
  date: string; // ISO string
}

export type View = 'dashboard' | 'companies' | 'bookings' | 'analytics' | 'auth';

export enum GrainType {
  WHEAT = 'Wheat',
  CORN = 'Corn',
  SOYBEAN = 'Soybean',
  BARLEY = 'Barley',
  RICE = 'Rice',
  SORGHUM = 'Sorghum'
}
