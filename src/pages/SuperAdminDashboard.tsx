import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  DollarSign,
  Eye,
  Layers3,
  LogOut,
  Menu,
  Pause,
  Search,
  Settings,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../components/ui/MetricCard';
import StatusBadge from '../components/ui/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { CreateTenantDialog } from '../components/dialogs/CreateTenantDialog';
import { ConfirmDeleteDialog } from '../components/dialogs/ConfirmDeleteDialog';
import { api, type ApiGlobalOverview, type ApiTenant } from '../lib/api';

type Tab = 'overview' | 'tenants' | 'plans';

const navItems: { id: Tab; label: string; icon: React.ReactNode; caption: string }[] = [
  { id: 'overview', label: 'Dashboard', icon: <BarChart3 size={18} />, caption: 'Vista general' },
  { id: 'tenants', label: 'Clientes', icon: <Building2 size={18} />, caption: 'Base activa' },
  { id: 'plans', label: 'Planes', icon: <Layers3 size={18} />, caption: 'Monetizacion' },
];

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [search, setSearch] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<ApiTenant | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creatingTenant, setCreatingTenant] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState<ApiTenant | null>(null);
  const [deletingTenant, setDeletingTenant] = useState(false);

  const [metrics, setMetrics] = useState<ApiGlobalOverview | null>(null);
  const [tenants, setTenants] = useState<ApiTenant[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [overview, tenantList] = await Promise.all([api.superOverview(), api.listTenants(search)]);
      setMetrics(overview);
      setTenants(tenantList);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudieron cargar datos globales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const filteredTenants = useMemo(() => tenants, [tenants]);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const handleCreateTenant = async (data: { name: string; email: string; phone: string; address: string; slug: string; plan: string }) => {
    try {
      setCreatingTenant(true);
      await api.createTenant({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        slug: data.slug,
        plan: data.plan,
      });
      await loadData();
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear el cliente');
    } finally {
      setCreatingTenant(false);
    }
  };

  const toggleStatus = async (tenant: ApiTenant) => {
    const next = tenant.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    await api.updateTenantStatus(tenant.id, next);
    await loadData();
  };

  const handleRemoveTenant = async () => {
    if (!tenantToDelete) return;

    try {
      setDeletingTenant(true);
      await api.deleteTenant(tenantToDelete.id);
      await loadData();
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al eliminar el cliente');
    } finally {
      setDeletingTenant(false);
      setTenantToDelete(null);
    }
  };

  return (
    <div className="app-shell min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-7xl gap-6">
        <aside
          className={`panel-dark fixed inset-y-5 left-4 z-40 w-[290px] px-5 py-5 transition-transform lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-[#0f1222] text-[#5e92ff]">
                  <Activity size={18} />
                </div>
                <div>
                  <p className="font-['Space_Grotesk'] text-xl font-bold tracking-[-0.05em] text-white">turnow</p>
                  <p className="text-xs uppercase tracking-[0.22em] text-stone-400">super admin</p>
                </div>
              </div>
              <button className="text-stone-300 lg:hidden" onClick={() => setSidebarOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="mb-6 rounded-[26px] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Estado plataforma</p>
              <p className="mt-3 font-['Space_Grotesk'] text-3xl font-bold tracking-[-0.05em] text-white">
                {metrics?.activeTenants ?? '--'}
              </p>
              <p className="mt-2 text-sm text-stone-300">clientes activos operando hoy</p>
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
                    activeTab === item.id ? 'bg-[#5e92ff]/14 text-white' : 'bg-white/0 text-stone-300 hover:bg-white/8 hover:text-white'
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

            <div className="mt-auto rounded-[26px] border border-white/10 bg-white/5 p-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
                  {user?.name?.[0] || 'A'}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
                  <p className="truncate text-xs text-stone-400">{user?.email}</p>
                </div>
              </div>
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
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#2ed7ff]">Control global</p>
                <h1 className="font-['Space_Grotesk'] text-3xl font-bold tracking-[-0.05em] text-white">
                  {navItems.find((item) => item.id === activeTab)?.label}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="button-ghost-luxe h-11 w-11 rounded-full p-0">
                <Bell size={18} />
              </button>
              <button className="button-ghost-luxe h-11 w-11 rounded-full p-0">
                <Settings size={18} />
              </button>
            </div>
          </header>

          <main className="space-y-6">
            {loading && <p className="text-[#a1a1aa]">Cargando...</p>}
            {error && <div className="rounded-[24px] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</div>}

            {!loading && metrics && activeTab === 'overview' && (
              <div className="space-y-6">
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <MetricCard title="Total clientes" value={metrics.totalTenants} icon={<Building2 size={20} />} />
                  <MetricCard title="Clientes activos" value={metrics.activeTenants} icon={<Users size={20} />} />
                  <MetricCard title="Turnos totales" value={metrics.totalAppointments.toLocaleString()} icon={<CalendarDays size={20} />} />
                  <MetricCard title="MRR estimado" value={`$${metrics.totalRevenue.toLocaleString()}`} icon={<DollarSign size={20} />} />
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                  <div className="panel-light p-6">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#2ed7ff]">Actividad reciente</p>
                        <h2 className="mt-2 font-['Space_Grotesk'] text-2xl font-bold tracking-[-0.05em] text-white">Ultimos clientes incorporados</h2>
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-[#a1a1aa]">
                        {tenants.length} cuentas
                      </div>
                    </div>

                    <div className="space-y-3">
                      {tenants.slice(0, 6).map((tenant) => (
                        <div key={tenant.id} className="soft-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-base font-semibold text-white">{tenant.name}</p>
                            <p className="mt-1 text-sm text-[#a1a1aa]">{tenant.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={tenant.plan} />
                            <StatusBadge status={tenant.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            )}

            {!loading && activeTab === 'tenants' && (
              <div className="space-y-4">
                <div className="panel-light flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative w-full sm:max-w-md">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717171]" />
                    <input
                      type="text"
                      placeholder="Buscar cliente..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="input-luxe pl-11"
                    />
                  </div>
                  <CreateTenantDialog onSave={handleCreateTenant} isLoading={creatingTenant} />
                </div>

                <div className="panel-light overflow-hidden p-2">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[740px] text-sm">
                      <thead>
                        <tr className="text-left text-[#2ed7ff]">
                          <th className="px-4 py-4 font-semibold uppercase tracking-[0.16em]">Negocio</th>
                          <th className="px-4 py-4 font-semibold uppercase tracking-[0.16em]">Email</th>
                          <th className="px-4 py-4 font-semibold uppercase tracking-[0.16em]">Plan</th>
                          <th className="px-4 py-4 font-semibold uppercase tracking-[0.16em]">Estado</th>
                          <th className="px-4 py-4 font-semibold uppercase tracking-[0.16em]">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTenants.map((tenant) => (
                          <tr key={tenant.id} className="border-t border-white/10">
                            <td className="px-4 py-4">
                              <p className="font-semibold text-white">{tenant.name}</p>
                            </td>
                            <td className="px-4 py-4 text-[#a1a1aa]">{tenant.email}</td>
                            <td className="px-4 py-4">
                              <StatusBadge status={tenant.plan} />
                            </td>
                            <td className="px-4 py-4">
                              <StatusBadge status={tenant.status} />
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <button onClick={() => setSelectedTenant(tenant)} className="button-ghost-luxe h-10 w-10 rounded-full p-0" title="Ver detalle">
                                  <Eye size={15} />
                                </button>
                                <button onClick={() => toggleStatus(tenant)} className="button-ghost-luxe h-10 w-10 rounded-full p-0" title="Suspender o activar">
                                  <Pause size={15} />
                                </button>
                                <ConfirmDeleteDialog
                                  description={`Estas seguro de que deseas eliminar el cliente "${tenant.name}"? Esta accion no se puede deshacer.`}
                                  onConfirm={handleRemoveTenant}
                                  isLoading={deletingTenant}
                                >
                                  <button className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-400/20 bg-rose-400/10 text-rose-200 transition hover:bg-rose-400/20" title="Eliminar" onClick={() => setTenantToDelete(tenant)}>
                                    <Trash2 size={15} />
                                  </button>
                                </ConfirmDeleteDialog>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {selectedTenant && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4" onClick={() => setSelectedTenant(null)}>
                    <div className="panel-light w-full max-w-xl p-6" onClick={(e) => e.stopPropagation()}>
                      <div className="mb-6 flex items-start justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#2ed7ff]">Perfil cliente</p>
                          <h3 className="mt-2 font-['Space_Grotesk'] text-3xl font-bold tracking-[-0.05em] text-white">{selectedTenant.name}</h3>
                        </div>
                        <button onClick={() => setSelectedTenant(null)} className="button-ghost-luxe h-11 w-11 rounded-full p-0">
                          <X size={18} />
                        </button>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {[
                          ['Email', selectedTenant.email],
                          ['Telefono', selectedTenant.phone],
                          ['Direccion', selectedTenant.address],
                          ['Slug', selectedTenant.slug],
                          ['Fecha de alta', selectedTenant.createdAt ? new Date(selectedTenant.createdAt).toLocaleDateString() : '-'],
                        ].map(([label, value]) => (
                          <div key={label} className="soft-card p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2ed7ff]">{label}</p>
                            <p className="mt-2 text-sm font-semibold text-white">{value || '-'}</p>
                          </div>
                        ))}
                        <div className="soft-card p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2ed7ff]">Plan</p>
                          <div className="mt-3">
                            <StatusBadge status={selectedTenant.plan} size="md" />
                          </div>
                        </div>
                        <div className="soft-card p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2ed7ff]">Estado</p>
                          <div className="mt-3">
                            <StatusBadge status={selectedTenant.status} size="md" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!loading && metrics && activeTab === 'plans' && (
              <div className="grid gap-4 lg:grid-cols-3">
                {[
                  { plan: 'BASIC', price: '$19.99', clients: metrics.activePlans.basic, copy: 'Entrada prolija para equipos chicos.' },
                  { plan: 'PROFESSIONAL', price: '$49.99', clients: metrics.activePlans.professional, copy: 'Balance entre operacion, control y crecimiento.' },
                  { plan: 'PREMIUM', price: '$99.99', clients: metrics.activePlans.premium, copy: 'Capa mas alta para marcas con multiples frentes.' },
                ].map((item, index) => (
                  <div key={item.plan} className={index === 1 ? 'panel-dark p-6' : 'panel-light p-6'}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <StatusBadge status={item.plan} size="md" />
                        <p className={`mt-4 text-sm leading-7 ${index === 1 ? 'text-stone-300' : 'text-[#a1a1aa]'}`}>{item.copy}</p>
                      </div>
                      <span className={`font-['Space_Grotesk'] text-3xl font-bold tracking-[-0.05em] ${index === 1 ? 'text-white' : 'text-white'}`}>
                        {item.price}
                      </span>
                    </div>
                    <div className={`mt-8 rounded-[24px] border p-4 ${index === 1 ? 'border-white/10 bg-white/5 text-stone-200' : 'border-white/10 bg-white/5 text-white'}`}>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">Clientes activos</p>
                      <p className="mt-3 font-['Space_Grotesk'] text-3xl font-bold tracking-[-0.05em]">{item.clients}</p>
                    </div>
                    <button className={`mt-6 w-full rounded-2xl py-3 text-sm font-semibold transition ${index === 1 ? 'bg-white text-[#17171a] hover:bg-[#f4f4f5]' : 'border border-white/10 bg-white/5 text-white hover:bg-white/10'}`}>
                      Editar plan
                    </button>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
