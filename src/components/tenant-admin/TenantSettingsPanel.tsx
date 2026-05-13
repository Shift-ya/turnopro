import { EditTenantDialog } from '../dialogs/EditTenantDialog';
import type { ApiTenant } from '../../lib/api';
import type { TenantAdminTenantFormData } from '../../types/tenantAdminDashboard';

interface Props {
  tenant: ApiTenant | null;
  onEditTenant: (data: TenantAdminTenantFormData) => Promise<void>;
  savingTenant: boolean;
}

export default function TenantSettingsPanel({ tenant, onEditTenant, savingTenant }: Props) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
      <div className="panel-light p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-500">Identidad del negocio</p>
        <h2 className="mt-2 font-['Space_Grotesk'] text-2xl font-bold tracking-[-0.05em] text-white">Configuracion general</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            ['Nombre', tenant?.name],
            ['Email', tenant?.email],
            ['Telefono', tenant?.phone || '-'],
            ['Direccion', tenant?.address || '-'],
            ['Slug publico', tenant?.slug],
          ].map(([label, value]) => (
            <div key={label} className="soft-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-500">{label}</p>
              <p className="mt-2 text-sm font-semibold text-white">{value}</p>
            </div>
          ))}
          <div className="soft-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-500">Color primario</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full border border-white/10" style={{ backgroundColor: tenant?.primaryColor || '#5e92ff' }} />
              <p className="text-sm font-semibold text-white">{tenant?.primaryColor || '#5e92ff'}</p>
            </div>
          </div>
        </div>
        <div className="mt-6">{tenant && <EditTenantDialog tenant={tenant} onSave={onEditTenant} isLoading={savingTenant} />}</div>
      </div>
    </div>
  );
}
