# Class Hub Monorepo

B2B class-operations automation SaaS MVP with:
- `frontend`: Next.js App Router + Zustand + TanStack Query + Tailwind + shadcn-style UI
- `backend`: Django 5.2 + DRF + JWT + PostgreSQL
- `shared`: shared types, constants, utilities, i18n resources

## 1) LTS migration first (required)

```bash
nvm install --lts
nvm use --lts
node -v
```

This repository targets Node `22` via `.nvmrc`.

## 2) Quick start

```bash
# root
pnpm install

# frontend
cd frontend
pnpm install
cd ..

# backend
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
cd ..
```

## 3) Run locally from root

```bash
pnpm dev
```

Or separately:

```bash
pnpm dev:frontend
pnpm dev:backend
```

## 4) Environment files

- Copy `frontend/.env.example` -> `frontend/.env.local`
- Copy `backend/.env.example` -> `backend/.env`

## 5) Vercel deployment outline

- Frontend: deploy `frontend` as a Next.js project.
- Backend: deploy `backend` manually with your preferred Django deployment configuration.
- PostgreSQL: use managed Postgres and set `DATABASE_URL` in backend environment variables.

## 6) MVP features

- Public dashboard browsing without login
- Auth-only create/update/delete for:
  - schedule and today plan
  - attendance (list + toggle)
  - class/student Kanban with status (`ongoing`, `completed`)

