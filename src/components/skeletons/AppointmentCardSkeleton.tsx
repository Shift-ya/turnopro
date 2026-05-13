export default function AppointmentCardSkeleton() {
  return (
    <div className="soft-card animate-pulse p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-24 shrink-0">
          <div className="mb-2 h-6 w-16 rounded bg-white/10"></div>
          <div className="h-3 w-12 rounded bg-white/10"></div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 h-4 w-32 rounded bg-white/10"></div>
          <div className="h-3 w-48 rounded bg-white/10"></div>
        </div>
        <div className="h-6 w-20 rounded bg-white/10"></div>
      </div>
    </div>
  );
}
