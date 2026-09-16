# DevTrack — Collaborative Project Management Platform

DevTrack is a full-stack project and issue management platform for organizing development work. It brings together project management, issue tracking, a Kanban board, team collaboration, and project activity in one application.

## Features

* **Authentication:** Register and log in with JWT-based authentication.
* **Project management:** Create, view, update, and delete projects.
* **Role-based access control:** Manage project access with `OWNER`, `ADMIN`, and `MEMBER` roles.
* **Issue tracking:** Create, update, assign, search, filter, and manage project issues.
* **Kanban board:** Organize issues by status and move them between workflow columns.
* **Comments:** Discuss issues with project members.
* **Activity logs:** View project and issue activity.
* **Real-time updates:** Receive updates through Socket.IO.
* **Dashboard analytics:** View project and issue statistics using MongoDB aggregation.
* **Security:** Password hashing, protected routes, project-level authorization, Helmet, CORS, and rate limiting.

## Tech Stack

| Area                    | Technologies                                   |
| ----------------------- | ---------------------------------------------- |
| Frontend                | React, Vite, Tailwind CSS, React Router, Axios |
| Backend                 | Node.js, Express                               |
| Database                | MongoDB Atlas, Mongoose                        |
| Authentication          | JWT, bcryptjs                                  |
| Real-time communication | Socket.IO                                      |
| Security                | Helmet, CORS, express-rate-limit               |
| Deployment              | Render, MongoDB Atlas                          |

## Architecture

```text
React + Vite
    │
    ├── REST API ──────┐
    └── Socket.IO ─────┤
                       ▼
                Node.js + Express
                       │
                       ▼
                    MongoDB
```

## Project Structure

```text
devtrack/
├── client/                 # React frontend
├── server/                 # Express backend
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── utils/
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

* Node.js and npm
* A MongoDB Atlas account or local MongoDB instance
* Git

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd devtrack
```

### 2. Configure the backend

Create a `.env` file inside `server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Install dependencies and start the backend:

```bash
cd server
npm install
npm run dev
```

The backend runs at `http://localhost:5000` by default.

### 3. Configure the frontend

Create a `.env` file inside `client/`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Install dependencies and start the frontend:

```bash
cd client
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Environment Variables

### Backend

| Variable     | Description                                    |
| ------------ | ---------------------------------------------- |
| `PORT`       | Port used by the backend                       |
| `MONGO_URI`  | MongoDB connection string                      |
| `JWT_SECRET` | Secret used to sign and verify JWTs            |
| `CLIENT_URL` | Allowed frontend origin for CORS and Socket.IO |
| `NODE_ENV`   | Application environment                        |

### Frontend

| Variable          | Description                            |
| ----------------- | -------------------------------------- |
| `VITE_API_URL`    | Backend API base URL, including `/api` |
| `VITE_SOCKET_URL` | Backend origin used for Socket.IO      |

Do not commit `.env` files or expose production secrets. Frontend variables prefixed with `VITE_` are included in the client-side build and must not contain secrets.

## Issue Workflow

Issues use the following statuses:

```text
TODO → IN_PROGRESS → REVIEW → DONE
```

Available priorities:

```text
LOW · MEDIUM · HIGH · URGENT
```

Project members can view project issues. Issue creation, updates, assignment, and deletion are restricted according to project role and issue permissions.

## API Overview

The backend exposes REST endpoints for authentication, projects, project members, issues, comments, and activity.

| Resource         | Base route                                            |
| ---------------- | ----------------------------------------------------- |
| Authentication   | `/api/auth`                                           |
| Projects         | `/api/projects`                                       |
| Project members  | `/api/projects/:id/members`                           |
| Project issues   | `/api/projects/:projectId/issues`                     |
| Issue comments   | `/api/projects/:projectId/issues/:issueId/comments`   |
| Project activity | `/api/projects/:projectId/activities`                 |
| Issue activity   | `/api/projects/:projectId/issues/:issueId/activities` |

Protected endpoints require a valid JWT in the `Authorization` header:

```text
Authorization: Bearer <token>
```

## Deployment

The application is intended to be deployed with:

* **MongoDB Atlas** for the database
* **Render Web Service** for the backend
* **Render Static Site** for the frontend

Configure the production environment variables in Render. Set the backend's `CLIENT_URL` to the deployed frontend origin, and set the frontend's `VITE_API_URL` and `VITE_SOCKET_URL` to the deployed backend URLs.

For a Vite single-page application using React Router, configure the static site to rewrite frontend routes to `/index.html`.

**Live application:** `https://devtrack-god4.onrender.com`
**Backend API:** `https://devtrack-api-rijf.onrender.com`


## Future Improvements

* Automated unit and integration tests
* Email notifications
* More advanced issue filtering and reporting
* Improved accessibility and keyboard interactions

## Author

**Abhinav Gangwar**
