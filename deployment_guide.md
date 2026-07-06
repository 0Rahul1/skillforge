# SkillForge — Deployment Guide

This guide explains how to deploy the SkillForge Technical Hiring Platform (Frontend + Backend) for free.

---

## Part 1: Deploying the Backend (Node.js & Express) to Render

Render is a great platform to host Node.js backends for free.

### Step 1: Create a Free MongoDB Database
The backend requires a MongoDB database. You can get a free one on MongoDB Atlas:
1. Sign up on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free M0 cluster.
3. In **Database Access**, create a user and password.
4. In **Network Access**, add IP `0.0.0.0/0` (allow access from anywhere).
5. Go to Database -> Connect -> Drivers, and copy the **connection string** (looks like `mongodb+srv://username:password@cluster...mongodb.net/?retryWrites=true&w=majority`). Replace `<password>` with your database user password.

### Step 2: Deploy Backend on Render
1. Go to [Render](https://render.com) and log in with your GitHub account.
2. Click **New +** -> **Web Service**.
3. Select your `0Rahul1/skillforge` repository.
4. Configure the service:
   - **Name**: `skillforge-backend`
   - **Region**: Choose closest to you
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
5. Click **Advanced** and add these Environment Variables:
   - `PORT` = `10000`
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `choose_any_random_secure_string`
   - `MONGO_URI` = `your_mongodb_atlas_connection_string` (from Step 1)
6. Click **Create Web Service**. Render will build and deploy the backend. Copy your backend URL (e.g. `https://skillforge-backend.onrender.com`).

---

## Part 2: Deploying the Frontend (React & Vite) to Vercel

Vercel is the best platform to host React frontends for free.

### Step 1: Deploy Frontend on Vercel
1. Go to [Vercel](https://vercel.com) and log in with your GitHub account.
2. Click **Add New** -> **Project**.
3. Import your `0Rahul1/skillforge` repository.
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Environment Variables** and add:
   - `VITE_API_URL` = `https://your-backend-render-url.onrender.com/api` (e.g. your Render backend URL with `/api` appended at the end)
6. Click **Deploy**. Vercel will build your React frontend and give you a live production link (e.g., `https://skillforge.vercel.app`)!

---

## Part 3: Update CORS (If needed)
Once your frontend is deployed, ensure that the backend allows requests from your new Vercel domain. In `server/server.js`, we have already allowed origins dynamically. If you face CORS issues, make sure the Vercel URL is added to the backend CORS allowed origins list.
