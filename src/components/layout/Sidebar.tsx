import { NavLink, Link } from 'react-router-dom';
import {
  Home, User, Video, BarChart3, BrainCircuit, FileText, Shield, ShieldCheck, Activity, Smile,
  ListPlus, Sparkles, Settings, HelpCircle, ChevronLeft, ChevronRight, ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

// alias: true means the page does not exist yet, so the link goes to the closest page
// and never shows the "active" highlight (otherwise two items would light up at once).
interface Item { to: string; label: string; icon: LucideIcon; alias?: boolean }

const mainNav: Item[] = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/candidates', label: 'Candidates', icon: User },
  { to: '/interviews', label: 'Interviews', icon: Video },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/analysis/multimodal', label: 'AI Insights', icon: BrainCircuit },
  { to: '/reports', label: 'Reports', icon: FileText },
];

const aiNav: Item[] = [
  { to: '/analysis/authenticity', label: 'Authentication', icon: Shield },
  { to: '/analysis/authenticity', label: 'Anti-Fraud', icon: ShieldCheck, alias: true },
  { to: '/analysis/behaviour', label: 'Behaviour Analysis', icon: Activity },
  { to: '/analysis/personality', label: 'Personality (OCEAN)', icon: Smile },
  { to: '/interviews', label: 'Transcripts', icon: ListPlus, alias: true },
  { to: '/reports', label: 'Explainable AI', icon: Sparkles, alias: true },
];

const bottomNav: Item[] = [
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/help', label: 'Help', icon: HelpCircle },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside className={cn('fixed left-0 top-0 z-40 h-screen p-3 transition-all duration-300', collapsed ? 'w-[72px]' : 'w-60')}>
      <div className="relative flex h-full flex-col rounded-2xl border border-white/80 bg-[linear-gradient(180deg,#f8f9ff,#eef1ff)] shadow-[0_12px_40px_-16px_rgba(91,91,240,0.35)] dark:border-white/5 dark:bg-[linear-gradient(180deg,#25282e,#191f25)] dark:shadow-none">
        <div className={cn('flex items-center gap-3 px-4 pb-2 pt-4', collapsed && 'justify-center px-0')}>
          <LogoMark />
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
                HireNext<span className="text-indigo-500 dark:text-violet-400">.ai</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">AI-Powered Interviews</div>
            </div>
          )}
        </div>

        <nav className={cn('flex-1 overflow-y-auto py-2 scrollbar-thin', collapsed ? 'px-1.5' : 'px-3')}>
          <NavGroup items={mainNav} collapsed={collapsed} />
          <div className="my-2.5 border-t border-slate-200/70 dark:border-white/5" />
          {!collapsed && (
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              AI Evaluation
            </p>
          )}
          <NavGroup items={aiNav} collapsed={collapsed} />
        </nav>

        <div className={cn('border-t border-slate-200/70 pb-1.5 pt-1.5 dark:border-white/5', collapsed ? 'mx-1.5' : 'mx-3')}>
          <NavGroup items={bottomNav} collapsed={collapsed} />
        </div>

        {!collapsed && <Promo />}
        {collapsed && <div className="h-3" />}

        <button
          onClick={onToggle}
          className={cn('absolute -right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-indigo-600 dark:border-white/10 dark:bg-[#25282e] dark:text-slate-300 dark:hover:text-white', collapsed ? 'top-[54px]' : 'top-[30px]')}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </div>
    </aside>
  );
}

function LogoMark() {
  return (
    <svg width="38" height="38" viewBox="0 0 64 64" aria-hidden="true" className="shrink-0 drop-shadow-sm">
      <defs>
        <linearGradient id="hn-tile" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="url(#hn-tile)" />
      <rect x="16" y="18" width="8" height="30" rx="4" fill="#fff" />
      <rect x="40" y="18" width="8" height="30" rx="4" fill="#fff" />
      <path d="M24 41 V34 L40 25 V32 Z" fill="#fff" />
      <circle cx="44" cy="11" r="3.4" fill="#fbbf24" />
    </svg>
  );
}

function Promo() {
  return (
    <div className="relative mx-3 mb-2 mt-1 h-[96px] dark:h-[116px] shrink-0 overflow-hidden rounded-2xl [@media(max-height:800px)]:hidden bg-[linear-gradient(135deg,#e3eaff,#efe3ff_55%,#fde4f1)] dark:bg-none dark:bg-[#20242b]">
      <svg viewBox="0 0 220 120" preserveAspectRatio="none" className="absolute inset-0 h-full w-full dark:hidden" aria-hidden="true">
        <path d="M0 55 C40 15 85 75 135 40 S200 20 220 45 V0 H0Z" fill="#f9c6e4" opacity=".8" />
        <path d="M0 38 C50 0 95 58 145 28 S200 8 220 30 V0 H0Z" fill="#c9bfff" opacity=".85" />
      </svg>
      <svg viewBox="0 0 220 120" preserveAspectRatio="none" className="absolute inset-0 hidden h-full w-full dark:block" aria-hidden="true">
        <defs>
          <linearGradient id="hn-aurora" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffb347" />
            <stop offset="55%" stopColor="#ff6b9d" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <path d="M0 44 C40 12 90 58 140 30 S200 10 220 24 V0 H0Z" fill="url(#hn-aurora)" opacity=".95" />
        <path d="M0 30 C50 4 100 44 150 18 S200 2 220 10 V0 H0Z" fill="#8b5cf6" opacity=".55" />
      </svg>
      <div className="absolute bottom-3 left-4 right-14">
        <p className="text-[15px] font-bold leading-tight text-slate-900 dark:hidden">Smarter Hiring with AI</p>
        <p className="text-[11px] text-slate-600 dark:hidden">Fair. Secure. Explainable.</p>
        <p className="hidden text-[15px] font-bold leading-tight text-white dark:block">Smarter Interviews Brighter Teams.</p>
      </div>
      <Link
        to="/analysis/multimodal"
        aria-label="Explore AI insights"
        className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-indigo-600 shadow-md dark:bg-white/10 dark:text-violet-300 dark:shadow-none dark:ring-1 dark:ring-violet-400/50"
      >
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function NavGroup({ items, collapsed }: { items: Item[]; collapsed: boolean }) {
  return (
    <ul className="space-y-0.5">
      {items.map((item) => (
        <li key={item.label}>
          <NavLink
            to={item.to}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors',
                collapsed && 'justify-center px-0',
                isActive && !item.alias
                  ? 'bg-indigo-100/70 text-indigo-700 dark:bg-[linear-gradient(90deg,#5f3f9e,#7050b5)] dark:text-white dark:shadow-lg dark:shadow-violet-900/30'
                  : 'text-slate-700 hover:bg-white/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
              )
            }
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
