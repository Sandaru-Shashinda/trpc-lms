import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/lib/trpc';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { User, Mail, Calendar, Shield } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfilePage() {
  const utils = trpc.useContext();

  const { data: profile, isLoading } = trpc.user.getProfile.useQuery();

  const updateProfileMutation = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      utils.user.getProfile.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: profile ? {
      name: profile.name,
      email: profile.email,
    } : undefined,
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account information and settings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Overview */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatarUrl} />
                <AvatarFallback className="text-2xl">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-semibold text-lg">{profile.name}</h3>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Role</p>
                  <p className="font-medium capitalize">{profile.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Member since</p>
                  <p className="font-medium">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>
              Update your profile information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    <User className="inline h-4 w-4 mr-2" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="inline h-4 w-4 mr-2" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={!isDirty || updateProfileMutation.isPending}
                  onClick={() => window.location.reload()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isDirty || updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Future Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Additional settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground py-8 text-center">
            Additional settings will be available in future updates
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
