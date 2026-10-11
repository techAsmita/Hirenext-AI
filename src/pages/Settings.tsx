import { TopBar } from '../components/layout/TopBar';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useTheme } from '../hooks/useTheme';

export default function Settings() {
  const { dark, toggle } = useTheme();

  return (
    <div>
      <TopBar title="Settings" subtitle="Workspace preferences" />
      <div className="mx-auto max-w-2xl space-y-6 p-6">
        <Card>
          <CardHeader title="Appearance" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Dark mode</p>
              <p className="text-xs text-slate-500">Use a darker palette for low-light environments</p>
            </div>
            <Button variant="outline" size="sm" onClick={toggle}>
              {dark ? 'Switch to light' : 'Switch to dark'}
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader title="API configuration" subtitle="Backend integration" />
          <div className="space-y-3 text-sm">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">API base URL</label>
              <input
                defaultValue="http://localhost:8000/api"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
              />
            </div>
            <p className="text-xs text-slate-400">
              Point this to your FastAPI / Node backend. Service functions in{' '}
              <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">services/api.ts</code> will
              use this base URL.
            </p>
            <Button size="sm">Save (placeholder)</Button>
          </div>
        </Card>

        <Card>
          <CardHeader title="About" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            HireNext.ai — Secure Multimodal AI Video Interview Assessment Platform.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Capstone prototype · B.Tech Computer Engineering · Demo data only unless backend is
            connected.
          </p>
        </Card>
      </div>
    </div>
  );
}
