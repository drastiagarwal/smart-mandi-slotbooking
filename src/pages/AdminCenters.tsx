import { useApp } from '@/context';
import { SectionHeader } from '@/components/StatCard';
import { Building2, MapPin, Clock, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { useState } from 'react';
import type { Center } from '@/types';

export function AdminCenters() {
  const { t, lang, centers, addCenter, updateCenter, deleteCenter } = useApp();
  const [editing, setEditing] = useState<Center | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', nameHi: '', address: '', district: '', capacityPerDay: 100, openTime: '08:00', closeTime: '18:00', active: true });

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', nameHi: '', address: '', district: '', capacityPerDay: 100, openTime: '08:00', closeTime: '18:00', active: true });
    setShowForm(true);
  };

  const openEdit = (c: Center) => {
    setEditing(c);
    setForm({ name: c.name, nameHi: c.nameHi, address: c.address, district: c.district, capacityPerDay: c.capacityPerDay, openTime: c.openTime, closeTime: c.closeTime, active: c.active });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editing) {
      updateCenter(editing.id, form);
    } else {
      addCenter(form);
    }
    setShowForm(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <SectionHeader
        title={t('manageCenters')}
        subtitle={`${centers.length} ${t('centers')}`}
        action={<button onClick={openAdd} className="btn-primary"><Plus size={18} /> {t('addCenter')}</button>}
      />

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in" onClick={() => setShowForm(false)}>
          <div className="card p-5 w-full max-w-md animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-earth-900">{editing ? t('editCenter') : t('addCenter')}</h3>
              <button onClick={() => setShowForm(false)} className="btn-ghost p-1.5"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="label">{t('centerName')}</label>
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="label">{t('centerName')} (हिंदी)</label>
                <input className="input" value={form.nameHi} onChange={(e) => setForm({ ...form, nameHi: e.target.value })} />
              </div>
              <div>
                <label className="label">{t('address')}</label>
                <input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">{t('district')}</label>
                  <input className="input" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
                </div>
                <div>
                  <label className="label">{t('dailyCapacity')}</label>
                  <input type="number" className="input" value={form.capacityPerDay} onChange={(e) => setForm({ ...form, capacityPerDay: Number(e.target.value) })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">{t('openTime')}</label>
                  <input type="time" className="input" value={form.openTime} onChange={(e) => setForm({ ...form, openTime: e.target.value })} />
                </div>
                <div>
                  <label className="label">{t('closeTime')}</label>
                  <input type="time" className="input" value={form.closeTime} onChange={(e) => setForm({ ...form, closeTime: e.target.value })} />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <button
                  onClick={() => setForm({ ...form, active: !form.active })}
                  className={`w-11 h-6 rounded-full transition ${form.active ? 'bg-brand-500' : 'bg-earth-300'} relative`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.active ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-sm font-medium text-earth-700">{form.active ? t('active') : t('inactive')}</span>
              </label>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">{t('cancel')}</button>
              <button onClick={handleSave} className="btn-primary flex-1"><Check size={18} /> {t('save')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Centers grid */}
      <div className="grid sm:grid-cols-2 gap-3">
        {centers.map((c) => (
          <div key={c.id} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <Building2 size={22} />
                </div>
                <div className="min-w-0">
                  <div className="font-display font-bold text-earth-900 truncate">{lang === 'hi' ? c.nameHi : c.name}</div>
                  <div className="flex items-center gap-1 text-xs text-earth-500 mt-0.5"><MapPin size={12} /> {c.address}</div>
                </div>
              </div>
              <span className={`badge ${c.active ? 'bg-brand-50 text-brand-600' : 'bg-earth-100 text-earth-500'}`}>
                {c.active ? t('active') : t('inactive')}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-3 text-xs">
              <span className="badge bg-earth-50 text-earth-600">{c.distanceKm} {t('km')}</span>
              <span className="badge bg-blue-50 text-blue-600"><Clock size={11} /> {c.openTime}-{c.closeTime}</span>
              <span className="badge bg-harvest-50 text-harvest-600">{c.capacityPerDay}/day</span>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => openEdit(c)} className="btn-ghost text-sm flex-1 justify-center bg-earth-50"><Edit2 size={14} /> {t('edit')}</button>
              <button onClick={() => { if (confirm(`Delete ${c.name}?`)) deleteCenter(c.id); }} className="btn-ghost text-sm text-red-600 bg-red-50 hover:bg-red-100 px-3"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
