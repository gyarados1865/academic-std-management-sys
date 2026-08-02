# 🎓 Academic Student Management System API

A production-ready **Academic Student Management System** backend — a role-based REST API that manages the complete academic lifecycle of an institution: departments, courses, semesters, subjects, teachers, students, enrollments, attendance, and results, secured with JWT authentication and documented with a live Swagger/OpenAPI interface.

---

## 🚀 Live Demo

| Resource | Link |
|---|---|
| 🌐 Backend API | [https://academic-std-management-sys.onrender.com](https://academic-std-management-sys.onrender.com) |
| 📖 Swagger Documentation | [https://academic-std-management-sys.onrender.com/api-docs](https://academic-std-management-sys.onrender.com/api-docs) |

> ⚠️ Hosted on Render's free tier — the service may take a few seconds to spin up after a period of inactivity.

---

## ✨ Features

- 🔐 JWT-based authentication with `bcrypt` password hashing
- 🛡️ Role-based authorization — `ADMIN`, `TEACHER`, `STUDENT`
- 📚 Complete CRUD APIs across 10 academic modules
- 🔎 Search on list endpoints (name, email, code, etc.)
- 🧮 Filtering (e.g. by department)
- ↕️ Sorting via `sortBy` / `sortOrder`
- 📄 Pagination via `page` / `limit` with computed `totalPages`
- ✅ Request validation with Joi on every write operation
- 📘 Interactive Swagger/OpenAPI 3.0 documentation
- 🗄️ Prisma ORM with PostgreSQL (Neon serverless)
- ☁️ Live production deployment on Render
- 🏗️ Clean RESTful, layered architecture

---

## 🏛️ Architecture Overview

The API follows a layered, single-responsibility architecture:

```
Client Request
     │
     ▼
  Routes            → defines endpoints, applies auth/validation middleware
     │
     ▼
Controllers         → handles req/res, calls the matching service
     │
     ▼
 Services           → business logic + Prisma queries (incl. transactions)
     │
     ▼
Prisma Client        → type-safe query builder / migrations
     │
     ▼
PostgreSQL (Neon)     → serverless relational database
```

Cross-cutting concerns are handled via middleware:
- `authenticate` — verifies the JWT and attaches the decoded user to `req.user`
- `authorize(...roles)` — restricts a route to specific roles
- `validate(schema)` — runs the request body through a Joi schema before it reaches the controller

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend Runtime** | Node.js |
| **Framework** | Express.js 5 |
| **Database** | PostgreSQL (Neon — serverless) |
| **ORM** | Prisma |
| **Authentication** | JWT (`jsonwebtoken`) + `bcrypt` |
| **Validation** | Joi |
| **API Documentation** | Swagger UI (`swagger-ui-express`) + `swagger-jsdoc` |
| **Deployment** | Render |

---

## 📁 Folder Structure

<details>
<summary>Click to expand</summary>

```
server/
├── prisma/
│   ├── migrations/
│   │   └── 20260726072353_init/
│   │       └── migration.sql
│   └── schema.prisma
├── src/
│   ├── config/
│   │   ├── db.js               # Prisma connection bootstrap
│   │   ├── env.js              # Centralized environment variable access
│   │   └── swagger.js          # OpenAPI 3.0 spec (schemas, tags, security)
│   ├── controllers/
│   │   ├── attendance.controller.js
│   │   ├── auth.controller.js
│   │   ├── course.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── department.controller.js
│   │   ├── enrollment.controller.js
│   │   ├── result.controller.js
│   │   ├── semester.controller.js
│   │   ├── student.controller.js
│   │   ├── subject.controller.js
│   │   └── teacher.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js  # authenticate (JWT) + authorize (role) guards
│   ├── prisma/
│   │   └── prismaClient.js     # Shared PrismaClient instance
│   ├── routes/
│   │   ├── attendance.routes.js
│   │   ├── auth.routes.js
│   │   ├── course.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── department.routes.js
│   │   ├── enrollment.routes.js
│   │   ├── index.js            # Mounts all module routers under /api
│   │   ├── result.routes.js
│   │   ├── semester.routes.js
│   │   ├── student.routes.js
│   │   ├── subject.routes.js
│   │   └── teacher.routes.js
│   ├── services/
│   │   ├── attendance.service.js
│   │   ├── auth.service.js
│   │   ├── course.service.js
│   │   ├── dashboard.service.js
│   │   ├── department.service.js
│   │   ├── enrollment.service.js
│   │   ├── result.service.js
│   │   ├── semester.service.js
│   │   ├── student.service.js
│   │   ├── subject.service.js
│   │   └── teacher.service.js
│   ├── validators/
│   │   ├── attendance.validator.js
│   │   ├── auth.validator.js
│   │   ├── course.validator.js
│   │   ├── department.validator.js
│   │   ├── enrollment.validator.js
│   │   ├── result.validator.js
│   │   ├── semester.validator.js
│   │   ├── student.validator.js
│   │   ├── subject.validator.js
│   │   └── validation.middleware.js  # Generic Joi validate(schema) wrapper
│   ├── app.js                  # Express app & route mounting
│   └── server.js               # Entry point — connects DB, starts server
├── .env.example
└── package.json
```

</details>

---

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/academic-std-management-sys.git
cd academic-std-management-sys/server

# Install dependencies
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside `server/`:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

| Variable | Description |
|---|---|
| `PORT` | Port the Express server listens on (defaults to `5000`) |
| `DATABASE_URL` | PostgreSQL (Neon) connection string used by Prisma |
| `JWT_SECRET` | Secret key used to sign and verify JWT access tokens |
| `JWT_EXPIRES_IN` | Expiry duration applied to issued JWT tokens (e.g. `1d`, `7d`) |

---

## ▶️ Running Locally

```bash
# Generate the Prisma client
npx prisma generate

# Apply database migrations
npx prisma migrate dev

# Start in development mode (auto-reload)
npm run dev

# Start in production mode
npm start
```

The API will be available at `http://localhost:5000`.

---

## 📖 API Documentation

Full interactive documentation is available via Swagger UI:

| Environment | URL |
|---|---|
| Local | `http://localhost:5000/api-docs` |
| Production | [https://academic-std-management-sys.onrender.com/api-docs](https://academic-std-management-sys.onrender.com/api-docs) |

Each endpoint is documented with request/response schemas, example payloads, and the role required to access it. Click **Authorize** in Swagger UI and paste a JWT (`Bearer <token>`) obtained from `POST /api/auth/login` to test protected routes.

---

## 🔐 Authentication

- Passwords are hashed with **bcrypt** before being stored.
- `POST /api/auth/login` verifies credentials and issues a signed **JWT** containing the user's `id` and `role`.
- An `authenticate` middleware validates the `Authorization: Bearer <token>` header on protected routes.
- An `authorize(...roles)` middleware restricts access based on the authenticated user's role.

**Role convention applied across all modules:**

| Action | Allowed Roles |
|---|---|
| Create / Update / Delete | `ADMIN` |
| List / View details | `ADMIN`, `TEACHER` |

Unauthenticated requests return `401 Unauthorized`; authenticated requests with an insufficient role return `403 Forbidden`.

---

## 🧩 Available Modules

| Module | Base Path | Description |
|---|---|---|
| **Authentication** | `/api/auth` | Register, login, current-user check, and sample role-gated routes |
| **Students** | `/api/students` | Manage student academic profiles |
| **Teachers** | `/api/teachers` | Manage teacher/faculty profiles |
| **Departments** | `/api/departments` | Manage academic departments |
| **Courses** | `/api/courses` | Manage degree programs offered by a department |
| **Semesters** | `/api/semesters` | Manage semesters belonging to a course |
| **Subjects** | `/api/subjects` | Manage subjects taught within a semester |
| **Enrollments** | `/api/enrollments` | Enroll students into subjects |
| **Attendance** | `/api/attendances` | Record and query per-date student attendance |
| **Results** | `/api/results` | Record marks, grade, and remarks per student/subject |
| **Dashboard** | `/api/dashboard` | Aggregate statistics across all entities |

---

## 🔄 Example API Flow

**1. Register an admin (or use a seeded account)**

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Muhammad Sibtain Khan",
  "email": "admin@university.edu",
  "password": "SecurePass123!",
  "role": "ADMIN"
}
```

**2. Log in to obtain a JWT**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@university.edu",
  "password": "SecurePass123!"
}
```

```json
{
  "success": true,
  "user": { "id": "cljk0a1b2...", "name": "Muhammad Sibtain Khan", "role": "ADMIN" },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**3. Use the token to access a protected resource**

```http
GET /api/students?page=1&limit=10&search=Ali&sortBy=createdAt&sortOrder=desc
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

```json
{
  "success": true,
  "pagination": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 },
  "data": [ { "id": "cljk0c3d4...", "registrationNumber": "FA22-BCS-001" } ]
}
```

---

## ☁️ Deployment

| Component | Provider |
|---|---|
| Backend API | [Render](https://render.com) |
| Database | [Neon](https://neon.tech) — serverless PostgreSQL |

The backend is deployed on **Render** as a web service, connecting to a **Neon PostgreSQL** instance via `DATABASE_URL`. Prisma migrations are applied against the Neon database before the service starts.

---

## 🚧 Future Improvements

- Centralized error-handling middleware for consistent error responses
- Refresh tokens / token revocation for stronger session security
- File upload support for profile images (currently plain URL strings)
- Rate limiting and structured request logging

---

## 👤 Author

**Muhammad Sibtain Khan**

- GitHub: (https://github.com/gyarados1865)
- LinkedIn:(https://www.linkedin.com/in/muhammad-sibtain-khan-657a67405/)

---

## 📄 License

Licensed under the **MIT License**.

---

## 🙏 Acknowledgements

- [Prisma](https://www.prisma.io/) for the type-safe ORM and migration tooling
- [Neon](https://neon.tech/) for serverless PostgreSQL hosting
- [Swagger](https://swagger.io/) for the OpenAPI documentation tooling
- [Render](https://render.com/) for backend hosting