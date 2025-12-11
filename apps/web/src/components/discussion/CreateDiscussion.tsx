import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquarePlus } from 'lucide-react';

interface CreateDiscussionProps {
  onSubmit: (data: { title: string; content: string }) => void;
  isLoading?: boolean;
}

export function CreateDiscussion({ onSubmit, isLoading }: CreateDiscussionProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onSubmit({ title: title.trim(), content: content.trim() });
      setTitle('');
      setContent('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquarePlus className="h-5 w-5" />
          Start a Discussion
        </CardTitle>
        <CardDescription>Ask a question or start a discussion about this lesson</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., How do I implement this feature?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Question or Comment</Label>
            <Textarea
              id="content"
              placeholder="Describe your question or comment in detail..."
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={isLoading || !title.trim() || !content.trim()}>
            {isLoading ? 'Posting...' : 'Post Question'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
