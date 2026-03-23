# LifePath AI v2 — Azure VM + PostgreSQL Setup Guide

## Architecture

```
Azure VM
├── backend/        → Node.js + Express (port 5000)
│   ├── JWT auth
│   ├── PostgreSQL queries
│   └── Email verification via SMTP
├── frontend/       → React + Vite (port 3000)
│   └── Calls backend at /api/*
└── ecosystem.config.js → PM2 (keeps both running)

Azure PostgreSQL (separate managed service)
└── Tables: users, profiles, decisions, feelings
```

---

## Step 1 — Provision Azure PostgreSQL

1. Azure Portal → **Create a resource** → **Azure Database for PostgreSQL**
2. Choose **Flexible Server** (cheaper)
3. Set:
   - Server name: `lifepath-db`
   - Admin username: `lifepath_admin`
   - Password: (save this)
   - Region: same as your VM
4. Under **Networking** → Add your VM's IP to the firewall allowlist
5. Once created, note the **Server name** (e.g. `lifepath-db.postgres.database.azure.com`)
6. Create a database named `lifepath`:
   ```sql
   CREATE DATABASE lifepath;
   ```

---

## Step 2 — Set up the Azure VM

SSH into your VM, then:

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Clone or upload your project
# (use scp, git, or Azure File Share)
cd /home/azureuser
# Upload the lifepath-v2 folder here
```

---

## Step 3 — Configure the backend

```bash
cd /home/azureuser/lifepath-v2/backend
cp .env.example .env
nano .env
```

Fill in your `.env`:

```env
DB_HOST=lifepath-db.postgres.database.azure.com
DB_PORT=5432
DB_NAME=lifepath
DB_USER=lifepath_admin
DB_PASSWORD=your_password
DB_SSL=true

JWT_SECRET=generate_a_long_random_string_here_minimum_32_chars
JWT_EXPIRES_IN=7d

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_gmail_app_password
EMAIL_FROM=LifePath AI <your@gmail.com>

PORT=5000
FRONTEND_URL=http://YOUR_VM_IP:3000
NODE_ENV=production
```

> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App Passwords → Generate one for "Mail"

```bash
npm install
```

---

## Step 4 — Configure the frontend

```bash
cd /home/azureuser/lifepath-v2/frontend
npm install
npm run build
```

In production the built files are served by Vite preview (or you can use nginx). The frontend calls `/api/*` which routes to the backend — no extra config needed since they're on the same VM.

---

## Step 5 — Open VM firewall ports

In Azure Portal → Your VM → **Networking** → Add inbound rules:
- Port **3000** (frontend) — Source: Any
- Port **5000** (backend API) — Source: Any (or restrict to VM's internal IP only)

Or use **nginx** as a reverse proxy on port 80 (see Step 7).

---

## Step 6 — Start with PM2

```bash
cd /home/azureuser/lifepath-v2
mkdir -p logs

# Start both processes
pm2 start ecosystem.config.js

# Save so they auto-restart on VM reboot
pm2 save
pm2 startup
# Run the command PM2 prints

# Check status
pm2 status
pm2 logs lifepath-backend
pm2 logs lifepath-frontend
```

---

## Step 7 — (Optional) Nginx reverse proxy on port 80

```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/lifepath
```

```nginx
server {
    listen 80;
    server_name YOUR_VM_IP;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/lifepath /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Now everything runs on port 80 (no port number in URL).

---

## Step 8 — Test the app

Open `http://YOUR_VM_IP` in your browser:

1. **Sign Up** with your email → verification email arrives
2. Click the link in the email → redirected back, now verified
3. **Log In** → profile setup (3 steps: About You, Current Life, Skills)
4. **Home screen** → feeling panel + new decision button
5. **New Decision** → 2 steps → simulation → dashboard
6. **Sidebar → Edit My Profile** → update any profile data
7. **Decision history** → view past simulations, delete them

---

## API Endpoints Reference

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/signup | No | Create account |
| GET | /api/auth/verify?token= | No | Verify email (via link) |
| POST | /api/auth/login | No | Login → returns JWT |
| GET | /api/auth/me | Yes | Get current user |
| POST | /api/auth/resend-verification | No | Resend verify email |
| GET | /api/profile | Yes | Get saved profile |
| POST | /api/profile | Yes | Save / update profile |
| GET | /api/decisions | Yes | Get all decisions |
| POST | /api/decisions | Yes | Save new decision |
| DELETE | /api/decisions/:id | Yes | Delete a decision |
| GET | /api/feelings | Yes | Get feeling check-ins |
| POST | /api/feelings | Yes | Save feeling check-in |
| GET | /health | No | Health check |

---

## Troubleshooting

**Can't connect to PostgreSQL:**
- Check VM IP is in PostgreSQL firewall allowlist
- Verify `DB_SSL=true` (Azure PostgreSQL requires SSL)
- Test: `psql "host=your-server.postgres.database.azure.com port=5432 dbname=lifepath user=your_user sslmode=require"`

**Email not sending:**
- For Gmail, make sure you're using an **App Password**, not your main password
- Check `pm2 logs lifepath-backend` for SMTP errors

**Frontend can't reach backend:**
- In dev: Vite proxy handles `/api` → `localhost:5000`
- In prod: both run on same VM, `/api` calls hit nginx which proxies to port 5000
