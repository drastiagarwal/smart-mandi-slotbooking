import { useApp } from '@/context';
import { StatusTimeline } from '@/components/Timeline';
import { QueueViz } from '@/components/QueueViz';
import { CropIcon } from '@/components/CropIcon';
import { QRCode } from '@/components/QRCode';
import { CROPS, STATUS_COLOR, STATUS_LABEL_KEY } from '@/data';
import { Hash, Clock, MapPin, ArrowLeft, ArrowRight, X, Bell, QrCode } from 'lucide-react';


interface TokenProps {
  bookingId: string | null;
  onBack: () => void;
  onBookAnother: () => void;
}

export function Token({ bookingId, onBack, onBookAnother }: TokenProps) {
  const { t, lang, bookings, cancelBooking, notifications } = useApp();

  // Get the most recent booking for this farmer (or the specified one)
  const myBookings = bookings.filter((b) => b.farmerPhone && b.status !== 'cancelled');
  const booking = bookingId ? bookings.find((b) => b.id === bookingId) : myBookings[0];

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={onBack} className="btn-ghost mb-4 -ml-2">
          <ArrowLeft size={18} /> {t('back')}
        </button>
        <div className="card p-10 text-center">
          <Hash size={40} className="mx-auto text-earth-300 mb-3" />
          <p className="text-earth-500 font-medium">{t('noBookings')}</p>
          <button onClick={onBookAnother} className="btn-primary mt-4">
            {t('startBooking')} <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  const crop = CROPS.find((c) => c.type === booking.cropType);
  const estimatedPayment = booking.quantityQuintal * (crop?.msp ?? 0);
  const centerBookings = bookings.filter((b) => b.centerId === booking.centerId && b.status !== 'cancelled' && b.status !== 'completed');
  const relatedNotifs = notifications.filter((n) => n.bookingId === booking.id);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <button onClick={onBack} className="btn-ghost mb-4 -ml-2">
        <ArrowLeft size={18} /> {t('back')}
      </button>

      {/* Token card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-white p-6 shadow-card">
        <div className="absolute top-0 right-0 w-40 h-40 bg-harvest-400/20 rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="badge bg-white/20 text-white">{t('bookingConfirmed')}</span>
            <span className={`badge ${booking.status === 'waiting' ? 'bg-harvest-400 text-harvest-900' : 'bg-white/20 text-white'}`}>
              {t(STATUS_LABEL_KEY[booking.status])}
            </span>
          </div>
          <div className="mt-4 text-center">
            <div className="text-sm text-white/70 font-semibold uppercase tracking-wide">{t('yourToken')}</div>
            <div className="text-6xl font-display font-bold mt-1 tabular-nums">{booking.tokenNo}</div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-white/80">
            <MapPin size={14} /> {lang === 'hi' ? '' : booking.centerName}
          </div>
        </div>
        {/* Ticket tear */}
        <div className="absolute left-0 right-0 bottom-0 h-6 flex items-center">
          <div className="w-3 h-3 bg-earth-50 rounded-full -ml-1.5" />
          <div className="flex-1 border-t-2 border-dashed border-white/30" />
          <div className="w-3 h-3 bg-earth-50 rounded-full -mr-1.5" />
        </div>
      </div>

      {/* QR Code section */}
      <div className="card p-5 mt-4 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-3">
          <QrCode size={18} className="text-brand-600" />
          <h3 className="font-display font-bold text-earth-900">{t('scanToVerify')}</h3>
        </div>
        <div className="p-3 bg-white rounded-xl border-2 border-earth-100">
          <QRCode value={`KS|${booking.tokenNo}|${booking.centerId}|${booking.cropType}|${booking.quantityQuintal}`} size={140} />
        </div>
        <p className="text-xs text-earth-400 mt-2 text-center">Token #{booking.tokenNo} · {booking.centerName}</p>
      </div>

      {/* Live queue stats */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="card p-4 text-center">
          <div className="text-3xl font-display font-bold text-brand-700 tabular-nums">
            {booking.status === 'waiting' ? booking.queuePosition : 0}
          </div>
          <div className="text-xs font-semibold text-earth-500 mt-0.5">{t('queuePosition')}</div>
          {booking.status === 'waiting' && (
            <div className="text-[11px] text-earth-400">{booking.queuePosition} {t('peopleAhead')}</div>
          )}
        </div>
        <div className="card p-4 text-center">
          <div className="text-3xl font-display font-bold text-harvest-600 tabular-nums flex items-center justify-center gap-1">
            <Clock size={20} />
            {booking.estimatedWaitMin}
          </div>
          <div className="text-xs font-semibold text-earth-500 mt-0.5">{t('estimatedWait')}</div>
          <div className="text-[11px] text-earth-400">{t('minutes')}</div>
        </div>
      </div>

      {/* Booking details */}
      <div className="card p-5 mt-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-earth-400 text-xs font-semibold uppercase">{t('crop')}</div>
            <div className="font-bold text-earth-900 flex items-center gap-1.5 mt-0.5">
              {crop && <CropIcon name={crop.icon} size={16} className="text-brand-600" />}
              {lang === 'hi' ? crop?.nameHi : crop?.nameEn}
            </div>
          </div>
          <div>
            <div className="text-earth-400 text-xs font-semibold uppercase">{t('qty')}</div>
            <div className="font-bold text-earth-900 mt-0.5">{booking.quantityQuintal} Quintal</div>
          </div>
          <div>
            <div className="text-earth-400 text-xs font-semibold uppercase">{t('slot')}</div>
            <div className="font-bold text-earth-900 mt-0.5">{booking.slotLabel}</div>
          </div>
          <div>
            <div className="text-earth-400 text-xs font-semibold uppercase">{t('estimatedPayment')}</div>
            <div className="font-bold text-harvest-700 mt-0.5">₹{estimatedPayment.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* Status timeline */}
      <div className="card p-5 mt-4">
        <h3 className="font-display font-bold text-earth-900 mb-4">{t('statusTimeline')}</h3>
        <StatusTimeline currentStatus={booking.status} history={booking.history} />
      </div>

      {/* Live queue visualization */}
      <div className="card p-5 mt-4">
        <h3 className="font-display font-bold text-earth-900 mb-4">{t('liveQueueViz')}</h3>
        <QueueViz bookings={centerBookings} />
      </div>

      {/* Notifications for this booking */}
      {relatedNotifs.length > 0 && (
        <div className="card p-5 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Bell size={16} className="text-brand-600" />
            <h3 className="font-display font-bold text-earth-900">{t('notifications')}</h3>
          </div>
          <div className="space-y-2">
            {relatedNotifs.slice(0, 4).map((n) => (
              <div key={n.id} className="flex items-start gap-2.5 bg-earth-50 rounded-lg p-3">
                <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-earth-800">{lang === 'hi' ? n.titleHi : n.title}</div>
                  <div className="text-xs text-earth-500 mt-0.5">{lang === 'hi' ? n.bodyHi : n.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-5">
        <button onClick={onBookAnother} className="btn-secondary flex-1">
          {t('bookAnother')}
        </button>
        {booking.status === 'waiting' && (
          <button
            onClick={() => { if (confirm(t('cancelConfirm'))) { cancelBooking(booking.id); onBack(); } }}
            className="btn bg-red-50 text-red-600 border border-red-200 px-5 py-3 hover:bg-red-100 font-semibold rounded-xl flex items-center gap-2"
          >
            <X size={18} /> {t('cancelBooking')}
          </button>
        )}
      </div>
    </div>
  );
}
