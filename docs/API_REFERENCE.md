# AtHand — REST API Reference Manual

## 1. Global Conventions & Standards

### Base URL
All API routes are served under:
`http://localhost:5000/api` (Development)

### Standard Response Envelope
All endpoints standardize their JSON payload using the `ResponseHandler` utility:

**Success Response (`ResponseHandler.success`):**
```json
{
  "success": true,
  "message": "Operation successful description",
  "data": { ... } // optional
}
```

**Error Response (`ResponseHandler.error` or `errorHandler`):**
```json
{
  "success": false,
  "message": "Error description message",
  "errors": [ ... ] // optional validation errors
}
```

### Authentication Cookies
Authentication is cookie-based with `httpOnly: true, sameSite: "lax"`:
- **Customer / Provider**: `accessToken` (15m), `refreshToken` (7d)
- **Administrator**: `adminAccessToken` (15m), `adminRefreshToken` (7d)
- **Registration In-Flight**: `registrationToken` (15m)

---

## 2. Authentication API (`/api/auth`)

Mounted at `/api/auth` via `src/modules/auth/presentation/routes/auth.routes.ts`.

### `POST /api/auth/signup`
- **Description**: Registers a new user account and dispatches an email OTP.
- **Auth**: None (Public)
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123!",
    "phone": "9876543210"
  }
  ```
- **Response (200)**: Sets `registrationToken` cookie.
  ```json
  {
    "success": true,
    "message": "OTP sent to your email",
    "data": { "newRegister": true }
  }
  ```
- **Errors**: `400 Bad Request` ("User already exist").

### `POST /api/auth/verify-otp`
- **Description**: Verifies 6-digit OTP code against Redis and activates user account.
- **Auth**: Requires `registrationToken` cookie.
- **Request Body**:
  ```json
  { "otp": "482910" }
  ```
- **Response (200)**: Sets `accessToken` and `refreshToken` cookies.
  ```json
  {
    "success": true,
    "message": "OTP verified successfully",
    "data": { "id": "...", "name": "Jane Doe", "email": "jane@example.com", "role": ["USER"] }
  }
  ```
- **Errors**: `400 Bad Request` ("Invalid OTP" or "OTP expired").

### `GET /api/auth/otp-status`
- **Description**: Returns remaining TTL in seconds for the current OTP.
- **Auth**: Requires `registrationToken` cookie.
- **Response (200)**:
  ```json
  { "success": true, "message": "Success", "data": { "remainingTime": 42 } }
  ```

### `POST /api/auth/resend-otp`
- **Description**: Regenerates a new 6-digit OTP and re-sends it via email.
- **Auth**: Requires `registrationToken` cookie.
- **Response (200)**: `{ "success": true, "message": "OTP resent successfully" }`

### `POST /api/auth/login`
- **Description**: Authenticates user via email and password. Supports regular `USER` and `ADMIN` contexts.
- **Auth**: None (Public). Blocks if user already has an active access cookie.
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "Password123!",
    "context": "USER" // or "ADMIN"
  }
  ```
- **Response (200)**: Sets `accessToken` / `refreshToken` (or `adminAccessToken` / `adminRefreshToken`).
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": { "id": "...", "name": "Jane Doe", "email": "jane@example.com", "role": ["USER"] }
  }
  ```

### `POST /api/auth/logout`
- **Description**: Revokes the refresh session in Redis and clears authentication cookies.
- **Auth**: Requires valid access token.
- **Request Body**: `{ "context": "USER" }`
- **Response (200)**: `{ "success": true, "message": "Logged out successfully" }`

### `GET /api/auth/refresh`
- **Description**: Rotates access token using the stored `refreshToken` cookie.
- **Auth**: Requires `refreshToken` cookie.
- **Response (200)**: Sets refreshed `accessToken` cookie.

### `POST /api/auth/admin-refresh`
- **Description**: Rotates admin access token using `adminRefreshToken` cookie.
- **Auth**: Requires `adminRefreshToken` cookie.
- **Response (200)**: Sets refreshed `adminAccessToken` cookie.

### `POST /api/auth/me`
- **Description**: Returns current authenticated user profile.
- **Auth**: Requires valid access token.
- **Response (200)**: User profile object.

### `POST /api/auth/google`
- **Description**: Authenticates or signs up user via Google OAuth2 ID token.
- **Request Body**: `{ "token": "<Google_ID_Token>" }`
- **Response (200)**: Sets access and refresh cookies; returns user profile.

### `POST /api/auth/forgot-password`
- **Description**: Dispatches a 15-minute password reset link to user's email.
- **Request Body**: `{ "email": "user@example.com" }`

### `POST /api/auth/verify-reset-token`
- **Description**: Validates that a password reset token from email exists in Redis.
- **Request Body**: `{ "token": "<reset_token>" }`

### `POST /api/auth/update-password`
- **Description**: Updates password given a valid reset token.
- **Request Body**: `{ "token": "<reset_token>", "password": "NewPassword123!" }`

### `POST /api/auth/verify-password`
- **Description**: Verifies current password before allowing sensitive account updates.
- **Auth**: Authenticated.
- **Request Body**: `{ "password": "CurrentPassword" }`

### `POST /api/auth/profile-upload-url`
- **Description**: Generates an S3 presigned PUT URL for updating user profile avatar.
- **Auth**: Authenticated.
- **Request Body**: `{ "fileName": "avatar.jpg", "fileType": "image/jpeg" }`

### `PATCH /api/auth/update-profile`
- **Description**: Updates profile details (name, phone, profilePhotoUrl).
- **Auth**: Authenticated.
- **Request Body**: `{ "name": "New Name", "phone": "1234567890", "profileKey": "key" }`

---

## 3. Customer Saved Addresses API (`/api/address`)

Mounted at `/api/address`. All routes protected by `AuthMiddleware`.

### `POST /api/address`
- **Description**: Saves a new user address with 2dsphere GeoJSON coordinates.
- **Request Body**:
  ```json
  {
    "label": "Home",
    "houseName": "Villa 12",
    "area": "Panampilly Nagar",
    "city": "Kochi",
    "state": "Kerala",
    "pincode": "682036",
    "coordinates": { "type": "Point", "coordinates": [76.2999, 9.9674] },
    "isPrimary": true
  }
  ```
- **Response (201)**: Created address document.

### `GET /api/address`
- **Description**: Retrieves all saved addresses for the authenticated user.
- **Response (200)**: Array of address documents.

### `PUT /api/address/:id`
- **Description**: Updates an existing address.

### `DELETE /api/address/:id`
- **Description**: Deletes an address.

---

## 4. Provider Application & Onboarding API (`/api/provider-application`)

Mounted at `/api/provider-application`.

### `POST /api/provider-application/create-provider`
- **Description**: Step 1 — Creates initial provider profile and draft.
- **Validation**: `createProviderSchema` (Zod).
- **Request Body**:
  ```json
  {
    "userId": "6724...",
    "businessName": "Express Tech Repairs",
    "contactPerson": "Alex Miller",
    "phone": "9876543210",
    "email": "alex@expresstech.com"
  }
  ```

### `PATCH /api/provider-application/update-provider-draft`
- **Description**: Steps 2 & 3 — Updates draft with location, service category, and service radius.
- **Validation**: `updateProviderDraftSchema` (Zod).
- **Request Body**:
  ```json
  {
    "userId": "6724...",
    "locationDetails": {
      "address": { "street": "Main Rd", "city": "Kochi", "state": "KL", "pincode": "682001" },
      "coordinates": { "type": "Point", "coordinates": [76.2711, 9.9312] }
    },
    "serviceDetails": {
      "serviceCategory": "6721...",
      "serviceRadius": 15
    }
  }
  ```

### `POST /api/provider-application/presigned-url`
- **Description**: Generates an S3 presigned PUT URL for document uploads.
- **Request Body**: `{ "fileName": "license.pdf", "fileType": "application/pdf" }`

### `POST /api/provider-application/upload-document`
- **Description**: Registers an uploaded document in the `ProviderDocuments` collection.
- **Validation**: `uploadDocumentSchema` (Zod).
- **Request Body**:
  ```json
  {
    "providerId": "6725...",
    "documentType": "BUSINESS LICENSE",
    "documentKey": "provider/6725.../license.pdf"
  }
  ```

### `POST /api/provider-application/get-draft`
- **Description**: Returns draft application state for continuing incomplete applications.
- **Request Body**: `{ "userId": "6724..." }`

### `GET /api/provider-application/get-provider/:id`
- **Description**: Returns provider document for a given user ID.

### `GET /api/provider-application/categories`
- **Description**: Lists active categories for provider category selection.

### `POST /api/provider-application/get-display-url`
- **Description**: Returns a 10-minute temporary presigned GET URL for viewing an S3 document.
- **Request Body**: `{ "key": "provider/..." }`

---

## 5. Service Requests API (`/api/service-requests`)

Mounted at `/api/service-requests`. All endpoints protected by `AuthMiddleware`.

### `POST /api/service-requests`
- **Description**: Customer posts a repair request.
- **Request Body**:
  ```json
  {
    "categoryId": "6721...",
    "title": "Microwave not heating",
    "description": "Turns on and rotates, but food remains completely cold.",
    "urgency": "NORMAL", // "LOW" | "NORMAL" | "HIGH" | "EMERGENCY"
    "onSite": true,
    "productBrand": "Samsung",
    "productModel": "MW73AD",
    "preferredDate": "2026-11-10T10:00:00Z",
    "preferredTimeSlot": "Morning (10:00 AM - 1:00 PM)",
    "media": ["provider/media-key-1.jpg"],
    "address": {
      "houseName": "Flat 4B",
      "area": "Palarivattom",
      "city": "Kochi",
      "state": "Kerala",
      "pincode": "682025",
      "coordinates": { "type": "Point", "coordinates": [76.3082, 9.9982] }
    }
  }
  ```
- **Response (201)**: Created ServiceRequest document.

### `GET /api/service-requests`
- **Description**: Retrieves paginated list of service requests created by the authenticated user.
- **Query Params**: `page` (default 1), `limit` (default 10), `status` (optional).

### `GET /api/service-requests/:id`
- **Description**: Fetches service request details by ID.

### `GET /api/service-requests/nearby`
- **Description**: Geospatial query for technicians to find open requests within their coverage area.
- **Query Params**: `lat`, `lng`, `radius` (km), `categoryId`, `page`, `limit`.

### `PATCH /api/service-requests/:id`
- **Description**: Updates request details.

### `PATCH /api/service-requests/:id/cancel`
- **Description**: Cancels request (only allowed if status is `OPEN`).

---

## 6. Quotes API (`/api/quote`)

Mounted at `/api/quote`.

### `POST /api/quote`
- **Description**: Technician submits a price and time quote on a customer request.
- **Request Body**:
  ```json
  {
    "requestId": "6728...",
    "providerId": "6725...",
    "laborCost": 500,
    "partsCost": 1200,
    "estimatedTotal": 1700,
    "estimatedRepairTime": "2_hours",
    "technicalNotes": "Likely magnetron failure or capacitor issue.",
    "includeWarrenty": true
  }
  ```
- **Response (201)**: Created Quote document (`status: "pending"`).

### `GET /api/quote/request/:requestId`
- **Description**: Customer fetches all submitted quotes for their service request.

### `GET /api/quote/provider/:providerId`
- **Description**: Provider fetches quotes they have submitted.

### `GET /api/quote/:id`
- **Description**: Fetches individual quote details.

### `PUT /api/quote/:id`
- **Description**: Edits a pending quote before acceptance.

---

## 7. Repair Orders API (`/api/order`)

Mounted at `/api/order`. Protected by `AuthMiddleware`.

### `POST /api/order/accept-quote`
- **Description**: Customer accepts a quote. Generates formal Order, updates request status to `QUOTE_ACCEPTED`, marks accepted quote `ACCEPTED`, and rejects other quotes.
- **Request Body**:
  ```json
  {
    "quoteId": "6729...",
    "appointmentDate": "2026-11-10T10:00:00Z",
    "timeSlot": "Morning (10:00 AM - 1:00 PM)",
    "accessInstructions": "Call security at gate for entry"
  }
  ```
- **Response (201)**: Created Order document with orderNumber (e.g. `REP-5821`).

### `GET /api/order/customer/my-orders`
- **Description**: Customer fetches all their repair orders.

### `GET /api/order/provider/my-orders`
- **Description**: Technician fetches all repair orders assigned to them.

### `GET /api/order/by-request/:requestId`
- **Description**: Fetches active order associated with a given service request ID.

### `GET /api/order/:id`
- **Description**: Fetches full order details including timeline, estimate, and payment state.

### `PATCH /api/order/:id/diagnosis`
- **Description**: Technician logs physical diagnosis findings.
- **Request Body**:
  ```json
  {
    "summary": "Magnetron diode burned out, high voltage capacitor intact.",
    "identifiedIssues": ["Burned diode", "Grease buildup in waveguide"]
  }
  ```

### `PATCH /api/order/:id/estimate`
- **Description**: Technician submits post-diagnosis itemized repair estimate for customer sign-off.
- **Request Body**:
  ```json
  {
    "items": [
      { "title": "High Voltage Diode 2X062H", "amount": 650, "type": "PARTS" },
      { "title": "Waveguide Cover Replacement", "amount": 250, "type": "PARTS" }
    ],
    "laborCost": 600,
    "partsCost": 900,
    "otherCharges": 0,
    "totalAmount": 1500,
    "estimatedRepairTime": "1 - 2 hours",
    "warranty": "90-day parts and labor warranty",
    "notes": "Original parts used"
  }
  ```

### `PATCH /api/order/:id/estimate-decision`
- **Description**: Customer approves or declines the itemized repair estimate.
- **Request Body**:
  ```json
  {
    "action": "APPROVE", // or "DECLINE"
    "rejectionReason": "Too expensive, prefer purchasing new appliance"
  }
  ```

### `PATCH /api/order/:id/complete`
- **Description**: Technician marks repair completed with proof photos.
- **Request Body**:
  ```json
  {
    "notes": "Diode replaced and microwave tested to boiling temp.",
    "workProofPhotos": [
      { "url": "https://s3.../proof1.jpg", "caption": "Replaced diode" },
      { "url": "https://s3.../proof2.jpg", "caption": "Heating test completed" }
    ]
  }
  ```

### `POST /api/order/:id/payment`
- **Description**: Customer pays final balance; closes order and request.
- **Request Body**: `{ "paymentMethod": "ONLINE" }`

### `POST /api/order/:id/review`
- **Description**: Customer submits provider review and rating.
- **Request Body**:
  ```json
  {
    "rating": 5,
    "comment": "Punctual, professional, and explained the fault clearly!"
  }
  ```

---

## 8. Provider Services Catalog API (`/api/provider-service`)

Mounted at `/api/provider-service`.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/provider-service/public/nearby` | Spatial query for public catalog browsing | Public |
| `POST` | `/api/provider-service/` | Create a service listing | None *(Vulnerability)* |
| `GET` | `/api/provider-service/` | List services by `providerId` query param | Public |
| `GET` | `/api/provider-service/:id` | Get service listing by ID | Public |
| `PUT` | `/api/provider-service/:id` | Update service listing | None *(Vulnerability)* |
| `POST` | `/api/provider-service/upload-url` | Presigned URL for service media | Public |

---

## 9. Administrator APIs (`/api/admin`)

Mounted at `/api/admin`. *(Note: Admin routes currently lack backend authentication middleware check; see Security Audit).*

### Provider Management
- `GET /api/admin/get-providers`: Paginated provider list with search, status, and category filters.
- `GET /api/admin/provider/:id`: Full provider profile with location and verification status.
- `PATCH /api/admin/provider/:id`: Update provider profile fields.
- `PATCH /api/admin/provider/:id/status`: Approve or block provider (`{ "status": "APPROVED" | "BLOCKED" }`).
- `GET /api/admin/document`: List provider documents by `?id=<providerId>`.
- `PATCH /api/admin/document/:id`: Update document verification (`{ "verificationStatus": "APPROVED" | "REJECTED", "remarks": "..." }`).

### Category Management
- `PUT /api/admin/category`: Create new service category with name, description, commission, and icon.
- `GET /api/admin/category`: List all categories with pagination, search, and status filter.
- `GET /api/admin/category/:id`: Get category details.
- `PATCH /api/admin/category/:id`: Update category fields.
- `PATCH /api/admin/category/:id/block`: Set category status to `BLOCKED`.
- `PATCH /api/admin/category/:id/unblock`: Set category status to `ACTIVE`.

### User Management
- `GET /api/admin/users`: List users with pagination, role, verification status, and search filters.
- `GET /api/admin/user/:id`: Get user details.
- `PATCH /api/admin/user/:id`: Update user name or phone.
- `PATCH /api/admin/user/:id/block`: Set user status to `BLOCKED`.
- `PATCH /api/admin/user/:id/unblock`: Set user status to `ACTIVE`.

---

## 10. Public Image & Shared APIs (`/api/image`, `/api/category`, `/api/provider`)

- `POST /api/image/presigned-url`: Generates S3 presigned display GET URL given `{ "key": "..." }`.
- `GET /api/category/active/dropdown`: Returns all active, unblocked categories for frontend dropdown selects.
- `GET /api/provider/`: Public provider query endpoint.
