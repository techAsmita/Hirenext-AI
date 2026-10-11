from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import (
    get_current_candidate_session,
    get_current_recruiter,
)
from app.db import get_db
from app.models import Interview, InterviewQuestion, InterviewResponse
from app.schemas import InterviewResponseCreate, InterviewResponseSchema

router = APIRouter(
    prefix="/api/v1/interviews",
    tags=["Interview Responses"],
)


@router.get(
    "/{interview_id}/responses",
    response_model=list[InterviewResponseSchema],
)
def get_responses(
    interview_id: str,
    db: Session = Depends(get_db),
    current_recruiter=Depends(get_current_recruiter),
):
    return (
        db.query(InterviewResponse)
        .filter(InterviewResponse.interview_id == interview_id)
        .order_by(InterviewResponse.recorded_at.asc())
        .all()
    )


@router.post(
    "/{interview_id}/responses",
    response_model=InterviewResponseSchema,
    status_code=status.HTTP_201_CREATED,
)
def create_response(
    interview_id: str,
    response_data: InterviewResponseCreate,
    db: Session = Depends(get_db),
    current_session=Depends(get_current_candidate_session),
):
    interview = (
        db.query(Interview)
        .filter(Interview.id == interview_id)
        .first()
    )

    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found",
        )

    if current_session.interview_id != interview_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Candidate session does not belong to this interview",
        )

    question = (
        db.query(InterviewQuestion)
        .filter(
            InterviewQuestion.id == response_data.question_id,
            InterviewQuestion.interview_id == interview_id,
        )
        .first()
    )

    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found for this interview",
        )

    interview_response = InterviewResponse(
        interview_id=interview_id,
        question_id=response_data.question_id,
        transcript=response_data.transcript,
        duration_seconds=response_data.duration_seconds,
        audio_url=response_data.audio_url,
        video_url=response_data.video_url,
    )

    db.add(interview_response)
    db.commit()
    db.refresh(interview_response)

    return interview_response
