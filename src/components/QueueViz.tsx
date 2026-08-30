import type { Booking } from '@/types';
import { STATUS_DOT, STATUS_LABEL_KEY } from '@/data';
import { useApp } from '@/context';
import { Users } from 'lucide-react';

interface QueueVizProps {
  bookings: Booking[];
  centerName?: string;
}

export function QueueViz({ bookings }: QueueVizProps) {
  const { t, lang } = useApp();
  const waiting = bookings.filter((b) => b.status === 'waiting').sort((a, b) => a.queuePosition - b.queuePosition);
  const inProcess = bookings.filter((b) => ['called', 'verification', 'weighing', 'payment'].includes(b.status));
  const completed = bookings.filter((b) => b.status === 'completed').length;

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-harvest-50 rounded-xl p-3 text-center">
          <div className="text-2xl font-display font-bold text-harvest-700">{waiting.length}</div>
          <div className="text-[11px] font-semibold text-harvest-600 uppercase">{t('waiting')}</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <div className="text-2xl font-display font-bold text-blue-700">{inProcess.length}</div>
          <div className="text-[11px] font-semibold text-blue-600 uppercase">In Process</div>
        </div>
        <div className="bg-brand-50 rounded-xl p-3 text-center">
          <div className="text-2xl font-display font-bold text-brand-700">{completed}</div>
          <div className="text-[11px] font-semibold text-brand-600 uppercase">{t('done')}</div>
        </div>
      </div>

      {/* Queue line visualization */}
      {waiting.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-earth-500" />
              <span className="text-sm font-semibold text-earth-700">{t('liveQueue')}</span>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-brand-600">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              LIVE
            </span>
          </div>
          <div className="relative overflow-x-auto no-scrollbar pb-2">
            <div className="flex items-center gap-2 min-w-min">
              {/* Counter */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center text-xs font-bold shadow-soft relative">
                  {t('open')}
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-harvest-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-harvest-500"></span>
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-brand-600">Counter</span>
              </div>
              {/* Animated connector */}
              <div className="h-1 bg-earth-200 rounded-full flex-1 min-w-[20px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-400 via-brand-300 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
              </div>
              {/* People */}
              {waiting.map((b, i) => (
                <div key={b.id} className="flex items-center gap-2 shrink-0">
                  <div className="flex flex-col items-center gap-1 animate-scale-in" style={{ animationDelay: `${i * 50}ms` }}>
                    <div className={`w-10 h-10 rounded-full ${b.queuePosition <= 2 ? 'bg-harvest-100 ring-2 ring-harvest-400' : 'bg-earth-100'} flex items-center justify-center text-sm font-bold text-earth-700 relative`}>
                      {b.tokenNo}
                      {b.queuePosition <= 2 && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-harvest-500 rounded-full animate-bounce-soft" />
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-earth-500">#{b.tokenNo}</span>
                  </div>
                  {i < waiting.length - 1 && <div className="h-1 bg-earth-200 rounded-full w-4" />}
                </div>
              ))}
            </div>
          </div>
          {/* Queue progress bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-earth-500 mb-1">
              <span>Queue Progress</span>
              <span className="font-bold text-brand-600">{completed > 0 ? Math.round((completed / (completed + waiting.length)) * 100) : 0}%</span>
            </div>
            <div className="h-2 bg-earth-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all duration-700"
                style={{ width: `${completed > 0 ? Math.round((completed / (completed + waiting.length)) * 100) : 0}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-earth-400 text-sm font-medium">{t('queueEmpty')}</div>
      )}

      {/* In process list */}
      {inProcess.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-semibold text-earth-700">In Process</div>
          {inProcess.map((b) => (
            <div key={b.id} className="flex items-center gap-3 bg-earth-50 rounded-xl p-3">
              <div className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[b.status]} animate-pulse shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-earth-800 truncate">{b.farmerName}</div>
                <div className="text-xs text-earth-500">{t(STATUS_LABEL_KEY[b.status])}</div>
              </div>
              <div className="text-sm font-bold text-earth-700 tabular-nums">#{b.tokenNo}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
