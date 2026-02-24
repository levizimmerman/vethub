# Exercise 06: Refine a Vague Story

*Assignment source: [workshop.ai-lab.ilionx.cloud – Refine a vague story](https://workshop.ai-lab.ilionx.cloud/docs/exercises/06-refine-a-vague-story)*

---

## 1. Vague story (starting point)

**As a user, I want to manage visits so that the clinic runs better.**

Problems with this story:
- **Who:** "User" is unclear (receptionist? vet? admin? client?)
- **What:** "Manage visits" is broad (create? edit? cancel? list? search? attach notes?)
- **Why:** "Clinic runs better" is not measurable or testable
- No acceptance criteria, so we can’t tell when it’s done

---

## 2. Refined story (first pass)

**As a** clinic receptionist**, I want to** create and view visits for a pet **so that** I can schedule appointments and see what’s coming up.

**Acceptance criteria:**

- **AC1 – Create visit:** I can create a new visit for an existing pet (date, optional description). Required: pet must exist and belong to an owner. System shows success and the new visit in the list.
- **AC2 – View visits for a pet:** I can open a pet and see a list of its visits (date, description), ordered by date (newest or oldest, one chosen and consistent).
- **AC3 – Validation:** I cannot save a visit without a date. If I submit invalid data, I see clear error messages (e.g. “Date is required”).

**Definition of done (for implementation):**

- Backend: endpoint(s) to create and list visits for a pet; validation; persistence.
- Frontend: UI to create a visit (form) and to display visits for a pet (list).
- Covered by automated tests (controller + service or E2E where applicable).

---

## 3. Optional second refinement (narrower slice)

If we want a single, small deliverable we can split further:

**Story A – View visits**  
As a clinic receptionist, I want to view the list of visits for a pet so that I can see upcoming and past appointments.

- AC1: From the pet detail page I see a list of visits (date, description).  
- AC2: List is ordered by date (e.g. newest first).  
- AC3: If there are no visits, I see an empty state message.

**Story B – Create visit**  
As a clinic receptionist, I want to create a new visit for a pet (date + optional description) so that we can record scheduled or completed appointments.

- AC1: I can submit a form with date (required) and description (optional).  
- AC2: After success, the new visit appears in the pet’s visit list.  
- AC3: Invalid input (e.g. missing date) shows clear validation errors.

---

## 4. Summary: what we did

| Step | Action |
|------|--------|
| **Clarify who** | “User” → “Clinic receptionist” (persona that manages visits) |
| **Clarify what** | “Manage visits” → “Create and view visits” (concrete actions) |
| **Clarify why** | “Clinic runs better” → “Schedule appointments and see what’s coming up” (observable benefit) |
| **Make testable** | Added acceptance criteria (create, list, validation, ordering) |
| **Make implementable** | Added definition of done (API, UI, tests) |
| **Optional split** | Broke into “View visits” and “Create visit” for smaller iterations |

Refinement turns a vague wish into a concrete, testable story that developers and QA can implement and verify.
