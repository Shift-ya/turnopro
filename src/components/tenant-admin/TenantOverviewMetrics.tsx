import { CalendarDays, Clock, DollarSign, UserCheck } from 'lucide-react';
import MetricCard from '../ui/MetricCard';
import type { TenantAdminDashboardData } from '../../types/tenantAdminDashboard';

interface Props {
  metrics: TenantAdminDashboardData['metrics'];
}

export default function TenantOverviewMetrics({ metrics }: Props) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 max-md:grid-cols-2">
      <MetricCard title="Turnos hoy" value={metrics.todayAppointments} icon={<CalendarDays className="size-5 max-md:size-4" />} />
      <MetricCard title="Esta semana" value={metrics.weekAppointments} icon={<Clock className="size-5 max-md:size-4" />} />
      <MetricCard title="Ingresos" value={`$${Math.round(metrics.revenue).toLocaleString()}`} icon={<DollarSign className="size-5 max-md:size-4" />} />
      <MetricCard title="Total turnos" value={metrics.totalAppointments} icon={<UserCheck className="size-5 max-md:size-4" />} />
    </section>
  );
}
