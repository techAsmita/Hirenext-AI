from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import (
    generate_share_token,
    get_current_recruiter,
    hash_share_token,
)
from app.db import get_db
from app.models import Interview, InterviewQuestion
from app.schemas import InterviewCreate, InterviewResponse, InterviewStatus, InterviewStatusUpdate

router = APIRouter(
    prefix="/api/v1/interviews",
    tags=["Interviews"],
)


@router.get("", response_model=list[InterviewResponse])
def get_interviews(
    db: Session = Depends(get_db),
    current_recruiter=Depends(get_current_recruiter),
):
    return (
        db.query(Interview)
        .order_by(Interview.created_at.desc())
        .all()
    )


@router.get("/{interview_id}", response_model=InterviewResponse)
def get_interview(
    interview_id: str,
    db: Session = Depends(get_db),
    current_recruiter=Depends(get_current_recruiter),
):
    interview = (
        db.query(Interview)
        .filter(Interview.id == interview_id)
        .first()
    )

    if interview is None:
        raise HTTPException(
            status_code=404,
            detail="Interview not found",
        )

    return interview


@router.post("", response_model=InterviewResponse, status_code=201)
def create_interview(
    interview_data: InterviewCreate,
    db: Session = Depends(get_db),
    current_recruiter=Depends(get_current_recruiter),
):
    share_token = generate_share_token()

    interview = Interview(
        job_title=interview_data.job_title,
        department=interview_data.department,
        type=interview_data.type,
        difficulty=interview_data.difficulty,
        duration_minutes=interview_data.duration_minutes,
        question_count=len(interview_data.questions),
        status="draft",
        candidate_id=interview_data.candidate_id,
        enable_authenticity=interview_data.enable_authenticity,
        enable_behaviour=interview_data.enable_behaviour,
        enable_personality=interview_data.enable_personality,
        enable_ai_evaluation=interview_data.enable_ai_evaluation,
        share_link=f"/interview/{share_token}",
        share_token_hash=hash_share_token(share_token),
    )

    db.add(interview)
    db.flush()

    for question_data in interview_data.questions:
        question = InterviewQuestion(
            interview_id=interview.id,
            text=question_data.text,
            category=question_data.category,
            order=question_data.order,
        )
        db.add(question)

    db.commit()
    db.refresh(interview)

    return interview


INTERVIEW_TRANSITIONS = {
    InterviewStatus.DRAFT: {
        InterviewStatus.SCHEDULED,
        InterviewStatus.CANCELLED,
    },
    InterviewStatus.SCHEDULED: {
        InterviewStatus.ACTIVE,
        InterviewStatus.CANCELLED,
        InterviewStatus.EXPIRED,
    },
    InterviewStatus.ACTIVE: {
        InterviewStatus.COMPLETED,
        InterviewStatus.CANCELLED,
    },
    InterviewStatus.COMPLETED: set(),
    InterviewStatus.CANCELLED: set(),
    InterviewStatus.EXPIRED: set(),
}


@router.patch("/{interview_id}/status", response_model=InterviewResponse)
def update_interview_status(
    interview_id: str,
    status_data: InterviewStatusUpdate,
    db: Session = Depends(get_db),
    current_recruiter=Depends(get_current_recruiter),
):
    interview = (
        db.query(Interview)
        .filter(Interview.id == interview_id)
        .first()
    )

    if interview is None:
        raise HTTPException(
            status_code=404,
            detail="Interview not found",
        )

    current_status = InterviewStatus(interview.status)
    new_status = status_data.status

    if new_status not in INTERVIEW_TRANSITIONS[current_status]:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Invalid interview status transition: "
                f"{current_status.value} -> {new_status.value}"
            ),
        )

    interview.status = new_status.value

    if new_status == InterviewStatus.COMPLETED:
        from datetime import datetime

        interview.completed_at = datetime.utcnow()

    db.commit()
    db.refresh(interview)

    return interview
