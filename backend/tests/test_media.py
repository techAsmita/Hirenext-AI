import pytest

from app.api.media import (
    MEDIA_EXTENSIONS,
    has_valid_signature,
)


@pytest.mark.parametrize(
    ("content_type", "header"),
    [
        ("video/webm", bytes.fromhex("1A45DFA3") + b"\x00" * 8),
        ("audio/webm", bytes.fromhex("1A45DFA3") + b"\x00" * 8),
        ("video/mp4", b"\x00\x00\x00\x18ftyp"),
        ("audio/mpeg", b"ID3" + b"\x00" * 9),
        ("audio/wav", b"RIFF\x00\x00\x00\x00WAVE"),
        ("audio/x-wav", b"RIFF\x00\x00\x00\x00WAVE"),
    ],
)
def test_accepts_matching_media_signatures(content_type, header):
    assert has_valid_signature(content_type, header) is True


@pytest.mark.parametrize(
    ("content_type", "header"),
    [
        ("video/webm", b"not a media file"),
        ("video/mp4", b"not an mp4 file"),
        ("audio/mpeg", b"not an mp3 file"),
        ("audio/wav", b"not a wav file"),
        ("application/octet-stream", b"\x00" * 12),
    ],
)
def test_rejects_invalid_media_signatures(content_type, header):
    assert has_valid_signature(content_type, header) is False


def test_extensions_are_server_controlled():
    assert MEDIA_EXTENSIONS["video/webm"] == ".webm"
    assert MEDIA_EXTENSIONS["video/mp4"] == ".mp4"
    assert MEDIA_EXTENSIONS["audio/mpeg"] == ".mp3"
