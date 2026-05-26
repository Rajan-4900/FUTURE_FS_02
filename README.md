# 🚀 Future CRM — Sales & Follow-ups Platform

A polished full-stack CRM and pipeline management app with a clean SaaS-style dashboard. Designed for lead management, deals, and follow-ups with role-based admin authentication.

### Quick overview
- 🔧 Frontend: React + Vite + Tailwind CSS
- ⚙️ Backend: Node.js + Express 5 + Mongoose (MongoDB)
- 🔐 Auth: JWT-based admin authentication
- 🧩 Purpose: Manage leads, deals, contacts, and follow-up timelines

---

## ✨ Highlights
- Clean, component-driven React UI with dashboard widgets and Kanban pipeline components
- API-first Express server with modular controllers, middleware, and Mongoose models
- Built-in follow-up tools and timeline UI to keep leads moving through the pipeline

## 🧭 Project structure

```
FUTURE_FS_02/
├── client/                 # React + Vite frontend (UI, pages, hooks, api)
├── server/                 # Express API (controllers, models, routes)
└── README.md               # You are here
```

## 🛠️ Tech stack
- React 19, Vite, Tailwind CSS
- Node.js, Express 5, Mongoose
- JWT for auth, Axios for client API calls
- Dev tools: ESLint (client), Nodemon (server)

---

## ⚡ Quick start (development)
Open two terminals.

Terminal 1 — backend:

```powershell
cd "server"
npm install
copy .env.example .env  # edit server/.env with your values
npm run dev
```

Terminal 2 — frontend:

```powershell
cd "client"
npm install
copy .env.example .env  # edit client/.env if needed (VITE_API_URL)
npm run dev
```

Default dev ports:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

If you prefer Bash (WSL/Git Bash), replace `copy` with `cp`.

---

## 🔐 Environment variables

Server (`server/.env`) — required:

| Variable      | Description                          |
|---------------|--------------------------------------|
| MONGODB_URI   | MongoDB connection string (Atlas/URI) |
| JWT_SECRET    | Secret used to sign JWTs              |
| PORT          | Optional API port (default: 5000)     |
| JWT_EXPIRE    | Optional token expiry (default: 7d)   |
| CLIENT_URL    | Optional frontend URL for CORS        |
| ADMIN_SETUP_KEY | Optional key to allow creating extra admins |

Client (`client/.env`):

| Variable     | Description                          |
|--------------|--------------------------------------|
| VITE_API_URL | API base URL (default: `/api`)       |

---

## 📦 API & auth notes
- First admin can be created via `POST /api/auth/admin/register`.
- Subsequent admin registrations may require `ADMIN_SETUP_KEY` (see `server/.env`).
- Use `Authorization: Bearer <token>` for protected endpoints.

Common endpoints (high level):

- `POST /api/auth/admin/register` — register admin
- `POST /api/auth/admin/login` — admin login
- `GET /api/auth/me` — current admin
- `CRUD /api/contacts` — contacts
- `CRUD /api/deals` — deals
- `GET /api/deals/stats` — pipeline statistics

---

## ✅ Recommended workflows
- Use the frontend to manage leads and open the lead detail panel for follow-up actions.
- Use the Kanban board to drag leads across pipeline stages.
- Review `server/src/utils/followUpHelpers.js` and `client/src/api` to extend or customize follow-up automation.

## 🧾 License & contribution
- License: ISC (see `server/package.json`)
- Contributions: open an issue or submit a PR. Keep changes focused and include screenshots for UI tweaks.

---

If you want, I can:
- add a quick demo GIF in `client/public/` and reference it here,
- create a `docs/` folder with API examples,
- or generate a `.env.example` from the current code (server + client).

Would you like any of those next? 
