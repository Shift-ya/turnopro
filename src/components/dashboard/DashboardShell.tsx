import type { DashboardShellProps } from '../../types/dashboard';
import { DashboardHeader } from './DashboardHeader';

export function DashboardShell<TTab extends string>({
  sidebarOpen,
  onCloseSidebar,
  onOpenSidebar,
  activeTab,
  navItems,
  title,
  eyebrow,
  subtitle,
  onSelectTab,
  children,
  sidebar,
  actions,
  overlay,
}: DashboardShellProps<TTab>) {
  return (
    <div className="app-shell min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-7xl gap-6">
        {sidebar}

        {overlay}

        <div className="min-w-0 flex-1">
          <DashboardHeader
            activeTab={activeTab}
            navItems={navItems}
            title={title}
            eyebrow={eyebrow}
            subtitle={subtitle}
            onOpenSidebar={onOpenSidebar}
            onSelectTab={onSelectTab}
            actions={actions}
          />

          <main className="space-y-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
