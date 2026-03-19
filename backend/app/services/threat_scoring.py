def calculate_threat_score(indicators: list[str]) -> dict[str, int | str]:
    count = len(indicators)

    if count == 0:
        return {"score": 15, "verdict": "Safe"}
    if count <= 2:
        return {"score": 55, "verdict": "Suspicious"}
    return {"score": 85, "verdict": "Dangerous"}
