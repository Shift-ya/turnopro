export default function ProfessionalCardSkeleton() {
  return (
    <div className="panel-light animate-pulse p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="mb-1 h-6 w-32 rounded bg-white/10"></div>
          <div className="mt-1 h-3 w-20 rounded bg-white/10"></div>
        </div>
        <div className="h-6 w-16 rounded bg-white/10"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-40 rounded bg-white/10"></div>
        <div className="h-3 w-40 rounded bg-white/10"></div>
      </div>
      <div className="mt-5 flex gap-2 border-t border-white/10 pt-4">
        <div className="h-11 w-11 rounded-full bg-white/10"></div>
        <div className="h-11 w-11 rounded-full bg-white/10"></div>
      </div>
    </div>
  );
}
