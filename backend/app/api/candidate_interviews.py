from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import (
    generate_session_token,
    get_current_candidate_session,
    hash_session_token,
    hash_share_token,
)
from app.db import get_db
from app.models import CandidateInterviewSession, Interview
from app.schemas import CandidateInterviewAccessResponse, InterviewResponse

router = APIRouter(
    prefix="/api/v1/candidate-interviews",
    tags=["Candidate Interviews"],
)


@router.get(
    "/{share_token}",
    response_model=CandidateInterviewAccessResponse,
)
def get_candidate_interview(
    share_token: str,
    db: Session = Depends(get_db),
):
    token_hash = hash_share_token(share_token)

    interview = (
        db.query(Interview)
        .filter(Interview.share_token_hash == token_hash)
        .first()
    )

    if interview is None:
        raise HTTPException(
            status_code=404,
            detail="Interview link is invalid or expired",
        )

    if interview.status not in {"scheduled", "active"}:
        raise HTTPException(
            status_code=403,
            detail="This interview is not currently available",
        )

    session_token = generate_session_token()
    session_token_hash = hash_session_token(session_token)

    session = CandidateInterviewSession(
        interview_id=interview.id,
        session_token_hash=session_token_hash,
        expires_at=datetime.utcnow() + timedelta(minutes=30),
    )

    try:
        db.add(session)
        db.commit()
    except Exception:
        db.rollback()
        raise

    return CandidateInterviewAccessResponse(
        interview=InterviewResponse.model_validate(interview),
        session_token=session_token,
    )
