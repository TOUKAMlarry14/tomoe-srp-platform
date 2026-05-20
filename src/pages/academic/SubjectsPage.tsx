import React, { useState } from 'react';
import { 
  Page, 
  PageHeader, 
  PageTitle, 
  PageActions,
  PageBody, 
  Card, 
  CardContent,
  DataTable,
  Button,
  Input,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  toast,
  Badge,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@blinkdotnew/ui';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../lib/i18n';
import { Plus, BookOpen, Trash2, Edit } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

interface Subject {
  id: string;
  name: string;
  coefficient: number;
  level: string;
}

const INITIAL_SUBJECTS: Subject[] = [
  { id: '1', name: 'Mathématiques', coefficient: 5, level: 'Secondary' },
  { id: '2', name: 'Anglais', coefficient: 3, level: 'Secondary' },
  { id: '3', name: 'Français', coefficient: 4, level: 'Secondary' },
  { id: '4', name: 'Physique-Chimie', coefficient: 4, level: 'High School' },
  { id: '5', name: 'Sciences de la Vie et de la Terre', coefficient: 3, level: 'Secondary' },
];

export default function SubjectsPage() {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSubject, setNewSubject] = useState<Partial<Subject>>({
    name: '',
    coefficient: 1,
    level: 'Secondary'
  });

  const handleAddSubject = () => {
    if (!newSubject.name) {
      toast.error(language === 'fr' ? 'Nom requis' : 'Name required');
      return;
    }
    
    const subject: Subject = {
      id: Math.random().toString(36).substr(2, 9),
      name: newSubject.name as string,
      coefficient: Number(newSubject.coefficient) || 1,
      level: newSubject.level as string
    };
    
    setSubjects([...subjects, subject]);
    setIsDialogOpen(false);
    setNewSubject({ name: '', coefficient: 1, level: 'Secondary' });
    toast.success(language === 'fr' ? 'Matière ajoutée' : 'Subject added');
  };

  const handleDelete = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
    toast.success(language === 'fr' ? 'Matière supprimée' : 'Subject deleted');
  };

  const columns: ColumnDef<Subject>[] = [
    {
      accessorKey: 'name',
      header: t.academic.subjects,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.original.name}</span>
        </div>
      )
    },
    {
      accessorKey: 'coefficient',
      header: t.academic.coefficient,
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-mono">
          x{row.original.coefficient}
        </Badge>
      )
    },
    {
      accessorKey: 'level',
      header: t.academic.level,
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original.level}
        </Badge>
      )
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <Page>
      <PageHeader>
        <PageTitle>{t.academic.manageSubjects}</PageTitle>
        <PageActions>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {t.academic.addSubject}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.academic.addSubject}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.students.name}</label>
                  <Input 
                    value={newSubject.name} 
                    onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                    placeholder="e.g. Mathematics" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.academic.coefficient}</label>
                    <Input 
                      type="number"
                      value={newSubject.coefficient} 
                      onChange={(e) => setNewSubject({...newSubject, coefficient: parseInt(e.target.value) || 0})}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.academic.level}</label>
                    <Select 
                      value={newSubject.level} 
                      onValueChange={(val) => setNewSubject({...newSubject, level: val})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Primary">Primary</SelectItem>
                        <SelectItem value="Secondary">Secondary</SelectItem>
                        <SelectItem value="High School">High School</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddSubject}>{t.academic.addSubject}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PageActions>
      </PageHeader>
      <PageBody>
        <Card>
          <CardContent className="p-0">
            <DataTable 
              columns={columns} 
              data={subjects} 
              searchable
              searchColumn="name"
            />
          </CardContent>
        </Card>
      </PageBody>
    </Page>
  );
}
