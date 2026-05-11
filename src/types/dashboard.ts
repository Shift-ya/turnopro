import type { ReactNode } from 'react';

export interface DashboardNavItem<TTab extends string = string> {
  id: TTab;
  label: string;
  icon: ReactNode;
  caption: string;
}

export interface DashboardAction {
  key: string;
  node: ReactNode;
  ariaLabel?: string;
}

export interface DashboardShellProps<TTab extends string = string> {
  sidebarOpen: boolean;
  onCloseSidebar: () => void;
  onOpenSidebar: () => void;
  activeTab: TTab;
  navItems: DashboardNavItem<TTab>[];
  title: string;
  eyebrow: string;
  subtitle?: string;
  onSelectTab: (tab: TTab) => void;
  children: ReactNode;
  sidebar: ReactNode;
  actions?: DashboardAction[];
  overlay?: ReactNode;
}
