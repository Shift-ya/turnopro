import ProfessionalCardSkeleton from './ProfessionalCardSkeleton';

export default function ProfessionalsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="panel-light flex justify-end px-5 py-5">
        <div className="h-11 w-40 rounded-full bg-white/10"></div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <ProfessionalCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
