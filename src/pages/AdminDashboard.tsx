import { useApp } from '@/context';
import { StatCard, SectionHeader } from '@/components/StatCard';
import { BarChart, DonutChart, ProgressRing, LineChart } from '@/components/Charts';
import { QueueViz } from '@/components/QueueViz';
import { CROP_DIST, TREND_7D } from '@/data';
import { Users, Clock, CheckCircle2, TrendingUp, Activity, Building2, ArrowRight } from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { t, bookings, centers } = useApp();

  const waiting = bookings.filter((b) => b.status === 'waiting');
  const completed = bookings.filter((b) => b.status === 'completed');
  const totalFarmers = new Set(bookings.map((b) => b.farmerPhone)).size;
  const avgWait = waiting.length > 0
    ? Math.round(waiting.reduce((s, b) => s + b.estimatedWaitMin, 0) / waiting.length)
    : 0;
  const predictedCrowd = Math.round(waiting.length * 1.4 + 15);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-earth-900">{t('adminDashboard')}</h1>
        <p className="text-sm text-earth-500 mt-1">{t('analyticsSub')}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard icon={Users} label={t('totalFarmers')} value={totalFarmers} color="brand" trend={{ value: '12%', up: true }} />
        <StatCard icon={Clock} label={t('currentWaiting')} value={waiting.length} color="harvest" trend={{ value: '8%', up: false }} />
        <StatCard icon={CheckCircle2} label={t('completedProcurements')} value={completed.length} color="blue" trend={{ value: '23%', up: true }} />
        <StatCard icon={Activity} label={t('avgWaitTime')} value={`${avgWait}m`} color="purple" trend={{ value: '15%', up: false }} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {/* Predicted crowd */}
        <div className="card p-5 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} className="text-harvest-600" />
            <span className="text-sm font-semibold text-earth-600">{t('predictedCrowd')}</span>
          </div>
          <ProgressRing value={predictedCrowd} max={predictedCrowd + 20} size={140} color="#eab308" label={`${predictedCrowd}`} sublabel={t('predictedNext')} />
          <p className="text-xs text-earth-400 mt-3">{t('basedOnTrends')}</p>
        </div>

        {/* Procurement trend */}
        <div className="card p-5 lg:col-span-2">
          <SectionHeader title={t('procurementTrend')} />
          <LineChart data={TREND_7D.map((d) => ({ label: d.day, value: d.count }))} height={160} color="#16a34a" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        {/* Crop distribution */}
        <div className="card p-5">
          <SectionHeader title={t('cropDistribution')} />
          <DonutChart data={CROP_DIST.map((c) => ({ label: c.type, value: c.count, color: c.color }))} size={150} />
        </div>

        {/* Center performance */}
        <div className="card p-5">
          <SectionHeader title={t('centerPerformance')} />
          <BarChart
            data={centers.slice(0, 5).map((c) => ({ label: c.name.split(' - ')[0].slice(0, 8), value: c.capacityPerDay }))}
            height={160}
            highlightMax
          />
        </div>
      </div>

      {/* Live queue overview */}
      <div className="card p-5 mb-6">
        <SectionHeader
          title={t('liveQueueViz')}
          subtitle={t('liveQueueSub')}
          action={<button onClick={() => onNavigate('farmers')} className="btn-ghost text-sm text-brand-600">{t('viewDetails')} <ArrowRight size={16} /></button>}
        />
        <QueueViz bookings={bookings.filter((b) => b.status !== 'cancelled' && b.status !== 'completed')} />
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-3">
        <button onClick={() => onNavigate('centers')} className="card p-4 flex items-center gap-3 hover:shadow-lg transition text-left">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center"><Building2 size={20} /></div>
          <div>
            <div className="font-bold text-earth-900 text-sm">{t('manageCenters')}</div>
            <div className="text-xs text-earth-500">{centers.length} {t('centers')}</div>
          </div>
        </button>
        <button onClick={() => onNavigate('slots')} className="card p-4 flex items-center gap-3 hover:shadow-lg transition text-left">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Clock size={20} /></div>
          <div>
            <div className="font-bold text-earth-900 text-sm">{t('manageSlots')}</div>
            <div className="text-xs text-earth-500">{t('utilization')}</div>
          </div>
        </button>
        <button onClick={() => onNavigate('farmers')} className="card p-4 flex items-center gap-3 hover:shadow-lg transition text-left">
          <div className="w-10 h-10 rounded-xl bg-harvest-50 text-harvest-600 flex items-center justify-center"><Users size={20} /></div>
          <div>
            <div className="font-bold text-earth-900 text-sm">{t('manageFarmers')}</div>
            <div className="text-xs text-earth-500">{waiting.length} {t('currentWaiting')}</div>
          </div>
        </button>
      </div>
    </div>
  );
}
