from app.scanners.document_scanner import scan_document_text
from app.scanners.qr_scanner import scan_qr_content
from app.scanners.url_scanner import scan_url
from app.services.repository import store_scan
from app.services.threat_scoring import calculate_threat_score


def run_scan(input_type: str, content: str, filename: str | None, actor: dict[str, str]) -> dict:
    if input_type == "url":
        scan_result = scan_url(content)
    elif input_type == "qr":
        scan_result = scan_qr_content(content)
    else:
        scan_result = scan_document_text(content, filename)

    score = calculate_threat_score(scan_result["indicators"])
    channels = ["dashboard"]

    if score["verdict"] != "Safe":
        channels.extend(["email-ready", "whatsapp-ready"])

    record = {
        "input_type": input_type,
        "filename": filename,
        "content_preview": content.strip()[:120],
        "summary": scan_result["summary"],
        "reasons": scan_result["indicators"],
        "score": score["score"],
        "confidence": score["confidence"],
        "indicator_count": score["indicator_count"],
        "verdict": score["verdict"],
        "risk_level": score["risk_level"],
        "channels": channels,
        "owner": actor,
    }
    alert = store_scan(record)

    return {
        **record,
        "alert_triggered": alert is not None,
        "alert": alert,
    }
