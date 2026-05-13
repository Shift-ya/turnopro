export default function PerformancePanelSkeleton() {
  return (
    <div className="panel-dark animate-pulse p-6">
      <div className="mb-3 h-3 w-20 rounded bg-white/10"></div>
      <div className="mt-3 h-8 w-64 rounded bg-white/10"></div>
      <div className="mt-6 grid gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4">
            <div className="h-3 w-24 rounded bg-white/10"></div>
            <div className="mt-2 h-6 w-16 rounded bg-white/10"></div>
          </div>
        ))}
      </div>
      <div className="mt-6 h-12 rounded-[22px] border border-white/10 bg-white/5"></div>
    </div>
  );
}
