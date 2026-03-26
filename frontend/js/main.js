import { loginToApi, submitScan } from "./api-service.js";
import { applySample, refreshDashboard } from "./dashboard.js";
import { demoUsers } from "./config.js";
import { elements } from "./dom.js";
import { localScan } from "./demo-service.js";
import { renderResult, setMessage, updateSessionUI } from "./renderers.js";
import { state } from "./state.js";

function enableDemoMode() {
    state.mode = "demo";
    state.user = { ...demoUsers.admin };
    state.token = "demo-mode-token";
    updateSessionUI();
    refreshDashboard();
    setMessage("Demo mode enabled with admin access. You can continue even without the API running.", "success");
}

function clearSession() {
    state.mode = "disconnected";
    state.user = null;
    state.token = null;
    updateSessionUI();
    refreshDashboard();
    renderResult();
    setMessage("Session cleared.", "info");
}

async function handleLogin(event) {
    event.preventDefault();

    const username = elements.username.value.trim();
    const password = elements.password.value.trim();

    if (!username || !password) {
        setMessage("Enter both username and password before logging in.", "warn");
        return;
    }

    try {
        const data = await loginToApi(username, password);
        state.mode = "api";
        state.token = data.token;
        state.user = data.user;
        updateSessionUI();
        await refreshDashboard();
        setMessage(`Logged in as ${data.user.full_name} using the live backend.`, "success");
    } catch (error) {
        setMessage("Live API login failed. Start the backend or use Demo Mode for the meeting.", "warn");
    }
}

async function handleScan(event) {
    event.preventDefault();

    if (!state.user) {
        setMessage("Sign in first before running scans.", "warn");
        return;
    }

    if (state.user.role === "viewer") {
        setMessage("Viewer role cannot run scans. Use admin or analyst credentials.", "warn");
        return;
    }

    const inputType = elements.inputType.value;
    const filename = elements.filename.value.trim();
    const content = elements.content.value.trim();

    if (!content) {
        setMessage("Add content before running a scan.", "warn");
        return;
    }

    if (state.mode === "api") {
        try {
            const data = await submitScan({
                input_type: inputType,
                content,
                filename: filename || null,
            });
            renderResult(data);
            await refreshDashboard();
            setMessage("Scan completed using the live backend pipeline.", "success");
            return;
        } catch (error) {
            setMessage("Live backend scan failed. Switching to demo-mode logic is still available.", "warn");
        }
    }

    const demoResult = localScan(inputType, content, filename);
    renderResult(demoResult);
    await refreshDashboard();
    setMessage("Scan completed in demo mode.", "success");
}

function wireEvents() {
    elements.sampleButtons.forEach((button) => {
        button.addEventListener("click", () => applySample(button.dataset.sample));
    });

    elements.demoLoginButton.addEventListener("click", enableDemoMode);
    elements.refreshDashboardButton.addEventListener("click", refreshDashboard);
    elements.logoutButton.addEventListener("click", clearSession);
    elements.loginForm.addEventListener("submit", handleLogin);
    elements.scanForm.addEventListener("submit", handleScan);
}

wireEvents();
updateSessionUI();
refreshDashboard();
