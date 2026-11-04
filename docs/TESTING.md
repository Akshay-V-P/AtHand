# AtHand — Quality Assurance & Testing Audit

## 1. Current Testing Status

| Test Category | Framework Configured | Test Files Found | Current Coverage | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Unit Tests (Backend)** | None | `0` | `0%` | **Missing** |
| **Integration Tests (API)**| None | `0` | `0%` | **Missing** |
| **Unit Tests (Frontend)** | None | `0` | `0%` | **Missing** |
| **Component Tests (UI)** | None | `0` | `0%` | **Missing** |
| **End-to-End (E2E) Tests**| None | `0` | `0%` | **Missing** |

---

## 2. Static Analysis & Linting Audit

### Frontend Linting Report (`npm run lint` in `client/`)
ESLint inspection using flat config (`eslint.config.js`) reported **184 problems** (159 errors, 25 warnings):

1. **Unused React Imports (`@typescript-eslint/no-unused-vars`)**:
   - In React 19, the new JSX transform does not require `import React from 'react'`.
   - Almost every component file contains `import React from 'react'`, triggering errors.
2. **Synchronous `setState` in `useEffect` (`react-hooks/set-state-in-effect`)**:
   - Triggered in `FileUploadZone.tsx`, `LocationPicker.tsx`, `RequestReviewQuote.tsx`, and `useGeolocation.ts`.
   - Calling `setState` synchronously in effect bodies causes unnecessary cascading re-renders.
3. **Explicit `any` Types (`@typescript-eslint/no-explicit-any`)**:
   - Prevalent in admin tables, modal handlers, and DTO parameters.
4. **React Compiler Incompatibility Warnings**:
   - `CreateCategoryForm.tsx`: React Hook Form's `watch()` function cannot be safely memoized by the React 19 compiler.

### Backend Static Analysis
- The backend compiles with `tsc --noEmit` with **0 errors**.
- SonarQube integration properties (`sonar-project.properties`) exist in both client and server, pointing to `http://localhost:9000`.

---

## 3. High-Risk Areas Due to Test Absence

1. **Complex Order State Transitions**:
   - The multi-stage repair order workflow (`OrderController`, `SubmitRepairEstimateUseCase`, `CustomerEstimateDecisionUseCase`) relies on strict status sequences (`SCHEDULED` -> `DIAGNOSIS` -> `ESTIMATE` -> `APPROVAL` -> `REPAIR` -> `PAYMENT`). Any edge case or out-of-order request could corrupt order states without regression test coverage.
2. **Dual-Token & Session Revocation**:
   - The interaction between Redis session storage, JWT cookie issuance, and refresh token rotation currently lacks automated integration tests.
3. **Geospatial Distance Calculation**:
   - Mongo `$centerSphere` distance queries and radius filters need automated spatial testing with known coordinate fixtures to prevent technician discovery failures.

---

## 4. Recommended Testing Roadmap

### Phase 1: Backend Testing Infrastructure
1. Install **Vitest** or **Jest** with `ts-node` / `tsx`:
   ```bash
   cd server
   npm install -D vitest supertest @types/supertest mongodb-memory-server
   ```
2. Write unit tests for core domain use cases:
   - `RegisterUserUsecase.test.ts`
   - `CreateOrderUseCase.test.ts`
   - `CustomerEstimateDecisionUseCase.test.ts`
   - `SubmitOrderReviewUseCase.test.ts`
3. Write API integration tests using `supertest` with `mongodb-memory-server` and in-memory mock Redis (`ioredis-mock`).

### Phase 2: Frontend Component Testing
1. Install **Vitest**, **React Testing Library**, and **jsdom**:
   ```bash
   cd client
   npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
   ```
2. Test critical components:
   - Form validation schemas (`businessDetailsSchema.ts`, `createProvider.schema.ts`).
   - Redux slice reducers (`authSlice.test.ts`, `providerSlice.test.ts`).
   - Route guards (`ProtectedRoute.test.tsx`, `AdminProtection.test.tsx`).
