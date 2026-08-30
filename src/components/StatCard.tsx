import type { LucideIcon } from 'lucide-react';
import { type ReactNode } from 'react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sublabel?: string;
  color?: 'brand' | 'harvest' | 'blue' | 'orange' | 'purple' | 'cyan';
  trend?: { value: string; up: boolean };
}

const colorMap = {
  brand: { bg: 'bg-brand-50', icon: 'text-brand-600', ring: 'ring-brand-100' },
  harvest: { bg: 'bg-harvest-50', icon: 'text-harvest-600', ring: 'ring-harvest-100' },
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', ring: 'ring-blue-100' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600', ring: 'ring-orange-100' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', ring: 'ring-purple-100' },
  cyan: { bg: 'bg-cyan-50', icon: 'text-cyan-600', ring: 'ring-cyan-100' },
};

export function StatCard({ icon: Icon, label, value, sublabel, color = 'brand', trend }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center ring-4 ${c.ring} shrink-0`}>
          <Icon size={22} className={c.icon} />
        </div>
        {trend && (
          <span className={`text-xs font-bold ${trend.up ? 'text-brand-600' : 'text-red-500'}`}>
            {trend.up ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-display font-bold text-earth-900 tabular-nums">{value}</div>
        <div className="text-sm font-semibold text-earth-500 mt-0.5">{label}</div>
        {sublabel && <div className="text-xs text-earth-400 mt-0.5">{sublabel}</div>}
      </div>
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div>
        <h2 className="text-lg sm:text-xl font-display font-bold text-earth-900">{title}</h2>
        {subtitle && <p className="text-sm text-earth-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
