import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { YouTubeUrlInput } from './YouTubeUrlInput';
import { useState } from 'react';

const lessonFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
  contentType: z.enum(['video', 'document', 'text']),
  videoUrl: z.string().optional(),
  monthNumber: z.coerce.number().min(1, 'Month number must be at least 1'),
  isFree: z.boolean().default(false),
});

export type LessonFormValues = z.infer<typeof lessonFormSchema>;

interface LessonFormProps {
  defaultValues?: Partial<LessonFormValues>;
  onSubmit: (data: LessonFormValues) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function LessonForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = 'Save',
}: LessonFormProps) {
  const [videoUrl, setVideoUrl] = useState(defaultValues?.videoUrl || '');

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      contentType: defaultValues?.contentType || 'video',
      videoUrl: defaultValues?.videoUrl || '',
      monthNumber: defaultValues?.monthNumber || 1,
      isFree: defaultValues?.isFree || false,
    },
  });

  const handleSubmit = (data: LessonFormValues) => {
    onSubmit({
      ...data,
      videoUrl: videoUrl || undefined,
    });
  };

  const contentType = form.watch('contentType');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lesson Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Introduction to React Hooks" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what students will learn in this lesson..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Content Type */}
        <FormField
          control={form.control}
          name="contentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="video">Video (YouTube)</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* YouTube URL Input (only for video type) */}
        {contentType === 'video' && (
          <div className="space-y-2">
            <FormLabel>YouTube Video URL</FormLabel>
            <YouTubeUrlInput value={videoUrl} onChange={setVideoUrl} />
          </div>
        )}

        {/* Month Number and Is Free */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="monthNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Month Number</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="1" {...field} />
                </FormControl>
                <FormDescription>Which month does this lesson belong to?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isFree"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Free Preview</FormLabel>
                  <FormDescription>
                    Allow students to view this lesson before enrolling
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
