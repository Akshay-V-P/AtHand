# AtHand — Project Overview

## 1. Executive Summary

**AtHand** ("Troubleshoot before hiring") is an on-demand home and equipment repair service platform built on the MERN stack (MongoDB, Express.js, React, Node.js) with TypeScript. It connects customers seeking repair and diagnostic services (e.g., electronics, home appliances, mechanical repairs) with verified local technicians and repair service providers.

The platform provides an end-to-end service lifecycle:
1. **Discovery & Exploration**: Customers discover nearby repair providers using geolocation-based spatial search.
2. **Service Request Creation**: Customers post repair requests with descriptions, photos/media, urgency levels, and location.
3. **Quotation & Estimation**: Nearby qualified providers receive requests, review details, and submit binding price and duration quotes.
4. **Order Management & Repair Lifecycle**: When a quote is accepted, a formal repair order is generated with a multi-stage workflow: appointment scheduling, diagnostic assessment, itemized repair estimate submission and customer approval, repair completion proof (with photographic evidence), payment settlement, and review/rating.
5. **Provider Onboarding & Verification**: Technicians apply through a multi-step onboarding wizard, upload business and technical documentation, and await admin approval.
6. **Administrative Governance**: Administrators review provider applications, verify documents, govern service categories, configure platform commission rates, and manage user/provider accounts.

---

## 2. Business Problem & Solution

### The Problem
- **Unreliable Estimates**: Customers often face hidden fees and fluctuating repair prices after handing over devices or equipment.
- **Lack of Transparency**: Technicians frequently replace components without providing proof of fault or diagnostic rationale.
- **Trust Deficit**: Customers hesitate to invite unverified technicians into their homes or leave expensive appliances in unverified workshops.
- **Fragmented Communication**: Quoting, scheduling, approvals, and invoices are handled across informal channels (phone calls, WhatsApp).

### The AtHand Solution
- **Transparent Two-Stage Pricing**: 
  - *Stage 1*: Initial quote provides diagnostic and labor baseline estimates.
  - *Stage 2*: Following physical inspection, the technician submits an itemized repair estimate (parts breakdown, labor, warranty period) that the customer must explicitly approve or decline before repairs commence.
- **Strict Document Verification**: Every provider must submit government IDs, business licenses, and technical certificates for manual administrator verification before receiving customer requests.
- **Geospatial Matching**: Customers are paired with nearby qualified providers using MongoDB 2dsphere spatial indexing.
- **Visual Work Proof**: Technicians submit photos of replaced components and repair work before orders can be marked complete.

---

## 3. Target User Personas

| Persona | Role | Primary Objectives | Key Platform Touchpoints |
| :--- | :--- | :--- | :--- |
| **Customer** | End-User (`USER`) | Find reliable local repair technicians, request diagnostic quotes, approve repair estimates, track repair progress, make payments, and rate services. | Landing Page, Category Catalog, Request Wizard, Request Detail Page, Order Timeline, Profile & Address Management. |
| **Service Provider / Technician** | Contractor (`PROVIDER`) | Register business, upload verification credentials, list service offerings, receive nearby repair requests, submit quotes, manage repair orders, upload work proof photos, and collect earnings. | Provider Onboarding Wizard, Provider Dashboard, Request Inbox, Quote Review, Active Repairs, Service Catalog. |
| **Administrator** | Governance (`ADMIN`) | Verify technician credentials, approve/reject provider applications, govern categories and commission rates, manage customer and provider accounts, and monitor platform health. | Admin Login, Admin Dashboard, Provider Management, Document Verification, Service Categories, User Management. |

---

## 4. Key Architectural Highlights

- **Clean Architecture & Domain-Driven Design (DDD)** on the backend: Explicit separation into Domain, Application, Infrastructure, and Presentation layers, with dependency inversion and composition roots.
- **Dual-Session Cookie Authentication**: Separate JWT cookie namespaces for standard users (`accessToken` / `refreshToken`) and administrators (`adminAccessToken` / `adminRefreshToken`), stored in `httpOnly` cookies.
- **Stateful Redis Integration**: Redis is utilized for short-lived 6-digit OTP storage (60s TTL), session-level refresh token tracking (7d TTL), and password reset tokens (15m TTL).
- **Amazon S3 Presigned URL Architecture**: Direct client-to-bucket media uploads using AWS S3 presigned PUT URLs, preventing large media payloads from passing through the Express application server.
- **Geospatial Queries**: MongoDB 2dsphere indexing and `$centerSphere` spherical distance queries for location-based request and service discovery.
- **Internal Clean Architecture Scaffolding CLI**: A custom developer CLI (`server/cli/index.mjs`) for generating modules, use cases, repositories, DTOs, and controllers following the project's architectural standards.
