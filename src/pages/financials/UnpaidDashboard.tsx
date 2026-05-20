import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useFinancials } from '../../hooks/useFinancials';
import { 
  DataTable, 
  Button, 
  Card, 
  CardContent, 
  Stat, 
  StatGroup,
} from '@blinkdotnew/ui';
import { Send, AlertTriangle, CheckCircle, Wallet } from 'lucide-react';

export default function UnpaidDashboard() {
  const { t } = useLanguage();
  const { studentsWithBalance, financialStats } = useFinancials();

  const stats = financialStats.data || {
    totalExpected: 0,
    totalCollected: 0,
    totalOutstanding: 0
  };

  const columns = [
    {
      header: t('students.name'),
      cell: ({ row }: any) => `${row.original.nom} ${row.original.prenom}`
    },
    {
      accessorKey: 'matricule',
      header: t('students.matricule'),
    },
    {
      accessorKey: 'totalExpected',
      header: t('financials.totalExpected'),
      cell: ({ row }: any) => `${Number(row.original.totalExpected).toLocaleString()} FCFA`
    },
    {
      accessorKey: 'totalPaid',
      header: t('financials.totalCollected'),
      cell: ({ row }: any) => `${Number(row.original.totalPaid).toLocaleString()} FCFA`
    },
    {
      accessorKey: 'balance',
      header: t('financials.balance'),
      cell: ({ row }: any) => (
        <span className="font-bold text-destructive">
          {Number(row.original.balance).toLocaleString()} FCFA
        </span>
      )
    },
    {
      id: 'actions',
      header: t('students.actions'),
      cell: ({ row }: any) => (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => alert(t('financials.reminderSent').replace('{name}', row.original.nom))}
        >
          <Send className="mr-2 h-4 w-4" />
          {t('financials.sendReminder')}
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('financials.unpaidDashboard')}</h2>

      <StatGroup className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat 
          label={t('financials.totalExpected')} 
          value={`${stats.totalExpected.toLocaleString()} FCFA`} 
          icon={<Wallet className="h-4 w-4" />}
        />
        <Stat 
          label={t('financials.totalCollected')} 
          value={`${stats.totalCollected.toLocaleString()} FCFA`} 
          icon={<CheckCircle className="h-4 w-4 text-green-500" />}
        />
        <Stat 
          label={t('financials.totalOutstanding')} 
          value={`${stats.totalOutstanding.toLocaleString()} FCFA`} 
          icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
        />
      </StatGroup>

      <Card>
        <CardContent className="p-0">
          <DataTable 
            columns={columns} 
            data={studentsWithBalance.data || []} 
            isLoading={studentsWithBalance.isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
