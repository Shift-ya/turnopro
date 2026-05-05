import { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import LoginPage from './pages/LoginPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import TenantAdminDashboard from './pages/TenantAdminDashboard';
import PublicBooking from './pages/PublicBooking';

type Page = 'landing' | 'login' | 'dashboard' | 'booking';

interface AppConfig {
  landingUrl: string;
  apiUrl: string;
}

function AppRouter() {
  const [page, setPage] = useState<Page>('landing');
  const [config, setConfig] = useState<AppConfig>({
    landingUrl: 'http://localhost:3000',
    apiUrl: 'http://localhost:8080/api',
  });
  const { user, isAuthenticated } = useAuth();
  const hasProcessedQueryParams = useRef(false);

  const navigate = (p: string) => setPage(p as Page);

  // Load config from public/config.json at runtime based on domain
  useEffect(() => {
    const hostname = window.location.hostname;
    
    // In localhost, use the default config (already set in state)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      console.log('Using localhost config');
      return;
    }
    
    // In Netlify dev, use config.development.json - detect by hostname starting with 'dev-' or containing 'dev'
    const isDev = hostname.startsWith('dev-') || hostname.includes('-dev');
    const configFile = isDev ? '/config.development.json' : '/config.json';
    
    fetch(configFile)
      .then(r => r.json())
      .then(cfg => setConfig(cfg))
      .catch(err => console.warn(`Failed to load ${configFile}:`, err));
  }, []);

  // Process query parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    const fromParam = params.get('from');

    if (pageParam || fromParam) {
      hasProcessedQueryParams.current = true;
      
      if (pageParam === 'login') {
        setPage('login');
      }
      
      // Clean up query params from URL
      window.history.replaceState({}, document.title, window.location.pathname);

      if (fromParam === 'landing') {
        console.log('User arrived from Shiftya landing');
      }
    }
  }, []);

  // Redirect to landing when page is 'landing' (and no query params were present initially)
  useEffect(() => {
    // Only redirect if we didn't process any query params initially
    if (page === 'landing' && !hasProcessedQueryParams.current) {
      window.location.href = config.landingUrl;
    }
  }, [page, config.landingUrl]);

  // Auto-redirect on login
  useEffect(() => {
    if (isAuthenticated && page === 'login') {
      setPage('dashboard');
    }
  }, [isAuthenticated, page]);

  if (page === 'login') return <LoginPage onNavigate={navigate} />;
  if (page === 'booking') return <PublicBooking onNavigate={navigate} />;

  if (page === 'dashboard') {
    if (!isAuthenticated) return <LoginPage onNavigate={navigate} />;
    if (user?.role === 'SUPER_ADMIN') return <SuperAdminDashboard onNavigate={navigate} />;
    return <TenantAdminDashboard onNavigate={navigate} />;
  }

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </AuthProvider>
  );
}
