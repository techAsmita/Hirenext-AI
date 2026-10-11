import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Shield, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { Card, CardHeader } from '../components/ui/Card';
import { ScoreRing } from '../components/ui/ScoreRing';
import { Badge, statusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { getAuthenticityAnalysis } from '../services/api';
import type { AuthenticityResult } from '../types';

export default function AuthenticityPage() {
  const [params] = useSearchParams();
  const interviewId = params.get('id') || 'i1';
  const [data, setData] = useState<AuthenticityResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuthenticityAnalysis(interviewId).then((r) => {
      setData(r.data);
      setLoading(false);
    });
  }, [interviewId]);

  return (
    <div>
      <TopBar
        title="Interview Integrity"
        subtitle="Authenticity intelligence"
        actions={
          <Link to="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </Button>
          </Link>
        }
      />
      <div className="space-y-6 p-6">
        {loading || !data ? (
          <Skeleton className="h-80 w-full" />
        ) : (
          <>
            <Card>
              <div className="flex flex-wrap items-center gap-8">
                <ScoreRing score={data.overallScore} size={120} stroke={8} label="Integrity score" />
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {data.overallScore} / 100
                    </h2>
                    {statusBadge(data.riskLevel)}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Overall confidence: {data.confidence}%
                  </p>
                  <p className="mt-3 max-w-md text-sm text-slate-600 dark:text-slate-400">
                    Integrity signals are produced by backend authenticity modules. This UI is
                    designed to display API results — not claim live detection.
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ['Face Verification', data.faceVerification],
                ['Liveness Detection', data.livenessDetection],
                ['Deepfake Detection', data.deepfakeDetection],
                ['Lip-sync Consistency', data.lipSyncConsistency],
                ['Voice Authenticity', data.voiceAuthenticity],
              ].map(([label, signal]) => {
                const s = signal as AuthenticityResult['faceVerification'];
                return (
                  <Card key={String(label)} hover>
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-indigo-500" />
                        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {label as string}
                        </h3>
                      </div>
                      {s.status === 'verified' ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : null}
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.score}</p>
                        <p className="text-xs text-slate-400">{s.confidence}% confidence</p>
                      </div>
                      <Badge variant={s.status === 'verified' ? 'success' : 'warning'}>
                        {s.status === 'verified' ? 'Verified' : s.status}
                      </Badge>
                    </div>
                    {s.evidence && (
                      <p className="mt-3 text-xs text-slate-500 border-t border-slate-100 pt-3 dark:border-slate-800">
                        {s.evidence}
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>

            {data.anomalies.length === 0 && (
              <Card>
                <CardHeader title="Anomaly timeline" />
                <p className="text-sm text-slate-500">
                  No significant anomalies detected in this session.
                </p>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
