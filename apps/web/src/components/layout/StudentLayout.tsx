import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import {
  LayoutDashboard,
  BookOpen,
  CreditCard,
  User,
  GraduationCap,
} from 'lucide-react';

interface StudentLayoutProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: 'student' | 'teacher' | 'admin';
  } | null;
}

const studentNavItems = [
  {
    title: 'Dashboard',
    href: '/student',
    icon: LayoutDashboard,
  },
  {
    title: 'My Classes',
    href: '/student/my-classes',
    icon: GraduationCap,
  },
  {
    title: 'Browse Classes',
    href: '/classes',
    icon: BookOpen,
  },
  {
    title: 'Payments',
    href: '/student/payments',
    icon: CreditCard,
  },
  {
    title: 'Profile',
    href: '/student/profile',
    icon: User,
  },
];

export function StudentLayout({ user }: StudentLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} />
      <div className="flex flex-1">
        <Sidebar items={studentNavItems} />
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="container py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
