import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { blink } from '../../lib/blink';
import { useLanguage } from '../../hooks/useLanguage';
import { 
  DataTable, 
  Button, 
  Input, 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Badge,
  Page,
  PageHeader,
  PageTitle,
  PageBody,
} from '@blinkdotnew/ui';
import { Plus, Search, Edit2, Eye, FileDown } from 'lucide-react';
import { StudentForm } from './StudentForm';
import { StudentProfile } from './StudentProfile';

export function StudentListPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      // In a real app, we'd join with classes and levels
      // For now, we'll fetch them and map them
      const res = await blink.db.eleves.list();
      return res;
    }
  });

  const { data: classes = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: () => blink.db.classes.list()
  });

  const { data: levels = [] } = useQuery({
    queryKey: ['levels'],
    queryFn: () => blink.db.niveaux.list()
  });

  const filteredStudents = students.filter((student: any) => {
    const matchesSearch = 
      student.nom.toLowerCase().includes(search.toLowerCase()) || 
      student.prenom.toLowerCase().includes(search.toLowerCase()) ||
      student.matricule.toLowerCase().includes(search.toLowerCase());
    
    const matchesClass = selectedClass === 'all' || student.idClasseActuelle === selectedClass;
    
    // Level matching would require checking the class level
    // For simplicity, we'll just filter by class if selected
    return matchesSearch && matchesClass;
  });

  const columns = [
    {
      accessorKey: 'matricule',
      header: t('students.matricule'),
    },
    {
      accessorKey: 'photoUrl',
      header: t('students.photo'),
      cell: ({ row }: any) => (
        <Avatar className="h-10 w-10">
          <AvatarImage src={row.original.photoUrl} alt={row.original.nom} />
          <AvatarFallback>{row.original.nom.charAt(0)}</AvatarFallback>
        </Avatar>
      )
    },
    {
      header: t('students.name'),
      cell: ({ row }: any) => `${row.original.nom} ${row.original.prenom}`
    },
    {
      accessorKey: 'idClasseActuelle',
      header: t('students.class'),
      cell: ({ row }: any) => {
        const cls = classes.find((c: any) => c.id === row.original.idClasseActuelle);
        return cls ? cls.libelle : '-';
      }
    },
    {
      header: t('students.level'),
      cell: ({ row }: any) => {
        const cls = classes.find((c: any) => c.id === row.original.idClasseActuelle);
        const lvl = levels.find((l: any) => l.id === cls?.niveauId);
        return lvl ? lvl.libelleFr : '-';
      }
    },
    {
      accessorKey: 'actif',
      header: t('students.status'),
      cell: ({ row }: any) => (
        <Badge variant={row.original.actif === "1" ? "default" : "destructive"}>
          {row.original.actif === "1" ? t('students.active') : t('students.inactive')}
        </Badge>
      )
    },
    {
      id: 'actions',
      header: t('students.actions'),
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => {
            setSelectedStudent(row.original);
            setIsProfileOpen(true);
          }}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => {
            setSelectedStudent(row.original);
            setIsFormOpen(true);
          }}>
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <Page>
      <PageHeader>
        <div className="flex justify-between items-center w-full">
          <PageTitle>{t('students.title')}</PageTitle>
          <Button onClick={() => {
            setSelectedStudent(null);
            setIsFormOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            {t('students.addStudent')}
          </Button>
        </div>
      </PageHeader>

      <PageBody className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={t('students.searchPlaceholder')} 
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('students.allLevels')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('students.allLevels')}</SelectItem>
              {levels.map((lvl: any) => (
                <SelectItem key={lvl.id} value={lvl.id}>{lvl.libelleFr}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('students.allClasses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('students.allClasses')}</SelectItem>
              {classes
                .filter((c: any) => selectedLevel === 'all' || c.niveauId === selectedLevel)
                .map((cls: any) => (
                  <SelectItem key={cls.id} value={cls.id}>{cls.libelle}</SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <DataTable 
            columns={columns} 
            data={filteredStudents} 
            loading={isLoading}
          />
        </div>

        {isFormOpen && (
          <StudentForm 
            student={selectedStudent} 
            onClose={() => setIsFormOpen(false)} 
          />
        )}

        {isProfileOpen && (
          <StudentProfile 
            student={selectedStudent} 
            onClose={() => setIsProfileOpen(false)} 
          />
        )}
      </PageBody>
    </Page>
  );
}
