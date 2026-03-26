import { elements } from "./dom.js";
import { state } from "./state.js";

export function setMessage(text, tone = "info") {
    elements.messageBar.textContent = text;
    elements.messageBar.className = `message ${tone}`;
}

export function updateSessionUI() {
    const modeLabel = getModeLabel();
    elements.modeChip.textContent = modeLabel;
    elements.modeChip.className = `badge ${state.mode === "api" ? "" : "badge-muted"}`;

    if (!state.user) {
        elements.authChip.textContent = "Session: Not signed in";
        elements.authChip.className = "badge badge-muted";
        elements.roleChip.textContent = "Role: None";
        elements.roleChip.className = "badge badge-muted";
        elements.sessionUser.textContent = "Not signed in";
        elements.sessionRole.textContent = "-";
        elements.sessionAccess.textContent = "No active session";
        return;
    }

    elements.authChip.textContent = `Session: ${state.user.full_name}`;
    elements.authChip.className = "badge";
    elements.roleChip.textContent = `Role: ${state.user.role}`;
    elements.roleChip.className = "badge";
    elements.sessionUser.textContent = state.user.full_name;
    elements.sessionRole.textContent = state.user.role;
    elements.sessionAccess.textContent =
        state.user.role === "viewer" ? "Read-only dashboard access" : "Scan and alert operations";
}

export function renderSummary(summary) {
    elements.statScans.textContent = String(summary.total_scans || 0);
    elements.statAlerts.textContent = String(summary.total_alerts || 0);
    elements.statDangerous.textContent = String(summary.dangerous || 0);
    elements.statSuspicious.textContent = String(summary.suspicious || 0);
}

export function renderResult(result = {}) {
    elements.verdict.textContent = result.verdict || "Waiting for scan";
    elements.verdict.className = `verdict ${(result.verdict || "neutral").toLowerCase()}`;
    elements.score.textContent = result.score != null ? String(result.score) : "--";
    elements.confidence.textContent =
        result.confidence != null ? `${Math.round(result.confidence * 100)}%` : "--";
    elements.alertStatus.textContent = result.alert_triggered ? "Triggered" : "Not triggered";
    elements.summaryText.textContent = result.summary || "No scan completed yet.";
    elements.channelsText.textContent = result.channels
        ? result.channels.join(", ")
        : "Dashboard only after alert generation.";
    elements.resultRisk.textContent = `Risk: ${result.risk_level || "-"}`;
    elements.resultRisk.className = `badge ${result.risk_level ? "" : "badge-muted"}`;

    elements.reasons.innerHTML = "";
    const reasons = result.reasons || [];

    if (!reasons.length) {
        const item = document.createElement("li");
        item.textContent = "No suspicious indicators found.";
        elements.reasons.appendChild(item);
        return;
    }

    reasons.forEach((reason) => {
        const item = document.createElement("li");
        item.textContent = reason;
        elements.reasons.appendChild(item);
    });
}

export function renderList(container, items, renderer, emptyText) {
    container.innerHTML = "";

    if (!items.length) {
        container.className = "list-stack empty-state";
        container.textContent = emptyText;
        return;
    }

    container.className = "list-stack";
    items.forEach((item) => container.appendChild(renderer(item)));
}

export function buildHistoryItem(item) {
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

export function buildAlertItem(item) {
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

function getModeLabel() {
    if (state.mode === "api") {
        return "Mode: Live API";
    }

    if (state.mode === "demo") {
        return "Mode: Demo Fallback";
    }

    return "Mode: Disconnected";
}
