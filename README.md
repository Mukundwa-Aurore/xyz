# XWZ Parking Management System

A modern microservices-inspired parking management system built with Node.js, Express, PostgreSQL, and React.

## Features

- User registration and authentication (JWT)
- Role-based access control (Admin, Parking Attendant)
- Parking lot management
- Car entry/exit tracking
- Ticket and bill generation (PDF)
- Real-time parking space availability
- Reports with date range filtering
- API documentation with Swagger UI
- Responsive UI with Tailwind CSS

## Tech Stack

### Backend
- Node.js 20+
- Express.js
- PostgreSQL with Sequelize ORM
- JWT Authentication
- Swagger UI
- PDFKit (PDF generation)

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router
- React Query
- React Hook Form + Zod

## Setup Instructions

### 1. Database Setup
First, ensure PostgreSQL is installed and running. Create a database:

```sql
CREATE DATABASE xwz_parking;
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Update the `.env` file with your database credentials:
   ```env
   NODE_ENV=development
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=xwz_parking
   DB_USER=postgres
   DB_PASSWORD=your_postgresql_password
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   ```

3. Also update `config/config.json` with your database credentials.

4. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will be available at http://localhost:5000 and API docs at http://localhost:5000/api-docs

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Start the frontend dev server:
   ```bash
   npm run dev
   ```
   The frontend will be available at http://localhost:5173

## Usage

1. Register as a new user (Admin or Parking Attendant)
2. Log in to the system
3. Admins can create parking lots
4. Parking Attendants and Admins can register car entries
5. Process car exits to generate bills
6. Admins can view reports

## Project Structure
```
xwz-parking/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── contexts/
    │   ├── pages/
    │   ├── services/
    │   └── App.jsx
    └── index.html
```
