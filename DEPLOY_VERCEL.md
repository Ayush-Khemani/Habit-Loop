# Deploy HabitLoop on Vercel (Free)

Use **Vercel** for the app and your existing **Neon** database. Everything stays on the free tier.

---

## 1. Prerequisites (you already have these)

- [x] Code on GitHub: [Ayush-Khemani/Habit-Loop](https://github.com/Ayush-Khemani/Habit-Loop)
- [x] Neon database (from YOUR_STEPS.md)
- [x] Vercel account

---

## 2. Deploy on Vercel

### Step 1: Import the project

1. Go to **[vercel.com](https://vercel.com)** and sign in (e.g. with GitHub).
2. Click **“Add New…”** → **“Project”**.
3. Under **Import Git Repository**, select **Ayush-Khemani/Habit-Loop** (or paste `https://github.com/Ayush-Khemani/Habit-Loop`).
4. Click **Import**.

### Step 2: Configure project (optional)

- **Framework Preset:** Next.js (should be detected).
- **Root Directory:** leave as **`.`** (project root).
- **Build Command:** `npm run build` (default).
- **Output Directory:** leave default.

### Step 3: Add environment variables

Before deploying, add these in the Vercel project form:

| Name | Value | Where to get it |
|------|--------|------------------|
| `DATABASE_URL` | **Neon pooled** connection string (see below) | Neon dashboard → Connection string → **Pooled** (not Direct) |
| `NEXTAUTH_SECRET` | A long random string | Same as local, or: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `NEXTAUTH_URL` | Your production URL | Use **`https://your-project-name.vercel.app`** (replace with the exact URL Vercel will give you) |

**Important – use Neon’s pooled connection on Vercel**

Vercel runs in a serverless environment. You must use Neon’s **pooled** connection string, not the direct one, or you’ll see errors like “PostgreSQL connection: Error { kind: Closed }” or “Something went wrong” on signup/login.

1. Open **[Neon Console](https://console.neon.tech)** → your project.
2. On the dashboard, find **Connection string**.
3. Open the dropdown and select **“Pooled connection”** (not “Direct connection”).
4. Copy the URL. The host should contain **`-pooler`** (e.g. `ep-xxx-pooler.us-east-1.aws.neon.tech`).
5. Paste that URL as **`DATABASE_URL`** in Vercel. Keep `?sslmode=require` at the end if it’s there.  
   **If you already use pooled and still see “Connection closed”:** add **`&connection_limit=1`** to the end of `DATABASE_URL` (e.g. `...?sslmode=require&connection_limit=1`). That helps in serverless.

- If you’re not sure of the Vercel URL yet, use a placeholder like **`https://habit-loop.vercel.app`**, then change it in **Step 5** after the first deploy.

### Step 4: Ensure production database has tables

Vercel does **not** run `prisma db push`. Your Neon DB must already have the tables.

1. Locally, set **`.env`** so **`DATABASE_URL`** is your **production** Neon URL (the same one you use on Vercel).
2. Run once: **`npx prisma db push`**
3. Then set **`.env`** back to your local DB if needed.

If you skip this, signup will return 500 and the error will say the table/relation does not exist.

### Step 5: Deploy

1. Click **Deploy**.
2. Wait for the build to finish (a few minutes).
3. Open the **Visit** link (e.g. `https://habit-loop-xxx.vercel.app`).

### Step 6: Fix `NEXTAUTH_URL` if needed

1. In Vercel: **Project → Settings → Environment Variables**.
2. If your real URL is different from what you set (e.g. you used a placeholder), set **`NEXTAUTH_URL`** to the **exact** URL Vercel shows (e.g. `https://habit-loop-abc123.vercel.app`).
3. **Redeploy:** **Deployments** → **⋯** on latest deployment → **Redeploy**.

---

## 3. (Optional) Seed production database

To get demo logins on production:

1. In your **local** project, temporarily set `.env` (or `.env.local`) to use your **Neon production** `DATABASE_URL`.
2. Run once:
   ```bash
   npm run db:seed
   ```
3. Then log in on the live site with:
   - **Email:** `demo@habitloop.com`
   - **Password:** `password123`

If you don’t seed, users can still **Sign up** and use the app normally.

---

## 4. What happens on each push

- Pushes to **`main`** trigger a new **production** deployment on Vercel.
- Other branches get **preview** URLs.

No extra CI/CD setup needed.

---

## 5. Troubleshooting

| Issue | What to do |
|-------|------------|
| **“Something went wrong” on signup** or **Prisma: “PostgreSQL connection: Error { kind: Closed }”** | 1) Use Neon’s **Pooled** connection string (Step 3). 2) Add **`&connection_limit=1`** to the end of `DATABASE_URL`. 3) Redeploy (the app now calls `ensureDb()` before each DB use to reconnect if the connection was closed). |
| Build fails | Open the failed deployment on Vercel → **Building** tab and check the error. Often: missing env var or wrong `DATABASE_URL`. |
| “Database connection” / Prisma errors | Use the **pooled** URL (host has `-pooler`). Add `?sslmode=require` at the end if missing. |
| Login/session not working | Set **`NEXTAUTH_URL`** to the **exact** Vercel URL (with `https://`) and **redeploy**. |
| 404 or wrong routes | Root directory must be **`.`**; Framework must be **Next.js**. |

---

## Summary

1. Import **Habit-Loop** from GitHub into a new Vercel project.
2. Add **`DATABASE_URL`**, **`NEXTAUTH_SECRET`**, **`NEXTAUTH_URL`**.
3. Deploy, then set **`NEXTAUTH_URL`** to the real URL and redeploy if needed.
4. (Optional) Run **`npm run db:seed`** locally with production **`DATABASE_URL`** for demo accounts.

Your app will be live at `https://<your-project>.vercel.app`.
