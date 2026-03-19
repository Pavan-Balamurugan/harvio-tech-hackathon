from typing import Literal

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.scanners.document_scanner import scan_document_text
from app.scanners.qr_scanner import scan_qr_content
from app.scanners.url_scanner import scan_url
from app.services.threat_scoring import calculate_threat_score


router = APIRouter(tags=["scan"])


class ScanRequest(BaseModel):
    input_type: Literal["url", "qr", "document"] = Field(
        ..., description="Input format to inspect."
    )
    content: str = Field(..., min_length=1, description="Raw input content.")
    filename: str | None = Field(default=None, description="Optional uploaded filename.")


@router.post("/scan")
def scan_input(payload: ScanRequest) -> dict:
    if payload.input_type == "url":
        result = scan_url(payload.content)
    elif payload.input_type == "qr":
        result = scan_qr_content(payload.content)
    else:
        result = scan_document_text(payload.content, payload.filename)

    score = calculate_threat_score(result["indicators"])

    return {
        "input_type": payload.input_type,
        "verdict": score["verdict"],
        "score": score["score"],
        "reasons": result["indicators"],
        "summary": result["summary"],
    }
