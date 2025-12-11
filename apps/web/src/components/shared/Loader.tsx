import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
  className?: string;
  text?: string;
}

export function Loader({ size = 'md', fullPage = false, className, text }: LoaderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const loader = (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {loader}
      </div>
    );
  }

  return loader;
}

// Inline loader for buttons and small components
export function InlineLoader({ className }: { className?: string }) {
  return <Loader2 className={cn('h-4 w-4 animate-spin', className)} />;
}

// Spinner component (alias for Loader with different default)
export function Spinner({ size = 'sm', className }: Omit<LoaderProps, 'fullPage' | 'text'>) {
  return <Loader size={size} className={className} />;
}
