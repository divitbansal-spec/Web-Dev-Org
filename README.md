# Web Dev Org MVP

Next.js + Prisma MVP for a ready-made website marketplace with developer/tester/admin workflows and a credit-based economy.

## Features
- Roles: User, Developer, Tester, Admin
- Admin route: `/admin-divit-vkbk2turan-vjds`
- Admin login requires email + password + 3-step PIN (`1426 -> 6241 -> 7777`)
- Submission lifecycle: Testing -> Bug reports -> Fix -> Publish
- Credits-only transactions (`1 credit = ₹15`)
- Locked credits for tester rewards and developer sales; admin unlocks
- Purchase + post-purchase rating reward notes

## Setup
1. Copy `.env.example` to `.env`
2. Install dependencies: `npm install`
3. Run migrations: `npx prisma migrate dev`
4. Generate Prisma client: `npx prisma generate`
5. Seed admin: `npx prisma db seed`
6. Run dev server: `npm run dev`

## Core API Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/admin-login`
- `GET|POST /api/websites`
- `POST /api/bug-reports`
- `POST /api/transactions` (buy credits)
- `POST /api/purchase`
- `POST /api/admin/website-review`
- `POST /api/admin/bug-review`
- `POST /api/admin/unlock-credits`
- `POST /api/admin/users`
