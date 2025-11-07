# 🚀 Quick Start Guide

Get the Analytics Dashboard running in 5 minutes!

## Prerequisites

- ✅ Node.js 18+ ([Download](https://nodejs.org))
- ✅ Python 3.11+ ([Download](https://python.org))
- ✅ PostgreSQL or Docker ([Docker Download](https://docker.com))
- ✅ Groq API Key ([Get Free Key](https://console.groq.com))

## Step 1: Clone & Install (2 min)

```bash
# Clone the repository
git clone <your-repo-url>
cd analytics-dashboard

# Run automated setup (Windows)
powershell -ExecutionPolicy Bypass -File setup.ps1

# OR run automated setup (Mac/Linux)
chmod +x setup.sh
./setup.sh
```

This will:
- Install all dependencies
- Create .env files
- Start PostgreSQL in Docker
- Create database schema
- Seed with sample data

## Step 2: Add Groq API Key (1 min)

Get your free API key from [https://console.groq.com](https://console.groq.com)

Edit these files and add your key:
```bash
# .env
GROQ_API_KEY=gsk_your_key_here

# services/vanna/.env
GROQ_API_KEY=gsk_your_key_here
```

## Step 3: Start Services (1 min)

Open 3 terminal windows:

**Terminal 1: Backend API**
```bash
cd apps/api
npm run dev
```
✅ Running at http://localhost:3001

**Terminal 2: Vanna AI**
```bash
cd services/vanna
python main.py
```
✅ Running at http://localhost:8000

**Terminal 3: Frontend**
```bash
cd apps/web
npm run dev
```
✅ Running at http://localhost:3000

## Step 4: Open Browser (10 sec)

Navigate to: **http://localhost:3000**

You should see:
- ✅ Analytics Dashboard tab with 4 overview cards
- ✅ 4 interactive charts
- ✅ Invoices table
- ✅ Chat with Data tab

## Test the Features

### Test Dashboard:
1. View the overview cards (Total Spend, Invoices, etc.)
2. Scroll down to see charts
3. Search in the invoices table
4. Click pagination buttons

### Test Chat:
1. Click "Chat with Data" tab
2. Type: **"What's the total spend?"**
3. Press Enter
4. See generated SQL and results!

## Alternative: Docker Compose (All-in-One)

```bash
# Set your Groq API key
export GROQ_API_KEY=gsk_your_key_here

# Start everything
docker-compose up -d

# Open browser
open http://localhost:3000
```

## Troubleshooting

### Port Already in Use?
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Database Connection Failed?
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart database
docker start analytics_db
```

### Vanna AI Not Responding?
```bash
# Check API key is set
echo $GROQ_API_KEY

# Check service is running
curl http://localhost:8000/health
```

### No Data Showing?
```bash
# Reseed database
cd apps/api
npm run db:seed
```

## Using Your Own Data

Replace the sample data with your actual `Analytics_Test_Data.json`:

```bash
# 1. Place your JSON file
cp /path/to/your/Analytics_Test_Data.json data/

# 2. Clear and reseed database
cd apps/api
npm run db:seed
```

The JSON should follow this format:
```json
[
  {
    "invoice_number": "INV-00001",
    "invoice_date": "2024-01-15",
    "due_date": "2024-02-15",
    "total_amount": 5000.00,
    "status": "paid",
    "category": "Software",
    "vendor": {
      "name": "Acme Corp",
      "email": "billing@acme.com"
    },
    "line_items": [...],
    "payments": [...]
  }
]
```

## Next Steps

- 📚 Read [README.md](./README.md) for full documentation
- 🔧 Read [SETUP.md](./SETUP.md) for detailed setup
- 📡 Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API reference
- 🚀 Deploy to production (see README.md)

## Example Chat Queries

Try these in the Chat with Data interface:

- "What's the total spend in the last 90 days?"
- "List top 5 vendors by spend"
- "Show overdue invoices as of today"
- "What's the average invoice value?"
- "How many invoices were paid in January?"
- "Show me all invoices for Acme Corp"
- "What categories have the highest spend?"

## Need Help?

1. Check logs in each terminal
2. Read [SETUP.md](./SETUP.md) troubleshooting section
3. Verify all environment variables are set
4. Ensure all 3 services are running
5. Check browser console for errors

## Production Deployment

See [README.md](./README.md#-deployment) for:
- Vercel deployment (Frontend + API)
- Render/Railway deployment (Vanna AI)
- Database hosting options
- Environment variable configuration

---

**Time to First Working App**: ~5 minutes

**Congratulations!** 🎉 You now have a fully functional analytics dashboard with AI-powered insights!
