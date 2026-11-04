# AtHand — Folder Structure & Component Directory

## 1. Root Repository Layout

```
athand/
├── client/                     # Vite + React 19 Single Page Application
├── server/                     # Express 5 + Node.js + TypeScript REST API
├── docs/                       # Project architecture and technical documentation
└── .gitignore                  # Git exclusions for node_modules, build outputs, and .env
```

| Path | Purpose & Responsibility |
| :--- | :--- |
| `client/` | Complete frontend application containing React components, Redux state slices, routes, pages, and Tailwind styling. |
| `server/` | Complete backend application containing Clean Architecture modules, database models, business use cases, and REST controllers. |
| `docs/` | Persistent technical reference manual and context store for developers and AI agents. |
| `.gitignore` | Prevents node_modules, dist folders, environment files (`.env`), and IDE configurations from being committed. |

---

## 2. Server Architecture (`server/`)

```
server/
├── cli/                        # Custom code generator CLI (Clean Architecture scaffolding)
│   ├── generator.mjs           # File writer, template renderer, and naming utilities
│   ├── index.mjs               # Commander CLI configuration and commands
│   └── templates.mjs           # Code templates for usecases, controllers, repos, entities, dtos
├── src/
│   ├── app.ts                  # Express application setup, global middleware, route mounting
│   ├── server.ts               # Server bootstrap, database & redis connections, port listening
│   ├── config/                 # Infrastructure configurations
│   │   ├── database.ts         # Mongoose connection logic
│   │   ├── env.ts              # dotenv environment variable loading
│   │   ├── redis.ts            # Redis client connection and error handlers
│   │   └── s3.ts               # AWS SDK S3 client instantiation
│   ├── modules/                # Domain-Driven Bounded Modules
│   │   ├── address/            # User saved address management with GeoJSON coordinates
│   │   ├── admin-category-management/ # Admin CRUD, block/unblock operations for categories
│   │   ├── admin-provider-management/ # Admin provider auditing, verification, and status updates
│   │   ├── admin-user-management/     # Admin user auditing, block/unblock, and profile updates
│   │   ├── auth/               # User registration, OTP, JWT issuance, Google OAuth, password reset
│   │   ├── category/           # Public and internal service category catalog
│   │   ├── order/              # Repair order lifecycle, estimate approval, payments, reviews
│   │   ├── provider/           # Provider profile, document store, and public provider queries
│   │   ├── provider-service/   # Technician-offered repair services catalog
│   │   ├── providerApplication/# Multi-step technician onboarding wizard backend
│   │   ├── quote/              # Provider repair quotes and estimates for service requests
│   │   └── service-request/    # Customer repair requests with geospatial search
│   ├── shared/                 # Shared Cross-Cutting Infrastructure
│   │   ├── application/        # Shared DTOs and interfaces (IUsecase, PaginatedResultDTO)
│   │   ├── enums/              # Shared enums (HttpStatus, ServiceMode)
│   │   ├── errors/             # Custom Error hierarchy (AppError, BadRequest, NotFound, etc.)
│   │   ├── infrastructure/     # BaseRepository<T>, S3 service utilities
│   │   ├── middleware/         # Global ErrorMiddleware and Zod ValidationMiddleware
│   │   └── presentation/       # Shared ResponseHandler, Image presigned URL route & controller
│   └── types/
│       └── express.d.ts        # Express Request augmentation (user, registration payloads)
├── package.json                # Server scripts and runtime dependencies
├── tsconfig.json               # TypeScript compiler options
└── sonar-project.properties    # SonarQube static code analysis settings
```

### Module Structure Breakdown

Each bounded module in `server/src/modules/<module-name>/` follows the standardized Clean Architecture directory layout:

| Subdirectory | Responsibility | Contents |
| :--- | :--- | :--- |
| `container.ts` | Module Composition Root | Instantiates concrete repositories, services, use cases, and controllers; wires dependencies via manual constructor injection; exports router. |
| `application/dtos/` | Data Transfer Objects | TypeScript classes/interfaces defining request/response structures across layer boundaries. |
| `application/mappers/` | Application Mappers | Maps domain entities to response DTOs. |
| `application/usecases/` | Application Use Cases | Individual application workflows implementing `IUsecase<TInput, TOutput>`. One file per operation. |
| `domain/entities/` | Domain Entities | Business entities encapsulating domain logic and identity. |
| `domain/enums/` | Domain Enums | Domain-specific enumeration types (e.g., statuses, types). |
| `domain/repositories/` | Repository Interfaces | Abstract port interfaces (`I*Repository.ts`) defining required persistence operations. |
| `domain/services/` | Domain Service Interfaces | Abstract interfaces for external domain services (`ITokenService`, `IEmailService`, etc.). |
| `infrastructure/database/models/` | Mongoose Models | Concrete Mongoose schemas, indexes, and models. |
| `infrastructure/database/mappers/`| Persistence Mappers | Maps raw database documents/objects to Domain Entities and vice-versa. |
| `infrastructure/database/repositories/`| Repository Implementations | Concrete classes implementing `I*Repository` using Mongoose models. |
| `infrastructure/services/` | Concrete Service Adapters | Concrete implementations of external services (e.g., `JwtService`, `OtpService`, `S3UrlService`). |
| `presentation/constants/` | Route & Message Constants | Centralized route endpoints and response message dictionaries. |
| `presentation/controllers/` | REST Controllers | Handles HTTP requests, extracts parameters, delegates to use cases, formats responses via `ResponseHandler`. |
| `presentation/routes/` | Express Routers | Wires HTTP verbs and paths to controller methods and validation/auth middleware. |
| `presentation/validators/` | Validation Schemas | Zod schemas for validating incoming request bodies. |

---

## 3. Client Architecture (`client/`)

```
client/
├── public/                     # Static assets (favicons, icons.svg)
├── src/
│   ├── app/
│   │   ├── App.tsx             # Root component with Toast, GoogleOAuth, AuthInitializer
│   │   └── main.tsx            # DOM root mounting, Redux Provider, BrowserRouter
│   ├── assets/                 # Image assets (hero.png, react.svg, vite.svg)
│   ├── components/             # Reusable UI Component Library
│   │   ├── account/            # Customer account sidebar and layout navigation
│   │   ├── admin/              # Admin dashboard widgets, stat cards, metric pills, tables
│   │   ├── auth/               # Google OAuth login button component
│   │   ├── common/             # Button, Modal, Form, InputField, ProtectedRoute, LocationMap
│   │   ├── provider/           # Provider onboarding widgets, document cards, navbar, sidebar
│   │   └── user/               # User home category cards, review cards, service cards, FAQ
│   ├── features/               # Domain-Driven Feature Slices
│   │   ├── admin/              # Admin login, dashboard, provider/user/category management
│   │   │   ├── api/            # Admin Axios API calls
│   │   │   ├── layouts/        # AdminLayout, ProviderDetailsLayout
│   │   │   ├── pages/          # AdminLogin, Dashboard, ProviderManagement, UserManagement, etc.
│   │   │   ├── routes/         # AdminRoutes definition
│   │   │   ├── services/       # Admin business services
│   │   │   ├── store/          # Admin Redux slice (adminSlice)
│   │   │   └── validation/     # Zod validation schemas for admin forms
│   │   ├── auth/               # Authentication features (Login, Register, OTP, Password Reset)
│   │   │   ├── api/            # Auth Axios API endpoints
│   │   │   ├── pages/          # Login, Register, VerifyOtp, ForgotPassword, ResetPassword
│   │   │   ├── routes/         # AuthRoutes definition
│   │   │   ├── services/       # Auth service orchestration
│   │   │   ├── store/          # User Redux slice (authSlice)
│   │   │   ├── utils/          # Auth bootstrapping helpers (initializeUser.ts)
│   │   │   └── validation/     # Auth form validation schemas
│   │   ├── customer/           # Customer portal
│   │   │   ├── account/        # Profile editing and saved address management
│   │   │   ├── category-page/  # Public service and provider discovery with spatial filters
│   │   │   ├── home/           # Public landing page with hero, categories, reviews, FAQ
│   │   │   ├── layouts/        # CustomerLayout (Navbar + Outlet + Footer)
│   │   │   └── service-request/# Request wizard, request list, detailed order tracking & review
│   │   └── provider/           # Technician & Provider portal
│   │       ├── applyAsProvider/# Multi-step onboarding application wizard
│   │       ├── dashboard/      # Provider dashboard, request inbox, quoting, active repair management
│   │       ├── layout/         # ProviderLayout wrapper
│   │       └── routes/         # ProviderRoutes and ProviderDashRoutes
│   ├── hooks/                  # Custom React Hooks
│   │   ├── storeHook.ts        # Typed useAppDispatch and useAppSelector
│   │   └── useGeolocation.ts   # Browser HTML5 Geolocation API hook
│   ├── routes/
│   │   └── AppRoutes.tsx       # Root router aggregating all feature route definitions
│   ├── services/               # Core Singleton Services
│   │   ├── axios.ts            # Central Axios instance with baseUrl and credentials
│   │   └── imageService.ts     # S3 presigned URL generation and direct S3 upload helper
│   ├── shared/                 # Shared types, DTOs, and enums
│   ├── store/
│   │   └── store.ts            # Central Redux store configuration
│   └── styles/
│       └── globals.css         # Global Tailwind CSS imports and directives
├── index.html                  # HTML entry point
├── vite.config.ts              # Vite configuration with Tailwind CSS v4 plugin
├── tsconfig.app.json           # Frontend TypeScript compiler configuration
├── eslint.config.js            # ESLint flat config with React and TypeScript plugins
└── sonar-project.properties    # SonarQube static code analysis settings
```
