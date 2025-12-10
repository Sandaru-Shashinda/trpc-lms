/**
 * Extract YouTube video ID from various URL formats
 */
export const extractYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

/**
 * Validate if a string is a valid YouTube URL
 */
export const isValidYouTubeUrl = (url: string): boolean => {
  return extractYouTubeVideoId(url) !== null;
};

/**
 * Generate YouTube thumbnail URL from video ID
 */
export const getYouTubeThumbnail = (videoId: string, quality: 'default' | 'medium' | 'high' | 'max' = 'high'): string => {
  const qualityMap = {
    default: 'default.jpg',
    medium: 'mqdefault.jpg',
    high: 'hqdefault.jpg',
    max: 'maxresdefault.jpg',
  };

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}`;
};

/**
 * Generate YouTube embed URL from video ID
 */
export const getYouTubeEmbedUrl = (videoId: string): string => {
  return `https://www.youtube.com/embed/${videoId}`;
};
