from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.security import get_current_recruiter
from app.db import get_db
from app.models import Candidate, Interview


router = APIRouter(
    prefix="/api/v1/dashboard",
    tags=["Dashboard"],
)


@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_recruiter=Depends(get_current_recruiter),
):
    total_candidates = (
        db.query(func.count(Candidate.id))
        .scalar()
        or 0
    )

    interviews_completed = (
        db.query(func.count(Interview.id))
        .filter(Interview.status == "completed")
        .scalar()
        or 0
    )

    shortlisted = (
        db.query(func.count(Candidate.id))
        .filter(Candidate.status == "shortlisted")
        .scalar()
        or 0
    )

    authenticated = (
        db.query(func.count(Candidate.id))
        .filter(Candidate.authenticity_score.isnot(None))
        .scalar()
        or 0
    )

    in_review = (
        db.query(func.count(Candidate.id))
        .filter(Candidate.status == "in_review")
        .scalar()
        or 0
    )

    average_score = (
        db.query(func.avg(Candidate.overall_score))
        .filter(Candidate.overall_score.isnot(None))
        .scalar()
    )

    average_duration = (
        db.query(func.avg(Interview.duration_minutes))
        .filter(Interview.status == "completed")
        .scalar()
    )

    return {
        "totalCandidates": total_candidates,
        "interviewsCompleted": interviews_completed,
        "shortlisted": shortlisted,
        "averageScore": (
            round(float(average_score), 1)
            if average_score is not None
            else 0
        ),
        "averageDurationMinutes": (
            round(float(average_duration), 1)
            if average_duration is not None
            else 0
        ),
        "pipeline": {
            "applied": total_candidates,
            "authenticated": authenticated,
            "interviewed": interviews_completed,
            "inReview": in_review,
            "shortlisted": shortlisted,
        },
    }
