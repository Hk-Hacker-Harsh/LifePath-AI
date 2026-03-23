# How to Run LifePath AI

## The problem you were hitting
`ECONNREFUSED` means the frontend was running but the **backend was NOT running**.
You need to run BOTH at the same time — backend first, then frontend.

---

## Quickest way — One script runs both

### On Windows:
Double-click `start.bat`  
OR in terminal:
```
start.bat
```

### On Mac/Linux:
```bash
chmod +x start.sh
./start.sh
```

This automatically:
1. Installs all dependencies
2. Starts the backend (port 5000) in a separate window
3. Starts the frontend (port 3000)

Then open: **http://localhost:3000**

---

## Manual way — Two terminals

### Terminal 1 — Backend (run this FIRST)
```bash
cd backend
npm install
node src/index.js
```

You should see:
```
✅ Database tables ready
🚀 LifePath AI backend running on port 5000
```

### Terminal 2 — Frontend (run this AFTER backend is ready)
```bash
cd frontend
npm install
npm run dev
```

Then open: **http://localhost:3000**

---

## Your .env is already configured

Your `backend/.env` has:
- ✅ Azure PostgreSQL connected (`hackjklu.postgres.database.azure.com`)
- ✅ JWT secret set
- ⚠️  SMTP (email) — still needs your Gmail details (see below)

---

## Email verification (SMTP setup)

The app works in **dev mode without email** — users are auto-verified on signup.

To enable real email verification for production, update `backend/.env`:
```env
SMTP_USER=your@gmail.com
SMTP_PASS=your_16_char_app_password   ← NOT your Gmail password
NODE_ENV=production
```

**How to get Gmail App Password:**
1. Go to myaccount.google.com
2. Security → 2-Step Verification (must be ON)
3. App Passwords → Select app: Mail → Generate
4. Copy the 16-character password → paste as SMTP_PASS

---

## Test the backend is working

Open in browser or run:
```bash
curl http://localhost:5000/health
```
Should return: `{"status":"ok"}`

---

## Common errors

| Error | Fix |
|-------|-----|
| `ECONNREFUSED` on port 5000 | Backend not running — start it first |
| `database "lifepath" does not exist` | Create the DB: connect to Azure PostgreSQL and run `CREATE DATABASE lifepath;` |
| `password authentication failed` | Check DB_USER and DB_PASSWORD in `.env` |
| `SSL required` | Make sure `DB_SSL=true` in `.env` |
