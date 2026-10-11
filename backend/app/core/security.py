import os
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import CandidateInterviewSession, Recruiter
from dotenv import load_dotenv

password_hash = PasswordHash.recommended()

load_dotenv()

SECRET_KEY = os.getenv("HIRenEXT_JWT_SECRET")
if not SECRET_KEY or SECRET_KEY == "dev-only-change-this-secret":
    raise RuntimeError(
        "HIRenEXT_JWT_SECRET must be set to a secure value in backend/.env"
    )

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
candidate_session_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/candidate-interviews/session")


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return password_hash.verify(password, hashed_password)


def create_access_token(subject: str) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": subject,
        "exp": expires_at,
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def generate_share_token() -> str:
    import secrets

    return secrets.token_urlsafe(32)


def hash_share_token(token: str) -> str:
    import hashlib

    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def verify_share_token(token: str, token_hash: str) -> bool:
    import hashlib
    import hmac

    expected_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
    return hmac.compare_digest(expected_hash, token_hash)


def generate_session_token() -> str:
    import secrets

    return secrets.token_urlsafe(32)


def hash_session_token(token: str) -> str:
    import hashlib

    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def get_current_recruiter(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> Recruiter:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )
        email = payload.get("sub")

        if not email:
            raise credentials_exception

    except jwt.PyJWTError:
        raise credentials_exception

    recruiter = (
        db.query(Recruiter)
        .filter(Recruiter.email == email)
        .first()
    )

    if recruiter is None:
        raise credentials_exception

    return recruiter


def get_current_candidate_session(
    token: str = Depends(candidate_session_scheme),
    db: Session = Depends(get_db),
) -> CandidateInterviewSession:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired candidate session",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token_hash = hash_session_token(token)

    session = (
        db.query(CandidateInterviewSession)
        .filter(CandidateInterviewSession.session_token_hash == token_hash)
        .first()
    )

    if session is None:
        raise credentials_exception

    if session.revoked:
        raise credentials_exception

    now_utc = datetime.now(timezone.utc).replace(tzinfo=None)
    if session.expires_at <= now_utc:
        raise credentials_exception

    return session

