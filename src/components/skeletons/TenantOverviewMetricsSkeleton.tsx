export default function TenantOverviewMetricsSkeleton() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 max-md:grid-cols-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="soft-card animate-pulse p-4">
          <div className="mb-2 h-3 w-24 rounded bg-white/10"></div>
          <div className="h-8 w-20 rounded bg-white/10"></div>
        </div>
      ))}
    </section>
  );
}
