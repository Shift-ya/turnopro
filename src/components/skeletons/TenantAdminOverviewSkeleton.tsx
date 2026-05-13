import TenantOverviewMetricsSkeleton from './TenantOverviewMetricsSkeleton';
import TodayAppointmentsSkeleton from './TodayAppointmentsSkeleton';
import PerformancePanelSkeleton from './PerformancePanelSkeleton';

export default function TenantAdminOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <TenantOverviewMetricsSkeleton />
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <TodayAppointmentsSkeleton />
        <PerformancePanelSkeleton />
      </section>
    </div>
  );
}
