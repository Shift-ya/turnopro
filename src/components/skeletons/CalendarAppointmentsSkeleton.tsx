import AppointmentCardSkeleton from './AppointmentCardSkeleton';

export default function CalendarAppointmentsSkeleton() {
  return (
    <div className="panel-light animate-pulse p-6">
      <div className="mb-5">
        <div className="mb-3 h-3 w-24 rounded bg-white/10"></div>
        <div className="h-6 w-40 rounded bg-white/10"></div>
      </div>

      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <AppointmentCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
