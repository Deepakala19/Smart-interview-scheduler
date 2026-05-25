# Smart Interview Scheduler - Backend

A complete, production-ready backend built using Node.js, Express, and MongoDB.

## Features
- **MVC Architecture**: Code is logically isolated into Models, Controllers, and Routes.
- **Authentication**: JWT & secure password hashing (bcrypt).
- **Role-Based Access Control**:
  - `HR`: Full access. Create interviews, assign admins, manage status.
  - `Admin`: View assigned slots, accept/reject assignments.
  - `Candidate`: View personal schedules.
- **Robust Error Handling**: Global customized error handler.
- **Email Notifications**: Utilities to send status emails via Nodemailer (e.g. mock SMTP).

## Setup Instructions

1. **Install Dependencies**
   Navigate to the `backend` folder and run:
   ```bash
   npm install
   ```

2. **Environment Variables**
   Rename `.env.example` to `.env` or create a new `.env` file in the `backend` root. Ensure your MongoDB connection string is correctly configured. Example:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/interview_scheduler
   JWT_SECRET=super_secret_jwt_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   FRONTEND_URL=http://localhost:5173
   ```

3. **Run the Application**
   For development, run:
   ```bash
   npm run dev
   ```
   For production:
   ```bash
   npm start
   ```

## Database Schema (Mongoose)
- **User**: `name`, `email` (unique), `password` (hashed), `role` (`candidate`, `admin`, `hr`).
- **Interview**: `title`, `description`, `date`, `startTime`, `endTime`, `status` (`scheduled`, `completed`, `cancelled`), `candidateId` (ref User), `adminId` (ref User), `hrId` (ref User), `adminStatus` (`pending`, `accepted`, `rejected`).

## API Endpoints List

### Authentication Base URL: `/api/auth`
| Method | Endpoint | Description | Access |
| ------ | -------- | ----------- | ------ |
| POST | `/register` | Register a new user | Public |
| POST | `/login` | Authenticate user & get token | Public |
| GET | `/me` | Get current logged in user profile | Private |

### Users Base URL: `/api/users`
| Method | Endpoint | Description | Access |
| ------ | -------- | ----------- | ------ |
| GET | `/` | Get all users (supports `?role=` filter) | HR Only |
| GET | `/:id` | Get user by ID | Private |

### Interviews Base URL: `/api/interviews`
| Method | Endpoint | Description | Access |
| ------ | -------- | ----------- | ------ |
| POST | `/` | Create a new interview | HR Only |
| GET | `/` | Get interviews (Paginated, returns data scoped to the user's role) | Private |
| GET | `/:id` | Get a specific interview | Private |
| PUT | `/:id` | Update interview details | HR Only |
| DELETE| `/:id` | Delete interview | HR Only |
| PUT | `/:id/assign` | Assign an admin to a slot | HR Only |
| PUT | `/:id/status`| Accept/reject assignment (Admin) or update primary status (HR) | Private |

*Note: All private/role-restricted endpoints require the `Authorization` header formatted as: `Bearer <token>`.*
