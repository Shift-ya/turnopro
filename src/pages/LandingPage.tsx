import { Calendar, Shield, Users, Zap, BarChart3, Globe, CheckCircle2, ArrowRight, Star, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface Props {
  onNavigate: (page: string) => void;
}

export default function LandingPage({ onNavigate }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const features = [
    { icon: <Calendar size={24} />, title: 'Agenda Inteligente', desc: 'Gestión de turnos con prevención automática de conflictos y slots dinámicos.' },
    { icon: <Users size={24} />, title: 'Multi-Profesional', desc: 'Cada profesional con su agenda, horarios y servicios independientes.' },
    { icon: <Globe size={24} />, title: 'Página de Reservas', desc: 'Tu propia página pública donde los clientes reservan en 3 simples pasos.' },
    { icon: <BarChart3 size={24} />, title: 'Estadísticas', desc: 'Dashboard con métricas de rendimiento, ingresos y tasas de asistencia.' },
    { icon: <Shield size={24} />, title: 'Multi-Tenant Seguro', desc: 'Datos completamente aislados entre negocios. Seguridad empresarial.' },
    { icon: <Zap size={24} />, title: 'Notificaciones', desc: 'Confirmaciones y recordatorios automáticos por email y WhatsApp.' },
  ];

  const plans = [
    { name: 'Básico', price: '19.99', period: '/mes', features: ['Hasta 3 profesionales', 'Hasta 5 servicios', 'Página de reservas', 'Notificaciones email', 'Soporte por email'], popular: false },
    { name: 'Profesional', price: '49.99', period: '/mes', features: ['Hasta 10 profesionales', 'Hasta 20 servicios', 'Página de reservas personalizada', 'Notificaciones email + WhatsApp', 'Branding personalizado', 'Estadísticas avanzadas', 'Soporte prioritario'], popular: true },
    { name: 'Premium', price: '99.99', period: '/mes', features: ['Profesionales ilimitados', 'Servicios ilimitados', 'Dominio personalizado', 'API de integración', 'Multi-sucursal', 'Soporte 24/7', 'Onboarding dedicado', 'Integraciones de pago'], popular: false },
  ];

  const testimonials = [
    { name: 'María López', business: 'Bella Vida Spa', text: 'Desde que usamos TurnoPro, las cancelaciones bajaron un 40%. Mis clientes aman la facilidad para reservar.', rating: 5 },
    { name: 'Dr. Rodríguez', business: 'Consultorio Médico', text: 'La gestión de turnos era un caos. Ahora todo está automatizado y no pierdo ni un paciente.', rating: 5 },
    { name: 'Carlos Gómez', business: 'AutoTech Taller', text: 'Perfecto para talleres. Mis clientes reservan online y yo organizo el trabajo del día sin llamadas.', rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Calendar size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TurnoPro</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition">Funciones</a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition">Precios</a>
              <a href="#testimonials" className="text-sm text-gray-600 hover:text-gray-900 transition">Testimonios</a>
              <button onClick={() => onNavigate('booking')} className="text-sm text-primary-600 hover:text-primary-700 font-medium transition">Demo Reservas</button>
              <button onClick={() => onNavigate('login')} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition">
                Iniciar Sesión
              </button>
            </div>
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          {menuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <a href="#features" className="block py-2 text-gray-600">Funciones</a>
              <a href="#pricing" className="block py-2 text-gray-600">Precios</a>
              <button onClick={() => onNavigate('booking')} className="block py-2 text-primary-600 font-medium">Demo Reservas</button>
              <button onClick={() => onNavigate('login')} className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg">
                Iniciar Sesión
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Zap size={14} /> Plataforma #1 de Gestión de Turnos
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Tus clientes reservan.
              <br />
              <span className="text-primary-600">Tú creces.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              La plataforma SaaS que automatiza la gestión de turnos para peluquerías, spas, consultorios, gimnasios y más. Simple, rápida y profesional.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => onNavigate('login')} className="px-8 py-3.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-200 flex items-center justify-center gap-2">
                Empezar gratis <ArrowRight size={18} />
              </button>
              <button onClick={() => onNavigate('booking')} className="px-8 py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition">
                Ver demo en vivo
              </button>
            </div>
            <p className="mt-4 text-sm text-gray-400">Sin tarjeta de crédito · Prueba 14 días gratis</p>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 relative max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl p-1">
              <div className="bg-gray-900 rounded-xl overflow-hidden">
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-800">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-3 text-xs text-gray-500">app.turnopro.com/dashboard</span>
                </div>
                <div className="p-6 bg-gray-50">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <p className="text-xs text-gray-500">Turnos Hoy</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
                      <p className="text-xs text-emerald-600 mt-1">↑ 23%</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <p className="text-xs text-gray-500">Esta Semana</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">67</p>
                      <p className="text-xs text-emerald-600 mt-1">↑ 15%</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <p className="text-xs text-gray-500">Ingresos</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">$485K</p>
                      <p className="text-xs text-emerald-600 mt-1">↑ 31%</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <p className="text-xs text-gray-500">Asistencia</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">94%</p>
                      <p className="text-xs text-emerald-600 mt-1">↑ 5%</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['09:00 - Masaje Relajante', '10:00 - Limpieza Facial', '11:00 - Manicura'].map((t, i) => (
                      <div key={i} className="bg-white rounded-xl p-3 border border-gray-100 flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${i === 2 ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse-dot`}></div>
                        <span className="text-sm text-gray-700">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-primary-200/30 blur-2xl rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Todo lo que necesitás</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">Herramientas potentes para automatizar tu negocio y hacer crecer tu base de clientes.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow group">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition">
                  {f.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">3 pasos. Así de simple.</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'Creá tu cuenta', desc: 'Registrá tu negocio en menos de 2 minutos. Sin configuración compleja.' },
              { step: '2', title: 'Configurá tu agenda', desc: 'Agregá servicios, profesionales y horarios. Todo desde tu panel.' },
              { step: '3', title: 'Recibí reservas', desc: 'Compartí tu link y empezá a recibir turnos automáticamente.' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto">
                  {s.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Planes para cada negocio</h2>
            <p className="mt-4 text-lg text-gray-500">Empezá gratis, escalá cuando quieras.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div key={i} className={`relative bg-white rounded-2xl p-6 border ${plan.popular ? 'border-primary-300 shadow-xl shadow-primary-100 ring-2 ring-primary-500' : 'border-gray-200'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MÁS POPULAR
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 size={16} className="text-primary-600 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onNavigate('login')}
                  className={`mt-8 w-full py-2.5 rounded-xl font-semibold text-sm transition ${plan.popular ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Empezar ahora
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Lo que dicen nuestros clientes</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">"{t.text}"</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.business}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold">¿Listo para automatizar tus turnos?</h2>
          <p className="mt-4 text-primary-100 text-lg">Más de 500 negocios ya confían en TurnoPro. Uníte hoy.</p>
          <button onClick={() => onNavigate('login')} className="mt-8 px-8 py-3.5 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition">
            Crear cuenta gratis
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
              <Calendar size={14} className="text-white" />
            </div>
            <span className="font-bold text-gray-900">TurnoPro</span>
          </div>
          <p className="text-sm text-gray-500">© 2025 TurnoPro. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
