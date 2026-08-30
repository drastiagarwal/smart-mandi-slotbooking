import type { ProcurementStatus } from '@/types';
import { STATUS_ORDER, STATUS_LABEL_KEY, STATUS_COLOR, STATUS_DOT } from '@/data';
import { useApp } from '@/context';
import { Check, X } from 'lucide-react';

export function StatusTimeline({ currentStatus, history }: { currentStatus: ProcurementStatus; history: { status: ProcurementStatus; at: string }[] }) {
  const { t } = useApp();
  const cancelled = currentStatus === 'cancelled';
  const steps = cancelled
    ? STATUS_ORDER.slice(0, 2)
    : STATUS_ORDER.slice(0, STATUS_ORDER.indexOf('completed') + 1);

  const currentIndex = cancelled ? 1 : STATUS_ORDER.indexOf(currentStatus);

  return (
    <div className="flex flex-col gap-0">
      {steps.map((status, i) => {
        const isDone = !cancelled && i <= currentIndex;
        const isCurrent = !cancelled && i === currentIndex;
        const isCancelled = cancelled && status === 'waiting';
        const last = i === steps.length - 1;
        const histEntry = history.find((h) => h.status === status);

        return (
          <div key={status} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  isDone ? 'bg-brand-600 text-white' : isCancelled ? 'bg-red-100 text-red-600' : 'bg-earth-100 text-earth-400'
                } ${isCurrent ? 'ring-4 ring-brand-500/20 scale-110' : ''}`}
              >
                {isDone ? <Check size={18} /> : isCancelled ? <X size={18} /> : <span className="text-xs font-bold">{i + 1}</span>}
              </div>
              {!last && (
                <div className={`w-0.5 flex-1 min-h-[24px] mt-1 ${isDone ? 'bg-brand-500' : 'bg-earth-200'}`} />
              )}
            </div>
            <div className={`pt-1.5 ${last ? 'pb-0' : 'pb-4'}`}>
              <div className={`text-sm font-semibold ${isDone ? 'text-earth-900' : isCancelled ? 'text-red-600' : 'text-earth-500'}`}>
                {t(STATUS_LABEL_KEY[status])}
              </div>
              {histEntry && isDone && (
                <div className="text-xs text-earth-400 mt-0.5">
                  {new Date(histEntry.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
              {isCurrent && (
                <div className="mt-1">
                  <span className={`badge ${STATUS_COLOR[status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]} animate-pulse`} />
                    Active
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
