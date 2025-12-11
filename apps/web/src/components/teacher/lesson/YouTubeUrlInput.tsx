import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Video } from 'lucide-react';

interface YouTubeUrlInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function YouTubeUrlInput({ value, onChange }: YouTubeUrlInputProps) {
  const [error, setError] = useState<string>('');
  const [videoId, setVideoId] = useState<string>('');

  useEffect(() => {
    if (!value) {
      setError('');
      setVideoId('');
      return;
    }

    const extractedId = extractYouTubeVideoId(value);
    if (extractedId) {
      setVideoId(extractedId);
      setError('');
    } else {
      setVideoId('');
      setError('Invalid YouTube URL. Please use a valid YouTube video link.');
    }
  }, [value]);

  const extractYouTubeVideoId = (url: string): string | null => {
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          placeholder="https://www.youtube.com/watch?v=..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={error ? 'border-red-500' : videoId ? 'border-green-500' : ''}
        />
        {value && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {videoId ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {videoId && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Video className="h-4 w-4" />
            <span>Valid YouTube video detected</span>
          </div>
          <div className="aspect-video w-full max-w-md bg-black rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
