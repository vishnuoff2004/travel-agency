# Decisions

- **Architecture**: Service‑oriented with separate frontend (React) and backend (Node/Express) communicating via REST and Socket.io.
- **Tech Stack**: React + Tailwind CSS, Node.js + Express, MySQL + Sequelize, Docker for containerisation, GitHub Actions for CI/CD.
- **Testing Strategy**: TDD‑FIRST – unit, integration, and end‑to‑end tests generated and linked to each REQ‑ID.
- **Security**: JWT (RS256), bcrypt password hashing, rate‑limiting, HTTPS enforced.
- **Deployment**: Docker‑Compose locally; can be extended to Kubernetes/ECS.
- **Scalability**: Horizontal scaling via container replication, Redis cache, and load balancer.
- **Accessibility**: WCAG 2.1 AA compliance built into UI components.

File: /project-prompts/MEMORY/DECISIONS.md
