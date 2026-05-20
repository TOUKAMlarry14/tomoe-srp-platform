import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { blink } from '../../lib/blink';
import { useLanguage } from '../../hooks/useLanguage';
import { useFinancials } from '../../hooks/useFinancials';
import { 
  DataTable, 
  Button, 
  Input, 
  Page, 
  PageHeader, 
  PageTitle, 
  PageBody,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@blinkdotnew/ui';
import { Edit2, Plus, Save } from 'lucide-react';

export default function FeeConfigPage() {
  const { t } = useLanguage();
  const { feeConfigs, upsertFeeConfig } = useFinancials();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<any>(null);

  const { data: levels = [] } = useQuery({
    queryKey: ['levels'],
    queryFn: () => blink.db.niveaux.list()
  });

  const { data: academicYears = [] } = useQuery({
    queryKey: ['academic-years'],
    queryFn: () => blink.db.anneesScolaires.list()
  });

  const columns = [
    {
      header: t('students.level'),
      cell: ({ row }: any) => {
        const lvl = levels.find((l: any) => l.id === row.original.niveauId);
        return lvl ? lvl.libelleFr : row.original.niveauId;
      }
    },
    {
      header: t('academic.sequence'), // Using sequence as year proxy for now if needed, or total years
      cell: ({ row }: any) => {
        const year = academicYears.find((y: any) => y.id === row.original.anneeId);
        return year ? year.libelle : row.original.anneeId;
      }
    },
    {
      accessorKey: 'montantInscription',
      header: t('financials.inscription'),
      cell: ({ row }: any) => `${row.original.montantInscription?.toLocaleString()} FCFA`
    },
    {
      accessorKey: 'montantTranche1',
      header: t('financials.tranche1'),
      cell: ({ row }: any) => `${row.original.montantTranche1?.toLocaleString()} FCFA`
    },
    {
      accessorKey: 'montantTranche2',
      header: t('financials.tranche2'),
      cell: ({ row }: any) => `${row.original.montantTranche2?.toLocaleString()} FCFA`
    },
    {
      accessorKey: 'montantTranche3',
      header: t('financials.tranche3'),
      cell: ({ row }: any) => `${row.original.montantTranche3?.toLocaleString()} FCFA`
    },
    {
      id: 'actions',
      header: t('students.actions'),
      cell: ({ row }: any) => (
        <Button variant="ghost" size="icon" onClick={() => {
          setSelectedConfig(row.original);
          setIsDialogOpen(true);
        }}>
          <Edit2 className="h-4 w-4" />
        </Button>
      )
    }
  ];

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      id: selectedConfig?.id || crypto.randomUUID(),
      niveauId: formData.get('niveauId'),
      anneeId: formData.get('anneeId'),
      montantInscription: Number(formData.get('inscription')),
      montantTranche1: Number(formData.get('tranche1')),
      montantTranche2: Number(formData.get('tranche2')),
      montantTranche3: Number(formData.get('tranche3')),
    };
    
    await upsertFeeConfig.mutateAsync(data);
    setIsDialogOpen(false);
    setSelectedConfig(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('financials.feeConfig')}</h2>
        <Button onClick={() => {
          setSelectedConfig(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          {t('common.financials')}
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <DataTable 
            columns={columns} 
            data={feeConfigs.data || []} 
            isLoading={feeConfigs.isLoading}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedConfig ? t('students.editStudent') : t('financials.feeConfig')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('students.level')}</Label>
                <select 
                  name="niveauId" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={selectedConfig?.niveauId}
                  required
                >
                  {levels.map((lvl: any) => (
                    <option key={lvl.id} value={lvl.id}>{lvl.libelleFr}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>{t('academic.sequence')}</Label>
                <select 
                  name="anneeId" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={selectedConfig?.anneeId}
                  required
                >
                  {academicYears.map((year: any) => (
                    <option key={year.id} value={year.id}>{year.libelle}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('financials.inscription')}</Label>
                <Input name="inscription" type="number" defaultValue={selectedConfig?.montantInscription} required />
              </div>
              <div className="space-y-2">
                <Label>{t('financials.tranche1')}</Label>
                <Input name="tranche1" type="number" defaultValue={selectedConfig?.montantTranche1} required />
              </div>
              <div className="space-y-2">
                <Label>{t('financials.tranche2')}</Label>
                <Input name="tranche2" type="number" defaultValue={selectedConfig?.montantTranche2} required />
              </div>
              <div className="space-y-2">
                <Label>{t('financials.tranche3')}</Label>
                <Input name="tranche3" type="number" defaultValue={selectedConfig?.montantTranche3} required />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t('students.searchPlaceholder').split(' ')[0]} {/* Cancel/Annuler substitute */}
              </Button>
              <Button type="submit" loading={upsertFeeConfig.isPending}>
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
