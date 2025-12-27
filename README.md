# CRM System

A professional, minimalistic, lightweight CRM built with Next.js, TypeScript, and PostgreSQL.

## Features

- **Dashboard**: Overview with KPIs and recent activity
- **Contacts**: Manage contacts with full CRUD operations
- **Leads**: Track leads with status, priority, and scoring
- **Inbox**: View all conversations grouped by contact
- **Tasks**: Manage tasks linked to contacts or leads
- **Settings**: Application configuration and health check

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: Cookie-based (HttpOnly)

## Prerequisites

- Node.js 20+
- PostgreSQL database
- npm or yarn

## Local Development

### 1. Clone and Install

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL`: PostgreSQL connection string
- `CRM_ADMIN_EMAIL`: Admin email for login
- `CRM_ADMIN_PASSWORD`: Admin password for login
- `SESSION_SECRET`: Secret key for session encryption

### 3. Set Up Database

The application expects an existing PostgreSQL database with the following tables:
- `contacts`
- `leads`
- `messages`
- `tasks`

See `prisma/schema.prisma` for the exact schema.

Generate Prisma Client:

```bash
npm run db:generate
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with your admin credentials.

## Deployment on EasyPanel

### 1. Prepare Your Repository

Ensure your code is pushed to a GitHub repository.

### 2. Create New Application in EasyPanel

1. Go to your EasyPanel dashboard
2. Click "New Application"
3. Select "Docker" or "GitHub" deployment method

### 3. Configure Environment Variables

In EasyPanel, add the following environment variables:

```
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
CRM_ADMIN_EMAIL=your-admin@email.com
CRM_ADMIN_PASSWORD=your-secure-password
SESSION_SECRET=your-random-secret-key
NODE_ENV=production
```

### 4. Deploy

If using GitHub deployment:
- Connect your repository
- Set build command: `npm run build`
- Set start command: `npm start`
- Set Dockerfile path: `./Dockerfile`

If using Docker directly:
- EasyPanel will build from the Dockerfile
- Ensure your database is accessible from the container

### 5. Database Connection

Make sure your PostgreSQL database is:
- Accessible from the EasyPanel server
- Contains the required tables (see Prisma schema)
- Connection string is correctly formatted in `DATABASE_URL`

### 6. Verify Deployment

Once deployed, access your application and:
1. Navigate to the login page
2. Log in with your admin credentials
3. Check the Settings page for health status

## Project Structure

```
.
├── app/
│   ├── actions/          # Server actions
│   ├── app/              # Protected app routes
│   ├── login/            # Login page
│   └── layout.tsx        # Root layout
├── components/
│   ├── ui/               # shadcn/ui components
│   └── *.tsx             # Feature components
├── lib/
│   ├── auth.ts           # Authentication utilities
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Utility functions
├── prisma/
│   └── schema.prisma     # Database schema
├── middleware.ts         # Auth middleware
└── Dockerfile            # Production Docker image
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema to database (development)
- `npm run db:studio` - Open Prisma Studio

## Security Notes

- Admin credentials are stored in environment variables
- Sessions use HttpOnly cookies
- All user inputs are validated with Zod
- Database queries use Prisma (SQL injection protection)

## Support

For issues or questions, please check:
- Next.js documentation: https://nextjs.org/docs
- Prisma documentation: https://www.prisma.io/docs
- shadcn/ui documentation: https://ui.shadcn.com

