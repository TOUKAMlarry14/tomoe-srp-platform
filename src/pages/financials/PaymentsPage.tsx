import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { blink } from '../../lib/blink';
import { useLanguage } from '../../hooks/useLanguage';
import { useFinancials } from '../../hooks/useFinancials';
import { 
  DataTable, 
  Button, 
  Input, 
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Badge,
} from '@blinkdotnew/ui';
import { Plus, Search, History, CreditCard } from 'lucide-react';

export default function PaymentsPage() {
  const { t } = useLanguage();
  const { payments, addPayment } = useFinancials();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [search, setSearch] = useState('');

  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: () => blink.db.eleves.list()
  });

  const filteredPayments = (payments.data || []).filter((p: any) => {
    const student = students.find((s: any) => s.matricule === p.eleveId);
    if (!student) return false;
    const studentName = `${student.nom} ${student.prenom}`.toLowerCase();
    return studentName.includes(search.toLowerCase()) || p.eleveId.toLowerCase().includes(search.toLowerCase());
  });

  const columns = [
    {
      header: t('students.name'),
      cell: ({ row }: any) => {
        const student = students.find((s: any) => s.matricule === row.original.eleveId);
        return student ? `${student.nom} ${student.prenom}` : row.original.eleveId;
      }
    },
    {
      accessorKey: 'montant',
      header: t('financials.amount'),
      cell: ({ row }: any) => `${Number(row.original.montant).toLocaleString()} FCFA`
    },
    {
      accessorKey: 'typePaiement',
      header: t('financials.type'),
    },
    {
      accessorKey: 'moyenPaiement',
      header: t('financials.paymentMode'),
    },
    {
      accessorKey: 'datePaiement',
      header: t('financials.paymentDate'),
      cell: ({ row }: any) => new Date(row.original.datePaiement).toLocaleDateString()
    },
    {
      accessorKey: 'reference',
      header: t('financials.reference'),
    }
  ];

  const handleRecordPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      id: crypto.randomUUID(),
      eleveId: formData.get('eleveId'),
      montant: Number(formData.get('amount')),
      typePaiement: formData.get('type'),
      moyenPaiement: formData.get('mode'),
      reference: formData.get('reference'),
      statut: 'valide'
    };
    
    await addPayment.mutateAsync(data);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('financials.payments')}</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('financials.recordPayment')}
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={t('students.searchPlaceholder')} 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <DataTable 
            columns={columns} 
            data={filteredPayments} 
            loading={payments.isLoading}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('financials.recordPayment')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRecordPayment} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>{t('common.students')}</Label>
              <select 
                name="eleveId" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Select a student</option>
                {students.map((s: any) => (
                  <option key={s.matricule} value={s.matricule}>{s.nom} {s.prenom} ({s.matricule})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('financials.amount')}</Label>
                <Input name="amount" type="number" required />
              </div>
              <div className="space-y-2">
                <Label>{t('financials.type')}</Label>
                <select 
                  name="type" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="Inscription">{t('financials.inscription')}</option>
                  <option value="Tranche 1">{t('financials.tranche1')}</option>
                  <option value="Tranche 2">{t('financials.tranche2')}</option>
                  <option value="Tranche 3">{t('financials.tranche3')}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('financials.paymentMode')}</Label>
                <select 
                  name="mode" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="Cash">Cash</option>
                  <option value="OM">Orange Money</option>
                  <option value="MTN">MTN MoMo</option>
                  <option value="Bank">Bank Transfer</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>{t('financials.reference')}</Label>
                <Input name="reference" placeholder="Ref/Transaction ID" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={addPayment.isPending}>
                <CreditCard className="mr-2 h-4 w-4" />
                {t('financials.recordPayment')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
