import PlanCardSkeleton from './PlanCardSkeleton';

export default function PlansGridSkeleton() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <PlanCardSkeleton key={i} />
      ))}
    </section>
  );
}
