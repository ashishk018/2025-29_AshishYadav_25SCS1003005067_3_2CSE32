# 📌 Enterprise CRM System

A full-stack web application that helps businesses efficiently manage their **leads, customers, sales activities, and deal pipelines** — all from a single centralized platform.

Sales teams can add and track leads, manage customer information, move deals through pipeline stages, and monitor overall sales performance through an interactive dashboard. The system also maintains **email and activity logs** so representatives can keep a full history of every customer interaction, with **role-based access control** separating Admin and Sales user permissions.

---

## 🛠️ Tech Stack

| Layer          | Technology                     |
|----------------|---------------------------------|
| Frontend       | React.js (Vite) + Tailwind CSS |
| Backend        | Node.js + Express.js           |
| Database       | MongoDB + Mongoose             |
| Auth           | JWT (JSON Web Tokens) + bcrypt |
| Communication  | REST APIs                      |
| Charts         | Recharts                       |

---

## ⭐ Main Features

- 🎯 **Lead tracking & management** — capture, search, update lead status
- 👤 **Customer management** — full customer records, convert leads → customers
- 💼 **Deal / pipeline stage tracking** — drag-and-drop Kanban board (Prospecting → Won/Lost)
- 📊 **Sales performance dashboard** — revenue won, pipeline value, deals-by-stage chart
- 📧 **Email & activity logs** — calls, emails, meetings, notes tied to leads/customers
- 🔐 **Role-based access control** — Admin (full access) vs Sales (own records only)
- 🔗 **REST API based backend** — clean, documented Express routes

---

## 📁 Project Structure

```
enterprise-crm/
├── backend/                 # Node.js + Express REST API
│   ├── config/db.js         # MongoDB connection
│   ├── models/               # User, Lead, Customer, Deal, Activity
│   ├── middleware/           # JWT auth + role guard, error handler
│   ├── controllers/          # Business logic for each resource
│   ├── routes/               # API route definitions
│   ├── utils/seed.js         # Sample data seeder
│   └── server.js             # App entry point
│
└── frontend/                 # React (Vite) client
    └── src/
        ├── pages/             # Login, Register, Dashboard, Leads, Customers, Deals, Activities, Users
        ├── components/        # Sidebar, Navbar, Modal, StatusBadge, ProtectedRoute
        ├── layouts/           # DashboardLayout
        ├── context/           # AuthContext (JWT session state)
        └── services/api.js    # Axios instance with auth interceptor
```

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js v18+
- MongoDB running locally, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env and set your MONGO_URI and JWT_SECRET

npm install
npm run seed     # optional: creates demo admin + sales user + sample data
npm run dev       # starts server on http://localhost:5000
```

**Demo credentials after seeding:**
- Admin → `admin@crm.com` / `admin123`
- Sales → `sales@crm.com` / `sales123`

### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env
# VITE_API_URL should point to your backend, e.g. http://localhost:5000/api

npm install
npm run dev       # starts app on http://localhost:5173
```

Open **http://localhost:5173** in your browser and log in.

---

## 🌐 Deployment

### Backend → Render (or Railway/any Node host)
1. Push the `backend/` folder to a GitHub repo.
2. Create a new Web Service on [Render](https://render.com), connect the repo.
3. Set build command `npm install`, start command `npm start`.
4. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`.

### Frontend → Vercel
1. Push the `frontend/` folder to a GitHub repo.
2. Import the project on [Vercel](https://vercel.com).
3. Set environment variable `VITE_API_URL` to your deployed backend URL (e.g. `https://your-api.onrender.com/api`).
4. Deploy — `vercel.json` is already configured for client-side routing.

### MongoDB → MongoDB Atlas
Use a free-tier cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas) and paste the connection string into `MONGO_URI`.

---

## 🔑 API Overview

| Method | Endpoint             | Description                     | Access        |
|--------|-----------------------|----------------------------------|---------------|
| POST   | `/api/auth/register`  | Register new user               | Public        |
| POST   | `/api/auth/login`     | Login, returns JWT               | Public        |
| GET    | `/api/auth/me`        | Get logged-in user profile       | Private       |
| GET    | `/api/auth/users`     | List all team members            | Admin only    |
| GET/POST | `/api/leads`         | List / create leads              | Private       |
| PUT/DELETE | `/api/leads/:id`   | Update / delete a lead           | Private/Admin |
| GET/POST | `/api/customers`     | List / create customers          | Private       |
| PUT/DELETE | `/api/customers/:id` | Update / delete a customer     | Private/Admin |
| GET/POST | `/api/deals`         | List / create deals              | Private       |
| PUT/DELETE | `/api/deals/:id`   | Update stage / delete a deal     | Private/Admin |
| GET/POST | `/api/activities`    | List / log activities            | Private       |
| GET    | `/api/dashboard`      | Sales performance summary stats  | Private       |

All private routes require an `Authorization: Bearer <token>` header.

---

## 👥 Roles

- **Admin** — full access to all leads, customers, deals, activities, and team member list.
- **Sales** — can only view/manage records assigned to or owned by them.

---

## 📄 One-line Description

> A full-stack CRM platform that helps businesses manage leads, customers, sales pipelines, and team activities efficiently from one centralized dashboard.
