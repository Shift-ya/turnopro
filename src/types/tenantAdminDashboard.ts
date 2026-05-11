import type { ApiAppointment, ApiProfessional, ApiService, ApiTenant, ApiTenantOverview } from '../lib/api';
import type { DashboardNavItem } from './dashboard';

export type TenantAdminTab = 'dashboard' | 'calendar' | 'professionals' | 'services' | 'settings';

export type TenantAdminNavItem = DashboardNavItem<TenantAdminTab>;

export interface TenantAdminProfessionalFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  speciality: string;
  active: boolean;
}

export interface TenantAdminServiceFormData {
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  active?: boolean;
}

export interface TenantAdminTenantFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  slug: string;
  primaryColor: string;
}

export interface TenantAdminDashboardData {
  tenant: ApiTenant | null;
  metrics: ApiTenantOverview['metrics'] | null;
  appointments: ApiAppointment[];
  professionals: ApiProfessional[];
  services: ApiService[];
}
