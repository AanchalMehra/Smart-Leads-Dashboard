# Smart Leads Dashboard

A role-based CRM web app for managing and tracking leads. Supports Admin and Sales roles with JWT auth, CRUD operations, search, filters, pagination, and CSV export. Fully containerized with Docker.


## Tech Stack

Frontend: React, TypeScript, Tailwind CSS
Backend: Node.js, Express.js, MongoDB, JWT
DevOps: Docker


## Features

- Role-based access — Admin and Sales
- JWT authentication with protected routes
- Sales users can self-register; Admin created via seed
- Full leads CRUD (Delete is Admin only)
- Search, filter by status/source, sort by date
- Pagination (10 per page)
- Export leads as CSV


## Local Setup

### Backend

cd backend
npm install

Create backend/.env:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password

npm run seed
npm run dev


### Frontend

cd frontend
npm install

Create frontend/.env:

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


## API Routes

POST   /auth/signup        Register Sales user
POST   /auth/login         Login
GET    /auth/session       Get current session
GET    /leads              Get leads(Pagination& filter)  
POST   /leads              Create lead
GET    /leads/:id          Get single lead
PATCH  /leads/:id          Update lead
DELETE /leads/:id          Delete lead (Admin only)
GET    /leads/export       Export CSV
GET    /users              Get all users (Admin only)


## Deployment

Frontend: https://smart-leads-dashboard-frontend-bm51.onrender.com
Backend:  https://smart-leads-dashboard-backend-1hll.onrender.com