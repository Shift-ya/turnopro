import StatusBadge from '../ui/StatusBadge';
import type { ApiAppointment } from '../../lib/api';

interface Props {
  todayAppts: ApiAppointment[];
  getServiceName: (id: string) => string;
  getProfName: (id: string) => string;
}

export default function TodayAppointmentsPanel({ todayAppts, getServiceName, getProfName }: Props) {
  return (
    <div className="panel-light p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-500">Agenda del dia</p>
          <h2 className="mt-2 font-['Space_Grotesk'] text-2xl font-bold tracking-[-0.05em] text-white">Turnos de hoy</h2>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-[#a1a1aa]">{todayAppts.length} reservas</div>
      </div>

      {todayAppts.length === 0 ? (
        <div className="soft-card p-5 text-sm text-[#a1a1aa]">No hay turnos para hoy.</div>
      ) : (
        <div className="space-y-3">
          {todayAppts.map((appointment) => (
            <div key={appointment.id} className="soft-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <div className="w-24 shrink-0">
                <p className="font-['Space_Grotesk'] text-2xl font-bold tracking-[-0.05em] text-white">{appointment.startTime.slice(0, 5)}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-accent-500">{appointment.endTime.slice(0, 5)}</p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold text-white">{appointment.clientName}</p>
                <p className="mt-1 text-sm text-[#a1a1aa]">
                  {getServiceName(appointment.serviceId)} - {getProfName(appointment.professionalId)}
                </p>
              </div>
              <StatusBadge status={appointment.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
