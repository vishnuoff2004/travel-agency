File: /project-prompts/PHASES/PHASE_4_EXPANSION.md

# Phase 4 — Future Expansion & Monitoring

---

## Goal

Prepare the platform for regional expansion, community engagement, and production-grade monitoring.

## Duration

2–4 Weeks

## Delivered Value

Multi-language support enables regional markets. Community features increase user engagement. Monitoring dashboards provide operational visibility for production systems.

## New Requirements Introduced

| REQ-ID | Description | Category |
|--------|-------------|----------|
| REQ-053 | Multi-language UI support (i18n) | Functional |
| REQ-054 | Language switching without page reload | Functional |
| REQ-055 | Travel announcements and events | Functional |
| REQ-056 | Notification center (history of all notifications) | Functional |
| REQ-057 | Application performance monitoring | Non-Functional |
| REQ-058 | Server metrics dashboard | Non-Functional |

## Enhanced Requirements

| REQ-ID | Enhancement | New Behavior |
|--------|-------------|--------------|
| REQ-026 | Loading states in all locales | Skeleton text adapts to selected language |
| REQ-027 | Notifications | Persistent notification center with read/unread state |
| REQ-036 | Browser support | Verified with i18n locale configurations |

## Deliverables

### Backend

- i18next backend service for translation file serving
- Notification CRUD API (list, mark read, delete)
- Announcement CRUD API (admin creates, all users view)
- Event management API (admin creates, users browse)
- Prometheus metrics endpoint (/metrics)
- Health check endpoint (/health)
- Application performance tracking middleware

### Frontend

- i18next integration with React
- Language switcher component (dropdown/flag selector)
- Translation files for English and at least one regional language (Hindi)
- Notification center page with paginated history
- Announcement banner component
- Events listing page
- Grafana dashboard embedded views (admin only)
- Performance metrics display in admin dashboard

### Infrastructure

- Grafana dashboard configuration
- Prometheus configuration for Node.js metrics
- Node exporter for server-level metrics
- Docker Compose additions for Grafana and Prometheus
- Log aggregation setup

## Excluded from Phase 4

- Real-time features — Phase 2 (completed)
- Performance optimization — Phase 3 (completed)
- All Phase 1-3 scope
