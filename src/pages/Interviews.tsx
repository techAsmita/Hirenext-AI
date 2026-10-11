import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Video, ChevronRight } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { statusBadge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { getInterviews, getCandidates } from '../services/api';
import type { Interview, Candidate } from '../types';

export default function Interviews() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getInterviews(), getCandidates()]).then(([i, c]) => {
      setInterviews(i.data);
      setCandidates(c.data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <TopBar
        title="Interviews"
        subtitle="Create and manage interview sessions"
        actions={
          <Link to="/interviews/create">
            <Button size="sm">
              <Plus className="h-4 w-4" /> Create Interview
            </Button>
          </Link>
        }
      />
      <div className="space-y-4 p-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)
        ) : (
          interviews.map((iv) => {
            const cand = candidates.find((c) => c.id === iv.candidateId);
            return (
              <Card key={iv.id} hover className="!p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                      <Video className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{iv.jobTitle}</p>
                      <p className="text-xs text-slate-500">
                        {iv.department} · {iv.type} · {iv.difficulty} · {iv.durationMinutes} min ·{' '}
                        {iv.questionCount} questions
                      </p>
                      {cand && (
                        <p className="mt-0.5 text-xs text-slate-400">Candidate: {cand.name}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {statusBadge(iv.status)}
                    <Link to={`/interviews/${iv.id}`}>
                      <Button variant="ghost" size="sm">
                        Details <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
