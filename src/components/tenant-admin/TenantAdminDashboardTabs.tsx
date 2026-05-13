import type { ApiAppointment, ApiProfessional, ApiService, ApiTenant } from '../../lib/api';
import type {
  TenantAdminDashboardData,
  TenantAdminProfessionalFormData,
  TenantAdminServiceFormData,
  TenantAdminTenantFormData,
} from '../../types/tenantAdminDashboard';
import CalendarAppointmentsPanel from './CalendarAppointmentsPanel';
import PerformancePanel from './PerformancePanel';
import ProfessionalsGrid from './ProfessionalsGrid';
import ServicesGrid from './ServicesGrid';
import TenantOverviewMetrics from './TenantOverviewMetrics';
import TenantSettingsPanel from './TenantSettingsPanel';
import TodayAppointmentsPanel from './TodayAppointmentsPanel';

interface TenantAdminOverviewTabProps {
  metrics: TenantAdminDashboardData['metrics'];
  todayAppts: ApiAppointment[];
  getServiceName: (id: string) => string;
  getProfName: (id: string) => string;
}

export function TenantAdminOverviewTab({ metrics, todayAppts, getServiceName, getProfName }: TenantAdminOverviewTabProps) {
  if (!metrics) {
    return null;
  }

  return (
    <div className="space-y-6">
      <TenantOverviewMetrics metrics={metrics} />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <TodayAppointmentsPanel todayAppts={todayAppts} getServiceName={getServiceName} getProfName={getProfName} />
        <PerformancePanel metrics={metrics} />
      </section>
    </div>
  );
}

interface TenantAdminCalendarTabProps {
  appointments: ApiAppointment[];
  getServiceName: (id: string) => string;
  getProfName: (id: string) => string;
}

export function TenantAdminCalendarTab({ appointments, getServiceName, getProfName }: TenantAdminCalendarTabProps) {
  return <CalendarAppointmentsPanel appointments={appointments} getServiceName={getServiceName} getProfName={getProfName} />;
}

interface TenantAdminProfessionalsTabProps {
  professionals: ApiProfessional[];
  savingProfessional: boolean;
  onAddProfessional: (data: TenantAdminProfessionalFormData) => Promise<void>;
  onEditProfessional: (data: TenantAdminProfessionalFormData, professionalId: string) => Promise<void>;
  onToggleProfessional: (professional: ApiProfessional) => Promise<void>;
}

export function TenantAdminProfessionalsTab({
  professionals,
  savingProfessional,
  onAddProfessional,
  onEditProfessional,
  onToggleProfessional,
}: TenantAdminProfessionalsTabProps) {
  return (
    <ProfessionalsGrid
      professionals={professionals}
      savingProfessional={savingProfessional}
      onAddProfessional={onAddProfessional}
      onEditProfessional={onEditProfessional}
      onToggleProfessional={onToggleProfessional}
    />
  );
}

interface TenantAdminServicesTabProps {
  services: ApiService[];
  savingService: boolean;
  onAddService: (data: TenantAdminServiceFormData) => Promise<void>;
  onEditService: (data: TenantAdminServiceFormData, serviceId: string) => Promise<void>;
  onRemoveService: (service: ApiService) => Promise<void>;
}

export function TenantAdminServicesTab({ services, savingService, onAddService, onEditService, onRemoveService }: TenantAdminServicesTabProps) {
  return (
    <ServicesGrid
      services={services}
      savingService={savingService}
      onAddService={onAddService}
      onEditService={onEditService}
      onRemoveService={onRemoveService}
    />
  );
}

interface TenantAdminSettingsTabProps {
  tenant: ApiTenant | null;
  onEditTenant: (data: TenantAdminTenantFormData) => Promise<void>;
  savingTenant: boolean;
}

export function TenantAdminSettingsTab({ tenant, onEditTenant, savingTenant }: TenantAdminSettingsTabProps) {
  return <TenantSettingsPanel tenant={tenant} onEditTenant={onEditTenant} savingTenant={savingTenant} />;
}
