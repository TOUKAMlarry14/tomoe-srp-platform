import React, { useState } from 'react';
import { 
  Page, 
  PageHeader, 
  PageTitle, 
  PageBody, 
  Card, 
  CardContent,
  DataTable,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  toast,
  Persona,
  Badge
} from '@blinkdotnew/ui';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../lib/i18n';
import { Save, UserCheck, UserX, Clock, FileText } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

interface StudentAttendance {
  id: string;
  name: string;
  status: AttendanceStatus;
}

const MOCK_STUDENTS: StudentAttendance[] = [
  { id: '1', name: 'Jean Dupont', status: 'present' },
  { id: '2', name: 'Marie Curie', status: 'present' },
  { id: '3', name: 'Albert Einstein', status: 'present' },
  { id: '4', name: 'Isaac Newton', status: 'present' },
  { id: '5', name: 'Ada Lovelace', status: 'present' },
];

export default function AttendancePage() {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<StudentAttendance[]>(MOCK_STUDENTS);

  const handleStatusChange = (id: string, status: AttendanceStatus) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    
    if (status === 'absent') {
      const student = students.find(s => s.id === id);
      if (student) {
        toast(t.academic.absentNotification.replace('{name}', student.name), {
          icon: <UserX className="h-4 w-4 text-destructive" />
        });
      }
    }
  };

  const stats = {
    present: students.filter(s => s.status === 'present').length,
    absent: students.filter(s => s.status === 'absent').length,
    late: students.filter(s => s.status === 'late').length,
    excused: students.filter(s => s.status === 'excused').length,
  };

  const handleSave = () => {
    if (!selectedClass) {
      toast.error(t.academic.selectClass);
      return;
    }
    
    toast.success(t.academic.saveAttendance + ' ' + (language === 'fr' ? 'réussie' : 'successful'));
    console.log('Saving attendance:', {
      class: selectedClass,
      date: selectedDate,
      attendance: students
    });
  };

  const columns: ColumnDef<StudentAttendance>[] = [
    {
      accessorKey: 'name',
      header: t.academic.studentName,
      cell: ({ row }) => (
        <Persona name={row.original.name} />
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div className="flex items-center gap-1">
            <Button 
              variant={s.status === 'present' ? 'default' : 'outline'} 
              size="sm" 
              className="px-2 h-8"
              onClick={() => handleStatusChange(s.id, 'present')}
              title={t.academic.present}
            >
              <UserCheck className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">{t.academic.present}</span>
            </Button>
            <Button 
              variant={s.status === 'absent' ? 'destructive' : 'outline'} 
              size="sm" 
              className="px-2 h-8"
              onClick={() => handleStatusChange(s.id, 'absent')}
              title={t.academic.absent}
            >
              <UserX className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">{t.academic.absent}</span>
            </Button>
            <Button 
              variant={s.status === 'late' ? 'secondary' : 'outline'} 
              size="sm" 
              className="px-2 h-8"
              onClick={() => handleStatusChange(s.id, 'late')}
              title={t.academic.late}
            >
              <Clock className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">{t.academic.late}</span>
            </Button>
            <Button 
              variant={s.status === 'excused' ? 'outline' : 'outline'} 
              size="sm" 
              className={`px-2 h-8 ${s.status === 'excused' ? 'bg-muted' : ''}`}
              onClick={() => handleStatusChange(s.id, 'excused')}
              title={t.academic.excused}
            >
              <FileText className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">{t.academic.excused}</span>
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <Page>
      <PageHeader>
        <PageTitle>{t.academic.attendance}</PageTitle>
      </PageHeader>
      <PageBody>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
            <label className="text-sm font-medium">{t.academic.date}</label>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="outline" className="bg-primary/5 px-3 py-1">
            {t.academic.present}: {stats.present}
          </Badge>
          <Badge variant="outline" className="bg-destructive/5 text-destructive border-destructive/20 px-3 py-1">
            {t.academic.absent}: {stats.absent}
          </Badge>
          <Badge variant="outline" className="bg-warning/5 px-3 py-1">
            {t.academic.late}: {stats.late}
          </Badge>
          <Badge variant="outline" className="bg-muted px-3 py-1">
            {t.academic.excused}: {stats.excused}
          </Badge>
        </div>

        <Card className="mb-6">
          <CardContent className="p-0">
            <DataTable 
              columns={columns} 
              data={students} 
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="gap-2" onClick={handleSave}>
            <Save className="h-4 w-4" />
            {t.academic.saveAttendance}
          </Button>
        </div>
      </PageBody>
    </Page>
  );
}
