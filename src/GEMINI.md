# nabila-oil-mill-erp/src - Gemini AI Development Guide

## Project Overview
- **Name**: `nabila-oil-mill-erp/src`
- **Domain**: Fintech & Digital Banking
- **Summary**: Dedicated project repository for src supporting enterprise software system workflows and operations.
- **Tech Stack**: TypeScript
- **Primary Languages**: TypeScript (9 files)

## Architectural Structure
Modular architectural structure designed for enterprise software system operations, separating business logic, user interface components, and external communication interfaces.

## Key Directory Structure & Entrypoints
- **`app/`**: Contains 4 files, 1 subdirectories (api)
- **`lib/`**: Contains 1 files, 0 subdirectories (assets/source)

**Key Entrypoints**:
- Root directory manifests and operational scripts

## Development & Build Commands
```bash
# General Execution
ls -la
./deploy.sh     # if deployment script exists
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
1. **Code Integrity**: Preserve all existing architecture patterns and business rules in `src`.
2. **Type Safety & Validation**: Maintain strict typing and runtime payload validation on all external API boundaries.
3. **Security First**: Never hardcode API keys, secrets, or database credentials directly into client-side code.
4. **Testing & Verification**: Run linters, unit tests, and build checks prior to committing changes.
