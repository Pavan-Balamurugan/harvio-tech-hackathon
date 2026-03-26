const state = {
    mode: "disconnected",
    token: null,
    user: null,
};

const demoStore = {
    history: [],
    alerts: [],
};

const demoUsers = {
    admin: {
        username: "admin",
        password: "admin123",
        full_name: "Campus Security Admin",
        role: "admin",
    },
    analyst: {
        username: "analyst",
        password: "analyst123",
        full_name: "Threat Analysis Officer",
        role: "analyst",
    },
    viewer: {
        username: "viewer",
        password: "viewer123",
        full_name: "Operations Viewer",
        role: "viewer",
    },
};

const sampleInputs = {
    url: {
        inputType: "url",
        filename: "",
        content: "http://bit.ly/verify-login?bank=campus-wallet",
    },
    qr: {
        inputType: "qr",
        filename: "",
        content: "https://secure-login-example.com/verify-account",
    },
    document: {
        inputType: "document",
        filename: "urgent_notice.docm",
        content:
            "Urgent action required. Click here to reset password and verify account immediately at http://example-login.com",
    },
};

const loginForm = document.getElementById("login-form");
const scanForm = document.getElementById("scan-form");
const messageBar = document.getElementById("message-bar");
const modeChip = document.getElementById("mode-chip");
const authChip = document.getElementById("auth-chip");
const roleChip = document.getElementById("role-chip");
const verdictEl = document.getElementById("verdict");
const scoreEl = document.getElementById("score");
const confidenceEl = document.getElementById("confidence");
const alertStatusEl = document.getElementById("alert-status");
const summaryTextEl = document.getElementById("summary-text");
const channelsTextEl = document.getElementById("channels-text");
const reasonsEl = document.getElementById("reasons");
const historyListEl = document.getElementById("history-list");
const alertsListEl = document.getElementById("alerts-list");
const sessionUserEl = document.getElementById("session-user");
const sessionRoleEl = document.getElementById("session-role");
const sessionAccessEl = document.getElementById("session-access");
const resultRiskEl = document.getElementById("result-risk");
const statScansEl = document.getElementById("stat-scans");
const statAlertsEl = document.getElementById("stat-alerts");
const statDangerousEl = document.getElementById("stat-dangerous");
const statSuspiciousEl = document.getElementById("stat-suspicious");

function setMessage(text, tone = "info") {
    messageBar.textContent = text;
    messageBar.className = `message ${tone}`;
}

function updateSessionUI() {
    const modeLabel =
        state.mode === "api" ? "Mode: Live API" : state.mode === "demo" ? "Mode: Demo Fallback" : "Mode: Disconnected";
    modeChip.textContent = modeLabel;
    modeChip.className = `badge ${state.mode === "api" ? "" : "badge-muted"}`;

    if (!state.user) {
        authChip.textContent = "Session: Not signed in";
        authChip.className = "badge badge-muted";
        roleChip.textContent = "Role: None";
        roleChip.className = "badge badge-muted";
        sessionUserEl.textContent = "Not signed in";
        sessionRoleEl.textContent = "-";
        sessionAccessEl.textContent = "No active session";
        return;
    }

    authChip.textContent = `Session: ${state.user.full_name}`;
    authChip.className = "badge";
    roleChip.textContent = `Role: ${state.user.role}`;
    roleChip.className = "badge";
    sessionUserEl.textContent = state.user.full_name;
    sessionRoleEl.textContent = state.user.role;
    sessionAccessEl.textContent = state.user.role === "viewer" ? "Read-only dashboard access" : "Scan and alert operations";
}

function renderSummary(summary) {
    statScansEl.textContent = String(summary.total_scans || 0);
    statAlertsEl.textContent = String(summary.total_alerts || 0);
    statDangerousEl.textContent = String(summary.dangerous || 0);
    statSuspiciousEl.textContent = String(summary.suspicious || 0);
}

function renderResult(result) {
    verdictEl.textContent = result.verdict || "Waiting for scan";
    verdictEl.className = `verdict ${(result.verdict || "neutral").toLowerCase()}`;
    scoreEl.textContent = result.score != null ? String(result.score) : "--";
    confidenceEl.textContent = result.confidence != null ? `${Math.round(result.confidence * 100)}%` : "--";
    alertStatusEl.textContent = result.alert_triggered ? "Triggered" : "Not triggered";
    summaryTextEl.textContent = result.summary || "No scan completed yet.";
    channelsTextEl.textContent = result.channels ? result.channels.join(", ") : "Dashboard only after alert generation.";
    resultRiskEl.textContent = `Risk: ${result.risk_level || "-"}`;
    resultRiskEl.className = `badge ${result.risk_level ? "" : "badge-muted"}`;

    reasonsEl.innerHTML = "";
    const reasons = result.reasons || [];

    if (!reasons.length) {
        const item = document.createElement("li");
        item.textContent = "No suspicious indicators found.";
        reasonsEl.appendChild(item);
        return;
    }

    reasons.forEach((reason) => {
        const item = document.createElement("li");
        item.textContent = reason;
        reasonsEl.appendChild(item);
    });
}

function renderList(container, items, renderer, emptyText) {
    container.innerHTML = "";

    if (!items.length) {
        container.className = "list-stack empty-state";
        container.textContent = emptyText;
        return;
    }

    container.className = "list-stack";
    items.forEach((item) => container.appendChild(renderer(item)));
}

function buildHistoryItem(item) {
    const row = document.createElement("article");
    row.className = "list-item";
    row.innerHTML = `
        <div class="list-top">
            <strong>${item.verdict}</strong>
            <span>${item.input_type.toUpperCase()} | Score ${item.score}</span>
        </div>
        <p>${item.summary}</p>
        <small>${item.created_at} | ${item.owner.full_name}</small>
    `;
    return row;
}

function buildAlertItem(item) {
    const row = document.createElement("article");
    row.className = "list-item";
    row.innerHTML = `
        <div class="list-top">
            <strong>${item.severity} Risk</strong>
            <span>${item.input_type.toUpperCase()} | ${item.verdict}</span>
        </div>
        <p>${item.summary}</p>
        <small>${item.created_at} | Channels: ${item.channels.join(", ")}</small>
    `;
    return row;
}

function computeSummary(history, alerts) {
    return {
        total_scans: history.length,
        total_alerts: alerts.length,
        dangerous: history.filter((item) => item.verdict === "Dangerous").length,
        suspicious: history.filter((item) => item.verdict === "Suspicious").length,
    };
}

function classifyIndicators(indicators) {
    const score = Math.min(95, 15 + indicators.length * 28);
    const confidence = Math.min(0.97, 0.64 + indicators.length * 0.08);

    if (score < 40) {
        return { score, confidence, verdict: "Safe", risk_level: "Low" };
    }
    if (score < 75) {
        return { score, confidence, verdict: "Suspicious", risk_level: "Medium" };
    }
    return { score, confidence, verdict: "Dangerous", risk_level: "High" };
}

function localScan(inputType, content, filename) {
    const indicators = [];
    const lowered = content.toLowerCase();

    if (inputType === "url" || inputType === "qr") {
        if (lowered.includes("http://")) {
            indicators.push("Input does not use HTTPS.");
        }
        if (lowered.includes("bit.ly") || lowered.includes("tinyurl")) {
            indicators.push("Input uses a shortening service.");
        }
        if (lowered.includes("verify") || lowered.includes("login") || lowered.includes("otp")) {
            indicators.push("Input contains phishing-related keywords.");
        }
    }

    if (inputType === "document") {
        if (lowered.includes("click here") || lowered.includes("reset password")) {
            indicators.push("Document contains phishing-style social engineering text.");
        }
        if (lowered.includes("http://") || lowered.includes("https://")) {
            indicators.push("Document includes embedded links.");
        }
        if (filename && [".docm", ".xlsm", ".js", ".bat"].some((ext) => filename.toLowerCase().endsWith(ext))) {
            indicators.push("Document file extension suggests macro or script risk.");
        }
    }

    const scoring = classifyIndicators(indicators);
    const channels = scoring.verdict === "Safe" ? ["dashboard"] : ["dashboard", "email-ready", "whatsapp-ready"];
    const createdAt = new Date().toLocaleString();

    const record = {
        scan_id: demoStore.history.length + 1,
        input_type: inputType,
        summary: `Demo-mode analysis completed for ${inputType} input.`,
        reasons: indicators,
        score: scoring.score,
        confidence: Number(scoring.confidence.toFixed(2)),
        verdict: scoring.verdict,
        risk_level: scoring.risk_level,
        channels,
        owner: {
            username: state.user.username,
            full_name: state.user.full_name,
            role: state.user.role,
        },
        created_at: createdAt,
        alert_triggered: scoring.verdict !== "Safe",
    };

    demoStore.history.unshift(record);

    if (record.alert_triggered) {
        demoStore.alerts.unshift({
            alert_id: demoStore.alerts.length + 1,
            scan_id: record.scan_id,
            severity: record.risk_level,
            verdict: record.verdict,
            input_type: record.input_type,
            summary: record.summary,
            channels: record.channels,
            created_at: createdAt,
            owner: record.owner.username,
        });
    }

    return record;
}

function authHeaders() {
    return state.token
        ? {
              Authorization: `Bearer ${state.token}`,
          }
        : {};
}

async function loadApiDashboard() {
    const [summaryRes, historyRes, alertsRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/dashboard/summary", { headers: authHeaders() }),
        fetch("http://127.0.0.1:8000/api/history", { headers: authHeaders() }),
        fetch("http://127.0.0.1:8000/api/alerts", { headers: authHeaders() }),
    ]);

    if (!summaryRes.ok || !historyRes.ok || !alertsRes.ok) {
        throw new Error("Dashboard requests failed.");
    }

    const summary = await summaryRes.json();
    const history = await historyRes.json();
    const alerts = await alertsRes.json();

    renderSummary(summary);
    renderList(historyListEl, history.items, buildHistoryItem, "No scan history yet.");
    renderList(alertsListEl, alerts.items, buildAlertItem, "No alerts yet.");
}

function loadDemoDashboard() {
    const summary = computeSummary(demoStore.history, demoStore.alerts);
    renderSummary(summary);
    renderList(historyListEl, demoStore.history, buildHistoryItem, "No scan history yet.");
    renderList(alertsListEl, demoStore.alerts, buildAlertItem, "No alerts yet.");
}

async function refreshDashboard() {
    if (!state.user) {
        renderSummary({ total_scans: 0, total_alerts: 0, dangerous: 0, suspicious: 0 });
        renderList(historyListEl, [], buildHistoryItem, "Sign in to view scan history.");
        renderList(alertsListEl, [], buildAlertItem, "Sign in to view active alerts.");
        return;
    }

    if (state.mode === "api") {
        try {
            await loadApiDashboard();
            setMessage("Live dashboard data refreshed from backend.", "success");
            return;
        } catch (error) {
            setMessage("Could not refresh from backend. Use demo mode if the API is unavailable.", "warn");
        }
    }

    loadDemoDashboard();
}

function applySample(type) {
    const sample = sampleInputs[type];
    document.getElementById("input-type").value = sample.inputType;
    document.getElementById("filename").value = sample.filename;
    document.getElementById("content").value = sample.content;
}

document.querySelectorAll(".sample-button").forEach((button) => {
    button.addEventListener("click", () => applySample(button.dataset.sample));
});

document.getElementById("demo-login").addEventListener("click", () => {
    state.mode = "demo";
    state.user = { ...demoUsers.admin };
    state.token = "demo-mode-token";
    updateSessionUI();
    refreshDashboard();
    setMessage("Demo mode enabled with admin access. You can continue even without the API running.", "success");
});

document.getElementById("refresh-dashboard").addEventListener("click", () => {
    refreshDashboard();
});

document.getElementById("logout-button").addEventListener("click", () => {
    state.mode = "disconnected";
    state.user = null;
    state.token = null;
    updateSessionUI();
    refreshDashboard();
    renderResult({});
    setMessage("Session cleared.", "info");
});

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        setMessage("Enter both username and password before logging in.", "warn");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error("Login failed.");
        }

        const data = await response.json();
        state.mode = "api";
        state.token = data.token;
        state.user = data.user;
        updateSessionUI();
        await refreshDashboard();
        setMessage(`Logged in as ${data.user.full_name} using the live backend.`, "success");
    } catch (error) {
        setMessage("Live API login failed. Start the backend or use Demo Mode for the meeting.", "warn");
    }
});

scanForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!state.user) {
        setMessage("Sign in first before running scans.", "warn");
        return;
    }

    if (state.user.role === "viewer") {
        setMessage("Viewer role cannot run scans. Use admin or analyst credentials.", "warn");
        return;
    }

    const inputType = document.getElementById("input-type").value;
    const filename = document.getElementById("filename").value.trim();
    const content = document.getElementById("content").value.trim();

    if (!content) {
        setMessage("Add content before running a scan.", "warn");
        return;
    }

    if (state.mode === "api") {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/scan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders(),
                },
                body: JSON.stringify({
                    input_type: inputType,
                    content,
                    filename: filename || null,
                }),
            });

            if (!response.ok) {
                throw new Error("Scan request failed.");
            }

            const data = await response.json();
            renderResult(data);
            await refreshDashboard();
            setMessage("Scan completed using the live backend pipeline.", "success");
            return;
        } catch (error) {
            setMessage("Live backend scan failed. Switch to Demo Mode if needed.", "warn");
        }
    }

    const data = localScan(inputType, content, filename);
    renderResult(data);
    loadDemoDashboard();
    setMessage("Scan completed in demo mode.", "success");
});

updateSessionUI();
refreshDashboard();
