# Analytics Dashboard - Production-Grade Full-Stack Application

A comprehensive analytics dashboard with AI-powered natural language querying capabilities, built with Next.js, Express.js, PostgreSQL, and Vanna AI.

![Dashboard Screenshot](docs/dashboard-preview.png)

## 🎯 Project Overview

This application consists of three main components:

1. **Interactive Analytics Dashboard** - Real-time visualization of invoice and vendor data
2. **Chat with Data** - AI-powered natural language interface for data analytics
3. **RESTful API Backend** - Express.js API with PostgreSQL database

## 🚀 Features

### Analytics Dashboard
- ✅ **Overview Cards**: Total Spend (YTD), Total Invoices, Documents Uploaded, Average Invoice Value
- ✅ **Interactive Charts**: 
  - Invoice Volume & Value Trend (Line Chart)
  - Spend by Vendor (Top 10, Horizontal Bar Chart)
  - Spend by Category (Pie Chart)
  - Cash Outflow Forecast (Bar Chart)
- ✅ **Invoices Table**: Searchable, sortable, and paginated table
- ✅ **Real-time Data**: All metrics fetched dynamically from backend APIs

### Chat with Data
- ✅ Natural language querying powered by Vanna AI + Groq LLM
- ✅ SQL generation and execution
- ✅ Results displayed in formatted tables
- ✅ Example queries for quick start
- ✅ Error handling and validation

## 🏗️ Architecture

```
analytics-dashboard/
├── apps/
│   ├── web/              # Next.js frontend (TypeScript + Tailwind + shadcn/ui)
│   └── api/              # Express.js backend (TypeScript + Prisma)
├── services/
│   └── vanna/            # Vanna AI service (Python + FastAPI)
├── data/
│   └── Analytics_Test_Data.json
└── docker-compose.yml
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: shadcn/ui + TailwindCSS
- **Charts**: Recharts
- **State Management**: React Hooks
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **API Style**: REST

### AI Layer
- **Framework**: FastAPI (Python)
- **AI Library**: Vanna AI
- **LLM Provider**: Groq (Mixtral-8x7b-32768)
- **Database Connector**: SQLAlchemy + psycopg2

### DevOps
- **Monorepo**: Turborepo
- **Containerization**: Docker + Docker Compose
- **Deployment**: Vercel (Frontend + API), Render/Railway (Vanna AI)

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- PostgreSQL 15+
- Docker & Docker Compose (optional, for containerized setup)
- Groq API Key ([Get one here](https://console.groq.com))

## 🚀 Quick Start

### Option 1: Local Development (Recommended for Development)

#### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd analytics-dashboard
```

#### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd apps/web
npm install

# Install backend dependencies
cd ../api
npm install

# Install Python dependencies
cd ../../services/vanna
pip install -r requirements.txt
```

#### 3. Set Up Environment Variables
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your values
# Required: DATABASE_URL, GROQ_API_KEY
```

#### 4. Set Up Database
```bash
cd apps/api

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:push

# Seed database with sample data
npm run db:seed
```

#### 5. Start Services

**Terminal 1 - Database (if not using Docker)**
```bash
# Start PostgreSQL locally or use Docker
docker run -d \
  --name analytics_db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=analytics_db \
  -p 5432:5432 \
  postgres:15-alpine
```

**Terminal 2 - Backend API**
```bash
cd apps/api
npm run dev
# API running on http://localhost:3001
```

**Terminal 3 - Vanna AI Service**
```bash
cd services/vanna

# Train the model (first time only)
python train.py

# Start the service
python main.py
# Vanna AI running on http://localhost:8000
```

**Terminal 4 - Frontend**
```bash
cd apps/web
npm run dev
# Frontend running on http://localhost:3000
```

### Option 2: Docker Compose (Recommended for Production-like Setup)

```bash
# Set GROQ_API_KEY in .env file first
export GROQ_API_KEY=your_groq_api_key

# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Vanna AI: http://localhost:8000
- Database: localhost:5432

## 📊 Database Schema

### Entity Relationship Diagram

```
┌─────────────┐       ┌──────────────┐       ┌──────────────┐
│   Vendor    │       │   Invoice    │       │   Customer   │
├─────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)     │───┐   │ id (PK)      │   ┌───│ id (PK)      │
│ name        │   └──<│ vendorId FK  │   │   │ name         │
│ email       │       │ customerId FK│>──┘   │ email        │
│ phone       │       │ invoiceNumber│       │ phone        │
│ address     │       │ invoiceDate  │       │ address      │
└─────────────┘       │ dueDate      │       └──────────────┘
                      │ totalAmount  │
                      │ status       │
                      │ category     │
                      └──────────────┘
                            │ │
                    ┌───────┘ └────────┐
                    ▼                  ▼
            ┌─────────────┐    ┌──────────────┐
            │  LineItem   │    │   Payment    │
            ├─────────────┤    ├──────────────┤
            │ id (PK)     │    │ id (PK)      │
            │ invoiceId FK│    │ invoiceId FK │
            │ description │    │ paymentDate  │
            │ quantity    │    │ amount       │
            │ unitPrice   │    │ method       │
            │ amount      │    │ reference    │
            │ category    │    └──────────────┘
            └─────────────┘
```

### Tables

- **Vendor**: Stores vendor information
- **Customer**: Stores customer information
- **Invoice**: Main invoice records with status tracking
- **LineItem**: Individual items within each invoice
- **Payment**: Payment records linked to invoices

## 🔌 API Documentation

### Base URL
- Development: `http://localhost:3001/api`
- Production: `https://your-app.vercel.app/api`

### Endpoints

#### 1. Get Statistics
```http
GET /api/stats
```

**Response**:
```json
{
  "totalSpend": 1234567.89,
  "totalInvoices": 150,
  "documentsUploaded": 145,
  "averageInvoiceValue": 8230.45
}
```

#### 2. Get Invoice Trends
```http
GET /api/invoice-trends
```

**Response**:
```json
[
  {
    "month": "2024-01",
    "count": 25,
    "total": 125000.50
  }
]
```

#### 3. Get Top 10 Vendors
```http
GET /api/vendors/top10
```

**Response**:
```json
[
  {
    "id": "vendor_123",
    "name": "Acme Corp",
    "total": 250000.00,
    "invoiceCount": 45
  }
]
```

#### 4. Get Category Spend
```http
GET /api/invoice-trends/category
```

**Response**:
```json
[
  {
    "category": "Software",
    "total": 150000.00
  }
]
```

#### 5. Get Cash Outflow Forecast
```http
GET /api/invoice-trends/cash-outflow
```

**Response**:
```json
[
  {
    "week": "2024-01-15",
    "total": 45000.00
  }
]
```

#### 6. Get Invoices (with filters)
```http
GET /api/invoices?search=INV&status=paid&page=1&limit=10
```

**Query Parameters**:
- `search`: Search by invoice number or vendor name
- `status`: Filter by status (paid, pending, overdue, partial)
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 50)
- `sortBy`: Sort field (default: invoiceDate)
- `order`: Sort order (asc/desc, default: desc)

**Response**:
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

#### 7. Chat with Data
```http
POST /api/chat-with-data
Content-Type: application/json

{
  "query": "What's the total spend in the last 90 days?"
}
```

**Response**:
```json
{
  "query": "What's the total spend in the last 90 days?",
  "sql": "SELECT SUM(totalAmount) as total FROM Invoice WHERE ...",
  "results": [
    { "total": 450000.00 }
  ],
  "error": null
}
```

## 🚢 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables:
   - `NEXT_PUBLIC_API_BASE_URL`
   - `NEXT_PUBLIC_APP_URL`
4. Deploy

### Backend API (Vercel)

1. Create new Vercel project from `apps/api`
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add environment variables:
   - `DATABASE_URL`
   - `VANNA_API_BASE_URL`
4. Deploy

### Vanna AI Service (Render/Railway/Fly.io)

**Render Example**:
```bash
# Install Render CLI
npm install -g render

# Deploy
cd services/vanna
render deploy
```

**Railway Example**:
```bash
# Install Railway CLI
npm install -g railway

# Deploy
cd services/vanna
railway up
```

### Database (Neon/Supabase/Railway)

Use any PostgreSQL hosting service:
- [Neon](https://neon.tech) - Serverless PostgreSQL
- [Supabase](https://supabase.com) - PostgreSQL + extras
- [Railway](https://railway.app) - Full-stack hosting

## 🧪 Testing

### Run Tests
```bash
# Frontend tests
cd apps/web
npm test

# Backend tests
cd apps/api
npm test
```

### Manual Testing Checklist

- [ ] Dashboard loads without errors
- [ ] All overview cards display correct data
- [ ] Charts render properly with real data
- [ ] Invoice table search works
- [ ] Invoice table pagination works
- [ ] Chat interface sends queries
- [ ] SQL is generated correctly
- [ ] Results display in table format
- [ ] Error handling works properly

## 📁 Project Structure

```
analytics-dashboard/
├── apps/
│   ├── web/                    # Next.js Frontend
│   │   ├── src/
│   │   │   ├── app/           # Next.js App Router
│   │   │   ├── components/    # React Components
│   │   │   │   ├── ui/       # shadcn/ui components
│   │   │   │   ├── charts/   # Chart components
│   │   │   │   ├── dashboard.tsx
│   │   │   │   ├── analytics-dashboard.tsx
│   │   │   │   ├── chat-with-data.tsx
│   │   │   │   └── invoices-table.tsx
│   │   │   ├── lib/          # Utilities
│   │   │   └── types/        # TypeScript types
│   │   ├── public/
│   │   └── package.json
│   └── api/                   # Express.js Backend
│       ├── src/
│       │   ├── routes/       # API Routes
│       │   ├── scripts/      # Utility scripts
│       │   └── index.ts      # Entry point
│       ├── prisma/
│       │   └── schema.prisma # Database schema
│       └── package.json
├── services/
│   └── vanna/                 # Vanna AI Service
│       ├── main.py           # FastAPI app
│       ├── train.py          # Training script
│       ├── requirements.txt
│       └── Dockerfile
├── data/
│   └── Analytics_Test_Data.json
├── docker-compose.yml
├── turbo.json
└── package.json
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vanna AI](https://vanna.ai/)
- [Groq](https://groq.com/)
- [Prisma](https://www.prisma.io/)

## 📧 Contact

For questions or support, please open an issue or contact [your-email@example.com]

---

Built with ❤️ for the Analytics Internship Assignment
