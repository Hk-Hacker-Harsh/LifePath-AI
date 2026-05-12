# LifePath AI 🚀

An intelligent life-planning companion that helps users simulate and analyze major life decisions using AI-powered analytics and feeling tracking.


## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Configuration](#environment-configuration)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 📖 Overview

**LifePath AI** is a full-stack web application that empowers users to make informed life decisions by:
- Creating personalized profiles with life context
- Simulating multiple decision scenarios with AI analysis
- Tracking emotional responses and feelings over time
- Visualizing decision outcomes and patterns
- Revisiting and comparing past decisions

Perfect for career transitions, education choices, relationship decisions, and major life changes.

---

## ✨ Features

### Core Features
- **User Authentication** - Secure JWT-based auth with email verification
- **Profile Management** - Multi-step profile setup (About You, Current Life, Skills)
- **Decision Simulation** - Two-step decision entry with AI-powered simulation results
- **Feeling Tracker** - Log emotional check-ins after decisions
- **Decision History** - View, compare, and delete past simulations
- **Interactive Dashboard** - Visualize decision outcomes with Recharts

### Technical Highlights
- Real-time data persistence with PostgreSQL
- Responsive React UI with Vite
- Secure API with CORS and JWT middleware
- Email verification via SMTP (Gmail support)
- Production-ready deployment with PM2

---

## 🛠 Tech Stack

### Backend
- **Node.js** (v20+) - JavaScript runtime
- **Express.js** - REST API framework
- **PostgreSQL** - Relational database (Azure PostgreSQL)
- **JWT (jsonwebtoken)** - Authentication & authorization
- **Bcryptjs** - Password hashing
- **Nodemailer** - Email notifications
- **PM2** - Process management & monitoring

### Frontend
- **React** (v18) - UI library
- **Vite** - Lightning-fast build tool
- **Recharts** - Data visualization
- **Modern CSS** - Responsive design

---

## 📁 Project Structure

```
lifepath-v2/
├── backend/                    # Node.js + Express backend
│   ├── src/
│   │   ├── index.js           # Express app entry point
│   │   ├── db.js              # PostgreSQL setup & initialization
│   │   ├── middleware/
│   │   │   └── auth.js        # JWT authentication middleware
│   │   ├── routes/
│   │   │   ├── auth.js        # Auth endpoints (signup, login, verify)
│   │   │   ├── profile.js     # Profile CRUD endpoints
│   │   │   ├── decisions.js   # Decision simulation & history
│   │   │   └── feelings.js    # Feeling check-in tracking
│   │   └── utils/
│   │       └── email.js       # Email sending logic
│   ├── package.json
│   └── .env                   # Environment variables (don't commit)
│
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx            # Main app component
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable UI components
│   │   └── api/               # API client utilities
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── ecosystem.config.js         # PM2 configuration for production
├── start.sh                    # Quick start script (Mac/Linux)
├── start.bat                   # Quick start script (Windows)
├── HOW-TO-RUN.md              # Quick start guide
├── SETUP.md                    # Detailed deployment guide
└── README.md                   # This file
```

---

## ⚙️ Prerequisites

Before you begin, ensure you have:

- **Node.js** v20.0.0 or higher ([Download](https://nodejs.org/))
- **npm** v9.0.0 or higher (comes with Node.js)
- **PostgreSQL** database (local or cloud-hosted like Azure PostgreSQL)
- **Git** (optional, for cloning)

### For Email Features
- Gmail account with 2-Step Verification enabled
- Gmail App Password (generated from Security settings)

---

## 🚀 Installation

### Option 1: Quick Start (Automated)

#### On Windows:
```bash
start.bat
```

#### On Mac/Linux:
```bash
chmod +x start.sh
./start.sh
```

This script will:
1. Install all dependencies
2. Start the backend on port 5000
3. Start the frontend on port 3000

Then open: **http://localhost:3000**

---

### Option 2: Manual Setup

#### Step 1: Set Up Backend

```bash
cd backend
npm install
```

Create/update `.env` file:
```env
# PostgreSQL Connection
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lifepath
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false

# JWT Configuration
JWT_SECRET=your_super_secret_key_minimum_32_characters_long
JWT_EXPIRES_IN=7d

# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_16_char_app_password
EMAIL_FROM=LifePath AI <your@gmail.com>

# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

Start the backend:
```bash
npm run dev        # Development with auto-reload
# OR
node src/index.js  # Production
```

You should see:
```
✅ Database tables ready
🚀 LifePath AI backend running on port 5000
```

#### Step 2: Set Up Frontend

In a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Open your browser to: **http://localhost:3000**

---

## 🏃 Running the Application

### Development Mode

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### Production Mode

```bash
# Install PM2 globally
npm install -g pm2

# Start both services
pm2 start ecosystem.config.js

# Save configuration
pm2 save
pm2 startup
```

Monitor:
```bash
pm2 status
pm2 logs lifepath-backend
pm2 logs lifepath-frontend
```

---

## 🔐 Environment Configuration

### Backend `.env` Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | Database hostname | `localhost` or `myserver.postgres.database.azure.com` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `lifepath` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `your_secret_password` |
| `DB_SSL` | Use SSL connection | `true` (Azure) or `false` (local) |
| `JWT_SECRET` | Secret key for JWT signing | `min 32 characters random string` |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `SMTP_HOST` | Email server host | `smtp.gmail.com` |
| `SMTP_PORT` | Email server port | `587` |
| `SMTP_USER` | Email sender address | `your@gmail.com` |
| `SMTP_PASS` | Email app password | `16-character Gmail app password` |
| `EMAIL_FROM` | From address for emails | `LifePath AI <your@gmail.com>` |
| `PORT` | Backend server port | `5000` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `NODE_ENV` | Environment mode | `development` or `production` |

### Getting Gmail App Password

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security → 2-Step Verification (must be enabled)
3. App Passwords → Select app: **Mail**, device: **Windows/Mac/Linux**
4. Google generates a 16-character password → Copy and paste into `SMTP_PASS`

---

## 📡 API Endpoints

### Authentication
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/signup` | ❌ | Create new account |
| POST | `/api/auth/login` | ❌ | Login → returns JWT token |
| GET | `/api/auth/verify?token=...` | ❌ | Verify email (via link) |
| POST | `/api/auth/resend-verification` | ❌ | Resend verification email |
| GET | `/api/auth/me` | ✅ | Get current authenticated user |

### Profile
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/profile` | ✅ | Get user's saved profile |
| POST | `/api/profile` | ✅ | Create/update profile |

### Decisions
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/decisions` | ✅ | Get all user's decisions |
| POST | `/api/decisions` | ✅ | Create new decision with simulation |
| DELETE | `/api/decisions/:id` | ✅ | Delete a decision |

### Feelings
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/feelings` | ✅ | Get all feeling check-ins |
| POST | `/api/feelings` | ✅ | Save new feeling check-in |

### Health
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/health` | ❌ | Backend health check |

---

## 🗄️ Database Schema

### Tables

**users**
```sql
id (UUID) | email | password_hash | verified (bool) | created_at
```

**profiles**
```sql
id (UUID) | user_id | about_you | current_life | skills | updated_at
```

**decisions**
```sql
id (UUID) | user_id | title | description | outcome | created_at
```

**feelings**
```sql
id (UUID) | user_id | mood (1-10) | notes | created_at
```

All tables are auto-created on first backend startup.

---

## 🚢 Deployment

### To Azure VM

See **SETUP.md** for detailed Azure deployment instructions, including:
- Provisioning Azure PostgreSQL
- Setting up Azure VM
- Configuring environment variables
- Using PM2 for process management
- Optional: Setting up Nginx reverse proxy on port 80

### Quick Deployment Steps:

1. **Provision Azure PostgreSQL & VM**
2. **SSH into VM and install Node.js 20**
3. **Upload project files**
4. **Configure `.env` with Azure database credentials**
5. **Run: `pm2 start ecosystem.config.js`**
6. **Save PM2 config: `pm2 save && pm2 startup`**
7. **Access via: `http://YOUR_VM_IP:3000` or `http://YOUR_VM_IP` (with Nginx)**

---

## 🐛 Troubleshooting

### ECONNREFUSED on port 5000
**Problem:** Frontend connects to backend but fails  
**Solution:** Make sure backend is running first
```bash
# Terminal 1: Start backend FIRST
cd backend && node src/index.js

# Terminal 2: Only then start frontend
cd frontend && npm run dev
```

### Database connection errors
**Problem:** `password authentication failed` or `database does not exist`  
**Solution:**
1. Verify credentials in `.env` match your database
2. Create the database if it doesn't exist:
   ```sql
   CREATE DATABASE lifepath;
   ```
3. For Azure: Add your VM's IP to PostgreSQL firewall
4. Ensure `DB_SSL=true` for Azure PostgreSQL

### Email not sending
**Problem:** Verification emails don't arrive  
**Causes & Fixes:**
- Are you using Gmail? Must generate **App Password** (not regular password)
- Check logs: `pm2 logs lifepath-backend | grep SMTP`
- In dev mode, emails are logged but not actually sent
- For testing: `NODE_ENV=development` auto-verifies users

### Frontend can't connect to backend API
**Problem:** `/api/` calls fail in production  
**Solution:**
- Dev mode: Vite proxy automatically forwards `/api` → `localhost:5000`
- Production: Use Nginx (see SETUP.md Step 7) or ensure CORS is configured correctly
- Check: `FRONTEND_URL` in `.env` must match actual frontend URL

### Port already in use
**Problem:** Port 3000 or 5000 is already taken  
**Solution:**
```bash
# Kill process on port 5000 (Linux/Mac)
lsof -ti:5000 | xargs kill -9

# Or change the port in .env
PORT=5001
```

### Vite build errors
**Problem:** `npm run build` fails  
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 🤝 Contributing

We welcome contributions! Please:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style
- Test locally before submitting PR
- Update documentation if needed
- Use meaningful commit messages

---

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## 🆘 Support

- Check [HOW-TO-RUN.md](./HOW-TO-RUN.md) for quick fixes
- See [SETUP.md](./SETUP.md) for deployment details
- Open an issue on GitHub for bugs
- Include error messages and environment info in issues

---

## 🎯 Roadmap

- [ ] AI decision recommendations using ML models
- [ ] Social features (share decisions, get feedback)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics & reporting
- [ ] Integration with calendar & task managers
- [ ] Dark mode UI theme

---

## 👨‍💻 Authors & Acknowledgments

**LifePath AI** - Built with ❤️ for better life decisions

Special thanks to:
- Azure & Microsoft for cloud services
- React, Node.js, and PostgreSQL communities

---

**Last Updated:** March 2025  
**Version:** 2.0.0
