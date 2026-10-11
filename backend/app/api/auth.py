from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, get_current_recruiter, hash_password, verify_password
from app.db import get_db
from app.models import Recruiter
from app.schemas import RecruiterCreate, RecruiterLogin, TokenResponse

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"],
)


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_recruiter(
    recruiter_data: RecruiterCreate,
    db: Session = Depends(get_db),
):
    existing_recruiter = (
        db.query(Recruiter)
        .filter(Recruiter.email == recruiter_data.email)
        .first()
    )

    if existing_recruiter is not None:
        raise HTTPException(
            status_code=409,
            detail="Recruiter with this email already exists",
        )

    recruiter = Recruiter(
        name=recruiter_data.name,
        email=recruiter_data.email,
        password_hash=hash_password(recruiter_data.password),
    )

    db.add(recruiter)
    db.commit()
    db.refresh(recruiter)

    return {
        "id": recruiter.id,
        "name": recruiter.name,
        "email": recruiter.email,
        "created_at": recruiter.created_at,
    }


@router.post("/login", response_model=TokenResponse)
def login_recruiter(
    login_data: RecruiterLogin,
    db: Session = Depends(get_db),
):
    recruiter = (
        db.query(Recruiter)
        .filter(Recruiter.email == login_data.email)
        .first()
    )

    if recruiter is None or not verify_password(
        login_data.password,
        recruiter.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token(recruiter.email)

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get("/me")
def get_me(
    current_recruiter: Recruiter = Depends(get_current_recruiter),
):
    return {
        "id": current_recruiter.id,
        "name": current_recruiter.name,
        "email": current_recruiter.email,
        "created_at": current_recruiter.created_at,
    }
