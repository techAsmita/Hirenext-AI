import { Bell, Search, Moon, Sun, Calendar, ChevronDown } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

function SearchBox({ wide }: { wide?: boolean }) {
  return (
    <div className={`relative hidden md:block ${wide ? 'w-full max-w-xl' : ''}`}>
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        placeholder={wide ? 'Search candidates, interviews, or reports...' : 'Search candidates, interviews...'}
        className={`h-10 rounded-2xl border border-slate-200 bg-white/80 pl-10 pr-12 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:focus:ring-violet-500/30 ${wide ? 'w-full' : 'w-64'}`}
      />
      {wide && <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800">⌘ K</kbd>}
    </div>
  );
}

export function TopBar({ title, subtitle, actions }: TopBarProps) {
  const { dark, toggle } = useTheme();
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const today = new Date();
  const range = `${fmt(today)} - ${fmt(new Date(today.getTime() + 7 * 864e5))}`;
  const home = !title;

  return (
    <header className="fixed right-0 top-0 z-30 flex h-16 w-[calc(100%-var(--sidebar-width))] items-center justify-between gap-4 border-b border-transparent bg-[#f1f6fd]/80 px-6 backdrop-blur-md dark:border-transparent dark:bg-[#0c0a13]/80">
      {home ? (
        <SearchBox wide />
      ) : (
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      )}
      <div className="flex items-center gap-2">
        {!home && <SearchBox />}
        {home && (
          <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-xs font-medium text-slate-700 lg:flex dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
            <Calendar className="h-4 w-4 text-slate-500" /> {range} <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </div>
        )}
        <button onClick={toggle} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50 dark:hover:bg-white/10" aria-label="Toggle theme">
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
        </button>
        {actions}
        {home && (
          <div className="ml-1 hidden items-center gap-2 sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-violet-500 dark:text-white">R</span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Recruiter</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </div>
        )}
      </div>
    </header>
  );
}
