import { useApp } from '@/context';
import { Bell, CheckCheck } from 'lucide-react';

export function Notifications({ onBack }: { onBack: () => void }) {
  const { t, lang, notifications, markNotificationsRead } = useApp();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Bell size={22} className="text-brand-600" />
          <h1 className="text-2xl font-display font-bold text-earth-900">{t('notifications')}</h1>
        </div>
        {notifications.some((n) => !n.read) && (
          <button onClick={markNotificationsRead} className="btn-ghost text-sm">
            <CheckCheck size={16} /> {t('markAllRead')}
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card p-10 text-center">
          <Bell size={36} className="mx-auto text-earth-300 mb-3" />
          <p className="text-earth-500 font-medium">{t('noNotifications')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div key={n.id} className={`card p-4 flex items-start gap-3 ${n.read ? 'opacity-60' : ''}`}>
              <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-earth-300' : 'bg-brand-500 animate-pulse'}`} />
              <div className="flex-1">
                <div className="font-bold text-earth-900">{lang === 'hi' ? n.titleHi : n.title}</div>
                <div className="text-sm text-earth-600 mt-0.5">{lang === 'hi' ? n.bodyHi : n.body}</div>
                <div className="text-xs text-earth-400 mt-1">
                  {new Date(n.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
