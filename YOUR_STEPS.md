# What You Need To Do (No Railway Required)

The app is ready. You only need to: **get a free database** and **set 3 env variables**. Below are free options and exact steps.

---

## Step 1: Get a free PostgreSQL database

Pick **one** of these (all have free tiers, no credit card for Neon/Supabase):

### Option A: Neon (recommended, quick)
1. Go to **https://neon.tech**
2. Sign up with GitHub (free).
3. Create a new project → pick a region.
4. On the project dashboard, copy the **connection string** (it looks like `postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`).
5. Use it as `DATABASE_URL` in Step 2.

### Option B: Supabase
1. Go to **https://supabase.com**
2. Sign up → New project.
3. In **Project Settings → Database**, copy the **URI** (connection string).
4. Use it as `DATABASE_URL` in Step 2.

### Option C: ElephantSQL
1. Go to **https://www.elephantsql.com**
2. Sign up → Create new instance (Tiny Turtle is free).
3. Open the instance and copy the **URL**.
4. Use it as `DATABASE_URL` in Step 2.

---

## Step 2: Create `.env` and `.env.local` with your values

Prisma CLI (`db push`, `migrate`) only reads **`.env`**. Next.js loads both `.env` and `.env.local`. So create **`.env`** in the project root (so Prisma finds `DATABASE_URL`), and optionally **`.env.local`** for other vars.

**Easiest:** create a single file named **`.env`** in the project root with:

```env
# Paste your database URL from Step 1 — use ONLY the URL, no "psql" or extra quotes
DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"

# Secret for sessions (see below)
NEXTAUTH_SECRET="paste-a-long-random-string-here"
NEXTAUTH_URL="http://localhost:3000"
```

Use a file named **`.env`** (so `npx prisma db push` can find `DATABASE_URL`).

**Getting `NEXTAUTH_SECRET`:**
- **Windows (PowerShell):** Run once and copy the output:
  ```powershell
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```
- **Mac/Linux:** `openssl rand -base64 32`
- Or use any long random string (e.g. 32+ characters).

---

## Step 3: Run these commands in the project folder

Open a terminal in `d:\Post Projects\Web Projects\files (1)` and run:

```powershell
# 1. Install dependencies
npm install

# 2. Generate Prisma client and create tables in your database
npx prisma generate
npx prisma db push

# 3. (Optional) Add demo users so you can log in right away
npm run db:seed

# 4. Start the app
npm run dev
```

Then open **http://localhost:3000** in your browser.

- If you ran **db:seed**: log in with `demo@habitloop.com` / `password123`.
- Otherwise: use **Get Started** to sign up, then log in and use the dashboard.

---

## Summary

| What | Where / How |
|------|----------------------|
| Free PostgreSQL | Neon.tech, Supabase, or ElephantSQL (see Step 1) |
| `DATABASE_URL` | Connection string from the provider (Step 1) |
| `NEXTAUTH_SECRET` | Generate with the Node command in Step 2 |
| `NEXTAUTH_URL` | `http://localhost:3000` for local dev |

You don’t need Railway; any of the free options above is enough to run the app.
