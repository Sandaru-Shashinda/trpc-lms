import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import {
  BookOpen,
  Users,
  Award,
  Clock,
  ArrowRight,
  PlayCircle,
  CheckCircle2,
} from 'lucide-react';

export function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <MainLayout
      user={
        isAuthenticated && user
          ? {
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              role: user.role,
            }
          : null
      }
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background py-20 lg:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Learn Without Limits
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Access world-class courses from expert instructors. Build skills
                for your career, hobbies, and personal growth.
              </p>
              {!isAuthenticated ? (
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" asChild>
                    <Link to="/register">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/classes">
                      Browse Classes
                    </Link>
                  </Button>
                </div>
              ) : (
                <Button size="lg" asChild>
                  <Link to={user?.role === 'teacher' ? '/teacher' : '/student'}>
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>

            {/* Hero Image Placeholder */}
            <div className="relative hidden lg:block">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <PlayCircle className="h-32 w-32 text-primary/40" />
              </div>
              {/* Floating Cards */}
              <div className="absolute top-8 -left-8 animate-float">
                <Card className="w-48">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">1,000+</p>
                      <p className="text-xs text-muted-foreground">Active Students</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="absolute bottom-8 -right-8 animate-float-delayed">
                <Card className="w-48">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                      <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">500+</p>
                      <p className="text-xs text-muted-foreground">Quality Courses</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: BookOpen, label: 'Courses', value: '500+' },
              { icon: Users, label: 'Students', value: '10K+' },
              { icon: Award, label: 'Instructors', value: '100+' },
              { icon: Clock, label: 'Video Hours', value: '5000+' },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center space-y-2">
                  <div className="inline-flex p-3 rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Start learning in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: '01',
                title: 'Browse Classes',
                description:
                  'Explore our extensive catalog of courses taught by expert instructors from around the world.',
                icon: BookOpen,
              },
              {
                step: '02',
                title: 'Enroll & Learn',
                description:
                  'Choose a subscription plan and get instant access to all course materials and lessons.',
                icon: PlayCircle,
              },
              {
                step: '03',
                title: 'Earn Certificate',
                description:
                  'Complete courses, track your progress, and earn certificates to showcase your achievements.',
                icon: Award,
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="relative overflow-hidden">
                  <CardContent className="pt-6 space-y-4">
                    <div className="text-6xl font-bold text-primary/10 absolute top-4 right-4">
                      {item.step}
                    </div>
                    <div className="inline-flex p-3 rounded-full bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Ready to Start Learning?
          </h2>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            Join thousands of students already learning on our platform. Start
            your journey today!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/register">Create Free Account</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  asChild
                >
                  <Link to="/classes">Browse Classes</Link>
                </Button>
              </>
            ) : (
              <Button size="lg" variant="secondary" asChild>
                <Link to="/classes">Explore More Classes</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Phase 3 Complete Badge */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold">Phase 3 Complete ✅</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Public pages implementation finished! Browse classes, view
                  details, and enroll in courses.
                </p>
                <ul className="grid sm:grid-cols-2 gap-2 max-w-2xl mx-auto text-sm text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Enhanced Home page with hero section
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Browse Classes page with search & filters
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Class Detail page with enrollment
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Pagination and loading states
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </MainLayout>
  );
}
