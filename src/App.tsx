import { useState } from 'react';
import { AppProvider, useApp } from '@/context';
import { Header } from '@/components/Header';
import { ToastContainer } from '@/components/Toast';
import { Landing } from '@/pages/Landing';
import { FarmerHome } from '@/pages/FarmerHome';
import { Register } from '@/pages/Register';
import { Centers } from '@/pages/Centers';
import { Token } from '@/pages/Token';
import { Notifications } from '@/pages/Notifications';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { AdminCenters } from '@/pages/AdminCenters';
import { AdminSlots } from '@/pages/AdminSlots';
import { AdminFarmers } from '@/pages/AdminFarmers';
import { AdminAnalytics } from '@/pages/AdminAnalytics';

function AppInner() {
  const { role, setRole, resetFarmerDraft } = useApp();
  const [page, setPage] = useState('home');
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);

  const navigate = (p: string) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Landing page when no role selected
  if (!role) {
    return (
      <>
        <Landing
          onSelectRole={(r) => {
            setRole(r);
            navigate(r === 'admin' ? 'dashboard' : 'home');
          }}
        />
        <ToastContainer />
      </>
    );
  }

  const renderPage = () => {
    // Farmer pages
    if (role === 'farmer') {
      switch (page) {
        case 'register':
          return <Register onBack={() => navigate('home')} onNext={() => navigate('centers')} />;
        case 'centers':
          return <Centers onBack={() => navigate('register')} onBooked={(id) => { setActiveBookingId(id); navigate('token'); }} />;
        case 'token':
          return <Token bookingId={activeBookingId} onBack={() => navigate('home')} onBookAnother={() => { resetFarmerDraft(); navigate('register'); }} />;
        case 'notifications':
          return <Notifications onBack={() => navigate('home')} />;
        default:
          return <FarmerHome onNavigate={navigate} />;
      }
    }

    // Admin pages
    switch (page) {
      case 'centers':
        return <AdminCenters />;
      case 'slots':
        return <AdminSlots />;
      case 'farmers':
        return <AdminFarmers />;
      case 'analytics':
        return <AdminAnalytics />;
      default:
        return <AdminDashboard onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-earth-50">
      <Header onNavigate={navigate} currentPage={page} />
      <main className="pb-8">{renderPage()}</main>
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
