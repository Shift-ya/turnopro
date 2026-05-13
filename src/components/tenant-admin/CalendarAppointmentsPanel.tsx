import StatusBadge from '../ui/StatusBadge';
import type { ApiAppointment } from '../../lib/api';

interface Props {
  appointments: ApiAppointment[];
  getServiceName: (id: string) => string;
  getProfName: (id: string) => string;
}

export default function CalendarAppointmentsPanel({ appointments, getServiceName, getProfName }: Props) {
  return (
    <div className="panel-light p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-500">Agenda completa</p>
        <h2 className="mt-2 font-['Space_Grotesk'] text-2xl font-bold tracking-[-0.05em] text-white">Todas las reservas</h2>
      </div>
      {appointments.length === 0 ? (
        <div className="soft-card p-5 text-sm text-[#a1a1aa]">Sin turnos cargados.</div>
      ) : (
        <div className="space-y-3">
          {appointments
            .slice()
            .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`))
            .map((appointment) => (
              <div key={appointment.id} className="soft-card flex flex-col gap-3 p-4 xl:flex-row xl:items-center">
                <div className="w-40 shrink-0 text-sm font-semibold text-[#bfd0ff]">
                  {appointment.date} {appointment.startTime.slice(0, 5)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white">{appointment.clientName}</p>
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
