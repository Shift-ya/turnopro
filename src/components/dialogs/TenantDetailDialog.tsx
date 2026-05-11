import * as React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import StatusBadge from '../ui/StatusBadge';
import type { ApiTenant } from '../../lib/api';

interface TenantDetailDialogProps {
  tenant: ApiTenant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TenantDetailDialog: React.FC<TenantDetailDialogProps> = ({ tenant, open, onOpenChange }) => {
  if (!tenant) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <div className="mb-2 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-500">Perfil cliente</p>
              <DialogTitle className="mt-2 font-['Space_Grotesk'] text-3xl font-bold tracking-[-0.05em] text-white">{tenant.name}</DialogTitle>
            </div>
            <button className="button-ghost-luxe h-11 w-11 rounded-full p-0" onClick={() => onOpenChange(false)} aria-label="Cerrar">
              <X size={18} />
            </button>
          </div>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ['Email', tenant.email],
            ['Telefono', tenant.phone],
            ['Direccion', tenant.address],
            ['Slug', tenant.slug],
            ['Fecha de alta', tenant.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : '-'],
          ].map(([label, value]) => (
            <div key={label} className="soft-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-500">{label}</p>
              <p className="mt-2 text-sm font-semibold text-white">{value || '-'}</p>
            </div>
          ))}
          <div className="soft-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-500">Plan</p>
            <div className="mt-3">
              <StatusBadge status={tenant.plan} size="md" />
            </div>
          </div>
          <div className="soft-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-500">Estado</p>
            <div className="mt-3">
              <StatusBadge status={tenant.status} size="md" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
