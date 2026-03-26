# Project Log

This file tracks the planned workflow and project progress of the team.

## Team Ownership

- Pavan: project lead, integration, documentation, presentation, repo coordination
- Agasthya: frontend, dashboard, user flow, styling
- Samurai: backend, scanning logic, APIs, threat scoring
- Nirmala Devi: review, guidance, and requirement clarification support

## How To Update This Log

For each major milestone, note:

- date
- milestone
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

## Progress Log

| Date | Milestone | Status | Outcome |
| --- | --- | --- | --- |
| 2026-03-19 | Repository and branch setup | Completed | Project repository initialized and working branch created |
| 2026-03-19 | Planning and documentation setup | Completed | README, abstract, problem statement, architecture notes, and requirement questions prepared |
| 2026-03-19 | Initial starter scaffold | Completed | Base backend and frontend structure created for implementation |
| 2026-03-26 | Week-8 backend integration milestone | Completed | Unified scan pipeline, roles, history, alerts, and summary endpoints prepared for demo |
| 2026-03-26 | Week-8 frontend integration milestone | Completed | Login flow, dashboard summary, scan results, history, alerts, and demo-mode support prepared |
| 2026-03-26 | Review preparation | Completed | Week-8 status notes, demo script, and run path prepared for review meeting |

## Notes

- This log is maintained as a project-progress record for the team.
- Planned ownership is shown above for clarity, while milestone completion is tracked at the project level.
- If Harvio changes expectations, update the sequential plan before coding too far ahead.
