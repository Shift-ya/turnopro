import { BarChart3, Briefcase, CalendarDays, Settings, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TenantAdminDashboardContent } from '../components/tenant-admin/TenantAdminDashboardContent';
import { TenantAdminSidebar } from '../components/tenant-admin/TenantAdminSidebar';
import { useAuth } from '../context/AuthContext';
import { useTenantAdminDashboard } from '../hooks/useTenantAdminDashboard';
import type { TenantAdminNavItem } from '../types/tenantAdminDashboard';

const navItems: TenantAdminNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={18} />, caption: 'KPIs y foco diario' },
  { id: 'calendar', label: 'Calendario', icon: <CalendarDays size={18} />, caption: 'Agenda completa' },
  { id: 'professionals', label: 'Profesionales', icon: <Users size={18} />, caption: 'Equipo activo' },
  { id: 'services', label: 'Servicios', icon: <Briefcase size={18} />, caption: 'Oferta comercial' },
  { id: 'settings', label: 'Configuracion', icon: <Settings size={18} />, caption: 'Identidad y datos' },
];

export default function TenantAdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const tenantId = user?.tenantId;
  const dashboard = useTenantAdminDashboard(tenantId);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  if (!tenantId) {
    return <div className="app-shell grid min-h-screen place-items-center">Usuario sin tenant asignado</div>;
  }

  return (
    <div className="app-shell min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-7xl gap-6">
        <TenantAdminSidebar
          tenantName={dashboard.tenant?.name || 'Tenant'}
          navItems={navItems}
          activeTab={dashboard.activeTab}
          sidebarOpen={dashboard.sidebarOpen}
          onClose={() => dashboard.setSidebarOpen(false)}
          onSelectTab={dashboard.setActiveTab}
          onOpenPublicBooking={() => navigate('/booking')}
          onLogout={handleLogout}
        />

        {dashboard.sidebarOpen && <div className="fixed inset-0 z-30 bg-black/55 lg:hidden" onClick={() => dashboard.setSidebarOpen(false)} />}

        <TenantAdminDashboardContent
          navItems={navItems}
          activeTab={dashboard.activeTab}
          loading={dashboard.loading}
          error={dashboard.error}
          tenant={dashboard.tenant}
          metrics={dashboard.metrics}
          appointments={dashboard.appointments}
          todayAppts={dashboard.todayAppts}
          professionals={dashboard.professionals}
          services={dashboard.services}
          savingProfessional={dashboard.savingProfessional}
          savingService={dashboard.savingService}
          savingTenant={dashboard.savingTenant}
          onOpenSidebar={() => dashboard.setSidebarOpen(true)}
          onAddProfessional={dashboard.addProfessional}
          onEditProfessional={dashboard.editProfessional}
          onToggleProfessional={dashboard.toggleProfessional}
          onAddService={dashboard.addService}
          onEditService={dashboard.editService}
          onRemoveService={dashboard.removeService}
          onEditTenant={dashboard.editTenant}
          getServiceName={dashboard.getServiceName}
          getProfName={dashboard.getProfName}
        />
      </div>
    </div>
  );
}
