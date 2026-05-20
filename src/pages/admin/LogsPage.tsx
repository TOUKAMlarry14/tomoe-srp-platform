import React from 'react';
import { 
  Page, 
  PageHeader, 
  PageTitle, 
  PageBody, 
  DataTable, 
  Card,
  CardContent,
  Badge,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  HStack
} from '@blinkdotnew/ui';
import { History, Shield, User, Activity } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../lib/i18n';

export default function LogsPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [actionFilter, setActionFilter] = React.useState('all');

  const logs = [
    { id: '1', date: '2024-03-14 10:25:00', user: 'admin@tomoe.com', action: 'CREATE_STUDENT', details: 'Added student Jean Dupont', severity: 'info' },
    { id: '2', date: '2024-03-14 09:15:00', user: 'driver_a@tomoe.com', action: 'CHECK_IN_TRANSPORT', details: 'Morning pickup Route A', severity: 'info' },
    { id: '3', date: '2024-03-13 16:45:00', user: 'admin@tomoe.com', action: 'DELETE_INCIDENT', details: 'Removed incident #452', severity: 'warning' },
    { id: '4', date: '2024-03-13 14:20:00', user: 'system', action: 'LOGIN_FAILED', details: 'Failed login attempt from IP 192.168.1.1', severity: 'error' },
  ];

  const columns = [
    { 
      accessorKey: 'date', 
      header: t.academic.date,
      cell: ({ row }: any) => <span className="font-mono text-xs">{row.original.date}</span>
    },
    { 
      accessorKey: 'user', 
      header: t.logs.user,
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          {row.original.user === 'system' ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
          <span>{row.original.user}</span>
        </div>
      )
    },
    { 
      accessorKey: 'action', 
      header: t.logs.action,
      cell: ({ row }: any) => (
        <Badge variant="outline" className="font-mono text-[10px]">
          {row.original.action}
        </Badge>
      )
    },
    { accessorKey: 'details', header: 'Details' },
    { 
      accessorKey: 'severity', 
      header: 'Severity',
      cell: ({ row }: any) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
          info: 'default',
          warning: 'outline',
          error: 'destructive'
        };
        return <Badge variant={variants[row.original.severity] || 'default'}>{row.original.severity}</Badge>;
      }
    }
  ];

  return (
    <Page>
      <PageHeader>
        <PageTitle>
          <div className="flex items-center gap-2">
            <History className="h-6 w-6 text-primary" />
            {t.logs.title}
          </div>
        </PageTitle>
      </PageHeader>

      <PageBody className="space-y-4">
        <Card>
          <CardContent className="py-4">
            <HStack className="gap-4">
              <div className="w-64">
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.logs.filter} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.logs.allActions}</SelectItem>
                    <SelectItem value="student">Student Actions</SelectItem>
                    <SelectItem value="auth">Auth Actions</SelectItem>
                    <SelectItem value="system">System Actions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </HStack>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <DataTable 
              columns={columns} 
              data={actionFilter === 'all' ? logs : logs.filter(l => l.action.toLowerCase().includes(actionFilter))} 
              searchable 
              searchColumn="user" 
            />
          </CardContent>
        </Card>
      </PageBody>
    </Page>
  );
}
