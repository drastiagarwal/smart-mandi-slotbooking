import { useApp } from '@/context';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts } = useApp();
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
      {toasts.map((toast) => {
        const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? AlertCircle : Info;
        const color = toast.type === 'success' ? 'text-brand-600' : toast.type === 'error' ? 'text-red-600' : 'text-blue-600';
        return (
          <div
            key={toast.id}
            className="card px-4 py-3 flex items-center gap-3 animate-slide-up shadow-lg pointer-events-auto"
          >
            <Icon size={20} className={color} />
            <span className="text-sm font-medium text-earth-800 flex-1">{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
