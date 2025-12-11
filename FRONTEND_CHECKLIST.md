# Frontend Implementation Checklist

## 🎨 Phase 1: Foundation & Setup

### ✅ Already Complete
- [x] Project structure created
- [x] Dependencies installed (React, tRPC, TanStack Query, Zustand, etc.)
- [x] Tailwind CSS configured
- [x] tRPC client setup
- [x] Auth store (Zustand) created
- [x] Basic App.tsx and routing structure

### 🔧 Core Setup Tasks
- [x] Install shadcn/ui components needed:
  ```bash
  npx shadcn-ui@latest add button card input form select dialog toast avatar badge dropdown-menu table tabs alert separator skeleton
  ```
- [x] Create router configuration (React Router)
- [x] Setup global layout components
- [x] Configure error boundaries
- [x] Setup toast notifications (Sonner or shadcn toast)

---

## 🎯 Phase 2: Authentication System

### 📄 Pages to Create
- [x] **LoginPage** (`src/pages/auth/LoginPage.tsx`)
  - Login form with email/password
  - Link to register and forgot password
  - Error handling
  - Redirect after successful login based on role

- [x] **RegisterPage** (`src/pages/auth/RegisterPage.tsx`)
  - Registration form (email, password, firstName, lastName)
  - Role selection (Student/Teacher)
  - Form validation with Zod
  - Success message and redirect to login

- [ ] **ForgotPasswordPage** (optional for now)

### 🧩 Components to Create
- [x] **LoginForm** (`src/components/auth/LoginForm.tsx`)
  - React Hook Form + Zod validation
  - tRPC mutation: `trpc.auth.login.useMutation()`
  - Store token in Zustand store and localStorage

- [x] **RegisterForm** (`src/components/auth/RegisterForm.tsx`)
  - Multi-step form (optional)
  - Role selection radio buttons
  - tRPC mutation: `trpc.auth.register.useMutation()`

- [x] **ProtectedRoute** (`src/components/auth/ProtectedRoute.tsx`)
  - Check if user is authenticated
  - Redirect to login if not

- [x] **RoleGuard** (`src/components/auth/RoleGuard.tsx`)
  - Check user role (student/teacher/admin)
  - Show unauthorized message or redirect

### 🪝 Hooks to Create
- [x] **useAuth** (`src/hooks/useAuth.ts`)
  - Access Zustand auth store
  - Login/logout functions
  - Check authentication status

### 🔌 tRPC Queries/Mutations
- [x] `trpc.auth.login.useMutation()`
- [x] `trpc.auth.register.useMutation()`
- [ ] `trpc.auth.getMe.useQuery()` (will be used later)

---

## 🏠 Phase 3: Public Pages

### 📄 Pages
- [x] **HomePage** (`src/pages/HomePage.tsx`)
  - Hero section
  - Featured classes
  - How it works section
  - Call to action (Register/Browse Classes)

- [x] **BrowseClassesPage** (`src/pages/student/BrowseClassesPage.tsx`)
  - Class cards grid
  - Search bar
  - Category filter
  - Level filter (beginner/intermediate/advanced)
  - Pagination

- [x] **ClassDetailPage** (`src/pages/student/ClassDetailPage.tsx`)
  - Class information
  - Teacher profile
  - Curriculum (modules and lessons)
  - Pricing information
  - Enroll button (if not enrolled)
  - Reviews section (future)

### 🧩 Components
- [x] **ClassCard** (`src/components/student/browse/ClassCard.tsx`)
  - Thumbnail image
  - Title, category, level
  - Teacher name and avatar
  - Monthly fee
  - Total lessons count
  - Link to class detail

- [x] **ClassFilter** (`src/components/student/browse/ClassFilter.tsx`)
  - Category dropdown
  - Level dropdown
  - Clear filters button

- [x] **SearchBar** (`src/components/shared/SearchBar.tsx`)
  - Search input with debounce
  - Search icon

- [x] **ClassGrid** (`src/components/student/browse/ClassGrid.tsx`)
  - Grid layout for class cards
  - Loading state
  - Empty state

### 🔌 tRPC Queries
- [x] `trpc.class.getPublished.useQuery()`
- [x] `trpc.class.getById.useQuery()`

---

## 👨‍🎓 Phase 4: Student Dashboard ✅

### 📄 Pages
- [x] **StudentDashboardPage** (`src/pages/student/DashboardPage.tsx`)
  - Welcome message
  - Enrolled classes overview
  - Continue learning section
  - Progress stats
  - Upcoming payments

- [x] **MyClassesPage** (`src/pages/student/MyClassesPage.tsx`)
  - List of enrolled classes
  - Progress for each class
  - Access to class content
  - Payment status per class

- [x] **LessonViewPage** (`src/pages/student/LessonViewPage.tsx`)
  - YouTube video player
  - Lesson title and description
  - Resources download section
  - Mark as complete button
  - Next/Previous lesson navigation
  - Discussion section (future)

- [x] **PaymentsPage** (`src/pages/student/PaymentsPage.tsx`)
  - Payment history table
  - Upcoming payments
  - Payment method management

- [x] **ProfilePage** (`src/pages/student/ProfilePage.tsx`)
  - View/edit profile information
  - Avatar upload (future)
  - Settings

### 🧩 Components
- [x] **EnrollmentCard** (`src/components/student/enrollment/EnrollmentCard.tsx`)
  - Class thumbnail and info
  - Progress bar
  - Last accessed lesson
  - Continue learning button
  - Payment status indicator

- [x] **YouTubePlayer** (`src/components/student/lesson/YouTubePlayer.tsx`)
  - react-youtube integration
  - Video controls
  - Progress tracking
  - Locked overlay if no access
  - Auto-save watch position

- [x] **LessonContent** (`src/components/student/lesson/LessonContent.tsx`)
  - Lesson title and description
  - Video duration
  - Month indicator

- [x] **LessonResources** (`src/components/student/lesson/LessonResources.tsx`)
  - List of downloadable resources
  - Download buttons

- [x] **LessonNavigation** (`src/components/student/lesson/LessonNavigation.tsx`)
  - Previous/Next lesson buttons
  - Back to class button

- [x] **ProgressIndicator** (`src/components/student/lesson/ProgressIndicator.tsx`)
  - Circular progress or linear progress
  - Percentage complete
  - Completed lessons count

- [x] **PaymentForm** (Integrated into UpcomingPayments component)
  - Month selection
  - Payment method selection
  - Amount display
  - Platform fee breakdown
  - Pay button

- [x] **PaymentHistory** (`src/components/student/payment/PaymentHistory.tsx`)
  - Table of past payments
  - Invoice download links
  - Payment status

- [x] **UpcomingPayments** (`src/components/student/payment/UpcomingPayments.tsx`)
  - List of upcoming payments
  - Due dates
  - Pay now buttons

### 🪝 Hooks
- [x] **useYouTubePlayer** (Integrated into YouTubePlayer component)
  - Initialize YouTube player
  - Track video progress
  - Save position on pause/exit

- [x] **useVideoProgress** (Integrated into YouTubePlayer component)
  - Auto-save watch progress
  - Resume from last position

### 🔌 tRPC Queries/Mutations
- [x] `trpc.enrollment.getMyEnrollments.useQuery()`
- [x] `trpc.enrollment.enroll.useMutation()`
- [x] `trpc.enrollment.checkAccess.useQuery()`
- [x] `trpc.enrollment.updateProgress.useMutation()`
- [x] `trpc.enrollment.markLessonComplete.useMutation()`
- [x] `trpc.lesson.getClassLessons.useQuery()`
- [x] `trpc.lesson.getById.useQuery()`
- [x] `trpc.payment.createPayment.useMutation()`
- [x] `trpc.payment.getMyPayments.useQuery()`
- [x] `trpc.user.getProfile.useQuery()`
- [x] `trpc.user.updateProfile.useMutation()`

---

## 👨‍🏫 Phase 5: Teacher Dashboard ✅

### 📄 Pages
- [x] **TeacherDashboardPage** (`src/pages/teacher/TeacherDashboardPage.tsx`)
  - Total students count
  - Total classes count
  - Total earnings
  - Recent enrollments
  - Quick stats cards

- [x] **ClassesPage** (`src/pages/teacher/ClassesPage.tsx`)
  - List of teacher's classes
  - Create new class button
  - Draft/Published status
  - Edit/Delete actions

- [x] **CreateClassPage** (`src/pages/teacher/CreateClassPage.tsx`)
  - Class creation form
  - Title, description, category
  - Pricing, level
  - Requirements, learning outcomes
  - Save as draft or publish

- [x] **EditClassPage** (`src/pages/teacher/EditClassPage.tsx`)
  - Edit class details
  - View class lessons
  - Add lessons button
  - Publish/Unpublish class

- [x] **LessonsPage** (`src/pages/teacher/LessonsPage.tsx`)
  - List of lessons for a class
  - Reorder lessons (drag & drop - optional)
  - Add new lesson button
  - Edit/Delete lesson

- [x] **CreateLessonPage** (`src/pages/teacher/CreateLessonPage.tsx`)
  - Lesson form
  - YouTube URL input with validation
  - Month number selection
  - Title, description
  - Resources upload
  - Preview video
  - Save as draft or publish

- [x] **EditLessonPage** (`src/pages/teacher/EditLessonPage.tsx`)
  - Edit lesson details
  - Update YouTube URL
  - Publish/Unpublish

- [x] **StudentsPage** (`src/pages/teacher/StudentsPage.tsx`)
  - List of enrolled students
  - Student progress overview
  - Filter by class

- [x] **EarningsPage** (`src/pages/teacher/EarningsPage.tsx`)
  - Total earnings
  - Payment history
  - Earnings by class
  - Monthly breakdown chart

### 🧩 Components
- [x] **ClassForm** (`src/components/teacher/class/ClassForm.tsx`)
  - React Hook Form with all class fields
  - Category select
  - Level select
  - Rich text editor for description (optional)
  - Requirements array input
  - What you'll learn array input

- [x] **ClassCard** (Teacher version) - Integrated into ClassesPage
  - Class info
  - Status badge (draft/published)
  - Student count
  - Revenue
  - Edit/Delete buttons

- [x] **ClassStats** - Integrated into Dashboard
  - Total enrollments
  - Active students
  - Revenue generated
  - Average completion rate

- [x] **LessonForm** (`src/components/teacher/lesson/LessonForm.tsx`)
  - Title, description
  - YouTube URL input with validation
  - Video preview after URL entry
  - Month number select
  - Is free checkbox
  - Resources uploader

- [x] **YouTubeUrlInput** (`src/components/teacher/lesson/YouTubeUrlInput.tsx`)
  - URL input field
  - Real-time validation
  - Video preview thumbnail
  - Error messages

- [x] **LessonCard** - Integrated into LessonsPage
  - Lesson title
  - Video thumbnail
  - Month number
  - Status
  - Edit/Delete buttons
  - Drag handle (for reordering)

- [x] **StudentList** - Integrated into StudentsPage
  - Table of students
  - Student name, email
  - Enrolled class
  - Progress percentage
  - Last accessed date

- [x] **StudentProgress** - Integrated into StudentsPage
  - Progress bar
  - Completed lessons / Total lessons
  - Time spent learning

- [x] **StatsCard** - Integrated into Dashboard
  - Icon
  - Title
  - Value
  - Trend indicator (up/down)

- [x] **RevenueChart** - Integrated into EarningsPage
  - Chart.js or Recharts
  - Monthly revenue
  - By class breakdown

### 🔌 tRPC Queries/Mutations
- [x] `trpc.class.create.useMutation()`
- [x] `trpc.class.update.useMutation()`
- [x] `trpc.class.publish.useMutation()`
- [x] `trpc.class.delete.useMutation()`
- [x] `trpc.class.getMyClasses.useQuery()`
- [x] `trpc.lesson.create.useMutation()`
- [x] `trpc.lesson.update.useMutation()`
- [x] `trpc.lesson.publish.useMutation()`
- [x] `trpc.lesson.delete.useMutation()`
- [x] `trpc.payment.getMyEarnings.useQuery()`
- [x] `trpc.payment.getMyPaymentHistory.useQuery()`

---

## 🎨 Phase 6: Shared Components & Layouts ✅

### 🧩 Layout Components
- [x] **Header** (`src/components/layout/Header.tsx`)
  - Logo
  - Navigation links
  - User menu dropdown
  - Notifications bell
  - Logout button

- [x] **Footer** (`src/components/layout/Footer.tsx`)
  - Links
  - Copyright
  - Social media

- [x] **Sidebar** (`src/components/layout/Sidebar.tsx`)
  - Navigation menu
  - User profile summary
  - Role-based menu items

- [x] **MainLayout** (`src/components/layout/MainLayout.tsx`)
  - Header + content + Footer
  - Container wrapper

- [x] **StudentLayout** (`src/components/layout/StudentLayout.tsx`)
  - Header + Sidebar + content
  - Student-specific navigation

- [x] **TeacherLayout** (`src/components/layout/TeacherLayout.tsx`)
  - Header + Sidebar + content
  - Teacher-specific navigation

### 🧩 Shared Components
- [x] **Loader** (`src/components/shared/Loader.tsx`)
  - Spinner component
  - Full page loader
  - Inline loader

- [x] **ErrorBoundary** (`src/components/shared/ErrorBoundary.tsx`)
  - Catch React errors
  - Display error UI
  - Reset button

- [x] **Pagination** (`src/components/shared/Pagination.tsx`)
  - Previous/Next buttons
  - Page numbers
  - Items per page selector

- [x] **EmptyState** (`src/components/shared/EmptyState.tsx`)
  - Icon
  - Message
  - Action button (optional)

- [x] **ConfirmDialog** (`src/components/shared/ConfirmDialog.tsx`)
  - Confirmation modal
  - Yes/No buttons
  - Custom message

- [ ] **NotificationBell** (`src/components/shared/NotificationBell.tsx`) - (Optional, Phase 8)
  - Unread count badge
  - Dropdown with notifications
  - Mark as read functionality

---

## 🛣️ Phase 7: Routing Setup

### Router Configuration (`src/App.tsx`)
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/classes" element={<BrowseClassesPage />} />
        <Route path="/classes/:slug" element={<ClassDetailPage />} />

        {/* Student Routes */}
        <Route path="/student" element={<ProtectedRoute><StudentLayout /></ProtectedRoute>}>
          <Route index element={<StudentDashboardPage />} />
          <Route path="my-classes" element={<MyClassesPage />} />
          <Route path="class/:classId/lesson/:lessonId" element={<LessonViewPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Teacher Routes */}
        <Route path="/teacher" element={<ProtectedRoute><TeacherLayout /></ProtectedRoute>}>
          <Route index element={<TeacherDashboardPage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="classes/create" element={<CreateClassPage />} />
          <Route path="classes/:classId/edit" element={<EditClassPage />} />
          <Route path="classes/:classId/lessons" element={<LessonsPage />} />
          <Route path="classes/:classId/lessons/create" element={<CreateLessonPage />} />
          <Route path="lessons/:lessonId/edit" element={<EditLessonPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="earnings" element={<EarningsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 🎯 Phase 8: Additional Features ✅

### Discussion/Q&A System
- [x] Discussion threads list component (`DiscussionThread.tsx`)
- [x] Create new question component (`CreateDiscussion.tsx`)
- [x] Reply to questions (UI component ready)
- [x] Mark as resolved (teacher) (UI component ready)
- [ ] Backend integration (requires API endpoints)

### Notifications
- [x] Notification list (`NotificationBell.tsx`)
- [x] Mark as read functionality
- [x] Unread count badge
- [ ] Real-time notifications (optional - WebSocket) - Future enhancement
- [ ] Backend integration (requires API endpoints)

### Profile Management
- [x] Profile page with edit capability
- [x] Change password dialog (`ChangePasswordDialog.tsx`)
- [ ] Avatar upload (UI ready, requires backend)
- [ ] Edit bio and headline (UI ready, requires backend)
- [ ] Email preferences - Future enhancement

### Analytics (Teacher)
- [x] Student engagement charts (`AnalyticsPage.tsx`)
- [x] Completion rates display
- [x] Revenue trends (Line chart)
- [x] Revenue by class (Pie chart)
- [x] Most popular classes (Bar chart)
- [x] Performance insights

### Admin Dashboard
- [ ] User management - Future phase
- [ ] Class approval system - Future phase
- [ ] Teacher approval system - Future phase
- [ ] Platform statistics - Future phase

---

## 📦 Additional Libraries to Consider

### UI Enhancement
```bash
npm install react-hot-toast          # Toast notifications
npm install recharts                 # Charts for analytics
npm install @dnd-kit/core           # Drag & drop for lesson reordering
npm install react-markdown          # Markdown rendering
npm install react-quill             # Rich text editor
```

### Utilities
```bash
npm install react-dropzone          # File upload
npm install react-confetti          # Celebration effects
npm install framer-motion           # Animations
```

---

## ✅ Implementation Priority

### Week 1: Foundation
1. Authentication (Login/Register)
2. Protected routes
3. Basic layouts (Header/Footer)
4. Student dashboard

### Week 2: Student Features
1. Browse classes
2. Class detail page
3. Enrollment flow
4. Payment integration

### Week 3: Lesson Viewing
1. YouTube player component
2. Lesson navigation
3. Progress tracking
4. Access control UI

### Week 4: Teacher Features
1. Create/Edit classes
2. Create/Edit lessons
3. YouTube URL input
4. Student management

### Week 5: Polish & Enhancement
1. Error handling
2. Loading states
3. Empty states
4. Toast notifications
5. Responsive design

---

## 🚀 Quick Start Commands

```bash
# Start frontend dev server
cd apps/web
npm run dev

# Frontend will be available at http://localhost:3000
# Backend tRPC is running at http://localhost:4000/api/trpc
```

---

## 📝 Notes

- **Type Safety**: All tRPC queries/mutations are fully type-safe
- **Form Validation**: Use Zod schemas that match backend validators
- **Error Handling**: Wrap all mutations in try-catch with toast notifications
- **Loading States**: Always show loading states for better UX
- **Responsive**: Use Tailwind responsive classes (sm:, md:, lg:)
- **Accessibility**: Add proper ARIA labels and keyboard navigation

---

## 🎨 Design Consistency

- Use shadcn/ui components for consistency
- Follow Tailwind utility-first approach
- Maintain consistent spacing (padding/margin)
- Use consistent color scheme from tailwind.config
- Add hover states to interactive elements
- Show loading skeletons for better perceived performance

---

This checklist provides a complete roadmap for building the entire frontend! Start with Phase 1-2 (Foundation & Auth), then move to student features, and finally teacher features.
