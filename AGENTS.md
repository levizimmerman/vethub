# AGENTS.md - VetHub Development Guide

This document provides guidance for AI agents working in this codebase.

## Project Overview

VetHub is a veterinary clinic management system with:
- **Client**: SvelteKit 5 + TypeScript + Tailwind CSS 4 (uses Bun)
- **Server**: Spring Boot 4 + Java 25 + Gradle (uses H2 in-memory DB)

---

## Architecture

### High-Level

Client-server architecture with a SvelteKit SPA frontend and Spring Boot REST API backend. Communication is HTTP/JSON. The API is documented via OpenAPI (Swagger), and the frontend uses generated types for type-safe API calls.

### Backend Structure

The backend follows a **layered architecture** organized by domain:

- **Controller** → **Service** → **Repository**
- Each domain (owner, pet, visit, vet, specialty) has its own package under `dev.ilionx.workshop.api.*`
- Per-domain packages contain: `controller`, `service`, `repository`, `model` (with `request`, `response`, `mapper`, `validator` subpackages)
- Shared code lives in `dev.ilionx.workshop.common` (config, exception, security)

### Request Flow

1. **Frontend**: Page/component calls an API controller (e.g. `getOwners()` in `OwnerController.ts`)
2. **API client**: `openapi-fetch` sends HTTP request to `http://localhost:8080/api/v1/*` with Basic Auth
3. **Backend**: Spring Security validates credentials and CORS
4. **Controller**: Receives request, optionally runs validator, delegates to service
5. **Service**: Business logic, `@Transactional`, calls repository
6. **Repository**: Spring Data JPA queries H2 database
7. **Response**: Entity → MapStruct mapper → DTO → JSON → frontend

### Frontend-Backend Connection

- **Client**: `openapi-fetch` in `$lib/api/client.ts` creates a typed client from OpenAPI paths
- **Base URL**: `http://localhost:8080/api` (configurable via `VITE_SERVER_BASE_URL`)
- **Auth**: Basic Auth (default `user`/`password`, configurable via `VITE_API_USERNAME`/`VITE_API_PASSWORD`)
- **Type sync**: Run `scripts/openapi-sync.sh` after API changes to regenerate `src/lib/types/api.d.ts`

### Patterns Used

- **Layered architecture**: Controller → Service → Repository
- **DTO pattern**: Request/response DTOs separate from JPA entities
- **MapStruct**: Entity ↔ DTO mapping
- **Repository pattern**: Spring Data JPA
- **Validator pattern**: Custom validators (e.g. `OwnerValidator`) for business rules
- **Centralized paths**: `Paths.java` for API path constants
- **Error handling**: `ApiErrorCode` enum, `DataNotFoundException` for 404s

### DTO Pattern (Backend)

- **Request DTOs**: `model/request/` — `CreateXRequest`, `UpdateXRequest`. Use `@Data`, `@Accessors(chain = true)`, `@Schema` for OpenAPI.
- **Response DTOs**: `model/response/` — `XResponse`, `XSummaryResponse` for nested/summary views.
- **Mappers**: `model/mapper/` — MapStruct interfaces with `SharedMapperConfig.class`. Controllers call `mapper.toResponse(entity)` / `mapper.toResponseList(entities)`.
- **New DTOs**: Add to the domain's `model/request` or `model/response` package; add mapper method if needed.

### Liquibase Migrations

- **Path**: `server/src/main/resources/db/changelog/`
- **Master file**: `db.changelog-master.yaml` includes all changesets from `changesets/`
- **New changesets**: Add XML files in `db/changelog/changesets/`. Naming: `YYYYMMDDHHMM-PREFIX-description.xml` (e.g. `202507101200-PRD-initial-schema.xml`)

---

## Build, Lint, and Test Commands

### Server (Java/Spring Boot)

```bash
# Navigate to server directory
cd server

# Build the project
./gradlew build

# Run the application
./gradlew bootRun

# Run all tests
./gradlew test

# Run a single test class
./gradlew test --tests "dev.ilionx.workshop.api.owner.controller.OwnerControllerTest"

# Run a single test method
./gradlew test --tests "dev.ilionx.workshop.api.owner.controller.OwnerControllerTest.shouldReturnAllOwnersWhenOwnersExist"

# Run tests with verbose output
./gradlew test --info

# Lint/format code (Spotless)
./gradlew spotlessApply

# Check code quality (Checkstyle, PMD, Spotbugs)
./gradlew check

# Run specific quality checks
./gradlew checkstyleMain pmdMain spotbugsMain

# Clean build
./gradlew clean
```

### Client (SvelteKit/TypeScript)

```bash
# Navigate to client directory
cd client

# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Type check
bun run check

# Type check in watch mode
bun run check:watch

# Generate API types from OpenAPI spec
bun run generate:api

# Download OpenAPI spec from running server
bun run download:api
```

### Full Stack Scripts

```bash
# Sync OpenAPI spec and regenerate types
../scripts/openapi-sync.sh
```

---

## Code Style Guidelines

### Java (Server)

**Formatting**
- Uses Spotless with Cleanthat formatter
- Configuration: `server/src/quality/config/spotless/styling.xml`
- Run `spotlessApply` before committing

**Imports**
- Order: blank, java|jakarta|javax, groovy, org, com, static imports
- Remove unused imports automatically
- Use static imports for test matchers and constants

**Naming Conventions**
- Classes: PascalCase (e.g., `OwnerController`)
- Methods: camelCase (e.g., `findByLastName`)
- Constants: UPPER_SNAKE_CASE
- Packages: lowercase with dots (e.g., `dev.ilionx.workshop.api.owner`)
- DTOs: `CreateXRequest`, `UpdateXRequest`, `XResponse`, `XSummaryResponse`

**Architecture**
- Follows layered architecture: controller -> service -> repository
- Use MapStruct for entity/DTO mapping
- Use Lombok to reduce boilerplate (@Data, @Builder, etc.)
- REST controllers return ResponseEntity with explicit status codes

**Error Handling**
- **404 Not Found**: Throw `DataNotFoundException(ApiErrorCode.X_NOT_FOUND)` in services. Add new codes to `ApiErrorCode` enum when introducing new domains.
- **Validation errors**: Validators throw `ValidationException(ValidationResult)` via `validateAndThrow()`. Use `OwnerValidator` as reference.
- Return appropriate HTTP status codes (200, 201, 204, 404, 400)

**Testing**
- **IntegrationTest**: Use for controller tests. Full Spring context, MockMvc, real DB. Extends `WebMvcConfigurator`. Use persistence factories (`aSavedOwner()`, `aSavedPet()`) and request factories (`aCreateOwnerRequest()`, `anUpdateOwnerRequest()`). DB is cleaned before/after each test.
- **UnitTest**: Use for service tests, validator tests, mapper tests. Uses Mockito only—no Spring context, no DB. Use in-memory entity factories (`aValidOwner()`, `aValidPet()`, etc.) from `UnitTest`. Mock dependencies with `@Mock`/`@InjectMocks`.
- Use Given-When-Then structure in test descriptions
- Use @DisplayName for readable test names

### TypeScript/Svelte (Client)

**Formatting**
- Uses Prettier (via SvelteKit/Vite)
- Configuration in `svelte.config.js`

**Imports**
- Use $lib alias for absolute imports
- Use $lib/components/ui for shadcn-svelte components
- Group imports: external, $lib, relative

**Naming Conventions**
- Files: kebab-case (e.g., `owner-form.svelte`)
- Components: PascalCase (e.g., `OwnerForm.svelte`)
- Types/Interfaces: PascalCase
- Variables/functions: camelCase

**Svelte 5 Patterns**
- Use runes: `$state`, `$derived`, `$effect`, `$props`
- Use `$props()` with destructuring for component props
- Use `let { ... }: Props = $props()` pattern

**TypeScript**
- Always enable strict mode (`strict: true`)
- Use explicit types for function parameters
- Use API types from `$lib/api/models.ts` (re-exports from generated `api.d.ts`)

**Styling**
- Use Tailwind CSS 4
- Use shadcn-svelte components from `$lib/components/ui/`
- Use `clsx` and `tailwind-merge` for conditional classes
- Use `tv` (tailwind-variants) for component variants

**API Client**
- Use `openapi-fetch` with auto-generated types from OpenAPI spec (`src/lib/types/api.d.ts`)
- Import types from `$lib/api/models.ts` (re-exports) rather than directly from `api.d.ts`
- Use the shared `client` from `$lib/api/client.ts` (Basic Auth, base URL)
- Thin domain controllers in `$lib/api/{domain}/` (e.g. `OwnerController.ts`) — HTTP-only, no business logic. Call `client.GET/POST/PUT/DELETE` and throw on error
- When adding new API types, add re-exports to `$lib/api/models.ts` after running openapi-sync

---

## Project Structure

```
vethub/
├── client/                    # SvelteKit frontend
│   └── src/
│       ├── lib/
│       │   ├── api/          # API layer: client.ts + domain controllers (Owner, Pet, Visit, Vet, Specialty)
│       │   ├── components/   # UI components (layout, owners, pets, vets, ui/)
│       │   ├── config/       # Configuration (constants.ts)
│       │   └── types/        # TypeScript types (api.d.ts from OpenAPI)
│       └── routes/           # SvelteKit file-based routing
├── server/                    # Spring Boot backend
│   └── src/
│       ├── main/java/dev/ilionx/workshop/
│       │   ├── api/          # Domain APIs (owner, pet, visit, vet)
│       │   │   ├── Paths.java
│       │   │   └── {domain}/  # controller, service, repository, model/
│       │   ├── common/       # config, exception, security
│       │   └── Application.java
│       ├── main/resources/   # application.yml
│       │   └── db/changelog/ # Liquibase: db.changelog-master.yaml, changesets/
│       └── test/java/        # support/UnitTest, support/IntegrationTest, support/util/WebMvcConfigurator
├── scripts/                   # openapi-sync.sh, common.sh
└── mise.toml                 # Tool versions (Java, Node, Bun)
```

---

## Key Conventions

1. **Run `spotlessApply` before committing Java code**
2. **Run `bun run check` before committing TypeScript code**
3. **After modifying API, run `../scripts/openapi-sync.sh` to regenerate types**
4. **Use test factories from IntegrationTest for creating test data**
5. **Keep API types in sync - regenerate after backend changes**
6. **API base path**: `/v1` (see `Paths.java`). All endpoints under `/api/v1/*`
7. **Controller tests** → extend `IntegrationTest`. **Service/validator tests** → extend `UnitTest`
