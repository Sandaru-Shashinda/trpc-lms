import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth
  // This prevents flash of redirect for authenticated users
  if (requireAuth && !user && isAuthenticated === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If authentication is required and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Redirect to login, but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated and trying to access auth pages (login/register)
  // Redirect them to their dashboard
  if (!requireAuth && isAuthenticated && user) {
    const from = location.state?.from?.pathname;

    // If they were redirected to login from somewhere, go back there
    if (from && from !== '/login' && from !== '/register') {
      return <Navigate to={from} replace />;
    }

    // Otherwise redirect to their role-based dashboard
    if (user.role === 'teacher') {
      return <Navigate to="/teacher" replace />;
    } else if (user.role === 'student') {
      return <Navigate to="/student" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
