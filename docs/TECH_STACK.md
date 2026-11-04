# AtHand — Technology Stack & Dependency Audit

## 1. Backend Technology Stack (`server/`)

| Technology / Library | Version | Category | Where Used | Purpose & Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Node.js** | `>=18` | Runtime | Server execution | Event-driven JavaScript server environment. |
| **Express** | `^5.2.1` | Web Framework | `src/app.ts`, presentation routers | Next-generation Express 5 with native Promise error handling and modern routing. |
| **TypeScript** | `^5.8.3` | Language | Entire server codebase | Static type safety, interfaces, strict compiler checks. |
| **Mongoose** | `^9.7.4` | Database ODM | `src/modules/*/infrastructure/database/` | Object Document Mapping for MongoDB, schema enforcement, validation, and 2dsphere spatial indexing. |
| **MongoDB** | `v6+` (assumed) | Database | Primary data persistence | Document-oriented database with geospatial query support. |
| **Redis** | `^6.1.0` | Cache & In-Memory Store | `src/config/redis.ts`, `src/modules/auth` | Key-value store for session-bound refresh tokens, OTP codes with expiration, and password reset tokens. |
| **@aws-sdk/client-s3** | `^3.1106.0` | Cloud Storage SDK | `src/config/s3.ts`, S3 upload services | Interaction with Amazon Simple Storage Service (S3). |
| **@aws-sdk/s3-request-presigner** | `^3.1106.0` | Cloud Storage Presigning | `src/modules/provider/infrastructure/services/S3UrlService.ts` | Generates secure pre-signed PUT/GET URLs for direct client S3 file transfers. |
| **jsonwebtoken** | `^9.0.3` | Authentication | `src/modules/auth/infrastructure/services/JwtService.ts` | Issues and cryptographically verifies access, refresh, and registration JWTs. |
| **bcrypt** | `^6.0.0` | Security | `src/modules/auth/infrastructure/services/PasswordService.ts` | Salted password hashing and password verification. |
| **google-auth-library** | `^10.9.1` | Authentication | `src/modules/auth/infrastructure/services/GoogleAuthService.ts` | Validates Google OAuth2 ID tokens exchanged by clients. |
| **nodemailer** | `^9.0.3` | Notification | `src/modules/auth/infrastructure/services/EmailService.ts` | Sends account verification OTPs and password reset links via Gmail SMTP. |
| **cookie-parser** | `^1.4.7` | Middleware | `src/app.ts` | Parses HTTP cookie headers into `req.cookies`. |
| **cors** | `^2.8.6` | Middleware | `src/app.ts` | Handles Cross-Origin Resource Sharing with credentials support. |
| **dotenv** | `^17.4.2` | Configuration | `src/config/env.ts` | Loads environment variables from `.env` file into `process.env`. |
| **zod** | `^4.4.3` | Validation | `src/shared/middleware/ValidationMiddleware.ts`, schemas | Type-safe runtime schema parsing and validation. |
| **tsx** | `^4.23.1` | Dev Tooling | `package.json` (`npm run dev`) | TypeScript execution and watch daemon for instant development reloads. |
| **commander** | `^15.0.0` | Internal CLI | `cli/index.mjs` | Powers the custom Clean Architecture generator CLI. |
| **pluralize** | `^8.0.0` | Internal CLI | `cli/generator.mjs` | Inflects English nouns to singular/plural for automated module generation. |

---

## 2. Frontend Technology Stack (`client/`)

| Technology / Library | Version | Category | Where Used | Purpose & Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **React** | `^19.2.7` | UI Framework | Entire client application | Latest React 19 version with modern hook APIs and concurrent rendering. |
| **React DOM** | `^19.2.7` | DOM Renderer | `src/app/main.tsx` | Browser DOM rendering engine for React. |
| **Vite** | `^8.1.1` | Build Tool & Bundler | `vite.config.ts` | Fast ESM-based development server and production bundler. |
| **TypeScript** | `~6.0.2` | Language | Entire client codebase | Static type safety and JSX compilation. |
| **React Router DOM** | `^7.18.1` | Client Routing | `src/routes/AppRoutes.tsx`, feature routes | Declarative client-side routing, nested layouts, protected route guards. |
| **@reduxjs/toolkit** | `^2.12.0` | State Management | `src/store/store.ts`, feature slices | Opinionated, batteries-included toolset for efficient Redux development. |
| **react-redux** | `^9.3.0` | State Binding | `src/app/main.tsx`, `hooks/storeHook.ts` | Official React bindings for Redux. |
| **Tailwind CSS** | `^4.3.3` | Styling Engine | `src/styles/globals.css`, component classes | Utility-first CSS framework (v4 with native CSS configuration). |
| **@tailwindcss/vite** | `^4.3.3` | Vite Plugin | `vite.config.ts` | Official Tailwind CSS v4 compiler integration for Vite. |
| **axios** | `^1.18.1` | HTTP Client | `src/services/axios.ts` | Promise-based HTTP client for browser requests with credential handling. |
| **react-hook-form** | `^7.82.0` | Form Management | Forms across Auth, Admin, and Provider | High-performance, uncontrolled form management with minimal re-renders. |
| **@hookform/resolvers** | `^5.4.0` | Form Validation | Form components | Integrates Zod schemas seamlessly with React Hook Form. |
| **zod** | `^4.4.3` | Validation | Form validation schemas | Declarative schema validation shared between client and server paradigms. |
| **lucide-react** | `^1.27.0` | Iconography | Across all components and layouts | Clean, modern SVG icon set. |
| **react-hot-toast** | `^2.6.0` | Notifications | `App.tsx`, mutation handlers | Lightweight toast notification library for feedback alerts. |
| **leaflet** | `^1.9.4` | Mapping Engine | `components/common/LocationMap.tsx` | Open-source mobile-friendly interactive maps. |
| **react-leaflet** | `^5.0.0` | Map React Binding | `components/common/LocationMap.tsx` | React component wrappers for Leaflet maps. |
| **@react-oauth/google**| `^0.13.5` | Authentication | `App.tsx`, `GoogleAuthButton.tsx` | Google Identity Services wrapper for React. |

---

## 3. Dependency Audit & Health Check

### Potential Issues & Inconsistencies

1. **Misplaced Dependency**:
   - `client/package.json`: `@types/tailwindcss` is installed under `dependencies` rather than `devDependencies`. Since types are compile-time only, this inflates production dependencies needlessly.
2. **Double S3 SDK in Client?**:
   - The client does *not* install AWS SDK; it correctly uses standard `axios.put()` to upload directly to S3 presigned URLs (`client/src/services/imageService.ts`). This is optimal.
3. **Zod Version (v4 prerelease)**:
   - Both `server` and `client` use `zod: ^4.4.3`. Note that Zod 4 has introduced architectural differences from Zod 3 (e.g., standard schema compatibility), which causes minor type-mismatch warnings in certain form resolvers.
4. **React 19 vs Ecosystem Typing**:
   - React 19 (`^19.2.7`) is used with `@types/react: ^19.2.17`. React 19 deprecated several legacy patterns and automatic JSX runtime no longer requires `import React from 'react'`. However, `client/src/` has extensive legacy `import React from 'react'` declarations that trigger TypeScript compiler errors under strict `noUnusedLocals: true`.
5. **No Test Frameworks Installed**:
   - Neither `jest`, `vitest`, `mocha`, `supertest`, nor `@testing-library/react` are installed in either `server/package.json` or `client/package.json`. There is zero test infrastructure.
