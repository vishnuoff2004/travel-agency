# Global Context

## Project Vision
The Travel Agency Services Platform connects travelers, drivers, agencies, and administrators in a unified digital ecosystem that supports booking, real‑time updates, and operational management.

## Core Goals
- End‑to‑end booking workflow (search → book → track).
- Real‑time driver and booking status notifications.
- Scalable architecture to support growth across regions.
- Secure authentication and role‑based access control.
- Easy deployment via Docker containers.

## Stakeholders
- **Travelers** – search destinations, create and track bookings.
- **Drivers** – publish availability, accept bookings, update trip status.
- **Travel Agencies** – manage drivers, monitor bookings, analytics.
- **Administrators** – system monitoring, user management, moderation.

## High‑Level Architecture
- **Frontend** – React SPA with Tailwind CSS, Context API, Axios.
- **Backend** – Node.js/Express API, JWT authentication, Socket.io for realtime.
- **Database** – MySQL with Sequelize ORM.
- **Cache & Messaging** – Redis for session storage and pub/sub.
- **Containerisation** – Docker Compose orchestrates services.

File: /project-prompts/MEMORY/GLOBAL_CONTEXT.md
