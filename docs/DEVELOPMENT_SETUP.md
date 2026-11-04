# AtHand — Local Development & Operations Guide

## 1. System Prerequisites

Before running the AtHand platform, ensure your local development workstation has the following tools installed and accessible via PATH:

- **Node.js**: `v18.x` or higher (`v20.x+` recommended)
- **Package Manager**: `npm` (comes with Node.js)
- **MongoDB**: Local MongoDB instance running on port `27017` or a MongoDB Atlas cloud connection URI.
- **Redis Server**: Local Redis server running on port `6379` (or Redis Cloud / Docker container).
- **AWS S3 Bucket**: An AWS S3 bucket with CORS configured to allow `PUT` and `GET` requests from `http://localhost:5173`.
- **Google Cloud Console Credentials**: OAuth 2.0 Web Client ID for Google Authentication.
- **Gmail Account with App Password**: For sending verification OTPs via Nodemailer.

---

## 2. Environment Variables Configuration

Create `.env` files in both `server/` and `client/` directories based on the provided templates:

### Server Configuration (`server/.env`)
Copy `server/.env.example` to `server/.env`:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | HTTP port for the Express application | `5000` |
| `CLIENT_ORIGIN` | Allowed CORS origin for frontend client | `http://localhost:5173` |
| `MONGO_URL` | MongoDB connection connection string | `mongodb://localhost:27017/athand` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `HASH_SALT` | Bcrypt salt rounds (numeric string) | `10` |
| `JWT_ACCESS_SECRET` | Secret key for signing 15m access tokens | *(Generate secure random 64-char string)* |
| `JWT_ACCESS_EXPIRES` | Access token lifespan | `15m` |
| `JWT_REFRESH_SECRET` | Secret key for signing 7d refresh tokens | *(Generate secure random 64-char string)* |
| `JWT_REFRESH_EXPIRES`| Refresh token lifespan | `7d` |
| `JWT_REGISTRATION_SECRET`| Secret key for signing 15m OTP phase token | *(Generate secure random 64-char string)* |
| `JWT_REGISTRATION_EXPIRES`| Registration token lifespan | `15m` |
| `AWS_REGION` | AWS Region of S3 bucket | `ap-south-1` |
| `AWS_BUCKET_NAME` | Name of your S3 bucket | `athand-uploads` |
| `AWS_ACCESS_KEY` | IAM Access Key ID with S3 read/write policy | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY`| IAM Secret Access Key | `...` |
| `EMAIL_USER` | Gmail address for sending verification emails | `your-email@gmail.com` |
| `EMAIL_PASS` | Google 16-character App Password (not account password) | `abcd efgh ijkl mnop` |
| `RESET_LINK` | Base URL for password reset links sent via email | `http://localhost:5173/reset-password?token=` |
| `GOOGLE_CLIENT_ID` | Google OAuth2 Client ID for backend token validation | `...apps.googleusercontent.com` |

### Client Configuration (`client/.env`)
Copy `client/.env.example` to `client/.env`:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Backend REST API base URL | `http://localhost:5000/api` |
| `VITE_GOOGLE_CLIENT_ID`| Google OAuth2 Client ID for Google Identity Services | `...apps.googleusercontent.com` |

---

## 3. Installation & Startup Steps

### Step 1: Install Dependencies
Open two separate terminal windows or run sequentially:

```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### Step 2: Start Redis & MongoDB
Ensure your local services or Docker containers are active:
```bash
# Example using Docker for local dependencies:
docker run -d --name athand-mongo -p 27017:27017 mongo:latest
docker run -d --name athand-redis -p 6379:6379 redis:latest
```

### Step 3: Run Development Servers

**Terminal 1 — Backend Server:**
```bash
cd server
npm run dev
# Executes: tsx watch src/server.ts
# Server runs at http://localhost:5000
```

**Terminal 2 — Frontend Client:**
```bash
cd client
npm run dev
# Executes: vite
# Client runs at http://localhost:5173
```

---

## 4. Production Build & Known Build Issue

### Server Build:
```bash
cd server
npm run build
# Compiles TypeScript to dist/ using tsc
npm start
# Runs node dist/server.js
```
The server compiles cleanly with 0 TypeScript errors.

### Client Build Note:
In `client/package.json`, `"build": "tsc -b && vite build"`.
- **Known Issue**: In `client/tsconfig.app.json`, strict linting flags (`noUnusedLocals: true`, `noUnusedParameters: true`) currently cause `tsc -b` to fail because of unused legacy `import React from 'react'` declarations and untyped parameters in some admin components.
- **Workaround for testing production bundle**:
  Run `npx vite build` directly, or relax `noUnusedLocals: false` in `client/tsconfig.app.json` until the unused imports are cleaned up.

---

## 5. Development Utilities: Code Generator CLI

The server provides a built-in CLI to scaffold Clean Architecture modules:

```bash
cd server

# Scaffold an entire new module:
npm run g resource payment

# Scaffold individual components:
npm run g usecase payment ProcessPayment
npm run g controller payment PaymentController
npm run g repository payment PaymentRepository
```
