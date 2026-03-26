from datetime import datetime
from itertools import count


SCAN_COUNTER = count(1)
ALERT_COUNTER = count(1)
SCAN_HISTORY: list[dict] = []
ALERTS: list[dict] = []


def current_timestamp() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def store_scan(record: dict) -> dict | None:
    scan_record = {
        "scan_id": next(SCAN_COUNTER),
        **record,
        "created_at": current_timestamp(),
    }
    SCAN_HISTORY.insert(0, scan_record)

    if scan_record["verdict"] == "Safe":
        return None

    alert = {
        "alert_id": next(ALERT_COUNTER),
        "scan_id": scan_record["scan_id"],
        "severity": scan_record["risk_level"],
        "verdict": scan_record["verdict"],
        "input_type": scan_record["input_type"],
        "summary": scan_record["summary"],
        "channels": scan_record["channels"],
        "created_at": current_timestamp(),
        "owner": scan_record["owner"]["username"],
    }
    ALERTS.insert(0, alert)
    return alert


def list_scan_history(limit: int = 10) -> list[dict]:
    return SCAN_HISTORY[:limit]


def list_alerts(limit: int = 10) -> list[dict]:
    return ALERTS[:limit]


def get_dashboard_summary() -> dict[str, int]:
    total_scans = len(SCAN_HISTORY)
    total_alerts = len(ALERTS)
    dangerous = sum(1 for item in SCAN_HISTORY if item["verdict"] == "Dangerous")
    suspicious = sum(1 for item in SCAN_HISTORY if item["verdict"] == "Suspicious")
    safe = sum(1 for item in SCAN_HISTORY if item["verdict"] == "Safe")

    return {
        "total_scans": total_scans,
        "total_alerts": total_alerts,
        "dangerous": dangerous,
        "suspicious": suspicious,
        "safe": safe,
    }
