import { useApp } from '@/context';
import { CROPS } from '@/data';
import { CropIcon } from '@/components/CropIcon';
import { User, Phone, MapPin, Building2, Wheat, Minus, Plus, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useState } from 'react';
import type { CropType } from '@/types';

interface RegisterProps {
  onBack: () => void;
  onNext: () => void;
}

export function Register({ onBack, onNext }: RegisterProps) {
  const { t, lang, farmerDraft, setFarmerDraft } = useApp();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!farmerDraft.name.trim()) e.name = t('enterName');
    if (!/^\d{10}$/.test(farmerDraft.phone)) e.phone = t('enterPhone');
    if (!farmerDraft.village.trim()) e.village = t('selectVillage');
    if (!farmerDraft.cropType) e.crop = t('selectCropPrompt');
    if (!farmerDraft.quantity || Number(farmerDraft.quantity) <= 0) e.qty = t('selectQtyPrompt');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const qty = Number(farmerDraft.quantity) || 0;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <button onClick={onBack} className="btn-ghost mb-4 -ml-2">
        <ArrowLeft size={18} /> {t('back')}
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-earth-900">{t('registerTitle')}</h1>
        <p className="text-sm text-earth-500 mt-1">{t('registerSub')}</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold">1</div>
          <span className="text-sm font-semibold text-earth-900">{t('register')}</span>
        </div>
        <div className="flex-1 h-0.5 bg-earth-200 rounded-full" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-earth-200 text-earth-500 flex items-center justify-center text-sm font-bold">2</div>
          <span className="text-sm font-medium text-earth-400">{t('findCenter')}</span>
        </div>
        <div className="flex-1 h-0.5 bg-earth-200 rounded-full" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-earth-200 text-earth-500 flex items-center justify-center text-sm font-bold">3</div>
          <span className="text-sm font-medium text-earth-400">{t('myToken')}</span>
        </div>
      </div>

      <div className="card p-5 sm:p-6 space-y-5">
        {/* Name */}
        <div>
          <label className="label">{t('fullName')}</label>
          <div className="relative">
            <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-400" />
            <input
              className="input pl-11"
              value={farmerDraft.name}
              onChange={(e) => setFarmerDraft({ name: e.target.value })}
              placeholder={t('enterName')}
            />
          </div>
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="label">{t('phoneNumber')}</label>
          <div className="relative">
            <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-400" />
            <input
              className="input pl-11"
              value={farmerDraft.phone}
              onChange={(e) => setFarmerDraft({ phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              placeholder="9876543210"
              inputMode="numeric"
            />
          </div>
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        </div>

        {/* Village + District */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">{t('village')}</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-400" />
              <input
                className="input pl-11"
                value={farmerDraft.village}
                onChange={(e) => setFarmerDraft({ village: e.target.value })}
                placeholder={t('selectVillage')}
              />
            </div>
            {errors.village && <p className="text-xs text-red-500 mt-1">{errors.village}</p>}
          </div>
          <div>
            <label className="label">{t('district')}</label>
            <div className="relative">
              <Building2 size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-400" />
              <input
                className="input pl-11"
                value={farmerDraft.district}
                onChange={(e) => setFarmerDraft({ district: e.target.value })}
                placeholder={t('district')}
              />
            </div>
          </div>
        </div>

        {/* Crop selection */}
        <div>
          <label className="label">{t('selectCrop')}</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {CROPS.map((c) => {
              const selected = farmerDraft.cropType === c.type;
              return (
                <button
                  key={c.id}
                  onClick={() => setFarmerDraft({ cropType: c.type as CropType })}
                  className={`relative rounded-xl border-2 p-3 text-center transition-all ${
                    selected ? 'border-brand-500 bg-brand-50 shadow-glow' : 'border-earth-200 bg-white hover:border-brand-300'
                  }`}
                >
                  {selected && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                  <CropIcon name={c.icon} size={24} className={`mx-auto mb-1.5 ${selected ? 'text-brand-600' : 'text-earth-400'}`} />
                  <div className={`text-xs font-semibold ${selected ? 'text-brand-700' : 'text-earth-700'}`}>
                    {lang === 'hi' ? c.nameHi : c.nameEn}
                  </div>
                  <div className="text-[10px] text-earth-400 mt-0.5">₹{c.msp}/q</div>
                </button>
              );
            })}
          </div>
          {errors.crop && <p className="text-xs text-red-500 mt-1">{errors.crop}</p>}
        </div>

        {/* Quantity */}
        <div>
          <label className="label">{t('quantity')}</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFarmerDraft({ quantity: String(Math.max(0, qty - 1)) })}
              className="w-12 h-12 rounded-xl bg-earth-100 hover:bg-earth-200 flex items-center justify-center shrink-0 transition"
            >
              <Minus size={20} className="text-earth-600" />
            </button>
            <div className="flex-1 relative">
              <Wheat size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-400" />
              <input
                className="input pl-11 text-center text-lg font-bold"
                value={farmerDraft.quantity}
                onChange={(e) => setFarmerDraft({ quantity: e.target.value.replace(/[^\d.]/g, '') })}
                placeholder="0"
                inputMode="decimal"
              />
            </div>
            <button
              onClick={() => setFarmerDraft({ quantity: String(qty + 1) })}
              className="w-12 h-12 rounded-xl bg-brand-100 hover:bg-brand-200 flex items-center justify-center shrink-0 transition"
            >
              <Plus size={20} className="text-brand-600" />
            </button>
          </div>
          <p className="text-xs text-earth-400 mt-1.5">{t('quantityHint')}</p>
          {errors.qty && <p className="text-xs text-red-500 mt-1">{errors.qty}</p>}
          {qty > 0 && (
            <div className="mt-2 bg-harvest-50 rounded-lg px-3 py-2 text-sm">
              <span className="text-earth-600">Estimated payment: </span>
              <span className="font-bold text-harvest-700">₹{(qty * (CROPS.find((c) => c.type === farmerDraft.cropType)?.msp ?? 0)).toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>
      </div>

      <button onClick={handleNext} className="btn-primary btn-lg w-full mt-5">
        {t('findCenters')} <ArrowRight size={20} />
      </button>
    </div>
  );
}
