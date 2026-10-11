import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronRight } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { Card } from '../components/ui/Card';
import { statusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { getCandidates } from '../services/api';
import type { Candidate, CandidateStatus } from '../types';

export default function Candidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    getCandidates().then((r) => {
      setCandidates(r.data);
      setLoading(false);
    });
  }, []);

  const roles = useMemo(
    () => ['all', ...Array.from(new Set(candidates.map((c) => c.role)))],
    [candidates]
  );

  const filtered = candidates.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchRole = roleFilter === 'all' || c.role === roleFilter;
    return matchSearch && matchStatus && matchRole;
  });

  return (
    <div>
      <TopBar title="Candidates" subtitle="Manage and review candidate assessments" />
      <div className="space-y-4 p-6">
        <Card className="!p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, role..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="all">All statuses</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="under_review">Under Review</option>
              <option value="rejected">Rejected</option>
              <option value="flagged">Flagged</option>
              <option value="interview_pending">Interview Pending</option>
            </select>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r === 'all' ? 'All roles' : r}
                </option>
              ))}
            </select>
            <Button variant="outline" size="sm">
              <Filter className="h-3.5 w-3.5" /> More filters
            </Button>
          </div>
        </Card>

        <Card className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/50">
                  <th className="px-5 py-3">Candidate</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Overall</th>
                  <th className="px-4 py-3">Authenticity</th>
                  <th className="px-4 py-3">Communication</th>
                  <th className="px-4 py-3">Technical</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={9} className="px-5 py-3">
                          <Skeleton className="h-10 w-full" />
                        </td>
                      </tr>
                    ))
                  : filtered.map((c) => (
                      <tr
                        key={c.id}
                        className="border-b border-slate-50 transition hover:bg-slate-50/80 dark:border-slate-800/50 dark:hover:bg-slate-900/40"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                              {c.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-slate-100">{c.name}</p>
                              <p className="text-xs text-slate-400">{c.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{c.role}</td>
                        <td className="px-4 py-3">
                          <ScoreCell value={c.overallScore} />
                        </td>
                        <td className="px-4 py-3">
                          <ScoreCell value={c.authenticityScore} />
                        </td>
                        <td className="px-4 py-3">
                          <ScoreCell value={c.communicationScore} />
                        </td>
                        <td className="px-4 py-3">
                          <ScoreCell value={c.technicalScore} />
                        </td>
                        <td className="px-4 py-3">{statusBadge(c.status)}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          {c.interviewDate
                            ? new Date(c.interviewDate).toLocaleDateString()
                            : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <Link to={`/candidates/${c.id}`}>
                            <Button variant="ghost" size="sm">
                              View <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
            {!loading && filtered.length === 0 && (
              <div className="py-16 text-center text-sm text-slate-400">
                No candidates match your filters.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ScoreCell({ value }: { value: number | null }) {
  if (value == null) return <span className="text-slate-300">—</span>;
  const color =
    value >= 80 ? 'text-emerald-600' : value >= 60 ? 'text-indigo-600' : 'text-amber-600';
  return <span className={`font-semibold ${color}`}>{value}</span>;
}
