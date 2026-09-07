# DevTrack

DevTrack is a full-stack collaborative project and issue management platform for software development teams.

## Features

- JWT authentication and protected routes
- Project creation, editing, and deletion
- Project roles with owner, admin, and member permissions
- Issue creation, editing, assignment, filtering, and Kanban workflow
- Issue comments and project activity tracking
- Real-time issue and comment updates with Socket.IO
- Project analytics by status, priority, completion, and assignee
- API rate limiting and security headers
- Reusable confirmation dialogs and responsive UI

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- Tailwind CSS
- Socket.IO Client

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Socket.IO
- Helmet
- Express Rate Limit

## Environment

Create `server/.env` from `server/.env.example` and provide the MongoDB connection string and JWT secret.

Create `client/.env` from `client/.env.example` if you want to override the default local API and Socket.IO URLs.

## Run

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

The frontend runs on Vite's development server and the backend defaults to port `5000`.
