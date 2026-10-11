import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Video,
  User,
  Flag,
  Trophy,
  ShieldCheck,
  AudioLines,
  Mic,
  Gauge,
  Activity,
  BrainCircuit,
  FileText,
  ThumbsUp,
  Target,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Eye,
  PersonStanding,
  Smile,
  Hand,
  MessageCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
  ResponsiveContainer,
} from 'recharts';
import { TopBar } from '../components/layout/TopBar';
import { Skeleton } from '../components/ui/Skeleton';
import { statusBadge } from '../components/ui/Badge';
import { getDashboardStats, getInterviews } from '../services/api';
import type { DashboardStats, Interview } from '../types';

const panel =
  'flex min-w-0 flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-14px_rgba(91,91,240,0.22)] dark:border-white/[0.08] dark:bg-[#16121f] dark:shadow-none';
const muted = 'text-slate-500 dark:text-slate-400';
const link =
  'inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-300';
const pill =
  'rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200';

const tones = {
  blue: { icon: 'bg-[#e3ecff] text-blue-600 dark:bg-blue-500/20 dark:text-blue-300', c: '#3b82f6' },
  green: { icon: 'bg-[#dcf5e7] text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300', c: '#10b981' },
  orange: { icon: 'bg-[#ffe6d6] text-orange-500 dark:bg-orange-500/20 dark:text-orange-300', c: '#fb923c' },
  red: { icon: 'bg-[#ffdfe4] text-rose-500 dark:bg-rose-500/20 dark:text-rose-300', c: '#f43f5e' },
  purple: { icon: 'bg-[#e8e0ff] text-violet-600 dark:bg-violet-500/20 dark:text-violet-300', c: '#7c5cff' },
};

// ---------------------------------------------------------------------------
// DEMO-ONLY sections: the values below are not served by getDashboardStats().
// They are kept exactly as before and should be wired to real endpoints later.
// ---------------------------------------------------------------------------
const bigFive: [string, number, string, string][] = [
  ['Openness', 78, '#3b82f6', 'dark:bg-[linear-gradient(90deg,#3b82f6,#60a5fa)]'],
  ['Conscientiousness', 82, '#7c5cff', 'dark:bg-[linear-gradient(90deg,#ec4899,#fb7185)]'],
  ['Extraversion', 65, '#f43f5e', 'dark:bg-[linear-gradient(90deg,#fb7185,#fb923c)]'],
  ['Agreeableness', 70, '#f59e0b', 'dark:bg-[linear-gradient(90deg,#f59e0b,#fbbf24)]'],
  ['Neuroticism', 42, '#10b981', 'dark:bg-[linear-gradient(90deg,#10b981,#34d399)]'],
];
const alerts: [LucideIcon, string, string, number, string][] = [
  [ShieldCheck, 'Deepfake Video Detected', 'Suspicious video patterns', 2, 'bg-rose-100 text-rose-500 dark:bg-rose-500/30 dark:text-rose-200'],
  [AudioLines, 'Lip-Sync Mismatch', 'Audio-video misalignment', 1, 'bg-orange-100 text-orange-500 dark:bg-orange-500/30 dark:text-orange-200'],
  [Mic, 'Voice Anomaly', 'Possible synthetic audio', 1, 'bg-amber-100 text-amber-600 dark:bg-amber-500/30 dark:text-amber-200'],
  [Users, 'Multiple Faces Detected', 'No new cases', 0, 'bg-indigo-100 text-indigo-600 dark:bg-blue-500/30 dark:text-blue-200'],
];
const assessBase: [string, number, string][] = [
  ['Authentication', 92, '#3b82f6'],
  ['Media Authenticity', 88, '#10b981'],
  ['Behaviour Analysis', 85, '#fb923c'],
];
const behaviour: [string, number, string, LucideIcon][] = [
  ['Eye Contact', 82, '#3b82f6', Eye],
  ['Posture', 76, '#10b981', PersonStanding],
  ['Facial Expression', 80, '#7c5cff', Smile],
  ['Gesture Usage', 68, '#fb923c', Hand],
  ['Voice Confidence', 81, '#f43f5e', AudioLines],
  ['Speech Clarity', 85, '#10b981', MessageCircle],
];
const topSkills: [string, number, string][] = [
  ['Problem Solving', 88, '#3b82f6'],
  ['Technical Knowledge', 84, '#7c5cff'],
  ['Communication', 81, '#10b981'],
];
const improvements = [
  'Provide more specific impact metrics',
  'Reduce hesitation during follow-up questions',
  'Improve gesture consistency',
];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [failed, setFailed] = useState(false);
  const [interviews, setInterviews] = useState<Interview[] | null>(null);
  const [interviewsFailed, setInterviewsFailed] = useState(false);

  useEffect(() => {
    getDashboardStats()
      .then((s) => setStats(s.data))
      .catch(() => setFailed(true));

    // Only real backend interviews are listed. Demo-sourced responses are treated as empty.
    getInterviews()
      .then((r) => setInterviews(r.source === 'api' ? r.data : []))
      .catch(() => setInterviewsFailed(true));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const flagged = alerts.reduce((n, a) => n + a[3], 0);

  const funnel = stats
    ? [
        { label: 'Applied', value: stats.pipeline.applied, color: '#b9a5ff' },
        { label: 'Authenticated', value: stats.pipeline.authenticated, color: '#55a8ed' },
        { label: 'Interviewed', value: stats.pipeline.interviewed, color: '#79d9bd' },
        { label: 'In Review', value: stats.pipeline.inReview, color: '#ffb54f' },
        { label: 'Shortlisted', value: stats.pipeline.shortlisted, color: '#9b6df2' },
      ]
    : [];
  const funnelEmpty = funnel.every((f) => f.value === 0);
  const recentInterviews = (interviews ?? [])
    .slice()
    .sort((a, b) => Date.parse(b.completedAt ?? b.createdAt) - Date.parse(a.completedAt ?? a.createdAt))
    .slice(0, 4);
  const rings: [string, number, string][] = stats
    ? [...assessBase, ['Avg Overall Score', stats.averageScore, '#7c5cff']]
    : [];

  return (
    <div>
      <TopBar title="" />
      <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(160deg,#ebf0fd_0%,#eef4fc_45%,#f3fafd_100%)] dark:bg-none dark:bg-[#0c0a13]">
        <div className="mx-auto w-full min-w-0 max-w-[1500px] space-y-4 p-4 lg:p-5">
          {/* Hero */}
          <div className="relative flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-2xl px-5 py-5
            bg-[linear-gradient(90deg,#f8f9ff_0%,#f1f5fe_36%,#dfe9fd_56%,#c9d9fd_68%,#d7d4fd_79%,#f3e6fb_90%,#efe8fe_100%)]
            dark:bg-none dark:bg-transparent">
            {/* Light-mode shapes */}
            <svg aria-hidden="true" viewBox="0 0 1000 110" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full dark:hidden">
              <defs>
                <linearGradient id="hn-dome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6fb0fd" />
                  <stop offset="100%" stopColor="#a9ccfe" />
                </linearGradient>
              </defs>
              <path d="M400 110 C430 62 500 30 585 52 C625 63 645 88 655 110Z" fill="#ffffff" opacity="0.35" />
              <ellipse cx="752" cy="0" rx="44" ry="50" fill="#d6c4fb" opacity="0.65" />
              <ellipse cx="745" cy="104" rx="36" ry="34" fill="#e6c6f4" opacity="0.7" />
              <path d="M585 110 C585 56 625 28 660 30 C695 32 715 70 722 110Z" fill="url(#hn-dome)" />
            </svg>
            {/* Dark-mode: aurora ribbon behind the quote */}
            <svg aria-hidden="true" viewBox="0 0 1200 160" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 hidden h-full w-full dark:block">
              <defs>
                <linearGradient id="hn-wave-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff7a45" stopOpacity="0.55" />
                  <stop offset="45%" stopColor="#d946ef" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="hn-wave-line" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ff8a4c" stopOpacity="0" />
                  <stop offset="35%" stopColor="#ff7a45" />
                  <stop offset="65%" stopColor="#e879f9" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <ellipse cx="1000" cy="30" rx="170" ry="60" fill="#a855f7" opacity="0.14" />
              <path d="M480 160 C600 150 700 120 780 78 C850 42 930 18 1010 34 C1080 48 1130 70 1200 52 V160 Z" fill="url(#hn-wave-fill)" />
              <path d="M480 160 C600 150 700 120 780 78 C850 42 930 18 1010 34 C1080 48 1130 70 1200 52" fill="none" stroke="url(#hn-wave-line)" strokeWidth="2" vectorEffect="non-scaling-stroke" opacity="0.9" />
            </svg>
            <div className="relative z-10">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {greeting}, Recruiter 👋
              </h1>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Here's your AI interview overview.</p>
            </div>
            <p className="relative z-10 max-w-[16rem] text-right text-sm font-medium italic text-slate-700 dark:text-slate-200">
              "From interviews to insights.<br />Make better people decisions."
            </p>
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {failed ? (
              <div className={`${panel} col-span-full text-sm ${muted}`}>
                Couldn't load dashboard statistics. Please refresh the page to try again.
              </div>
            ) : !stats ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-[92px] animate-pulse rounded-2xl bg-white/70 dark:bg-white/5" />
              ))
            ) : (
              <>
                <Kpi tone="blue" icon={Users} value={stats.totalCandidates} label="Total Candidates" trend={12} spark={[3, 5, 4, 7, 6, 9, 11]} />
                <Kpi tone="green" icon={Video} value={stats.interviewsCompleted} label="Interviews Completed" trend={8} spark={[2, 4, 3, 5, 6, 5, 8]} />
                <Kpi tone="orange" icon={User} value={stats.shortlisted} label="Shortlisted" trend={5} spark={[1, 2, 2, 4, 3, 5, 6]} />
                <Kpi tone="red" icon={Flag} value={flagged} label="Flagged for Review" trend={-20} spark={[7, 6, 6, 5, 6, 4, 4]} />
                <Kpi tone="purple" icon={Trophy} value={`${stats.averageScore}%`} label="Avg Assessment Score" trend={3} spark={[70, 74, 73, 78, 80, 81, 82]} />
              </>
            )}
          </div>

          {/* Pipeline / Assessment / Alerts */}
          <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr_1.05fr]">
            <section className={panel}>
              <Head title="Candidate Pipeline" sub="Candidate movement across your hiring funnel" tag="This week" />
              {!stats ? (
                <Skeleton className="min-h-[170px] flex-1 animate-pulse rounded-xl bg-slate-100 dark:bg-white/5" />
              ) : funnelEmpty ? (
                <p className={`flex min-h-[170px] flex-1 items-center justify-center text-sm ${muted}`}>No pipeline data yet.</p>
              ) : (
                <div className="hn-chart relative min-h-[170px] flex-1">
                  <div className="absolute inset-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={funnel} margin={{ top: 18, right: 6, left: -14, bottom: 0 }} barCategoryGap="16%">
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="label" tickLine={false} axisLine={false} interval={0} />
                      <YAxis
                        allowDecimals={false}
                        tickLine={false}
                        axisLine={false}
                        width={32}
                        domain={[0, (dataMax: number) => Math.max(4, Math.ceil(dataMax))]}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={44} isAnimationActive={false}>
                        {funnel.map((f) => (
                          <Cell key={f.label} fill={f.color} />
                        ))}
                        <LabelList dataKey="value" position="top" className="hn-bar-label" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  </div>
                </div>
              )}
            </section>

            <section className={panel}>
              <Head title="AI Assessment Overview" sub="Average performance across interviews" tag="All interviews" />
              {!stats ? (
                <Skeleton className="min-h-[120px] flex-1 animate-pulse rounded-xl bg-slate-100 dark:bg-white/5" />
              ) : (
                <div className="grid flex-1 grid-cols-2 content-center gap-3 sm:grid-cols-4">
                  {rings.map(([label, value, color]) => (
                    <div key={label} className="flex min-w-0 flex-col items-center text-center">
                      <Ring value={value} color={color} size={64} />
                      <p className="mt-1.5 text-[10px] font-semibold leading-tight text-slate-700 dark:text-slate-200">{label}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className={panel}>
              <Head title="Fraud & Authenticity Alerts" sub="Issues requiring recruiter attention" to="/analysis/authenticity" cta="View all" />
              <div className="space-y-1.5">
                {alerts.map(([Icon, title, subtitle, count, iconClass]) => (
                  <Link
                    key={title}
                    to="/analysis/authenticity"
                    className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 px-2.5 py-1.5 transition hover:border-indigo-200 dark:border-white/5 dark:bg-white/5"
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-bold text-slate-800 dark:text-slate-100">{title}</p>
                      <p className={`truncate text-[10px] ${muted}`}>{subtitle}</p>
                    </div>
                    <span className={`w-5 text-center text-xs font-bold dark:flex dark:h-6 dark:w-6 dark:items-center dark:justify-center dark:rounded-md ${count ? 'text-rose-500 dark:bg-rose-500/20 dark:text-rose-300' : 'text-slate-400 dark:bg-blue-500/20 dark:text-blue-300'}`}>{count}</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Personality / Behaviour / Transcript */}
          <div className="grid gap-4 xl:grid-cols-3">
            <section className={panel}>
              <Head title="Personality Insights (Big-Five)" icon={BrainCircuit} to="/analysis/personality" cta="View Details" />
              <div className="flex flex-1 flex-col justify-between gap-2.5">
                {bigFive.map(([name, v, c, dg]) => (
                  <div key={name} className="flex items-center gap-3">
                    <span className="w-28 shrink-0 text-[11px] font-medium text-slate-700 dark:text-slate-200">{name}</span>
                    <div className="h-2 flex-1 rounded-full bg-slate-100 dark:h-2.5 dark:bg-white/10">
                      <div className={`h-2 rounded-full dark:h-2.5 ${dg}`} style={{ width: `${v}%`, backgroundColor: c }} />
                    </div>
                    <span className={`w-9 text-right text-[11px] font-semibold ${muted}`}>{v}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-indigo-50/80 p-2.5 dark:bg-indigo-500/10">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                  <User className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100">Personality profile</p>
                  <p className={`text-[10px] ${muted}`}>Strong conscientiousness and openness</p>
                </div>
              </div>
            </section>

            <section className={panel}>
              <Head title="Behavioural Indicators" icon={Activity} to="/analysis/behaviour" cta="View Details" />
              <div className="grid flex-1 grid-cols-1 auto-rows-fr gap-2 sm:grid-cols-2">
                {behaviour.map(([name, value, color, Icon]) => (
                  <div
                    key={name}
                    className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/60 p-2 dark:border-white/5 dark:bg-white/5"
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color:var(--tile)] text-white dark:bg-[color:var(--tile-d)] dark:text-[color:var(--tile)]" style={{ '--tile': color, '--tile-d': `${color}33` } as React.CSSProperties}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate text-[11px] font-medium text-slate-700 dark:text-slate-200">{name}</span>
                        <span className={`text-[10px] font-semibold ${muted}`}>{value}%</span>
                      </div>
                      <div className="mt-1 h-1.5 rounded-full bg-slate-200/70 dark:bg-white/10">
                        <div className="h-1.5 rounded-full" style={{ width: `${value}%`, background: color }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50/80 px-3 py-2 dark:bg-emerald-500/10">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
                    <Gauge className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">Overall behavioural score</span>
                </div>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-300">79%</span>
              </div>
            </section>

            <section className={panel}>
              <Head title="Transcript & AI Analysis" icon={FileText} to="/interviews" cta="View Full" />
              <div className="flex-1 space-y-2.5">
                <div className="flex gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-300">Q</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] leading-relaxed text-slate-300">Can you tell me about a challenging project you worked on and how you overcame the obstacles?</p>
                    <p className="mt-0.5 text-[10px] text-slate-500">00:45</p>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">A</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] leading-relaxed text-slate-300">Sure, during my third year I worked on a machine learning project for early detection of Parkinson's disease using EEG signals. The main challenge was handling noisy data and signal variability...</p>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <p className="mb-1.5 text-[10px] font-semibold text-slate-400">Key Topics</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Problem Solving', 'Technical Depth', 'Communication'].map((t) => (
                    <span key={t} className="rounded-full bg-violet-500/15 px-2.5 py-0.5 text-[10px] font-medium text-violet-300">{t}</span>
                  ))}
                </div>
                <Link to="/interviews" className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-300 hover:underline">
                  View Full Transcript <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </section>
          </div>

          {/* Recent interviews / Skills */}
          <div className="grid gap-4 xl:grid-cols-[1.25fr_1fr]">
            <section className={panel}>
              <Head title="Recent Interviews" to="/interviews" cta="View All" />
              {interviewsFailed ? (
                <p className={`flex flex-1 items-center justify-center py-8 text-sm ${muted}`}>
                  Couldn't load interviews. Please refresh the page to try again.
                </p>
              ) : interviews === null ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 animate-pulse rounded-xl bg-slate-100 dark:bg-white/5" />
                  ))}
                </div>
              ) : recentInterviews.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-1 py-8 text-center">
                  <Video className="h-6 w-6 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No recorded interviews yet</p>
                  <p className={`max-w-xs text-xs ${muted}`}>Completed interviews will appear here once they are available from the backend.</p>
                </div>
              ) : (
                <div className="overflow-x-auto scrollbar-thin">
                  <div className="min-w-[480px]">
                    <div className="grid grid-cols-[1.7fr_1fr_0.9fr_1fr] gap-2 border-b border-slate-100 pb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:border-white/10">
                      <span>Interview</span>
                      <span>Department</span>
                      <span>Date</span>
                      <span>Status</span>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-white/10">
                      {recentInterviews.map((iv) => (
                        <div key={iv.id} className="grid grid-cols-[1.7fr_1fr_0.9fr_1fr] items-center gap-2 py-2.5">
                          <div className="flex min-w-0 items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                              {iv.jobTitle.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-[11px] font-bold text-slate-800 dark:text-slate-100">{iv.jobTitle}</p>
                              <p className={`text-[9px] capitalize ${muted}`}>{iv.type} interview</p>
                            </div>
                          </div>
                          <span className={`truncate text-[11px] ${muted}`}>{iv.department}</span>
                          <span className={`text-[11px] ${muted}`}>{formatDate(iv.completedAt ?? iv.createdAt)}</span>
                          <div>{statusBadge(iv.status)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className={panel}>
              <Head title="Top Skills & Improvement Areas" to="/analytics" cta="View Analytics" />
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col rounded-xl bg-emerald-50/70 p-3 dark:bg-emerald-500/10">
                  <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                    <ThumbsUp className="h-3.5 w-3.5" /> Strongest Skills
                  </p>
                  <div className="flex flex-1 flex-col justify-around gap-2.5">
                    {topSkills.map(([skill, value, color]) => (
                      <div key={skill}>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-medium text-slate-700 dark:text-slate-200">{skill}</span>
                          <span className={`font-bold ${muted}`}>{value}%</span>
                        </div>
                        <div className="mt-1 h-1.5 rounded-full bg-white/80 dark:bg-white/10">
                          <div className="h-1.5 rounded-full" style={{ width: `${value}%`, background: color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col rounded-xl bg-rose-50/70 p-3 dark:bg-rose-500/10">
                  <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-300">
                    <Target className="h-3.5 w-3.5" /> Areas to Improve
                  </p>
                  <div className="flex flex-1 flex-col justify-around gap-2.5">
                    {[
                      ['Conciseness', 42, '#f43f5e'],
                      ['Handling Pressure', 48, '#f43f5e'],
                      ['Structured Responses', 50, '#f43f5e'],
                      ['Depth in Concepts', 52, '#f43f5e'],
                      ['Confidence (Voice)', 55, '#f43f5e'],
                    ].map(([skill, value, color]) => (
                      <div key={skill}>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-medium text-slate-700 dark:text-slate-200">{skill}</span>
                          <span className={`font-bold ${muted}`}>{value}%</span>
                        </div>
                        <div className="mt-1 h-1.5 rounded-full bg-white/80 dark:bg-white/10">
                          <div className="h-1.5 rounded-full" style={{ width: `${value}%`, background: color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '-' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function Head({ title, sub, to, cta, tag, icon: Icon }: { title: string; sub?: string; to?: string; cta?: string; tag?: string; icon?: LucideIcon }) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {Icon && (
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300">
              <Icon className="h-3.5 w-3.5" />
            </span>
          )}
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h2>
        </div>
        {tag && <span className={`shrink-0 ${pill}`}>{tag}</span>}
        {to && cta && (
          <Link to={to} className={`shrink-0 ${link}`}>
            {cta} <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
      {sub && <p className={`mt-0.5 text-[11px] ${muted}`}>{sub}</p>}
    </div>
  );
}

function Bubble({ who, name, time, text }: { who: string; name: string; time: string; text: string }) {
  return (
    <div className="flex gap-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
        {who}
      </span>
      <div className="min-w-0 rounded-xl bg-slate-50/80 px-3 py-2 dark:bg-white/5">
        <p className="text-xs font-bold text-slate-900 dark:text-white">
          {name} <span className={`font-normal ${muted}`}>{time}</span>
        </p>
        <p className="mt-0.5 line-clamp-3 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{text}</p>
      </div>
    </div>
  );
}

function Metric({ value, label, cls }: { value: string; label: string; cls: string }) {
  return (
    <div className={`rounded-xl p-2 text-center ${cls}`}>
      <p className="text-sm font-bold">{value}</p>
      <p className={`text-[10px] ${muted}`}>{label}</p>
    </div>
  );
}

function Ring({ value, color, size, stroke = 6 }: { value: number; color: string; size: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`${color}22`} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ - (value / 100) * circ} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-slate-900 dark:text-white">{value}%</span>
      </div>
    </div>
  );
}

function Kpi({ tone, icon: Icon, value, label, trend, spark }: { tone: keyof typeof tones; icon: LucideIcon; value: string | number; label: string; trend: number; spark: number[] }) {
  const t = tones[tone];
  const up = trend >= 0;
  const id = `kpi-${tone}`;
  return (
    <div className="min-w-0 rounded-2xl border border-slate-100 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-14px_rgba(91,91,240,0.22)] dark:border-white/[0.08] dark:bg-[#16121f] dark:shadow-none">
      <div className="flex items-center gap-2.5">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${t.icon}`}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <p className="text-[11px] font-medium leading-tight text-slate-600 dark:text-slate-300">{label}</p>
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div>
          <p className="text-2xl font-bold leading-none text-slate-900 dark:text-white">{value}</p>
          <span className={`mt-1 inline-flex items-center text-[11px] font-semibold ${up ? 'text-emerald-600' : 'text-rose-500'}`}>
            {up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {Math.abs(trend)}%
          </span>
        </div>
        <div className="h-10 w-20 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spark.map((v, i) => ({ i, v }))} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={t.c} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={t.c} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={t.c} strokeWidth={2} fill={`url(#${id})`} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
