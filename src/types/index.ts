export type CandidateStatus =
  | 'shortlisted'
  | 'under_review'
  | 'rejected'
  | 'flagged'
  | 'interview_pending';

export type InterviewStatus =
  | 'draft'
  | 'scheduled'
  | 'in_progress'
  | 'processing'
  | 'completed'
  | 'failed';

export type ProcessingStageStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  department: string;
  status: CandidateStatus;
  overallScore: number | null;
  authenticityScore: number | null;
  communicationScore: number | null;
  technicalScore: number | null;
  behaviourScore: number | null;
  interviewId: string | null;
  interviewDate: string | null;
  createdAt: string;
}

export interface Interview {
  id: string;
  jobTitle: string;
  department: string;
  type: 'technical' | 'behavioural' | 'mixed' | 'screening';
  difficulty: 'junior' | 'mid' | 'senior';
  durationMinutes: number;
  questionCount: number;
  questions: InterviewQuestion[];
  status: InterviewStatus;
  candidateId: string | null;
  enableAuthenticity: boolean;
  enableBehaviour: boolean;
  enablePersonality: boolean;
  enableAIEvaluation: boolean;
  shareLink: string;
  createdAt: string;
  completedAt?: string;
}

export interface InterviewQuestion {
  id: string;
  text: string;
  category: 'intro' | 'technical' | 'behavioural' | 'situational' | 'custom';
  order: number;
}

export interface InterviewResponse {
  id: string;
  interviewId: string;
  questionId: string;
  transcript: string;
  durationSeconds: number;
  audioUrl?: string;
  videoUrl?: string;
  recordedAt: string;
}

export interface ProcessingStage {
  id: string;
  name: string;
  status: ProcessingStageStatus;
  progress?: number;
  message?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface AuthenticityResult {
  interviewId: string;
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  faceVerification: SignalScore;
  livenessDetection: SignalScore;
  deepfakeDetection: SignalScore;
  lipSyncConsistency: SignalScore;
  voiceAuthenticity: SignalScore;
  anomalies: TimelineAnomaly[];
  confidence: number;
}

export interface SignalScore {
  status: 'verified' | 'anomaly' | 'inconclusive';
  score: number;
  confidence: number;
  evidence?: string;
}

export interface TimelineAnomaly {
  timestamp: number;
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface BehaviourResult {
  interviewId: string;
  eyeContact: number;
  headMovement: number;
  posture: number;
  engagement: number;
  speechStability: number;
  facialActivity: number;
  overall: number;
  evidence: string[];
}

export interface PersonalityResult {
  interviewId: string;
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  disclaimer: string;
  evidence: string[];
}

export interface ResponseAnalysis {
  questionId: string;
  questionText: string;
  transcript: string;
  durationSeconds: number;
  speechRate: number;
  pauseCount: number;
  fillerWordCount: number;
  relevance: number;
  clarity: number;
  technicalDepth: number;
  structure: number;
  keywordCoverage: number;
}

export interface MultimodalResult {
  interviewId: string;
  videoSignals: {
    facialSignals: number;
    eyeContact: number;
    posture: number;
    engagement: number;
  };
  audioSignals: {
    voiceCharacteristics: number;
    speechRate: number;
    pauses: number;
    energy: number;
  };
  textSignals: {
    relevance: number;
    technicalDepth: number;
    sentiment: number;
    communication: number;
  };
  fused: {
    communication: number;
    confidence: number;
    relevance: number;
    consistency: number;
    authenticity: number;
  };
  overallAssessment: number;
}

export interface ExplainabilityResult {
  interviewId: string;
  scoreName: string;
  scoreValue: number;
  confidence: number;
  reasons: string[];
  evidenceSources: {
    questionId: string;
    timestampStart: number;
    timestampEnd: number;
    transcriptSegment: string;
  }[];
  featureContributions: { feature: string; contribution: number }[];
}

export interface AnalysisResult {
  interviewId: string;
  candidateId: string;
  overallScore: number;
  authenticity: AuthenticityResult;
  behaviour: BehaviourResult;
  personality: PersonalityResult;
  multimodal: MultimodalResult;
  responseAnalyses: ResponseAnalysis[];
  recommendation: 'strong_hire' | 'hire' | 'maybe' | 'no_hire';
  recommendationRationale: string;
  processedAt: string;
}

export interface Report {
  id: string;
  interviewId: string;
  candidateId: string;
  generatedAt: string;
  analysis: AnalysisResult;
}

export interface DashboardStats {
  totalCandidates: number;
  interviewsCompleted: number;
  shortlisted: number;
  averageScore: number;
  authenticityRisk: number;
  averageDurationMinutes: number;
  processingTimeSeconds: number;
  completionRate: number;
  pipeline: {
    applied: number;
    authenticated: number;
    interviewed: number;
    inReview: number;
    shortlisted: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  source: 'demo' | 'api';
  timestamp: string;
}
