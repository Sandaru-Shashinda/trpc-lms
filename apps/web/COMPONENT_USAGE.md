# Component Usage Guide

This guide shows how to use the layout and shared components created in Phase 1.

## Layout Components

### Using MainLayout

The MainLayout wraps pages with Header and Footer:

```tsx
import { MainLayout } from '@/components/layout';

function MyPage() {
  return (
    <MainLayout user={currentUser}>
      <div className="container py-8">
        <h1>Page Content</h1>
      </div>
    </MainLayout>
  );
}
```

### Using StudentLayout

For student dashboard pages:

```tsx
import { StudentLayout } from '@/components/layout';
import { Outlet } from 'react-router-dom';

// In your router:
<Route path="/student" element={<StudentLayout user={currentUser} />}>
  <Route index element={<StudentDashboard />} />
  <Route path="my-classes" element={<MyClasses />} />
</Route>
```

### Using TeacherLayout

For teacher dashboard pages:

```tsx
import { TeacherLayout } from '@/components/layout';

// In your router:
<Route path="/teacher" element={<TeacherLayout user={currentUser} />}>
  <Route index element={<TeacherDashboard />} />
  <Route path="classes" element={<MyClasses />} />
</Route>
```

## User Object Structure

All layout components accept an optional `user` prop:

```tsx
type User = {
  name: string;
  email: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin';
} | null;
```

Example:

```tsx
const user = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://example.com/avatar.jpg',
  role: 'student'
};

<Header user={user} />
```

## Toast Notifications

Using Sonner for toast notifications:

```tsx
import { toast } from 'sonner';

// Success toast
toast.success('Operation completed successfully!');

// Error toast
toast.error('Something went wrong');

// Info toast
toast.info('This is an information message');

// Warning toast
toast.warning('Warning message');

// Promise toast (for async operations)
toast.promise(
  fetchData(),
  {
    loading: 'Loading...',
    success: 'Data loaded successfully',
    error: 'Failed to load data'
  }
);
```

## Error Boundary

The error boundary is already configured globally in `main.tsx`. To use a custom fallback:

```tsx
import { ErrorBoundary } from '@/components/shared';

<ErrorBoundary fallback={<CustomErrorUI />}>
  <YourComponent />
</ErrorBoundary>
```

## shadcn/ui Components

All shadcn/ui components are available in `@/components/ui/`:

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter text..." />
        <Button className="mt-4">Submit</Button>
      </CardContent>
    </Card>
  );
}
```

## Router Navigation

Use React Router's Link and useNavigate:

```tsx
import { Link, useNavigate } from 'react-router-dom';

function Navigation() {
  const navigate = useNavigate();

  return (
    <>
      {/* Declarative navigation */}
      <Link to="/classes">Browse Classes</Link>

      {/* Programmatic navigation */}
      <button onClick={() => navigate('/student/dashboard')}>
        Go to Dashboard
      </button>
    </>
  );
}
```

## Available Routes (Configured)

Current routes in `App.tsx`:

- `/` - Home page
- `*` - 404 Not Found page

Future routes (commented, ready to uncomment):

- `/login` - Login page
- `/register` - Register page
- `/student/*` - Student routes
- `/teacher/*` - Teacher routes

## Styling with Tailwind

All components use Tailwind CSS. Common patterns:

```tsx
// Container with padding
<div className="container py-8">

// Card with spacing
<div className="rounded-lg border bg-card p-6">

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Flex layout
<div className="flex items-center justify-between">

// Text styles
<h1 className="text-4xl font-bold">
<p className="text-muted-foreground">
```

## Next Steps

Phase 2 will add:
- Login and Register pages
- Authentication forms
- Protected routes
- Auth hooks

See [FRONTEND_CHECKLIST.md](../../FRONTEND_CHECKLIST.md) for the full roadmap.
