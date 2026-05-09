import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoadingScreen() {
  return <div className="min-h-screen grid place-items-center text-gray-500">Cargando...</div>;
}

export default function RequireGuestLayout() {
  const { isAuthenticated, isReady } = useAuth();

  if (!isReady) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    // Si el usuario está autenticado, no le mostramos el login.
    // Se mantiene el redirect a dashboard, pero para que el botón de la landing
    // lleve a login, el logout debe limpiar sesión.
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
