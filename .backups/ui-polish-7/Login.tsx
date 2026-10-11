import { useState, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ChevronRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  AudioLines,
  ShieldCheck,
  FileText,
  Layers,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';

const pillars: [LucideIcon, string, string, string][] = [
  [ShieldCheck, 'Verified identity', 'Face and liveness checks', 'bg-emerald-400/20 text-emerald-300'],
  [AudioLines, 'Authentic voice', 'Voice cloning & replay detection', 'bg-rose-400/25 text-rose-300'],
  [Layers, 'Explainable scores', 'Evidence behind every score', 'bg-amber-300/25 text-amber-200'],
];
const metrics: [string, number, string][] = [
  ['Technical depth', 92, '#ff8a6b'],
  ['Communication', 85, '#a78bfa'],
  ['Behaviour', 88, '#7dd3fc'],
  ['Authenticity', 96, '#34d399'],
];

const trust: [LucideIcon, string][] = [
  [Lock, 'Privacy-first by design'],
  [ShieldCheck, 'Authenticity checks built in'],
  [FileText, 'Transparent AI scoring'],
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(() => localStorage.getItem('hn-remember-email') ?? 'admin@hirenext.ai');
  const [password, setPassword] = useState('demo');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(() => localStorage.getItem('hn-remember-email') !== null);
  const [showForgot, setShowForgot] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { loginRecruiter } = await import('../services/api');
      const result = await loginRecruiter(email, password);

      localStorage.setItem('hn-access-token', result.access_token);
      localStorage.setItem('hn-auth', '1');

      if (remember) localStorage.setItem('hn-remember-email', email);
      else localStorage.removeItem('hn-remember-email');

      navigate('/dashboard');
    } catch (error) {
      console.error('Recruiter login failed:', error);
      alert('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left brand panel */}
      <div
        className="relative hidden overflow-hidden text-white lg:flex lg:w-[52%] lg:flex-col lg:p-10 xl:p-14"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 100% 40%, rgba(255,138,106,0.95), transparent 70%), radial-gradient(ellipse 45% 35% at 82% 10%, rgba(255,106,157,0.5), transparent 70%), radial-gradient(ellipse 75% 50% at 50% 62%, rgba(112,72,238,0.9), transparent 70%), radial-gradient(ellipse 60% 40% at 15% 100%, rgba(59,91,235,0.85), transparent 70%), linear-gradient(160deg,#120d45 0%,#231a7a 45%,#2d1d93 100%)',
        }}
      >
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 800 1000" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="hn-rib" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7c5cff" stopOpacity="0" />
              <stop offset="55%" stopColor="#ff9a7b" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#ffd2b8" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          <path d="M-20 760 C180 640 330 880 520 740 S760 520 830 600" fill="none" stroke="url(#hn-rib)" strokeWidth="46" strokeLinecap="round" opacity="0.5" />
          <path d="M-20 840 C200 740 360 940 560 820 S780 640 830 700" fill="none" stroke="url(#hn-rib)" strokeWidth="22" strokeLinecap="round" opacity="0.45" />
          <path d="M40 1000 C320 1000 560 1010 800 840" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="2 8" />
        </svg>

        <div className="relative flex items-center gap-3">
          <LogoMark size={42} />
          <div>
            <div className="text-xl font-bold leading-tight">
              HireNext<span className="text-violet-200">.ai</span>
            </div>
            <div className="text-xs text-white/70">AI-Powered Interviews</div>
          </div>
        </div>

        <div className="relative my-auto max-w-xl py-6">
          <div className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/85">
            <span className="h-0.5 w-10 rounded-full bg-[linear-gradient(90deg,#ff8a6b,#7c5cff)]" />
            Fairer hiring. Stronger teams.
          </div>
          <h1 className="text-4xl font-bold leading-[1.1] xl:text-[3.4rem]">
            Intelligent{' '}
            <span className="bg-[linear-gradient(90deg,#ff7a6b,#ff5f9e)] bg-clip-text text-transparent">interviews.</span>
            <br />
            Explainable{' '}
            <span className="bg-[linear-gradient(90deg,#b9a7ff,#8fb4ff)] bg-clip-text text-transparent">hiring.</span>
          </h1>
          <p className="mt-4 max-w-md text-base text-white/80">
            Multimodal AI assessment that turns video, audio, and text into transparent,
            evidence-backed hiring decisions.
          </p>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {pillars.map(([Icon, title, desc, tone]) => (
              <div key={title} className="rounded-2xl border border-white/15 bg-white/[0.08] p-4 backdrop-blur">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-sm font-semibold">{title}</p>
                <p className="mt-0.5 text-[13px] text-white/80">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mb-2 hidden max-w-xl rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl shadow-black/25 backdrop-blur-md [@media(min-height:660px)]:block">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold">AI Interview Analysis</p>
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] text-white/85">Sample output</span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {metrics.map(([label, v, c]) => (
              <div key={label}>
                <p className="text-[11px] text-white/80">{label}</p>
                <p className="mt-0.5 text-lg font-bold leading-none">{v}%</p>
                <span className="mt-2 block h-1.5 rounded-full bg-white/15">
                  <span className="block h-1.5 rounded-full" style={{ width: `${v}%`, background: c }} />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-3 pt-6 text-xs text-white/75">
          <span className="h-0.5 w-10 rounded-full bg-[linear-gradient(90deg,#ff8a6b,#ff6b9d)]" />
          HireNext.ai · AI-powered interview intelligence
        </div>
      </div>

      {/* Right form */}
      <div className="relative flex flex-1 flex-col overflow-hidden bg-white px-6 py-10 dark:bg-[#0b1120]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-100/80 blur-3xl dark:bg-violet-500/10" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-rose-100/70 blur-3xl dark:bg-rose-500/10" />
        <div className="relative m-auto w-full max-w-md -translate-y-3">
          <div className="rounded-3xl border border-slate-200/70 bg-white/85 p-7 shadow-[0_24px_70px_-30px_rgba(79,70,229,0.45)] backdrop-blur sm:p-8 dark:border-white/10 dark:bg-slate-900/60">
          <div className="mb-8">
            <div className="mb-5 lg:hidden">
              <LogoMark size={46} />
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back</h2>
            <p className="mt-1.5 text-base text-slate-500">Sign in to your recruiter workspace</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Work email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => setShowForgot((v) => !v)}
                className="text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-300"
              >
                Forgot password?
              </button>
            </div>
            {showForgot && (
              <p className="rounded-xl bg-indigo-50 px-3 py-2 text-xs text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200">
                Password reset is unavailable in this demo environment.
              </p>
            )}

            <Button type="submit" size="lg" loading={loading} className="h-12 w-full bg-[linear-gradient(90deg,#5b4bf5,#7a5cff)]">
              Sign in <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-slate-500">
            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            or
            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>

          <button
            type="button"
            onClick={() => navigate('/interview/i1')}
            className="group flex w-full items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <User className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-indigo-700 dark:text-indigo-300">Open candidate interview</span>
              <span className="block text-xs text-slate-500">Join as a candidate for an interview session</span>
            </span>
            <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5" />
          </button>

          </div>

          <p className="mt-5 text-center text-xs text-slate-500">
            Demo environment · Recruiter access
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {trust.map(([Icon, label]) => (
              <div key={label} className="flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 dark:bg-slate-800">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-xs leading-tight text-slate-600 dark:text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LogoMark({ size = 40 }: { size?: number }) {
  const id = 'hn' + useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="shrink-0 drop-shadow-lg">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#${id})`} />
      <rect x="14" y="20" width="11" height="32" rx="5.5" fill="#fff" />
      <rect x="39" y="20" width="11" height="32" rx="5.5" fill="#fff" />
      <path d="M25 44V34L39 25V35Z" fill="#fff" />
      <circle cx="44.5" cy="11" r="4.6" fill="#fbbf24" />
    </svg>
  );
}
