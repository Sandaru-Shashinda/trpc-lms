import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import {
  LayoutDashboard,
  BookOpen,
  Video,
  Users,
  DollarSign,
  BarChart,
} from 'lucide-react';

interface TeacherLayoutProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: 'student' | 'teacher' | 'admin';
  } | null;
}

const teacherNavItems = [
  {
    title: 'Dashboard',
    href: '/teacher',
    icon: LayoutDashboard,
  },
  {
    title: 'My Classes',
    href: '/teacher/classes',
    icon: BookOpen,
  },
  {
    title: 'Students',
    href: '/teacher/students',
    icon: Users,
  },
  {
    title: 'Earnings',
    href: '/teacher/earnings',
    icon: DollarSign,
  },
  {
    title: 'Analytics',
    href: '/teacher/analytics',
    icon: BarChart,
  },
];

export function TeacherLayout({ user }: TeacherLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} />
      <div className="flex flex-1">
        <Sidebar items={teacherNavItems} />
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="container py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
