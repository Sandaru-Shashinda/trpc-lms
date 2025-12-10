import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LucideIcon } from 'lucide-react';

interface SidebarItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: SidebarItem[];
  className?: string;
}

export function Sidebar({ items, className }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        'flex h-full w-64 flex-col border-r bg-background',
        className
      )}
    >
      <div className="flex-1 space-y-1 p-4">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Button
              key={item.href}
              variant={isActive ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start',
                isActive && 'bg-secondary font-medium'
              )}
              asChild
            >
              <Link to={item.href}>
                <Icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          );
        })}
      </div>
      <Separator />
    </aside>
  );
}
