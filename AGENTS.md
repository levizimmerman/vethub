# AGENTS.md - VetHub Development Guide

This document provides guidance for AI agents working in this codebase.

## Project Overview

VetHub is a veterinary clinic management system with:
- **Client**: SvelteKit 5 + TypeScript + Tailwind CSS 4 (uses Bun)
- **Server**: Spring Boot 4 + Java 25 + Gradle (uses H2 in-memory DB)

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

**Architecture**
- Follows layered architecture: controller -> service -> repository
- Use MapStruct for entity/DTO mapping
- Use Lombok to reduce boilerplate (@Data, @Builder, etc.)
- REST controllers return ResponseEntity with explicit status codes

**Error Handling**
- Use custom ApiErrorCode enum for error codes
- Return appropriate HTTP status codes (200, 201, 204, 404, 400)
- Use @Valid for request validation

**Testing**
- Integration tests extend `IntegrationTest` base class
- Unit tests extend `UnitTest` base class
- Use Given-When-Then structure in test descriptions
- Use @DisplayName for readable test names
- Use test factories from IntegrationTest (e.g., `aSavedOwner()`)

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
- Use generated API types from `$lib/types/api.d.ts`

**Styling**
- Use Tailwind CSS 4
- Use shadcn-svelte components from `$lib/components/ui/`
- Use `clsx` and `tailwind-merge` for conditional classes
- Use `tv` (tailwind-variants) for component variants

**API Client**
- Use openapi-fetch for type-safe API calls
- API types generated from OpenAPI spec
- Use the `client` from `$lib/api/client.ts`

---

## Project Structure

```
vethub/
├── client/                    # SvelteKit frontend
│   └── src/
│       ├── lib/
│       │   ├── api/          # API clients and controllers
│       │   ├── components/   # UI components
│       │   ├── config/       # Configuration constants
│       │   └── types/        # TypeScript types
│       └── routes/           # SvelteKit routes
├── server/                    # Spring Boot backend
│   └── src/
│       ├── main/java/        # Application code
│       └── test/java/        # Test code
├── scripts/                   # Build/utility scripts
└── mise.toml                 # Tool versions
```

---

## Key Conventions

1. **Run `spotlessApply` before committing Java code**
2. **Run `bun run check` before committing TypeScript code**
3. **After modifying API, run `../scripts/openapi-sync.sh` to regenerate types**
4. **Use test factories from IntegrationTest for creating test data**
5. **Keep API types in sync - regenerate after backend changes**
