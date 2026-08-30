import { useApp } from '@/context';
import { Logo } from '@/components/Logo';
import { Globe, Bell, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { Role } from '@/types';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const farmerNav = [
  { id: 'home', labelKey: 'home' },
  { id: 'register', labelKey: 'register' },
  { id: 'centers', labelKey: 'findCenter' },
  { id: 'token', labelKey: 'myToken' },
];

const adminNav = [
  { id: 'dashboard', labelKey: 'dashboard' },
  { id: 'centers', labelKey: 'centers' },
  { id: 'slots', labelKey: 'slots' },
  { id: 'farmers', labelKey: 'farmers' },
  { id: 'analytics', labelKey: 'analytics' },
];

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const { t, lang, setLang, role, setRole, notifications } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;
  const nav = role === 'admin' ? adminNav : farmerNav;

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    setRole(null);
    onNavigate('home');
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-earth-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => handleNav(role ? (role === 'admin' ? 'dashboard' : 'home') : 'home')} className="shrink-0">
            <Logo size="md" />
          </button>

          {/* Desktop nav */}
          {role && (
            <nav className="hidden md:flex items-center gap-1">
              {nav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    currentPage === item.id
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-earth-600 hover:text-earth-900 hover:bg-earth-50'
                  }`}
                >
                  {t(item.labelKey)}
                </button>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="btn-ghost px-2.5 py-2"
              aria-label={t('language')}
            >
              <Globe size={18} />
              <span className="text-sm font-semibold hidden sm:inline">{lang === 'en' ? 'हिं' : 'EN'}</span>
            </button>

            {role && (
              <button
                onClick={() => handleNav('notifications')}
                className="btn-ghost relative px-2.5 py-2"
                aria-label={t('notifications')}
              >
                <Bell size={18} />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-harvest-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </button>
            )}

            {role && (
              <button onClick={handleLogout} className="btn-ghost px-2.5 py-2 hidden sm:inline-flex" aria-label={t('logout')}>
                <LogOut size={18} />
              </button>
            )}

            {role && (
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="btn-ghost px-2.5 py-2 md:hidden"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        {role && mobileOpen && (
          <nav className="md:hidden pb-3 pt-1 border-t border-earth-100 animate-fade-in">
            <div className="flex flex-col gap-1 mt-2">
              {nav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`px-4 py-3 rounded-xl text-left text-base font-semibold transition ${
                    currentPage === item.id
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-earth-700 hover:bg-earth-50'
                  }`}
                >
                  {t(item.labelKey)}
                </button>
              ))}
              <button onClick={handleLogout} className="px-4 py-3 rounded-xl text-left text-base font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2">
                <LogOut size={18} /> {t('logout')}
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
