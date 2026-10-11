import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, Circle, XCircle, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { getInterviewStatus } from '../services/api';
import type { ProcessingStage } from '../types';

const STAGE_NAMES = [
  'Uploading / Local Processing',
  'Video Processing',
  'Audio Processing',
  'Speech Transcription',
  'Behaviour Extraction',
  'Authenticity Analysis',
  'Multimodal Fusion',
  'Assessment Generation',
  'Explainability',
];

export default function Processing() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stages, setStages] = useState<ProcessingStage[]>(
    STAGE_NAMES.map((name, i) => ({
      id: `s${i}`,
      name,
      status: i === 0 ? 'processing' : 'pending',
    }))
  );
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Simulate progressive stage completion (maps to future WebSocket/polling)
    let idx = 0;
    const interval = setInterval(() => {
      setStages((prev) => {
        const next = prev.map((s, i) => {
          if (i < idx) return { ...s, status: 'completed' as const };
          if (i === idx) return { ...s, status: 'processing' as const, progress: 70 };
          return s;
        });
        return next;
      });
      idx++;
      if (idx >= STAGE_NAMES.length) {
        clearInterval(interval);
        setStages((prev) => prev.map((s) => ({ ...s, status: 'completed' as const })));
        setDone(true);
      }
    }, 900);

    // Also fetch real status shape once
    if (id) getInterviewStatus(id);

    return () => clearInterval(interval);
  }, [id]);

  const completed = stages.filter((s) => s.status === 'completed').length;
  const pct = Math.round((completed / stages.length) * 100);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {done ? 'Analysis complete' : 'Processing interview'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {done
              ? 'Multimodal assessment is ready for review.'
              : 'Secure pipeline running across video, audio, and text modalities.'}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="mb-2 flex justify-between text-xs font-medium text-slate-500">
            <span>Pipeline progress</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <ul className="space-y-3">
            {stages.map((s) => (
              <li key={s.id} className="flex items-center gap-3">
                {s.status === 'completed' && (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                )}
                {s.status === 'processing' && (
                  <Loader2 className="h-5 w-5 shrink-0 animate-spin text-indigo-500" />
                )}
                {s.status === 'pending' && (
                  <Circle className="h-5 w-5 shrink-0 text-slate-300 dark:text-slate-600" />
                )}
                {s.status === 'failed' && (
                  <XCircle className="h-5 w-5 shrink-0 text-red-500" />
                )}
                <span
                  className={`text-sm ${
                    s.status === 'completed'
                      ? 'font-medium text-slate-800 dark:text-slate-200'
                      : s.status === 'processing'
                        ? 'font-semibold text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400'
                  }`}
                >
                  {s.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {done && (
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={() => navigate(`/analysis/${id}`)}>View Multimodal Analysis</Button>
            <Button variant="outline" onClick={() => navigate(`/reports/${id}`)}>
              Open Report
            </Button>
          </div>
        )}

        <p className="mt-6 text-center text-[11px] text-slate-400">
          Stages map to backend job status. Ready for WebSocket / polling integration.
        </p>
      </div>
    </div>
  );
}
