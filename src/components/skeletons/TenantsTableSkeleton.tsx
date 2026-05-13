import TenantCardSkeleton from './TenantCardSkeleton';

export default function TenantsTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="panel-light flex flex-col gap-4 animate-pulse px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-10 w-full rounded-lg border border-white/10 bg-white/5 sm:max-w-md"></div>
        <div className="h-11 w-40 rounded-full bg-white/10"></div>
      </div>

      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <TenantCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
