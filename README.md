# Future CRM

Production-oriented MERN CRM for admin teams to manage lead pipelines, deals, and follow-up reminders with a modern SaaS dashboard experience.

## Overview

Future CRM is a full-stack web application built with React + Vite on the frontend and Node.js + Express + MongoDB on the backend.  
The application is admin-first and includes:

- JWT authentication and protected admin routes
- Lead management with filtering, pagination, and detail panels
- Drag-and-drop Kanban pipeline
- Deal tracking and dashboard statistics
- Follow-up reminder and timeline system with overdue alerts

## Core Features

- **Authentication**
  - Admin registration and login
  - JWT token-based authorization
  - Role-protected APIs
- **Leads**
  - Create, edit, delete, and inspect lead records
  - Search + status filtering + pagination
  - Responsive table (desktop) and cards (mobile)
- **Pipeline**
  - Four-stage Kanban board: New, Contacted, Proposal Sent, Converted
  - Drag-and-drop status updates with optimistic UI
- **Deals**
  - CRUD operations for opportunities linked to leads
  - Pipeline value and stage distribution support
- **Follow-ups**
  - Add follow-up notes and reminders
  - Timeline history per lead and global follow-up view
  - Overdue and due-today indicators with navigation badge
- **Dashboard**
  - KPI cards and lead/deal summaries
  - Recent activity feed

## Technology Stack

- **Frontend:** React 19, Vite, Tailwind CSS, React Router, Axios
- **UI/UX:** Lucide icons, Framer Motion, React DnD
- **Backend:** Node.js, Express 5, Mongoose, express-validator
- **Security:** bcrypt password hashing, JWT auth, middleware route guards
- **Database:** MongoDB (Atlas/local)

## Project Structure

```text
FUTURE_FS_02/
├── client/
│   ├── public/                 # logo, favicon, static assets
│   └── src/
│       ├── api/                # API clients (axios modules)
│       ├── components/         # UI + feature components
│       ├── context/            # Auth context
│       ├── hooks/              # reusable hooks
│       ├── layouts/            # app/auth layouts
│       ├── pages/              # route pages
│       ├── routes/             # protected/public routing
│       └── utils/              # constants, formatters, helpers
├── server/
│   └── src/
│       ├── config/             # DB connection
│       ├── controllers/        # route handlers
│       ├── middleware/         # auth, validation, errors
│       ├── models/             # Mongoose schemas
│       ├── routes/             # API routes
│       └── utils/              # shared server helpers
└── README.md
```

## Local Development Setup

Use two terminals.

### 1) Backend

```powershell
cd "server"
npm install
copy .env.example .env
npm run dev
```

### 2) Frontend

```powershell
cd "client"
npm install
copy .env.example .env
npm run dev
```

Default URLs:
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:5000](http://localhost:5000)
- Health check: [http://localhost:5000/api/health](http://localhost:5000/api/health)

If you use Bash/WSL, replace `copy` with `cp`.

## Environment Variables

### Server (`server/.env`)

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | JWT signing secret |
| `PORT` | No | API port (default `5000`) |
| `JWT_EXPIRE` | No | Token expiry (default `7d`) |
| `CLIENT_URL` | No | CORS origin (default `http://localhost:5173`) |
| `ADMIN_SETUP_KEY` | No | Required for additional admin registration after initial setup |

### Client (`client/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | No | API base URL (default `/api`) |

## API Summary

### Authentication
- `POST /api/auth/admin/register`
- `POST /api/auth/admin/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `PUT /api/auth/profile`

### Leads
- `GET /api/leads`
- `GET /api/leads/:id`
- `POST /api/leads`
- `PUT /api/leads/:id`
- `PATCH /api/leads/:id/status`
- `DELETE /api/leads/:id`

### Follow-ups
- `GET /api/follow-ups`
- `GET /api/follow-ups/stats`
- `GET /api/follow-ups/timeline`
- `POST /api/follow-ups`
- `PUT /api/follow-ups/:id`
- `PATCH /api/follow-ups/:id/complete`
- `DELETE /api/follow-ups/:id`

### Deals
- `GET /api/deals`
- `GET /api/deals/:id`
- `POST /api/deals`
- `PUT /api/deals/:id`
- `DELETE /api/deals/:id`
- `GET /api/deals/stats`

## Production Notes

- Use strong secrets for `JWT_SECRET` and `ADMIN_SETUP_KEY`
- Restrict MongoDB Atlas network access appropriately
- Keep CORS origin locked to your deployed frontend domain
- Serve client and API via HTTPS in production
- Add centralized logging and request tracing for server diagnostics

## Troubleshooting

- **Atlas connection error / IP whitelist issue**  
  Add your current public IP in MongoDB Atlas Network Access.
- **Token/auth failures**  
  Verify `JWT_SECRET` and token expiration settings.
- **Favicon not updating**  
  Hard refresh browser (`Ctrl + Shift + R`) and reopen tab.
- **Follow-up lead select empty**  
  Ensure at least one lead exists and API is reachable.

## Scripts

### Server
- `npm run dev` — start with nodemon
- `npm start` — start production-style process

### Client
- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production build locally

## License

ISC
