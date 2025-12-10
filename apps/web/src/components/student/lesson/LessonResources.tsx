import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Link as LinkIcon } from 'lucide-react';

interface Resource {
  _id: string;
  title: string;
  type: 'pdf' | 'link' | 'file';
  url: string;
  size?: string;
}

interface LessonResourcesProps {
  resources: Resource[];
}

export function LessonResources({ resources }: LessonResourcesProps) {
  if (!resources || resources.length === 0) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'link':
        return <LinkIcon className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Lesson Resources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {resources.map((resource) => (
          <div
            key={resource._id}
            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {getIcon(resource.type)}
              <div>
                <p className="font-medium text-sm">{resource.title}</p>
                {resource.size && (
                  <p className="text-xs text-muted-foreground">{resource.size}</p>
                )}
              </div>
            </div>
            <Button size="sm" variant="ghost" asChild>
              <a
                href={resource.url}
                target={resource.type === 'link' ? '_blank' : undefined}
                rel={resource.type === 'link' ? 'noopener noreferrer' : undefined}
                download={resource.type !== 'link'}
              >
                {resource.type === 'link' ? 'Open' : 'Download'}
              </a>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
