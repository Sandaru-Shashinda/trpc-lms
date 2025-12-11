import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './styles/globals.css';

// Pages
import { HomePage } from '@/pages/HomePage';
import { LoginPage, RegisterPage } from '@/pages/auth';
import {
  BrowseClassesPage,
  ClassDetailPage,
  StudentDashboardPage,
  MyClassesPage,
  LessonViewPage,
  PaymentsPage,
  ProfilePage,
} from '@/pages/student';
import {
  TeacherDashboardPage,
  ClassesPage,
  CreateClassPage,
  EditClassPage,
  LessonsPage,
  CreateLessonPage,
  EditLessonPage,
  StudentsPage,
  EarningsPage,
  AnalyticsPage,
} from '@/pages/teacher';

// Components
import { ProtectedRoute, RoleGuard } from '@/components/auth';
import { StudentLayout, TeacherLayout } from '@/components/layout';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-muted-foreground mb-4">Page not found</p>
      <Button asChild>
        <Link to="/">Go back home</Link>
      </Button>
    </div>
  </div>
);

function App() {
  const { user, isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/classes" element={<BrowseClassesPage />} />
        <Route path="/classes/:slug" element={<ClassDetailPage />} />

        {/* Auth Routes - redirect to dashboard if already logged in */}
        <Route
          path="/login"
          element={
            <ProtectedRoute requireAuth={false}>
              <LoginPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute requireAuth={false}>
              <RegisterPage />
            </ProtectedRoute>
          }
        />

        {/* Student Routes - Protected and Role-based */}
        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['student']}>
                <StudentLayout
                  user={
                    isAuthenticated && user
                      ? {
                          name: `${user.firstName} ${user.lastName}`,
                          email: user.email,
                          role: user.role,
                        }
                      : null
                  }
                />
              </RoleGuard>
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboardPage />} />
          <Route path="my-classes" element={<MyClassesPage />} />
          <Route path="class/:classId/lesson/:lessonId" element={<LessonViewPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Teacher Routes - Protected and Role-based */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['teacher']}>
                <TeacherLayout
                  user={
                    isAuthenticated && user
                      ? {
                          name: `${user.firstName} ${user.lastName}`,
                          email: user.email,
                          role: user.role,
                        }
                      : null
                  }
                />
              </RoleGuard>
            </ProtectedRoute>
          }
        >
          <Route index element={<TeacherDashboardPage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="classes/create" element={<CreateClassPage />} />
          <Route path="classes/:classId/edit" element={<EditClassPage />} />
          <Route path="classes/:classId/lessons" element={<LessonsPage />} />
          <Route path="classes/:classId/lessons/create" element={<CreateLessonPage />} />
          <Route path="lessons/:lessonId/edit" element={<EditLessonPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="earnings" element={<EarningsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
