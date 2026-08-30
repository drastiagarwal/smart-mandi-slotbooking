import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from 'react';
import type { Lang, Role, Center, Slot, Booking, AppNotification, ProcurementStatus, CropType } from '@/types';
import { makeT, type TFunc } from '@/i18n';
import {
  CENTERS, SLOTS, INITIAL_BOOKINGS, CROPS, STATUS_ORDER,
} from '@/data';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppState {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TFunc;

  role: Role | null;
  setRole: (r: Role | null) => void;

  centers: Center[];
  slots: Slot[];
  bookings: Booking[];
  notifications: AppNotification[];

  // farmer flow state
  farmerDraft: FarmerDraft;
  setFarmerDraft: (d: Partial<FarmerDraft>) => void;
  resetFarmerDraft: () => void;

  // actions
  createBooking: (input: CreateBookingInput) => Booking;
  cancelBooking: (id: string) => void;
  advanceStatus: (bookingId: string) => void;
  removeBooking: (id: string) => void;
  addCenter: (c: Omit<Center, 'id' | 'distanceKm' | 'lat' | 'lng'>) => void;
  updateCenter: (id: string, patch: Partial<Center>) => void;
  deleteCenter: (id: string) => void;
  addSlot: (s: Omit<Slot, 'id' | 'booked'>) => void;
  markNotificationsRead: () => void;

  toasts: Toast[];
  pushToast: (message: string, type?: Toast['type']) => void;
}

export interface FarmerDraft {
  name: string;
  phone: string;
  village: string;
  district: string;
  cropType: CropType | '';
  quantity: string;
}

const EMPTY_DRAFT: FarmerDraft = {
  name: '', phone: '', village: '', district: '', cropType: '', quantity: '',
};

interface CreateBookingInput {
  farmerName: string;
  farmerPhone: string;
  farmerVillage: string;
  farmerDistrict: string;
  centerId: string;
  slotId: string;
  cropType: CropType;
  quantityQuintal: number;
}

const AppContext = createContext<AppState | null>(null);

let idCounter = 100;
const genId = (prefix: string) => `${prefix}${idCounter++}`;

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const [role, setRole] = useState<Role | null>(null);
  const [centers, setCenters] = useState<Center[]>(CENTERS);
  const [slots, setSlots] = useState<Slot[]>(SLOTS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'n1', bookingId: 'b1',
      title: 'Token Generated', titleHi: 'टोकन जारी',
      body: 'Your token #42 has been generated for Krishi Setu Center.', bodyHi: 'आपका टोकन #42 जारी हो गया है।',
      at: new Date().toISOString(), read: false,
    },
    {
      id: 'n2', bookingId: 'b1',
      title: 'Queue Update', titleHi: 'कतार अपडेट',
      body: 'You are at position 3 in the queue.', bodyHi: 'आप कतार में स्थिति 3 पर हैं।',
      at: new Date().toISOString(), read: false,
    },
  ]);
  const [farmerDraft, setFarmerDraftState] = useState<FarmerDraft>(EMPTY_DRAFT);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const t = makeT(lang);

  const pushToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = genId('toast');
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 3000);
  }, []);

  const setFarmerDraft = useCallback((d: Partial<FarmerDraft>) => {
    setFarmerDraftState((prev) => ({ ...prev, ...d }));
  }, []);
  const resetFarmerDraft = useCallback(() => setFarmerDraftState(EMPTY_DRAFT), []);

  const addNotification = useCallback((n: Omit<AppNotification, 'id' | 'at' | 'read'>) => {
    setNotifications((prev) => [
      { ...n, id: genId('n'), at: new Date().toISOString(), read: false },
      ...prev,
    ]);
  }, []);

  const createBooking = useCallback((input: CreateBookingInput): Booking => {
    const center = centers.find((c) => c.id === input.centerId)!;
    const slot = slots.find((s) => s.id === input.slotId)!;
    const crop = CROPS.find((c) => c.type === input.cropType)!;
    const nowIso = new Date().toISOString();

    // count existing bookings for this center+slot to determine token & queue
    const sameSlot = bookings.filter((b) => b.slotId === input.slotId && b.status !== 'cancelled' && b.status !== 'completed');
    const tokenNo = sameSlot.length > 0 ? Math.max(...sameSlot.map((b) => b.tokenNo)) + 1 : Math.floor(Math.random() * 50) + 1;
    const queuePosition = sameSlot.filter((b) => b.status === 'waiting').length + 1;
    const totalInQueue = queuePosition;
    const estimatedWaitMin = queuePosition * 12 + Math.floor(Math.random() * 10);

    const booking: Booking = {
      id: genId('b'),
      tokenNo,
      farmerId: genId('f'),
      farmerName: input.farmerName,
      farmerPhone: input.farmerPhone,
      centerId: input.centerId,
      centerName: center.name,
      slotId: input.slotId,
      slotLabel: `${slot.startTime} - ${slot.endTime}`,
      date: slot.date,
      cropType: input.cropType,
      cropName: crop.nameEn,
      quantityQuintal: input.quantityQuintal,
      status: 'waiting',
      queuePosition,
      totalInQueue,
      estimatedWaitMin,
      joinedAt: nowIso,
      createdAt: nowIso,
      history: [{ status: 'token_generated', at: nowIso }, { status: 'waiting', at: nowIso }],
    };

    setBookings((prev) => [booking, ...prev]);
    setSlots((prev) => prev.map((s) => (s.id === input.slotId ? { ...s, booked: s.booked + 1 } : s)));
    addNotification({
      bookingId: booking.id,
      title: 'Token Generated', titleHi: 'टोकन जारी',
      body: `Your token #${tokenNo} has been generated for ${center.name}.`,
      bodyHi: `आपका टोकन #${tokenNo} ${center.nameHi} के लिए जारी हो गया है।`,
    });
    return booking;
  }, [centers, slots, bookings, addNotification]);

  const cancelBooking = useCallback((id: string) => {
    setBookings((prev) => prev.map((b) => {
      if (b.id !== id) return b;
      return { ...b, status: 'cancelled' as ProcurementStatus, history: [...b.history, { status: 'cancelled' as ProcurementStatus, at: new Date().toISOString() }] };
    }));
    pushToast(t('bookingCancelled'), 'info');
  }, [pushToast, t]);

  const advanceStatus = useCallback((bookingId: string) => {
    setBookings((prev) => prev.map((b) => {
      if (b.id !== bookingId) return b;
      const idx = STATUS_ORDER.indexOf(b.status);
      if (idx < 0 || idx >= STATUS_ORDER.length - 1) return b;
      const next = STATUS_ORDER[idx + 1];
      const nowIso = new Date().toISOString();
      let queuePosition = b.queuePosition;
      if (b.status === 'waiting' && next === 'called') queuePosition = 0;
      return { ...b, status: next, queuePosition, history: [...b.history, { status: next, at: nowIso }] };
    }));
    pushToast(t('statusUpdated'), 'success');
  }, [pushToast, t]);

  const removeBooking = useCallback((id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    pushToast(t('farmerRemoved'), 'info');
  }, [pushToast, t]);

  const addCenter = useCallback((c: Omit<Center, 'id' | 'distanceKm' | 'lat' | 'lng'>) => {
    const newCenter: Center = { ...c, id: genId('ct'), distanceKm: Math.round(Math.random() * 20 * 10) / 10, lat: 29.7, lng: 77.0 };
    setCenters((prev) => [...prev, newCenter]);
    pushToast(t('centerAdded'), 'success');
  }, [pushToast, t]);

  const updateCenter = useCallback((id: string, patch: Partial<Center>) => {
    setCenters((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    pushToast(t('centerUpdated'), 'success');
  }, [pushToast, t]);

  const deleteCenter = useCallback((id: string) => {
    setCenters((prev) => prev.filter((c) => c.id !== id));
    setSlots((prev) => prev.filter((s) => s.centerId !== id));
  }, []);

  const addSlot = useCallback((s: Omit<Slot, 'id' | 'booked'>) => {
    setSlots((prev) => [...prev, { ...s, id: genId('s'), booked: 0 }]);
    pushToast(t('slotBooked'), 'success');
  }, [pushToast, t]);

  const markNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // Live queue simulation: every 8s, decrement waiting times and occasionally advance a booking
  const tickRef = useRef(0);
  useEffect(() => {
    if (role !== 'farmer' && role !== 'admin') return;
    const interval = setInterval(() => {
      tickRef.current++;
      setBookings((prev) => {
        let changed = false;
        const updated = prev.map((b) => {
          if (b.status === 'waiting' && b.estimatedWaitMin > 0) {
            changed = true;
            return { ...b, estimatedWaitMin: Math.max(0, b.estimatedWaitMin - 2), queuePosition: Math.max(1, b.queuePosition) };
          }
          return b;
        });
        return changed ? updated : prev;
      });
      // every 3rd tick, advance one random waiting booking to "called"
      if (tickRef.current % 3 === 0) {
        setBookings((prev) => {
          const waiting = prev.filter((b) => b.status === 'waiting');
          if (waiting.length === 0) return prev;
          const target = waiting[Math.floor(Math.random() * waiting.length)];
          const nowIso = new Date().toISOString();
          return prev.map((b) => {
            if (b.id !== target.id) {
              // shift others up in queue position
              if (b.status === 'waiting' && b.queuePosition > target.queuePosition) {
                return { ...b, queuePosition: b.queuePosition - 1, estimatedWaitMin: Math.max(0, b.estimatedWaitMin - 12) };
              }
              return b;
            }
            return { ...b, status: 'called' as ProcurementStatus, queuePosition: 0, history: [...b.history, { status: 'called' as ProcurementStatus, at: nowIso }] };
          });
        });
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [role]);

  const value: AppState = {
    lang, setLang, t,
    role, setRole,
    centers, slots, bookings, notifications,
    farmerDraft, setFarmerDraft, resetFarmerDraft,
    createBooking, cancelBooking, advanceStatus, removeBooking,
    addCenter, updateCenter, deleteCenter, addSlot,
    markNotificationsRead,
    toasts, pushToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
