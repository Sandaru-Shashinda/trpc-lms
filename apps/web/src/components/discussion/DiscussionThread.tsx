import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, ThumbsUp, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Reply {
  id: string;
  author: {
    name: string;
    avatar?: string;
    role: 'student' | 'teacher';
  };
  content: string;
  createdAt: Date;
  likes: number;
}

interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    role: 'student' | 'teacher';
  };
  createdAt: Date;
  replies: Reply[];
  likes: number;
  isResolved: boolean;
}

interface DiscussionThreadProps {
  discussion: Discussion;
  onReply?: () => void;
  onLike?: () => void;
  onResolve?: () => void;
  canResolve?: boolean;
}

export function DiscussionThread({
  discussion,
  onReply,
  onLike,
  onResolve,
  canResolve = false,
}: DiscussionThreadProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Avatar>
              <AvatarImage src={discussion.author.avatar} />
              <AvatarFallback>{getInitials(discussion.author.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{discussion.title}</CardTitle>
                {discussion.isResolved && (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Resolved
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <span className="font-medium">{discussion.author.name}</span>
                <span>•</span>
                <Badge variant="outline" className="text-xs">
                  {discussion.author.role}
                </Badge>
                <span>•</span>
                <span>{formatDate(discussion.createdAt)}</span>
              </div>
            </div>
          </div>
          {canResolve && !discussion.isResolved && onResolve && (
            <Button variant="outline" size="sm" onClick={onResolve}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Resolved
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Content */}
        <div className="prose prose-sm max-w-none">
          <p className="text-foreground">{discussion.content}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLike}
            className={cn('gap-2', discussion.likes > 0 && 'text-primary')}
          >
            <ThumbsUp className="h-4 w-4" />
            {discussion.likes > 0 && <span>{discussion.likes}</span>}
          </Button>
          <Button variant="ghost" size="sm" onClick={onReply} className="gap-2">
            <MessageSquare className="h-4 w-4" />
            {discussion.replies.length > 0 && <span>{discussion.replies.length}</span>}
          </Button>
        </div>

        {/* Replies */}
        {discussion.replies.length > 0 && (
          <div className="space-y-3 pl-4 border-l-2">
            {discussion.replies.map((reply) => (
              <div key={reply.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={reply.author.avatar} />
                  <AvatarFallback className="text-xs">
                    {getInitials(reply.author.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{reply.author.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {reply.author.role}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(reply.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{reply.content}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'mt-1 h-auto p-0 text-xs gap-1',
                      reply.likes > 0 && 'text-primary'
                    )}
                  >
                    <ThumbsUp className="h-3 w-3" />
                    {reply.likes > 0 && <span>{reply.likes}</span>}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
