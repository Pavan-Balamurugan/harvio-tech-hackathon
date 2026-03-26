from secrets import token_urlsafe


DEMO_USERS = {
    "admin": {
        "username": "admin",
        "password": "admin123",
        "full_name": "Campus Security Admin",
        "role": "admin",
    },
    "analyst": {
        "username": "analyst",
        "password": "analyst123",
        "full_name": "Threat Analysis Officer",
        "role": "analyst",
    },
    "viewer": {
        "username": "viewer",
        "password": "viewer123",
        "full_name": "Operations Viewer",
        "role": "viewer",
    },
}

ROLE_CAPABILITIES = {
    "admin": {"scan", "view_history", "view_alerts", "view_summary"},
    "analyst": {"scan", "view_history", "view_alerts", "view_summary"},
    "viewer": {"view_history", "view_alerts", "view_summary"},
}

ACTIVE_TOKENS: dict[str, dict[str, str]] = {}


def sanitize_user(user: dict[str, str]) -> dict[str, str]:
    return {
        "username": user["username"],
        "full_name": user["full_name"],
        "role": user["role"],
    }


def authenticate_user(username: str, password: str) -> dict[str, dict[str, str] | str] | None:
    user = DEMO_USERS.get(username)
    if not user or user["password"] != password:
        return None

    token = token_urlsafe(18)
    public_user = sanitize_user(user)
    ACTIVE_TOKENS[token] = public_user
    return {"token": token, "user": public_user}


def resolve_token(token: str) -> dict[str, str] | None:
    return ACTIVE_TOKENS.get(token)


def has_capability(user: dict[str, str], capability: str) -> bool:
    return capability in ROLE_CAPABILITIES.get(user["role"], set())


def list_demo_users() -> list[dict[str, str]]:
    return [
        {
            "username": user["username"],
            "full_name": user["full_name"],
            "role": user["role"],
        }
        for user in DEMO_USERS.values()
    ]
