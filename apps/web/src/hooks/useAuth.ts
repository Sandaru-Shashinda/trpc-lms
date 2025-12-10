import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export function useAuth() {
  const { user, token, setAuth, logout: storeLogout } = useAuthStore();
  const navigate = useNavigate();

  const isAuthenticated = !!user && !!token;

  const logout = useCallback(() => {
    storeLogout();
    navigate('/login');
  }, [storeLogout, navigate]);

  const login = useCallback(
    (user: { role: string; [key: string]: unknown }, token: string) => {
      setAuth(user, token);

      // Redirect based on role
      if (user.role === 'teacher') {
        navigate('/teacher');
      } else if (user.role === 'student') {
        navigate('/student');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    },
    [setAuth, navigate]
  );

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    isStudent: user?.role === 'student',
    isTeacher: user?.role === 'teacher',
    isAdmin: user?.role === 'admin',
  };
}
