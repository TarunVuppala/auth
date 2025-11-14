# Role-Based Auth Mini Project

Full-stack assignment that demonstrates secure signup/login with roles, JWT-protected APIs, and a modern dashboard featuring CRUD, search, pagination, and admin/user specific experiences.

## Tech Stack

- **Backend:** Node.js, Express, TypeScript, MongoDB (Mongoose), Zod, bcrypt, JWT
- **Frontend:** Next.js 16 (App Router, React 19), TypeScript, Tailwind CSS, React Hook Form, Zod, axios, Zustand
- **UI/UX:** shadcn/ui-inspired component library (buttons, cards, inputs, tables), Aceternity spotlight pattern, Lucide icons, Sonner toasts, skeleton loaders

## Feature Highlights

- Role-based signup & login (User/Admin) with hashed passwords and JWT auth.
- Protected dashboard greets users with `Welcome, [Name] (Role)` and adapts copy/UI per role.
- CRUD for personal items, plus admin visibility into every record with owner metadata and recent activity feed.
- Global search, server-backed pagination (now resilient after deletes), skeletons, and loading routes for UX polish.
- Admin command center: metrics, user search, promote/demote actions, delete members (with cascading item cleanup).
- Axios + Zustand-based client state with interceptors and deployment playbooks baked into this README.

## Project Structure

```
.
├── backend/        # Express + Mongo API
├── frontend/       # Next.js app router UI
└── README.md       # You're here
```

## Backend

Fill in real values:

- `PORT` – API port (example uses `8000`).
- `MONGODB_URI` – MongoDB Atlas/Supabase/Neon connection string.
- `JWT_SECRET` – at least 32 chars.
- `CLIENT_ORIGIN` – frontend origin

### Scripts

```bash
cd backend
npm install           # install deps
npm run dev           # watch mode with nodemon + tsx
npm run build         # type-check + emit to dist
npm start             # run compiled server (after build)
```

### API Summary

| Method | Endpoint       | Description                          | Auth |
| ------ | -------------- | ------------------------------------ | ---- |
| POST   | `/auth/signup` | Create user (name, email, password, role) | Public |
| POST   | `/auth/login`  | Login + receive JWT                  | Public |
| POST   | `/auth/logout` | Stateless logout helper              | JWT  |
| GET    | `/auth/me`     | Return current user info             | JWT  |
| GET    | `/items`       | List items (search + pagination, admins see all) | JWT |
| POST   | `/items`       | Create new item for current user     | JWT |
| PATCH  | `/items/:id`   | Update item (owner or admin only)    | JWT |
| DELETE | `/items/:id`   | Delete item (owner or admin only)    | JWT |
| GET    | `/admin/metrics` | Admin dashboard metrics + recent items | Admin JWT |
| GET    | `/admin/users` | Search/list members (name/email)     | Admin JWT |
| PATCH  | `/admin/users/:id/role` | Promote/demote roles (no self-demotion) | Admin JWT |
| DELETE | `/admin/users/:id` | Remove user + cascade delete their items | Admin JWT |

Validation errors are returned with helpful messages via Zod; other errors use standard HTTP codes.

## Frontend

### Scripts

```bash
cd frontend
npm install            # install deps
npm run dev            # start Next.js dev server
npm run build          # production build
npm start              # serve production build
```

### UI Flows

- `/` landing page with spotlight hero, CTA buttons, and feature highlights.
- `/signup` role-selection signup form (react-hook-form + zod validation + shadcn inputs).
- `/login` login form with iconography, validation, and auto-redirects.
- `/dashboard` protected route featuring:
  - Personalized welcome header, role badges, logout button.
  - Create/update/delete item forms with validation + toast feedback.
  - Axios-powered search & pagination (with skeletons + loading states).
  - Admin-only owner metadata, recent activity feed, and status badges.
  - Admin command center: metrics, member search, promote/demote, delete users (with busy states).

Happy hacking!
