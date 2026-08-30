import { useApp } from '@/context';
import { CropIcon } from '@/components/CropIcon';
import { CROPS, STATUS_COLOR, STATUS_LABEL_KEY } from '@/data';
import { Tractor, MapPin, Hash, ArrowRight, Bell, Clock, Sprout } from 'lucide-react';

interface FarmerHomeProps {
  onNavigate: (page: string) => void;
}

export function FarmerHome({ onNavigate }: FarmerHomeProps) {
  const { t, lang, bookings, notifications } = useApp();
  const myBookings = bookings.filter((b) => b.status !== 'cancelled' && b.status !== 'completed').slice(0, 2);
  const unread = notifications.filter((n) => !n.read).length;

  const quickActions = [
    { icon: Tractor, labelKey: 'register', descKey: 'registerSub', page: 'register', color: 'bg-brand-50 text-brand-600' },
    { icon: MapPin, labelKey: 'findCenter', descKey: 'findCentersSub', page: 'centers', color: 'bg-blue-50 text-blue-600' },
    { icon: Hash, labelKey: 'myToken', descKey: 'trackQueue', page: 'token', color: 'bg-harvest-50 text-harvest-600' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-white p-6 mb-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-harvest-400/20 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-white/80 text-sm font-semibold">
            <Sprout size={16} /> {t('appName')}
          </div>
          <h1 className="text-2xl font-display font-bold mt-2">{t('welcome')}, Farmer!</h1>
          <p className="text-sm text-white/70 mt-1">{t('welcomeSub')}</p>
          <button
            onClick={() => onNavigate('register')}
            className="mt-4 inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-4 py-2.5 rounded-xl hover:bg-brand-50 transition"
          >
            {t('startBooking')} <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {quickActions.map((a, i) => (
          <button
            key={i}
            onClick={() => onNavigate(a.page)}
            className="card p-4 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all group"
          >
            <div className={`w-12 h-12 rounded-xl ${a.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <a.icon size={24} />
            </div>
            <h3 className="font-display font-bold text-earth-900">{t(a.labelKey)}</h3>
            <p className="text-xs text-earth-500 mt-0.5 line-clamp-2">{t(a.descKey)}</p>
          </button>
        ))}
      </div>

      {/* Active bookings */}
      {myBookings.length > 0 && (
        <div className="mb-6">
          <h2 className="font-display font-bold text-earth-900 mb-3">{t('myToken')}</h2>
          <div className="space-y-3">
            {myBookings.map((b) => {
              const crop = CROPS.find((c) => c.type === b.cropType);
              return (
                <button
                  key={b.id}
                  onClick={() => onNavigate('token')}
                  className="card w-full p-4 text-left hover:shadow-lg transition"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center">
                        <span className="text-lg font-display font-bold text-brand-700">#{b.tokenNo}</span>
                      </div>
                      <div>
                        <div className="font-bold text-earth-900">{b.centerName}</div>
                        <div className="text-xs text-earth-500 flex items-center gap-1.5 mt-0.5">
                          {crop && <CropIcon name={crop.icon} size={12} className="text-brand-600" />}
                          {lang === 'hi' ? crop?.nameHi : crop?.nameEn} · {b.quantityQuintal}q
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`badge ${STATUS_COLOR[b.status]}`}>{t(STATUS_LABEL_KEY[b.status])}</span>
                      {b.status === 'waiting' && (
                        <div className="text-xs text-earth-500 mt-1 flex items-center gap-1 justify-end">
                          <Clock size={12} /> {b.estimatedWaitMin} {t('minutes')}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent notifications */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-earth-900">{t('notifications')}</h2>
          {unread > 0 && <span className="badge bg-harvest-100 text-harvest-700">{unread} new</span>}
        </div>
        <div className="space-y-2">
          {notifications.slice(0, 3).map((n) => (
            <div key={n.id} className="card p-3 flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-earth-300' : 'bg-brand-500'}`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-earth-800">{lang === 'hi' ? n.titleHi : n.title}</div>
                <div className="text-xs text-earth-500 mt-0.5 line-clamp-1">{lang === 'hi' ? n.bodyHi : n.body}</div>
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="card p-6 text-center text-earth-400 text-sm">{t('noNotifications')}</div>
          )}
        </div>
      </div>
    </div>
  );
}
