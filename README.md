# Growfinix Tour Enquiry Web App

[![Build Status](https://img.shields.io/badge/Build-Passing-emerald)](https://github.com/growfinix-tour-enquiry-web-app)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node%20%7C%20Express%20%7C%20PostgreSQL-blue)](https://github.com/growfinix-tour-enquiry-web-app)
[![Tests](https://img.shields.io/badge/Tests-12%2F12%20Passing-brightgreen)](https://github.com/growfinix-tour-enquiry-web-app)
[![License](https://img.shields.io/badge/License-ISC-purple.svg)](LICENSE)

A complete, production-grade, full-stack **Tour Enquiry Web Application** designed and implemented for the **Growfinix Technology Full Stack Developer Internship Project**.

The platform provides a consumer-facing travel website enabling travelers to explore curated tour packages, discover destinations, and submit inquiries with real-time validation. It couples this with an authenticated, responsive **Admin Management Dashboard** providing full CRUD operations, advanced search, status management, pagination, statistical analytics, and CSV data export.

---

## Table of Contents
- [1. Project Overview & Objectives](#1-project-overview--objectives)
- [2. Technology Stack](#2-technology-stack)
- [3. System Architecture & Folder Structure](#3-system-architecture--folder-structure)
- [4. Database Design & Schema](#4-database-design--schema)
- [5. REST API Documentation](#5-rest-api-documentation)
- [6. Security Architecture](#6-security-architecture)
- [7. Installation & Local Setup](#7-installation--local-setup)
- [8. Environment Variables](#8-environment-variables)
- [9. Database Migrations & Initial Admin Setup](#9-database-migrations--initial-admin-setup)
- [10. Testing Guide](#10-testing-guide)
  - [Automated Backend Test Suite](#automated-backend-test-suite)
  - [End-to-End Test Runner](#end-to-end-test-runner)
  - [Postman API Collection](#postman-api-collection)
- [11. User Interface & Features](#11-user-interface--features)
  - [Public Client Website](#public-client-website)
  - [Protected Admin Dashboard](#protected-admin-dashboard)
- [12. Deployment Guide](#12-deployment-guide)
  - [Database: Supabase PostgreSQL](#database-supabase-postgresql)
  - [Backend: Render](#backend-render)
  - [Frontend: Vercel](#frontend-vercel)

---

## 1. Project Overview & Objectives

### Business Goal
Travel agencies receive inquiries across multiple communication channels (chat, email, calls), resulting in missed leads and poor follow-up visibility. The **Tour Enquiry Web App** resolves this by providing:
1. **Seamless Public Inquiry Experience**: A modern, mobile-first web interface presenting travel destinations and curated packages with an inquiry form that captures travel requirements, traveller counts, preferred dates, and budget brackets.
2. **Centralized Admin Dashboard**: Secure administrative portal for travel coordinators to review incoming leads, track workflow states (`Pending` → `Contacted` → `Confirmed` / `Cancelled`), edit inquiry records, search by multiple criteria, and export inquiries to CSV for CRM ingestion.

---

## 2. Technology Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Language**: JavaScript (ES6+ Modules)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) with a curated travel palette (ocean blues, clean slates, subtle purple accents)
- **Routing**: [React Router DOM v6](https://reactrouter.com/) (protected routes with session validation)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/) (configured with credentials and request/response interceptors)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (LTS)
- **Web Framework**: [Express.js](https://expressjs.com/)
- **Architecture**: Clean MVC separation (Routes, Controllers, Middleware, Services, DB Configuration)
- **Security Middleware**:
  - `helmet`: Secure HTTP headers
  - `cors`: Configured CORS origin validation
  - `express-rate-limit`: Brute-force protection on authentication and public submission endpoints
  - `cookie-parser`: Secure HTTP-only cookie extraction

### Database
- **Engine**: [PostgreSQL](https://www.postgresql.org/) (supports local PostgreSQL, Supabase, Neon, Render PostgreSQL)
- **Driver**: `pg` (node-postgres with connection pooling)
- **Zero-Dependency Dev Fallback**: Built-in in-memory PostgreSQL engine via `pg-mem` when a local PostgreSQL server is not installed, enabling immediate out-of-the-box local evaluation with full SQL syntax support.

### Testing & Tooling
- **Unit & Integration Testing**: [Jest](https://jestjs.io/) and [Supertest](https://github.com/ladjs/supertest)
- **API Testing**: Postman collection (`postman/Tour_Enquiry_API.postman_collection.json`)
- **Version Control**: Git & GitHub

---

## 3. System Architecture & Folder Structure

```
growfinix-tour-enquiry-web-app/
├── package.json                   # Root orchestrator scripts
├── render.yaml                    # Render Infrastructure as Code configuration
├── test-e2e.js                    # End-to-end integration test runner
├── .env.example                   # Master environment variable reference
├── postman/
│   └── Tour_Enquiry_API.postman_collection.json  # Comprehensive Postman test collection
├── server/                        # Express REST API Backend
│   ├── .env                       # Backend local configuration
│   ├── .env.example               # Backend environment sample
│   ├── package.json               # Backend dependencies and test scripts
│   └── src/
│       ├── server.js              # Express app bootstrap, CORS, and HTTP server
│       ├── config/
│       │   └── db.js              # PostgreSQL Pool & pg-mem automated adapter
│       ├── controllers/
│       │   ├── authController.js  # Admin login, session check, logout logic
│       │   └── enquiryController.js # CRUD endpoints, stats, pagination, search
│       ├── db/
│       │   ├── schema.sql         # DDL table creation, indexes, plpgsql triggers
│       │   ├── initDb.js          # Standalone database migration runner
│       │   └── seedAdmin.js       # Initial administrator account seeder
│       ├── middleware/
│       │   ├── authMiddleware.js  # JWT cookie / Bearer token validation
│       │   ├── errorHandler.js    # Global error & 404 handlers
│       │   ├── rateLimiter.js     # Rate limiters for auth and enquiries
│       │   └── validateMiddleware.js # Input validation & XSS sanitization
│       ├── routes/
│       │   ├── index.js           # Main API router (/api)
│       │   ├── authRoutes.js      # /api/auth routes
│       │   └── enquiryRoutes.js   # /api/enquiries routes
│       └── tests/
│           └── api.test.js        # 12 automated Jest + Supertest suites
└── client/                        # React + Vite Frontend
    ├── .env                       # Frontend local configuration
    ├── .env.example               # Frontend environment sample
    ├── package.json               # Frontend dependencies
    ├── vite.config.js             # Vite proxy configuration (/api -> :5000)
    ├── tailwind.config.js         # Custom palette, typography, shadows
    ├── vercel.json                # Vercel deployment SPA rewrite rule
    ├── index.html                 # Main HTML document with SEO meta tags
    └── src/
        ├── main.jsx               # React DOM root
        ├── App.jsx                # React Router root & Route definitions
        ├── api/
        │   └── client.js          # Axios API client & interceptors
        ├── context/
        │   └── AuthContext.jsx    # Authentication provider & persistent session state
        ├── pages/
        │   ├── HomePage.jsx       # Public landing page container
        │   ├── AdminLoginPage.jsx # Admin authentication page with demo auto-fill
        │   ├── AdminDashboardPage.jsx # Full CRUD management dashboard
        │   └── NotFoundPage.jsx   # 404 error page
        ├── components/
        │   ├── Navbar.jsx         # Responsive navbar with smooth scroll anchors
        │   ├── Hero.jsx           # Modern hero banner with trust badges
        │   ├── Destinations.jsx   # Popular destinations showcase
        │   ├── TourPackages.jsx   # Curated packages with pricing and duration
        │   ├── EnquiryForm.jsx    # Validated tour enquiry submission form
        │   ├── ContactSection.jsx # Contact details and concierge desk
        │   ├── Footer.jsx         # Footer with quick links and admin portal access
        │   └── ProtectedRoute.jsx # Route guard verifying admin session
        └── styles/
            └── index.css          # Tailwind directives & custom utilities
```

---

## 4. Database Design & Schema

The application uses standard PostgreSQL relational models with primary keys, foreign constraints, indexes for query performance, and automated timestamps.

### Entity Relationship & Table Definition

```mermaid
erDiagram
    ADMINS {
        SERIAL id PK
        VARCHAR(100) name
        VARCHAR(255) email UK
        VARCHAR(255) password_hash
        TIMESTAMPTZ created_at
    }

    ENQUIRIES {
        SERIAL id PK
        VARCHAR(100) full_name
        VARCHAR(255) email
        VARCHAR(30) phone
        VARCHAR(100) destination
        DATE travel_date
        INTEGER travellers
        VARCHAR(50) budget
        TEXT message
        VARCHAR(20) status
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
```

### Table 1: `admins`
Stores authorized administrator credentials:
- `id`: `SERIAL PRIMARY KEY` — Unique identifier.
- `name`: `VARCHAR(100) NOT NULL` — Admin full display name.
- `email`: `VARCHAR(255) UNIQUE NOT NULL` — Admin email (indexed for fast authentication).
- `password_hash`: `VARCHAR(255) NOT NULL` — Salted bcrypt password hash.
- `created_at`: `TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP` — Account creation time.

### Table 2: `enquiries`
Stores customer tour inquiries:
- `id`: `SERIAL PRIMARY KEY` — Unique enquiry reference number.
- `full_name`: `VARCHAR(100) NOT NULL` — Traveler full name.
- `email`: `VARCHAR(255) NOT NULL` — Contact email.
- `phone`: `VARCHAR(30) NOT NULL` — Contact phone number.
- `destination`: `VARCHAR(100) NOT NULL` — Target destination.
- `travel_date`: `DATE NOT NULL` — Preferred start date (validated to not be in the past).
- `travellers`: `INTEGER NOT NULL CHECK (travellers > 0)` — Number of guests.
- `budget`: `VARCHAR(50) NOT NULL` — Selected budget bracket.
- `message`: `TEXT` — Optional travel preferences, honeymoon notes, dietary requirements.
- `status`: `VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Contacted', 'Confirmed', 'Cancelled'))` — Workflow state.
- `created_at`: `TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP` — Timestamp of submission.
- `updated_at`: `TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP` — Auto-updated via trigger.

### Database Performance Indexes
- `idx_enquiries_status` on `enquiries(status)`: Accelerates dashboard filter counts.
- `idx_enquiries_created_at` on `enquiries(created_at DESC)`: Optimizes default chronologic pagination.
- `idx_enquiries_email` on `enquiries(email)`: Speeds up customer record matching.
- `idx_enquiries_destination` on `enquiries(destination)`: Speeds up destination-based reporting.
- `idx_admins_email` on `admins(email)`: Ensures instant admin login lookups.

---

## 5. REST API Documentation

Base URL: `http://localhost:5000/api` (Production: `https://your-api-domain.com/api`)

### Public Endpoints

| Method | Endpoint | Description | Rate Limit |
|---|---|---|---|
| `GET` | `/health` | API and Database Health Check | Unlimited |
| `POST` | `/enquiries` | Submit new tour enquiry | 20 req/hour |
| `POST` | `/auth/login` | Administrator authentication | 10 req/15 min |

### Protected Endpoints (Admin Authorization Required)

| Method | Endpoint | Description | Headers |
|---|---|---|---|
| `GET` | `/auth/me` | Verify active session | Cookie or `Authorization: Bearer <token>` |
| `POST` | `/auth/logout` | Terminate session & clear cookies | None |
| `GET` | `/enquiries` | List enquiries (with pagination, search, status filter) | Auth required |
| `GET` | `/enquiries/stats` | Status count statistics (Pending, Contacted, Confirmed, etc.) | Auth required |
| `GET` | `/enquiries/:id` | Retrieve single enquiry details | Auth required |
| `PUT` | `/enquiries/:id` | Update complete enquiry details | Auth required |
| `PATCH` | `/enquiries/:id/status` | Update enquiry status only | Auth required |
| `DELETE` | `/enquiries/:id` | Permanently delete enquiry | Auth required |

---

### Detailed Endpoint Specifications

#### 1. Submit Tour Enquiry
`POST /api/enquiries`
- **Request Body (JSON)**:
```json
{
  "full_name": "Eleanor Vance",
  "email": "eleanor.vance@example.com",
  "phone": "+1 (555) 019-2834",
  "destination": "Swiss Alps & Interlaken, Switzerland",
  "travel_date": "2026-11-20",
  "travellers": 2,
  "budget": "$2,500 - $5,000",
  "message": "Looking for first-class glacier rail passes and chalet accommodation."
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Your tour enquiry has been submitted successfully! Our travel specialist will contact you shortly.",
  "data": {
    "id": 4,
    "full_name": "Eleanor Vance",
    "email": "eleanor.vance@example.com",
    "phone": "+1 (555) 019-2834",
    "destination": "Swiss Alps & Interlaken, Switzerland",
    "travel_date": "2026-11-20T00:00:00.000Z",
    "travellers": 2,
    "budget": "$2,500 - $5,000",
    "message": "Looking for first-class glacier rail passes and chalet accommodation.",
    "status": "Pending",
    "created_at": "2026-10-25T00:10:00.000Z",
    "updated_at": "2026-10-25T00:10:00.000Z"
  }
}
```

#### 2. Admin Login
`POST /api/auth/login`
- **Request Body (JSON)**:
```json
{
  "email": "admin@wanderflow.com",
  "password": "Admin@123"
}
```
- **Response (200 OK)**: Sets HTTP-only `admin_token` cookie and returns:
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "admin": {
      "id": 1,
      "name": "System Administrator",
      "email": "admin@wanderflow.com",
      "created_at": "2026-10-25T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 3. Dashboard Statistics
`GET /api/enquiries/stats`
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "total": 4,
    "pending": 2,
    "contacted": 1,
    "confirmed": 1,
    "cancelled": 0
  }
}
```

#### 4. List Enquiries with Pagination & Filters
`GET /api/enquiries?page=1&limit=10&status=Pending&search=Swiss`
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "full_name": "Sophia Montgomery",
      "email": "sophia.m@example.com",
      "phone": "+1 (555) 234-8971",
      "destination": "Swiss Alps & Interlaken, Switzerland",
      "travel_date": "2026-11-20T00:00:00.000Z",
      "travellers": 2,
      "budget": "$2,500 - $5,000",
      "message": "Glacier view chalet required.",
      "status": "Pending",
      "created_at": "2026-10-25T00:00:00.000Z",
      "updated_at": "2026-10-25T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

#### 5. Update Status
`PATCH /api/enquiries/:id/status`
- **Request Body (JSON)**:
```json
{
  "status": "Contacted"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Enquiry status updated to 'Contacted'.",
  "data": { "id": 1, "status": "Contacted" }
}
```

#### 6. Delete Enquiry
`DELETE /api/enquiries/:id`
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Enquiry #1 was permanently deleted."
}
```

---

## 6. Security Architecture

1. **Password Hashing**: Passwords stored as one-way salted hashes using `bcryptjs` (cost factor 10).
2. **Dual-Layer Token Delivery**:
   - Primary: Secure, HTTP-only, SameSite cookies to protect against Cross-Site Scripting (XSS).
   - Secondary: `Authorization: Bearer <token>` fallback header for API tools and Postman.
3. **No Public Registration**: Admin accounts cannot be created via public endpoints. Creation is strictly governed by authenticated database seeders or migration CLI tools.
4. **Input Sanitization & Validation**:
   - Email format verification via RFC-compliant regular expressions.
   - Phone format validation across international formats.
   - Future date constraints preventing booking inquiries with historical dates.
   - Traveler count constraints (min 1, max 100).
   - SQL Injection protection via parameterized queries (`$1, $2, ...`).
5. **Rate Limiting**:
   - `authLimiter`: Max 10 attempts per 15 minutes per IP on `/api/auth/login`.
   - `enquiryLimiter`: Max 20 submissions per hour per IP on `/api/enquiries`.
6. **CORS Configuration**: Restricts API calls to authorized frontend origins (e.g., `http://localhost:5173` in local dev and Vercel domains in production).
7. **HTTP Security Headers**: Enforced via `helmet` (content security policy, frameguard, xssFilter).

---

## 7. Installation & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [npm](https://www.npmjs.com/) v9.0.0 or higher
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/growfinix-tour-enquiry-web-app.git
cd growfinix-tour-enquiry-web-app
```

### Step 2: Install Dependencies
Install dependencies for root, backend, and frontend:
```bash
# Install root packages
npm install

# Install server packages
npm --prefix server install

# Install client packages
npm --prefix client install
```

### Step 3: Configure Environment Variables
Copy the provided environment examples:
```bash
# In the server directory:
cp server/.env.example server/.env

# In the client directory:
cp client/.env.example client/.env
```

*(Note: On Windows PowerShell, use `Copy-Item server/.env.example server/.env`)*

---

## 8. Environment Variables

### Backend Configuration (`server/.env`)

```ini
# Server Port
PORT=5000

# Environment Mode
NODE_ENV=development

# PostgreSQL Connection String (Supabase / Render / Local)
# If left empty and USE_PG_MEM=true, the server uses the built-in PostgreSQL engine
DATABASE_URL=

# SSL Database Flag (true for cloud databases like Supabase/Neon/Render)
DATABASE_SSL=false

# In-memory PostgreSQL engine fallback (true enables zero-config local run)
USE_PG_MEM=true

# JWT Secret Key (minimum 32 characters)
JWT_SECRET=super_secret_jwt_key_wanderflow_2026_dev_key_32chars!

# Frontend Client URL for CORS
CLIENT_URL=http://localhost:5173

# Initial Administrator Credentials (used by seed and auto-init)
ADMIN_NAME=System Administrator
ADMIN_EMAIL=admin@wanderflow.com
ADMIN_PASSWORD=Admin@123
```

### Frontend Configuration (`client/.env`)

```ini
# Leave blank in development so Vite proxies /api to http://localhost:5000
# For production deployment, set to your backend Render URL: https://growfinix-tour-enquiry-server.onrender.com/api
VITE_API_BASE_URL=
```

---

## 9. Database Migrations & Initial Admin Setup

### Option A: Immediate Zero-Config Mode (Default)
When `USE_PG_MEM=true` is set in `server/.env`, the server automatically initializes tables, triggers, indices, and default seed data upon launch without requiring an external PostgreSQL installation.

### Option B: Local or Cloud PostgreSQL (Supabase / Render)
1. Provide your database connection string in `server/.env`:
   ```ini
   DATABASE_URL=postgresql://postgres:password@localhost:5432/tour_enquiry_db
   DATABASE_SSL=false
   USE_PG_MEM=false
   ```
2. Run database migration:
   ```bash
   npm run db:init
   ```
3. Seed the initial administrator account and sample enquiries:
   ```bash
   npm run db:seed
   ```

### Default Administrator Credentials
- **Email**: `admin@wanderflow.com`
- **Password**: `Admin@123`
*(These credentials can also be auto-filled with one click on the Admin Login page for evaluation).*

---

## 10. Testing Guide

### Automated Backend Test Suite
The backend contains 12 automated unit and integration tests powered by **Jest** and **Supertest**. The suite verifies health checks, form validation, authorization rejection, login flows, session profile checks, status transitions, full updates, dashboard stats, and record deletion.

Run tests:
```bash
npm test
```

Expected output:
```
PASS src/tests/api.test.js
  Tour Enquiry REST API Test Suite
    √ GET /api/health should return online status
    √ POST /api/enquiries should reject payload with missing required fields
    √ POST /api/enquiries should successfully create a new tour enquiry
    √ POST /api/auth/login should reject incorrect password
    √ POST /api/auth/login should authenticate admin and return token
    √ GET /api/auth/me should return current admin profile
    √ GET /api/enquiries should return 401 Unauthorized without auth token
    √ GET /api/enquiries should list enquiries when authorized
    √ PATCH /api/enquiries/:id/status should update status to Contacted
    √ PUT /api/enquiries/:id should update enquiry details
    √ GET /api/enquiries/stats should return counts by status
    √ DELETE /api/enquiries/:id should delete the enquiry

Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
```

### End-to-End Test Runner
A dedicated live verification runner (`test-e2e.js`) performs end-to-end HTTP operations against the running server and frontend:
```bash
npm run test:e2e
```

### Postman API Collection
A complete, structured Postman test collection is included at:
`postman/Tour_Enquiry_API.postman_collection.json`

**Included Requests:**
1. `GET /api/health` — Health check
2. `POST /api/enquiries` (Valid Submission)
3. `POST /api/enquiries` (Validation Error Demonstration)
4. `POST /api/auth/login` (Auto-extracts `authToken` collection variable)
5. `GET /api/auth/me` (Session verification)
6. `GET /api/enquiries/stats` (Dashboard counts)
7. `GET /api/enquiries` (List with filters)
8. `GET /api/enquiries/:id` (Single enquiry retrieval)
9. `PATCH /api/enquiries/:id/status` (Update status)
10. `PUT /api/enquiries/:id` (Full update)
11. `DELETE /api/enquiries/:id` (Deletion)
12. `POST /api/auth/logout` (Session termination)

---

## 11. User Interface & Features

### Public Client Website (`/`)
- **Hero Section**: High-impact visual headline, key value props (40+ destinations, 99.4% satisfaction, 24/7 support), and quick action buttons.
- **Popular Destinations**: 6 destination cards (Santorini, Kyoto & Tokyo, Swiss Alps, Bali, Dubai, Serengeti) with traveler ratings, review counts, tags, and one-click enquiry buttons that auto-populate the form.
- **Curated Tour Packages**: Showcase of itineraries with duration (e.g. 8 Days / 7 Nights), price per person, key inclusions, and category tags.
- **Tour Enquiry Form**:
  - Interactive inputs with icons for Name, Email, Phone, Destination, Date, Travellers, Budget, and Special Notes.
  - Client-side validation with real-time error clearance.
  - Double-click and duplicate-submission lockout while request is in transit.
  - Detailed reference confirmation card upon successful submission.
- **Contact & Concierge Desk**: Phone, email, headquarters address, and emergency assistance desk info.
- **Footer**: Brand statement, quick links, and discrete secure link to the Admin Portal.

### Protected Admin Dashboard (`/admin/dashboard`)
- **Key Metric Stat Cards**: Live counts for Total Inquiries, Pending, Contacted, Confirmed, and Cancelled.
- **Search & Filter Controls**: Live search across client names, destinations, emails, and phone numbers. Instant filtering by workflow status dropdown.
- **Interactive Enquiry Table**:
  - Color-coded status pills (`Pending`: Amber, `Contacted`: Blue, `Confirmed`: Emerald, `Cancelled`: Rose).
  - Quick inline status switcher dropdown.
  - Action buttons: View Details (Eye icon), Edit Details (Pencil icon), and Delete Record (Trash icon).
- **View Modal**: Comprehensive modal displaying inquiry metadata, full customer message, travel date, budget, and creation timestamp.
- **Edit Modal**: Allows administrators to adjust destination, travel dates, guest count, budget, and customer notes.
- **Delete Confirmation Dialog**: Modal requiring explicit confirmation before permanent database removal.
- **CSV Data Export**: One-click download of all displayed records as a formatted `.csv` file.
- **Session Control**: Logout button clearing both client storage and HTTP-only session cookies.

---

## 12. Deployment Guide

### Database: Supabase PostgreSQL
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **Project Settings** → **Database** and copy the **URI connection string**.
3. Under the SQL Editor, paste the contents of `server/src/db/schema.sql` and click **Run**.
4. (Optional) Run the seed query or let the backend auto-seed upon boot.

### Backend: Render
1. Create an account at [render.com](https://render.com).
2. Click **New +** → **Web Service** and connect your GitHub repository.
3. Configure the service settings:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add the following **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `DATABASE_URL`: `[Your Supabase URI connection string]`
   - `DATABASE_SSL`: `true`
   - `USE_PG_MEM`: `false`
   - `JWT_SECRET`: `[Generate a secure 64-character random string]`
   - `CLIENT_URL`: `https://your-frontend-domain.vercel.app`
   - `ADMIN_EMAIL`: `admin@wanderflow.com`
   - `ADMIN_PASSWORD`: `[Your Strong Admin Password]`
5. Deploy the service and copy the provided service URL (e.g., `https://growfinix-tour-enquiry-server.onrender.com`).

*(Note: A pre-configured `render.yaml` Blueprint is also included in the repository root for one-click Render Blueprint deployments).*

### Frontend: Vercel
1. Create an account at [vercel.com](https://vercel.com).
2. Click **Add New Project** and import the GitHub repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
4. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://growfinix-tour-enquiry-server.onrender.com/api`
5. Click **Deploy**. Vercel will build the frontend assets using the included `vercel.json` rewrite configuration for seamless SPA routing.

---

## Internship Demonstration Summary

| Feature Area | Implementation Status | Verification Method |
|---|---|---|
| **Tour Enquiry Form** | Complete | Validated required fields, phone regex, date verification, duplicate submit lock. |
| **Admin Authentication** | Complete | Bcrypt salted hash + JWT HTTP-only cookie + ProtectedRoute guard. |
| **Enquiry CRUD API** | Complete | Create, Read (paginated/filtered), Update (full & status PATCH), Delete. |
| **Admin Dashboard UI** | Complete | Stats cards, real-time search, status filter, View/Edit/Delete modals, CSV export. |
| **Responsive Design** | Complete | Mobile drawer menu, responsive grid layouts, desktop navigation. |
| **Automated Tests** | 12 / 12 Passed | Jest & Supertest API suite + live `test-e2e.js` test runner. |
| **Postman Collection** | Complete | `Tour_Enquiry_API.postman_collection.json` with token auto-extraction. |
| **Deployment Readiness**| Complete | Configured for Vercel, Render, and Supabase with `render.yaml` & `vercel.json`. |

---

*Developed for the **Growfinix Technology Full Stack Developer Internship Project**.*
#   T o u r - E n q u i r y - W e b - A p p  
 #   T o u r - E n q u i r y - W e b - A p p  
 #   T o u r - E n q u i r y - W e b - A p p  
 #   T o u r - E n q u i r y - W e b - A p p  
 