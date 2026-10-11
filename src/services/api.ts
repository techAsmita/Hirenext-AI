const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function checkBackendHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error(`Backend health check failed: ${response.status}`);
  }

  return response.json();
}

/**
 * API-ready service layer.
 *
 * All UI consumes data through these functions.
 * Currently backed by DEMO data adapters.
 * Replace implementations with real HTTP/WebSocket calls when backend is ready.
 *
 * Pattern:
 *   export async function getCandidates(): Promise<ApiResponse<Candidate[]>>
 *   → currently returns demo; later: fetch('/api/candidates')
 */

import type {
  ApiResponse,
  Candidate,
  Interview,
  DashboardStats,
  AnalysisResult,
  AuthenticityResult,
  BehaviourResult,
  PersonalityResult,
  MultimodalResult,
  ExplainabilityResult,
  Report,
  ProcessingStage,
  InterviewResponse,
} from '../types';
import {
  DEMO_CANDIDATES,
  DEMO_INTERVIEWS,
  DEMO_DASHBOARD,
  DEMO_AUTHENTICITY,
  DEMO_BEHAVIOUR,
  DEMO_PERSONALITY,
  DEMO_MULTIMODAL,
  DEMO_RESPONSES,
  buildDemoAnalysis,
} from '../data/demoData';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

function wrap<T>(data: T): ApiResponse<T> {
  return { data, source: 'demo', timestamp: new Date().toISOString() };
}

// --- Candidates ---
export async function getCandidates(): Promise<ApiResponse<Candidate[]>> {
  const token = localStorage.getItem('hn-access-token');

  if (!token) {
    throw new Error('Your session has expired. Please sign in again.');
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/candidates`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    throw new Error('Your session has expired. Please sign in again.');
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch candidates: ${response.status} ${errorText}`
    );
  }

  const records = await response.json();

  const candidates: Candidate[] = records.map((c: any) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    avatar: c.avatar ?? undefined,
    role: c.role,
    department: c.department,
    status: c.status === 'in_review' ? 'under_review' : c.status,
    overallScore: c.overall_score ?? null,
    authenticityScore: c.authenticity_score ?? null,
    communicationScore: c.communication_score ?? null,
    technicalScore: c.technical_score ?? null,
    behaviourScore: c.behaviour_score ?? null,
    interviewId: c.interview_id ?? null,
    interviewDate: c.interview_date ?? null,
    createdAt: c.created_at,
  }));

  return {
    data: candidates,
    source: 'api',
    timestamp: new Date().toISOString(),
  };
}

export async function getCandidate(id: string): Promise<ApiResponse<Candidate | null>> {
  await delay();
  return wrap(DEMO_CANDIDATES.find((c) => c.id === id) ?? null);
}

// --- Interviews ---

export async function getInterviews(): Promise<ApiResponse<Interview[]>> {
  const token = localStorage.getItem('hn-access-token');

  if (!token) {
    throw new Error('Your session has expired. Please sign in again.');
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/interviews`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    throw new Error('Your session has expired. Please sign in again.');
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch interviews: ${response.status} ${errorText}`
    );
  }

  const records = await response.json();

  const interviews: Interview[] = records.map((item: any) => ({
    id: item.id,
    jobTitle: item.job_title,
    department: item.department,
    type: item.type,
    difficulty: item.difficulty,
    durationMinutes: item.duration_minutes,
    questionCount: item.question_count,
    questions: (item.questions ?? []).map((q: any) => ({
      id: q.id,
      text: q.text,
      category: q.category,
      order: q.order,
    })),
    status: item.status,
    candidateId: item.candidate_id ?? null,
    enableAuthenticity: item.enable_authenticity,
    enableBehaviour: item.enable_behaviour,
    enablePersonality: item.enable_personality,
    enableAIEvaluation: item.enable_ai_evaluation,
    shareLink: item.share_link,
    createdAt: item.created_at,
    completedAt: item.completed_at ?? undefined,
  }));

  return {
    data: interviews,
    source: 'api',
    timestamp: new Date().toISOString(),
  };
}


export async function getInterview(id: string): Promise<ApiResponse<Interview | null>> {
  const response = await fetch(`${API_BASE_URL}/api/v1/interviews/${id}`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Interview fetch failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  const interview: Interview = {
    id: data.id,
    jobTitle: data.job_title,
    department: data.department,
    type: data.type,
    difficulty: data.difficulty,
    durationMinutes: data.duration_minutes,
    questionCount: data.question_count,
    questions: data.questions ?? [],
    status: data.status,
    candidateId: data.candidate_id,
    enableAuthenticity: data.enable_authenticity,
    enableBehaviour: data.enable_behaviour,
    enablePersonality: data.enable_personality,
    enableAIEvaluation: data.enable_ai_evaluation,
    shareLink: data.share_link,
    createdAt: data.created_at,
    completedAt: data.completed_at,
  };

  return {
    data: interview,
    source: 'api',
    timestamp: new Date().toISOString(),
  };
}


export async function createInterview(
  payload: Partial<Interview>
): Promise<ApiResponse<Interview>> {
  const token = localStorage.getItem('hn-access-token');

  if (!token) {
    throw new Error('Your session has expired. Please sign in again.');
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/interviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      job_title: payload.jobTitle,
      department: payload.department,
      type: payload.type,
      difficulty: payload.difficulty,
      duration_minutes: payload.durationMinutes,
      questions: (payload.questions ?? []).map((q, index) => ({
        text: q.text,
        category: q.category,
        order: index + 1,
      })),
      candidate_id: payload.candidateId ?? null,
      enable_authenticity: payload.enableAuthenticity ?? true,
      enable_behaviour: payload.enableBehaviour ?? true,
      enable_personality: payload.enablePersonality ?? true,
      enable_ai_evaluation: payload.enableAIEvaluation ?? true,
    }),
  });

  if (response.status === 401) {
    throw new Error('Your session has expired. Please sign in again.');
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Interview creation failed: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();

  const interview: Interview = {
    id: data.id,
    jobTitle: data.job_title,
    department: data.department,
    type: data.type,
    difficulty: data.difficulty,
    durationMinutes: data.duration_minutes,
    questionCount: data.question_count,
    questions: (data.questions ?? []).map((q: any) => ({
      id: q.id,
      text: q.text,
      category: q.category,
      order: q.order,
    })),
    status: data.status,
    candidateId: data.candidate_id ?? null,
    enableAuthenticity: data.enable_authenticity,
    enableBehaviour: data.enable_behaviour,
    enablePersonality: data.enable_personality,
    enableAIEvaluation: data.enable_ai_evaluation,
    shareLink: data.share_link,
    createdAt: data.created_at,
    completedAt: data.completed_at ?? undefined,
  };

  return {
    data: interview,
    source: 'api',
    timestamp: new Date().toISOString(),
  };
}


// --- Authentication ---
export async function loginRecruiter(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Login failed: ${response.status} ${errorText}`);
  }

  return response.json() as Promise<{
    access_token: string;
    token_type: string;
  }>;
}

// --- Dashboard ---
export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  const token = localStorage.getItem('hn-access-token');

  const response = await fetch(`${API_BASE_URL}/api/v1/dashboard/stats`, {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {},
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Dashboard stats failed: ${response.status} ${errorText}`);
  }

  const data: DashboardStats = await response.json();

  return wrap(data);
}

// --- Analysis (backend will inject real model outputs) ---
export async function getAnalysis(interviewId: string): Promise<ApiResponse<AnalysisResult | null>> {
  await delay(500);
  const interview = DEMO_INTERVIEWS.find((i) => i.id === interviewId);
  if (!interview || !interview.candidateId) return wrap(null);
  return wrap(buildDemoAnalysis(interviewId, interview.candidateId));
}

export async function getAuthenticityAnalysis(
  interviewId: string
): Promise<ApiResponse<AuthenticityResult>> {
  await delay();
  return wrap({ ...DEMO_AUTHENTICITY, interviewId });
}

export async function getBehaviourAnalysis(
  interviewId: string
): Promise<ApiResponse<BehaviourResult>> {
  await delay();
  return wrap({ ...DEMO_BEHAVIOUR, interviewId });
}

export async function getPersonalityAnalysis(
  interviewId: string
): Promise<ApiResponse<PersonalityResult>> {
  await delay();
  return wrap({ ...DEMO_PERSONALITY, interviewId });
}

export async function getMultimodalAnalysis(
  interviewId: string
): Promise<ApiResponse<MultimodalResult>> {
  await delay();
  return wrap({ ...DEMO_MULTIMODAL, interviewId });
}

export async function getExplainability(
  interviewId: string,
  scoreName: string
): Promise<ApiResponse<ExplainabilityResult>> {
  await delay();
  return wrap({
    interviewId,
    scoreName,
    scoreValue: 86,
    confidence: 88,
    reasons: [
      'Structured response with clear problem → approach → outcome narrative',
      'Consistent speech rate and minimal filler words',
      'Appropriate technical terminology for the role level',
      'Logical progression of ideas across the answer',
    ],
    evidenceSources: [
      {
        questionId: 'q2',
        timestampStart: 192,
        timestampEnd: 214,
        transcriptSegment:
          'I started by instrumenting the critical path, identified a race condition in the lock acquisition logic...',
      },
    ],
    featureContributions: [
      { feature: 'Response structure', contribution: 0.28 },
      { feature: 'Technical keyword density', contribution: 0.24 },
      { feature: 'Speech clarity', contribution: 0.18 },
      { feature: 'Relevance to prompt', contribution: 0.16 },
      { feature: 'Pause discipline', contribution: 0.14 },
    ],
  });
}

export async function getReport(interviewId: string): Promise<ApiResponse<Report | null>> {
  await delay();
  const analysis = await getAnalysis(interviewId);
  if (!analysis.data) return wrap(null);
  return wrap({
    id: `r-${interviewId}`,
    interviewId,
    candidateId: analysis.data.candidateId,
    generatedAt: new Date().toISOString(),
    analysis: analysis.data,
  });
}

// --- Processing pipeline (maps to backend job status) ---
export async function getInterviewStatus(
  interviewId: string
): Promise<ApiResponse<{ stages: ProcessingStage[]; overall: string }>> {
  await delay(200);
  const stages: ProcessingStage[] = [
    { id: 'upload', name: 'Uploading / Local Processing', status: 'completed' },
    { id: 'video', name: 'Video Processing', status: 'completed' },
    { id: 'audio', name: 'Audio Processing', status: 'completed' },
    { id: 'speech', name: 'Speech Transcription', status: 'completed' },
    { id: 'behaviour', name: 'Behaviour Extraction', status: 'processing', progress: 60 },
    { id: 'authenticity', name: 'Authenticity Analysis', status: 'pending' },
    { id: 'fusion', name: 'Multimodal Fusion', status: 'pending' },
    { id: 'assessment', name: 'Assessment Generation', status: 'pending' },
    { id: 'explain', name: 'Explainability', status: 'pending' },
  ];
  return wrap({ stages, overall: 'processing' });
}

export async function startInterview(
  interviewId: string
): Promise<ApiResponse<{ sessionToken: string }>> {
  await delay();
  return wrap({ sessionToken: `sess-${interviewId}-${Date.now()}` });
}

export async function uploadInterviewResponse(
  _payload: Partial<InterviewResponse>
): Promise<ApiResponse<{ accepted: boolean }>> {
  await delay(300);
  return wrap({ accepted: true });
}

export async function uploadMedia(file: Blob | File) {
  const formData = new FormData();
  formData.append('file', file, file instanceof File ? file.name : 'interview.webm');

  const response = await fetch(`${API_BASE_URL}/api/v1/media/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Media upload failed: ${response.status} ${errorText}`);
  }

  return response.json();
}
