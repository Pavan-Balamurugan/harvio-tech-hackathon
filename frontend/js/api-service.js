import { API_BASE_URL } from "./config.js";
import { state } from "./state.js";

export async function loginToApi(username, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error("Login failed.");
    }

    return response.json();
}

export async function fetchDashboardData() {
    const [summaryRes, historyRes, alertsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/dashboard/summary`, { headers: authHeaders() }),
        fetch(`${API_BASE_URL}/history`, { headers: authHeaders() }),
        fetch(`${API_BASE_URL}/alerts`, { headers: authHeaders() }),
    ]);

    if (!summaryRes.ok || !historyRes.ok || !alertsRes.ok) {
        throw new Error("Dashboard requests failed.");
    }

    return {
        summary: await summaryRes.json(),
        history: (await historyRes.json()).items,
        alerts: (await alertsRes.json()).items,
    };
}

export async function submitScan(payload) {
    const response = await fetch(`${API_BASE_URL}/scan`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Scan request failed.");
    }

    return response.json();
}

function authHeaders() {
    return state.token
        ? {
              Authorization: `Bearer ${state.token}`,
          }
        : {};
}
