from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from groq import Groq
from sqlalchemy import create_engine, text
import json

load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Vanna AI Analytics API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
groq_api_key = os.getenv('GROQ_API_KEY')
if not groq_api_key:
    print("WARNING: GROQ_API_KEY not set. Chat functionality will not work.")
    groq_client = None
else:
    groq_client = Groq(api_key=groq_api_key)

# Connect to PostgreSQL database
database_url = os.getenv('DATABASE_URL')
if database_url:
    # Convert to psycopg format for SQLAlchemy
    if 'postgresql://' in database_url and 'postgresql+psycopg://' not in database_url:
        database_url = database_url.replace('postgresql://', 'postgresql+psycopg://')
    engine = create_engine(database_url)
else:
    engine = None
    print("WARNING: DATABASE_URL not set")

# Request/Response models
class QueryRequest(BaseModel):
    question: str

class QueryResponse(BaseModel):
    question: str
    sql: str | None = None
    results: list | None = None
    error: str | None = None

# Database schema context for Groq
SCHEMA_CONTEXT = """
You are a SQL expert. Generate PostgreSQL queries based on this schema:

Tables:
- Vendor (id, name, email, phone, address)
- Customer (id, name, email, phone, address)  
- Invoice (id, invoiceNumber, vendorId, customerId, invoiceDate, dueDate, totalAmount, status, category)
- LineItem (id, invoiceId, description, quantity, unitPrice, amount, category)
- Payment (id, invoiceId, paymentDate, amount, paymentMethod, reference)

Relationships:
- Invoice.vendorId -> Vendor.id
- Invoice.customerId -> Customer.id
- LineItem.invoiceId -> Invoice.id
- Payment.invoiceId -> Invoice.id

Rules:
- Use double quotes for table/column names with capitals: "Invoice", "totalAmount"
- Status values: 'paid', 'pending', 'overdue', 'partial'
- Amounts are in EUR (€)
- Always return valid PostgreSQL SELECT queries
- For date ranges, use CURRENT_DATE and INTERVAL
"""

@app.get("/")
async def root():
    return {
        "message": "Vanna AI Analytics API",
        "version": "1.0.0",
        "status": "running",
        "groq_configured": groq_client is not None,
        "database_configured": engine is not None
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "groq_configured": groq_client is not None,
        "database_configured": engine is not None
    }

@app.post("/api/query", response_model=QueryResponse)
async def query_data(request: QueryRequest):
    """
    Process natural language questions and return SQL + results
    """
    try:
        question = request.question
        
        if not groq_client:
            return QueryResponse(
                question=question,
                error="GROQ_API_KEY not configured. Please set your API key."
            )
        
        # Generate SQL using Groq
        try:
            chat_completion = groq_client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": SCHEMA_CONTEXT
                    },
                    {
                        "role": "user",
                        "content": f"Generate a PostgreSQL query for: {question}\n\nReturn ONLY the SQL query, nothing else."
                    }
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.1,
                max_tokens=500
            )
            
            sql = chat_completion.choices[0].message.content.strip()
            
            # Clean up the SQL (remove markdown code blocks if present)
            if sql.startswith('```sql'):
                sql = sql.replace('```sql', '').replace('```', '').strip()
            elif sql.startswith('```'):
                sql = sql.replace('```', '').strip()
                
        except Exception as e:
            return QueryResponse(
                question=question,
                error=f"Error generating SQL: {str(e)}"
            )
        
        if not sql:
            return QueryResponse(
                question=question,
                error="Could not generate SQL for this question"
            )
        
        # Execute the SQL query
        if not engine:
            return QueryResponse(
                question=question,
                sql=sql,
                error="Database not configured"
            )
            
        try:
            with engine.connect() as conn:
                result = conn.execute(text(sql))
                rows = result.fetchall()
                
                # Convert to list of dictionaries
                if rows:
                    columns = result.keys()
                    results = [
                        {col: (float(val) if isinstance(val, (int, float)) else str(val)) 
                         for col, val in zip(columns, row)}
                        for row in rows
                    ]
                else:
                    results = []
                
            return QueryResponse(
                question=question,
                sql=sql,
                results=results
            )
            
        except Exception as e:
            return QueryResponse(
                question=question,
                sql=sql,
                error=f"Error executing SQL: {str(e)}"
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    print(f"Starting Vanna AI service on port {port}...")
    print(f"Groq configured: {groq_client is not None}")
    print(f"Database configured: {engine is not None}")
    uvicorn.run(app, host="0.0.0.0", port=port)
