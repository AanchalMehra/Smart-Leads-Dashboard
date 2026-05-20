# Smart Leads Dashboard
A role-based web app for managing and tracking leads. Supports Admin and Sales roles with JWT auth, CRUD operations, search, filters, pagination, and CSV export. Fully containerized with Docker.


## Tech Stack

Frontend: React, TypeScript, Tailwind CSS
Backend: Node.js, Express.js, MongoDB, JWT
DevOps: Docker


## Features

- Role-based access — Admin and Sales
- JWT authentication with protected routes
- Sales users can self-register; Admin created via seed
- Full leads CRUD (Delete is Admin only)
- Search by name or email, filter by status/source, sort by date
- Debounced search
- Pagination (10 per page)
- Export leads as CSV
- Dark mode support


## Local Setup

### Backend

cd backend
npm install

Create backend/.env (see backend/.env.example):

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=adminPass123

npm run seed
npm run dev


### Frontend

cd frontend
npm install

Create frontend/.env (see frontend/.env.example):

VITE_BASE_URL=http://localhost:5000

npm run dev


## Docker Setup

### Backend

docker build -t backend ./backend
docker run -p 5000:5000 backend

### Frontend

The backend URL must be passed at build time (Vite bakes it into the bundle):

docker build --build-arg VITE_BASE_URL=https://smart-leads-dashboard-backend-1hll.onrender.com -t frontend ./frontend
docker run -p 3000:3000 frontend


## API Documentation

All protected routes require an Authorization header:
Authorization: Bearer your_jwt_token


### Auth Routes

POST /auth/signup
Register a new Sales user.

Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "yourpassword"
}

Response 201:
{
  "message": "User created successfully"
}


POST /auth/login
Login for Admin and Sales users.

Request:
{
  "email": "admin@example.com",
  "password": "adminPass123"
}

Response 200:
{
  "message": "User Login successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "Admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}


GET /auth/session
Get current logged-in user. Requires token.

Response 200:
{
  "user": {
    "id": "user_id",
    "name": "Admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}


### Dashboard Route

GET /
Get lead stats for the logged-in user. Sales users see only their own stats.

Response 200:
{
  "role": "admin",
  "user": { "name": "Admin", "email": "admin@example.com" },
  "stats": {
    "totalLeads": 50,
    "newLeads": 10,
    "contactedLeads": 15,
    "qualifiedLeads": 20,
    "lostLeads": 5
  }
}


### Leads Routes

GET /leads
Get paginated leads. Admin sees all; Sales sees only their own.

Query params:
  page    - page number (default: 1)
  limit   - records per page (default: 10)
  search  - search by name or email
  status  - New | Contacted | Qualified | Lost
  source  - Website | Instagram | Referral
  sort    - latest | oldest

Response 200:
{
  "data": [ ...leads ],
  "pagination": {
    "total": 50,
    "page": 1,
    "pages": 5,
    "limit": 10
  }
}


POST /leads
Create a new lead.

Request:
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "9876543210",
  "source": "Website",
  "status": "New",
  "notes": "Interested in product"
}

Response 201:
{
  "message": "Lead created successfully",
  "lead": { ...lead }
}


GET /leads/:id
Get a single lead by ID. Sales can only view their own leads.

Response 200:
{
  "data": { ...lead }
}


PATCH /leads/:id
Update a lead. Sales can only update their own leads.

Request (any updatable fields):
{
  "status": "Contacted",
  "notes": "Called and followed up"
}

Response 200:
{
  "message": "Lead Updated successfully",
  "lead": { ...updated lead }
}


DELETE /leads/:id
Delete a lead. Admin only.

Response 200:
{
  "message": "Lead Deleted successfully"
}


GET /leads/export
Export leads as a CSV file. Sales exports only their own leads.

Response: CSV file download (leads.csv)


### Users Route

GET /users
Get all users with pagination. Admin only.

Query params:
  page  - page number (default: 1)
  limit - records per page (default: 10)

Response 200:
{
  "data": [ ...users ],
  "pagination": {
    "total": 20,
    "page": 1,
    "pages": 2,
    "limit": 10
  }
}


## Deployment

Frontend: https://smart-leads-dashboard-frontend-bm51.onrender.com
Backend:  https://smart-leads-dashboard-backend-1hll.onrender.com