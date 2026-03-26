import { sampleInputs } from "./config.js";
import { elements } from "./dom.js";
import {
    buildAlertItem,
    buildHistoryItem,
    renderList,
    renderSummary,
    setMessage,
} from "./renderers.js";
import { state } from "./state.js";
import { fetchDashboardData } from "./api-service.js";
import { loadDemoDashboardData } from "./demo-service.js";

export async function refreshDashboard() {
    if (!state.user) {
        renderSummary({ total_scans: 0, total_alerts: 0, dangerous: 0, suspicious: 0 });
        renderList(elements.historyList, [], buildHistoryItem, "Sign in to view scan history.");
        renderList(elements.alertsList, [], buildAlertItem, "Sign in to view active alerts.");
        return;
    }

    if (state.mode === "api") {
        try {
            const data = await fetchDashboardData();
            renderDashboardData(data);
            setMessage("Live dashboard data refreshed from backend.", "success");
            return;
        } catch (error) {
            setMessage("Could not refresh from backend. Use demo mode if the API is unavailable.", "warn");
        }
    }

    renderDashboardData(loadDemoDashboardData());
}

export function applySample(type) {
    const sample = sampleInputs[type];
    elements.inputType.value = sample.inputType;
    elements.filename.value = sample.filename;
    elements.content.value = sample.content;
}

function renderDashboardData(data) {
    renderSummary(data.summary);
    renderList(elements.historyList, data.history, buildHistoryItem, "No scan history yet.");
    renderList(elements.alertsList, data.alerts, buildAlertItem, "No alerts yet.");
}
