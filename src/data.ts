import type { Crop, Center, Slot, Booking, ProcurementStatus } from '@/types';

export const CROPS: Crop[] = [
  { id: 'c1', type: 'wheat', nameEn: 'Wheat', nameHi: 'गेहूं', icon: 'Wheat', msp: 2275, unit: 'quintal' },
  { id: 'c2', type: 'rice', nameEn: 'Paddy (Rice)', nameHi: 'धान (चावल)', icon: 'Wheat', msp: 2183, unit: 'quintal' },
  { id: 'c3', type: 'sugarcane', nameEn: 'Sugarcane', nameHi: 'गन्ना', icon: 'Sprout', msp: 340, unit: 'quintal' },
  { id: 'c4', type: 'mustard', nameEn: 'Mustard', nameHi: 'सरसों', icon: 'Flower', msp: 5650, unit: 'quintal' },
  { id: 'c5', type: 'maize', nameEn: 'Maize', nameHi: 'मक्का', icon: 'Sprout', msp: 1962, unit: 'quintal' },
  { id: 'c6', type: 'soybean', nameEn: 'Soybean', nameHi: 'सोयाबीन', icon: 'Sprout', msp: 4892, unit: 'quintal' },
  { id: 'c7', type: 'cotton', nameEn: 'Cotton', nameHi: 'कपास', icon: 'Sprout', msp: 7020, unit: 'quintal' },
  { id: 'c8', type: 'lentil', nameEn: 'Lentil (Masoor)', nameHi: 'मसूर (दाल)', icon: 'Sprout', msp: 6425, unit: 'quintal' },
];

export const CENTERS: Center[] = [
  { id: 'ct1', name: 'Krishi Setu Center - Sector 12', nameHi: 'कृषि Setu केंद्र - सेक्टर 12', address: 'Sector 12, Grain Market', district: 'Karnal', distanceKm: 2.4, lat: 29.6856, lng: 76.9905, capacityPerDay: 120, openTime: '08:00', closeTime: '18:00', active: true },
  { id: 'ct2', name: 'Mandi Samiti - Old Town', nameHi: 'मंडी समिति - पुराना शहर', address: 'Old Town, Near Bus Stand', district: 'Karnal', distanceKm: 5.1, lat: 29.6804, lng: 76.9890, capacityPerDay: 200, openTime: '07:00', closeTime: '19:00', active: true },
  { id: 'ct3', name: 'APMC Procurement Hub - Industrial Area', nameHi: 'APMC खरीद केंद्र - औद्योगिक क्षेत्र', address: 'Industrial Area, Phase 2', district: 'Karnal', distanceKm: 8.7, lat: 29.7000, lng: 77.0100, capacityPerDay: 300, openTime: '08:00', closeTime: '20:00', active: true },
  { id: 'ct4', name: 'Primary Cooperative Society - Nigdi', nameHi: 'प्राथमिक सहकारी समिति - निगडी', address: 'Nigdi Village Road', district: 'Karnal', distanceKm: 12.3, lat: 29.7100, lng: 76.9500, capacityPerDay: 80, openTime: '09:00', closeTime: '17:00', active: true },
  { id: 'ct5', name: 'Grain Market - Taraori', nameHi: 'अनाज मंडी - तरावड़ी', address: 'Taraori Main Road', district: 'Karnal', distanceKm: 18.9, lat: 29.7800, lng: 76.9200, capacityPerDay: 150, openTime: '08:00', closeTime: '18:00', active: false },
];

function dateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export const SLOTS: Slot[] = [
  { id: 's1', centerId: 'ct1', date: dateOffset(0), startTime: '08:00', endTime: '10:00', capacity: 30, booked: 18 },
  { id: 's2', centerId: 'ct1', date: dateOffset(0), startTime: '10:00', endTime: '12:00', capacity: 30, booked: 30 },
  { id: 's3', centerId: 'ct1', date: dateOffset(0), startTime: '14:00', endTime: '16:00', capacity: 30, booked: 12 },
  { id: 's4', centerId: 'ct1', date: dateOffset(0), startTime: '16:00', endTime: '18:00', capacity: 30, booked: 5 },
  { id: 's5', centerId: 'ct2', date: dateOffset(0), startTime: '07:00', endTime: '09:00', capacity: 50, booked: 40 },
  { id: 's6', centerId: 'ct2', date: dateOffset(0), startTime: '09:00', endTime: '11:00', capacity: 50, booked: 50 },
  { id: 's7', centerId: 'ct2', date: dateOffset(0), startTime: '14:00', endTime: '16:00', capacity: 50, booked: 22 },
  { id: 's8', centerId: 'ct3', date: dateOffset(0), startTime: '08:00', endTime: '10:00', capacity: 75, booked: 60 },
  { id: 's9', centerId: 'ct3', date: dateOffset(0), startTime: '10:00', endTime: '12:00', capacity: 75, booked: 45 },
  { id: 's10', centerId: 'ct3', date: dateOffset(0), startTime: '14:00', endTime: '16:00', capacity: 75, booked: 30 },
  { id: 's11', centerId: 'ct4', date: dateOffset(0), startTime: '09:00', endTime: '11:00', capacity: 20, booked: 8 },
  { id: 's12', centerId: 'ct4', date: dateOffset(0), startTime: '14:00', endTime: '16:00', capacity: 20, booked: 3 },
  { id: 's13', centerId: 'ct1', date: dateOffset(1), startTime: '08:00', endTime: '10:00', capacity: 30, booked: 6 },
  { id: 's14', centerId: 'ct1', date: dateOffset(1), startTime: '10:00', endTime: '12:00', capacity: 30, booked: 10 },
  { id: 's15', centerId: 'ct2', date: dateOffset(1), startTime: '07:00', endTime: '09:00', capacity: 50, booked: 15 },
  { id: 's16', centerId: 'ct3', date: dateOffset(2), startTime: '08:00', endTime: '10:00', capacity: 75, booked: 20 },
];

const now = new Date().toISOString();

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b1', tokenNo: 42, farmerId: 'f1', farmerName: 'Ramesh Kumar', farmerPhone: '9876543210',
    centerId: 'ct1', centerName: 'Krishi Setu Center - Sector 12', slotId: 's1', slotLabel: '08:00 - 10:00',
    date: dateOffset(0), cropType: 'wheat', cropName: 'Wheat', quantityQuintal: 15,
    status: 'waiting', queuePosition: 3, totalInQueue: 12, estimatedWaitMin: 45,
    joinedAt: now, createdAt: now,
    history: [{ status: 'token_generated', at: now }, { status: 'waiting', at: now }],
  },
  {
    id: 'b2', tokenNo: 38, farmerId: 'f2', farmerName: 'Suresh Singh', farmerPhone: '9876501234',
    centerId: 'ct1', centerName: 'Krishi Setu Center - Sector 12', slotId: 's1', slotLabel: '08:00 - 10:00',
    date: dateOffset(0), cropType: 'rice', cropName: 'Paddy (Rice)', quantityQuintal: 20,
    status: 'verification', queuePosition: 1, totalInQueue: 12, estimatedWaitMin: 15,
    joinedAt: now, createdAt: now,
    history: [{ status: 'token_generated', at: now }, { status: 'waiting', at: now }, { status: 'called', at: now }, { status: 'verification', at: now }],
  },
  {
    id: 'b3', tokenNo: 51, farmerId: 'f3', farmerName: 'Mahesh Patel', farmerPhone: '9876598765',
    centerId: 'ct2', centerName: 'Mandi Samiti - Old Town', slotId: 's5', slotLabel: '07:00 - 09:00',
    date: dateOffset(0), cropType: 'mustard', cropName: 'Mustard', quantityQuintal: 8,
    status: 'waiting', queuePosition: 5, totalInQueue: 18, estimatedWaitMin: 75,
    joinedAt: now, createdAt: now,
    history: [{ status: 'token_generated', at: now }, { status: 'waiting', at: now }],
  },
  {
    id: 'b4', tokenNo: 47, farmerId: 'f4', farmerName: 'Dinesh Yadav', farmerPhone: '9876511223',
    centerId: 'ct2', centerName: 'Mandi Samiti - Old Town', slotId: 's5', slotLabel: '07:00 - 09:00',
    date: dateOffset(0), cropType: 'maize', cropName: 'Maize', quantityQuintal: 12,
    status: 'weighing', queuePosition: 2, totalInQueue: 18, estimatedWaitMin: 20,
    joinedAt: now, createdAt: now,
    history: [{ status: 'token_generated', at: now }, { status: 'waiting', at: now }, { status: 'called', at: now }, { status: 'verification', at: now }, { status: 'weighing', at: now }],
  },
  {
    id: 'b5', tokenNo: 60, farmerId: 'f5', farmerName: 'Kamlesh Verma', farmerPhone: '9876544000',
    centerId: 'ct3', centerName: 'APMC Procurement Hub - Industrial Area', slotId: 's8', slotLabel: '08:00 - 10:00',
    date: dateOffset(0), cropType: 'soybean', cropName: 'Soybean', quantityQuintal: 25,
    status: 'waiting', queuePosition: 8, totalInQueue: 25, estimatedWaitMin: 120,
    joinedAt: now, createdAt: now,
    history: [{ status: 'token_generated', at: now }, { status: 'waiting', at: now }],
  },
  {
    id: 'b6', tokenNo: 55, farmerId: 'f6', farmerName: 'Anil Sharma', farmerPhone: '9876533000',
    centerId: 'ct3', centerName: 'APMC Procurement Hub - Industrial Area', slotId: 's8', slotLabel: '08:00 - 10:00',
    date: dateOffset(0), cropType: 'cotton', cropName: 'Cotton', quantityQuintal: 10,
    status: 'payment', queuePosition: 1, totalInQueue: 25, estimatedWaitMin: 10,
    joinedAt: now, createdAt: now,
    history: [{ status: 'token_generated', at: now }, { status: 'waiting', at: now }, { status: 'called', at: now }, { status: 'verification', at: now }, { status: 'weighing', at: now }, { status: 'payment', at: now }],
  },
  {
    id: 'b7', tokenNo: 30, farmerId: 'f7', farmerName: 'Pradeep Kumar', farmerPhone: '9876522000',
    centerId: 'ct1', centerName: 'Krishi Setu Center - Sector 12', slotId: 's3', slotLabel: '14:00 - 16:00',
    date: dateOffset(0), cropType: 'wheat', cropName: 'Wheat', quantityQuintal: 18,
    status: 'completed', queuePosition: 0, totalInQueue: 0, estimatedWaitMin: 0,
    joinedAt: now, createdAt: now,
    history: [{ status: 'token_generated', at: now }, { status: 'waiting', at: now }, { status: 'called', at: now }, { status: 'verification', at: now }, { status: 'weighing', at: now }, { status: 'payment', at: now }, { status: 'completed', at: now }],
  },
];

export const STATUS_ORDER: ProcurementStatus[] = [
  'token_generated', 'waiting', 'called', 'verification', 'weighing', 'payment', 'completed',
];

export const STATUS_LABEL_KEY: Record<ProcurementStatus, string> = {
  token_generated: 'st_token_generated',
  waiting: 'st_waiting',
  called: 'st_called',
  verification: 'st_verification',
  weighing: 'st_weighing',
  payment: 'st_payment',
  completed: 'st_completed',
  cancelled: 'st_cancelled',
};

export const STATUS_COLOR: Record<ProcurementStatus, string> = {
  token_generated: 'bg-brand-100 text-brand-700',
  waiting: 'bg-harvest-100 text-harvest-700',
  called: 'bg-blue-100 text-blue-700',
  verification: 'bg-purple-100 text-purple-700',
  weighing: 'bg-orange-100 text-orange-700',
  payment: 'bg-cyan-100 text-cyan-700',
  completed: 'bg-brand-600 text-white',
  cancelled: 'bg-red-100 text-red-700',
};

export const STATUS_DOT: Record<ProcurementStatus, string> = {
  token_generated: 'bg-brand-500',
  waiting: 'bg-harvest-500',
  called: 'bg-blue-500',
  verification: 'bg-purple-500',
  weighing: 'bg-orange-500',
  payment: 'bg-cyan-500',
  completed: 'bg-brand-600',
  cancelled: 'bg-red-500',
};

// 7-day procurement trend (mock)
export const TREND_7D: { day: string; count: number }[] = [
  { day: 'Mon', count: 145 },
  { day: 'Tue', count: 168 },
  { day: 'Wed', count: 132 },
  { day: 'Thu', count: 190 },
  { day: 'Fri', count: 210 },
  { day: 'Sat', count: 178 },
  { day: 'Sun', count: 95 },
];

export const CROP_DIST: { type: string; count: number; color: string }[] = [
  { type: 'Wheat', count: 420, color: '#eab308' },
  { type: 'Rice', count: 380, color: '#22c55e' },
  { type: 'Mustard', count: 145, color: '#f59e0b' },
  { type: 'Maize', count: 98, color: '#84cc16' },
  { type: 'Soybean', count: 76, color: '#06b6d4' },
  { type: 'Cotton', count: 54, color: '#a855f7' },
];
