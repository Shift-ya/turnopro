export default function ServiceCardSkeleton() {
  return (
    <div className="panel-light animate-pulse p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mb-1 h-6 w-40 rounded bg-white/10"></div>
          <div className="mt-2 h-3 w-64 rounded bg-white/10"></div>
          <div className="mt-1 h-3 w-56 rounded bg-white/10"></div>
        </div>
        <div className="h-6 w-16 rounded bg-white/10"></div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <div className="h-10 w-28 rounded-full border border-white/10 bg-white/5"></div>
        <div className="h-10 w-32 rounded-full border border-white/10 bg-white/5"></div>
      </div>
      <div className="mt-5 flex gap-2 border-t border-white/10 pt-4">
        <div className="h-11 w-11 rounded-full bg-white/10"></div>
        <div className="h-11 w-11 rounded-full bg-white/10"></div>
      </div>
    </div>
  );
}
