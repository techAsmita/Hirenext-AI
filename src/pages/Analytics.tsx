import { TopBar } from '../components/layout/TopBar';
import { Card, CardHeader } from '../components/ui/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts';

const scoreDist = [
  { range: '90+', n: 8 },
  { range: '80-89', n: 14 },
  { range: '70-79', n: 9 },
  { range: '60-69', n: 4 },
  { range: '<60', n: 1 },
];

const authRisk = [
  { week: 'W1', low: 12, med: 2, high: 0 },
  { week: 'W2', low: 15, med: 1, high: 1 },
  { week: 'W3', low: 18, med: 3, high: 0 },
  { week: 'W4', low: 14, med: 2, high: 1 },
];

const radarData = [
  { metric: 'Communication', value: 84 },
  { metric: 'Technical', value: 88 },
  { metric: 'Authenticity', value: 94 },
  { metric: 'Behaviour', value: 80 },
  { metric: 'Relevance', value: 86 },
];

const latency = [
  { day: 'Mon', ms: 92 },
  { day: 'Tue', ms: 88 },
  { day: 'Wed', ms: 105 },
  { day: 'Thu', ms: 91 },
  { day: 'Fri', ms: 87 },
];

export default function Analytics() {
  return (
    <div>
      <TopBar title="Analytics" subtitle="Hiring intelligence trends" />
      <div className="grid gap-6 p-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Candidate Score Distribution" />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDist}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="n" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Authenticity Risk Trend" />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={authRisk}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="low" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="med" stackId="a" fill="#f59e0b" />
                <Bar dataKey="high" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Average Capability Profile" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#64748b' }} />
                <Radar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Processing Latency (seconds)" />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latency}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Line type="monotone" dataKey="ms" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <p className="pb-6 text-center text-[11px] text-slate-400">
        Analytics charts use illustrative series. Wire to analytics service for production metrics.
      </p>
    </div>
  );
}
