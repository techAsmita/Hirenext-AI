import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, Share2, Printer, ArrowLeft } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { Card, CardHeader } from '../components/ui/Card';
import { ScoreRing } from '../components/ui/ScoreRing';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Badge, statusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { getReport, getCandidate } from '../services/api';
import type { Report as ReportType, Candidate } from '../types';

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<ReportType | null>(null);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getReport(id).then(async (r) => {
      setReport(r.data);
      if (r.data) {
        const c = await getCandidate(r.data.candidateId);
        setCandidate(c.data);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div>
        <TopBar title="Report" />
        <div className="p-6"><Skeleton className="h-96" /></div>
      </div>
    );
  }

  if (!report || !candidate) {
    return (
      <div>
        <TopBar title="Report not found" />
        <div className="p-6">
          <Link to="/dashboard" className="text-indigo-600">← Dashboard</Link>
        </div>
      </div>
    );
  }

  const a = report.analysis;

  return (
    <div>
      <TopBar
        title="Assessment Report"
        subtitle={`${candidate.name} · ${candidate.role}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-3.5 w-3.5" /> Print
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-3.5 w-3.5" /> Share
            </Button>
            <Button size="sm">
              <Download className="h-3.5 w-3.5" /> Download
            </Button>
          </div>
        }
      />
      <div className="mx-auto max-w-4xl space-y-6 p-6">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-xl font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                {candidate.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{candidate.name}</h2>
                <p className="text-sm text-slate-500">{candidate.role} · {candidate.email}</p>
                <div className="mt-1 flex gap-2">
                  {statusBadge(candidate.status)}
                  {statusBadge(a.recommendation)}
                </div>
              </div>
            </div>
            <ScoreRing score={a.overallScore} size={90} label="Overall" />
          </div>
          <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
            {a.recommendationRationale}
          </p>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Authenticity', a.authenticity.overallScore],
            ['Communication', a.multimodal.fused.communication],
            ['Technical', a.responseAnalyses[1]?.technicalDepth ?? 0],
            ['Behaviour', a.behaviour.overall],
          ].map(([l, v]) => (
            <Card key={String(l)} className="text-center !p-4">
              <ScoreRing score={v as number} size={64} />
              <p className="mt-1 text-xs font-semibold text-slate-500">{l}</p>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader title="Authenticity" />
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              ['Face Verification', a.authenticity.faceVerification.score],
              ['Liveness', a.authenticity.livenessDetection.score],
              ['Deepfake', a.authenticity.deepfakeDetection.score],
              ['Lip-sync', a.authenticity.lipSyncConsistency.score],
              ['Voice', a.authenticity.voiceAuthenticity.score],
            ].map(([l, v]) => (
              <div key={String(l)} className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">{l}</span>
                <span className="font-bold">{v}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Behaviour signals" />
          <div className="space-y-2">
            {[
              ['Eye Contact', a.behaviour.eyeContact],
              ['Engagement', a.behaviour.engagement],
              ['Posture', a.behaviour.posture],
              ['Speech Stability', a.behaviour.speechStability],
            ].map(([l, v]) => (
              <div key={String(l)}>
                <div className="mb-1 flex justify-between text-xs">
                  <span>{l}</span>
                  <span className="font-semibold">{v}</span>
                </div>
                <ProgressBar value={v as number} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Personality signals" subtitle="AI-estimated — not clinical diagnoses" />
          <div className="space-y-2">
            {[
              ['Openness', a.personality.openness],
              ['Conscientiousness', a.personality.conscientiousness],
              ['Extraversion', a.personality.extraversion],
              ['Agreeableness', a.personality.agreeableness],
              ['Neuroticism', a.personality.neuroticism],
            ].map(([l, v]) => (
              <div key={String(l)}>
                <div className="mb-1 flex justify-between text-xs">
                  <span>{l}</span>
                  <span className="font-semibold">{v}</span>
                </div>
                <ProgressBar value={v as number} color="bg-violet-500" />
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-amber-700 dark:text-amber-400">
            {a.personality.disclaimer}
          </p>
        </Card>

        <Card>
          <CardHeader title="Question analysis" />
          {a.responseAnalyses.map((r, i) => (
            <div key={r.questionId} className="mb-4 border-b border-slate-100 pb-4 last:mb-0 last:border-0 dark:border-slate-800">
              <p className="text-xs font-bold text-indigo-500">Q{i + 1}</p>
              <p className="font-medium text-slate-800 dark:text-slate-100">{r.questionText}</p>
              <p className="mt-1 text-sm text-slate-500 line-clamp-2">{r.transcript}</p>
              <div className="mt-2 flex gap-3 text-xs">
                <span>Relevance {r.relevance}</span>
                <span>Clarity {r.clarity}</span>
                <span>Technical {r.technicalDepth}</span>
              </div>
            </div>
          ))}
        </Card>

        <div className="flex justify-center gap-3">
          <Link to={`/candidates/${candidate.id}`}>
            <Button variant="outline">
              <ArrowLeft className="h-3.5 w-3.5" /> Candidate profile
            </Button>
          </Link>
          <Link to={`/analysis/${id}`}>
            <Button>Multimodal detail</Button>
          </Link>
        </div>

        <p className="text-center text-[11px] text-slate-400">
          Report generated from analysis service. Download/Share are UI placeholders for backend export.
        </p>
      </div>
    </div>
  );
}
