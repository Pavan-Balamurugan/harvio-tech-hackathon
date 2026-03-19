SUSPICIOUS_TERMS = {
    "enable macros",
    "click here",
    "verify account",
    "urgent action",
    "payment failed",
    "reset password",
}

RISKY_EXTENSIONS = {".docm", ".xlsm", ".js", ".bat", ".exe"}


def scan_document_text(content: str, filename: str | None = None) -> dict:
    indicators: list[str] = []
    lowered = content.lower()

    for term in sorted(SUSPICIOUS_TERMS):
        if term in lowered:
            indicators.append(f"Document contains suspicious phrase: '{term}'.")

    if "http://" in lowered or "https://" in lowered:
        indicators.append("Document includes embedded links that should be reviewed.")

    if filename:
        lower_name = filename.lower()
        if any(lower_name.endswith(ext) for ext in RISKY_EXTENSIONS):
            indicators.append("Document file extension suggests script or macro risk.")

    return {
        "summary": "Inspected document text for risky phrases, links, and filename clues.",
        "indicators": indicators,
    }
