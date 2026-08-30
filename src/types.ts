export type Role = 'farmer' | 'admin';

export type Lang = 'en' | 'hi';

export type CropType =
  | 'wheat'
  | 'rice'
  | 'sugarcane'
  | 'mustard'
  | 'maize'
  | 'soybean'
  | 'cotton'
  | 'lentil';

export type ProcurementStatus =
  | 'token_generated'
  | 'waiting'
  | 'called'
  | 'verification'
  | 'weighing'
  | 'payment'
  | 'completed'
  | 'cancelled';

export interface Crop {
  id: string;
  type: CropType;
  nameEn: string;
  nameHi: string;
  icon: string; // lucide icon name
  msp: number; // ₹ per quintal
  unit: 'quintal';
}

export interface Center {
  id: string;
  name: string;
  nameHi: string;
  address: string;
  district: string;
  distanceKm: number;
  lat: number;
  lng: number;
  capacityPerDay: number;
  openTime: string;
  closeTime: string;
  active: boolean;
}

export interface Slot {
  id: string;
  centerId: string;
  date: string; // ISO date
  startTime: string;
  endTime: string;
  capacity: number;
  booked: number;
}

export interface Booking {
  id: string;
  tokenNo: number;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  centerId: string;
  centerName: string;
  slotId: string;
  slotLabel: string;
  date: string;
  cropType: CropType;
  cropName: string;
  quantityQuintal: number;
  status: ProcurementStatus;
  queuePosition: number;
  totalInQueue: number;
  estimatedWaitMin: number;
  joinedAt: string;
  createdAt: string;
  history: { status: ProcurementStatus; at: string }[];
}

export interface AppNotification {
  id: string;
  bookingId?: string;
  title: string;
  titleHi: string;
  body: string;
  bodyHi: string;
  at: string;
  read: boolean;
}
