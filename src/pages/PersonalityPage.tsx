import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { TopBar } from '../components/layout/TopBar';
import { Card, CardHeader } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { getPersonalityAnalysis } from '../services/api';
import type { PersonalityResult } from '../types';

export default function PersonalityPage() {
  const [data, setData] = useState<PersonalityResult | null>(null);

  useEffect(() => {
    getPersonalityAnalysis('i1').then((r) => setData(r.data));
  }, []);

  const radar = data
    ? [
        { trait: 'Openness', value: data.openness },
        { trait: 'Conscientiousness', value: data.conscientiousness },
        { trait: 'Extraversion', value: data.extraversion },
        { trait: 'Agreeableness', value: data.agreeableness },
        { trait: 'Neuroticism', value: data.neuroticism },
      ]
    : [];

  return (
    <div>
      <TopBar
        title="Personality Intelligence"
        subtitle="AI-estimated personality-related signals"
        actions={
          <Link to="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </Button>
          </Link>
        }
      />
      <div className="space-y-6 p-6">
        {data && (
          <>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
              {data.disclaimer}
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader title="OCEAN radar" />
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radar}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="trait" tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Radar dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card>
                <CardHeader title="Trait scores" />
                <div className="space-y-4">
                  {radar.map((t) => (
                    <div key={t.trait}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>{t.trait}</span>
                        <span className="font-bold">{t.value}</span>
                      </div>
                      <ProgressBar value={t.value} color="bg-violet-500" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            <Card>
              <CardHeader title="Supporting evidence" />
              <ul className="space-y-2">
                {data.evidence.map((e, i) => (
                  <li key={i} className="text-sm text-slate-600 dark:text-slate-400">
                    • {e}
                  </li>
                ))}
              </ul>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
