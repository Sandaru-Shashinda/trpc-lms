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
import { useState } from 'react';
import { X, Plus } from 'lucide-react';

const classFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().max(200).optional(),
  category: z.string().min(1, 'Category is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'all']),
  monthlyFee: z.coerce.number().min(0, 'Monthly fee must be at least 0'),
});

type ClassFormValues = z.infer<typeof classFormSchema> & {
  requirements?: string[];
  whatYouWillLearn?: string[];
};

interface ClassFormProps {
  defaultValues?: Partial<ClassFormValues>;
  onSubmit: (data: ClassFormValues) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const categories = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'Design',
  'Business',
  'Marketing',
  'Photography',
  'Music',
  'Other',
];

export function ClassForm({ defaultValues, onSubmit, isLoading, submitLabel = 'Save' }: ClassFormProps) {
  const [requirements, setRequirements] = useState<string[]>(defaultValues?.requirements || []);
  const [newRequirement, setNewRequirement] = useState('');
  const [learningPoints, setLearningPoints] = useState<string[]>(
    defaultValues?.whatYouWillLearn || []
  );
  const [newLearningPoint, setNewLearningPoint] = useState('');

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      shortDescription: defaultValues?.shortDescription || '',
      category: defaultValues?.category || '',
      level: defaultValues?.level || 'all',
      monthlyFee: defaultValues?.monthlyFee || 0,
    },
  });

  const handleSubmit = (data: ClassFormValues) => {
    onSubmit({
      ...data,
      requirements,
      whatYouWillLearn: learningPoints,
    });
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const addLearningPoint = () => {
    if (newLearningPoint.trim()) {
      setLearningPoints([...learningPoints, newLearningPoint.trim()]);
      setNewLearningPoint('');
    }
  };

  const removeLearningPoint = (index: number) => {
    setLearningPoints(learningPoints.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Complete Web Development Bootcamp" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Short Description */}
        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="A brief one-line description"
                  {...field}
                />
              </FormControl>
              <FormDescription>This will be shown in class cards</FormDescription>
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
              <FormLabel>Full Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what students will learn in this class..."
                  rows={6}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category and Level */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Monthly Fee */}
        <FormField
          control={form.control}
          name="monthlyFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Fee ($)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" placeholder="29.99" {...field} />
              </FormControl>
              <FormDescription>
                Students will pay this amount monthly to access your class
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Requirements */}
        <div className="space-y-4">
          <FormLabel>Requirements (Optional)</FormLabel>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Basic knowledge of HTML and CSS"
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addRequirement();
                }
              }}
            />
            <Button type="button" onClick={addRequirement} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {requirements.length > 0 && (
            <ul className="space-y-2">
              {requirements.map((req, index) => (
                <li key={index} className="flex items-center gap-2 p-2 bg-accent rounded">
                  <span className="flex-1">{req}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRequirement(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* What You'll Learn */}
        <div className="space-y-4">
          <FormLabel>What You'll Learn (Optional)</FormLabel>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Build responsive websites"
              value={newLearningPoint}
              onChange={(e) => setNewLearningPoint(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addLearningPoint();
                }
              }}
            />
            <Button type="button" onClick={addLearningPoint} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {learningPoints.length > 0 && (
            <ul className="space-y-2">
              {learningPoints.map((point, index) => (
                <li key={index} className="flex items-center gap-2 p-2 bg-accent rounded">
                  <span className="flex-1">{point}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLearningPoint(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
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
