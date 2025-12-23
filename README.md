# FairStock

FairStock is a full-stack web application built with **React (JSX)** on the frontend and **Node.js + TypeScript** on the backend.  
It uses **Prisma ORM** with a **MariaDB/MySQL** database and **JWT authentication**.

---

## Tech Stack

### Frontend
- React (JSX)
- Vite / CRA
- Fetch API or Axios

### Backend
- Node.js
- TypeScript
- Express
- Prisma ORM
- MariaDB / MySQL
- JSON Web Tokens (JWT)

---

## Prerequisites

Make sure the following are installed:

- Node.js **v18+**
- npm or yarn
- MariaDB or MySQL
- Git

Check versions:

```bash
node -v
npm -v
mysql --version

DATABASE_URL="mysql://root:Password@localhost:3306/Database_name"
DATABASE_USER="root"
DATABASE_PASSWORD=""
DATABASE_NAME="FairStock"
DATABASE_HOST="localhost"
DATABASE_PORT=3306
JWT_SECRET=JWTToken
JWT_EXPIRES_IN=7d
PORT=3001
```
Database Setup (Prisma)

# From the backend directory:

- npm install


# Generate Prisma client:

- npx prisma generate


# If using migrations:

- npx prisma migrate dev


# If the database already exists:

- npx prisma db pull
  
# Running Backend
- npm run dev

# Running Frontend
- npm install
- npm run dev
---
# Common Issues
- Database Connection Error

# Error example:

- Access denied for user ''@'localhost'


# Fix:

- Check DATABASE_URL in backend/.env

- Ensure MariaDB/MySQL is running

- Verify credentials using MySQL CLI

# Prisma Client Errors

Run:

- npx prisma generate

# Environment Variables Not Loading

- Ensure this line exists in backend/src/lib/prisma.ts:

- import 'dotenv/config';

Recommended Run Order

1. Start the database

2. Start the backend server

3. Start the frontend application

4. Open the frontend in the browser

# Notes for Contributors

- Always start the backend first

# Ensure the database is running before login/signup

- Do not commit .env files

- Re-run Prisma generate after schema changes
