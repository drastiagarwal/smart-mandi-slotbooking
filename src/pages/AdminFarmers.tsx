import { useApp } from '@/context';
import { SectionHeader } from '@/components/StatCard';
import { QueueViz } from '@/components/QueueViz';
import { STATUS_COLOR, STATUS_LABEL_KEY, STATUS_DOT, STATUS_ORDER } from '@/data';
import { CropIcon } from '@/components/CropIcon';
import { CROPS } from '@/data';
import { Phone, Trash2, ArrowRight, Users, Clock, Filter } from 'lucide-react';
import { useState } from 'react';
import type { ProcurementStatus } from '@/types';

export function AdminFarmers() {
  const { t, lang, bookings, centers, advanceStatus, removeBooking } = useApp();
  const [filterCenter, setFilterCenter] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  let filtered = bookings.filter((b) => b.status !== 'cancelled');
  if (filterCenter !== 'all') filtered = filtered.filter((b) => b.centerId === filterCenter);
  if (filterStatus !== 'all') filtered = filtered.filter((b) => b.status === filterStatus);

  const waiting = filtered.filter((b) => b.status === 'waiting');
  const inProcess = filtered.filter((b) => ['called', 'verification', 'weighing', 'payment'].includes(b.status));
  const completed = filtered.filter((b) => b.status === 'completed');

  const nextStatus = (status: ProcurementStatus): ProcurementStatus | null => {
    const idx = STATUS_ORDER.indexOf(status);
    if (idx < 0 || idx >= STATUS_ORDER.length - 1) return null;
    return STATUS_ORDER[idx + 1];
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <SectionHeader title={t('manageFarmers')} subtitle={t('manageFarmersSub')} />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Filter size={16} className="text-earth-400" />
        <select value={filterCenter} onChange={(e) => setFilterCenter(e.target.value)} className="input max-w-xs">
          <option value="all">{t('allCenters')}</option>
          {centers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input max-w-xs">
          <option value="all">All Status</option>
          {STATUS_ORDER.map((s) => <option key={s} value={s}>{t(STATUS_LABEL_KEY[s])}</option>)}
        </select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-harvest-50 rounded-xl p-3 text-center">
          <div className="text-2xl font-display font-bold text-harvest-700">{waiting.length}</div>
          <div className="text-[11px] font-semibold text-harvest-600">{t('waiting')}</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <div className="text-2xl font-display font-bold text-blue-700">{inProcess.length}</div>
          <div className="text-[11px] font-semibold text-blue-600">In Process</div>
        </div>
        <div className="bg-brand-50 rounded-xl p-3 text-center">
          <div className="text-2xl font-display font-bold text-brand-700">{completed.length}</div>
          <div className="text-[11px] font-semibold text-brand-600">{t('done')}</div>
        </div>
      </div>

      {/* Live queue viz */}
      <div className="card p-5 mb-5">
        <h3 className="font-display font-bold text-earth-900 mb-4">{t('liveQueueViz')}</h3>
        <QueueViz bookings={filtered} />
      </div>

      {/* Farmers table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-earth-50 text-left text-xs font-bold text-earth-600 uppercase">
                <th className="px-4 py-3">{t('token')}</th>
                <th className="px-4 py-3">{t('farmerName')}</th>
                <th className="px-4 py-3 hidden sm:table-cell">{t('crop')}</th>
                <th className="px-4 py-3 hidden sm:table-cell">{t('qty')}</th>
                <th className="px-4 py-3">{t('status')}</th>
                <th className="px-4 py-3 text-right">{t('action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
              {filtered.map((b) => {
                const crop = CROPS.find((c) => c.type === b.cropType);
                const next = nextStatus(b.status);
                return (
                  <tr key={b.id} className="hover:bg-earth-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${STATUS_DOT[b.status]} ${b.status === 'waiting' ? 'animate-pulse' : ''}`} />
                        <span className="font-bold text-earth-900 tabular-nums">#{b.tokenNo}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-earth-800">{b.farmerName}</div>
                      <div className="text-xs text-earth-400 flex items-center gap-1"><Phone size={10} /> {b.farmerPhone}</div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5 text-earth-700">
                        {crop && <CropIcon name={crop.icon} size={14} className="text-brand-600" />}
                        {lang === 'hi' ? crop?.nameHi : crop?.nameEn}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-earth-700 font-medium">{b.quantityQuintal}q</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${STATUS_COLOR[b.status]}`}>{t(STATUS_LABEL_KEY[b.status])}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 justify-end">
                        {next && (
                          <button
                            onClick={() => advanceStatus(b.id)}
                            className="btn-ghost text-xs bg-brand-50 text-brand-700 hover:bg-brand-100 px-3 py-1.5"
                          >
                            {t(STATUS_LABEL_KEY[next])} <ArrowRight size={12} />
                          </button>
                        )}
                        {b.status !== 'completed' && (
                          <button
                            onClick={() => { if (confirm(`Remove ${b.farmerName} from queue?`)) removeBooking(b.id); }}
                            className="btn-ghost text-xs text-red-600 bg-red-50 hover:bg-red-100 px-2 py-1.5"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-10 text-center text-earth-400 text-sm">{t('queueEmpty')}</div>
        )}
      </div>
    </div>
  );
}
