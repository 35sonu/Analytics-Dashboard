# API Documentation

## Base URL

- **Development**: `http://localhost:3001/api`
- **Production**: `https://your-app.vercel.app/api`

## Authentication

Currently, the API does not require authentication. For production, implement JWT or API key authentication.

## Common Response Format

### Success Response
```json
{
  "data": { ... },
  "status": "success"
}
```

### Error Response
```json
{
  "error": "Error message",
  "status": "error"
}
```

## Endpoints

### 1. Health Check

Check if the API is running.

**Endpoint**: `GET /health`

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. Get Overview Statistics

Get dashboard overview statistics.

**Endpoint**: `GET /api/stats`

**Response**:
```json
{
  "totalSpend": 1234567.89,
  "totalInvoices": 150,
  "documentsUploaded": 145,
  "averageInvoiceValue": 8230.45
}
```

**Response Fields**:
- `totalSpend` (number): Total spending year-to-date
- `totalInvoices` (number): Count of all invoices
- `documentsUploaded` (number): Count of invoices with documents
- `averageInvoiceValue` (number): Average invoice amount

---

### 3. Get Invoice Trends

Get monthly invoice volume and value trends.

**Endpoint**: `GET /api/invoice-trends`

**Query Parameters**: None

**Response**:
```json
[
  {
    "month": "2024-01",
    "count": 25,
    "total": 125000.50
  },
  {
    "month": "2024-02",
    "count": 30,
    "total": 145000.75
  }
]
```

**Response Fields**:
- `month` (string): Month in YYYY-MM format
- `count` (number): Number of invoices in that month
- `total` (number): Total invoice value for that month

---

### 4. Get Top Vendors

Get top 10 vendors by total spend.

**Endpoint**: `GET /api/vendors/top10`

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

**Response Fields**:
- `id` (string): Vendor ID
- `name` (string): Vendor name
- `total` (number): Total spend with this vendor
- `invoiceCount` (number): Number of invoices from this vendor

---

### 5. Get All Vendors

Get all vendors with invoice count.

**Endpoint**: `GET /api/vendors`

**Response**:
```json
[
  {
    "id": "vendor_123",
    "name": "Acme Corp",
    "email": "billing@acme.com",
    "phone": "555-0100",
    "address": "123 Main St",
    "_count": {
      "invoices": 45
    }
  }
]
```

---

### 6. Get Category Spend

Get spending breakdown by category.

**Endpoint**: `GET /api/invoice-trends/category`

**Response**:
```json
[
  {
    "category": "Software",
    "total": 150000.00
  },
  {
    "category": "Hardware",
    "total": 85000.50
  }
]
```

**Response Fields**:
- `category` (string): Category name
- `total` (number): Total spend in this category

---

### 7. Get Cash Outflow Forecast

Get upcoming cash outflow forecast by week.

**Endpoint**: `GET /api/invoice-trends/cash-outflow`

**Response**:
```json
[
  {
    "week": "2024-01-15",
    "total": 45000.00
  },
  {
    "week": "2024-01-22",
    "total": 52000.50
  }
]
```

**Response Fields**:
- `week` (string): Week start date (Monday)
- `total` (number): Expected cash outflow for that week

---

### 8. Get Invoices (with pagination and filters)

Get paginated list of invoices with optional filtering.

**Endpoint**: `GET /api/invoices`

**Query Parameters**:
- `search` (string, optional): Search by invoice number or vendor name
- `status` (string, optional): Filter by status (paid, pending, overdue, partial)
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Results per page (default: 50)
- `sortBy` (string, optional): Field to sort by (default: invoiceDate)
- `order` (string, optional): Sort order - asc or desc (default: desc)

**Example Request**:
```
GET /api/invoices?search=INV&status=paid&page=1&limit=10&sortBy=totalAmount&order=desc
```

**Response**:
```json
{
  "data": [
    {
      "id": "invoice_123",
      "invoiceNumber": "INV-00001",
      "invoiceDate": "2024-01-15T00:00:00.000Z",
      "dueDate": "2024-02-15T00:00:00.000Z",
      "totalAmount": 5000.00,
      "status": "paid",
      "category": "Software",
      "vendor": {
        "id": "vendor_123",
        "name": "Acme Corp"
      },
      "customer": {
        "id": "customer_123",
        "name": "ABC Company"
      }
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

**Response Fields**:
- `data` (array): Array of invoice objects
- `total` (number): Total count of invoices matching filters
- `page` (number): Current page number
- `limit` (number): Results per page
- `totalPages` (number): Total number of pages

---

### 9. Get Single Invoice

Get detailed information about a specific invoice.

**Endpoint**: `GET /api/invoices/:id`

**URL Parameters**:
- `id` (string): Invoice ID

**Response**:
```json
{
  "id": "invoice_123",
  "invoiceNumber": "INV-00001",
  "invoiceDate": "2024-01-15T00:00:00.000Z",
  "dueDate": "2024-02-15T00:00:00.000Z",
  "totalAmount": 5000.00,
  "status": "paid",
  "category": "Software",
  "description": "Monthly software subscription",
  "vendor": {
    "id": "vendor_123",
    "name": "Acme Corp",
    "email": "billing@acme.com"
  },
  "customer": {
    "id": "customer_123",
    "name": "ABC Company"
  },
  "lineItems": [
    {
      "id": "line_123",
      "description": "Software License",
      "quantity": 10,
      "unitPrice": 500.00,
      "amount": 5000.00,
      "category": "Software"
    }
  ],
  "payments": [
    {
      "id": "payment_123",
      "paymentDate": "2024-01-20T00:00:00.000Z",
      "amount": 5000.00,
      "paymentMethod": "Bank Transfer",
      "reference": "PAY-00001"
    }
  ]
}
```

---

### 10. Chat with Data

Send natural language query to AI for data analysis.

**Endpoint**: `POST /api/chat-with-data`

**Request Body**:
```json
{
  "query": "What's the total spend in the last 90 days?"
}
```

**Response (Success)**:
```json
{
  "query": "What's the total spend in the last 90 days?",
  "sql": "SELECT SUM(totalAmount) as total FROM Invoice WHERE invoiceDate >= NOW() - INTERVAL '90 days'",
  "results": [
    {
      "total": 450000.00
    }
  ],
  "error": null
}
```

**Response (Error)**:
```json
{
  "query": "Invalid query",
  "sql": null,
  "results": null,
  "error": "Could not generate SQL for this question"
}
```

**Request Fields**:
- `query` (string, required): Natural language question

**Response Fields**:
- `query` (string): The original question
- `sql` (string|null): Generated SQL query
- `results` (array|null): Query results
- `error` (string|null): Error message if any

**Example Queries**:
- "What's the total spend in the last 90 days?"
- "List top 5 vendors by spend"
- "Show overdue invoices as of today"
- "What's the average invoice value by category?"
- "How many invoices were paid in January 2024?"

---

## Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Rate Limiting

Currently no rate limiting is implemented. For production, consider implementing rate limiting.

## CORS

CORS is enabled for all origins in development. For production, configure specific allowed origins.

## Error Handling

All endpoints return consistent error format:

```json
{
  "error": "Descriptive error message",
  "status": "error"
}
```

## Data Types

### Invoice Statuses
- `paid`: Invoice fully paid
- `pending`: Invoice awaiting payment
- `overdue`: Invoice past due date and unpaid
- `partial`: Invoice partially paid

### Categories
- Software
- Hardware
- Services
- Supplies
- Utilities
- Marketing

## Pagination

For paginated endpoints:
- Default page size: 50
- Maximum page size: 100
- Page numbers start at 1

## Sorting

For endpoints that support sorting:
- Default sort: `invoiceDate desc`
- Supported fields: `invoiceDate`, `totalAmount`, `invoiceNumber`, `status`
- Supported orders: `asc`, `desc`

## Best Practices

1. **Always handle errors**: Check for error responses
2. **Use pagination**: Don't request all records at once
3. **Cache when possible**: Cache static data like vendor lists
4. **Validate input**: Validate query parameters before sending
5. **Use TypeScript types**: Import types from the API client

## TypeScript Integration

```typescript
import { analyticsApi } from '@/lib/api';
import type { Invoice, Stats } from '@/types';

// Get stats
const stats: Stats = await analyticsApi.getStats();

// Get invoices
const { data } = await analyticsApi.getInvoices({ 
  search: 'INV',
  page: 1,
  limit: 10 
});
```

## Testing

Test all endpoints with curl:

```bash
# Health check
curl http://localhost:3001/health

# Get stats
curl http://localhost:3001/api/stats

# Get invoices
curl "http://localhost:3001/api/invoices?page=1&limit=10"

# Chat with data
curl -X POST http://localhost:3001/api/chat-with-data \
  -H "Content-Type: application/json" \
  -d '{"query": "Total spend?"}'
```
