# Analytics Dashboard Setup Script for Windows
# Run with: powershell -ExecutionPolicy Bypass -File setup.ps1

Write-Host "🚀 Analytics Dashboard Setup Script" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

try {
    $npmVersion = npm --version
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed." -ForegroundColor Red
    exit 1
}

try {
    $pythonVersion = python --version
    Write-Host "✅ Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python is not installed. Please install Python 3.11+ first." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Installing root dependencies..." -ForegroundColor Cyan
npm install

Write-Host ""
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location apps\web
npm install
Set-Location ..\..

Write-Host ""
Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
Set-Location apps\api
npm install
Set-Location ..\..

Write-Host ""
Write-Host "Installing Vanna AI dependencies..." -ForegroundColor Cyan
Set-Location services\vanna
python -m pip install -r requirements.txt
Set-Location ..\..

Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Setup environment
Write-Host "⚙️  Setting up environment..." -ForegroundColor Yellow

if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "✅ Created .env file from template" -ForegroundColor Green
    Write-Host "⚠️  Please edit .env file and add your GROQ_API_KEY" -ForegroundColor Yellow
} else {
    Write-Host "ℹ️  .env file already exists" -ForegroundColor Blue
}

if (-not (Test-Path apps\web\.env.local)) {
    @"
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
"@ | Out-File -FilePath apps\web\.env.local -Encoding UTF8
    Write-Host "✅ Created apps\web\.env.local" -ForegroundColor Green
}

if (-not (Test-Path apps\api\.env)) {
    @"
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/analytics_db?schema=public
VANNA_API_BASE_URL=http://localhost:8000
PORT=3001
NODE_ENV=development
"@ | Out-File -FilePath apps\api\.env -Encoding UTF8
    Write-Host "✅ Created apps\api\.env" -ForegroundColor Green
}

if (-not (Test-Path services\vanna\.env)) {
    @"
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/analytics_db
GROQ_API_KEY=your_groq_api_key_here
PORT=8000
MODEL_NAME=mixtral-8x7b-32768
"@ | Out-File -FilePath services\vanna\.env -Encoding UTF8
    Write-Host "✅ Created services\vanna\.env" -ForegroundColor Green
    Write-Host "⚠️  Please edit services\vanna\.env and add your GROQ_API_KEY" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🗄️  Database setup..." -ForegroundColor Yellow
Write-Host ""

# Check if Docker is available
try {
    docker --version | Out-Null
    Write-Host "Docker detected. Starting PostgreSQL container..." -ForegroundColor Cyan
    
    $containerExists = docker ps -a --format "{{.Names}}" | Select-String -Pattern "analytics_db"
    
    if ($containerExists) {
        Write-Host "PostgreSQL container already exists. Starting..." -ForegroundColor Cyan
        docker start analytics_db
    } else {
        Write-Host "Creating PostgreSQL container..." -ForegroundColor Cyan
        docker run -d `
          --name analytics_db `
          -e POSTGRES_USER=postgres `
          -e POSTGRES_PASSWORD=postgres `
          -e POSTGRES_DB=analytics_db `
          -p 5432:5432 `
          postgres:15-alpine
        
        Write-Host "Waiting for PostgreSQL to start..." -ForegroundColor Cyan
        Start-Sleep -Seconds 5
    }
    
    Write-Host "✅ PostgreSQL is running in Docker" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Docker not found. Please ensure PostgreSQL is running locally." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Running Prisma migrations..." -ForegroundColor Cyan
Set-Location apps\api
npm run db:generate
npm run db:push
Write-Host "✅ Database schema created" -ForegroundColor Green

Write-Host ""
Write-Host "Seeding database..." -ForegroundColor Cyan
npm run db:seed
Write-Host "✅ Database seeded with sample data" -ForegroundColor Green
Set-Location ..\..

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Edit .env files and add your GROQ_API_KEY"
Write-Host "2. Start the services:"
Write-Host ""
Write-Host "   Terminal 1 (Backend):"
Write-Host "   cd apps\api; npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Terminal 2 (Vanna AI):"
Write-Host "   cd services\vanna; python main.py" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Terminal 3 (Frontend):"
Write-Host "   cd apps\web; npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Open http://localhost:3000 in your browser"
Write-Host ""
Write-Host "For detailed instructions, see SETUP.md"
Write-Host ""
