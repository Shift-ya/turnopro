import { Bell, Settings } from 'lucide-react';
import { DashboardHeader } from '../dashboard/DashboardHeader';
import { SuperAdminTabs } from './SuperAdminTabs';
import type { SuperAdminTab, SuperAdminNavItem, SuperAdminTenantFormData } from '../../types/superAdminDashboard';
import type { ApiGlobalOverview, ApiTenant } from '../../lib/api';

interface SuperAdminContentProps {
  activeTab: SuperAdminTab;
  navItems: SuperAdminNavItem[];
  onSelectTab: (tab: SuperAdminTab) => void;
  onOpenSidebar: () => void;
  metrics: ApiGlobalOverview | null;
  tenants: ApiTenant[];
  search: string;
  onSearchChange: (value: string) => void;
  loading: boolean;
  error: string;
  creatingTenant: boolean;
  deletingTenant: boolean;
  selectedTenant: ApiTenant | null;
  onSelectTenant: (tenant: ApiTenant | null) => void;
  onCreateTenant: (data: SuperAdminTenantFormData) => Promise<void>;
  onUpdateTenantStatus: (tenant: ApiTenant) => Promise<void>;
  onDeleteTenant: (tenantId: string, tenantName: string) => Promise<void>;
}

export function SuperAdminContent({
  activeTab,
  navItems,
  onSelectTab,
  onOpenSidebar,
  metrics,
  tenants,
  search,
  onSearchChange,
  loading,
  error,
  creatingTenant,
  deletingTenant,
  selectedTenant,
  onSelectTenant,
  onCreateTenant,
  onUpdateTenantStatus,
  onDeleteTenant,
}: SuperAdminContentProps) {
  return (
    <div className="min-w-0 flex-1">
      <DashboardHeader<SuperAdminTab>
        activeTab={activeTab}
        navItems={navItems}
        title="Control global"
        eyebrow="Control global"
        subtitle="Gestión de toda la plataforma"
        onOpenSidebar={onOpenSidebar}
        onSelectTab={onSelectTab}
        actions={[
          { key: 'bell', node: <Bell size={18} />, ariaLabel: 'Notificaciones' },
          { key: 'settings', node: <Settings size={18} />, ariaLabel: 'Ajustes' },
        ]}
      />

      <main className="space-y-6">
        {loading && <p className="text-[#a1a1aa]">Cargando...</p>}
        {error && (
          <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        <SuperAdminTabs
          activeTab={activeTab}
          metrics={metrics}
          tenants={tenants}
          search={search}
          onSearchChange={onSearchChange}
          onCreateTenant={onCreateTenant}
          onUpdateTenantStatus={onUpdateTenantStatus}
          onDeleteTenant={onDeleteTenant}
          creatingTenant={creatingTenant}
          deletingTenant={deletingTenant}
          selectedTenant={selectedTenant}
          onSelectTenant={onSelectTenant}
          loading={loading}
        />
      </main>
    </div>
  );
}
