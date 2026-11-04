# AtHand — Implementation Status & Roadmap

## 1. Module Implementation Scorecard

| Module Name | Backend Implementation | Frontend Implementation | Automated Tests | Production Readiness |
| :--- | :--- | :--- | :--- | :--- |
| **`auth`** | 100% Complete | 95% Complete | 0% | **95%** (Needs Axios 401 interceptor) |
| **`address`** | 100% Complete | 100% Complete | 0% | **100%** |
| **`providerApplication`** | 100% Complete | 90% Complete | 0% | **90%** (Needs loading state bugfix) |
| **`provider`** | 90% Complete | 85% Complete | 0% | **85%** |
| **`provider-service`** | 80% Complete | 80% Complete | 0% | **70%** (Needs auth middleware on write endpoints) |
| **`service-request`** | 95% Complete | 95% Complete | 0% | **90%** (Needs coordinate order fix) |
| **`quote`** | 85% Complete | 90% Complete | 0% | **80%** (Needs auth middleware on endpoints) |
| **`order`** | 90% Complete | 90% Complete | 0% | **85%** (Simulated payments, mock defaults in form) |
| **`category`** | 100% Complete | 100% Complete | 0% | **100%** |
| **`admin-provider-management`** | 80% Complete | 85% Complete | 0% | **65%** (Needs backend auth middleware) |
| **`admin-category-management`** | 80% Complete | 90% Complete | 0% | **65%** (Needs backend auth middleware) |
| **`admin-user-management`** | 80% Complete | 90% Complete | 0% | **65%** (Needs backend auth middleware) |
| **`admin-dashboard-analytics`** | 0% (Missing) | Mocked Visuals | 0% | **15%** (Mocked) |

---

## 2. Codebase TODO / FIXME Comments Audit

Two verified developer TODO comments exist in the server source code:

1. **`server/src/modules/auth/domain/mappers/UserMapper.ts` (line 5)**:
   ```typescript
   // TODO: dto issue
   ```
   *Context*: Comment marks where UserMapper converts domain entities to DTOs; indicates pending cleanup of DTO property alignment.

2. **`server/src/modules/auth/infrastructure/database/repositories/PasswordResetTokenRepository.ts` (line 4)**:
   ```typescript
   // TODO: direct redisclient dependency
   ```
   *Context*: The repository directly imports the global `redisClient` instance rather than receiving an `IRedisService` or `ICacheService` abstraction through constructor injection, violating Clean Architecture inversion of control.

---

## 3. Prioritized Implementation Roadmap

### Priority 1: Critical Security Hardening (Immediate)
1. **Apply Authentication Middleware to Admin Routes**:
   Attach an `AdminAuthMiddleware` to `adminProvManage.routes.ts`, `adminCategory.routes.ts`, and `AdminUserMang.route.ts`.
2. **Secure Provider Service & Quote Routes**:
   Add `authMiddleware.execute` to `provider-service.routes.ts` and `quote.routes.ts` to prevent unauthorized resource modification.
3. **Revoke and Remove Hardcoded Sonar Tokens**:
   Remove exposed tokens from `client/sonar-project.properties` and `server/sonar-project.properties`.
4. **Environment-Specific Cookie Security**:
   Update cookie issuing options to set `secure: process.env.NODE_ENV === "production"`.

### Priority 2: Bug Fixes & Technical Debt Remediation (High)
1. **Fix Client Build Failures (`tsc -b`)**:
   Remove unused `React` imports across `client/src/` components; provide proper TypeScript interfaces for admin table props.
2. **Correct Geospatial Coordinate Ordering**:
   Ensure coordinates are passed consistently as `[longitude, latitude]` to MongoDB `$centerSphere` queries in `ServiceRequestRepository.ts`.
3. **Fix Race Condition in `ProtectApplication.tsx`**:
   Ensure `dispatch(setLoading(false))` is invoked in a promise `.finally()` handler.
4. **Remove Hardcoded Mock Data in `ManageRepairOrder.tsx`**:
   Initialize estimate items and proof photo states to clean empty arrays.

### Priority 3: Feature Completions & External Integrations (Medium)
1. **Real Payment Gateway Integration**:
   Replace simulated `TXN-` payment generator with Stripe or Razorpay checkout and webhook signature validation.
2. **Implement Admin Analytics Backend**:
   Create an analytics usecase and aggregation queries for platform revenue, provider counts, and monthly transaction volumes to power `features/admin/pages/Dashboard.tsx`.
3. **Axios 401 Interceptor**:
   Implement an Axios response interceptor in `client/src/services/axios.ts` to automatically attempt token refresh upon encountering 401 errors.

### Priority 4: Test Suite Implementation (Medium)
1. Configure Vitest and write unit tests for critical order state machine use cases.
2. Configure component testing with React Testing Library for core form components.
