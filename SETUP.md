# LifePath AI v2 — Setup Guide

## What's new in v2
- ✅ Email login / signup with verification (Supabase Auth)
- ✅ New user → Profile setup (name, job, city, skills — once)
- ✅ Home screen with feeling check-in panel
- ✅ New Decision button → simulate without re-entering profile
- ✅ Full decision history with view / delete
- ✅ Edit My Profile in sidebar
- ✅ All data saved to localStorage per user

---

## Step 1 — Create a Supabase project (free)

1. Go to **https://supabase.com** → Sign Up (free)
2. Click **New Project** → give it a name, set a DB password, choose a region
3. Wait ~2 minutes for it to provision
4. Go to **Settings → API**
5. Copy:
   - **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

---

## Step 2 — Paste keys into the app

Open `src/lib/supabase.js` and replace:

```js
const SUPABASE_URL  = 'https://YOUR_PROJECT.supabase.co'   // ← paste Project URL
const SUPABASE_ANON = 'YOUR_ANON_KEY'                       // ← paste anon key
```

---

## Step 3 — Configure Supabase Auth

In your Supabase dashboard:
1. Go to **Authentication → URL Configuration**
2. Set **Site URL** to: `http://localhost:3000`
3. Add to **Redirect URLs**: `http://localhost:3000`

Email verification is **on by default** — users get an email before they can log in.

---

## Step 4 — Install and run

```bash
npm install
npm run dev
```

Open **http://localhost:3000**

---

## How the app works

| Screen | When shown |
|---|---|
| Login / Signup | First visit, or after sign out |
| Email verification | After signup — user clicks link in email |
| Profile Setup (3 steps) | First login only — saves name, job, city, skills |
| Home | Every login — feeling panel + decision history |
| New Decision | 2 steps only (decision text + risk/funding) — uses saved profile |
| Dashboard | Results — 6 tabs, AI advisor, all 3 futures |
| Edit Profile | Sidebar → "Edit My Profile" — update any profile data |

---

## Data storage

All decision data is stored in **localStorage** keyed by user ID:
- `lifepath_profile_{uid}` — profile (name, job, salary, skills)
- `lifepath_decisions_{uid}` — array of past simulations
- `lifepath_feelings_{uid}` — feeling check-ins

Supabase is used **only for authentication** (login/signup/email verification). No data is sent to Supabase.
