import { demoStore, state } from "./state.js";

export function computeSummary(history, alerts) {
    return {
        total_scans: history.length,
        total_alerts: alerts.length,
        dangerous: history.filter((item) => item.verdict === "Dangerous").length,
        suspicious: history.filter((item) => item.verdict === "Suspicious").length,
    };
}

export function loadDemoDashboardData() {
    return {
        summary: computeSummary(demoStore.history, demoStore.alerts),
        history: demoStore.history,
        alerts: demoStore.alerts,
    };
}

export function localScan(inputType, content, filename) {
    const indicators = buildIndicators(inputType, content, filename);
    const scoring = classifyIndicators(indicators);
    const channels =
        scoring.verdict === "Safe" ? ["dashboard"] : ["dashboard", "email-ready", "whatsapp-ready"];
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

function buildIndicators(inputType, content, filename) {
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
        if (
            filename &&
            [".docm", ".xlsm", ".js", ".bat"].some((ext) => filename.toLowerCase().endsWith(ext))
        ) {
            indicators.push("Document file extension suggests macro or script risk.");
        }
    }

    return indicators;
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
