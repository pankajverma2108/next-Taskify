
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
- **MySQL** with **Prisma ORM**

---

## 📦 Setup & Installation

### Prerequisites
- Node.js (https://nodejs.org/)
- MySQL & MySQL Workbench

### Installation Steps

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### Environment Variables
Create a `.env` file and add:
- `DATABASE_URL`
- `CLERK_API_KEYS`
- `STRIPE_API_KEYS`
- `UNSPLASH_ACCESS_KEY`

---
