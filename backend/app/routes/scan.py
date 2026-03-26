from typing import Literal

from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel, Field

from app.services.auth_service import (
    authenticate_user,
    has_capability,
    list_demo_users,
    resolve_token,
)
from app.services.repository import get_dashboard_summary, list_alerts, list_scan_history
from app.services.scan_pipeline import run_scan


router = APIRouter(tags=["scan"])


class LoginRequest(BaseModel):
    username: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)


class ScanRequest(BaseModel):
    input_type: Literal["url", "qr", "document"] = Field(
        ..., description="Input format to inspect."
    )
    content: str = Field(..., min_length=1, description="Raw input content.")
    filename: str | None = Field(default=None, description="Optional uploaded filename.")


def require_user(authorization: str | None) -> dict[str, str]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization token.")

    token = authorization.replace("Bearer ", "", 1).strip()
    user = resolve_token(token)

    if not user:
        raise HTTPException(status_code=401, detail="Session expired or invalid token.")

    return user


def require_capability(authorization: str | None, capability: str) -> dict[str, str]:
    user = require_user(authorization)
    if not has_capability(user, capability):
        raise HTTPException(status_code=403, detail="Your role cannot perform this action.")
    return user


@router.post("/auth/login")
def login(payload: LoginRequest) -> dict:
    session = authenticate_user(payload.username, payload.password)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid demo credentials.")
    return session


@router.get("/auth/me")
def me(authorization: str | None = Header(default=None)) -> dict:
    return {"user": require_user(authorization)}


@router.get("/auth/demo-users")
def demo_users() -> dict:
    return {"users": list_demo_users()}


@router.post("/scan")
def scan_input(payload: ScanRequest, authorization: str | None = Header(default=None)) -> dict:
    user = require_capability(authorization, "scan")
    return run_scan(payload.input_type, payload.content, payload.filename, user)


@router.get("/history")
def history(limit: int = 10, authorization: str | None = Header(default=None)) -> dict:
    require_capability(authorization, "view_history")
    return {"items": list_scan_history(limit)}


@router.get("/alerts")
def alerts(limit: int = 10, authorization: str | None = Header(default=None)) -> dict:
    require_capability(authorization, "view_alerts")
    return {"items": list_alerts(limit)}


@router.get("/dashboard/summary")
def dashboard_summary(authorization: str | None = Header(default=None)) -> dict:
    require_capability(authorization, "view_summary")
    return get_dashboard_summary()
