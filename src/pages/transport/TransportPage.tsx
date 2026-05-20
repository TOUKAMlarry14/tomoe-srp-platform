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
  AutoForm,
  Switch
} from '@blinkdotnew/ui';
import { Plus, Bus, Users, MapPin, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../lib/i18n';
import { z } from 'zod';

const routeSchema = z.object({
  name: z.string().min(1),
  busNumber: z.string().min(1),
  driverName: z.string().min(1),
});

export default function TransportPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [activeTab, setActiveTab] = React.useState('routes');

  const routes = [
    { id: '1', name: 'Route A - Nord', bus: 'BUS-001', driver: 'Mamadou Diallo' },
    { id: '2', name: 'Route B - Est', bus: 'BUS-002', driver: 'Abdoulaye Sow' },
  ];

  const students = [
    { id: '1', name: 'Jean Dupont', route: 'Route A', address: '123 Rue de la Paix', morning: true, evening: false },
    { id: '2', name: 'Alice Smith', route: 'Route A', address: '456 Avenue des Fleurs', morning: false, evening: false },
    { id: '3', name: 'Paul Martin', route: 'Route B', address: '789 Boulevard du Sud', morning: true, evening: true },
  ];

  const routeColumns = [
    { accessorKey: 'name', header: t.transport.routeName },
    { accessorKey: 'bus', header: t.transport.bus },
    { accessorKey: 'driver', header: t.transport.driver },
    {
      id: 'actions',
      cell: () => (
        <Button variant="ghost" size="sm">{t.students.actions}</Button>
      )
    }
  ];

  const pickupColumns = [
    { accessorKey: 'name', header: t.students.name },
    { accessorKey: 'address', header: t.transport.address },
    { accessorKey: 'route', header: t.transport.routes },
    { 
      accessorKey: 'morning', 
      header: t.transport.morning,
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Switch checked={row.original.morning} />
          {row.original.morning && <CheckCircle2 className="h-4 w-4 text-primary" />}
        </div>
      )
    },
    { 
      accessorKey: 'evening', 
      header: t.transport.evening,
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Switch checked={row.original.evening} />
          {row.original.evening && <CheckCircle2 className="h-4 w-4 text-primary" />}
        </div>
      )
    }
  ];

  return (
    <Page>
      <PageHeader>
        <PageTitle>{t.common.transport}</PageTitle>
        <PageActions>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t.transport.addRoute}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.transport.addRoute}</DialogTitle>
              </DialogHeader>
              <AutoForm 
                schema={routeSchema} 
                onSubmit={(data) => console.log('Add Route:', data)}
              />
            </DialogContent>
          </Dialog>
        </PageActions>
      </PageHeader>

      <PageBody>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="routes">
              <MapPin className="h-4 w-4 mr-2" />
              {t.transport.routes}
            </TabsTrigger>
            <TabsTrigger value="pickup">
              <Users className="h-4 w-4 mr-2" />
              {t.transport.pickupList}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="routes">
            <Card>
              <CardContent className="p-0">
                <DataTable columns={routeColumns} data={routes} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pickup">
            <Card>
              <CardContent className="p-0">
                <DataTable columns={pickupColumns} data={students} searchable searchColumn="name" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageBody>
    </Page>
  );
}
