from app.scanners.url_scanner import scan_url


def scan_qr_content(content: str) -> dict:
    cleaned = content.strip()

    if cleaned.startswith(("http://", "https://")):
        result = scan_url(cleaned)
        result["summary"] = "Decoded QR content and inspected the extracted URL."
        return result

    indicators: list[str] = []
    lowered = cleaned.lower()

    if "login" in lowered or "verify" in lowered or "otp" in lowered:
        indicators.append("QR text contains suspicious social-engineering keywords.")

    return {
        "summary": "Decoded QR content and inspected embedded text.",
        "indicators": indicators,
    }
