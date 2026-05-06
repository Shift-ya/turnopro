import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { TOAST_MESSAGES } from '../types/toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const quickLogins = [
    { label: 'Super Admin', email: 'admin@turnow.com' },
    { label: 'Admin Negocio', email: 'maria@bellavida.com' },
    { label: 'Staff', email: 'pedro@bellavida.com' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Ingresa tu email');
      return;
    }

    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);

    if (ok) {
      success(TOAST_MESSAGES.auth.loginSuccess);
      navigate('/dashboard', { replace: true });
      return;
    }

    setError('Credenciales invalidas');
    showError(TOAST_MESSAGES.auth.loginError);
  };

  const quickLogin = async (value: string) => {
    setLoading(true);
    const ok = await login(value, 'demo123');
    setLoading(false);

    if (ok) {
      success(TOAST_MESSAGES.auth.loginSuccess);
      navigate('/dashboard', { replace: true });
      return;
    }

    setError('No se pudo iniciar sesion rapida');
    showError(TOAST_MESSAGES.auth.loginError);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020202] text-[#f5f5f5]">
      <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_18%,rgba(91,109,255,0.30)_0%,rgba(127,77,255,0.14)_42%,transparent_64%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,18,0.12)_0%,rgba(8,9,18,0.48)_52%,rgba(8,9,18,0.86)_100%)]" />
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={16} /> Volver
          </button>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
            <Sparkles size={12} className="text-[#2ed7ff]" />
            Iniciar sesion
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <section className="w-full max-w-md rounded-[30px] border border-white/10 bg-[#060606]/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
            <div className="mb-8 space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-white/10 bg-[#0f1222] text-white">
                <LockKeyhole size={22} className="text-[#5e92ff]" />
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#2ed7ff]">turnow</p>
                <h1 className="bg-[linear-gradient(135deg,#f5f5f5_0%,#5e92ff_52%,#f52ccf_100%)] bg-clip-text text-[2.3rem] font-bold tracking-[-0.05em] text-transparent sm:text-[2.7rem]">
                  Accede a tu panel.
                </h1>
                <p className="mt-3 text-sm leading-7 text-[#a1a1aa]">
                  Una entrada simple, oscura y enfocada, usando la misma energia visual de la landing.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="tu@negocio.com"
                  className="h-12 w-full rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 text-sm text-white outline-none transition placeholder:text-[#717171] focus:border-[#5e92ff] focus:ring-4 focus:ring-[#5e92ff]/15"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Contrasena</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 pr-12 text-sm text-white outline-none transition placeholder:text-[#717171] focus:border-[#5e92ff] focus:ring-4 focus:ring-[#5e92ff]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717171] transition hover:text-white"
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              )}

              <button
                disabled={loading}
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#5e92ff] text-sm font-semibold text-white shadow-[0_16px_34px_rgba(94,146,255,0.28)] transition hover:bg-[#4f82ef] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Ingresando...' : 'Iniciar sesion'}
              </button>
            </form>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-[#0d0d0d] p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">Acceso rapido para pruebas</p>
                  <p className="text-xs text-[#717171]">Todos usan la clave `demo123`.</p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f52ccf]">
                  Demo
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {quickLogins.map((item) => (
                  <button
                    key={item.email}
                    onClick={() => quickLogin(item.email)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-center text-sm font-medium text-white/85 transition hover:border-[#5e92ff]/40 hover:bg-[#5e92ff]/10 hover:text-white"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
