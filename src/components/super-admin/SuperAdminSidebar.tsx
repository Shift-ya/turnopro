import { Activity } from 'lucide-react';
import { DashboardSidebar } from '../dashboard/DashboardSidebar';
import type { SuperAdminNavItem, SuperAdminTab } from '../../types/superAdminDashboard';
import type { User } from '../../types';

interface SuperAdminSidebarProps {
  activeTab: SuperAdminTab;
  navItems: SuperAdminNavItem[];
  sidebarOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: SuperAdminTab) => void;
  onLogout: () => void;
  metrics?: {
    activeTenants: number;
  } | null;
  user: User | null;
}

export function SuperAdminSidebar({
  activeTab,
  navItems,
  sidebarOpen,
  onClose,
  onSelectTab,
  onLogout,
  metrics,
  user,
}: SuperAdminSidebarProps) {
  return (
    <DashboardSidebar<SuperAdminTab>
      brand={
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-[#0f1222] text-accent-500">
            <Activity size={18} />
          </div>
          <div>
            <p className="font-['Space_Grotesk'] text-xl font-bold tracking-[-0.05em] text-white">turnow</p>
            <p className="text-xs uppercase tracking-[0.22em] text-stone-400">super admin</p>
          </div>
        </div>
      }
      status={
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Estado plataforma</p>
          <p className="mt-3 font-['Space_Grotesk'] text-3xl font-bold tracking-[-0.05em] text-white">
            {metrics?.activeTenants ?? '--'}
          </p>
          <p className="mt-2 text-sm text-stone-300">clientes activos operando hoy</p>
        </div>
      }
      navItems={navItems}
      activeTab={activeTab}
      sidebarOpen={sidebarOpen}
      onClose={onClose}
      onSelectTab={onSelectTab}
      footer={
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
              <p className="truncate text-xs text-stone-400">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="button-ghost-luxe w-full rounded-2xl border-white/10 bg-white/0 text-stone-200 hover:bg-white/10 hover:text-white"
          >
            Cerrar sesion
          </button>
        </div>
      }
    />
  );
}
