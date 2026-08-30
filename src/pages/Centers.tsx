import { useApp } from '@/context';
import { CROPS } from '@/data';
import { CropIcon } from '@/components/CropIcon';
import { MapPin, Clock, Navigation, Check, ArrowLeft, ArrowRight, Calendar, Users } from 'lucide-react';
import { useState } from 'react';

interface CentersProps {
  onBack: () => void;
  onBooked: (bookingId: string) => void;
}

function dateLabel(date: string, t: (k: string) => string): string {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  if (date === today) return t('today');
  if (date === tomorrow) return t('tomorrow');
  return t('dayAfter');
}

export function Centers({ onBack, onBooked }: CentersProps) {
  const { t, lang, centers, slots, farmerDraft, createBooking, pushToast } = useApp();
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const activeCenters = centers.filter((c) => c.active).sort((a, b) => a.distanceKm - b.distanceKm);
  const crop = CROPS.find((c) => c.type === farmerDraft.cropType);
  const centerSlots = selectedCenter ? slots.filter((s) => s.centerId === selectedCenter) : [];

  const handleConfirm = () => {
    if (!selectedCenter || !selectedSlot || !crop) return;
    const booking = createBooking({
      farmerName: farmerDraft.name,
      farmerPhone: farmerDraft.phone,
      farmerVillage: farmerDraft.village,
      farmerDistrict: farmerDraft.district,
      centerId: selectedCenter,
      slotId: selectedSlot,
      cropType: crop.type,
      quantityQuintal: Number(farmerDraft.quantity),
    });
    pushToast(t('slotBooked'), 'success');
    onBooked(booking.id);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <button onClick={onBack} className="btn-ghost mb-4 -ml-2">
        <ArrowLeft size={18} /> {t('back')}
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-earth-900">{t('findCenters')}</h1>
        <p className="text-sm text-earth-500 mt-1">{t('findCentersSub')}</p>
      </div>

      {/* Crop summary chip */}
      {crop && (
        <div className="card p-3 mb-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center">
            <CropIcon name={crop.icon} size={20} className="text-brand-600" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-earth-900">{lang === 'hi' ? crop.nameHi : crop.nameEn}</div>
            <div className="text-xs text-earth-500">{farmerDraft.quantity} {t('quantity').split(' ')[0].toLowerCase()} · ₹{crop.msp}/q</div>
          </div>
        </div>
      )}

      {/* Centers list */}
      <div className="space-y-3">
        {activeCenters.map((c) => {
          const selected = selectedCenter === c.id;
          return (
            <button
              key={c.id}
              onClick={() => { setSelectedCenter(c.id); setSelectedSlot(null); }}
              className={`card w-full p-4 text-left transition-all ${selected ? 'ring-2 ring-brand-500 border-brand-300' : 'hover:shadow-lg'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-earth-900 text-base">{lang === 'hi' ? c.nameHi : c.name}</div>
                  <div className="flex items-center gap-1 text-sm text-earth-500 mt-1">
                    <MapPin size={14} /> {c.address}, {c.district}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="badge bg-brand-50 text-brand-700">
                      <Navigation size={12} /> {c.distanceKm} {t('km')}
                    </span>
                    <span className="badge bg-earth-50 text-earth-600">
                      <Users size={12} /> {c.capacityPerDay}/day
                    </span>
                    <span className="badge bg-blue-50 text-blue-600">
                      <Clock size={12} /> {c.openTime}-{c.closeTime}
                    </span>
                  </div>
                </div>
                {selected && (
                  <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0">
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Slots */}
      {selectedCenter && (
        <div className="mt-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={18} className="text-brand-600" />
            <h2 className="text-lg font-display font-bold text-earth-900">{t('selectSlot')}</h2>
          </div>
          <p className="text-sm text-earth-500 mb-4">{t('selectSlotSub')}</p>

          {centerSlots.length === 0 ? (
            <div className="card p-6 text-center text-earth-400 text-sm">{t('noData')}</div>
          ) : (
            <div className="space-y-3">
              {/* Group by date */}
              {[...new Set(centerSlots.map((s) => s.date))].map((date) => (
                <div key={date}>
                  <div className="text-xs font-bold text-earth-500 uppercase tracking-wide mb-2">{dateLabel(date, t)}</div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {centerSlots.filter((s) => s.date === date).map((s) => {
                      const avail = s.capacity - s.booked;
                      const full = avail <= 0;
                      const selected = selectedSlot === s.id;
                      return (
                        <button
                          key={s.id}
                          disabled={full}
                          onClick={() => setSelectedSlot(s.id)}
                          className={`rounded-xl border-2 p-3 text-left transition-all disabled:opacity-50 ${
                            selected ? 'border-brand-500 bg-brand-50' : 'border-earth-200 bg-white hover:border-brand-300'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-sm font-bold text-earth-900">
                            <Clock size={14} className="text-brand-600" />
                            {s.startTime} - {s.endTime}
                          </div>
                          <div className="mt-1.5 flex items-center justify-between">
                            {full ? (
                              <span className="badge bg-red-100 text-red-600">{t('full')}</span>
                            ) : (
                              <span className="badge bg-brand-50 text-brand-600">{avail} {t('available')}</span>
                            )}
                            <span className="text-xs text-earth-400">{s.booked}/{s.capacity}</span>
                          </div>
                          {/* Capacity bar */}
                          <div className="mt-2 h-1.5 bg-earth-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${full ? 'bg-red-400' : 'bg-brand-500'}`}
                              style={{ width: `${(s.booked / s.capacity) * 100}%` }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedSlot && (
        <button onClick={handleConfirm} className="btn-primary btn-lg w-full mt-6 animate-scale-in">
          {t('confirmBooking')} <ArrowRight size={20} />
        </button>
      )}
    </div>
  );
}
