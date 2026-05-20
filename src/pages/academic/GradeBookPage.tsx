import React, { useState, useMemo } from 'react';
import { 
  Page, 
  PageHeader, 
  PageTitle, 
  PageBody, 
  Card, 
  CardContent,
  DataTable,
  Input,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  toast,
  Persona
} from '@blinkdotnew/ui';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../lib/i18n';
import { Save, Calculator } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

interface StudentGrade {
  id: string;
  name: string;
  grade: string;
}

const MOCK_STUDENTS: StudentGrade[] = [
  { id: '1', name: 'Jean Dupont', grade: '' },
  { id: '2', name: 'Marie Curie', grade: '' },
  { id: '3', name: 'Albert Einstein', grade: '' },
  { id: '4', name: 'Isaac Newton', grade: '' },
  { id: '5', name: 'Ada Lovelace', grade: '' },
];

export default function GradeBookPage() {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSequence, setSelectedSequence] = useState('');
  const [students, setStudents] = useState<StudentGrade[]>(MOCK_STUDENTS);

  const handleGradeChange = (id: string, value: string) => {
    // Basic validation 0-20
    const numValue = parseFloat(value);
    if (value !== '' && (isNaN(numValue) || numValue < 0 || numValue > 20)) {
      return;
    }
    
    setStudents(prev => prev.map(s => s.id === id ? { ...s, grade: value } : s));
  };

  const average = useMemo(() => {
    const grades = students.map(s => parseFloat(s.grade)).filter(g => !isNaN(g));
    if (grades.length === 0) return 0;
    return (grades.reduce((acc, curr) => acc + curr, 0) / grades.length).toFixed(2);
  }, [students]);

  const handleSave = () => {
    if (!selectedClass || !selectedSubject || !selectedSequence) {
      toast.error(language === 'fr' ? 'Veuillez remplir tous les champs' : 'Please fill all fields');
      return;
    }
    
    toast.success(t.academic.saveNotes + ' ' + (language === 'fr' ? 'réussie' : 'successful'));
    console.log('Saving grades:', {
      class: selectedClass,
      subject: selectedSubject,
      sequence: selectedSequence,
      grades: students
    });
  };

  const columns: ColumnDef<StudentGrade>[] = [
    {
      accessorKey: 'name',
      header: t.academic.studentName,
      cell: ({ row }) => (
        <Persona name={row.original.name} />
      )
    },
    {
      accessorKey: 'grade',
      header: t.academic.grade,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Input 
            type="number" 
            min="0" 
            max="20" 
            step="0.25"
            value={row.original.grade}
            onChange={(e) => handleGradeChange(row.original.id, e.target.value)}
            className="w-24"
            placeholder="0-20"
          />
          <span className="text-muted-foreground text-sm">/ 20</span>
        </div>
      )
    }
  ];

  return (
    <Page>
      <PageHeader>
        <PageTitle>{t.academic.gradeBook}</PageTitle>
      </PageHeader>
      <PageBody>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t.academic.selectClass}</label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder={t.academic.selectClass} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6emeA">6ème A</SelectItem>
                <SelectItem value="6emeB">6ème B</SelectItem>
                <SelectItem value="5emeA">5ème A</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">{t.academic.selectSubject}</label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder={t.academic.selectSubject} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="math">Mathématiques</SelectItem>
                <SelectItem value="physics">Physique</SelectItem>
                <SelectItem value="french">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.academic.selectSequence}</label>
            <Select value={selectedSequence} onValueChange={setSelectedSequence}>
              <SelectTrigger>
                <SelectValue placeholder={t.academic.selectSequence} />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <SelectItem key={i} value={`seq${i}`}>{t.academic.sequence} {i}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-0">
                <DataTable 
                  columns={columns} 
                  data={students} 
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Calculator className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t.academic.average}</p>
                    <p className="text-3xl font-bold">{average} / 20</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full gap-2" onClick={handleSave}>
              <Save className="h-4 w-4" />
              {t.academic.saveNotes}
            </Button>
          </div>
        </div>
      </PageBody>
    </Page>
  );
}
