import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
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
import { getDashboardStats } from '../services/api';
import type { DashboardStats } from '../types';

const panel =
  'min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-14px_rgba(91,91,240,0.22)] dark:border-white/10 dark:bg-[#141a2e] dark:shadow-none';
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
const bigFive: [string, number, string][] = [
  ['Openness', 78, '#3b82f6'],
  ['Conscientiousness', 82, '#7c5cff'],
  ['Extraversion', 65, '#f43f5e'],
  ['Agreeableness', 70, '#f59e0b'],
  ['Neuroticism', 42, '#10b981'],
];
const alerts: [LucideIcon, string, string, number, string][] = [
  [ShieldCheck, 'Deepfake Video Detected', 'Suspicious video patterns', 2, 'bg-rose-100 text-rose-500 dark:bg-rose-500/20 dark:text-rose-300'],
  [AudioLines, 'Lip-Sync Mismatch', 'Audio-video misalignment', 1, 'bg-orange-100 text-orange-500 dark:bg-orange-500/20 dark:text-orange-300'],
  [Mic, 'Voice Anomaly', 'Possible synthetic audio', 1, 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300'],
  [Users, 'Multiple Faces Detected', 'No new cases', 0, 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300'],
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
const recent: [string, string, number, string, string][] = [
  ['Ananya Patel', 'Software Engineer', 92, 'Shortlisted', 'Low'],
  ['Rahul Sharma', 'Data Analyst', 86, 'In Review', 'Low'],
  ['Priya Mehta', 'AI/ML Intern', 81, 'In Review', 'Medium'],
  ['Arjun Verma', 'Backend Engineer', 76, 'Shortlisted', 'Low'],
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

  useEffect(() => {
    getDashboardStats()
      .then((s) => setStats(s.data))
      .catch(() => setFailed(true));
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
  const rings: [string, number, string][] = stats
    ? [...assessBase, ['Avg Overall Score', stats.averageScore, '#7c5cff']]
    : [];

  return (
    <div>
      <TopBar title="" />
      <div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(135deg,#eef2ff_0%,#f3efff_55%,#fdf0f8_100%)] dark:bg-none dark:bg-[#0b1120]">
        <div className="mx-auto w-full min-w-0 max-w-[1500px] space-y-4 p-4 lg:p-5">
          {/* Hero */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[linear-gradient(100deg,rgba(255,255,255,0.75),rgba(237,233,254,0.7)_55%,rgba(250,232,255,0.7))] px-5 py-3.5 dark:bg-none dark:bg-white/5">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {greeting}, Recruiter 👋
              </h1>
              <p className={`mt-0.5 text-sm ${muted}`}>Here's your AI interview overview.</p>
            </div>
            <p className={`max-w-xs text-right text-sm italic ${muted}`}>
              "Smarter insights. Fairer hiring. Real people."
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
                <Skeleton className="h-[190px] animate-pulse rounded-xl bg-slate-100 dark:bg-white/5" />
              ) : funnelEmpty ? (
                <p className={`flex h-[190px] items-center justify-center text-sm ${muted}`}>No pipeline data yet.</p>
              ) : (
                <div className="hn-chart h-[190px]">
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
              )}
            </section>

            <section className={`${panel} flex flex-col`}>
              <Head title="AI Assessment Overview" sub="Average performance across interviews" tag="All interviews" />
              {!stats ? (
                <Skeleton className="h-[120px] animate-pulse rounded-xl bg-slate-100 dark:bg-white/5" />
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
                    className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 px-2.5 py-2 transition hover:border-indigo-200 dark:border-white/5 dark:bg-white/5"
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-bold text-slate-800 dark:text-slate-100">{title}</p>
                      <p className={`truncate text-[10px] ${muted}`}>{subtitle}</p>
                    </div>
                    <span className={`w-5 text-center text-xs font-bold ${count ? 'text-rose-500' : 'text-slate-400'}`}>{count}</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Personality / Behaviour / Transcript */}
          <div className="grid gap-4 xl:grid-cols-3">
            <section className={panel}>
              <Head title="Personality Insights" to="/analysis/personality" cta="View Details" />
              <div className="space-y-2.5">
                {bigFive.map(([name, v, c]) => (
                  <div key={name} className="flex items-center gap-3">
                    <span className="w-28 shrink-0 text-[11px] font-medium text-slate-700 dark:text-slate-200">{name}</span>
                    <div className="h-2 flex-1 rounded-full bg-slate-100 dark:bg-white/10">
                      <div className="h-2 rounded-full" style={{ width: `${v}%`, background: c }} />
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
              <Head title="Behavioural Indicators" to="/analysis/behaviour" cta="View Details" />
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {behaviour.map(([name, value, color, Icon]) => (
                  <div
                    key={name}
                    className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/60 p-2 dark:border-white/5 dark:bg-white/5"
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: `${color}1f`, color }}
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
              <Head title="Transcript & AI Analysis" to="/interviews" cta="View Full" />
              <div className="space-y-2.5">
                <Bubble who="I" name="Interviewer" time="00:12" text="Tell me about a challenging project you worked on and how you overcame the obstacles." />
                <Bubble who="A" name="Candidate" time="00:28" text="I worked on a machine learning project where the main challenge was handling noisy data. I improved the preprocessing pipeline and validated the model across multiple splits..." />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <Metric value="84%" label="Clarity" cls="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300" />
                <Metric value="91%" label="Relevance" cls="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300" />
                <Metric value="78%" label="Confidence" cls="bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300" />
              </div>
            </section>
          </div>

          {/* Recent interviews / Skills */}
          <div className="grid gap-4 xl:grid-cols-[1.25fr_1fr]">
            <section className={panel}>
              <Head title="Recent Interviews" to="/interviews" cta="View All" />
              <div className="overflow-x-auto scrollbar-thin">
                <div className="min-w-[520px]">
                  <div className="grid grid-cols-[1.5fr_1.1fr_0.55fr_0.9fr_0.7fr] gap-2 border-b border-slate-100 pb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:border-white/10">
                    <span>Candidate</span>
                    <span>Role</span>
                    <span>Score</span>
                    <span>Status</span>
                    <span>Risk</span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-white/10">
                    {recent.map(([name, role, score, status, risk]) => (
                      <div key={name} className="grid grid-cols-[1.5fr_1.1fr_0.55fr_0.9fr_0.7fr] items-center gap-2 py-2.5">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                            {name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[11px] font-bold text-slate-800 dark:text-slate-100">{name}</p>
                            <p className={`text-[9px] ${muted}`}>Completed today</p>
                          </div>
                        </div>
                        <span className={`truncate text-[11px] ${muted}`}>{role}</span>
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300">{score}%</span>
                        <Chip className={status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300'}>{status}</Chip>
                        <Chip className={risk === 'Low' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'}>{risk}</Chip>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className={panel}>
              <Head title="Top Skills & Improvement Areas" to="/analytics" cta="View Analytics" />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-emerald-50/70 p-3 dark:bg-emerald-500/10">
                  <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                    <ThumbsUp className="h-3.5 w-3.5" /> Strongest Skills
                  </p>
                  <div className="space-y-2.5">
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
                <div className="rounded-xl bg-rose-50/70 p-3 dark:bg-rose-500/10">
                  <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-300">
                    <Target className="h-3.5 w-3.5" /> Areas to Improve
                  </p>
                  <div className="space-y-2">
                    {improvements.map((item, index) => (
                      <div key={item} className="flex items-start gap-2 rounded-lg bg-white/70 px-2.5 py-1.5 dark:bg-white/5">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-100 text-[9px] font-bold text-rose-600 dark:bg-rose-500/20 dark:text-rose-300">
                          {index + 1}
                        </span>
                        <span className="text-[10px] leading-snug text-slate-600 dark:text-slate-300">{item}</span>
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

function Chip({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 justify-self-start rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${className}`}>
      {children}
    </span>
  );
}

function Head({ title, sub, to, cta, tag }: { title: string; sub?: string; to?: string; cta?: string; tag?: string }) {
  return (
    <div className="mb-3 flex items-start justify-between gap-2">
      <div className="min-w-0">
        <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white">{title}</h2>
        {sub && <p className={`mt-0.5 text-[11px] ${muted}`}>{sub}</p>}
      </div>
      {tag && <span className={`shrink-0 ${pill}`}>{tag}</span>}
      {to && cta && (
        <Link to={to} className={`shrink-0 ${link}`}>
          {cta} <ArrowRight className="h-3 w-3" />
        </Link>
      )}
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
        <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{text}</p>
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
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-14px_rgba(91,91,240,0.22)] dark:border-white/10 dark:bg-[#141a2e] dark:shadow-none">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${t.icon}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-bold leading-tight text-slate-900 dark:text-white">{value}</p>
        <span className={`inline-flex items-center text-[11px] font-semibold ${up ? 'text-emerald-600' : 'text-rose-500'}`}>
          {up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
          {Math.abs(trend)}%
        </span>
      </div>
      <div className="h-10 w-16 shrink-0 2xl:w-20">
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
  );
}
