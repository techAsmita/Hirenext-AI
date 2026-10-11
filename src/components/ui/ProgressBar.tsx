import { cn } from '../../utils/cn';

export function ProgressBar({
  value,
  className,
  color = 'bg-indigo-500',
}: {
  value: number;
  className?: string;
  color?: string;
}) {
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-500', color)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
