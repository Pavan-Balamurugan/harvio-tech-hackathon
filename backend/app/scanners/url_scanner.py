from urllib.parse import urlparse


SHORTENER_DOMAINS = {
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "rb.gy",
    "goo.gl",
}

SUSPICIOUS_KEYWORDS = {
    "login",
    "verify",
    "secure",
    "update",
    "bank",
    "wallet",
    "password",
    "otp",
}


def scan_url(url: str) -> dict:
    indicators: list[str] = []
    parsed = urlparse(url.strip())
    host = parsed.netloc.lower()
    path = parsed.path.lower()

    if not parsed.scheme or not host:
        indicators.append("URL format is incomplete or invalid.")

    if parsed.scheme and parsed.scheme.lower() != "https":
        indicators.append("URL does not use HTTPS.")

    if host.replace(".", "").isdigit():
        indicators.append("URL uses a numeric host instead of a normal domain.")

    if host in SHORTENER_DOMAINS:
        indicators.append("URL uses a shortening service.")

    keyword_hits = [word for word in SUSPICIOUS_KEYWORDS if word in host or word in path]
    if keyword_hits:
        indicators.append(
            f"URL contains phishing-related keywords: {', '.join(sorted(keyword_hits))}."
        )

    if "@" in url:
        indicators.append("URL contains '@', which can obscure the real destination.")

    summary = "Scanned URL for suspicious transport, domain, and keyword patterns."
    return {"summary": summary, "indicators": indicators}
