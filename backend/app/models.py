from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class Recruiter(Base):
    __tablename__ = "recruiters"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid4()),
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        unique=True,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )


class Candidate(Base):
    __tablename__ = "candidates"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid4()),
    )

    name: Mapped[str] = mapped_column(String(150), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    avatar: Mapped[str | None] = mapped_column(String(500), nullable=True)

    role: Mapped[str] = mapped_column(String(150), nullable=False)
    department: Mapped[str] = mapped_column(String(150), nullable=False)

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="interview_pending",
    )

    overall_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    authenticity_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    communication_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    technical_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    behaviour_score: Mapped[float | None] = mapped_column(Float, nullable=True)

    interview_date: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    interviews: Mapped[list["Interview"]] = relationship(
        back_populates="candidate",
        cascade="all, delete-orphan",
    )


class Interview(Base):
    __tablename__ = "interviews"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid4()),
    )

    job_title: Mapped[str] = mapped_column(String(200), nullable=False)
    department: Mapped[str] = mapped_column(String(150), nullable=False)

    type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    difficulty: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    duration_minutes: Mapped[int] = mapped_column(nullable=False)
    question_count: Mapped[int] = mapped_column(nullable=False)

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="draft",
    )

    candidate_id: Mapped[str | None] = mapped_column(
        String(36),
        ForeignKey("candidates.id", ondelete="SET NULL"),
        nullable=True,
    )

    enable_authenticity: Mapped[bool] = mapped_column(
        nullable=False,
        default=True,
    )

    enable_behaviour: Mapped[bool] = mapped_column(
        nullable=False,
        default=True,
    )

    enable_personality: Mapped[bool] = mapped_column(
        nullable=False,
        default=True,
    )

    enable_ai_evaluation: Mapped[bool] = mapped_column(
        nullable=False,
        default=True,
    )

    share_link: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    share_token_hash: Mapped[str | None] = mapped_column(
        String(128),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    candidate: Mapped["Candidate | None"] = relationship(
        back_populates="interviews",
    )

    questions: Mapped[list["InterviewQuestion"]] = relationship(
        back_populates="interview",
        cascade="all, delete-orphan",
    )

    responses: Mapped[list["InterviewResponse"]] = relationship(
        back_populates="interview",
        cascade="all, delete-orphan",
    )

    candidate_sessions: Mapped[list["CandidateInterviewSession"]] = relationship(
        back_populates="interview",
        cascade="all, delete-orphan",
    )


class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid4()),
    )

    interview_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("interviews.id", ondelete="CASCADE"),
        nullable=False,
    )

    text: Mapped[str] = mapped_column(
        String(1000),
        nullable=False,
    )

    category: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    order: Mapped[int] = mapped_column(
        nullable=False,
    )

    interview: Mapped["Interview"] = relationship(
        back_populates="questions",
    )

    responses: Mapped[list["InterviewResponse"]] = relationship(
        back_populates="question",
        cascade="all, delete-orphan",
    )


class InterviewResponse(Base):
    __tablename__ = "interview_responses"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid4()),
    )

    interview_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("interviews.id", ondelete="CASCADE"),
        nullable=False,
    )

    question_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("interview_questions.id", ondelete="CASCADE"),
        nullable=False,
    )

    transcript: Mapped[str] = mapped_column(
        String(10000),
        nullable=False,
        default="",
    )

    duration_seconds: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    audio_url: Mapped[str | None] = mapped_column(
        String(1000),
        nullable=True,
    )

    video_url: Mapped[str | None] = mapped_column(
        String(1000),
        nullable=True,
    )

    recorded_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    interview: Mapped["Interview"] = relationship(
        back_populates="responses",
    )

    question: Mapped["InterviewQuestion"] = relationship(
        back_populates="responses",
    )


class CandidateInterviewSession(Base):
    __tablename__ = "candidate_interview_sessions"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid4()),
    )

    interview_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("interviews.id", ondelete="CASCADE"),
        nullable=False,
    )

    session_token_hash: Mapped[str] = mapped_column(
        String(128),
        nullable=False,
        unique=True,
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    revoked: Mapped[bool] = mapped_column(
        nullable=False,
        default=False,
    )

    interview: Mapped["Interview"] = relationship(
        back_populates="candidate_sessions",
    )
