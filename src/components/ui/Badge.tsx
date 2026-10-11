import { cn } from '../../utils/cn';

const variants: Record<string, string> = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  danger: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400',
  info: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  brand: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400',
  muted: 'bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function statusBadge(status: string) {
  const map: Record<string, { label: string; variant: keyof typeof variants }> = {
    shortlisted: { label: 'Shortlisted', variant: 'success' },
    under_review: { label: 'Under Review', variant: 'info' },
    rejected: { label: 'Rejected', variant: 'danger' },
    flagged: { label: 'Flagged', variant: 'warning' },
    interview_pending: { label: 'Interview Pending', variant: 'muted' },
    completed: { label: 'Completed', variant: 'success' },
    processing: { label: 'Processing', variant: 'info' },
    scheduled: { label: 'Scheduled', variant: 'brand' },
    in_progress: { label: 'In Progress', variant: 'warning' },
    draft: { label: 'Draft', variant: 'muted' },
    failed: { label: 'Failed', variant: 'danger' },
    low: { label: 'Low Risk', variant: 'success' },
    medium: { label: 'Medium Risk', variant: 'warning' },
    high: { label: 'High Risk', variant: 'danger' },
    strong_hire: { label: 'Strong Hire', variant: 'success' },
    hire: { label: 'Hire', variant: 'brand' },
    maybe: { label: 'Maybe', variant: 'warning' },
    no_hire: { label: 'No Hire', variant: 'danger' },
  };
  const s = map[status] || { label: status, variant: 'default' as const };
  return <Badge variant={s.variant}>{s.label}</Badge>;
}
