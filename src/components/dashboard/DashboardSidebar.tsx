import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import type { DashboardNavItem } from '../../types/dashboard';

interface DashboardSidebarProps<TTab extends string> {
  brand: ReactNode;
  status?: ReactNode;
  navItems: DashboardNavItem<TTab>[];
  activeTab: TTab;
  sidebarOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: TTab) => void;
  footer: ReactNode;
  widthClassName?: string;
}

export function DashboardSidebar<TTab extends string>({
  brand,
  status,
  navItems,
  activeTab,
  sidebarOpen,
  onClose,
  onSelectTab,
  footer,
  widthClassName = 'w-[292px]',
}: DashboardSidebarProps<TTab>) {
  return (
    <aside
      className={`panel-dark fixed inset-y-5 left-4 z-40 ${widthClassName} px-5 py-5 transition-transform lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="mb-6 flex items-center justify-between gap-3">
          {brand}
          <button className="text-stone-300 lg:hidden" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {status && <div className="mb-6">{status}</div>}

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                onClose();
              }}
              className={`flex w-full items-center gap-3 rounded-[22px] px-4 py-3 text-left transition ${
                activeTab === item.id ? 'bg-[#5e92ff]/14 text-white' : 'text-stone-300 hover:bg-white/8 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">{item.label}</span>
                <span className={`block text-xs ${activeTab === item.id ? 'text-[#9ac0ff]' : 'text-stone-500'}`}>{item.caption}</span>
              </span>
            </button>
          ))}
        </nav>

        <div className="mt-auto">{footer}</div>
      </div>
    </aside>
  );
}
