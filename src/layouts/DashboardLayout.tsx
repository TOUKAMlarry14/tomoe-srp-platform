import React from 'react';
import { 
  AppShell, 
  AppShellSidebar, 
  AppShellMain, 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarItem, 
  SidebarGroup,
  MobileSidebarTrigger,
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem
} from '@blinkdotnew/ui';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  GraduationCap, 
  Wallet, 
  Library, 
  Bus, 
  Gavel, 
  CheckSquare, 
  History, 
  MessageSquareCode,
  LogOut,
  Globe,
  ClipboardList,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../lib/i18n';
import { LanguageToggle } from '../components/LanguageToggle';
import { useAuth } from '../hooks/useAuth';
import { ChatbotWidget } from '../components/ChatbotWidget';

export type UserRole = 'admin' | 'teacher' | 'parent' | 'driver';

export function DashboardLayout() {
  const { language } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const t = translations[language];
  const location = useLocation();
  const [role, setRole] = React.useState<UserRole>('admin');

  const handleLogout = async () => {
    await logout();
    navigate({ to: '/login' });
  };

  const allNavItems = [
    { href: '/dashboard', label: t.common.dashboard, icon: <LayoutDashboard className="h-4 w-4" />, roles: ['admin', 'teacher', 'parent', 'driver'] },
    { href: '/students', label: t.common.students, icon: <Users className="h-4 w-4" />, roles: ['admin', 'teacher', 'parent'] },
    { href: '/staff', label: t.common.staff, icon: <UserSquare2 className="h-4 w-4" />, roles: ['admin'] },
    { href: '/academic/gradebook', label: t.academic.gradeBook, icon: <CheckCircle2 className="h-4 w-4" />, roles: ['admin', 'teacher'] },
    { href: '/academic/attendance', label: t.academic.attendance, icon: <ClipboardList className="h-4 w-4" />, roles: ['admin', 'teacher'] },
    { href: '/academic/subjects', label: t.academic.subjects, icon: <BookOpen className="h-4 w-4" />, roles: ['admin'] },
    { href: '/financials', label: t.common.financials, icon: <Wallet className="h-4 w-4" />, roles: ['admin', 'parent'] },
    { href: '/library', label: t.common.library, icon: <Library className="h-4 w-4" />, roles: ['admin', 'teacher', 'parent'] },
    { href: '/transport', label: t.common.transport, icon: <Bus className="h-4 w-4" />, roles: ['admin', 'parent', 'driver'] },
    { href: '/discipline', label: t.common.discipline, icon: <Gavel className="h-4 w-4" />, roles: ['admin', 'teacher'] },
    { href: '/todo', label: t.common.todo, icon: <CheckSquare className="h-4 w-4" />, roles: ['admin', 'teacher', 'parent', 'driver'] },
    { href: '/logs', label: t.common.logs, icon: <History className="h-4 w-4" />, roles: ['admin'] },
    { href: '/ai-chatbot', label: t.common.aiChatbot, icon: <MessageSquareCode className="h-4 w-4" />, roles: ['admin', 'teacher'] },
  ];

  const filteredNavItems = allNavItems.filter(item => item.roles.includes(role));

  return (
    <AppShell>
      <AppShellSidebar>
        <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
          <div className="p-6 flex items-center gap-3 border-b border-sidebar-border/50">
            <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-primary font-bold">
              T
            </div>
            <span className="font-bold text-xl tracking-tight uppercase">TOMOE</span>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            <SidebarGroup>
              {filteredNavItems.map((item) => (
                <Link key={item.href} to={item.href}>
                  {({ isActive }) => (
                    <SidebarItem
                      icon={item.icon}
                      label={item.label}
                      active={isActive}
                      className={isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}
                    />
                  )}
                </Link>
              ))}
            </SidebarGroup>
          </div>

          <div className="p-4 border-t border-sidebar-border/50">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              {t.common.signOut}
            </Button>
          </div>
        </div>
      </AppShellSidebar>

      <AppShellMain>
        <Navbar className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <NavbarBrand className="md:hidden">
            <MobileSidebarTrigger />
            <span className="ml-2 font-bold">TOMOE</span>
          </NavbarBrand>
          
          <NavbarContent className="flex-1 justify-end gap-4">
            <NavbarItem>
              <div className="flex bg-muted rounded-full p-1 mr-4">
                {(['admin', 'teacher', 'parent', 'driver'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                      role === r 
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {r[0]}
                  </button>
                ))}
              </div>
            </NavbarItem>
            <NavbarItem>
              <LanguageToggle />
            </NavbarItem>
          </NavbarContent>
        </Navbar>

        <main className="flex-1">
          <Outlet />
        </main>
        <ChatbotWidget />
      </AppShellMain>
    </AppShell>
  );
}
