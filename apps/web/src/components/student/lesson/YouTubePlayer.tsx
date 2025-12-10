import { useState, useEffect } from 'react';
import YouTube, { YouTubeProps, YouTubePlayer as YouTubePlayerType } from 'react-youtube';
import { Skeleton } from '@/components/ui/skeleton';
import { Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface YouTubePlayerProps {
  videoId: string;
  hasAccess: boolean;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  savedPosition?: number;
}

export function YouTubePlayer({
  videoId,
  hasAccess,
  onProgress,
  onComplete,
  savedPosition = 0,
}: YouTubePlayerProps) {
  const [player, setPlayer] = useState<YouTubePlayerType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // YouTube player options
  const opts: YouTubeProps['opts'] = {
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
      start: savedPosition || 0,
    },
  };

  // Handle player ready
  const onReady: YouTubeProps['onReady'] = (event) => {
    setPlayer(event.target);
    setIsLoading(false);

    // Seek to saved position if exists
    if (savedPosition > 0) {
      event.target.seekTo(savedPosition, true);
    }
  };

  // Handle playback state change
  const onStateChange: YouTubeProps['onStateChange'] = (event) => {
    // Video ended
    if (event.data === 0) {
      onComplete?.();
    }
  };

  // Track progress every 5 seconds
  useEffect(() => {
    if (!player || !hasAccess) return;

    const interval = setInterval(() => {
      const currentTime = player.getCurrentTime();
      const duration = player.getDuration();

      if (currentTime && duration) {
        const progressPercent = (currentTime / duration) * 100;
        onProgress?.(Math.floor(currentTime));

        // Mark as complete if watched 90% or more
        if (progressPercent >= 90 && onComplete) {
          onComplete();
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [player, hasAccess, onProgress, onComplete]);

  // Handle errors
  const onError: YouTubeProps['onError'] = (event) => {
    setIsLoading(false);
    setError('Failed to load video. Please try again later.');
    console.error('YouTube Player Error:', event);
  };

  // If no access, show locked overlay
  if (!hasAccess) {
    return (
      <div className="relative aspect-video w-full bg-muted rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-6">
          <Lock className="h-16 w-16 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Payment Required</h3>
          <p className="text-center text-muted-foreground mb-4 max-w-md">
            Please make your monthly payment to access this lesson.
          </p>
          <Button asChild variant="secondary">
            <Link to="/student/payments">Make Payment</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Show error if video failed to load
  if (error) {
    return (
      <div className="relative aspect-video w-full bg-muted rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/10 p-6">
          <AlertCircle className="h-16 w-16 text-destructive mb-4" />
          <h3 className="text-xl font-semibold mb-2">Video Error</h3>
          <p className="text-center text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0">
          <Skeleton className="w-full h-full" />
        </div>
      )}
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onStateChange={onStateChange}
        onError={onError}
        className="w-full h-full"
        iframeClassName="w-full h-full"
      />
    </div>
  );
}
