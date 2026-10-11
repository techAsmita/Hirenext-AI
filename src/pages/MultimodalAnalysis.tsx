import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Video, Mic, FileText, GitMerge, Sparkles } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { Card, CardHeader } from '../components/ui/Card';
import { ScoreRing } from '../components/ui/ScoreRing';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { getMultimodalAnalysis } from '../services/api';
import type { MultimodalResult } from '../types';

export default function MultimodalAnalysis() {
  const { id } = useParams<{ id: string }>();
  const interviewId = id || 'i1';
  const [data, setData] = useState<MultimodalResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMultimodalAnalysis(interviewId).then((r) => {
      setData(r.data);
      setLoading(false);
    });
  }, [interviewId]);

  return (
    <div>
      <TopBar
        title="Multimodal Intelligence"
        subtitle="Video + Audio + Text → Fusion → Assessment"
        actions={
          <Link to="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
            </Button>
          </Link>
        }
      />
      <div className="space-y-6 p-6">
        {loading || !data ? (
          <Skeleton className="h-96 w-full" />
        ) : (
          <>
            {/* Three modality columns */}
            <div className="grid gap-4 lg:grid-cols-3">
              <ModalityCard
                icon={Video}
                title="VIDEO"
                color="text-blue-600"
                bg="bg-blue-50 dark:bg-blue-950/40"
                signals={[
                  ['Facial signals', data.videoSignals.facialSignals],
                  ['Eye contact', data.videoSignals.eyeContact],
                  ['Posture', data.videoSignals.posture],
                  ['Engagement', data.videoSignals.engagement],
                ]}
              />
              <ModalityCard
                icon={Mic}
                title="AUDIO"
                color="text-violet-600"
                bg="bg-violet-50 dark:bg-violet-950/40"
                signals={[
                  ['Voice characteristics', data.audioSignals.voiceCharacteristics],
                  ['Speech rate', data.audioSignals.speechRate],
                  ['Pauses', data.audioSignals.pauses],
                  ['Energy', data.audioSignals.energy],
                ]}
              />
              <ModalityCard
                icon={FileText}
                title="TEXT"
                color="text-emerald-600"
                bg="bg-emerald-50 dark:bg-emerald-950/40"
                signals={[
                  ['Relevance', data.textSignals.relevance],
                  ['Technical depth', data.textSignals.technicalDepth],
                  ['Sentiment', data.textSignals.sentiment],
                  ['Communication', data.textSignals.communication],
                ]}
              />
            </div>

            {/* Fusion visualization */}
            <Card className="text-center">
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                  <span className="rounded-lg bg-blue-100 px-3 py-1.5 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    VIDEO
                  </span>
                  <span className="text-slate-300">+</span>
                  <span className="rounded-lg bg-violet-100 px-3 py-1.5 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                    AUDIO
                  </span>
                  <span className="text-slate-300">+</span>
                  <span className="rounded-lg bg-emerald-100 px-3 py-1.5 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                    TEXT
                  </span>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900">
                  <GitMerge className="h-5 w-5" />
                </div>
                <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-3 text-white shadow-lg shadow-indigo-500/25">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <Sparkles className="h-4 w-4" /> MULTIMODAL FUSION
                  </div>
                </div>
                <div className="text-xs text-slate-400">↓</div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Candidate Assessment
                </p>
              </div>
            </Card>

            {/* Fused scores */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {[
                ['Communication', data.fused.communication],
                ['Confidence', data.fused.confidence],
                ['Relevance', data.fused.relevance],
                ['Consistency', data.fused.consistency],
                ['Authenticity', data.fused.authenticity],
                ['Overall', data.overallAssessment],
              ].map(([label, score]) => (
                <Card key={String(label)} className="flex flex-col items-center !p-4">
                  <ScoreRing score={score as number} size={64} />
                  <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {label}
                  </p>
                </Card>
              ))}
            </div>

            <p className="text-center text-[11px] text-slate-400">
              Scores originate from <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">getMultimodalAnalysis()</code> —
              replace demo adapter with real model outputs.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function ModalityCard({
  icon: Icon,
  title,
  color,
  bg,
  signals,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  color: string;
  bg: string;
  signals: [string, number][];
}) {
  return (
    <Card>
      <div className={`mb-4 flex items-center gap-2 rounded-xl ${bg} px-3 py-2`}>
        <Icon className={`h-4 w-4 ${color}`} />
        <span className={`text-xs font-bold tracking-wide ${color}`}>{title}</span>
      </div>
      <div className="space-y-3">
        {signals.map(([label, value]) => (
          <div key={label}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-slate-500">{label}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{value}</span>
            </div>
            <ProgressBar value={value} />
          </div>
        ))}
      </div>
    </Card>
  );
}
