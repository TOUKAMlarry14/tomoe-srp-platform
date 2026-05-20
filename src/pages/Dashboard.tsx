import React, { useState } from 'react';
import { Page, PageHeader, PageTitle, PageBody, StatGroup, Stat, Card, CardContent, CardHeader, CardTitle } from '@blinkdotnew/ui';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../lib/i18n';
import { Users, BookOpen, Clock, AlertCircle, Calendar, FileText, UserCheck, CreditCard, Bus, MapPin, ListChecks, CheckCircle2 } from 'lucide-react';
import { useFinancials } from '../hooks/useFinancials';
import { useQuery } from '@tanstack/react-query';
import { blink } from '../lib/blink';

export type UserRole = 'admin' | 'teacher' | 'parent' | 'driver';

export function Dashboard() {
  const { language } = useLanguage();
  const t = translations[language];
  const [role, setRole] = useState<UserRole>('admin');
  const { financialStats } = useFinancials();

  const { data: students = [] } = useQuery({
    queryKey: ['students-count'],
    queryFn: () => blink.db.eleves.list()
  });

  const renderKPIs = () => {
    switch (role) {
      case 'admin':
        const stats = financialStats.data || { totalCollected: 0 };
        return (
          <StatGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat label={t.dashboard.admin.totalStudents} value={students.length.toLocaleString()} icon={<Users />} trend={5.2} />
            <Stat label={t.dashboard.admin.revenue} value={`${stats.totalCollected.toLocaleString()} FCFA`} icon={<CreditCard />} trend={8.1} />
            <Stat label={t.dashboard.admin.activeTeachers} value="48" icon={<UserCheck />} />
            <Stat label={t.dashboard.admin.pendingAlerts} value="12" icon={<AlertCircle />} trend={-2} />
          </StatGroup>
        );
      case 'teacher':
        return (
          <StatGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat label={t.dashboard.teacher.myClasses} value="6" icon={<BookOpen />} />
            <Stat label={t.dashboard.teacher.todayLessons} value="4" icon={<Clock />} />
            <Stat label={t.dashboard.teacher.pendingNotes} value="15" icon={<FileText />} trend={10} />
            <Stat label={t.dashboard.teacher.absences} value="3" icon={<Calendar />} />
          </StatGroup>
        );
      case 'parent':
        return (
          <StatGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat label={t.dashboard.parent.myChildren} value="2" icon={<Users />} />
            <Stat label={t.dashboard.parent.gradesOverview} value="16.5/20" icon={<FileText />} />
            <Stat label={t.dashboard.parent.nextPayment} value="Oct 1st" icon={<CreditCard />} />
            <Stat label={t.dashboard.parent.busStatus} value="On Time" icon={<Bus />} />
          </StatGroup>
        );
      case 'driver':
        return (
          <StatGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Stat label={t.dashboard.driver.routeOfDay} value="Route A-12" icon={<MapPin />} />
            <Stat label={t.dashboard.driver.pickupList} value="32 Students" icon={<Users />} />
            <Stat label={t.dashboard.driver.statusToggles} value="Active" icon={<ListChecks />} />
          </StatGroup>
        );
      default: return null;
    }
  };

  const renderTeacherWidgets = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              {t.dashboard.teacher.myClasses}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: '6ème A', count: 32 },
                { name: '6ème B', count: 28 },
                { name: '5ème A', count: 35 },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/50">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-muted-foreground">{c.count} {t.stats.students.toLowerCase()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              {t.dashboard.teacher.todaySchedule}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: '08:00 - 09:55', subject: 'Mathématiques', class: '6ème A' },
                { time: '10:05 - 12:00', subject: 'Mathématiques', class: '5ème A' },
                { time: '13:00 - 14:55', subject: 'Physique', class: '6ème B' },
              ].map((s, i) => (
                <div key={i} className="flex flex-col gap-1 p-2 rounded-lg border border-border">
                  <span className="text-xs font-bold text-primary">{s.time}</span>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{s.subject}</span>
                    <span className="text-xs text-muted-foreground">{s.class}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              {t.dashboard.teacher.recentEvaluations}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { subject: 'Mathématiques', class: '6ème A', date: 'Yesterday', avg: '14.2' },
                { subject: 'Physique', class: '6ème B', date: '2 days ago', avg: '12.8' },
                { subject: 'Mathématiques', class: '5ème A', date: '3 days ago', avg: '15.1' },
              ].map((e, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    {e.avg}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{e.subject}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{e.class} • {e.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Page>
      <PageHeader>
        <div className="flex justify-between items-center w-full">
          <PageTitle>{t.common.dashboard}</PageTitle>
          <div className="flex gap-2">
            {(['admin', 'teacher', 'parent', 'driver'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  role === r 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </PageHeader>
      <PageBody className="space-y-8">
        {renderKPIs()}
        
        {role === 'teacher' ? (
          renderTeacherWidgets()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div className="flex-1">
                        <p className="font-medium">System Update</p>
                        <p className="text-muted-foreground text-xs">2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-4 text-sm">
                      <div className="w-10 h-10 rounded bg-secondary/20 flex flex-col items-center justify-center text-secondary font-bold">
                        <span>{15 + i}</span>
                        <span className="text-[10px] uppercase">Oct</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Parent-Teacher Meeting</p>
                        <p className="text-muted-foreground text-xs">10:00 AM - 12:00 PM</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </PageBody>
    </Page>
  );
}
