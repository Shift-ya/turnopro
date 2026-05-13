export default function PlanCardSkeleton() {
  return (
    <div className="panel-light animate-pulse space-y-4 p-6">
      <div className="h-6 w-32 rounded bg-white/10"></div>
      <div className="h-12 w-40 rounded bg-white/10"></div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-white/10"></div>
        <div className="h-3 w-full rounded bg-white/10"></div>
        <div className="h-3 w-3/4 rounded bg-white/10"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-10 flex-1 rounded-lg bg-white/10"></div>
        <div className="h-10 flex-1 rounded-lg bg-white/10"></div>
      </div>
    </div>
  );
}
