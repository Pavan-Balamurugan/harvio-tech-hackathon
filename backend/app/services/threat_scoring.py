def calculate_threat_score(indicators: list[str]) -> dict[str, int | float | str]:
    count = len(indicators)
    weighted_signal = 0

    for indicator in indicators:
        lowered = indicator.lower()
        if "invalid" in lowered or "incomplete" in lowered:
            weighted_signal += 8
        elif "link" in lowered or "keyword" in lowered:
            weighted_signal += 14
        else:
            weighted_signal += 18

    score = min(95, 15 + (count * 12) + weighted_signal)
    confidence = min(0.97, 0.64 + (count * 0.08))

    if score < 40:
        verdict = "Safe"
        risk_level = "Low"
    elif score < 75:
        verdict = "Suspicious"
        risk_level = "Medium"
    else:
        verdict = "Dangerous"
        risk_level = "High"

    return {
        "score": score,
        "verdict": verdict,
        "risk_level": risk_level,
        "confidence": round(confidence, 2),
        "indicator_count": count,
    }
