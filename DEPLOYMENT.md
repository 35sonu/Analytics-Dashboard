# Deployment Guide

## Prerequisites
- Vercel account (free): https://vercel.com
- Render account (free): https://render.com
- PostgreSQL database (use Vercel Postgres or Neon)

---

## Part 1: Deploy Database (PostgreSQL)

### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel Dashboard
2. Create a new Postgres database
3. Copy the `DATABASE_URL` connection string

### Option B: Neon (Alternative)
1. Go to https://neon.tech
2. Create free PostgreSQL database
3. Copy the connection string

---

## Part 2: Deploy Backend API (Vercel)

### Step 1: Prepare Repository
```bash
cd d:\AdobeDC\project
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Push to GitHub
1. Create a new repository on GitHub
2. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/analytics-dashboard.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy Backend on Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `apps/api`
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Add Environment Variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NODE_ENV`: `production`
   - `PORT`: `3001`

5. Click **Deploy**
6. Copy the deployment URL (e.g., `https://your-api.vercel.app`)

---

## Part 3: Deploy Frontend (Vercel)

### Step 1: Deploy Frontend on Vercel
1. Go to https://vercel.com/new
2. Import the same GitHub repository
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

4. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL from Part 2

5. Click **Deploy**
6. Your frontend will be live at `https://your-app.vercel.app`

---

## Part 4: Deploy Vanna AI Service (Render)

### Step 1: Create Web Service on Render
1. Go to https://render.com/dashboard
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `vanna-ai-service`
   - **Root Directory**: `services/vanna`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Step 2: Add Environment Variables
1. In Render dashboard, go to **Environment** tab
2. Add variables:
   - `DATABASE_URL`: Same PostgreSQL connection string
   - `GROQ_API_KEY`: Your Groq API key from https://console.groq.com
   - `PORT`: `8000`
   - `MODEL_NAME`: `llama-3.3-70b-versatile`

### Step 3: Deploy
1. Click **Create Web Service**
2. Wait for deployment to complete
3. Copy the service URL (e.g., `https://vanna-ai-service.onrender.com`)

---

## Part 5: Connect Services

### Update Frontend to Use Vanna AI
1. Go to Vercel Dashboard → Your Frontend Project
2. Add environment variable:
   - `NEXT_PUBLIC_VANNA_URL`: Your Render service URL
3. Redeploy frontend

### Update Backend API URL in Frontend
Edit `apps/web/src/lib/api.ts`:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const VANNA_URL = process.env.NEXT_PUBLIC_VANNA_URL || 'http://localhost:8000';
```

Commit and push changes - Vercel will auto-deploy.

---

## Part 6: Initialize Database

### Run Database Migration
1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Link to your API project:
```bash
cd apps/api
vercel link
```

3. Run Prisma commands:
```bash
vercel env pull .env.production
npx prisma db push --schema=./prisma/schema.prisma
```

---

## Verification

### Test Endpoints
1. **Frontend**: Visit your Vercel frontend URL
2. **Backend API**: Test `https://your-api.vercel.app/api/stats`
3. **Vanna AI**: Test `https://vanna-ai-service.onrender.com/health`

### Check Chat with Data
1. Open your deployed frontend
2. Click "Chat with Data"
3. Ask: "What's the total spend?"
4. Should see SQL + results

---

## Troubleshooting

### Frontend Build Fails
- Check environment variables are set
- Verify `NEXT_PUBLIC_API_URL` is correct

### Backend API Errors
- Check `DATABASE_URL` is correct
- Verify Prisma schema is pushed
- Check logs in Vercel dashboard

### Vanna AI 500 Errors
- Verify `GROQ_API_KEY` is set
- Check `DATABASE_URL` format
- View logs in Render dashboard

### CORS Issues
Backend already has CORS enabled. If issues persist, add your frontend domain to allowed origins in `apps/api/src/index.ts`.

---

## Costs

All services can run on **FREE TIERS**:
- ✅ Vercel: Free (hobby plan)
- ✅ Render: Free (limited hours, enough for demos)
- ✅ Neon/Vercel Postgres: Free tier available
- ✅ Groq API: Free tier with generous limits

---

## Next Steps

1. Set up custom domain (optional)
2. Enable analytics in Vercel
3. Set up monitoring/logging
4. Configure CI/CD pipelines

Your full-stack analytics dashboard is now live! 🚀
