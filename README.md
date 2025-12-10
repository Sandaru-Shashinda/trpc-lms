# LMS Platform

A modern Learning Management System built with React, TypeScript, tRPC, Express, and MongoDB.

## Features

- **Multiple User Roles**: Students, Teachers, and Admins
- **Class Management**: Teachers can create and manage multiple classes
- **Lesson Management**: Support for YouTube video lessons with access control
- **Enrollment System**: Students can enroll in multiple classes
- **Subscription-based Access**: Monthly payment system for lesson access
- **Progress Tracking**: Track student progress and completion
- **Discussion Forums**: Class and lesson discussions
- **Notifications**: Email and in-app notifications
- **Admin Dashboard**: User and content moderation

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite (Build tool)
- TailwindCSS + shadcn/ui
- tRPC Client
- TanStack Query (React Query)
- Zustand (State management)
- React Hook Form + Zod
- React YouTube Player

### Backend
- Node.js + TypeScript
- Express.js
- tRPC Server
- MongoDB + Mongoose
- JWT Authentication
- bcrypt for password hashing

### Shared
- Zod validation schemas
- Shared TypeScript types
- Common utilities

## Project Structure

```
lms-platform/
├── apps/
│   ├── web/          # React frontend
│   └── server/       # Express backend
├── packages/
│   └── shared/       # Shared types and schemas
├── package.json      # Root workspace config
└── pnpm-workspace.yaml
```

## Prerequisites

- Node.js >= 18.x
- npm or pnpm
- MongoDB >= 6.x

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

**Backend (.env)**
```bash
cp apps/server/.env.example apps/server/.env
```

Edit `apps/server/.env` and configure:
- MongoDB connection string
- JWT secret (must be at least 32 characters)
- CORS origin
- Email settings (optional)
- Payment gateway credentials (optional)

**Frontend (.env)**
```bash
cp apps/web/.env.example apps/web/.env
```

### 3. Start MongoDB

```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 4. Start Development Servers

**Option 1: Start both servers together**
```bash
npm run dev
```

**Option 2: Start separately**

Terminal 1 (Backend):
```bash
npm run dev:server
```

Terminal 2 (Frontend):
```bash
npm run dev:web
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Backend Health Check: http://localhost:4000/health
- tRPC Endpoint: http://localhost:4000/api/trpc

## Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run dev:web` - Start frontend only
- `npm run dev:server` - Start backend only
- `npm run build` - Build all apps
- `npm run lint` - Lint all apps
- `npm run type-check` - Type check all apps

### Backend (apps/server)
- `npm run dev` - Start dev server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run type-check` - TypeScript type checking
- `npm run lint` - Lint code

### Frontend (apps/web)
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code
- `npm run type-check` - TypeScript type checking

## Development Workflow

### 1. Create MongoDB Models
Start by creating Mongoose models in `apps/server/src/models/`:
- User.model.ts
- Class.model.ts
- Lesson.model.ts
- Enrollment.model.ts
- Payment.model.ts
- etc.

### 2. Create tRPC Routers
Define your API endpoints in `apps/server/src/routers/`:
- auth.router.ts
- user.router.ts
- teacher/class.router.ts
- student/enrollment.router.ts
- etc.

### 3. Create Services
Business logic goes in `apps/server/src/services/`:
- auth.service.ts
- class.service.ts
- enrollment.service.ts
- payment.service.ts
- youtube.service.ts
- etc.

### 4. Build Frontend Components
Create React components in `apps/web/src/components/`:
- Teacher dashboard
- Student class browser
- Video player with access control
- Payment forms
- etc.

### 5. Use tRPC Client
Frontend can now call backend APIs type-safely:

```typescript
import { trpc } from '@/lib/trpc';

function MyComponent() {
  const { data, isLoading } = trpc.classes.getAll.useQuery();

  return (
    // Your component
  );
}
```

## YouTube Video Integration

Teachers upload videos to YouTube as **Unlisted** (not Private) and add the YouTube URL to lessons. The LMS:

1. Extracts and stores the YouTube video ID
2. Embeds videos using YouTube IFrame API
3. Controls access based on student's monthly subscription
4. Tracks video progress and completion

**Access Control Logic:**
- Student must be enrolled in the class
- Student must have paid for the month containing that lesson
- Lessons tagged with `monthNumber` field
- Enrollment tracks `unlockedMonths` array
- Access granted when `monthNumber` is in `unlockedMonths[]`

## Payment Flow

1. Student enrolls in a class (free enrollment)
2. Student pays monthly fee for a specific month
3. Backend updates `enrollment.unlockedMonths` array
4. Student can now access all lessons for that month
5. Process repeats for subsequent months

## Project Documentation

- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Detailed architecture and folder structure
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Complete setup instructions with code examples

## Next Steps

1. ✅ Complete project setup (DONE)
2. Implement User model and authentication
3. Create Teacher class management
4. Build Student enrollment flow
5. Integrate payment gateway (Stripe/Razorpay)
6. Implement YouTube video player with access control
7. Add progress tracking
8. Create discussion forums
9. Build admin dashboard
10. Add email notifications

## Environment Variables

### Backend Required
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret (min 32 characters)
- `PORT` - Server port (default: 4000)
- `CORS_ORIGIN` - Frontend URL (default: http://localhost:3000)

### Backend Optional
- `SMTP_*` - Email configuration
- `STRIPE_*` / `RAZORPAY_*` - Payment gateway
- `YOUTUBE_API_KEY` - For YouTube URL validation

### Frontend
- `VITE_API_URL` - Backend API URL (default: http://localhost:4000)
- `VITE_APP_NAME` - Application name

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### TypeScript Errors
```bash
# Type check all packages
npm run type-check
```

### Port Already in Use
- Backend: Change `PORT` in `apps/server/.env`
- Frontend: Change port in `apps/web/vite.config.ts`

### tRPC Type Errors
- Ensure backend is running
- Rebuild backend: `cd apps/server && npm run build`
- Restart frontend dev server

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
