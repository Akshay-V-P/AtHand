# AtHand — Security Audit & Vulnerability Assessment

## 1. Audit Methodology & Executive Summary

A comprehensive source-code security audit was conducted covering authentication mechanisms, authorization boundaries, session management, input validation, cryptographic practices, and secrets handling.

### Risk Distribution
- **Critical**: 2
- **High**: 4
- **Medium**: 3
- **Low**: 3
- **Informational**: 2

---

## 2. Vulnerability Findings Matrix

| Finding ID | Severity | Category | Vulnerability Summary |
| :--- | :--- | :--- | :--- |
| **SEC-01** | **CRITICAL** | Broken Object Level Authorization (BOLA) | Administrative routes completely unauthenticated at backend level. |
| **SEC-02** | **CRITICAL** | Secrets Exposure | SonarQube authentication tokens committed directly to repository configuration files. |
| **SEC-03** | **HIGH** | Broken Authentication / Authorization | Provider service catalog management (`/api/provider-service/*`) lacks authentication. |
| **SEC-04** | **HIGH** | Missing Authentication | Quoting endpoints (`/api/quote/*`) lack authentication middleware. |
| **SEC-05** | **HIGH** | Insecure Direct Object Reference (IDOR) | Public presigned URL generator signs downloads for arbitrary S3 object keys. |
| **SEC-06** | **HIGH** | Insecure Cookie Flags | Authentication cookies configured with `secure: false`. |
| **SEC-07** | **MEDIUM** | Authentication Bypass / Flawed Logic | `AuthMiddleware` admin check inspects `req.body.context`, failing on HTTP GET requests. |
| **SEC-08** | **MEDIUM** | Denial of Service / UX Lockout | Login endpoint rejects authentication if an `accessToken` cookie already exists. |
| **SEC-09** | **MEDIUM** | Financial / Business Logic Flaw | Payment processing is simulated without cryptographic signature or webhook verification. |
| **SEC-10** | **LOW** | Geospatial Coordinate Order Inversion | Latitude and longitude swapped in spatial spherical query. |
| **SEC-11** | **LOW** | Information Disclosure | Production error stack traces logged via `console.error` and generic 500 fallback. |
| **SEC-12** | **LOW** | Rate Limiting Absence | No rate limiter (e.g. `express-rate-limit`) on OTP generation, login, or public endpoints. |
| **INFO-01** | **INFORMATIONAL** | Mongoose Model Ref Inconsistencies | Mongoose reference name casing mismatches (`'Users'` vs `'User'`). |
| **INFO-02** | **INFORMATIONAL** | Redundant Token Verification | Multiple redundant JWT decoding steps during initial authentication rehydration. |

---

## 3. In-Depth Vulnerability Details & Remediations

### SEC-01: Administrative Routes Unauthenticated at Backend Level
- **Severity**: **CRITICAL**
- **Location**: 
  - `server/src/modules/admin-provider-management/presentation/routes/adminProvManage.routes.ts`
  - `server/src/modules/admin-category-management/presentation/routes/adminCategory.routes.ts`
  - `server/src/modules/admin-user-management/presentation/routes/AdminUserMang.route.ts`
- **Evidence**:
  The routers mount endpoints directly without `authMiddleware.execute` or role checking:
  ```typescript
  // adminProvManage.routes.ts lines 8-14
  router.get(ROUTES.GET_PROVIDERS, controllers.fetchProvidersController.fetchProviders);
  router.patch(ROUTES.UPDATE_PROVIDER_STATUS, controllers.updateProviderStatusController.updateProvider);
  // adminUserMang.route.ts lines 8-15
  router.get(USER_MANG_ROUTES.USERS, controllers.fetchUsersController.fetchUsers);
  router.patch(USER_MANG_ROUTES.BLOCK_USER, controllers.blockUserController.blockUser);
  ```
- **Impact**: Any unauthenticated actor on the internet can make direct HTTP calls to block/unblock users, approve or reject service providers, modify categories, and view all registered users' personal details. The frontend's `AdminProtection` component is bypassed completely by direct API requests.
- **Remediation**:
  Create and attach an explicit `AdminAuthMiddleware` to all `/api/admin` routers that validates `adminAccessToken` and asserts `req.user.role.includes("ADMIN")`.

---

### SEC-02: Hardcoded SonarQube Tokens Committed to Repository
- **Severity**: **CRITICAL**
- **Location**: `client/sonar-project.properties` (line 1), `server/sonar-project.properties` (line 4).
- **Evidence**:
  ```ini
  # client/sonar-project.properties
  sonar.token=sqp_[REDACTED]
  
  # server/sonar-project.properties
  sonar.token=sqp_[REDACTED]
  ```
- **Impact**: Static analysis tokens committed in plaintext can be harvested from version control to access SonarQube dashboards, alter quality gates, or compromise CI/CD pipelines.
- **Remediation**:
  Revoke the compromised tokens immediately in SonarQube. Remove `sonar.token` lines from both files and supply tokens exclusively via environment variables or CI runner secrets.

---

### SEC-03: Provider Service Management Endpoints Lack Authentication
- **Severity**: **HIGH**
- **Location**: `server/src/modules/provider-service/presentation/routes/provider-service.routes.ts`
- **Evidence**:
  ```typescript
  // Lines 13-17
  router.post(PROVIDER_SERVICE_ROUTES.ROOT, createController.create);
  router.put(PROVIDER_SERVICE_ROUTES.BY_ID, updateController.update);
  ```
  `CreateProviderServiceController.ts` extracts `providerId` from `req.body.providerId` without authenticating the caller or verifying that the caller owns the provider profile.
- **Impact**: Any attacker can add, modify, or delete service listings on behalf of any registered provider by guessing or enumerating their `providerId`.
- **Remediation**:
  Apply `authMiddleware.execute` and verify that `req.user.id` matches the provider's owning `userId`.

---

### SEC-04: Quoting Endpoints Lack Authentication
- **Severity**: **HIGH**
- **Location**: `server/src/modules/quote/presentation/routes/quote.routes.ts`
- **Evidence**:
  ```typescript
  // Lines 7-11
  router.post('/', controller.create);
  router.put('/:id', controller.edit);
  ```
- **Impact**: Unauthenticated users can submit fraudulent price quotes on arbitrary service requests or manipulate existing quotes.
- **Remediation**:
  Apply `authMiddleware.execute` and verify that the caller is an approved provider.

---

### SEC-05: Unrestricted Presigned URL Generator for Arbitrary S3 Keys
- **Severity**: **HIGH**
- **Location**: `server/src/shared/presentation/imageController.ts`
- **Evidence**:
  ```typescript
  export const getPresignedUrl = async (req: Request, res: Response, next: NextFunction) => {
      const key = req.body.key;
      const presignedUrl = await createDisplayUrl(key);
      ResponseHandler.success(res, HttpStatus.OK, "Image url created", presignedUrl);
  }
  ```
  Mounted unauthenticated at `POST /api/image/presigned-url`.
- **Impact**: Anyone can request a valid, signed 10-minute GET URL for *any* object in the S3 bucket if they know or guess the key (e.g. government IDs or private business licenses).
- **Remediation**:
  Require authentication and enforce tenancy checks ensuring the user is authorized to read the specific document key.

---

### SEC-06: Authentication Cookies Configured with `secure: false`
- **Severity**: **HIGH**
- **Location**: `server/src/modules/auth/presentation/controllers/loginControllers/LoginController.ts` (lines 42, 48), `RefreshController.ts` (line 25), `AdminRefreshController.ts` (line 24).
- **Evidence**:
  ```typescript
  res.cookie(accessTokenName, accessToken, {
      httpOnly: true,
      secure: false, // HARDCODED FALSE
      sameSite: "lax",
      maxAge: 15 * 60 * 1000
  });
  ```
- **Impact**: Tokens are transmitted over unencrypted HTTP connections, exposing user sessions to Man-in-the-Middle (MITM) sniffing on shared or unencrypted networks.
- **Remediation**:
  Configure dynamically based on environment: `secure: process.env.NODE_ENV === "production"`.

---

### SEC-07: Flawed Admin Context Inspection in `AuthMiddleware`
- **Severity**: **MEDIUM**
- **Location**: `server/src/modules/auth/presentation/middlewares/AuthMiddleware.ts`
- **Evidence**:
  ```typescript
  let token = req.cookies.accessToken;
  if (req.body?.context == "ADMIN") {
      token = req.cookies.adminAccessToken;
  }
  ```
- **Impact**: In HTTP GET requests (where `req.body` is undefined), `req.body?.context` evaluates to undefined. If `AuthMiddleware` were attached to admin GET routes, it would mistakenly look for standard `accessToken` instead of `adminAccessToken`.
- **Remediation**:
  Separate into distinct middlewares (`userAuthMiddleware` and `adminAuthMiddleware`) or inspect the request path / headers rather than `req.body`.

---

### SEC-08: Login Endpoint Rejection on Pre-Existing Session
- **Severity**: **MEDIUM**
- **Location**: `server/src/modules/auth/presentation/controllers/loginControllers/LoginController.ts`
- **Evidence**:
  ```typescript
  let hasAccessToken = req.cookies.accessToken;
  if (hasAccessToken) {
      ResponseHandler.error(res, HttpStatus.BAD_REQUEST, AUTH_MESSAGES.SESSION_EXISTS);
      return;
  }
  ```
- **Impact**: If a user's access token is expired or corrupted, or if a user attempts to switch accounts without first explicitly hitting `/logout`, the login endpoint rejects them with "Session already exists", causing an authentication deadlock until cookies are manually cleared.
- **Remediation**:
  Allow valid credentials to overwrite existing session cookies rather than throwing an error.

---

### SEC-09: Unverified Simulated Payments
- **Severity**: **MEDIUM**
- **Location**: `server/src/modules/order/application/usecases/ProcessOrderPaymentUseCase.ts`
- **Evidence**:
  ```typescript
  transactionReference: `TXN-${Date.now().toString().slice(-8)}`
  ```
- **Impact**: Anyone invoking `POST /api/order/:id/payment` transitions orders to `COMPLETED` and `PAID` without any actual currency transfer or proof of payment.
- **Remediation**:
  Integrate a real payment gateway (Stripe, Razorpay) with webhook signature verification.
