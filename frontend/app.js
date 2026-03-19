const form = document.getElementById("scan-form");
const verdictEl = document.getElementById("verdict");
const scoreEl = document.getElementById("score");
const reasonsEl = document.getElementById("reasons");

function renderResult(data) {
    verdictEl.textContent = data.verdict;
    verdictEl.className = `verdict ${data.verdict.toLowerCase()}`;
    scoreEl.textContent = String(data.score);

    reasonsEl.innerHTML = "";

    if (!data.reasons.length) {
        const item = document.createElement("li");
        item.textContent = "No suspicious indicators found.";
        reasonsEl.appendChild(item);
        return;
    }

    data.reasons.forEach((reason) => {
        const item = document.createElement("li");
        item.textContent = reason;
        reasonsEl.appendChild(item);
    });
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const inputType = document.getElementById("input-type").value;
    const filename = document.getElementById("filename").value.trim();
    const content = document.getElementById("content").value.trim();

    if (!content) {
        renderResult({
            verdict: "Suspicious",
            score: 0,
            reasons: ["Content is required before a scan can run."],
        });
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/api/scan", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
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
    } catch (error) {
        renderResult({
            verdict: "Suspicious",
            score: 0,
            reasons: [
                "Could not reach the backend API.",
                "Start the FastAPI server before using the dashboard.",
            ],
        });
    }
});
