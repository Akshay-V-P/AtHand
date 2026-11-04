# AtHand — Frontend Architecture & UI Design

## 1. Application Entry Point & Bootstrapping

The client is a single-page application (SPA) built with **React 19**, **TypeScript**, and **Vite**:

```
index.html
└── src/app/main.tsx
    ├── <Provider store={store}>            (Redux Toolkit Context)
    │   └── <BrowserRouter>                 (React Router v7 Context)
    │       └── <App />                     (App Shell)
    │           ├── <Toaster />             (Global Toast Alerts)
    │           ├── <AuthInitializer>      (Initial Session Rehydration)
    │           │   └── <GoogleOAuthProvider> (Google Identity Context)
    │           │       └── <AppRoutes />   (Root Route Switcher)
```

---

## 2. Layouts & Visual Hierarchy

The application structures pages using nested layout wrappers that render common navigational headers, sidebars, and footers via `<Outlet />`:

```mermaid
graph TD
    Root[AppRoutes]
    
    subgraph CustomerLayoutTree["Customer Layout Hierarchy"]
        CustLayout["CustomerLayout (Navbar + Footer)"]
        Home["Home Page"]
        AccountLayout["AccountLayout (Sidebar)"]
        Profile["Profile Page"]
        AddressPage["Address Management"]
        CatPage["Category Catalog & Search"]
        SRLayout["ServiceRequestLayout"]
        SRList["Service Requests List"]
        SRNew["Create Service Request"]
        SRDetail["Service Request & Order Detail"]
        
        CustLayout --> Home
        CustLayout --> AccountLayout
        CustLayout --> CatPage
        CustLayout --> SRLayout
        AccountLayout --> Profile
        AccountLayout --> AddressPage
        SRLayout --> SRList
        SRLayout --> SRNew
        SRLayout --> SRDetail
    end

    subgraph ProviderLayoutTree["Provider Layout Hierarchy"]
        ProtRoute1["ProtectedRoute"]
        ProvLayout["ProviderLayout"]
        ApplyLayout["ApplyAsProviderLayout (Wizard Stepper)"]
        ApplyStep1["Business Details"]
        ApplyStep2["Service Category & Radius"]
        ApplyStep3["Document Upload"]
        ApplyStep4["Verification Waiting Page"]
        
        DashLayout["ProviderDashLayout (Nav + Sidebar)"]
        DashHome["Dashboard"]
        Inbox["Request Inbox"]
        ReviewQuote["Review & Quote"]
        ActiveRepairs["Active Repairs"]
        ManageOrder["Manage Repair Order"]
        MyServices["My Services"]
        NewService["Add Service"]
        
        ProtRoute1 --> ProvLayout --> ApplyLayout
        ApplyLayout --> ApplyStep1
        ApplyLayout --> ApplyStep2
        ApplyLayout --> ApplyStep3
        ApplyLayout --> ApplyStep4
        
        ProtRoute1 --> DashLayout
        DashLayout --> DashHome
        DashLayout --> Inbox
        DashLayout --> ReviewQuote
        DashLayout --> ActiveRepairs
        DashLayout --> ManageOrder
        DashLayout --> MyServices
        DashLayout --> NewService
    end

    subgraph AdminLayoutTree["Admin Layout Hierarchy"]
        AdminProt["AdminProtection"]
        AdminLayout["AdminLayout (Navbar + Sidebar)"]
        AdminDash["Admin Dashboard"]
        ProvMgmt["Provider Management"]
        ProvDetailsLayout["ProviderDetailsLayout"]
        ProvProfile["Provider Profile"]
        ProvDocs["Document Verification"]
        ProvMetrics["Performance Metrics"]
        ProvCatalog["Service Catalog"]
        UserMgmt["User Management"]
        CatMgmt["Service Categories"]
        
        AdminProt --> AdminLayout
        AdminLayout --> AdminDash
        AdminLayout --> ProvMgmt
        AdminLayout --> ProvDetailsLayout
        ProvDetailsLayout --> ProvProfile
        ProvDetailsLayout --> ProvDocs
        ProvDetailsLayout --> ProvMetrics
        ProvDetailsLayout --> ProvCatalog
        AdminLayout --> UserMgmt
        AdminLayout --> CatMgmt
    end

    Root --> CustomerLayoutTree
    Root --> ProviderLayoutTree
    Root --> AdminLayoutTree
```

---

## 3. State Management Architecture

The global Redux store (`src/store/store.ts`) organizes state into four modular feature slices:

```mermaid
flowchart LR
    subgraph ReduxStore["Redux Store (store.ts)"]
        Auth["authSlice\n- user\n- isAuthenticated\n- isLoading"]
        ProviderApp["providerApplicationSlice\n- businessDetails\n- locationDetails\n- serviceDetails\n- documents\n- stepCount"]
        Provider["providerSlice\n- id, businessName\n- location, radius\n- status, ratings\n- completedJobs"]
        Admin["adminSlice\n- admin\n- isAuthenticated\n- isLoading"]
    end
```

| Slice | Key Actions | Primary Consumers |
| :--- | :--- | :--- |
| `auth` | `loginSuccess`, `logout`, `updateUser`, `setIsLoading` | `Navbar`, `Login`, `Register`, `ProtectedRoute`, `Profile` |
| `admin` | `adminloginSuccess`, `adminlogout`, `adminSetIsLoading` | `AdminProtection`, `AdminNavbar`, `AdminLogin` |
| `provider` | `setProvider`, `clearProvider`, `setLoading` | `Navbar`, `ProviderDashRoutes`, `RequestInbox`, `ManageRepairOrder` |
| `providerApplication` | `setBusinessDetails`, `setLocationDetails`, `setServiceDetails`, `addDocument`, `removeDocument`, `clearProviderApplication` | `BusinessDetails`, `ServiceDetails`, `UploadDocuments`, `ProgressBar` |

---

## 4. API & Data Fetching Architecture

All HTTP requests pass through the unified Axios instance configured in `src/services/axios.ts`:

```typescript
import axios from "axios";
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});
```

### Feature API Adapters
Each feature module defines a clean, typed API client wrapper around `api`:
- `features/auth/api/authApi.ts`: Low-level auth HTTP requests.
- `features/admin/api/adminApi.ts`: Administrative management endpoints.
- `features/customer/service-request/api/serviceRequestApi.ts`: Request CRUD and queries.
- `features/customer/service-request/api/orderApi.ts`: Order management and state transitions.
- `features/provider/dashboard/apis/providerServiceApi.ts`: Technician-side service and request queries.
- `features/provider/dashboard/apis/quoteApi.ts`: Technician quoting endpoints.

### S3 Upload Pipeline (`src/services/imageService.ts`)
```mermaid
sequenceDiagram
    autonumber
    participant Component as UI Component
    participant Service as imageService.ts
    participant Backend as Express Backend (/api/...)
    participant S3 as AWS S3 Storage

    Component->>Service: uploadFileToS3(file, "provider")
    Service->>Backend: POST /api/provider-application/presigned-url { fileName, fileType }
    Backend-->>Service: { uploadUrl: "https://s3...", key: "provider/xyz.jpg" }
    Service->>S3: PUT uploadUrl (File binary stream)
    S3-->>Service: HTTP 200 OK
    Service-->>Component: Returns S3 object key ("provider/xyz.jpg")
```

---

## 5. Styling & Design System

- **Tailwind CSS v4**: Utilizes `@tailwindcss/vite` without legacy `tailwind.config.js`. CSS directives and custom variables are imported directly in `src/styles/globals.css`.
- **Component Design Paradigm**:
  - Consistent border radii (`rounded-2xl`, `rounded-3xl`, `rounded-[2.5rem]`).
  - Subtle frosted glass aesthetic (`bg-white/80`, `bg-white/90`, `backdrop-blur-sm`).
  - Gradient canvas backgrounds (`from-[#d4f0ff] via-[#e4f6fb] to-[#f6fbe3]`).
  - High-contrast, accessibility-focused status badges.
- **Iconography**: Standardized on `lucide-react` for SVG icons across all modules.
- **Interactive Maps**: `react-leaflet` with OpenStreetMap tiles for technician location picking and customer service location visualization.
