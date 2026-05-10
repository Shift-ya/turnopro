import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Bell,
  Briefcase,
  CalendarDays,
  Clock,
  DollarSign,
  LogOut,
  Menu,
  Power,
  Settings,
  Sparkles,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../components/ui/MetricCard';
import StatusBadge from '../components/ui/StatusBadge';
import { Input } from '../components/ui/input';
import { EditProfessionalDialog } from '../components/dialogs/EditProfessionalDialog';
import { EditServiceDialog } from '../components/dialogs/EditServiceDialog';
import { CreateServiceDialog } from '../components/dialogs/CreateServiceDialog';
import { CreateProfessionalDialog } from '../components/dialogs/CreateProfessionalDialog';
import { EditTenantDialog } from '../components/dialogs/EditTenantDialog';
import { ConfirmDeleteDialog } from '../components/dialogs/ConfirmDeleteDialog';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { TOAST_MESSAGES } from '../types/toast';
import { api, type ApiAppointment, type ApiProfessional, type ApiService, type ApiTenant } from '../lib/api';

type Tab = 'dashboard' | 'calendar' | 'professionals' | 'services' | 'settings';
type AppointmentFilterStatus = '' | ApiAppointment['status'];

const APPOINTMENT_STATUSES: Array<{ value: AppointmentFilterStatus; label: string }> = [
  { value: '', label: 'Todos los estados' },
  { value: 'BOOKED', label: 'Reservado' },
  { value: 'CONFIRMED', label: 'Confirmado' },
  { value: 'CANCELLED', label: 'Cancelado' },
  { value: 'COMPLETED', label: 'Completado' },
  { value: 'NO_SHOW', label: 'No show' },
];

const navItems: { id: Tab; label: string; icon: React.ReactNode; caption: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={18} />, caption: 'KPIs y foco diario' },
  { id: 'calendar', label: 'Calendario', icon: <CalendarDays size={18} />, caption: 'Agenda completa' },
  { id: 'professionals', label: 'Profesionales', icon: <Users size={18} />, caption: 'Equipo activo' },
  { id: 'services', label: 'Servicios', icon: <Briefcase size={18} />, caption: 'Oferta comercial' },
  { id: 'settings', label: 'Configuracion', icon: <Settings size={18} />, caption: 'Identidad y datos' },
];

function parseDateFilter(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const match = trimmed.match(/^(\d{2})\.(\d{2})\.(\d{2}|\d{4})$/);
  if (!match) return undefined;

  const [, day, month, year] = match;
  const normalizedYear = year.length === 2 ? `20${year}` : year;
  return `${normalizedYear}-${month}-${day}`;
}

function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 6) return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;

  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
}

function hasCompleteDate(value: string): boolean {
  return value.length === 8 || value.length === 10;
}

function formatDateLabel(value: string): string {
  const [year, month, day] = value.split('-');
  if (!year || !month || !day) return value;
  return `${day}.${month}.${year.slice(-2)}`;
}

export default function TenantAdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { success, error: showError } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingProfessional, setSavingProfessional] = useState(false);
  const [savingService, setSavingService] = useState(false);
  const [savingTenant, setSavingTenant] = useState(false);

  const [tenant, setTenant] = useState<ApiTenant | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
  const [calendarAppointments, setCalendarAppointments] = useState<ApiAppointment[]>([]);
  const [professionals, setProfessionals] = useState<ApiProfessional[]>([]);
  const [services, setServices] = useState<ApiService[]>([]);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [calendarFilters, setCalendarFilters] = useState({
    professionalId: '',
    date: '',
    serviceId: '',
    clientName: '',
    status: '' as AppointmentFilterStatus,
  });

  const tenantId = user?.tenantId;

  const loadData = async () => {
    if (!tenantId) return;

    try {
      setLoading(true);
      setError('');
      const overview = await api.tenantOverview(tenantId);
      setTenant(overview.tenant);
      setMetrics(overview.metrics);
      setAppointments(overview.appointments);
      setCalendarAppointments(overview.appointments.slice().sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`)));
      setProfessionals(overview.professionals);
      setServices(overview.services);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudieron cargar los datos del tenant');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  const loadCalendarAppointments = async (filters = calendarFilters) => {
    if (!tenantId) return;

    const parsedDate = parseDateFilter(filters.date);
    const hasDateValue = filters.date.trim().length > 0;
    const dateIsComplete = hasCompleteDate(filters.date.trim());

    if (hasDateValue && dateIsComplete && !parsedDate) {
      setError('La fecha debe tener formato dd.mm.aa o dd.mm.aaaa');
      return;
    }

    try {
      setLoadingCalendar(true);
      setError('');
      const data = await api.listTenantAppointments(tenantId, {
        professionalId: filters.professionalId || undefined,
        date: dateIsComplete ? parsedDate : undefined,
        serviceId: filters.serviceId || undefined,
        clientName: filters.clientName.trim() || undefined,
        status: filters.status || undefined,
      });
      setCalendarAppointments(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cargar la agenda');
    } finally {
      setLoadingCalendar(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'calendar') {
      loadCalendarAppointments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, tenantId]);

  useEffect(() => {
    if (activeTab !== 'calendar' || !tenantId) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      loadCalendarAppointments(calendarFilters);
    }, 250);

    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarFilters, activeTab, tenantId]);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const getServiceName = (id: string) => services.find((service) => service.id === id)?.name || 'Servicio';
  const getProfName = (id: string) => professionals.find((professional) => professional.id === id)?.name || 'Profesional';

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppts = useMemo(() => appointments.filter((item) => item.date === todayStr), [appointments, todayStr]);

  const addProfessional = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    speciality: string;
    active: boolean;
  }) => {
    if (!tenantId) return;

    setSavingProfessional(true);
    try {
      await api.createTenantProfessional(tenantId, data);
      await loadData();
      success(TOAST_MESSAGES.professional.createSuccess);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error al crear profesional';
      setError(message);
      showError({
        title: TOAST_MESSAGES.professional.createError.title,
        message: TOAST_MESSAGES.professional.createError.message,
      });
    } finally {
      setSavingProfessional(false);
    }
  };

  const editProfessional = async (
    data: { firstName: string; lastName: string; email: string; phone: string; speciality: string; active: boolean },
    professionalId: string,
  ) => {
    if (!tenantId) return;

    setSavingProfessional(true);
    try {
      await api.updateTenantProfessional(tenantId, professionalId, data);
      await loadData();
      success(TOAST_MESSAGES.professional.updateSuccess);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error al actualizar profesional';
      setError(message);
      showError({
        title: TOAST_MESSAGES.professional.updateError.title,
        message: TOAST_MESSAGES.professional.updateError.message,
      });
    } finally {
      setSavingProfessional(false);
    }
  };

  const toggleProfessional = async (professional: ApiProfessional) => {
    if (!tenantId) return;
    const [firstName, ...rest] = professional.name.split(' ');

    await api.updateTenantProfessional(tenantId, professional.id, {
      firstName,
      lastName: rest.join(' ') || '-',
      email: professional.email || '',
      phone: professional.phone || '',
      speciality: professional.speciality || '',
      active: !professional.active,
    });
    await loadData();
  };

  const addService = async (data: { name: string; description: string; duration: number; price: number; category: string }) => {
    if (!tenantId) return;

    setSavingService(true);
    try {
      await api.createTenantService(tenantId, {
        name: data.name,
        description: data.description,
        duration: data.duration,
        price: data.price,
        category: data.category,
        active: true,
      });
      await loadData();
      success(TOAST_MESSAGES.service.createSuccess);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error al crear servicio';
      setError(message);
      showError({
        title: TOAST_MESSAGES.service.createError.title,
        message: TOAST_MESSAGES.service.createError.message,
      });
    } finally {
      setSavingService(false);
    }
  };

  const editService = async (
    data: { name: string; description: string; duration: number; price: number; active: boolean; category: string },
    serviceId: string,
  ) => {
    if (!tenantId) return;

    setSavingService(true);
    try {
      await api.updateTenantService(tenantId, serviceId, data);
      await loadData();
      success(TOAST_MESSAGES.service.updateSuccess);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error al actualizar servicio';
      setError(message);
      showError({
        title: TOAST_MESSAGES.service.updateError.title,
        message: TOAST_MESSAGES.service.updateError.message,
      });
    } finally {
      setSavingService(false);
    }
  };

  const removeService = async (service: ApiService) => {
    if (!tenantId) return;

    try {
      await api.deleteTenantService(tenantId, service.id);
      await loadData();
      success(TOAST_MESSAGES.service.deleteSuccess);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error al eliminar servicio';
      setError(message);
      showError({
        title: TOAST_MESSAGES.service.deleteError.title,
        message: TOAST_MESSAGES.service.deleteError.message,
      });
    }
  };

  const editTenant = async (data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    slug: string;
    primaryColor: string;
  }) => {
    if (!tenantId) return;

    setSavingTenant(true);
    try {
      await api.updateTenantSettings(tenantId, {
        businessName: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        slug: data.slug,
        primaryColor: data.primaryColor,
      });
      await loadData();
      success({
        title: 'Informacion actualizada',
        message: 'Los cambios se guardaron correctamente',
      });
    } catch (e) {
      showError({
        title: 'Error al actualizar',
        message: 'No se pudieron guardar los cambios',
      });
    } finally {
      setSavingTenant(false);
    }
  };

  const resetCalendarFilters = async () => {
    const emptyFilters = {
      professionalId: '',
      date: '',
      serviceId: '',
      clientName: '',
      status: '' as AppointmentFilterStatus,
    };
    setCalendarFilters(emptyFilters);
    await loadCalendarAppointments(emptyFilters);
  };

  if (!tenantId) {
    return <div className="app-shell grid min-h-screen place-items-center">Usuario sin tenant asignado</div>;
  }

  return (
    <div className="app-shell min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-7xl gap-6">
        <aside
          className={`panel-dark fixed inset-y-5 left-4 z-40 w-[292px] px-5 py-5 transition-transform lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">Workspace</p>
                <h2 className="mt-2 font-['Space_Grotesk'] text-2xl font-bold tracking-[-0.05em] text-white">
                  {tenant?.name || 'Tenant'}
                </h2>
              </div>
              <button className="text-stone-300 lg:hidden" onClick={() => setSidebarOpen(false)}>
                <X size={20} />
              </button>
            </div>


            <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-[22px] px-4 py-3 text-left transition ${
                    activeTab === item.id ? 'bg-[#5e92ff]/14 text-white' : 'text-stone-300 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">{item.label}</span>
                    <span className={`block text-xs ${activeTab === item.id ? 'text-[#9ac0ff]' : 'text-stone-500'}`}>{item.caption}</span>
                  </span>
                </button>
              ))}
            </nav>

            <div className="mt-auto space-y-3 rounded-[26px] border border-white/10 bg-white/5 p-4">
              <button onClick={() => navigate('/booking')} className="button-luxe w-full rounded-2xl">
                <Sparkles size={16} /> Ver pagina publica
              </button>
              <button onClick={handleLogout} className="button-ghost-luxe w-full rounded-2xl border-white/10 bg-white/0 text-stone-200 hover:bg-white/10 hover:text-white">
                <LogOut size={16} /> Cerrar sesion
              </button>
            </div>
          </div>
        </aside>

        {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/55 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        <div className="min-w-0 flex-1">
          <header className="panel-light mb-6 flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button className="button-ghost-luxe h-11 w-11 rounded-full p-0 lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu size={18} />
              </button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#2ed7ff]">Panel operativo</p>
                <h1 className="font-['Space_Grotesk'] text-3xl font-bold tracking-[-0.05em] text-white">
                  {navItems.find((item) => item.id === activeTab)?.label}
                </h1>
              </div>
            </div>
            <button className="button-ghost-luxe h-11 w-11 rounded-full p-0">
              <Bell size={18} />
            </button>
          </header>

          <main className="space-y-6">
            {(loading || !metrics) && <p className="text-[#a1a1aa]">Cargando...</p>}
            {error && <div className="rounded-[24px] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</div>}

            {!loading && metrics && activeTab === 'dashboard' && (
              <div className="space-y-6">
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <MetricCard title="Turnos hoy" value={metrics.todayAppointments} icon={<CalendarDays size={20} />} />
                  <MetricCard title="Esta semana" value={metrics.weekAppointments} icon={<Clock size={20} />} />
                  <MetricCard title="Ingresos" value={`$${Math.round(metrics.revenue).toLocaleString()}`} icon={<DollarSign size={20} />} />
                  <MetricCard title="Total turnos" value={metrics.totalAppointments} icon={<UserCheck size={20} />} />
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="panel-light p-6">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#2ed7ff]">Agenda del dia</p>
                        <h2 className="mt-2 font-['Space_Grotesk'] text-2xl font-bold tracking-[-0.05em] text-white">Turnos de hoy</h2>
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-[#a1a1aa]">
                        {todayAppts.length} reservas
                      </div>
                    </div>

                    {todayAppts.length === 0 ? (
                      <div className="soft-card p-5 text-sm text-[#a1a1aa]">No hay turnos para hoy.</div>
                    ) : (
                      <div className="space-y-3">
                        {todayAppts.map((appointment) => (
                          <div key={appointment.id} className="soft-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                            <div className="w-24 shrink-0">
                              <p className="font-['Space_Grotesk'] text-2xl font-bold tracking-[-0.05em] text-white">
                                {appointment.startTime.slice(0, 5)}
                              </p>
                              <p className="text-xs uppercase tracking-[0.18em] text-[#2ed7ff]">{appointment.endTime.slice(0, 5)}</p>
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

                  <div className="panel-dark p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">Rendimiento</p>
                    <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-bold tracking-[-0.05em] text-white">
                      La operacion se entiende de un vistazo.
                    </h2>
                    <div className="mt-6 grid gap-3">
                      {[
                        ['Completados', `${metrics.completedRate}%`],
                        ['Cancelados', `${metrics.cancelledRate}%`],
                        ['No show', `${metrics.noShowRate}%`],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{label}</p>
                          <p className="mt-2 font-['Space_Grotesk'] text-3xl font-bold tracking-[-0.05em] text-white">{value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex items-center gap-3 rounded-[22px] border border-emerald-400/20 bg-emerald-400/10 px-4 py-4 text-sm text-emerald-100">
                      <TrendingUp size={16} />
                      Datos reales cargados desde API
                    </div>
                  </div>
                </section>
              </div>
            )}

            {!loading && activeTab === 'calendar' && (
              <div className="panel-light p-6">
                <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#2ed7ff]">Agenda completa</p>
                    <h2 className="mt-2 font-['Space_Grotesk'] text-2xl font-bold tracking-[-0.05em] text-white">Todas las reservas</h2>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-[#a1a1aa]">
                    {calendarAppointments.length} resultados
                  </div>
                </div>

                <div className="mb-6 grid gap-3 lg:grid-cols-2 2xl:grid-cols-5">
                  <Input
                    value={calendarFilters.clientName}
                    onChange={(event) => setCalendarFilters((current) => ({ ...current, clientName: event.target.value }))}
                    placeholder="Cliente que reserva"
                  />

                  <Input
                    value={calendarFilters.date}
                    onChange={(event) =>
                      setCalendarFilters((current) => ({
                        ...current,
                        date: formatDateInput(event.target.value),
                      }))
                    }
                    placeholder="Fecha dd.mm.aa"
                  />

                  <select
                    value={calendarFilters.professionalId}
                    onChange={(event) => setCalendarFilters((current) => ({ ...current, professionalId: event.target.value }))}
                    className="flex h-11 w-full rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 py-2 text-sm text-white outline-none transition focus:border-[#5e92ff] focus:bg-[#0f111a] focus:ring-4 focus:ring-[#5e92ff]/15"
                  >
                    <option value="">Todos los profesionales</option>
                    {professionals.map((professional) => (
                      <option key={professional.id} value={professional.id}>
                        {professional.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={calendarFilters.serviceId}
                    onChange={(event) => setCalendarFilters((current) => ({ ...current, serviceId: event.target.value }))}
                    className="flex h-11 w-full rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 py-2 text-sm text-white outline-none transition focus:border-[#5e92ff] focus:bg-[#0f111a] focus:ring-4 focus:ring-[#5e92ff]/15"
                  >
                    <option value="">Todos los servicios</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={calendarFilters.status}
                    onChange={(event) =>
                      setCalendarFilters((current) => ({
                        ...current,
                        status: event.target.value as AppointmentFilterStatus,
                      }))
                    }
                    className="flex h-11 w-full rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 py-2 text-sm text-white outline-none transition focus:border-[#5e92ff] focus:bg-[#0f111a] focus:ring-4 focus:ring-[#5e92ff]/15"
                  >
                    {APPOINTMENT_STATUSES.map((status) => (
                      <option key={status.label} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6 flex flex-wrap gap-3">
                  <button onClick={resetCalendarFilters} className="button-ghost-luxe rounded-2xl" disabled={loadingCalendar}>
                    Limpiar filtros
                  </button>
                </div>

                {loadingCalendar ? (
                  <div className="soft-card p-5 text-sm text-[#a1a1aa]">Cargando agenda filtrada...</div>
                ) : calendarAppointments.length === 0 ? (
                  <div className="soft-card p-5 text-sm text-[#a1a1aa]">Sin turnos cargados.</div>
                ) : (
                  <div className="space-y-3">
                    {calendarAppointments.map((appointment) => (
                        <div key={appointment.id} className="soft-card flex flex-col gap-3 p-4 xl:flex-row xl:items-center">
                          <div className="w-40 shrink-0 text-sm font-semibold text-[#bfd0ff]">
                            {formatDateLabel(appointment.date)} {appointment.startTime.slice(0, 5)}
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
            )}

            {!loading && activeTab === 'professionals' && (
              <div className="space-y-4">
                <div className="panel-light flex justify-end px-5 py-5">
                  <CreateProfessionalDialog onSave={addProfessional} isLoading={savingProfessional} />
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {professionals.map((professional) => (
                    <div key={professional.id} className="panel-light p-5">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                          <p className="font-['Space_Grotesk'] text-2xl font-bold tracking-[-0.05em] text-white">{professional.name}</p>
                          <p className="mt-1 text-sm text-[#a1a1aa]">{professional.speciality || 'General'}</p>
                        </div>
                        <StatusBadge status={professional.active ? 'ACTIVE' : 'SUSPENDED'} />
                      </div>
                      <div className="space-y-2 text-sm text-[#a1a1aa]">
                        <p>{professional.email || 'Sin email'}</p>
                        <p>{professional.phone || 'Sin telefono'}</p>
                      </div>
                      <div className="mt-5 flex gap-2 border-t border-white/10 pt-4">
                        <EditProfessionalDialog
                          professional={professional}
                          onSave={(data) => editProfessional(data, professional.id)}
                          isLoading={savingProfessional}
                        />
                        <button onClick={() => toggleProfessional(professional)} className="button-ghost-luxe h-11 w-11 rounded-full p-0">
                          <Power size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && activeTab === 'services' && (
              <div className="space-y-4">
                <div className="panel-light flex justify-end px-5 py-5">
                  <CreateServiceDialog onSave={addService} isLoading={savingService} />
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {services.map((service) => (
                    <div key={service.id} className="panel-light p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-['Space_Grotesk'] text-2xl font-bold tracking-[-0.05em] text-white">{service.name}</h3>
                          <p className="mt-2 text-sm leading-7 text-[#a1a1aa]">{service.description}</p>
                        </div>
                        <StatusBadge status={service.active ? 'ACTIVE' : 'SUSPENDED'} />
                      </div>
                      <div className="mt-5 flex flex-wrap gap-3 text-sm">
                        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/85">
                          <span className="inline-flex items-center gap-2">
                            <Clock size={14} /> {service.duration} min
                          </span>
                        </div>
                        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/85">
                          <span className="inline-flex items-center gap-2">
                            <DollarSign size={14} /> ${service.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-5 flex gap-2 border-t border-white/10 pt-4">
                        <EditServiceDialog service={service} onSave={(data) => editService(data, service.id)} isLoading={savingService} />
                        <ConfirmDeleteDialog
                          description={`Estas seguro de que deseas eliminar el servicio "${service.name}"? Esta accion no se puede deshacer.`}
                          onConfirm={() => removeService(service)}
                        >
                          <button className="flex h-11 w-11 items-center justify-center rounded-full border border-rose-400/20 bg-rose-400/10 text-rose-200 transition hover:bg-rose-400/20">
                            <Trash2 size={14} />
                          </button>
                        </ConfirmDeleteDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && activeTab === 'settings' && (
              <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
                <div className="panel-light p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#2ed7ff]">Identidad del negocio</p>
                  <h2 className="mt-2 font-['Space_Grotesk'] text-2xl font-bold tracking-[-0.05em] text-white">Configuracion general</h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {[
                      ['Nombre', tenant?.name],
                      ['Email', tenant?.email],
                      ['Telefono', tenant?.phone || '-'],
                      ['Direccion', tenant?.address || '-'],
                      ['Slug publico', tenant?.slug],
                    ].map(([label, value]) => (
                      <div key={label} className="soft-card p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2ed7ff]">{label}</p>
                        <p className="mt-2 text-sm font-semibold text-white">{value}</p>
                      </div>
                    ))}
                    <div className="soft-card p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2ed7ff]">Color primario</p>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full border border-white/10" style={{ backgroundColor: tenant?.primaryColor || '#5e92ff' }} />
                        <p className="text-sm font-semibold text-white">{tenant?.primaryColor || '#5e92ff'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    {tenant && <EditTenantDialog tenant={tenant} onSave={editTenant} isLoading={savingTenant} />}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
