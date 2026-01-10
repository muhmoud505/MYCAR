# MYCAR (monorepo)

This repo contains two folders: `backend` (Express.js) and `frontend` (Next.js + Tailwind CSS).

Quick start (Windows / PowerShell):

```powershell
cd backend
npm install
cd ../frontend
npm install
```

Run servers:

```powershell
cd backend
npm run dev
# in another terminal
cd frontend
npm run dev
```

What I scaffolded:
- Backend: basic Express server, Prisma schema (SQLite), env example
- Frontend: Next.js app with Tailwind CSS, responsive layout and navbar

Next recommended steps:
- Run `npx prisma migrate dev --name init` in `backend` to create DB and generate client
- Implement auth, listings, inventory, search, payments (Stripe) and file storage
- Add CRM/payment/third-party integrations as needed
