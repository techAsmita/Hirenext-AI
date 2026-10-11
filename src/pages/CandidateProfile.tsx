import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Shield,
  MessageSquare,
  Code2,
  Activity,
  Brain,
  Sparkles,
} from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { Card, CardHeader } from '../components/ui/Card';
import { ScoreRing } from '../components/ui/ScoreRing';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Badge, statusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { getCandidate, getAnalysis } from '../services/api';
import type { Candidate, AnalysisResult } from '../types';

export default function CandidateProfile() {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getCandidate(id).then(async (r) => {
      setCandidate(r.data);
      if (r.data?.interviewId) {
        const a = await getAnalysis(r.data.interviewId);
        setAnalysis(a.data);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div>
        <TopBar title="Candidate Profile" />
        <div className="space-y-4 p-6">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div>
        <TopBar title="Candidate not found" />
        <div className="p-6">
          <Link to="/candidates" className="text-indigo-600 hover:underline">
            ← Back to candidates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar
        title={candidate.name}
        subtitle={`${candidate.role} · ${candidate.department}`}
        actions={
          <div className="flex gap-2">
            <Link to="/candidates">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </Button>
            </Link>
            {candidate.interviewId && (
              <Link to={`/reports/${candidate.interviewId}`}>
                <Button size="sm">View Report</Button>
              </Link>
            )}
          </div>
        }
      />

      <div className="space-y-6 p-6">
        {/* Header card */}
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl font-bold text-white shadow-lg shadow-indigo-500/20">
                {candidate.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{candidate.name}</h2>
                <p className="text-sm text-slate-500">{candidate.email}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {statusBadge(candidate.status)}
                  {analysis && statusBadge(analysis.recommendation)}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <ScoreRing score={candidate.overallScore ?? 0} label="Overall" size={80} />
              <ScoreRing score={candidate.authenticityScore ?? 0} label="Authenticity" size={80} />
              <ScoreRing score={candidate.communicationScore ?? 0} label="Communication" size={80} />
              <ScoreRing score={candidate.technicalScore ?? 0} label="Technical" size={80} />
            </div>
          </div>
          {analysis && (
            <div className="mt-5 rounded-xl bg-indigo-50 p-4 dark:bg-indigo-950/40">
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Recommendation rationale
              </p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                {analysis.recommendationRationale}
              </p>
            </div>
          )}
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Performance */}
          <Card>
            <CardHeader title="Performance Overview" />
            <div className="space-y-4">
              {[
                { label: 'Technical Depth', value: candidate.technicalScore, icon: Code2 },
                { label: 'Communication', value: candidate.communicationScore, icon: MessageSquare },
                { label: 'Behaviour', value: candidate.behaviourScore, icon: Activity },
                { label: 'Authenticity', value: candidate.authenticityScore, icon: Shield },
              ].map((m) => (
                <div key={m.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                      <m.icon className="h-3.5 w-3.5 text-slate-400" />
                      {m.label}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">{m.value ?? '—'}</span>
                  </div>
                  <ProgressBar value={m.value ?? 0} />
                </div>
              ))}
            </div>
          </Card>

          {/* Behaviour */}
          {analysis && (
            <Card>
              <CardHeader title="Behaviour Analysis" subtitle="Extracted behavioural signals" />
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Eye Contact', analysis.behaviour.eyeContact],
                  ['Head Movement', analysis.behaviour.headMovement],
                  ['Posture', analysis.behaviour.posture],
                  ['Engagement', analysis.behaviour.engagement],
                  ['Speech Stability', analysis.behaviour.speechStability],
                  ['Facial Activity', analysis.behaviour.facialActivity],
                ].map(([label, val]) => (
                  <div key={String(label)} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{val}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-slate-400">
                These are UI representations of backend analysis states, not medical claims.
              </p>
            </Card>
          )}

          {/* Authenticity */}
          {analysis && (
            <Card>
              <CardHeader
                title="Authenticity Analysis"
                action={statusBadge(analysis.authenticity.riskLevel)}
              />
              <div className="mb-4 flex items-center gap-4">
                <ScoreRing score={analysis.authenticity.overallScore} size={88} label="Integrity" />
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Overall integrity confidence: <strong>{analysis.authenticity.confidence}%</strong>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  ['Face Verification', analysis.authenticity.faceVerification],
                  ['Liveness Detection', analysis.authenticity.livenessDetection],
                  ['Deepfake Detection', analysis.authenticity.deepfakeDetection],
                  ['Lip-sync Consistency', analysis.authenticity.lipSyncConsistency],
                  ['Voice Authenticity', analysis.authenticity.voiceAuthenticity],
                ].map(([label, s]) => {
                  const signal = s as { status: string; score: number; confidence: number };
                  return (
                    <div
                      key={String(label)}
                      className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 dark:border-slate-800"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {label as string}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {signal.confidence}% confidence
                        </p>
                      </div>
                      <Badge variant={signal.status === 'verified' ? 'success' : 'warning'}>
                        {signal.status === 'verified' ? '✓ Verified' : signal.status} · {signal.score}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Personality */}
          {analysis && (
            <Card>
              <CardHeader title="Personality Signals" subtitle="AI-estimated personality-related signals" />
              <div className="space-y-3">
                {[
                  ['Openness', analysis.personality.openness],
                  ['Conscientiousness', analysis.personality.conscientiousness],
                  ['Extraversion', analysis.personality.extraversion],
                  ['Agreeableness', analysis.personality.agreeableness],
                  ['Neuroticism', analysis.personality.neuroticism],
                ].map(([label, val]) => (
                  <div key={String(label)}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-300">{label}</span>
                      <span className="font-semibold">{val}</span>
                    </div>
                    <ProgressBar value={val as number} color="bg-violet-500" />
                  </div>
                ))}
              </div>
              <p className="mt-4 rounded-lg bg-amber-50 p-3 text-[11px] text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                {analysis.personality.disclaimer}
              </p>
            </Card>
          )}
        </div>

        {/* Question-by-question */}
        {analysis && (
          <Card>
            <CardHeader title="Question-by-question analysis" icon={Sparkles} />
            <div className="space-y-4">
              {analysis.responseAnalyses.map((r, i) => (
                <div
                  key={r.questionId}
                  className="rounded-xl border border-slate-100 p-4 dark:border-slate-800"
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-indigo-500">
                        Question {i + 1}
                      </span>
                      <p className="font-semibold text-slate-800 dark:text-slate-100">
                        {r.questionText}
                      </p>
                    </div>
                    <div className="text-right text-xs text-slate-400">
                      {r.durationSeconds}s · {r.speechRate} wpm
                    </div>
                  </div>
                  <p className="mb-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {r.transcript}
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {[
                      ['Relevance', r.relevance],
                      ['Clarity', r.clarity],
                      ['Technical', r.technicalDepth],
                      ['Structure', r.structure],
                      ['Keywords', r.keywordCoverage],
                    ].map(([l, v]) => (
                      <div key={String(l)} className="rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-900">
                        <p className="text-[10px] text-slate-400">{l}</p>
                        <p className="font-bold text-slate-800 dark:text-slate-100">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Quick links */}
        <div className="flex flex-wrap gap-3">
          {candidate.interviewId && (
            <>
              <Link to={`/analysis/${candidate.interviewId}`}>
                <Button variant="outline">Multimodal Intelligence</Button>
              </Link>
              <Link to={`/analysis/authenticity?id=${candidate.interviewId}`}>
                <Button variant="outline">Authenticity Detail</Button>
              </Link>
              <Link to={`/reports/${candidate.interviewId}`}>
                <Button>Full Report</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
