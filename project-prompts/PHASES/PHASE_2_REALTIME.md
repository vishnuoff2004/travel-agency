File: /project-prompts/PHASES/PHASE_2_REALTIME.md

# Phase 2 — Realtime Operations & Dashboard Management

---

## Goal

Enhance the platform with realtime communication, live booking updates, dashboard improvements, and accessibility compliance.

## Duration

2–3 Weeks

## Delivered Value

Users receive instant booking updates without page refresh. Agencies and admins get improved operational visibility. Platform meets basic accessibility standards.

## New Requirements Introduced

| REQ-ID | Description | Category |
|--------|-------------|----------|
| REQ-045 | Realtime booking notifications via Socket.io | Functional |
| REQ-046 | Live dashboard updates for drivers and admins | Functional |
| REQ-047 | Keyboard navigation support | Non-Functional |
| REQ-048 | Screen-reader ARIA compliance | Non-Functional |

## Enhanced Requirements

| REQ-ID | Enhancement | New Behavior |
|--------|-------------|--------------|
| REQ-010 | Live status tracking | Booking status changes pushed via Socket.io in realtime |
| REQ-014 | Live availability | Driver availability changes broadcast to search results |
| REQ-015 | Instant notification | New booking requests emit event to driver dashboard |
| REQ-022 | Live dashboard | User dashboard updates booking counts via WebSocket |
| REQ-023 | Live dashboard | Driver dashboard updates pending requests in realtime |
| REQ-024 | Live dashboard | Admin dashboard updates system counts via WebSocket |
| REQ-018 | Live monitoring | Agency booking monitor receives status change events |

## Deliverables

### Backend

- Socket.io server integration with Express
- JWT authentication for WebSocket connections
- Room-based event emission (per user, per agency, per admin)
- Booking status change events (Pending→Confirmed→On Trip→Completed→Cancelled)
- Driver availability change events
- New booking request events for drivers
- Dashboard stat update events

### Frontend

- Socket.io client service
- useSocket custom hook for realtime subscriptions
- Real-time booking status badge updates
- Auto-refreshing dashboard stat cards
- New booking request toast notifications for drivers
- Keyboard navigation on all interactive elements
- ARIA labels on form inputs, buttons, and navigation
- Focus management for modal dialogs
- Skip-to-content link

### Accessibility

- Keyboard tab order verification
- ARIA roles on dynamic content regions
- Screen-reader announcements for status changes
- Color contrast compliance (WCAG AA minimum)
- Focus visible indicators on all interactive elements

## Excluded from Phase 2

- Performance optimization (Redis, pagination) — Phase 3
- Background job processing — Phase 3
- Analytics and reporting — Phase 3
- Multi-language support — Phase 4
- Monitoring (Grafana/Prometheus) — Phase 4
