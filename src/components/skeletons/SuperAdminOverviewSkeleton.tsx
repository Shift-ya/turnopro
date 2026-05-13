export default function SuperAdminOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 max-md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="soft-card animate-pulse p-4">
            <div className="mb-2 h-3 w-24 rounded bg-white/10"></div>
            <div className="h-8 w-20 rounded bg-white/10"></div>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <div className="mb-3 h-6 w-40 rounded bg-white/10 animate-pulse"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 animate-pulse">
            <div className="h-12 w-12 rounded-full bg-white/10"></div>
            <div className="flex-1">
              <div className="mb-2 h-4 w-32 rounded bg-white/10"></div>
              <div className="h-3 w-48 rounded bg-white/10"></div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
