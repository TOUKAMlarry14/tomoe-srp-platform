import { createRootRouteWithContext, createRoute, createRouter, RouterProvider, Outlet, redirect } from '@tanstack/react-router';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { StudentListPage } from './pages/students/StudentListPage';
import GradeBookPage from './pages/academic/GradeBookPage';
import AttendancePage from './pages/academic/AttendancePage';
import SubjectsPage from './pages/academic/SubjectsPage';
import FinancialsPage from './pages/financials/FinancialsPage';
import LibraryPage from './pages/library/LibraryPage';
import TransportPage from './pages/transport/TransportPage';
import DisciplinePage from './pages/discipline/DisciplinePage';
import LogsPage from './pages/admin/LogsPage';
import ChatHub from './pages/ChatHub';
import { useAuth } from './hooks/useAuth';

// Define context type
interface MyRouterContext {
  auth: ReturnType<typeof useAuth>;
}

// Create a root route with context
const rootRoute = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
    </>
  ),
});

// Create index route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

// Create login route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

// Create auth layout route with protection
const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth',
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated && !context.auth.isLoading) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: DashboardLayout,
});

// Create dashboard route
const dashboardRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/dashboard',
  component: Dashboard,
});

// Create module routes
const studentsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/students',
  component: StudentListPage,
});

const staffRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/staff',
  component: () => <PlaceholderPage titleKey="staff" />,
});

const gradebookRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/academic/gradebook',
  component: GradeBookPage,
});

const attendanceRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/academic/attendance',
  component: AttendancePage,
});

const subjectsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/academic/subjects',
  component: SubjectsPage,
});

const financialsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/financials',
  component: FinancialsPage,
});

const libraryRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/library',
  component: LibraryPage,
});

const transportRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/transport',
  component: TransportPage,
});

const disciplineRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/discipline',
  component: DisciplinePage,
});

const todoRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/todo',
  component: () => <PlaceholderPage titleKey="todo" />,
});

const logsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/logs',
  component: LogsPage,
});

const aiChatbotRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/ai-chatbot',
  component: ChatHub,
});

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute, 
  loginRoute, 
  authLayoutRoute.addChildren([
    dashboardRoute,
    studentsRoute,
    staffRoute,
    gradebookRoute,
    attendanceRoute,
    subjectsRoute,
    financialsRoute,
    libraryRoute,
    transportRoute,
    disciplineRoute,
    todoRoute,
    logsRoute,
    aiChatbotRoute,
  ])
]);

// Create the router
const router = createRouter({ 
  routeTree,
  context: {
    auth: undefined!, // will be injected in App component
  }
});

// Register the router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const auth = useAuth();
  
  if (auth.isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm font-medium text-muted-foreground italic">Loading TOMOE SRP...</p>
        </div>
      </div>
    );
  }

  return <RouterProvider router={router} context={{ auth }} />;
}
