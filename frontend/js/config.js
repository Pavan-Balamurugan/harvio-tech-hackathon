export const API_BASE_URL = "http://127.0.0.1:8000/api";

export const demoUsers = {
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

export const sampleInputs = {
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
