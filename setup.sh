#!/bin/bash

# Setup script for Analytics Dashboard
# This script automates the initial setup process

set -e

echo "🚀 Analytics Dashboard Setup Script"
echo "===================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.11+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo ""

echo "Installing root dependencies..."
npm install

echo ""
echo "Installing frontend dependencies..."
cd apps/web
npm install
cd ../..

echo ""
echo "Installing backend dependencies..."
cd apps/api
npm install
cd ../..

echo ""
echo "Installing Vanna AI dependencies..."
cd services/vanna
python3 -m pip install -r requirements.txt
cd ../..

echo "✅ Dependencies installed"
echo ""

# Setup environment
echo "⚙️  Setting up environment..."

if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from template"
    echo "⚠️  Please edit .env file and add your GROQ_API_KEY"
else
    echo "ℹ️  .env file already exists"
fi

if [ ! -f apps/web/.env.local ]; then
    echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:3001" > apps/web/.env.local
    echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" >> apps/web/.env.local
    echo "✅ Created apps/web/.env.local"
fi

if [ ! -f apps/api/.env ]; then
    echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/analytics_db?schema=public" > apps/api/.env
    echo "VANNA_API_BASE_URL=http://localhost:8000" >> apps/api/.env
    echo "PORT=3001" >> apps/api/.env
    echo "NODE_ENV=development" >> apps/api/.env
    echo "✅ Created apps/api/.env"
fi

if [ ! -f services/vanna/.env ]; then
    echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/analytics_db" > services/vanna/.env
    echo "GROQ_API_KEY=your_groq_api_key_here" >> services/vanna/.env
    echo "PORT=8000" >> services/vanna/.env
    echo "MODEL_NAME=mixtral-8x7b-32768" >> services/vanna/.env
    echo "✅ Created services/vanna/.env"
    echo "⚠️  Please edit services/vanna/.env and add your GROQ_API_KEY"
fi

echo ""
echo "🗄️  Database setup..."
echo ""

# Check if PostgreSQL is running
if command -v docker &> /dev/null; then
    echo "Docker detected. Starting PostgreSQL container..."
    
    if docker ps -a | grep -q analytics_db; then
        echo "PostgreSQL container already exists. Starting..."
        docker start analytics_db || echo "Container already running"
    else
        echo "Creating PostgreSQL container..."
        docker run -d \
          --name analytics_db \
          -e POSTGRES_USER=postgres \
          -e POSTGRES_PASSWORD=postgres \
          -e POSTGRES_DB=analytics_db \
          -p 5432:5432 \
          postgres:15-alpine
        
        echo "Waiting for PostgreSQL to start..."
        sleep 5
    fi
    
    echo "✅ PostgreSQL is running in Docker"
else
    echo "⚠️  Docker not found. Please ensure PostgreSQL is running locally."
fi

echo ""
echo "Running Prisma migrations..."
cd apps/api
npm run db:generate
npm run db:push
echo "✅ Database schema created"

echo ""
echo "Seeding database..."
npm run db:seed
echo "✅ Database seeded with sample data"
cd ../..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env files and add your GROQ_API_KEY"
echo "2. Start the services:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   cd apps/api && npm run dev"
echo ""
echo "   Terminal 2 (Vanna AI):"
echo "   cd services/vanna && python main.py"
echo ""
echo "   Terminal 3 (Frontend):"
echo "   cd apps/web && npm run dev"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For detailed instructions, see SETUP.md"
echo ""
