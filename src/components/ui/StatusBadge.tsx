interface Props {
  status: string;
  size?: 'sm' | 'md';
}

const colors: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  BOOKED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
  NO_SHOW: 'bg-amber-100 text-amber-700',
  SUSPENDED: 'bg-red-100 text-red-700',
  PENDING: 'bg-amber-100 text-amber-700',
  BASIC: 'bg-gray-100 text-gray-700',
  PROFESSIONAL: 'bg-blue-100 text-blue-700',
  PREMIUM: 'bg-purple-100 text-purple-700',
};

const labels: Record<string, string> = {
  ACTIVE: 'Activo',
  BOOKED: 'Reservado',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
  NO_SHOW: 'No asistió',
  SUSPENDED: 'Suspendido',
  PENDING: 'Pendiente',
  BASIC: 'Básico',
  PROFESSIONAL: 'Profesional',
  PREMIUM: 'Premium',
};

export default function StatusBadge({ status, size = 'sm' }: Props) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
      {labels[status] || status}
    </span>
  );
}
