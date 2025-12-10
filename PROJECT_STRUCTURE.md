# LMS Platform - Full Stack Architecture

## Project Structure

```
lms-platform/
├── apps/
│   ├── web/                              # React Frontend (Vite + React + TS)
│   │   ├── public/
│   │   │   ├── favicon.ico
│   │   │   └── robots.txt
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   │   ├── images/
│   │   │   │   └── fonts/
│   │   │   ├── components/
│   │   │   │   ├── ui/                   # shadcn components
│   │   │   │   │   ├── button.tsx
│   │   │   │   │   ├── card.tsx
│   │   │   │   │   ├── dialog.tsx
│   │   │   │   │   ├── form.tsx
│   │   │   │   │   ├── input.tsx
│   │   │   │   │   ├── select.tsx
│   │   │   │   │   ├── textarea.tsx
│   │   │   │   │   ├── toast.tsx
│   │   │   │   │   ├── badge.tsx
│   │   │   │   │   ├── avatar.tsx
│   │   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   │   ├── table.tsx
│   │   │   │   │   ├── tabs.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── layout/
│   │   │   │   │   ├── Header.tsx
│   │   │   │   │   ├── Footer.tsx
│   │   │   │   │   ├── Sidebar.tsx
│   │   │   │   │   ├── MainLayout.tsx
│   │   │   │   │   ├── StudentLayout.tsx
│   │   │   │   │   ├── TeacherLayout.tsx
│   │   │   │   │   └── AdminLayout.tsx
│   │   │   │   ├── auth/
│   │   │   │   │   ├── LoginForm.tsx
│   │   │   │   │   ├── RegisterForm.tsx
│   │   │   │   │   ├── ForgotPasswordForm.tsx
│   │   │   │   │   ├── ResetPasswordForm.tsx
│   │   │   │   │   ├── ProtectedRoute.tsx
│   │   │   │   │   └── RoleGuard.tsx
│   │   │   │   ├── teacher/
│   │   │   │   │   ├── class/
│   │   │   │   │   │   ├── ClassForm.tsx
│   │   │   │   │   │   ├── ClassCard.tsx
│   │   │   │   │   │   ├── ClassList.tsx
│   │   │   │   │   │   ├── ClassStats.tsx
│   │   │   │   │   │   └── ModuleManager.tsx
│   │   │   │   │   ├── lesson/
│   │   │   │   │   │   ├── LessonForm.tsx
│   │   │   │   │   │   ├── LessonCard.tsx
│   │   │   │   │   │   ├── LessonList.tsx
│   │   │   │   │   │   ├── YouTubeUrlInput.tsx
│   │   │   │   │   │   └── ResourceUploader.tsx
│   │   │   │   │   ├── student/
│   │   │   │   │   │   ├── StudentList.tsx
│   │   │   │   │   │   ├── StudentProgress.tsx
│   │   │   │   │   │   └── EnrollmentsList.tsx
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   │   ├── StatsCard.tsx
│   │   │   │   │   │   ├── RevenueChart.tsx
│   │   │   │   │   │   └── RecentEnrollments.tsx
│   │   │   │   │   └── announcement/
│   │   │   │   │       ├── AnnouncementForm.tsx
│   │   │   │   │       └── AnnouncementList.tsx
│   │   │   │   ├── student/
│   │   │   │   │   ├── browse/
│   │   │   │   │   │   ├── ClassCard.tsx
│   │   │   │   │   │   ├── ClassGrid.tsx
│   │   │   │   │   │   ├── ClassFilter.tsx
│   │   │   │   │   │   └── SearchBar.tsx
│   │   │   │   │   ├── class/
│   │   │   │   │   │   ├── ClassDetail.tsx
│   │   │   │   │   │   ├── ClassCurriculum.tsx
│   │   │   │   │   │   ├── ClassReviews.tsx
│   │   │   │   │   │   └── EnrollButton.tsx
│   │   │   │   │   ├── lesson/
│   │   │   │   │   │   ├── YouTubePlayer.tsx
│   │   │   │   │   │   ├── LessonContent.tsx
│   │   │   │   │   │   ├── LessonResources.tsx
│   │   │   │   │   │   ├── LessonNavigation.tsx
│   │   │   │   │   │   └── ProgressIndicator.tsx
│   │   │   │   │   ├── enrollment/
│   │   │   │   │   │   ├── EnrollmentCard.tsx
│   │   │   │   │   │   ├── MyClassesList.tsx
│   │   │   │   │   │   └── SubscriptionStatus.tsx
│   │   │   │   │   ├── payment/
│   │   │   │   │   │   ├── PaymentForm.tsx
│   │   │   │   │   │   ├── PaymentHistory.tsx
│   │   │   │   │   │   ├── InvoiceDownload.tsx
│   │   │   │   │   │   └── UpcomingPayments.tsx
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   │   ├── ProgressOverview.tsx
│   │   │   │   │   │   ├── ContinueLearning.tsx
│   │   │   │   │   │   └── Achievements.tsx
│   │   │   │   │   └── discussion/
│   │   │   │   │       ├── DiscussionThread.tsx
│   │   │   │   │       ├── DiscussionList.tsx
│   │   │   │   │       ├── DiscussionForm.tsx
│   │   │   │   │       └── ReplyForm.tsx
│   │   │   │   ├── admin/
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   │   ├── StatsOverview.tsx
│   │   │   │   │   │   └── RecentActivity.tsx
│   │   │   │   │   ├── user/
│   │   │   │   │   │   ├── UserTable.tsx
│   │   │   │   │   │   ├── UserForm.tsx
│   │   │   │   │   │   └── UserActions.tsx
│   │   │   │   │   ├── class/
│   │   │   │   │   │   ├── ClassApproval.tsx
│   │   │   │   │   │   └── ClassModeration.tsx
│   │   │   │   │   ├── payment/
│   │   │   │   │   │   ├── PaymentTable.tsx
│   │   │   │   │   │   └── RevenueReport.tsx
│   │   │   │   │   └── teacher/
│   │   │   │   │       └── TeacherApproval.tsx
│   │   │   │   └── shared/
│   │   │   │       ├── Loader.tsx
│   │   │   │       ├── ErrorBoundary.tsx
│   │   │   │       ├── Pagination.tsx
│   │   │   │       ├── EmptyState.tsx
│   │   │   │       ├── ConfirmDialog.tsx
│   │   │   │       └── NotificationBell.tsx
│   │   │   ├── pages/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── LoginPage.tsx
│   │   │   │   │   ├── RegisterPage.tsx
│   │   │   │   │   ├── ForgotPasswordPage.tsx
│   │   │   │   │   ├── ResetPasswordPage.tsx
│   │   │   │   │   └── VerifyEmailPage.tsx
│   │   │   │   ├── teacher/
│   │   │   │   │   ├── DashboardPage.tsx
│   │   │   │   │   ├── ClassesPage.tsx
│   │   │   │   │   ├── CreateClassPage.tsx
│   │   │   │   │   ├── EditClassPage.tsx
│   │   │   │   │   ├── ClassDetailPage.tsx
│   │   │   │   │   ├── LessonsPage.tsx
│   │   │   │   │   ├── CreateLessonPage.tsx
│   │   │   │   │   ├── EditLessonPage.tsx
│   │   │   │   │   ├── StudentsPage.tsx
│   │   │   │   │   ├── EarningsPage.tsx
│   │   │   │   │   └── ProfilePage.tsx
│   │   │   │   ├── student/
│   │   │   │   │   ├── DashboardPage.tsx
│   │   │   │   │   ├── BrowseClassesPage.tsx
│   │   │   │   │   ├── ClassDetailPage.tsx
│   │   │   │   │   ├── LessonViewPage.tsx
│   │   │   │   │   ├── MyClassesPage.tsx
│   │   │   │   │   ├── PaymentsPage.tsx
│   │   │   │   │   ├── DiscussionsPage.tsx
│   │   │   │   │   └── ProfilePage.tsx
│   │   │   │   ├── admin/
│   │   │   │   │   ├── DashboardPage.tsx
│   │   │   │   │   ├── UsersPage.tsx
│   │   │   │   │   ├── TeachersPage.tsx
│   │   │   │   │   ├── ClassesPage.tsx
│   │   │   │   │   ├── PaymentsPage.tsx
│   │   │   │   │   └── ReportsPage.tsx
│   │   │   │   ├── HomePage.tsx
│   │   │   │   ├── AboutPage.tsx
│   │   │   │   ├── ContactPage.tsx
│   │   │   │   └── NotFoundPage.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useToast.ts
│   │   │   │   ├── useDebounce.ts
│   │   │   │   ├── useLocalStorage.ts
│   │   │   │   ├── useYouTubePlayer.ts
│   │   │   │   └── useVideoProgress.ts
│   │   │   ├── lib/
│   │   │   │   ├── trpc.ts               # tRPC client setup
│   │   │   │   ├── queryClient.ts        # TanStack Query client
│   │   │   │   ├── utils.ts              # cn() helper
│   │   │   │   └── youtube.ts            # YouTube utilities
│   │   │   ├── store/
│   │   │   │   ├── authStore.ts          # Zustand store
│   │   │   │   └── index.ts
│   │   │   ├── types/
│   │   │   │   ├── auth.types.ts
│   │   │   │   ├── class.types.ts
│   │   │   │   ├── lesson.types.ts
│   │   │   │   └── index.ts
│   │   │   ├── utils/
│   │   │   │   ├── formatters.ts
│   │   │   │   ├── validators.ts
│   │   │   │   ├── constants.ts
│   │   │   │   └── youtube-helpers.ts
│   │   │   ├── styles/
│   │   │   │   └── globals.css
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── vite-env.d.ts
│   │   ├── .env.example
│   │   ├── .env.development
│   │   ├── .eslintrc.cjs
│   │   ├── components.json               # shadcn config
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── postcss.config.js
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   ├── tsconfig.node.json
│   │   └── vite.config.ts
│   │
│   └── server/                            # Express + tRPC Backend
│       ├── src/
│       │   ├── config/
│       │   │   ├── database.ts            # MongoDB connection
│       │   │   ├── env.ts                 # Environment variables
│       │   │   ├── jwt.ts                 # JWT config
│       │   │   ├── cors.ts                # CORS config
│       │   │   └── payment.ts             # Payment gateway config
│       │   ├── middleware/
│       │   │   ├── auth.middleware.ts
│       │   │   ├── error.middleware.ts
│       │   │   ├── validation.middleware.ts
│       │   │   ├── rateLimit.middleware.ts
│       │   │   └── logger.middleware.ts
│       │   ├── models/
│       │   │   ├── User.model.ts
│       │   │   ├── Class.model.ts
│       │   │   ├── Lesson.model.ts
│       │   │   ├── Enrollment.model.ts
│       │   │   ├── Payment.model.ts
│       │   │   ├── LessonProgress.model.ts
│       │   │   ├── Discussion.model.ts
│       │   │   ├── Notification.model.ts
│       │   │   ├── Announcement.model.ts
│       │   │   ├── ActivityLog.model.ts
│       │   │   ├── Coupon.model.ts
│       │   │   └── index.ts
│       │   ├── routers/                   # tRPC routers
│       │   │   ├── auth.router.ts         # Auth operations
│       │   │   ├── user.router.ts         # User profile
│       │   │   ├── teacher/
│       │   │   │   ├── class.router.ts    # Teacher class management
│       │   │   │   ├── lesson.router.ts   # Teacher lesson management
│       │   │   │   ├── student.router.ts  # Teacher's students
│       │   │   │   └── earnings.router.ts # Teacher earnings
│       │   │   ├── student/
│       │   │   │   ├── class.router.ts    # Browse/view classes
│       │   │   │   ├── enrollment.router.ts
│       │   │   │   ├── lesson.router.ts   # View lessons
│       │   │   │   ├── progress.router.ts
│       │   │   │   └── payment.router.ts
│       │   │   ├── admin/
│       │   │   │   ├── user.router.ts
│       │   │   │   ├── class.router.ts
│       │   │   │   ├── payment.router.ts
│       │   │   │   └── report.router.ts
│       │   │   ├── discussion.router.ts
│       │   │   ├── notification.router.ts
│       │   │   └── index.ts               # Root router
│       │   ├── services/
│       │   │   ├── auth.service.ts        # Authentication logic
│       │   │   ├── user.service.ts
│       │   │   ├── class.service.ts
│       │   │   ├── lesson.service.ts
│       │   │   ├── enrollment.service.ts
│       │   │   ├── payment.service.ts     # Payment gateway integration
│       │   │   ├── subscription.service.ts # Subscription management
│       │   │   ├── email.service.ts       # Email notifications
│       │   │   ├── youtube.service.ts     # YouTube URL validation
│       │   │   ├── notification.service.ts
│       │   │   └── analytics.service.ts
│       │   ├── utils/
│       │   │   ├── jwt.utils.ts
│       │   │   ├── bcrypt.utils.ts
│       │   │   ├── youtube.utils.ts       # Extract video ID, validate
│       │   │   ├── validation.utils.ts
│       │   │   ├── slug.utils.ts
│       │   │   ├── logger.ts
│       │   │   └── errorHandler.ts
│       │   ├── validators/                # Zod schemas
│       │   │   ├── auth.validator.ts
│       │   │   ├── user.validator.ts
│       │   │   ├── class.validator.ts
│       │   │   ├── lesson.validator.ts
│       │   │   ├── enrollment.validator.ts
│       │   │   └── payment.validator.ts
│       │   ├── types/
│       │   │   ├── auth.types.ts
│       │   │   ├── user.types.ts
│       │   │   ├── class.types.ts
│       │   │   ├── context.types.ts       # tRPC context types
│       │   │   └── index.ts
│       │   ├── trpc/
│       │   │   ├── context.ts             # Create tRPC context
│       │   │   ├── trpc.ts                # tRPC instance & procedures
│       │   │   └── router.ts              # Export appRouter
│       │   ├── jobs/                      # Background jobs
│       │   │   ├── subscriptionCheck.job.ts
│       │   │   └── paymentReminder.job.ts
│       │   ├── app.ts                     # Express app setup
│       │   └── index.ts                   # Server entry point
│       ├── .env.example
│       ├── .env.development
│       ├── .eslintrc.cjs
│       ├── nodemon.json
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── shared/                            # Shared types & utilities
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── auth.types.ts
│   │   │   │   ├── user.types.ts
│   │   │   │   ├── class.types.ts
│   │   │   │   ├── lesson.types.ts
│   │   │   │   ├── enrollment.types.ts
│   │   │   │   ├── payment.types.ts
│   │   │   │   ├── discussion.types.ts
│   │   │   │   └── index.ts
│   │   │   ├── schemas/                   # Zod schemas
│   │   │   │   ├── auth.schema.ts
│   │   │   │   ├── user.schema.ts
│   │   │   │   ├── class.schema.ts
│   │   │   │   ├── lesson.schema.ts
│   │   │   │   ├── enrollment.schema.ts
│   │   │   │   ├── payment.schema.ts
│   │   │   │   └── index.ts
│   │   │   ├── constants/
│   │   │   │   ├── roles.ts
│   │   │   │   ├── status.ts
│   │   │   │   ├── payment.ts
│   │   │   │   └── index.ts
│   │   │   ├── utils/
│   │   │   │   ├── formatters.ts
│   │   │   │   ├── validators.ts
│   │   │   │   └── youtube.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── eslint-config/
│   │   ├── base.js
│   │   ├── react.js
│   │   ├── node.js
│   │   └── package.json
│   │
│   └── typescript-config/
│       ├── base.json
│       ├── react.json
│       ├── node.json
│       └── package.json
│
├── .env.example
├── .gitignore
├── .npmrc
├── package.json                           # Root package.json (workspace)
├── pnpm-workspace.yaml
├── README.md
└── LICENSE
```

---

## Technology Stack

### Frontend (apps/web)
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query + tRPC Client
- **Routing**: React Router v6
- **Form Handling**: React Hook Form + Zod
- **Video Player**: YouTube IFrame API / react-youtube

### Backend (apps/server)
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **API**: tRPC
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **File Upload**: Multer (for profile pictures, resources)
- **Email**: Nodemailer
- **Payment**: Stripe/Razorpay
- **Logging**: Winston

### Shared (packages/shared)
- **Types**: Shared TypeScript types
- **Schemas**: Zod validation schemas
- **Constants**: Shared constants & enums
- **Utils**: Utility functions

---

## Initialization Setup Flow

### Phase 1: Project Setup

#### 1.1 Initialize Root Project
```bash
# Create project directory
mkdir lms-platform && cd lms-platform

# Initialize pnpm workspace
pnpm init

# Create workspace structure
mkdir -p apps/{web,server} packages/{shared,eslint-config,typescript-config}
```

#### 1.2 Configure Workspace
Create `pnpm-workspace.yaml`:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

#### 1.3 Root package.json
```json
{
  "name": "lms-platform",
  "private": true,
  "scripts": {
    "dev": "pnpm --parallel --filter \"./apps/**\" dev",
    "dev:web": "pnpm --filter web dev",
    "dev:server": "pnpm --filter server dev",
    "build": "pnpm --filter \"./apps/**\" build",
    "lint": "pnpm --filter \"./apps/**\" lint",
    "type-check": "pnpm --filter \"./apps/**\" type-check"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "prettier": "^3.1.0"
  }
}
```

---

### Phase 2: Backend Setup (apps/server)

#### 2.1 Initialize Server
```bash
cd apps/server
pnpm init
```

#### 2.2 Install Dependencies
```bash
# Core
pnpm add express cors dotenv

# tRPC
pnpm add @trpc/server zod

# Database
pnpm add mongoose

# Authentication
pnpm add jsonwebtoken bcryptjs
pnpm add -D @types/jsonwebtoken @types/bcryptjs

# Utilities
pnpm add slugify validator
pnpm add winston

# Dev dependencies
pnpm add -D typescript @types/node @types/express @types/cors
pnpm add -D tsx nodemon
pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

#### 2.3 TypeScript Config (server/tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### 2.4 Server Package Scripts
```json
{
  "scripts": {
    "dev": "nodemon --exec tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "type-check": "tsc --noEmit",
    "lint": "eslint src --ext .ts"
  }
}
```

---

### Phase 3: Frontend Setup (apps/web)

#### 3.1 Initialize Vite + React
```bash
cd apps/web
pnpm create vite . --template react-ts
```

#### 3.2 Install Dependencies
```bash
# Core UI
pnpm add react-router-dom

# tRPC Client
pnpm add @trpc/client @trpc/react-query @tanstack/react-query

# State & Forms
pnpm add zustand
pnpm add react-hook-form @hookform/resolvers zod

# Styling
pnpm add tailwindcss postcss autoprefixer
pnpm add clsx tailwind-merge class-variance-authority
pnpm add lucide-react

# YouTube
pnpm add react-youtube

# Utilities
pnpm add axios date-fns

# Dev dependencies
pnpm add -D @types/react @types/react-dom
pnpm add -D eslint eslint-plugin-react-hooks eslint-plugin-react-refresh
```

#### 3.3 Setup shadcn/ui
```bash
pnpm dlx shadcn-ui@latest init
```

Answer prompts:
- Style: Default
- Base color: Slate
- CSS variables: Yes

#### 3.4 Tailwind Config (web/tailwind.config.ts)
```typescript
import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config
```

#### 3.5 Vite Config (web/vite.config.ts)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
```

---

### Phase 4: Shared Package Setup

#### 4.1 Initialize Shared Package
```bash
cd packages/shared
pnpm init
```

#### 4.2 Install Dependencies
```bash
pnpm add zod
pnpm add -D typescript
```

#### 4.3 TypeScript Config (shared/tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### 4.4 Package.json
```json
{
  "name": "@lms/shared",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "type-check": "tsc --noEmit"
  }
}
```

---

### Phase 5: Environment Variables

#### 5.1 Server .env.example
```env
# Server
NODE_ENV=development
PORT=4000

# Database
MONGODB_URI=mongodb://localhost:27017/lms-platform

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@lmsplatform.com

# Payment Gateway (Stripe/Razorpay)
PAYMENT_GATEWAY=stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# YouTube API (optional, for validation)
YOUTUBE_API_KEY=your-youtube-api-key

# Platform Fee (percentage)
PLATFORM_FEE_PERCENTAGE=10
```

#### 5.2 Frontend .env.example
```env
VITE_API_URL=http://localhost:4000
VITE_APP_NAME=LMS Platform
VITE_YOUTUBE_API_KEY=your-youtube-api-key
```

---

### Phase 6: Core Implementation Order

#### 6.1 Database Models (server/src/models/)
1. User.model.ts
2. Class.model.ts
3. Lesson.model.ts
4. Enrollment.model.ts
5. Payment.model.ts
6. LessonProgress.model.ts
7. Discussion.model.ts
8. Notification.model.ts
9. Announcement.model.ts
10. ActivityLog.model.ts
11. Coupon.model.ts

#### 6.2 tRPC Setup (server/src/trpc/)
1. Create tRPC instance (trpc.ts)
2. Create context with auth (context.ts)
3. Setup root router (router.ts)

#### 6.3 Services Layer (server/src/services/)
1. auth.service.ts - Registration, login, JWT
2. user.service.ts - Profile management
3. class.service.ts - Class CRUD
4. lesson.service.ts - Lesson CRUD + YouTube validation
5. enrollment.service.ts - Enrollment logic
6. payment.service.ts - Payment gateway integration
7. subscription.service.ts - Monthly access control
8. youtube.service.ts - YouTube URL validation & embed
9. email.service.ts - Notifications

#### 6.4 tRPC Routers (server/src/routers/)
1. auth.router.ts
2. user.router.ts
3. teacher/class.router.ts
4. teacher/lesson.router.ts
5. student/class.router.ts
6. student/enrollment.router.ts
7. student/lesson.router.ts
8. student/payment.router.ts
9. admin/* routers

#### 6.5 Frontend Setup (apps/web/src/)

**1. Setup tRPC Client (lib/trpc.ts)**
```typescript
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../server/src/trpc/router';

export const trpc = createTRPCReact<AppRouter>();
```

**2. Setup Query Client (lib/queryClient.ts)**
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});
```

**3. Auth Store (store/authStore.ts)**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

**4. Component Development Order**
1. Layout components (Header, Footer, Sidebar)
2. Auth components (Login, Register)
3. shadcn UI components
4. Teacher dashboard & class management
5. Lesson management with YouTube integration
6. Student class browsing
7. YouTube video player with access control
8. Payment integration
9. Progress tracking
10. Discussions

---

### Phase 7: Key Features Implementation

#### 7.1 YouTube Video Integration

**Backend (lesson.service.ts)**
```typescript
export const extractYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

export const createLesson = async (data: CreateLessonInput) => {
  const videoId = extractYouTubeVideoId(data.videoUrl);
  if (!videoId) throw new Error('Invalid YouTube URL');

  // Store as unlisted/private video URL
  return await Lesson.create({
    ...data,
    videoUrl: data.videoUrl,
    videoId,
  });
};
```

**Frontend (YouTubePlayer.tsx)**
```typescript
import YouTube from 'react-youtube';

export const YouTubePlayer = ({ videoId, hasAccess }: Props) => {
  if (!hasAccess) {
    return <LockedOverlay />;
  }

  return (
    <YouTube
      videoId={videoId}
      opts={{
        playerVars: {
          autoplay: 0,
          modestbranding: 1,
        },
      }}
      onStateChange={trackProgress}
    />
  );
};
```

#### 7.2 Monthly Access Control

**Backend (enrollment.service.ts)**
```typescript
export const checkLessonAccess = async (
  studentId: string,
  lessonId: string
): Promise<boolean> => {
  const lesson = await Lesson.findById(lessonId);
  const enrollment = await Enrollment.findOne({
    studentId,
    classId: lesson.classId,
    status: 'active',
  });

  if (!enrollment) return false;

  // Check if student has paid for the month this lesson belongs to
  return enrollment.unlockedMonths.includes(lesson.monthNumber);
};
```

#### 7.3 Payment Flow
1. Student enrolls in class (free enrollment)
2. Student makes monthly payment
3. Backend unlocks lessons for that month
4. Update `enrollment.unlockedMonths` array
5. Student can access lessons for paid months

---

## Development Workflow

### Step-by-Step Start

1. **Install all dependencies**
```bash
pnpm install
```

2. **Start MongoDB**
```bash
mongod
```

3. **Start backend**
```bash
pnpm dev:server
```

4. **Start frontend**
```bash
pnpm dev:web
```

5. **Access application**
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

---

## Next Steps After Setup

1. Implement authentication system
2. Create user roles & permissions
3. Build teacher class management
4. Implement YouTube video embedding
5. Setup payment gateway (Stripe/Razorpay)
6. Create subscription management
7. Build student enrollment flow
8. Implement progress tracking
9. Add discussion forums
10. Setup email notifications
11. Create admin dashboard
12. Add analytics & reporting

---

## Important Notes

### YouTube Integration Strategy
- Teachers upload videos to YouTube as **Unlisted** (not Private)
- Teachers paste YouTube URL in LMS
- LMS extracts video ID and stores it
- Students can only watch through LMS if they've paid for that month
- Video embeds are protected by checking `enrollment.unlockedMonths`

### Access Control Logic
```
Can Access Lesson IF:
  - Student is enrolled in class
  - Enrollment status is 'active'
  - lesson.monthNumber is in enrollment.unlockedMonths[]
  OR
  - lesson.isFree === true (preview lessons)
```

### Payment Flow
```
1. Student enrolls (free)
2. Student pays for Month 1
3. Backend: Add 1 to enrollment.unlockedMonths
4. Student can access all lessons where monthNumber === 1
5. Next month: Repeat for Month 2
```

This structure provides a scalable, maintainable foundation for your LMS platform!
