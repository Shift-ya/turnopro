export default function TenantCardSkeleton() {
  return (
    <div className="panel-light animate-pulse space-y-3 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2 h-5 w-32 rounded bg-white/10"></div>
          <div className="h-3 w-40 rounded bg-white/10"></div>
        </div>
        <div className="h-6 w-20 rounded bg-white/10"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-44 rounded bg-white/10"></div>
        <div className="h-3 w-40 rounded bg-white/10"></div>
      </div>
      <div className="flex gap-2 border-t border-white/10 pt-3">
        <div className="h-8 flex-1 rounded-lg bg-white/10"></div>
        <div className="h-8 flex-1 rounded-lg bg-white/10"></div>
      </div>
    </div>
  );
}
