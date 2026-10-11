from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.core.security import get_current_recruiter
from app.db import get_db
from app.models import Candidate
from app.schemas import CandidateCreate, CandidateResponse, CandidateStatus, CandidateStatusUpdate

router = APIRouter(
    prefix="/api/v1/candidates",
    tags=["Candidates"],
)


CANDIDATE_TRANSITIONS = {
    CandidateStatus.INTERVIEW_PENDING: {CandidateStatus.AUTHENTICATED},
    CandidateStatus.AUTHENTICATED: {CandidateStatus.IN_PROGRESS},
    CandidateStatus.IN_PROGRESS: {CandidateStatus.COMPLETED},
    CandidateStatus.COMPLETED: {CandidateStatus.IN_REVIEW},
    CandidateStatus.IN_REVIEW: {
        CandidateStatus.SHORTLISTED,
        CandidateStatus.REJECTED,
    },
    CandidateStatus.SHORTLISTED: set(),
    CandidateStatus.REJECTED: set(),
}


@router.get("", response_model=list[CandidateResponse])
def get_candidates(
    db: Session = Depends(get_db),
    current_recruiter=Depends(get_current_recruiter),
):
    return db.query(Candidate).order_by(Candidate.created_at.desc()).all()


@router.post("", response_model=CandidateResponse, status_code=status.HTTP_201_CREATED)
def create_candidate(
    candidate_data: CandidateCreate,
    db: Session = Depends(get_db),
    current_recruiter=Depends(get_current_recruiter),
):
    candidate = Candidate(
        name=candidate_data.name,
        email=candidate_data.email,
        avatar=candidate_data.avatar,
        role=candidate_data.role,
        department=candidate_data.department,
    )

    db.add(candidate)

    try:
        db.commit()
        db.refresh(candidate)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A candidate with this email already exists",
        )

    return candidate


@router.patch("/{candidate_id}/status", response_model=CandidateResponse)
def update_candidate_status(
    candidate_id: str,
    status_data: CandidateStatusUpdate,
    db: Session = Depends(get_db),
    current_recruiter=Depends(get_current_recruiter),
):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()

    if candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")

    current_status = CandidateStatus(candidate.status)
    new_status = status_data.status

    if new_status not in CANDIDATE_TRANSITIONS[current_status]:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Invalid candidate status transition: "
                f"{current_status.value} -> {new_status.value}"
            ),
        )

    candidate.status = new_status.value

    db.commit()
    db.refresh(candidate)

    return candidate