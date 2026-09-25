# nabila-oil-mill-erp - Gemini AI Development Guide

## Project Overview
- **Name**: `nabila-oil-mill-erp`
- **Domain**: Fintech & Digital Banking
- **Summary**: This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). Getting Started
- **Tech Stack**: Next.js, React, Tailwind CSS, Prisma ORM
- **Primary Languages**: TypeScript (12 files), JavaScript / TypeScript (10 files)

## Architectural Structure
Modular architectural structure designed for fintech & digital banking operations, separating business logic, user interface components, and external communication interfaces.

## Key Directory Structure & Entrypoints
- **`node_modules/`**: Contains 2 files, 16 subdirectories (.pnpm, @types, next)
- **`prisma/`**: Contains 3 files, 0 subdirectories (assets/source)
- **`docs/`**: Contains 9 files, 0 subdirectories (assets/source)
- **`public/`**: Contains 5 files, 0 subdirectories (assets/source)
- **`src/`**: Contains 0 files, 2 subdirectories (app, lib)

**Key Entrypoints**:
- Root directory manifests and operational scripts

## Development & Build Commands
```bash
# Node.js / JavaScript / TypeScript
pnpm install    # or npm install / yarn
pnpm dev        # Start development server
pnpm build      # Compile production build
pnpm test       # Run test suite
```

## Environment Variables & Configuration
```bash
# Environment Configuration Template
PORT=3000
NODE_ENV=development
API_BASE_URL=http://localhost:8000
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
```

## AI Assistant Guidelines & Best Practices
1. **Code Integrity**: Preserve all existing architecture patterns and business rules in `nabila-oil-mill-erp`.
2. **Type Safety & Validation**: Maintain strict typing and runtime payload validation on all external API boundaries.
3. **Security First**: Never hardcode API keys, secrets, or database credentials directly into client-side code.
4. **Testing & Verification**: Run linters, unit tests, and build checks prior to committing changes.
