# Future CRM

A production-ready MERN stack CRM with a clean SaaS dashboard UI.

## Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, React Router, Axios
- **Backend:** Node.js, Express 5, MongoDB, Mongoose, JWT
- **Auth:** Register, login, protected routes, bearer tokens

## Project structure

```
FUTURE_FS_02/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── api/            # Axios instance & API modules
│       ├── components/     # UI, layout, dashboard widgets
│       ├── context/        # Auth context
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       └── utils/
├── server/                 # Express API
│   └── src/
│       ├── config/         # MongoDB connection
│       ├── controllers/
│       ├── middleware/     # JWT auth, error handling
│       ├── models/
│       ├── routes/
│       └── utils/          # Token helpers
└── README.md
```

## Getting started

### Prerequisites

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas URI

### 1. Backend setup

```bash
cd server
cp .env.example .env
# Edit .env with your MONGODB_URI and JWT_SECRET
npm run dev
```

Server runs at `http://localhost:5000`

### 2. Frontend setup

```bash
cd client
cp .env.example .env
npm run dev
```

App runs at `http://localhost:5173`

The Vite dev server proxies `/api` requests to the backend.

## Environment variables

### Server (`server/.env`)

| Variable      | Description                          |
|---------------|--------------------------------------|
| PORT          | API port (default: 5000)             |
| MONGODB_URI   | MongoDB connection string            |
| JWT_SECRET    | Secret for signing tokens            |
| JWT_EXPIRE    | Token expiry (e.g. `7d`)             |
| CLIENT_URL    | Frontend URL for CORS                |
| ADMIN_SETUP_KEY | Key for registering extra admins   |

### Client (`client/.env`)

| Variable       | Description                    |
|----------------|--------------------------------|
| VITE_API_URL   | API base URL (`/api` or full)  |

## Authentication (Admin)

- **Register:** `POST /api/auth/admin/register` — creates admin user (bcrypt hashed password)
- **Login:** `POST /api/auth/admin/login` — returns JWT for admin only
- **Protected routes:** Bearer token via `Authorization` header
- **CRM APIs:** Require admin role (`adminOnly` middleware)

First admin registration needs no setup key. Additional admins require `ADMIN_SETUP_KEY` in `.env` and the `setupKey` field in the request body.

| Method | Endpoint                   | Auth  | Description           |
|--------|----------------------------|-------|-----------------------|
| GET    | /api/health                | No    | Health check          |
| POST   | /api/auth/admin/register   | No    | Register admin        |
| POST   | /api/auth/admin/login      | No    | Admin sign in         |
| GET    | /api/auth/me               | Token | Current user        |
| POST   | /api/auth/logout           | Token | Logout                |
| PUT    | /api/auth/profile          | Admin | Update profile        |
| CRUD   | /api/contacts              | Admin | Contact management    |
| CRUD   | /api/deals                 | Admin | Deal management       |
| GET    | /api/deals/stats           | Admin | Pipeline stats        |

## Theme

- Sidebar: `#0F172A`
- Primary: `#2563EB`
- Background: `#F8FAFC`
- Cards: white with soft shadows
- Font: Inter

## Scripts

| Location | Command       | Description      |
|----------|---------------|------------------|
| server   | `npm run dev` | Start API (nodemon) |
| server   | `npm start`   | Start API (prod) |
| client   | `npm run dev` | Start frontend   |
| client   | `npm run build` | Production build |
