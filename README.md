# TaskFlow - Full Stack Task Management Application

TaskFlow is a modern, real-time task management application built with **React, Node.js, and Socket.io**. It offers a seamless experience for organizing tasks, managing teams, and staying updated with live changes.

## 🚀 Features

-   **Real-Time Collaboration**: Instant updates across all connected clients using Socket.io (no page refreshes needed!).
-   **Authentication**: Secure User Registration and Login using JWT and HttpOnly cookies.
-   **Task Management**: Create, Read, Update, and Delete tasks with ease.
-   **Task Assignment**: Assign tasks to other users on the platform.
-   **Strict Visibility**: "All Tasks" view is personalized, showing only tasks you created or are assigned to.
-   **Permissions**:
    -   **Edit**: Only the Task Creator or Assignee can edit.
    -   **Delete**: Only the Task Creator can delete.
-   **Filtering & Sorting**: Filter tasks by Status (Todo, In Progress, Review, Completed) and Priority, or Sort by Due Date.
-   **Personalized Views**: Switch between "All Tasks", "Assigned to Me", and "Created by Me".
-   **User Profiles**: Update your name and email settings.
-   **Responsive Design**: Built with Tailwind CSS for a mobile-first experience.

## 🛠️ Technology Stack

### Frontend
-   **React** (Vite): Fast and modern UI framework.
-   **TypeScript**: Type safety for robust development.
-   **Tailwind CSS**: Utility-first CSS framework for styling.
-   **TanStack Query (React Query)**: Efficient server state management and caching.
-   **Socket.io Client**: Real-time bidirectional communication.
-   **React Hook Form + Zod**: Performant form handling and validation.

### Backend
-   **Node.js**: JavaScript runtime.
-   **Express**: Minimalist web framework.
-   **PostgreSQL** (Neon): Managed SQL database.
-   **Prisma ORM**: Type-safe database access.
-   **Socket.io**: Real-time event server.
-   **Jest**: Unit testing framework.

## ⚙️ Setup Instructions

### Prerequisites
-   Node.js (v18+)
-   PostgreSQL Database URL (e.g., from Neon.tech).

### 1. Clone the Repository
```bash
git clone <repository-url>
cd task-manager
```

### 2. Backward Setup
```bash
cd server
npm install
```

**Configuration**:
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your values (Database URL, Secrets, etc.).

**Initialize Database**:
```bash
npx prisma generate
npx prisma db push
```

**Start Server**:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
```

**Configuration**:
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and set `VITE_API_URL` to your backend URL (e.g., `http://localhost:3000`).

**Start Client**:
```bash
npm run dev
```

## 🚀 Deployment Guide

### Backend (Render.com)
1.  Create a new **Web Service** on Render.
2.  Connect your repository.
3.  **Root Directory**: `server`
4.  **Build Command**: `npm install && npx prisma generate && npm run build`
5.  **Start Command**: `npm start`
6.  **Environment Variables**:
    -   `DATABASE_URL`: Connection string from your database provider (e.g., Neon).
    -   `JWT_SECRET`: A strong random string.
    -   `FRONTEND_URL`: Your Vercel frontend URL (e.g., `https://your-app.vercel.app`).

### Frontend (Vercel)
1.  Create a new **Project** on Vercel.
2.  Connect your repository.
3.  **Root Directory**: `client`
4.  **Framework Preset**: Vite
5.  **Build Command**: `npm run build`
6.  **Output Directory**: `dist`
7.  **Environment Variables**:
    -   `VITE_API_URL`: Your Render backend URL (e.g., `https://your-app.onrender.com`).

## 📡 API Contract

### Authentication
-   `POST /api/auth/register`: Create a new user.
-   `POST /api/auth/login`: Authenticate and receive cookie.
-   `POST /api/auth/logout`: clear session.
-   `PUT /api/auth/profile`: Update user profile (Protected).
-   `GET /api/auth/users`: Get list of all users for assignment (Protected).

### Tasks
-   `GET /api/tasks`: Fetch all tasks (Protected).
-   `POST /api/tasks`: Create a new task (Protected).
-   `PUT /api/tasks/:id`: Update a task (Protected).
-   `DELETE /api/tasks/:id`: Delete a task (Protected).

## 🏗 Architecture Overview

The backend follows a **Layered Architecture**:
1.  **Controllers**: Handle HTTP requests, parse body, and send responses.
2.  **Services**: Contain business logic (validation, permission checks, Socket.io events).
3.  **Repositories**: Handle direct database interactions using Prisma.

**Permissions & Visibility**:
-   **Data Visibility**: The `TaskRepository` enforces that users can only fetch tasks where they are either the `creator` or the `assignee`.
-   **Authorization**: The `TaskService` checks user IDs before performing updates or deletions. Cross-user editing is blocked unless you are the assignee.

**Real-Time Integration**:
Socket.io is integrated directly into the `TaskService`. When a task is created (`createTask`), `io.emit('task:created', newTask)` is called. The frontend `useSocket` hook listens for these events and invalidates React Query keys, causing an instant re-fetch of the data.

## ✅ Design Decisions

-   **JWT in HttpOnly Cookie**: Chosen over localStorage for better security against XSS.
-   **React Query**: Used instead of Redux because most state is server-state (tasks list). Query handles caching and background updates perfectly.
-   **Prisma**: Chosen for its excellent TypeScript integration and intuitive schema definition.
