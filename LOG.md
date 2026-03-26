# Project Log

This file tracks the planned workflow and the actual progress of the project.

## Team Ownership

- Pavan: project lead, integration, documentation, presentation, repo coordination
- Agasthya: frontend, dashboard, user flow, styling
- Samurai: backend, scanning logic, APIs, threat scoring
- Nirmala Devi: review, guidance, and requirement clarification support

## How To Update This Log

For each major task, note:

- date
- task
- planned owner
- status
- short outcome

Use the status values `Planned`, `In Progress`, `Completed`, or `Blocked`.

## Sequential Plan

| Step | Task | Planned Owner | Status | Notes |
| --- | --- | --- | --- | --- |
| 1 | Create GitHub repo and working branch | Pavan | Completed | `pavan-dev` branch created and pushed |
| 2 | Prepare project idea, abstract, architecture, and requirement questions | Pavan | Completed | Base planning docs added |
| 3 | Confirm expected deliverables with Harvio Tech Industries | Pavan + Nirmala Devi | In Progress | Scope assumptions documented while industry clarification is pending |
| 4 | Finalize MVP scope and stack | Pavan + Team | Completed | Standalone web app with FastAPI-style backend and dashboard selected |
| 5 | Build frontend starter and dashboard layout | Agasthya | Completed | Dashboard expanded into login, scan, summary, history, and alerts view |
| 6 | Build backend API starter | Samurai | Completed | API scaffold expanded into integrated week-8 demo backend |
| 7 | Implement URL scanning logic | Samurai | Completed | Rule-based URL risk detection added |
| 8 | Implement QR scanning flow | Samurai | Completed | QR content pipeline added through unified scan endpoint |
| 9 | Implement document scanning flow | Samurai | Completed | Document text inspection and risk indicators added |
| 10 | Connect frontend to backend API | Pavan + Agasthya | Completed | Frontend wired to auth, scan, history, alerts, and summary endpoints |
| 11 | Add result history and alerts | Pavan + Samurai | Completed | In-memory history, alert views, and summary cards added |
| 12 | Test sample cases and improve UX | Team | In Progress | Demo mode, sample inputs, and week-8 review notes added |
| 13 | Prepare PPT, report, and demo script | Pavan + Team | Planned | Final submission support |

## Actual Work Log

| Date | Task | Owner | Status | Outcome |
| --- | --- | --- | --- | --- |
| 2026-03-19 | Created project repository and pushed branch | Pavan | Completed | GitHub repo connected and `pavan-dev` pushed |
| 2026-03-19 | Added planning documentation | Pavan | Completed | README, abstract, problem statement, requirement questions, architecture notes, and presentation notes added |
| 2026-03-19 | Added starter scaffold for backend and frontend | Pavan | Completed | Base code created for next implementation step |
| 2026-03-26 | Upgraded backend to week-8 integrated demo state | Pavan | Completed | Added demo auth, roles, scan pipeline, confidence scoring, history, alerts, and dashboard summary endpoints |
| 2026-03-26 | Upgraded frontend for review meeting demo | Pavan | Completed | Added login flow, live summary cards, recent history, active alerts, sample inputs, and demo fallback mode |
| 2026-03-26 | Prepared week-8 review materials | Pavan | Completed | Added progress notes, demo script, and clearer run path for the meeting |

## Notes

- This log should reflect real work. If Agasthya and Samurai contribute, add their entries here when they complete tasks or reviews.
- If Harvio changes expectations, update the sequential plan before coding too far ahead.
