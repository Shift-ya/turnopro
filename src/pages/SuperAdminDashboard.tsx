import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Building2, Layers3 } from 'lucide-react';
import { useSuperAdminDashboard } from '../hooks/useSuperAdminDashboard';
import { SuperAdminSidebar } from '../components/super-admin/SuperAdminSidebar';
import { SuperAdminContent } from '../components/super-admin/SuperAdminContent';
import { useAuth } from '../context/AuthContext';
import type { SuperAdminNavItem } from '../types/superAdminDashboard';

const navItems: SuperAdminNavItem[] = [
  { id: 'overview', label: 'Dashboard', icon: <BarChart3 size={18} />, caption: 'Vista general' },
  { id: 'tenants', label: 'Clientes', icon: <Building2 size={18} />, caption: 'Base activa' },
  { id: 'plans', label: 'Planes', icon: <Layers3 size={18} />, caption: 'Monetizacion' },
];

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    activeTab,
    setActiveTab,
    search,
    setSearch,
    sidebarOpen,
    setSidebarOpen,
    loading,
    error,
    metrics,
    tenants,
    creatingTenant,
    deletingTenant,
    createTenant,
    updateTenantStatus,
    deleteTenant,
  } = useSuperAdminDashboard();

  const [selectedTenant, setSelectedTenant] = React.useState<(typeof tenants)[number] | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="app-shell min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-7xl gap-6">
        <SuperAdminSidebar
          activeTab={activeTab}
          navItems={navItems}
          sidebarOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSelectTab={setActiveTab}
          onLogout={handleLogout}
          metrics={metrics}
          user={user}
        />

        {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/55 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        <SuperAdminContent
          activeTab={activeTab}
          navItems={navItems}
          onSelectTab={setActiveTab}
          onOpenSidebar={() => setSidebarOpen(true)}
          metrics={metrics}
          tenants={tenants}
          search={search}
          onSearchChange={setSearch}
          loading={loading}
          error={error}
          creatingTenant={creatingTenant}
          deletingTenant={deletingTenant}
          selectedTenant={selectedTenant}
          onSelectTenant={setSelectedTenant}
          onCreateTenant={createTenant}
          onUpdateTenantStatus={updateTenantStatus}
          onDeleteTenant={deleteTenant}
        />
      </div>
    </div>
  );
}
