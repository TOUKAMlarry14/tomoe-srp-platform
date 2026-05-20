import React from 'react';
import { 
  Page, 
  PageHeader, 
  PageTitle, 
  PageActions, 
  PageBody, 
  Button, 
  DataTable, 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent,
  Card,
  CardContent,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  AutoForm
} from '@blinkdotnew/ui';
import { Plus, Gavel, Mail, FileText, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../lib/i18n';
import { z } from 'zod';

const incidentSchema = z.object({
  studentId: z.string().min(1),
  date: z.string(),
  infraction: z.string().min(1),
  points: z.number().int(),
  sanction: z.string().optional(),
});

export default function DisciplinePage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [activeTab, setActiveTab] = React.useState('incidents');

  const incidents = [
    { id: '1', student: 'Jean Dupont', date: '2024-03-12', infraction: 'Late arrival', points: 2, sanction: 'Warning' },
    { id: '2', student: 'Alice Smith', date: '2024-03-10', infraction: 'Disruptive behavior', points: 5, sanction: 'Detention' },
  ];

  const convocations = [
    { id: '1', student: 'Paul Martin', parent: 'M. Martin', date: '2024-03-20', reason: 'Repeated absences' },
    { id: '2', student: 'Sophie Bernard', parent: 'Mme Bernard', date: '2024-03-22', reason: 'Grade drop' },
  ];

  const incidentColumns = [
    { accessorKey: 'student', header: t.students.name },
    { accessorKey: 'date', header: t.academic.date },
    { accessorKey: 'infraction', header: t.discipline.infraction },
    { 
      accessorKey: 'points', 
      header: t.discipline.points,
      cell: ({ row }: any) => (
        <Badge variant={row.original.points > 4 ? 'destructive' : 'secondary'}>
          {row.original.points}
        </Badge>
      )
    },
    { accessorKey: 'sanction', header: t.discipline.sanction },
    {
      id: 'actions',
      cell: () => (
        <Button variant="ghost" size="sm">{t.students.actions}</Button>
      )
    }
  ];

  const convocationColumns = [
    { accessorKey: 'student', header: t.students.name },
    { accessorKey: 'parent', header: t.students.parent },
    { accessorKey: 'date', header: t.academic.date },
    { accessorKey: 'reason', header: t.discipline.reason },
    {
      id: 'actions',
      cell: () => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            {t.discipline.exportPDF}
          </Button>
          <Button variant="ghost" size="sm">
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <Page>
      <PageHeader>
        <PageTitle>{t.common.discipline}</PageTitle>
        <PageActions>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t.discipline.addIncident}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.discipline.addIncident}</DialogTitle>
              </DialogHeader>
              <AutoForm 
                schema={incidentSchema} 
                onSubmit={(data) => console.log('Add Incident:', data)}
              />
            </DialogContent>
          </Dialog>
        </PageActions>
      </PageHeader>

      <PageBody>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="incidents">
              <AlertCircle className="h-4 w-4 mr-2" />
              {t.discipline.incidents}
            </TabsTrigger>
            <TabsTrigger value="convocations">
              <Mail className="h-4 w-4 mr-2" />
              {t.discipline.convocations}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="incidents">
            <Card>
              <CardContent className="p-0">
                <DataTable columns={incidentColumns} data={incidents} searchable searchColumn="student" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="convocations">
            <Card>
              <CardContent className="p-0">
                <DataTable columns={convocationColumns} data={convocations} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageBody>
    </Page>
  );
}
