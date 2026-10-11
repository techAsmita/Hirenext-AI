from datetime import datetime

from enum import Enum

from pydantic import BaseModel, ConfigDict, EmailStr, Field

class InterviewStatus(str, Enum):
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    EXPIRED = "expired"


class CandidateStatus(str, Enum):
    INTERVIEW_PENDING = "interview_pending"
    AUTHENTICATED = "authenticated"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    IN_REVIEW = "in_review"
    SHORTLISTED = "shortlisted"
    REJECTED = "rejected"


class CandidateStatusUpdate(BaseModel):
    status: CandidateStatus


class CandidateCreate(BaseModel):
    name: str
    email: EmailStr
    avatar: str | None = None
    role: str
    department: str


class CandidateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    email: str
    avatar: str | None
    role: str
    department: str
    status: str
    overall_score: float | None
    authenticity_score: float | None
    communication_score: float | None
    technical_score: float | None
    behaviour_score: float | None
    interview_date: datetime | None
    created_at: datetime


class InterviewQuestionCreate(BaseModel):
    text: str = Field(min_length=1, max_length=2000)
    category: str = Field(min_length=1, max_length=100)
    order: int = Field(ge=1)


class InterviewCreate(BaseModel):
    job_title: str = Field(min_length=1, max_length=200)
    department: str = Field(min_length=1, max_length=100)
    type: str = Field(min_length=1, max_length=50)
    difficulty: str = Field(min_length=1, max_length=50)
    duration_minutes: int = Field(gt=0, le=480)
    questions: list[InterviewQuestionCreate] = Field(min_length=1, max_length=100)
    candidate_id: str | None = None
    enable_authenticity: bool = True
    enable_behaviour: bool = True
    enable_personality: bool = True
    enable_ai_evaluation: bool = True

class InterviewStatusUpdate(BaseModel):
    status: InterviewStatus

class InterviewQuestionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    interview_id: str
    text: str
    category: str
    order: int


class InterviewResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    job_title: str
    department: str
    type: str
    difficulty: str
    duration_minutes: int
    question_count: int
    status: str
    candidate_id: str | None
    enable_authenticity: bool
    enable_behaviour: bool
    enable_personality: bool
    enable_ai_evaluation: bool
    share_link: str
    created_at: datetime
    completed_at: datetime | None
    questions: list[InterviewQuestionResponse] = []


class CandidateInterviewAccessResponse(BaseModel):
    interview: InterviewResponse
    session_token: str


class InterviewResponseCreate(BaseModel):
    question_id: str = Field(min_length=1)
    transcript: str = Field(default="", max_length=50000)
    duration_seconds: float = Field(ge=0, le=28800)
    audio_url: str | None = Field(default=None, max_length=2048)
    video_url: str | None = Field(default=None, max_length=2048)


class InterviewResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    interview_id: str
    question_id: str
    transcript: str
    duration_seconds: float
    audio_url: str | None
    video_url: str | None
    recorded_at: datetime

class RecruiterCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class RecruiterLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
