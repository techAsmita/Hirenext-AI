import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { Card, CardHeader } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ScoreRing } from '../components/ui/ScoreRing';
import { Button } from '../components/ui/Button';
import { getBehaviourAnalysis } from '../services/api';
import type { BehaviourResult } from '../types';

export default function BehaviourPage() {
  const [data, setData] = useState<BehaviourResult | null>(null);

  useEffect(() => {
    getBehaviourAnalysis('i1').then((r) => setData(r.data));
  }, []);

  return (
    <div>
      <TopBar
        title="Behaviour Intelligence"
        subtitle="Extracted behavioural signals from interview video"
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
            <Card className="flex flex-wrap items-center gap-8">
              <ScoreRing score={data.overall} size={100} label="Overall behaviour" />
              <p className="max-w-md text-sm text-slate-500">
                Metrics below are UI representations of backend analysis states. They are not
                medical or psychological claims.
              </p>
            </Card>
            <Card>
              <CardHeader title="Signal breakdown" />
              <div className="space-y-4">
                {[
                  ['Eye Contact', data.eyeContact],
                  ['Head Movement', data.headMovement],
                  ['Posture', data.posture],
                  ['Engagement', data.engagement],
                  ['Speech Stability', data.speechStability],
                  ['Facial Activity', data.facialActivity],
                ].map(([l, v]) => (
                  <div key={String(l)}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-300">{l}</span>
                      <span className="font-bold">{v}</span>
                    </div>
                    <ProgressBar value={v as number} />
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <CardHeader title="Evidence" />
              <ul className="space-y-2">
                {data.evidence.map((e, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span className="text-indigo-500">•</span> {e}
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
