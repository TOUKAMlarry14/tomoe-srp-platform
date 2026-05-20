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
  CardContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Badge,
} from '@blinkdotnew/ui';
import { Plus, Save, Banknote } from 'lucide-react';

export default function SalariesPage() {
  const { t } = useLanguage();
  const { salaries, upsertSalary } = useFinancials();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState<any>(null);

  const { data: employees = [] } = useQuery({
    queryKey: ['staff'],
    queryFn: () => blink.db.personnes.list({
      where: { typePersonne: 'enseignant' } // Simplified staff filter
    })
  });

  const columns = [
    {
      header: t('financials.employee'),
      cell: ({ row }: any) => {
        const emp = employees.find((e: any) => e.id === row.original.personneId);
        return emp ? `${emp.nom} ${emp.prenom}` : row.original.personneId;
      }
    },
    {
      accessorKey: 'mois',
      header: t('financials.month'),
    },
    {
      accessorKey: 'salaireBase',
      header: t('financials.baseSalary'),
      cell: ({ row }: any) => `${Number(row.original.salaireBase).toLocaleString()} FCFA`
    },
    {
      accessorKey: 'primes',
      header: t('financials.bonuses'),
      cell: ({ row }: any) => `${Number(row.original.primes).toLocaleString()} FCFA`
    },
    {
      accessorKey: 'retenues',
      header: t('financials.deductions'),
      cell: ({ row }: any) => `${Number(row.original.retenues).toLocaleString()} FCFA`
    },
    {
      id: 'net',
      header: 'Net',
      cell: ({ row }: any) => {
        const net = Number(row.original.salaireBase) + Number(row.original.primes) - Number(row.original.retenues);
        return <span className="font-bold">{net.toLocaleString()} FCFA</span>;
      }
    },
    {
      accessorKey: 'statut',
      header: t('financials.status'),
      cell: ({ row }: any) => (
        <Badge variant={row.original.statut === 'paye' ? 'default' : 'outline'}>
          {row.original.statut === 'paye' ? t('financials.markAsPaid').split(' ')[2] : 'Pending'}
        </Badge>
      )
    },
    {
      id: 'actions',
      header: t('students.actions'),
      cell: ({ row }: any) => (
        <Button variant="ghost" size="icon" onClick={() => {
          setSelectedSalary(row.original);
          setIsDialogOpen(true);
        }}>
          <Banknote className="h-4 w-4" />
        </Button>
      )
    }
  ];

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      id: selectedSalary?.id || crypto.randomUUID(),
      personneId: formData.get('personneId'),
      mois: formData.get('mois'),
      salaireBase: Number(formData.get('baseSalary')),
      primes: Number(formData.get('bonuses')),
      retenues: Number(formData.get('deductions')),
      statut: formData.get('statut'),
      datePaiement: formData.get('statut') === 'paye' ? new Date().toISOString() : null
    };
    
    await upsertSalary.mutateAsync(data);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('financials.staffSalaries')}</h2>
        <Button onClick={() => {
          setSelectedSalary(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          {t('financials.markAsPaid').split(' ')[0]} {/* Generic Add button text */}
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <DataTable 
            columns={columns} 
            data={salaries.data || []} 
            isLoading={salaries.isLoading}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('financials.staffSalaries')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('financials.employee')}</Label>
                <select 
                  name="personneId" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={selectedSalary?.personneId}
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((e: any) => (
                    <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>{t('financials.month')}</Label>
                <Input name="mois" type="month" defaultValue={selectedSalary?.mois} required />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>{t('financials.baseSalary')}</Label>
                <Input name="baseSalary" type="number" defaultValue={selectedSalary?.salaireBase} required />
              </div>
              <div className="space-y-2">
                <Label>{t('financials.bonuses')}</Label>
                <Input name="bonuses" type="number" defaultValue={selectedSalary?.primes} />
              </div>
              <div className="space-y-2">
                <Label>{t('financials.deductions')}</Label>
                <Input name="deductions" type="number" defaultValue={selectedSalary?.retenues} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('financials.status')}</Label>
              <select 
                name="statut" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue={selectedSalary?.statut || 'en_attente'}
              >
                <option value="en_attente">Pending</option>
                <option value="paye">Paid</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={upsertSalary.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {t('students.save')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
