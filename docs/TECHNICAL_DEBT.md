# AtHand — Technical Debt & Code Quality Audit

## 1. Technical Debt Inventory

| ID | Issue | Location | Severity | Category |
| :--- | :--- | :--- | :--- | :--- |
| **TD-01** | Client `npm run build` fails due to strict TS compiler options | `client/tsconfig.app.json` | **HIGH** | Build / Tooling |
| **TD-02** | Incomplete stub function in S3 service | `server/src/shared/infrastructure/services/s3.service.ts` | **MEDIUM** | Dead / Incomplete Code |
| **TD-03** | Race condition in `ProtectApplication` loading state | `client/src/components/provider/applyProvider/ProtectApplication.tsx` | **MEDIUM** | Frontend State Bug |
| **TD-04** | Typographical errors in model fields & component names | `QuoteModel.ts`, `UserMangement.tsx`, `CategroryRepository.ts` | **LOW** | Code Hygiene / Naming |
| **TD-05** | Mongoose `ref` name casing mismatch | `ProviderServiceModel.ts`, `ServiceRequestModel.ts` | **MEDIUM** | Schema Inconsistency |
| **TD-06** | Inconsistent Document Type Enums between Draft and Model | `ProviderDraftModel.ts` vs `DocumentModel.ts` | **MEDIUM** | Schema Inconsistency |
| **TD-07** | Hardcoded mock data in production page states | `ManageRepairOrder.tsx`, `Dashboard.tsx`, `ProviderPerformanceMetrics.tsx` | **MEDIUM** | Incomplete Features |
| **TD-08** | Direct Redis client dependency bypassing abstraction | `PasswordResetTokenRepository.ts` | **LOW** | Architectural Violation |
| **TD-09** | Missing automatic 401 token refresh interceptor | `client/src/services/axios.ts` | **MEDIUM** | Client UX / Auth |
| **TD-10** | Prevalent use of `any` types across controllers and mappers | `client/src/components/admin/`, `server/src/modules/*/mappers/` | **LOW** | Type Safety |

---

## 2. In-Depth Technical Debt Analysis

### TD-01: Client `npm run build` Fails Due to Strict TS Flags
- **Location**: `client/tsconfig.app.json`
- **Evidence**:
  ```json
  "noUnusedLocals": true,
  "noUnusedParameters": true
  ```
  `tsc -b` aborts on `TS6133: 'React' is declared but its value is never read` across dozens of files, as well as unindexed types in `Badge.tsx` and missing properties in `CategoryCard.tsx`.
- **Impact**: Production bundles cannot be created via standard `npm run build` without compiler failure.
- **Suggested Improvement**:
  Remove all legacy `import React from 'react'` imports across the client codebase; add index signatures to `Badge.tsx`; correct `CategoryCard.tsx` property types.

---

### TD-02: Incomplete Stub in `s3.service.ts`
- **Location**: `server/src/shared/infrastructure/services/s3.service.ts`
- **Evidence**:
  ```typescript
  // Lines 5-7
  export const createUploadUrl = async (fileName: string, fileType: string) => {
      const key = `provider/`
  }
  ```
  The function ends abruptly without generating or returning a presigned URL.
- **Impact**: Any caller of this shared helper receives `undefined`. (Fortunately, `providerApplication` uses its own `S3UrlService` instead).
- **Suggested Improvement**:
  Either complete the function using `PutObjectCommand` and `getSignedUrl(s3client, command)` or remove the dead code.

---

### TD-03: Race Condition in `ProtectApplication.tsx`
- **Location**: `client/src/components/provider/applyProvider/ProtectApplication.tsx`
- **Evidence**:
  ```typescript
  // Lines 15-23
  dispatch(setLoading(true));
  apiService
      .getProvider(user?.id!)
      .then((response) => {
          dispatch(setProvider(response.data.data));
      })
      .catch((error) => console.error(error));

  dispatch(setLoading(false)); // EXECUTED SYNCHRONOUSLY BEFORE PROMISE RESOLVES!
  ```
- **Impact**: `setLoading(false)` is dispatched before `apiService.getProvider()` resolves. The component immediately renders with stale or null provider data, potentially triggering improper route redirects.
- **Suggested Improvement**:
  Move `dispatch(setLoading(false))` inside a `.finally()` block on the promise chain.

---

### TD-04: Typographical Inconsistencies
- **Evidence**:
  1. `server/src/modules/quote/infrastructure/database/models/QuoteModel.ts`: `includeWarrenty` (should be `includeWarranty`).
  2. `server/src/modules/category/infrastructure/database/repositories/CategroryRepository.ts`: Typo in filename and class name (`CategroryRepository`).
  3. `client/src/features/admin/pages/UserMangement.tsx`: Typo in filename (`UserMangement.tsx`).
  4. `server/src/modules/admin-category-management/presentation/constants/CATEGORY_ROUTES.ts`: Exported as `CATEGORY_ROUTS` instead of `CATEGORY_ROUTES`.
- **Impact**: Causes cognitive friction and subtle bugs during refactoring or automated imports.
- **Suggested Improvement**:
  Rename symbols and files systematically with IDE refactoring tools.

---

### TD-05: Mongoose Model `ref` Casing Mismatch
- **Location**: `ProviderServiceModel.ts`, `ServiceRequestModel.ts`
- **Evidence**:
  - `ProviderServiceModel.ts` line 6: `ref: "Providers"` (plural), while `ProviderModel.ts` registers `mongoose.model("Provider", ...)`.
  - `ServiceRequestModel.ts` line 25: `ref: "Users"` (plural), while `UserModel.ts` registers `mongoose.model("User", ...)`.
- **Impact**: Mongoose `.populate("providerId")` or `.populate("userId")` calls fail silently or throw Schema errors if Mongoose cannot resolve the referenced model name.
- **Suggested Improvement**:
  Align all `ref` string names to match the exact string passed to `mongoose.model()`.

---

### TD-06: Document Type Enum Inconsistency
- **Location**: `ProviderDraftModel.ts` vs `DocumentModel.ts`
- **Evidence**:
  - In `DocumentModel.ts`: `["TECHNICAL CERTIFICATE", "BUSINESS LICENSE", "GOVERNMENT ID FRONT", "GOVERNMENT ID BACK"]`
  - In `ProviderDraftModel.ts`: `["TECHNICAL CERTIFICATE", "BUSINESS LICENSE", "GOVERNMENT ID"]`
- **Impact**: Uploading separate front and back government IDs fails validation when synchronizing from draft to final documents.
- **Suggested Improvement**:
  Unify the document type enumeration across both schemas.

---

### TD-07: Hardcoded Mock Data in UI States
- **Location**: `client/src/features/provider/dashboard/pages/ManageRepairOrder.tsx`
- **Evidence**:
  Lines 39-43 and 50-51 contain hardcoded default values:
  ```typescript
  const [estimateItems, setEstimateItems] = useState<IEstimateItem[]>([
      { title: 'Screen Replacement', amount: 12000, type: 'PARTS' },
      { title: 'Battery Replacement', amount: 4000, type: 'PARTS' }
  ]);
  const [workProofPhotos, setWorkProofPhotos] = useState<IWorkProofPhoto[]>([
      { url: 'https://images.unsplash.com/...', caption: 'Strip Changed' }
  ]);
  ```
- **Impact**: New orders automatically populate with synthetic estimate items and dummy Unsplash images instead of empty inputs.
- **Suggested Improvement**:
  Initialize form states to empty arrays `[]` and allow technicians to add items and upload photos dynamically.
