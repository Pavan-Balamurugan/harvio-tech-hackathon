from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.scan import router as scan_router


app = FastAPI(
    title="CyberShield API",
    description="Demo-ready API for multi-format cyber threat detection.",
    version="0.3.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scan_router, prefix="/api")


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "cybershield-api", "stage": "week-8-demo"}
