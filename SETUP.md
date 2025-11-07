# Setup Guide

This guide will walk you through setting up the Analytics Dashboard application from scratch.

## Prerequisites Check

Before starting, ensure you have:

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Check Python version (should be 3.11+)
python --version

# Check PostgreSQL (if running locally)
psql --version

# Check Docker (optional)
docker --version
docker-compose --version
```

## Step-by-Step Setup

### 1. Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd analytics-dashboard

# Install root dependencies
npm install
```

### 2. Database Setup

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL in Docker
docker run -d \
  --name analytics_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=analytics_db \
  -p 5432:5432 \
  postgres:15-alpine

# Verify it's running
docker ps | grep analytics_db
```

#### Option B: Local PostgreSQL

```bash
# Install PostgreSQL 15
# On macOS:
brew install postgresql@15

# On Ubuntu:
sudo apt-get install postgresql-15

# Create database
createdb analytics_db
```

### 3. Environment Configuration

```bash
# Copy example environment file
cp .env.example .env

# Edit .env file with your settings
nano .env  # or use your preferred editor
```

Required environment variables:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/analytics_db?schema=public
GROQ_API_KEY=gsk_...  # Get from https://console.groq.com
VANNA_API_BASE_URL=http://localhost:8000
PORT=3001
NODE_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Backend Setup

```bash
cd apps/api

# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:push

# Verify connection
npx prisma studio  # Opens database GUI at http://localhost:5555
```

### 5. Seed Database with Data

#### Option A: Using provided Analytics_Test_Data.json

```bash
# Place your Analytics_Test_Data.json file in the data/ directory
# Then run:
cd apps/api
npm run db:seed
```

#### Option B: Using sample data (if no JSON file available)

The seed script will automatically generate 100 sample invoices if no data file is found.

```bash
cd apps/api
npm run db:seed
```

### 6. Frontend Setup

```bash
cd apps/web

# Install dependencies
npm install

# Verify configuration
cat .env.local
```

### 7. Vanna AI Service Setup

```bash
cd services/vanna

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env .env.local
# Edit with your GROQ_API_KEY

# Train the model
python train.py

# This will take a few minutes on first run
```

### 8. Start All Services

Open 4 separate terminal windows:

**Terminal 1: Backend API**
```bash
cd apps/api
npm run dev
```
✅ Should see: "Server is running at http://localhost:3001"

**Terminal 2: Vanna AI Service**
```bash
cd services/vanna
source venv/bin/activate  # if using venv
python main.py
```
✅ Should see: "Uvicorn running on http://0.0.0.0:8000"

**Terminal 3: Frontend**
```bash
cd apps/web
npm run dev
```
✅ Should see: "Local: http://localhost:3000"

**Terminal 4: Database (if using Docker)**
```bash
# Already running from Step 2
docker logs -f analytics_db
```

### 9. Verify Installation

Open your browser and test each service:

1. **Frontend**: http://localhost:3000
   - Should see the dashboard with tabs
   - Click "Analytics" tab - should load cards and charts
   - Click "Chat with Data" tab - should see chat interface

2. **Backend API**: http://localhost:3001/health
   - Should return: `{"status": "ok", "timestamp": "..."}`

3. **Vanna AI**: http://localhost:8000/health
   - Should return: `{"status": "healthy"}`

4. **Database**: 
   ```bash
   npx prisma studio
   ```
   - Opens at http://localhost:5555
   - Should see tables: Invoice, Vendor, Customer, LineItem, Payment

### 10. Test Features

#### Test Analytics Dashboard:
1. Navigate to http://localhost:3000
2. Verify all 4 overview cards display numbers
3. Verify all 4 charts render
4. Verify invoices table loads
5. Try searching in the invoices table
6. Try pagination buttons

#### Test Chat with Data:
1. Click "Chat with Data" tab
2. Type: "What's the total spend?"
3. Press Enter or click Send
4. Should see:
   - Generated SQL query
   - Results in a table
5. Try other example queries

## Common Issues & Solutions

### Issue: Port already in use

```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Issue: Database connection failed

```bash
# Check if PostgreSQL is running
docker ps | grep postgres  # If using Docker
pg_isready  # If local PostgreSQL

# Check DATABASE_URL in .env file
echo $DATABASE_URL

# Test connection
cd apps/api
npx prisma db pull
```

### Issue: Prisma client not generated

```bash
cd apps/api
npm run db:generate
```

### Issue: Vanna AI not responding

```bash
# Check if service is running
curl http://localhost:8000/health

# Check logs for errors
# Look for GROQ_API_KEY issues

# Verify API key is set
echo $GROQ_API_KEY

# Restart service
cd services/vanna
python main.py
```

### Issue: Charts not displaying

```bash
# Check browser console for errors
# Verify API endpoints return data:

curl http://localhost:3001/api/stats
curl http://localhost:3001/api/invoice-trends
curl http://localhost:3001/api/vendors/top10
```

### Issue: No data in database

```bash
cd apps/api
npm run db:seed
```

## Docker Compose Setup (Alternative)

For a simpler setup, use Docker Compose:

```bash
# Make sure GROQ_API_KEY is set
export GROQ_API_KEY=gsk_...

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Next Steps

- Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Review [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines

## Getting Help

If you encounter issues:

1. Check the logs in each terminal window
2. Review error messages carefully
3. Verify all environment variables are set
4. Ensure all services are running
5. Check the [Troubleshooting](#common-issues--solutions) section above

For additional support, create an issue in the repository.
