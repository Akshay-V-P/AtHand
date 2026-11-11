# AtHand — AI Agent Context & Operating Manual

> **CRITICAL INSTRUCTION FOR AI SESSIONS**:
> You are acting on the **AtHand** codebase. Before proposing or executing any code modifications, read this file completely. Follow the operational rules outlined in Section 22.

---

## 1. Project Overview
- **Project Name**: AtHand ("Troubleshoot before hiring")
- **Repository Type**: Decoupled Monorepo (`client/` for Vite/React frontend, `server/` for Express backend).
- **Core Domain**: On-demand equipment and appliance repair marketplace connecting customers with verified local technicians.

---\

## 2. Business Purpose
Solves trust and pricing opacity issues in local appliance/equipment repairs through:
1. **Two-Stage Pricing**: Initial diagnostic quote followed by post-inspection, itemized repair estimates requiring explicit customer approval before repair work begins.
2. **Technician Verification**: Multi-step document vetting (ID, license, certs) approved by platform admins.
3. **Geospatial Matching**: Pair customers with technicians within operating service radius via MongoDB 2dsphere spatial indexing.
4. **Visual Work Proof**: Photographic verification of replaced components before order settlement.

---

## 3. Technology Stack Summary
- **Backend**: Node.js, Express 5 (`^5.2.1`), TypeScript (`^5.8.3`), MongoDB / Mongoose (`^9.7.4`), Redis (`^6.1.0`), AWS SDK S3 (`^3.1106.0`), JWT (`jsonwebtoken`), bcrypt (`^6.0.0`), Nodemailer (`^9.0.3`), Zod (`^4.4.3`), tsx.
- **Frontend**: React 19 (`^19.2.7`), TypeScript (`~6.0.2`), Vite (`^8.1.1`), Redux Toolkit (`^2.12.0`), React Router v7 (`^7.18.1`), Tailwind CSS v4 (`^4.3.3`), React Hook Form (`^7.82.0`), Axios (`^1.18.1`), Lucide React, React Leaflet (`^5.0.0`), Google OAuth (`@react-oauth/google`).

---

## 4. Architecture Summary
- **Backend Clean Architecture / DDD**: Strict concentric separation:
  - `domain/`: Pure entities, enums, repository/service interfaces.
  - `application/`: Single-responsibility use cases (`execute(dto)`), DTOs.
  - `infrastructure/`: Mongoose models, persistence mappers, repository implementations, Redis/S3 adapters.
  - `presentation/`: Express routers, controllers, Zod validation schemas.
  - `container.ts`: Module composition root wiring dependencies via manual constructor injection (no reflection IoC).
- **Frontend Feature Slices**: Features organized under `client/src/features/` (`auth`, `customer`, `provider`, `admin`) with nested React Router layouts.

---

## 5. Repository Structure
```
athand/
├── client/                     # React 19 Frontend SPA
│   ├── src/
│   │   ├── app/                # App.tsx, main.tsx
│   │   ├── components/         # common/, admin/, provider/, user/, account/
│   │   ├── features/           # auth/, customer/, provider/, admin/
│   │   ├── hooks/              # storeHook.ts, useGeolocation.ts
│   │   ├── routes/             # AppRoutes.tsx
│   │   ├── services/           # axios.ts, imageService.ts
│   │   ├── store/              # Redux store.ts
│   │   └── styles/             # globals.css
├── server/                     # Express 5 Backend REST API
│   ├── cli/                    # Clean Architecture generator CLI
│   ├── src/
│   │   ├── app.ts              # Express app & route mounting
│   │   ├── server.ts           # Server entry & DB connection
│   │   ├── config/             # database.ts, env.ts, redis.ts, s3.ts
│   │   ├── modules/            # 12 bounded DDD modules
│   │   ├── shared/             # AppError, BaseRepository, ResponseHandler, S3
│   │   └── types/              # express.d.ts
└── docs/                       # Comprehensive documentation suite
```

---

## 6. Core Features
1. **Auth & Profile**: Email/Password signup, 6-digit email OTP (Redis TTL 60s), Login, Google OAuth2, Password reset via email link, S3 profile photo upload.
2. **Customer Saved Addresses**: Multi-address management with GeoJSON coordinates.
3. **Provider Onboarding**: 4-step wizard (Business info, Service category & radius, S3 document uploads, verification waiting page).
4. **Service Discovery**: Spatial search for nearby providers and services (`/provider-service/public/nearby`).
5. **Service Requests**: Create, list, detail view with photo attachments, urgency ratings, and cancellation.
6. **Technician Quoting**: Nearby request inbox, binding quote submission (labor + parts).
7. **Repair Order Lifecycle**: Quote acceptance -> Appointment scheduling -> Physical diagnosis -> Itemized repair estimate -> Customer approval/rejection -> Repair completion with proof photos -> Payment -> Provider rating & review.
8. **Admin Management**: Provider review & status update (`APPROVED`/`BLOCKED`), document verification, category management with commission rates, user moderation.

---

## 7. User Roles & Permissions
- **`USER`**: Can create requests, accept quotes, approve estimates, make payments, rate providers.
- **`PROVIDER`**: Must have an active `USER` account; requires admin `APPROVED` status to receive requests and submit quotes.
- **`ADMIN`**: Governs platform categories, verifies provider credentials, and manages users.

---

## 8. Database Models & Relationships
All stored in MongoDB via Mongoose:
1. **`User`** (`UserModel.ts`): Name, unique email, password hash, role array (`USER`, `PROVIDER`, `ADMIN`), status (`ACTIVE`, `BLOCKED`), isVerified.
2. **`Addresses`** (`AddressModel.ts`): Reference to `Users`, label, address text, 2dsphere GeoJSON Point coordinates, isPrimary flag.
3. **`Provider`** (`ProviderModel.ts`): Reference to `User` (`userId`), business details, reference to `Categories`, 2dsphere location coordinates, `serviceRadius`, `status` (`DRAFT`, `PENDING`, `APPROVED`, `BLOCKED`), `averageRating`, `totalReviews`.
4. **`ProviderDocuments`** (`DocumentModel.ts`): Reference to `Provider`, `documentType`, `documentKey`, `verificationStatus` (`VERIFIED`, `PENDING`, `REJECTED`), `remarks`.
5. **`ProviderDraft`** (`ProviderDraftModel.ts`): Multi-step application draft for user onboarding.
6. **`Categories`** (`CategoryModel.ts`): Unique name, slug, `commissionPercentage`, icon, status (`ACTIVE`, `BLOCKED`).
7. **`ProviderServices`** (`ProviderServiceModel.ts`): Listing of services by provider, reference to `Categories`, pricing type (`HOURLY`, `FLAT_FEE`), starting price.
8. **`ServiceRequests`** (`ServiceRequestModel.ts`): Reference to `Users`, `Categories`, address with 2dsphere coordinates, urgency, status (`OPEN`, `QUOTING`, `QUOTE_ACCEPTED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`).
9. **`Quote`** (`QuoteModel.ts`): Reference to `ServiceRequests`, `Provider`, labor cost, parts cost, estimated total, `status` (`pending`, `accepted`, `rejected`), `includeWarrenty`.
10. **`Order`** (`OrderModel.ts`): Order number (`REP-XXXX`), references to `ServiceRequests`, `Quote`, `Provider`, `User`, status (`pending`, `scheduled`, `device_received`, `diagnosis_in_progress`, `estimate_pending_approval`, `estimate_rejected`, `repair_in_progress`, `waiting_for_payment`, `completed`, `closed_without_repair`, `cancelled`), subdocuments for appointment, diagnosis, itemized repair estimate, completion details (photos), payment, and review.

---

## 9. Authentication Implementation
- **JWT Cookies**: `httpOnly: true, sameSite: "lax"`.
  - Regular users: `accessToken` (15m), `refreshToken` (7d).
  - Admin users: `adminAccessToken` (15m), `adminRefreshToken` (7d).
  - In-flight registration: `registrationToken` (15m).
- **Redis Sessions**:
  - `refresh:{userId}:{sessionId}` stores active refresh tokens.
  - `otp:{email}` stores 6-digit codes (TTL 60s).
  - `password_reset:{token}` stores authorized `userId` (TTL 15m).
- **Frontend Hydration**: `AuthInitializer.tsx` refreshes and hydrates Redux store on reload.

---

## 10. Important Backend Modules
- `src/modules/auth`: Authentication, OTP, token rotation, profile updates.
- `src/modules/order`: Complete repair state machine orchestration.
- `src/modules/service-request`: Customer request management and spatial nearby queries.
- `src/modules/quote`: Quoting lifecycle.
- `src/modules/providerApplication`: Technician onboarding and document persistence.
- `src/modules/admin-*`: Provider, category, and user moderation.
- `src/shared/presentation/ResponseHandler.ts`: Standard response formatter.

---

## 11. Important Frontend Modules
- `src/features/auth`: Login, registration, OTP, reset password views.
- `src/features/customer/service-request`: Service request list, creation wizard, detailed tracking page (order timeline, estimate approval, payment, review).
- `src/features/provider/applyAsProvider`: 4-step technician registration wizard.
- `src/features/provider/dashboard`: Request inbox, quote submission, active repairs, order management.
- `src/features/admin`: Provider management, document verification, categories, user management.

---

## 12. API Integration Patterns
- Central Axios client: `src/services/axios.ts` with `withCredentials: true`.
- Feature API adapters: Export typed objects wrapping endpoint calls (`serviceRequestApi`, `orderApi`, `adminApi`).
- S3 File Uploads: Direct PUT from browser to AWS S3 presigned URL via `src/services/imageService.ts`.

---

## 13. Coding Conventions
1. **Backend**:
   - Every module has a `container.ts` composition root; instantiate use cases and repositories here.
   - Use Cases implement `IUsecase<TInput, TOutput>` and live in `application/usecases/`.
   - Never import Mongoose models in domain entities or use cases. Depend only on repository interfaces (`I*Repository`).
   - Use `ResponseHandler.success(res, status, message, data)` and `ResponseHandler.error(...)`.
   - Throw `AppError`, `BadRequestError`, `NotFoundError`, or `UnauthorizedError`.
2. **Frontend**:
   - Feature-sliced structure (`src/features/<feature>/`).
   - State in Redux Toolkit slices (`authSlice`, `adminSlice`, `providerSlice`, `providerApplicationSlice`).
   - Form state managed with `react-hook-form` + `@hookform/resolvers/zod`.
   - Notifications via `toast.success()` and `toast.error()` from `react-hot-toast`.

---

## 14. Architectural Decisions
1. **Direct S3 Client Uploads**: Media never streams through the Express server; the client gets a signed upload URL and PUTs directly to S3.
2. **Manual Dependency Injection**: Preferred over heavyweight decorators or reflection frameworks for compile-time safety and clarity.
3. **Dual Session Cookies**: Admin tokens are strictly separated from user tokens to allow simultaneous administration and testing in the same browser.

---

## 15. Known Issues
1. **Client Build Failure (`tsc -b`)**: `client/tsconfig.app.json` has `noUnusedLocals: true`, which fails on unused `import React from 'react'` declarations in React 19 and unindexed types in `Badge.tsx`.
2. **ESLint Errors (184 problems)**: Unused vars and synchronous `setState` in `useEffect` across multiple components.
3. **Geospatial Coordinate Inversion**: `ServiceRequestRepository.ts` passes `[lat, lng]` to MongoDB `$centerSphere`, whereas MongoDB expects `[lng, lat]`.
4. **Race Condition in `ProtectApplication.tsx`**: `setLoading(false)` is dispatched before `apiService.getProvider()` promise resolves.

---

## 16. Technical Debt
- Typo in model field: `includeWarrenty` in `QuoteModel.ts`.
- Mongoose reference casing mismatches (`ref: 'Users'` vs `ref: 'User'`).
- Inconsistent document type enums between `DocumentModel` and `ProviderDraftModel`.
- Direct Redis import in `PasswordResetTokenRepository` bypassing abstraction.
- Incomplete stub function in `server/src/shared/infrastructure/services/s3.service.ts`.

---

## 17. Incomplete / Mocked Features
- **Admin Dashboard**: Visuals and stats (revenue ₹124,000, provider count) in `features/admin/pages/Dashboard.tsx` are static mock HTML.
- **Admin Provider Metrics**: `features/admin/pages/ProviderPerformanceMetrics.tsx` uses mock data arrays in component state.
- **Payment Processing**: `ProcessOrderPaymentUseCase.ts` generates simulated `TXN-` numbers without a real payment gateway (Stripe/Razorpay).
- **Manage Repair Order**: `ManageRepairOrder.tsx` contains hardcoded initial estimate items and Unsplash proof photo URLs in state.

---

## 18. Development Commands
```bash
# Server (run inside server/):
npm run dev        # tsx watch src/server.ts (Port 5000)
npm run build      # tsc -> dist/
npm start          # node dist/server.js
npm run g <type>   # Clean Architecture code generator

# Client (run inside client/):
npm run dev        # vite dev server (Port 5173)
npm run build      # tsc -b && vite build
npm run lint       # eslint .
npm run preview    # vite preview
```

---

## 19. Important Environment Configuration
- Server expects `.env` in `server/` with MongoDB, Redis, JWT secrets, S3 credentials, Gmail SMTP, and Google Client ID.
- Client expects `.env` in `client/` with `VITE_API_URL` and `VITE_GOOGLE_CLIENT_ID`.
- Consult `server/.env.example` and `client/.env.example` for template variables.

---

## 20. Where to Find Detailed Documentation
All detailed technical documentation is maintained in the `docs/` directory:
- Master Index: [`docs/README.md`](README.md)
- System Architecture: [`docs/ARCHITECTURE.md`](ARCHITECTURE.md)
- Folder Structure: [`docs/FOLDER_STRUCTURE.md`](FOLDER_STRUCTURE.md)
- API Reference: [`docs/API_REFERENCE.md`](API_REFERENCE.md)
- Database Schema: [`docs/DATABASE_SCHEMA.md`](DATABASE_SCHEMA.md)
- Authentication: [`docs/AUTHENTICATION.md`](AUTHENTICATION.md)
- Security Audit: [`docs/SECURITY_AUDIT.md`](SECURITY_AUDIT.md)
- Business Logic: [`docs/BUSINESS_LOGIC.md`](BUSINESS_LOGIC.md)
- Technical Debt: [`docs/TECHNICAL_DEBT.md`](TECHNICAL_DEBT.md)
- Implementation Matrix: [`docs/IMPLEMENTATION_STATUS.md`](IMPLEMENTATION_STATUS.md)

---

## 21. Rules for Safely Modifying the Project

When working on AtHand in future AI sessions, you **MUST** follow these mandatory rules:

1. **Always read `AI_CONTEXT.md` before modifying AtHand.**
2. **Read relevant detailed documentation before implementing features.**
3. **Inspect existing code before proposing changes.**
4. **Reuse existing architecture and conventions**:
   - Put business logic in Use Cases, not in Express controllers.
   - Define interfaces for repositories and wire them in `container.ts`.
   - Use `ResponseHandler` for API responses.
5. **Never assume an API, model, service, or feature exists without verifying it.**
6. **Never introduce duplicate implementations.**
7. **Never change architectural decisions without understanding their implications.**
8. **Update relevant documentation whenever implementation changes.**
9. **Clearly identify assumptions and missing information.**
10. **Prefer minimal, maintainable changes.**
11. **Verify changes through relevant tests or build checks.**
