import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Copy } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { createInterview } from '../services/api';
import type { Interview } from '../types';

const PRESET_QUESTIONS = [
  { text: 'Tell me about yourself and your background.', category: 'intro' as const },
  { text: 'Describe a challenging technical problem you solved.', category: 'technical' as const },
  { text: 'Tell me about a time you had to work under pressure.', category: 'behavioural' as const },
  { text: 'How would you handle a disagreement with a teammate?', category: 'situational' as const },
];

export default function CreateInterview() {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState('Software Engineer');
  const [department, setDepartment] = useState('Engineering');
  const [type, setType] = useState<'technical' | 'behavioural' | 'mixed' | 'screening'>('mixed');
  const [difficulty, setDifficulty] = useState<'junior' | 'mid' | 'senior'>('mid');
  const [duration, setDuration] = useState(25);
  const [questionCount, setQuestionCount] = useState(3);
  const [selectedQ, setSelectedQ] = useState([0, 1, 2]);
  const [enableAuth, setEnableAuth] = useState(true);
  const [enableBehaviour, setEnableBehaviour] = useState(true);
  const [enablePersonality, setEnablePersonality] = useState(true);
  const [enableAI, setEnableAI] = useState(true);
  const [created, setCreated] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    const questions = selectedQ.map((i, order) => ({
      id: `q-${i}`,
      text: PRESET_QUESTIONS[i].text,
      category: PRESET_QUESTIONS[i].category,
      order: order + 1,
    }));
    const res = await createInterview({
      jobTitle,
      department,
      type,
      difficulty,
      durationMinutes: duration,
      questionCount,
      questions,
      enableAuthenticity: enableAuth,
      enableBehaviour,
      enablePersonality,
      enableAIEvaluation: enableAI,
    });
    setCreated(res.data);
    setLoading(false);
  };

  if (created) {
    return (
      <div>
        <TopBar title="Interview Created" />
        <div className="flex justify-center p-6">
          <Card className="w-full max-w-md text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Interview ready</h2>
            <p className="mt-1 text-sm text-slate-500">{created.jobTitle}</p>
            <div className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
              <p className="text-xs text-slate-400">Share link</p>
              <p className="mt-1 break-all text-sm font-medium text-indigo-600">{created.shareLink}</p>
            </div>
            <div className="mt-4 flex gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard?.writeText(created.shareLink)}
              >
                <Copy className="h-3.5 w-3.5" /> Copy link
              </Button>
              <Button size="sm" onClick={() => navigate('/interviews')}>
                Go to interviews
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar
        title="Create Interview"
        subtitle="Configure a new multimodal assessment session"
        actions={
          <Link to="/interviews">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-3.5 w-3.5" /> Cancel
            </Button>
          </Link>
        }
      />
      <div className="mx-auto max-w-2xl space-y-6 p-6">
        <Card>
          <CardHeader title="Role details" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Job Title">
              <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="input" />
            </Field>
            <Field label="Department">
              <input value={department} onChange={(e) => setDepartment(e.target.value)} className="input" />
            </Field>
            <Field label="Interview Type">
              <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className="input">
                <option value="technical">Technical</option>
                <option value="behavioural">Behavioural</option>
                <option value="mixed">Mixed</option>
                <option value="screening">Screening</option>
              </select>
            </Field>
            <Field label="Difficulty">
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as typeof difficulty)} className="input">
                <option value="junior">Junior</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
              </select>
            </Field>
            <Field label="Duration (minutes)">
              <input type="number" value={duration} onChange={(e) => setDuration(+e.target.value)} className="input" />
            </Field>
            <Field label="Number of questions">
              <input type="number" value={questionCount} onChange={(e) => setQuestionCount(+e.target.value)} className="input" min={1} max={8} />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Questions" />
          <div className="space-y-2">
            {PRESET_QUESTIONS.map((q, i) => (
              <label
                key={i}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-100 p-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
              >
                <input
                  type="checkbox"
                  checked={selectedQ.includes(i)}
                  onChange={() =>
                    setSelectedQ((prev) =>
                      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
                    )
                  }
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{q.text}</p>
                  <p className="text-[11px] capitalize text-slate-400">{q.category}</p>
                </div>
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="AI modules" />
          <div className="space-y-3">
            {[
              ['Authenticity checks', enableAuth, setEnableAuth],
              ['Behavioural analysis', enableBehaviour, setEnableBehaviour],
              ['Personality analysis', enablePersonality, setEnablePersonality],
              ['AI evaluation', enableAI, setEnableAI],
            ].map(([label, val, setter]) => (
              <label key={String(label)} className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300">{label as string}</span>
                <input
                  type="checkbox"
                  checked={val as boolean}
                  onChange={(e) => (setter as (v: boolean) => void)(e.target.checked)}
                  className="h-4 w-4 rounded"
                />
              </label>
            ))}
          </div>
        </Card>

        <Button className="w-full" size="lg" loading={loading} onClick={handleCreate}>
          Generate Interview
        </Button>
      </div>
      <style>{`.input{height:2.5rem;width:100%;border-radius:0.75rem;border:1px solid #e2e8f0;background:#fff;padding:0 0.75rem;font-size:0.875rem;outline:none}.input:focus{border-color:#a5b4fc;box-shadow:0 0 0 3px #e0e7ff}.dark .input{border-color:#334155;background:#0f172a}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
        {label}
      </label>
      {children}
    </div>
  );
}
