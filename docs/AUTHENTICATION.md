# AtHand — Authentication & Authorization Architecture

## 1. Overview

AtHand employs a stateless, token-based authentication system using JSON Web Tokens (JWT) stored in HTTP-only cookies, combined with a stateful Redis session-tracking layer for instant revocation and OTP verification.

Key architectural characteristics:
- **Dual Cookie Namespaces**: Complete separation between standard platform users (`accessToken` / `refreshToken`) and system administrators (`adminAccessToken` / `adminRefreshToken`).
- **Cryptographic Protection**: Salted bcrypt hashing for passwords; signed JWTs for access, refresh, and registration phases.
- **Two-Step Email Verification**: Accounts remain unverified (`isVerified: false`) until a cryptographically random 6-digit OTP delivered via email is validated against Redis.
- **Zero-Storage Password Resets**: Ephemeral reset tokens stored in Redis with 15-minute auto-expiry without bloating the MongoDB database.

---

## 2. Authentication Flow Diagrams

### User Registration & OTP Verification Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as New User
    participant Browser as React Frontend
    participant Server as Express Server
    participant Redis as Redis Cache
    participant SMTP as Google SMTP (Nodemailer)
    participant DB as MongoDB (UserModel)

    User->>Browser: Fill Name, Email, Password, Phone
    Browser->>Server: POST /api/auth/signup
    Server->>DB: Check if email exists & isVerified
    Server->>DB: Create User record (isVerified = false, hashedPassword)
    Server->>Redis: SET otp:{email} = 6-digit code (EX: 60)
    Server->>SMTP: Dispatch verification email with code
    Server->>Server: Sign registrationToken JWT { email }
    Server-->>Browser: HTTP 200 (Cookie: registrationToken, 15m)
    Browser->>User: Redirect to /verify-otp

    User->>Browser: Enters 6-digit OTP
    Browser->>Server: POST /api/auth/verify-otp (Cookie: registrationToken)
    Server->>Server: Verify registrationToken cookie
    Server->>Redis: GET otp:{email}
    Server->>Redis: DEL otp:{email}
    Server->>DB: Update User (isVerified = true)
    Server->>Redis: SET refresh:{userId}:{sessionId} = refreshToken (EX: 7d)
    Server-->>Browser: HTTP 200 (Cookies: accessToken, refreshToken; Clear registrationToken)
    Browser->>User: Authenticated -> Redirect to Home
```

---

### Login & Dual-Context Session Architecture

```mermaid
sequenceDiagram
    autonumber
    actor Actor as Customer / Admin
    participant Browser as React Frontend
    participant Server as Express Server
    participant Redis as Redis Cache
    participant DB as MongoDB (UserModel)

    Actor->>Browser: Submit credentials (Email + Password)
    Browser->>Server: POST /api/auth/login { email, password, context: "USER"|"ADMIN" }
    Server->>Server: Check if existing access cookie present
    Server->>DB: Find user by email
    Server->>Server: Verify bcrypt password hash
    
    alt context === "ADMIN"
        Server->>Server: Assert user.role includes "ADMIN"
        Server->>Redis: Store refresh:{userId}:{sessionId}
        Server-->>Browser: Set Cookies: adminAccessToken (15m), adminRefreshToken (7d)
    else context === "USER"
        Server->>Redis: Store refresh:{userId}:{sessionId}
        Server-->>Browser: Set Cookies: accessToken (15m), refreshToken (7d)
    end
    
    Browser-->>Actor: Store user in Redux -> Navigate to dashboard
```

---

## 3. JWT Token Architecture & Payloads

The platform utilizes three distinct JWT varieties signed with distinct secret keys:

| Token Type | Secret Env Variable | Expiration Env Variable | Default TTL | Payload Structure |
| :--- | :--- | :--- | :--- | :--- |
| **Access Token** | `JWT_ACCESS_SECRET` | `JWT_ACCESS_EXPIRES` | `15m` | `{ id: string, email: string, role: string[], sessionId: string }` |
| **Refresh Token** | `JWT_REFRESH_SECRET` | `JWT_REFRESH_EXPIRES` | `7d` | `{ id: string, email: string, role: string[], sessionId: string }` |
| **Registration Token** | `JWT_REGISTRATION_SECRET` | `JWT_REGISTRATION_EXPIRES` | `15m` | `{ email: string }` |

---

## 4. Cookie Configuration & Security Attributes

All cookies are issued from Express controllers (`LoginController`, `RefreshController`, `AdminRefreshController`) with the following attributes:

```typescript
res.cookie(cookieName, tokenValue, {
    httpOnly: true,     // Inaccessible to client JavaScript (mitigates XSS)
    sameSite: "lax",    // Protects top-level navigation CSRF
    secure: false,      // NOTE: Hardcoded to false in code; see Security Audit
    maxAge: durationMs  // 15m for access, 7d for refresh
})
```

---

## 5. Middleware Audit & Enforcement

### 1. `AuthMiddleware` (`server/src/modules/auth/presentation/middlewares/AuthMiddleware.ts`)
- **Inspection Logic**:
  ```typescript
  let token = req.cookies.accessToken;
  if (req.body?.context == "ADMIN") {
      token = req.cookies.adminAccessToken;
  }
  ```
- **Validation**: Verifies token against `JWT_ACCESS_SECRET`.
- **Augmentation**: Injects decoded payload into `req.user`.
- **Identified Flaw**: Routes accessed via HTTP `GET` lack `req.body`, meaning `req.body?.context == "ADMIN"` evaluates to false for all GET requests!

### 2. `RegistrationMiddleware` (`server/src/modules/auth/presentation/middlewares/RegistrationMiddleware.ts`)
- **Inspection Logic**: Reads `req.cookies.registrationToken`.
- **Validation**: Verifies token against `JWT_REGISTRATION_SECRET`.
- **Augmentation**: Injects `{ email }` payload into `req.registration`.

---

## 6. Frontend Authentication State & Lifecycle

### `AuthInitializer` (`client/src/features/auth/AuthInitializer.tsx`)
On application initialization (browser reload or startup), `AuthInitializer` intercepts the app render:
1. Detects route context (`window.location.pathname.startsWith("/admin")`).
2. If on `/admin/*`:
   - Calls `authService.adminRefresh()` (`POST /api/auth/admin-refresh`).
   - Calls `authService.refresh({ context: "ADMIN" })` (`POST /api/auth/me`).
   - Dispatches `adminloginSuccess(userData)` to `adminSlice`.
3. If on public/customer route:
   - Calls `authService.refreshTokens()` (`GET /api/auth/refresh`).
   - Calls `authService.refresh({ context: "USER" })` (`POST /api/auth/me`).
   - Calls `initializeAuthenticatedUser(dispatch, userData)`:
     - Dispatches `loginSuccess(userData)` to `authSlice`.
     - If `userData.role.includes("PROVIDER")`, proactively fetches the technician's provider profile and hydrates `providerSlice`.

### Route Guards
- **`ProtectedRoute` (`components/common/ProtectedRoute.tsx`)**: Guards user/customer routes. If `!isAuthenticated && !user`, redirects to `/login`.
- **`AdminProtection` (`components/admin/AdminProtection.tsx`)**: Guards admin dashboard routes. If `!isAuthenticated && !admin`, redirects to `/admin/login`.
- **`ProtectApplication` (`components/provider/applyProvider/ProtectApplication.tsx`)**: Guards the onboarding wizard. If provider status is already `PENDING` or `ACTIVE`, redirects directly to `/apply-provider/verify`.
