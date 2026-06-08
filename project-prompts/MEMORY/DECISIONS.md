File: /project-prompts/MEMORY/DECISIONS.md

# Decisions Log — Travel Agency Services Platform

---

## DEC-001 — Monolith Architecture

**Date:** 2026-06-08
**Context:** Architecture style for MVP
**Decision:** Three-tier monolith over microservices
**Rationale:** Simpler deployment, lower operational cost, sufficient for 1000 concurrent users
**Replaces:** None
**Alternatives Considered:** Microservices, Serverless

## DEC-002 — Sequelize ORM

**Date:** 2026-06-08
**Context:** Database abstraction layer
**Decision:** Sequelize 6 over raw SQL or Knex
**Rationale:** Mature ORM with model associations, migrations, seeders; fits Node.js/Express stack
**Replaces:** None
**Alternatives Considered:** Knex, Prisma, raw MySQL queries

## DEC-003 — JWT Authentication

**Date:** 2026-06-08
**Context:** Authentication mechanism
**Decision:** JWT with 24-hour expiry, optional blacklist
**Rationale:** Stateless auth, no server-side session storage needed; blacklist for forced logout when needed
**Replaces:** None
**Alternatives Considered:** Session-based auth, OAuth2

## DEC-004 — Context API for State Management

**Date:** 2026-06-08
**Context:** Frontend state management
**Decision:** Context API over Redux
**Rationale:** Sufficient for this application's complexity; less boilerplate
**Replaces:** None
**Alternatives Considered:** Redux, Zustand, Recoil

## DEC-005 — React Hook Form

**Date:** 2026-06-08
**Context:** Form handling and validation
**Decision:** React Hook Form over Formik
**Rationale:** Better performance with fewer re-renders, smaller bundle size
**Replaces:** None
**Alternatives Considered:** Formik, raw controlled forms

## DEC-006 — bcrypt Cost Factor 10

**Date:** 2026-06-08
**Context:** Password hashing configuration
**Decision:** Cost factor 10
**Rationale:** Industry standard; ~100ms verification on modern hardware; balances security and UX
**Replaces:** None
**Alternatives Considered:** Cost factor 8, cost factor 12

## DEC-007 — MySQL over PostgreSQL

**Date:** 2026-06-08
**Context:** Database selection
**Decision:** MySQL 8.0
**Rationale:** Commonly used with Node.js; sufficient for expected data volume; simpler hosting
**Replaces:** None
**Alternatives Considered:** PostgreSQL, SQLite, MongoDB

## DEC-008 — Offset-Based Pagination

**Date:** 2026-06-08
**Context:** API pagination strategy
**Decision:** Offset-based (page/limit)
**Rationale:** Standard for relational databases; simpler implementation than cursor-based
**Replaces:** None
**Alternatives Considered:** Cursor-based pagination

## DEC-009 — Single Currency (INR)

**Date:** 2026-06-08
**Context:** Currency handling
**Decision:** Single currency (INR) for MVP
**Rationale:** Reduces complexity; multi-currency not needed for initial market
**Replaces:** None
**Alternatives Considered:** Multi-currency with exchange rates

## DEC-010 — In-App Notifications Only

**Date:** 2026-06-08
**Context:** Notification system
**Decision:** In-app notifications only for MVP; no email/SMS
**Rationale:** Reduces integration complexity; email/SMS can be added in later phases
**Replaces:** None
**Alternatives Considered:** Email via Nodemailer, SMS via Twilio

## DEC-011 — Local File Storage

**Date:** 2026-06-08
**Context:** File upload storage
**Decision:** Local filesystem over cloud storage
**Rationale:** Simpler setup for MVP; cloud storage (S3) can be added later
**Replaces:** None
**Alternatives Considered:** AWS S3, Cloudinary

## DEC-012 — Single Time Zone (IST)

**Date:** 2026-06-08
**Context:** Time zone handling
**Decision:** Single time zone (IST, UTC+5:30) for MVP
**Rationale:** All operations expected in same region; reduces date/time complexity
**Replaces:** None
**Alternatives Considered:** Multi-timezone with UTC conversion

## DEC-013 — No Payment Processing in MVP

**Date:** 2026-06-08
**Context:** Payment handling
**Decision:** Bookings confirmed without payment in MVP
**Rationale:** Reduces PCI compliance scope; payment integration can be added later
**Replaces:** None
**Alternatives Considered:** Stripe, Razorpay integration
