import { Sprout } from 'lucide-react';
import { useApp } from '@/context';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const { t } = useApp();
  const sizes = {
    sm: { box: 'w-8 h-8', icon: 18, text: 'text-base', sub: 'text-[10px]' },
    md: { box: 'w-10 h-10', icon: 22, text: 'text-lg', sub: 'text-[11px]' },
    lg: { box: 'w-14 h-14', icon: 30, text: 'text-2xl', sub: 'text-xs' },
  };
  const s = sizes[size];
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${s.box} rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-soft shrink-0`}>
        <Sprout size={s.icon} className="text-white" strokeWidth={2.5} />
      </div>
      <div className="leading-none">
        <div className={`${s.text} font-display font-bold text-earth-900`}>{t('appName')}</div>
        <div className={`${s.sub} text-earth-500 font-medium`}>{t('appTagline')}</div>
      </div>
    </div>
  );
}
