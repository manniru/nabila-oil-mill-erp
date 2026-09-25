# nabila-oil-mill-erp - Full Technical Specifications & Details

## 1. System Overview & Problem Statement
- **System**: `nabila-oil-mill-erp`
- **Domain**: Fintech & Digital Banking
- **Description**: This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). Getting Started
- **Technology Profile**: Next.js, React, Tailwind CSS, Prisma ORM

## 2. Detailed Architecture & Component Hierarchy
`nabila-oil-mill-erp` operates within the **Fintech & Digital Banking** space.
The codebase is structured to provide high modularity, maintainability, and clean separation between presentation layers, data access, and infrastructure logic.

### Component Breakdown
- **`node_modules/`**: Contains 2 files, 16 subdirectories (.pnpm, @types, next)
- **`prisma/`**: Contains 3 files, 0 subdirectories (assets/source)
- **`docs/`**: Contains 9 files, 0 subdirectories (assets/source)
- **`public/`**: Contains 5 files, 0 subdirectories (assets/source)
- **`src/`**: Contains 0 files, 2 subdirectories (app, lib)

## 3. Data Storage, Schemas & State Management
- **Storage Engine**: Prisma ORM
- **State Flow**: Reactive state updates across application layers with clean separation of domain models.

## 4. API Endpoints, Communication Protocols & Interfaces
- **Protocols**: REST API, WebSockets, HTTP/HTTPS endpoints.
- **Integration Endpoints**: Standardized JSON data contracts with payload validation and error handling.

## 5. Security, Authentication & Role-Based Access Control
- **Authentication**: Token-based authentication (JWT / OAuth / Session tokens / Biometrics).
- **Access Control**: Role-based access control (RBAC) across client and administrative boundaries.

## 6. Deployment, Infrastructure & Operational Runbook
- **Deployment Target**: Containerized Docker, Cloud Hosting (Vercel / VPS / Mobile App Stores).
- **Runbook**: Follow the build and launch commands specified in `CLAUDE.md` and `GEMINI.md`.
