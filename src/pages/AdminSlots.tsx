import { useApp } from '@/context';
import { SectionHeader } from '@/components/StatCard';
import { Clock, Plus, Calendar, Users, X, Check } from 'lucide-react';
import { useState } from 'react';

export function AdminSlots() {
  const { t, centers, slots, addSlot } = useApp();
  const [selectedCenter, setSelectedCenter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ centerId: centers[0]?.id ?? '', date: new Date().toISOString().slice(0, 10), startTime: '08:00', endTime: '10:00', capacity: 30 });

  const filtered = selectedCenter === 'all' ? slots : slots.filter((s) => s.centerId === selectedCenter);

  const handleAdd = () => {
    if (!form.centerId) return;
    addSlot(form);
    setShowForm(false);
  };

  const today = new Date().toISOString().slice(0, 10);
  const dateLabel = (date: string) => {
    if (date === today) return t('today');
    if (date === new Date(Date.now() + 86400000).toISOString().slice(0, 10)) return t('tomorrow');
    return date;
  };

  const totalBooked = filtered.reduce((s, sl) => s + sl.booked, 0);
  const totalCapacity = filtered.reduce((s, sl) => s + sl.capacity, 0);
  const utilization = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <SectionHeader
        title={t('manageSlots')}
        subtitle={t('manageSlotsSub')}
        action={<button onClick={() => setShowForm(true)} className="btn-primary"><Plus size={18} /> {t('addSlot')}</button>}
      />

      {/* Filter + summary */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <select
          value={selectedCenter}
          onChange={(e) => setSelectedCenter(e.target.value)}
          className="input max-w-xs"
        >
          <option value="all">{t('allCenters')}</option>
          {centers.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <div className="flex items-center gap-3 text-sm">
          <span className="badge bg-brand-50 text-brand-700">{t('totalBooked')}: {totalBooked}</span>
          <span className="badge bg-earth-50 text-earth-600">{t('utilization')}: {utilization}%</span>
        </div>
      </div>

      {/* Utilization bar */}
      <div className="card p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-earth-700">{t('utilization')}</span>
          <span className="text-sm font-bold text-brand-700">{utilization}%</span>
        </div>
        <div className="h-3 bg-earth-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${utilization > 80 ? 'bg-red-500' : utilization > 60 ? 'bg-harvest-500' : 'bg-brand-500'}`}
            style={{ width: `${utilization}%` }}
          />
        </div>
      </div>

      {/* Slots grouped by date */}
      <div className="space-y-4">
        {[...new Set(filtered.map((s) => s.date))].sort().map((date) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={16} className="text-brand-600" />
              <h3 className="text-sm font-bold text-earth-700 uppercase tracking-wide">{dateLabel(date)}</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.filter((s) => s.date === date).map((s) => {
                const center = centers.find((c) => c.id === s.centerId);
                const avail = s.capacity - s.booked;
                const pct = Math.round((s.booked / s.capacity) * 100);
                return (
                  <div key={s.id} className="card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-earth-900">
                        <Clock size={14} className="text-brand-600" />
                        {s.startTime} - {s.endTime}
                      </div>
                      <span className={`badge ${avail <= 0 ? 'bg-red-100 text-red-600' : 'bg-brand-50 text-brand-600'}`}>
                        {avail <= 0 ? t('full') : `${avail} ${t('available')}`}
                      </span>
                    </div>
                    <div className="text-xs text-earth-500 mt-1 truncate">{center?.name}</div>
                    <div className="flex items-center gap-1 text-xs text-earth-400 mt-1">
                      <Users size={11} /> {s.booked}/{s.capacity} booked
                    </div>
                    <div className="mt-2 h-1.5 bg-earth-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct > 80 ? 'bg-red-400' : 'bg-brand-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Add slot form */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in" onClick={() => setShowForm(false)}>
          <div className="card p-5 w-full max-w-md animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-earth-900">{t('addSlot')}</h3>
              <button onClick={() => setShowForm(false)} className="btn-ghost p-1.5"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="label">{t('selectCenter')}</label>
                <select className="input" value={form.centerId} onChange={(e) => setForm({ ...form, centerId: e.target.value })}>
                  {centers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Date</label>
                <input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">{t('startTime')}</label>
                  <input type="time" className="input" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
                </div>
                <div>
                  <label className="label">{t('endTime')}</label>
                  <input type="time" className="input" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="label">{t('slotCapacity')}</label>
                <input type="number" className="input" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">{t('cancel')}</button>
              <button onClick={handleAdd} className="btn-primary flex-1"><Check size={18} /> {t('add')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
