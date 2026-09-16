
# Taskify

**Taskify** is a modern, flexible, and visually intuitive task management application built on the Kanban methodology. It supports both individual and team collaboration with advanced features like real-time updates, billing via Stripe, and an elegant, responsive UI.

---

## 🚀 Features

- 📋 Task organization via Boards, Lists, and Cards
- 👥 User registration and authentication via Clerk
- 🏢 Workspace & organization management
- 📷 Unsplash API for board cover images
- 🔍 Activity log and audit tracking
- 💳 Stripe payment integration for premium features
- 📂 Drag-and-drop reordering for lists and cards
- 🔒 Role-based access and user invitations
- 🌐 Responsive and intuitive UI

---

## 🛠️ Tech Stack

### Frontend
- **Next.js**, **React**, **TypeScript**
- **Tailwind CSS** for styling
- **Clerk** for authentication
- **Unsplash API** for visuals

### Backend
- **Node.js**, **Express.js**
- **PostgreSQL** with **Prisma ORM**

---

## 📦 Setup & Installation

### Prerequisites
- Node.js (https://nodejs.org/)
- PostgreSQL

### Installation Steps

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

For a fresh PostgreSQL database, set `DATABASE_URL` in `.env` using a connection string such as:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
```

Use `npx prisma migrate deploy` when applying committed migrations in a deployment environment.

### Environment Variables
Create a `.env` file and add:
- `DATABASE_URL`
- Clerk environment variables required by the application
- `STRIPE_API_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`
- `NEXT_PUBLIC_APP_URL`

---
