import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: Array<'student' | 'teacher' | 'admin'>;
  fallback?: ReactNode;
  redirectTo?: string;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback,
  redirectTo,
}: RoleGuardProps) {
  const { user, isAuthenticated } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is in the allowed roles
  const hasRequiredRole = allowedRoles.includes(user.role);

  if (!hasRequiredRole) {
    // If redirectTo is specified, redirect there
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    // If custom fallback is provided, show it
    if (fallback) {
      return <>{fallback}</>;
    }

    // Default unauthorized UI
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have permission to access this page. This area is
              restricted to {allowedRoles.join(', ')} users only.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button onClick={() => window.history.back()}>Go Back</Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = '/')}
            >
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
