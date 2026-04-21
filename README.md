# Web Dev Org MVP (Functional)

Web Dev Org is a credits-only marketplace for ready-made websites with a developer + tester + admin workflow.

## What is implemented
- ✅ Ready-made website marketplace
- ✅ Developer submission workflow
- ✅ Tester bug reporting workflow
- ✅ Admin moderation workflow
- ✅ Credit economy with locked credits and manual unlock
- ✅ Admin secure route `/admin-divit-vkbk2turan-vjds` + 3-step PIN verification

## Credit logic
- `1 Credit = ₹15`
- Buyers buy credits and purchase websites with credits
- Developers receive **locked credits** from sales
- Testers receive **locked credits** for approved bugs
- Admin unlocks locked credits manually

## Rating outcomes
- ⭐1: user demoted (approval reset)
- ⭐2: no change
- ⭐3: note for 15-day add-on
- ⭐4: cashback (~13 credits)
- ⭐5: cashback (~33 credits) + promotion note

## Setup
1. Copy `.env.example` -> `.env`
2. Install dependencies: `npm install`
3. Run Prisma migration: `npx prisma migrate dev`
4. Generate Prisma client: `npx prisma generate`
5. Seed admin account: `npx prisma db seed`
6. Start app: `npm run dev`

## Main user flows
- Register/Login: `/auth/login`
- Developer dashboard: `/dashboard/developer`
- Tester dashboard: `/dashboard/tester`
- User dashboard: `/dashboard/user`
- Admin panel: `/admin-divit-vkbk2turan-vjds`
- Marketplace: `/marketplace`

Each dashboard contains working API forms that execute real backend actions using JWT tokens.
