from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.core.security import get_current_candidate_session

router = APIRouter(
    prefix="/api/v1/media",
    tags=["Media"],
)

MEDIA_DIR = Path("media/interviews")
MEDIA_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_CONTENT_TYPES = {
    "video/webm",
    "video/mp4",
    "audio/webm",
    "audio/mpeg",
    "audio/wav",
    "audio/x-wav",
}

MAX_FILE_SIZE = 100 * 1024 * 1024

MEDIA_EXTENSIONS = {
    "video/webm": ".webm",
    "audio/webm": ".webm",
    "video/mp4": ".mp4",
    "audio/mpeg": ".mp3",
    "audio/wav": ".wav",
    "audio/x-wav": ".wav",
}


def has_valid_signature(content_type: str, header: bytes) -> bool:
    if content_type in {"video/webm", "audio/webm"}:
        return header.startswith(bytes.fromhex("1A45DFA3"))

    if content_type == "video/mp4":
        return len(header) >= 8 and header[4:8] == b"ftyp"

    if content_type == "audio/mpeg":
        return header.startswith(b"ID3") or (
            len(header) >= 2
            and header[0] == 0xFF
            and (header[1] & 0xE0) == 0xE0
        )

    if content_type in {"audio/wav", "audio/x-wav"}:
        return (
            len(header) >= 12
            and header[:4] == b"RIFF"
            and header[8:12] == b"WAVE"
        )

    return False


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_media(
    file: UploadFile = File(...),
    current_session=Depends(get_current_candidate_session),
):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported media type: {file.content_type}",
        )

    extension = MEDIA_EXTENSIONS[file.content_type]

    file_id = str(uuid4())
    destination = MEDIA_DIR / f"{file_id}{extension}"

    total_size = 0

    try:
        header = await file.read(12)

        if not has_valid_signature(file.content_type, header):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File content does not match the declared media type",
            )

        total_size = len(header)

        if total_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="Media file exceeds the 100 MB limit",
            )

        with destination.open("wb") as buffer:
            buffer.write(header)

            while chunk := await file.read(1024 * 1024):
                total_size += len(chunk)

                if total_size > MAX_FILE_SIZE:
                    destination.unlink(missing_ok=True)

                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail="Media file exceeds the 100 MB limit",
                    )

                buffer.write(chunk)

    finally:
        await file.close()

    return {
        "id": file_id,
        "filename": file.filename,
        "content_type": file.content_type,
        "size_bytes": total_size,
    }
