import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import TenantAdminDashboard from './pages/TenantAdminDashboard';
import PublicBooking from './pages/PublicBooking';

type Page = 'landing' | 'login' | 'dashboard' | 'booking';

function AppRouter() {
  const [page, setPage] = useState<Page>('landing');
  const { user, isAuthenticated } = useAuth();

  const navigate = (p: string) => setPage(p as Page);

  // Auto-redirect on login
  useEffect(() => {
    if (isAuthenticated && page === 'login') {
      setPage('dashboard');
    }
  }, [isAuthenticated, page]);

  if (page === 'landing') return <LandingPage onNavigate={navigate} />;
  if (page === 'login') return <LoginPage onNavigate={navigate} />;
  if (page === 'booking') return <PublicBooking onNavigate={navigate} />;

  if (page === 'dashboard') {
    if (!isAuthenticated) return <LoginPage onNavigate={navigate} />;
    if (user?.role === 'SUPER_ADMIN') return <SuperAdminDashboard onNavigate={navigate} />;
    return <TenantAdminDashboard onNavigate={navigate} />;
  }

  return <LandingPage onNavigate={navigate} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
