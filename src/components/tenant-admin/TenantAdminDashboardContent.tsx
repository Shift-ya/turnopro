import { Bell, Menu } from 'lucide-react';
import type { ApiAppointment, ApiTenant } from '../../lib/api';
import type { TenantAdminDashboardData, TenantAdminNavItem, TenantAdminTab } from '../../types/tenantAdminDashboard';
import {
  TenantAdminCalendarTab,
  TenantAdminOverviewTab,
  TenantAdminProfessionalsTab,
  TenantAdminServicesTab,
  TenantAdminSettingsTab,
} from './TenantAdminDashboardTabs';

interface TenantAdminDashboardContentProps {
  navItems: TenantAdminNavItem[];
  activeTab: TenantAdminTab;
  loading: boolean;
  error: string;
  tenant: ApiTenant | null;
  metrics: TenantAdminDashboardData['metrics'];
  appointments: ApiAppointment[];
  todayAppts: ApiAppointment[];
  professionals: any[];
  services: any[];
  savingProfessional: boolean;
  savingService: boolean;
  savingTenant: boolean;
  onOpenSidebar: () => void;
  onAddProfessional: (data: any) => Promise<void>;
  onEditProfessional: (data: any, professionalId: string) => Promise<void>;
  onToggleProfessional: (professional: any) => Promise<void>;
  onAddService: (data: any) => Promise<void>;
  onEditService: (data: any, serviceId: string) => Promise<void>;
  onRemoveService: (service: any) => Promise<void>;
  onEditTenant: (data: any) => Promise<void>;
  getServiceName: (id: string) => string;
  getProfName: (id: string) => string;
}

export function TenantAdminDashboardContent({
  navItems,
  activeTab,
  loading,
  error,
  tenant,
  metrics,
  appointments,
  todayAppts,
  professionals,
  services,
  savingProfessional,
  savingService,
  savingTenant,
  onOpenSidebar,
  onAddProfessional,
  onEditProfessional,
  onToggleProfessional,
  onAddService,
  onEditService,
  onRemoveService,
  onEditTenant,
  getServiceName,
  getProfName,
}: TenantAdminDashboardContentProps) {
  const activeLabel = navItems.find((item) => item.id === activeTab)?.label;

  return (
    <div className="min-w-0 flex-1">
      <header className="panel-light mb-6 flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button className="button-ghost-luxe h-11 w-11 rounded-full p-0 lg:hidden" onClick={onOpenSidebar}>
            <Menu size={18} />
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-500">Panel operativo</p>
            <h1 className="font-['Space_Grotesk'] text-3xl font-bold tracking-[-0.05em] text-white">{activeLabel}</h1>
          </div>
        </div>
        <button className="button-ghost-luxe h-11 w-11 rounded-full p-0" aria-label="Notificaciones">
          <Bell size={18} />
        </button>
      </header>

      <main className="space-y-6">
        {(loading || !metrics) && <p className="text-[#a1a1aa]">Cargando...</p>}
        {error && <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</div>}

        {!loading && metrics && activeTab === 'dashboard' && (
          <TenantAdminOverviewTab metrics={metrics} todayAppts={todayAppts} getServiceName={getServiceName} getProfName={getProfName} />
        )}

        {!loading && activeTab === 'calendar' && <TenantAdminCalendarTab appointments={appointments} getServiceName={getServiceName} getProfName={getProfName} />}

        {!loading && activeTab === 'professionals' && (
          <TenantAdminProfessionalsTab
            professionals={professionals}
            savingProfessional={savingProfessional}
            onAddProfessional={onAddProfessional}
            onEditProfessional={onEditProfessional}
            onToggleProfessional={onToggleProfessional}
          />
        )}

        {!loading && activeTab === 'services' && (
          <TenantAdminServicesTab
            services={services}
            savingService={savingService}
            onAddService={onAddService}
            onEditService={onEditService}
            onRemoveService={onRemoveService}
          />
        )}

        {!loading && activeTab === 'settings' && (
          <TenantAdminSettingsTab tenant={tenant} onEditTenant={onEditTenant} savingTenant={savingTenant} />
        )}
      </main>
    </div>
  );
}
