import { useApp } from '@/context';
import { Logo } from '@/components/Logo';
import { CropIcon } from '@/components/CropIcon';
import { Tractor, ShieldCheck, MapPin, Users, Clock, TrendingUp, ArrowRight, Sprout, Bell } from 'lucide-react';
import { CROPS } from '@/data';

interface LandingProps {
  onSelectRole: (role: 'farmer' | 'admin') => void;
}

export function Landing({ onSelectRole }: LandingProps) {
  const { t, lang } = useApp();

  const features = [
    { icon: Clock, titleKey: 'f1Title', bodyKey: 'f1Body', color: 'bg-brand-50 text-brand-600' },
    { icon: ShieldCheck, titleKey: 'f2Title', bodyKey: 'f2Body', color: 'bg-harvest-50 text-harvest-600' },
    { icon: MapPin, titleKey: 'f3Title', bodyKey: 'f3Body', color: 'bg-blue-50 text-blue-600' },
  ];

  const stats = [
    { icon: Users, value: '12,400+', labelKey: 'statFarmers' },
    { icon: MapPin, value: '340', labelKey: 'statCenters' },
    { icon: Clock, value: '47%', labelKey: 'statAvgWait' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 text-white">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)',
          backgroundSize: '40px 40px, 60px 60px',
        }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-harvest-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Sprout size={24} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-xl font-display font-bold">{t('appName')}</div>
                <div className="text-xs text-white/70">{t('appTagline')}</div>
              </div>
              <div className="ml-2 px-2.5 py-1 bg-harvest-400 text-harvest-900 rounded-full text-[10px] font-bold tracking-wide">
                {t('sihBadge')}
              </div>
            </div>
          </div>

          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-display font-bold leading-tight text-balance">
              {t('welcome')} to {t('appName')}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/80 text-balance">{t('welcomeSub')}</p>
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4 max-w-xl mx-auto">
            {stats.map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
                <s.icon size={20} className="mx-auto mb-1.5 text-harvest-300" />
                <div className="text-xl sm:text-2xl font-display font-bold">{s.value}</div>
                <div className="text-[11px] sm:text-xs text-white/70 font-medium">{t(s.labelKey)}</div>
              </div>
            ))}
          </div>
        </div>
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ height: 40 }}>
          <path d="M0,80 C480,0 960,0 1440,80 L1440,80 L0,80 Z" fill="#fafaf9" />
        </svg>
      </section>

      {/* Role selection */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-earth-900">{t('chooseRole')}</h2>
          <p className="text-sm text-earth-500 mt-1">{t('chooseRoleSub')}</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={() => onSelectRole('farmer')}
            className="card p-6 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Tractor size={28} className="text-brand-600" />
            </div>
            <h3 className="text-lg font-display font-bold text-earth-900">{t('farmer')}</h3>
            <p className="text-sm text-earth-500 mt-1">Register, book slots, track live queue & get your token</p>
            <div className="mt-4 inline-flex items-center gap-1 text-brand-600 font-semibold text-sm">
              {t('startBooking')} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => onSelectRole('admin')}
            className="card p-6 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-harvest-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck size={28} className="text-harvest-600" />
            </div>
            <h3 className="text-lg font-display font-bold text-earth-900">{t('admin')}</h3>
            <p className="text-sm text-earth-500 mt-1">Manage centers, slots, queues & view analytics dashboard</p>
            <div className="mt-4 inline-flex items-center gap-1 text-harvest-600 font-semibold text-sm">
              {t('dashboard')} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-center text-xl sm:text-2xl font-display font-bold text-earth-900 mb-8">{t('featuresTitle')}</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={i} className="card p-5">
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-3`}>
                <f.icon size={24} />
              </div>
              <h3 className="font-display font-bold text-earth-900">{t(f.titleKey)}</h3>
              <p className="text-sm text-earth-500 mt-1">{t(f.bodyKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Crops strip */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sprout size={18} className="text-brand-600" />
            <h3 className="font-display font-bold text-earth-900">Supported Crops</h3>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {CROPS.map((c) => (
              <div key={c.id} className="chip bg-earth-50 border-earth-200 text-earth-700">
                <CropIcon name={c.icon} size={16} className="text-brand-600" />
                {lang === 'hi' ? c.nameHi : c.nameEn}
                <span className="text-earth-400 font-normal">₹{c.msp}/q</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-earth-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <p className="text-sm text-earth-400 font-medium">{t('poweredBy')} · {t('appName')}</p>
        </div>
      </footer>
    </div>
  );
}
