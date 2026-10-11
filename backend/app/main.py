from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.candidates import router as candidates_router
from app.api.interviews import router as interviews_router
from app.api.responses import router as responses_router
from app.api.media import router as media_router
from app.api.dashboard import router as dashboard_router
from app.api.auth import router as auth_router
from app.api.candidate_interviews import router as candidate_interviews_router

app = FastAPI(
    title="HireNext.ai API",
    description="Secure multimodal AI interview assessment platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(candidates_router)
app.include_router(interviews_router)
app.include_router(responses_router)
app.include_router(media_router)
app.include_router(dashboard_router)
app.include_router(auth_router)
app.include_router(candidate_interviews_router)

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "hirenext-backend",
    }
