import { LogOut, Sparkles } from 'lucide-react';
import { DashboardSidebar } from '../dashboard/DashboardSidebar';
import type { TenantAdminNavItem, TenantAdminTab } from '../../types/tenantAdminDashboard';

interface TenantAdminSidebarProps {
  tenantName: string;
  navItems: TenantAdminNavItem[];
  activeTab: TenantAdminTab;
  sidebarOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: TenantAdminTab) => void;
  onOpenPublicBooking: () => void;
  onLogout: () => void;
}

export function TenantAdminSidebar({
  tenantName,
  navItems,
  activeTab,
  sidebarOpen,
  onClose,
  onSelectTab,
  onOpenPublicBooking,
  onLogout,
}: TenantAdminSidebarProps) {
  return (
    <DashboardSidebar<TenantAdminTab>
      brand={
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">Workspace</p>
          <h2 className="mt-2 font-['Space_Grotesk'] text-2xl font-bold tracking-[-0.05em] text-white">{tenantName}</h2>
        </div>
      }
      navItems={navItems}
      activeTab={activeTab}
      sidebarOpen={sidebarOpen}
      onClose={onClose}
      onSelectTab={onSelectTab}
      status={null}
      footer={
        <div className="space-y-3 rounded-[26px] border border-white/10 bg-white/5 p-4">
          <button onClick={onOpenPublicBooking} className="button-luxe w-full rounded-2xl">
            <Sparkles size={16} /> Ver pagina publica
          </button>
          <button onClick={onLogout} className="button-ghost-luxe w-full rounded-2xl border-white/10 bg-white/0 text-stone-200 hover:bg-white/10 hover:text-white">
            <LogOut size={16} /> Cerrar sesion
          </button>
        </div>
      }
    />
  );
}
