import { useApp } from '@/context';
import { StatCard, SectionHeader } from '@/components/StatCard';
import { BarChart, DonutChart, LineChart, ProgressRing } from '@/components/Charts';
import { CROP_DIST, TREND_7D } from '@/data';
import { Users, Clock, CheckCircle2, TrendingUp, Activity, MapPin, Calendar } from 'lucide-react';

export function AdminAnalytics() {
  const { t, bookings, centers, slots } = useApp();

  const waiting = bookings.filter((b) => b.status === 'waiting');
  const completed = bookings.filter((b) => b.status === 'completed');
  const totalFarmers = new Set(bookings.map((b) => b.farmerPhone)).size;
  const avgWait = waiting.length > 0 ? Math.round(waiting.reduce((s, b) => s + b.estimatedWaitMin, 0) / waiting.length) : 0;
  const predictedCrowd = Math.round(waiting.length * 1.4 + 15);

  const totalBooked = slots.reduce((s, sl) => s + sl.booked, 0);
  const totalCapacity = slots.reduce((s, sl) => s + sl.capacity, 0);
  const utilization = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;

  // Hourly distribution (mock)
  const hourly = [
    { label: '8AM', value: 25 }, { label: '9AM', value: 42 }, { label: '10AM', value: 58 },
    { label: '11AM', value: 35 }, { label: '12PM', value: 18 }, { label: '1PM', value: 12 },
    { label: '2PM', value: 38 }, { label: '3PM', value: 45 }, { label: '4PM', value: 30 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <SectionHeader title={t('analytics')} subtitle={t('analyticsSub')} />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard icon={Users} label={t('totalFarmers')} value={totalFarmers} color="brand" trend={{ value: '12%', up: true }} />
        <StatCard icon={Clock} label={t('currentWaiting')} value={waiting.length} color="harvest" trend={{ value: '8%', up: false }} />
        <StatCard icon={CheckCircle2} label={t('completedProcurements')} value={completed.length} color="blue" trend={{ value: '23%', up: true }} />
        <StatCard icon={Activity} label={t('avgWaitTime')} value={`${avgWait}m`} color="purple" trend={{ value: '15%', up: false }} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        {/* Predicted crowd */}
        <div className="card p-5 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} className="text-harvest-600" />
            <span className="text-sm font-semibold text-earth-600">{t('predictedCrowd')}</span>
          </div>
          <ProgressRing value={predictedCrowd} max={predictedCrowd + 25} size={140} color="#eab308" label={`${predictedCrowd}`} sublabel={t('predictedNext')} />
          <p className="text-xs text-earth-400 mt-3">{t('basedOnTrends')}</p>
        </div>

        {/* 7-day trend */}
        <div className="card p-5 lg:col-span-2">
          <SectionHeader title={t('procurementTrend')} />
          <LineChart data={TREND_7D.map((d) => ({ label: d.day, value: d.count }))} height={170} color="#16a34a" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        {/* Crop distribution */}
        <div className="card p-5">
          <SectionHeader title={t('cropDistribution')} />
          <DonutChart data={CROP_DIST.map((c) => ({ label: c.type, value: c.count, color: c.color }))} size={160} />
        </div>

        {/* Hourly distribution */}
        <div className="card p-5">
          <SectionHeader title="Hourly Distribution" />
          <BarChart data={hourly} height={170} color="#eab308" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Center performance */}
        <div className="card p-5">
          <SectionHeader title={t('centerPerformance')} />
          <BarChart
            data={centers.map((c) => ({ label: c.name.split(' ')[0].slice(0, 6), value: c.capacityPerDay }))}
            height={170}
            highlightMax
          />
        </div>

        {/* Utilization */}
        <div className="card p-5 flex flex-col items-center justify-center text-center">
          <SectionHeader title={t('utilization')} />
          <ProgressRing value={utilization} max={100} size={140} color="#16a34a" label={`${utilization}%`} sublabel="Slots" />
          <div className="mt-4 grid grid-cols-2 gap-4 w-full">
            <div className="bg-brand-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-brand-700">{totalBooked}</div>
              <div className="text-xs text-earth-500">{t('booked')}</div>
            </div>
            <div className="bg-earth-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-earth-700">{totalCapacity}</div>
              <div className="text-xs text-earth-500">{t('capacity')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
