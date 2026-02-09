
# React Dashboard with Role-Based Access Control

This is a Next.js application featuring:
- **Authentication**: NextAuth.js (v5) with Credential provider.
- **Database**: PostgreSQL (Neon DB) accessed via Prisma ORM.
- **Authorization**: Role-based access (Admin/User) with approval workflow.
- **Styling**: Tailwind CSS.

## Features

- **Landing Page**: Modern UI introduction.
- **Sign Up / Login**: Secure authentication flow.
- **Admin Dashboard**: View pending users, Approve or Reject access.
- **User Dashboard**: View account status (Pending/Approved).

## Getting Started

### 1. Environment Setup

Copy `.env` and fill in your credentials:

```bash
DATABASE_URL="postgresql://user:password@host.neon.tech/neondb?sslmode=require"
AUTH_SECRET="your_generated_secret"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Migration

Push the Prisma schema to your Neon database:

```bash
npx prisma db push
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deployment

### Deploy to Vercel

1. Push this code to a GitHub repository.
2. Import the project into Vercel.
3. Add the `DATABASE_URL` and `AUTH_SECRET` environment variables in Vercel.
4. Deploy.

## Project Structure

- `app/`: Next.js App Router pages.
- `actions/`: Server Actions for Auth and Admin logic.
- `lib/prisma.ts`: Prisma Client singleton.
- `prisma/schema.prisma`: Database schema definition.
- `auth.ts` / `auth.config.ts`: NextAuth configuration.
