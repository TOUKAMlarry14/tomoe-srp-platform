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
import { Plus, Book, History, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../lib/i18n';
import { z } from 'zod';
import { format } from 'date-fns';

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  level: z.string(),
  section: z.enum(['FR', 'EN']),
  quantity: z.number().min(0),
});

const borrowSchema = z.object({
  studentId: z.string().min(1),
  bookId: z.string().min(1),
  returnDate: z.string(),
});

export default function LibraryPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [activeTab, setActiveTab] = React.useState('books');

  const books = [
    { id: '1', title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry', level: 'Primary', section: 'FR', quantity: 5, status: 'available' },
    { id: '2', title: 'Harry Potter', author: 'J.K. Rowling', level: 'Secondary', section: 'EN', quantity: 2, status: 'available' },
    { id: '3', title: 'L\'Étranger', author: 'Albert Camus', level: 'High School', section: 'FR', quantity: 3, status: 'borrowed' },
  ];

  const loans = [
    { id: '1', student: 'Jean Dupont', book: 'Le Petit Prince', borrowDate: '2024-03-01', returnDate: '2024-03-15', status: 'overdue' },
    { id: '2', student: 'Alice Smith', book: 'Harry Potter', borrowDate: '2024-03-10', returnDate: '2024-03-24', status: 'active' },
  ];

  const bookColumns = [
    { accessorKey: 'title', header: t.library.title },
    { accessorKey: 'author', header: t.library.author },
    { accessorKey: 'level', header: t.students.level },
    { accessorKey: 'section', header: t.library.section },
    { accessorKey: 'quantity', header: t.library.quantity },
    { 
      accessorKey: 'status', 
      header: t.library.status,
      cell: ({ row }: any) => (
        <Badge variant={row.original.status === 'available' ? 'default' : 'secondary'}>
          {row.original.status === 'available' ? t.library.available : t.library.borrowed}
        </Badge>
      )
    },
    {
      id: 'actions',
      cell: () => (
        <Button variant="ghost" size="sm">{t.students.actions}</Button>
      )
    }
  ];

  const loanColumns = [
    { accessorKey: 'student', header: t.library.student },
    { accessorKey: 'book', header: t.library.books },
    { accessorKey: 'borrowDate', header: t.academic.date },
    { accessorKey: 'returnDate', header: t.library.returnDate },
    { 
      accessorKey: 'status', 
      header: t.library.status,
      cell: ({ row }: any) => (
        <Badge variant={row.original.status === 'overdue' ? 'destructive' : 'secondary'}>
          {row.original.status === 'overdue' ? 'Overdue' : 'Active'}
        </Badge>
      )
    },
    {
      id: 'actions',
      cell: () => (
        <Button variant="outline" size="sm">{t.library.return}</Button>
      )
    }
  ];

  return (
    <Page>
      <PageHeader>
        <PageTitle>{t.common.library}</PageTitle>
        <PageActions>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t.library.addBook}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.library.addBook}</DialogTitle>
              </DialogHeader>
              <AutoForm 
                schema={bookSchema} 
                onSubmit={(data) => console.log('Add Book:', data)}
              />
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Book className="h-4 w-4 mr-2" />
                {t.library.borrowBook}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.library.borrowBook}</DialogTitle>
              </DialogHeader>
              <AutoForm 
                schema={borrowSchema} 
                onSubmit={(data) => console.log('Borrow Book:', data)}
              />
            </DialogContent>
          </Dialog>
        </PageActions>
      </PageHeader>

      <PageBody>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="books">
              <Book className="h-4 w-4 mr-2" />
              {t.library.books}
            </TabsTrigger>
            <TabsTrigger value="loans">
              <History className="h-4 w-4 mr-2" />
              {t.library.borrowing}
            </TabsTrigger>
            <TabsTrigger value="overdue" className="text-destructive">
              <AlertTriangle className="h-4 w-4 mr-2" />
              {t.library.overdueLoans}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="books">
            <Card>
              <CardContent className="p-0">
                <DataTable columns={bookColumns} data={books} searchable searchColumn="title" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loans">
            <Card>
              <CardContent className="p-0">
                <DataTable columns={loanColumns} data={loans} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overdue">
            <Card>
              <CardContent className="p-0">
                <DataTable 
                  columns={loanColumns} 
                  data={loans.filter(l => l.status === 'overdue')} 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageBody>
    </Page>
  );
}
