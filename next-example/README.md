# VetHub – Next.js Example

This folder is a **Next.js 16 + TypeScript** port of the VetHub SvelteKit client. It uses the same **Spring Boot backend** (parent `server/`). The app provides the same features: owners, pets, veterinarians, and visits.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **API:** Fetch client with Basic Auth (same as Svelte client)
- **Toasts:** Sonner
- **Icons:** Lucide React

## Setup

```bash
cd next-example
npm install
```

## Run

1. Start the **backend** (from repo root):

   ```bash
   cd server && ./gradlew bootRun
   ```

2. Start the **Next.js dev server**:

   ```bash
   cd next-example && npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000).

## Environment (optional)

- `NEXT_PUBLIC_SERVER_BASE_URL` – API base URL (default: `http://localhost:8080`)
- `NEXT_PUBLIC_API_USERNAME` – Basic Auth user (default: `user`)
- `NEXT_PUBLIC_API_PASSWORD` – Basic Auth password (default: `password`)

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home with quick links |
| `/owners` | Owners list, search, Add Owner |
| `/owners/new` | New owner form |
| `/owners/[id]` | Owner detail, pets, Edit/Delete, Add Pet |
| `/owners/[id]/edit` | Edit owner |
| `/owners/[id]/pets/new` | New pet for owner |
| `/owners/[id]/pets/[petId]` | Pet detail, visits, Edit/Delete, Add Visit |
| `/owners/[id]/pets/[petId]/edit` | Edit pet |
| `/owners/[id]/pets/[petId]/visits/new` | New visit for pet |
| `/vets` | Vets list, search, Add Veterinarian |
| `/vets/new` | New vet form |
| `/vets/[id]` | Vet detail, Edit/Delete |
| `/vets/[id]/edit` | Edit vet |
| `/visits` | Global visits list with search |

## Project layout

- `src/app/` – App Router pages and layout
- `src/lib/api/` – API client and controllers (owner, pet, vet, visit, specialty, pet-type)
- `src/lib/components/` – UI (button, input, card, table, badge, select, textarea) and domain forms (OwnerForm, PetForm, VetForm, VisitForm)
- `src/lib/components/layout/` – Header, Footer
- `src/lib/config/` – API base URL and auth constants
- `src/lib/types/` – API request/response types
