# LMS Platform - Complete Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.x
- **pnpm** >= 8.x (or npm/yarn)
- **MongoDB** >= 6.x
- **Git**

### Install Prerequisites

```bash
# Install Node.js (using nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Install pnpm
npm install -g pnpm

# Install MongoDB (macOS)
brew tap mongodb/brew
brew install mongodb-community@6.0
brew services start mongodb-community@6.0

# Verify installations
node --version
pnpm --version
mongod --version
```

---

## Complete Project Setup

### Step 1: Initialize Project Structure

```bash
# Create root directory
mkdir lms-platform && cd lms-platform

# Initialize root package.json
pnpm init

# Create directory structure
mkdir -p apps/web apps/server
mkdir -p packages/shared packages/eslint-config packages/typescript-config
```

### Step 2: Setup Workspace Configuration

Create `pnpm-workspace.yaml`:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

Create root `package.json`:
```json
{
  "name": "lms-platform",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "pnpm --parallel --filter \"./apps/**\" dev",
    "dev:web": "pnpm --filter web dev",
    "dev:server": "pnpm --filter server dev",
    "build": "pnpm --filter \"./apps/**\" build",
    "lint": "pnpm --filter \"./apps/**\" lint",
    "type-check": "pnpm --filter \"./apps/**\" type-check",
    "clean": "pnpm --filter \"./apps/**\" clean && rm -rf node_modules"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "prettier": "^3.1.0"
  }
}
```

Create `.gitignore`:
```
# Dependencies
node_modules/
.pnpm-store/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/
.next/
out/

# Logs
logs/
*.log
npm-debug.log*
pnpm-debug.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
.DS_Store

# Testing
coverage/

# Misc
.turbo/
.cache/
```

Create `.npmrc`:
```
shamefully-hoist=true
strict-peer-dependencies=false
```

---

## Backend Setup (apps/server)

### Step 1: Initialize Backend

```bash
cd apps/server
pnpm init -y
```

### Step 2: Install Backend Dependencies

```bash
# Core dependencies
pnpm add express cors dotenv

# tRPC
pnpm add @trpc/server zod

# Database
pnpm add mongoose

# Authentication
pnpm add jsonwebtoken bcryptjs
pnpm add -D @types/jsonwebtoken @types/bcryptjs

# Utilities
pnpm add slugify validator cookie-parser
pnpm add winston morgan
pnpm add express-rate-limit

# Dev dependencies
pnpm add -D typescript @types/node @types/express @types/cors @types/cookie-parser
pnpm add -D tsx nodemon
pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

### Step 3: Create Backend Files

**apps/server/package.json**
```json
{
  "name": "server",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "dev": "nodemon",
    "build": "tsc",
    "start": "node dist/index.js",
    "type-check": "tsc --noEmit",
    "lint": "eslint src --ext .ts",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@trpc/server": "^10.45.0",
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.5",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.0.3",
    "morgan": "^1.10.0",
    "slugify": "^1.6.6",
    "validator": "^13.11.0",
    "winston": "^3.11.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cookie-parser": "^1.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/morgan": "^1.9.9",
    "@types/node": "^20.10.6",
    "@types/validator": "^13.11.8",
    "@typescript-eslint/eslint-plugin": "^6.16.0",
    "@typescript-eslint/parser": "^6.16.0",
    "eslint": "^8.56.0",
    "nodemon": "^3.0.2",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3"
  }
}
```

**apps/server/tsconfig.json**
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
    "moduleResolution": "node",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**apps/server/nodemon.json**
```json
{
  "watch": ["src"],
  "ext": "ts",
  "exec": "tsx src/index.ts",
  "env": {
    "NODE_ENV": "development"
  }
}
```

**apps/server/.env.example**
```env
NODE_ENV=development
PORT=4000

# Database
MONGODB_URI=mongodb://localhost:27017/lms-platform

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@lmsplatform.com

# Payment Gateway
PAYMENT_GATEWAY=stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Platform Settings
PLATFORM_FEE_PERCENTAGE=10
PLATFORM_NAME=LMS Platform
PLATFORM_URL=http://localhost:3000

# YouTube API (optional)
YOUTUBE_API_KEY=
```

### Step 4: Create Core Backend Files

**apps/server/src/index.ts**
```typescript
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    logger.info('✅ Database connected');

    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📡 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
```

**apps/server/src/app.ts**
```typescript
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import * as trpcExpress from '@trpc/server/adapters/express';

import { appRouter } from './trpc/router';
import { createContext } from './trpc/context';
import { errorMiddleware } from './middleware/error.middleware';
import { logger } from './utils/logger';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// tRPC endpoint
app.use(
  '/api/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Error handling
app.use(errorMiddleware);

export default app;
```

**apps/server/src/config/database.ts**
```typescript
import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lms-platform';

    await mongoose.connect(mongoUri);

    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    throw error;
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  logger.error('MongoDB error:', error);
});
```

**apps/server/src/config/env.ts**
```typescript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000'),
  MONGODB_URI: z.string(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string(),
});

export const env = envSchema.parse(process.env);
```

**apps/server/src/utils/logger.ts**
```typescript
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});
```

**apps/server/src/trpc/trpc.ts**
```typescript
import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Protected procedure - requires authentication
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

// Teacher-only procedure
export const teacherProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== 'teacher') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({ ctx });
});

// Student-only procedure
export const studentProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== 'student') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({ ctx });
});

// Admin-only procedure
export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({ ctx });
});
```

**apps/server/src/trpc/context.ts**
```typescript
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';

export const createContext = async ({ req, res }: CreateExpressContextOptions) => {
  // Get token from header or cookie
  const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.token;

  let user = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      user = await User.findById(decoded.userId).select('-password');
    } catch (error) {
      // Invalid token
    }
  }

  return {
    req,
    res,
    user,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
```

**apps/server/src/trpc/router.ts**
```typescript
import { router } from './trpc';

export const appRouter = router({
  // Routers will be added here
});

export type AppRouter = typeof appRouter;
```

**apps/server/src/middleware/error.middleware.ts**
```typescript
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
```

---

## Frontend Setup (apps/web)

### Step 1: Initialize Vite React App

```bash
cd apps/web
pnpm create vite . --template react-ts
```

### Step 2: Install Frontend Dependencies

```bash
# Core
pnpm add react-router-dom

# tRPC + TanStack Query
pnpm add @trpc/client @trpc/react-query @tanstack/react-query

# State Management
pnpm add zustand

# Forms
pnpm add react-hook-form @hookform/resolvers zod

# UI & Styling
pnpm add tailwindcss postcss autoprefixer
pnpm add clsx tailwind-merge class-variance-authority
pnpm add lucide-react

# YouTube
pnpm add react-youtube @types/react-youtube

# Utilities
pnpm add axios date-fns

# Dev dependencies
pnpm add -D @types/node
```

### Step 3: Setup Tailwind CSS

```bash
pnpm dlx tailwindcss init -p
```

**apps/web/tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**apps/web/src/styles/globals.css**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Step 4: Setup shadcn/ui

```bash
pnpm dlx shadcn-ui@latest init
```

Answer prompts:
- Style: Default
- Base color: Slate
- CSS variables: Yes

Install commonly used components:
```bash
pnpm dlx shadcn-ui@latest add button
pnpm dlx shadcn-ui@latest add card
pnpm dlx shadcn-ui@latest add input
pnpm dlx shadcn-ui@latest add form
pnpm dlx shadcn-ui@latest add select
pnpm dlx shadcn-ui@latest add dialog
pnpm dlx shadcn-ui@latest add toast
pnpm dlx shadcn-ui@latest add avatar
pnpm dlx shadcn-ui@latest add badge
pnpm dlx shadcn-ui@latest add dropdown-menu
pnpm dlx shadcn-ui@latest add table
pnpm dlx shadcn-ui@latest add tabs
```

### Step 5: Create Frontend Configuration Files

**apps/web/vite.config.ts**
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

**apps/web/tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**apps/web/.env.example**
```env
VITE_API_URL=http://localhost:4000
VITE_APP_NAME=LMS Platform
```

### Step 6: Setup tRPC Client

**apps/web/src/lib/trpc.ts**
```typescript
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../server/src/trpc/router';

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_API_URL}/api/trpc`,
      headers: () => {
        const token = localStorage.getItem('token');
        return token ? { authorization: `Bearer ${token}` } : {};
      },
    }),
  ],
});
```

**apps/web/src/lib/queryClient.ts**
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

**apps/web/src/main.tsx**
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './styles/globals.css';

import { trpc, trpcClient } from './lib/trpc';
import { queryClient } from './lib/queryClient';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  </React.StrictMode>
);
```

---

## Shared Package Setup

```bash
cd packages/shared
pnpm init -y
pnpm add zod
pnpm add -D typescript
```

**packages/shared/package.json**
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

**packages/shared/tsconfig.json**
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
    "moduleResolution": "bundler"
  }
}
```

---

## Quick Start Commands

```bash
# Install all dependencies
pnpm install

# Start MongoDB
brew services start mongodb-community

# Start backend (in one terminal)
pnpm dev:server

# Start frontend (in another terminal)
pnpm dev:web

# Build all
pnpm build

# Type check all
pnpm type-check
```

---

## What's Next?

After completing this setup, you should:

1. ✅ Test health endpoint: http://localhost:4000/health
2. ✅ Test frontend: http://localhost:3000
3. Create MongoDB models
4. Implement auth router
5. Create frontend pages
6. Implement features step by step

Your LMS platform is now ready for development! 🚀
