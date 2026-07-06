# SkillForge — AI-Powered Skill-Based Hiring Platform

A production-ready, full-stack hiring platform inspired by PlaceMux. Features AI proctoring, dynamic assessments, real-time analytics, and a premium UI.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure Environment

Edit `server/.env`:
```
MONGO_URI=mongodb://localhost:27017/skillforge
JWT_SECRET=your-secret-key
```

### 3. Seed the Database

```bash
cd server && npm run seed
```
This creates 5 domains, 50 MCQ questions, and a default admin account.

**Default Admin:** `admin@skillforge.com` / `Admin@123`

### 4. Start Both Servers

```bash
# Terminal 1 — Start Express API
cd server && npm run dev

# Terminal 2 — Start React client
cd client && npm run dev
```

Open: **http://localhost:5173**

---

## 🏗️ Architecture

```
├── client/          React 18 + Vite + Tailwind CSS + Framer Motion
│   ├── src/
│   │   ├── pages/           10 full pages
│   │   ├── components/      50+ reusable components
│   │   ├── context/         Auth + Theme contexts
│   │   ├── hooks/           Custom hooks
│   │   ├── services/        Axios API service
│   │   └── utils/           Formatters, validators, constants
└── server/          Express + MongoDB + JWT
    ├── models/      7 Mongoose models
    ├── controllers/ 5 controllers
    ├── routes/      4 route groups
    ├── middleware/  Auth + error handling
    └── utils/       Token generation + seed data
```

---

## 🌟 Features

- **Premium Landing Page** — Hero, stats, features, FAQ, testimonials
- **Secure Auth** — JWT login/register, forgot password
- **Profile Setup** — Multi-step wizard (personal, education, skills, links)
- **Domain Selection** — 5 domains with 3D tilt animated cards
- **Assessment Engine** — 20 randomized MCQs, timer, palette, auto-save
- **AI Proctoring** — Webcam monitoring, tab/focus detection, violation logging
- **Results Dashboard** — Charts, strength/weakness analysis, recommendations
- **User Dashboard** — History, leaderboard, skill analytics
- **Admin Panel** — Question CRUD, user management, analytics

---

## 🎨 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS v3, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Charts | Recharts |
| Forms | React Hook Form |
| Notifications | React Hot Toast |
| Icons | Lucide React |

---

## 📡 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/users/profile` | Update profile |
| GET | `/api/users/stats` | User statistics |
| GET | `/api/users/leaderboard` | Leaderboard |
| GET | `/api/assessments/domains` | List domains |
| POST | `/api/assessments/start` | Start assessment |
| POST | `/api/assessments/:id/submit` | Submit assessment |
| GET | `/api/assessments/results/:id` | Get result |
| GET | `/api/admin/stats` | Admin statistics |
| GET/POST/PUT/DELETE | `/api/admin/questions` | Question management |
| GET | `/api/admin/users` | User management |

---

## 🔐 Security Features

- Helmet.js security headers
- CORS configuration
- JWT-based stateless auth
- Password hashing with bcrypt (12 rounds)
- Protected routes (client + server)
- Admin role-based access control

---

*Built with ❤️ using the SkillForge platform*
