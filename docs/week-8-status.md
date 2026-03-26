# Week 8 Status

## Goal for This Review

By week 8, the project plan expects the system modules to be integrated and ready for demo. This includes a unified pipeline, UI integration, role-aware access, confidence-based scoring, and alert visibility.

## Current Demo-Ready Modules

1. Unified scan pipeline for URL, QR content, and document-text inputs
2. Role-aware login flow with demo users for `admin`, `analyst`, and `viewer`
3. Risk scoring with severity labels, confidence values, and indicator counts
4. Dashboard integration for scan results, alert channels, recent scan history, and active alerts
5. Summary cards showing scan and alert volumes for quick status review
6. Demo fallback mode in the frontend if the backend is unavailable during presentation

## What Can Be Demonstrated Live

- Login as admin or analyst
- Run a scan for URL, QR, or document content
- Show generated verdict, confidence score, and alert status
- Show the result added to scan history
- Show corresponding alert entry in the alerts view
- Refresh the dashboard summary to show updated counts

## Current Scope Decision

The system is currently implemented as a standalone web-based prototype. This is intentional for the review stage because it allows easier testing, demo flow, and later integration into a larger Harvio platform if requested.

## Not Yet Finalized

These items are still valid next-phase work after the week-8 review:

- persistent database storage instead of in-memory storage
- actual QR image decoding instead of text-based QR content entry
- file upload based document parsing instead of text-only demo input
- real email, SMS, or WhatsApp dispatch instead of dashboard-first alerting
- model evaluation metrics and larger test datasets

## Review Talking Point

The current build demonstrates that the main week-8 integration milestone is achieved: the core modules are connected, user-facing, and demo-ready, while production hardening and external integrations remain for later phases.
