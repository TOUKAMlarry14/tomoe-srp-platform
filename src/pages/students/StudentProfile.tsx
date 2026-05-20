import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { blink } from '../../lib/blink';
import { useLanguage } from '../../hooks/useLanguage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@blinkdotnew/ui';
import { FileDown, Calendar, MapPin, User, BookOpen, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

interface StudentProfileProps {
  student: any;
  onClose: () => void;
}

export function StudentProfile({ student, onClose }: StudentProfileProps) {
  const { t } = useLanguage();

  const { data: city } = useQuery({
    queryKey: ['city', student.lieuNaissanceId],
    queryFn: () => blink.db.villesCameroun.get(student.lieuNaissanceId),
    enabled: !!student.lieuNaissanceId,
  });

  const { data: currentClass } = useQuery({
    queryKey: ['class', student.idClasseActuelle],
    queryFn: () => blink.db.classes.get(student.idClasseActuelle),
    enabled: !!student.idClasseActuelle,
  });

  const { data: parent } = useQuery({
    queryKey: ['parent', student.parentId],
    queryFn: () => blink.db.personnes.get(student.parentId),
    enabled: !!student.parentId,
  });

  const { data: incidents = [] } = useQuery({
    queryKey: ['incidents', student.matricule],
    queryFn: () => blink.db.incidentsDisciplinaires.list({ where: { eleveId: student.matricule } }),
  });

  const handleExportPDF = () => {
    toast.success("Génération du PDF en cours... (Stub)");
    // Here we would use a library like jspdf or a backend function to generate a real PDF
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{t('students.profile')}</DialogTitle>
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <FileDown className="mr-2 h-4 w-4" />
            {t('students.exportPDF')}
          </Button>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Left Column: Avatar & Basic Info */}
          <Card className="md:col-span-1">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="h-32 w-32 border-4 border-primary/10 mb-4">
                <AvatarImage src={student.photoUrl} alt={student.nom} />
                <AvatarFallback className="text-4xl">{student.nom.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{student.nom} {student.prenom}</h2>
              <p className="text-muted-foreground font-mono text-sm mb-2">{student.matricule}</p>
              <Badge variant={student.actif === "1" ? "default" : "destructive"}>
                {student.actif === "1" ? t('students.active') : t('students.inactive')}
              </Badge>

              <div className="w-full mt-6 space-y-3 text-left">
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium mr-2">{t('students.gender')}:</span>
                  {student.sexe === 'fille' ? t('students.female') : t('students.male')}
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium mr-2">{t('students.dateOfBirth')}:</span>
                  {student.dateNaissance}
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium mr-2">{t('students.placeOfBirth')}:</span>
                  {city ? `${city.nom}, ${city.region}` : '-'}
                </div>
                <div className="flex items-center text-sm">
                  <BookOpen className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium mr-2">{t('students.language')}:</span>
                  {student.langue === 'fr' ? t('students.french') : t('students.english')}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column: Tabs for Details */}
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="academic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="academic">{t('students.academicInfo')}</TabsTrigger>
                <TabsTrigger value="parent">{t('students.relationshipInfo')}</TabsTrigger>
                <TabsTrigger value="discipline">{t('students.discipline')}</TabsTrigger>
              </TabsList>

              <TabsContent value="academic" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('students.history')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 border rounded-lg bg-primary/5 border-primary/20">
                      <div>
                        <p className="font-semibold">{currentClass?.libelle || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">Année Académique 2025-2026</p>
                      </div>
                      <Badge>Actuel</Badge>
                    </div>
                    {/* Placeholder for history */}
                    <div className="p-3 border rounded-lg opacity-60">
                      <p className="font-semibold">Classe Précédente</p>
                      <p className="text-sm text-muted-foreground">Année Académique 2024-2025</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="parent" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('students.parent')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {parent ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">{t('students.name')}</p>
                            <p className="font-medium">{parent.nom} {parent.prenom}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Mobile</p>
                            <p className="font-medium">{parent.mobile || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">Aucun parent lié</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="discipline" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <ShieldAlert className="h-5 w-5 mr-2 text-destructive" />
                      {t('students.discipline')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {incidents.length > 0 ? (
                      <div className="space-y-3">
                        {incidents.map((incident: any) => (
                          <div key={incident.id} className="p-3 border border-destructive/20 bg-destructive/5 rounded-lg">
                            <div className="flex justify-between">
                              <p className="font-semibold">{incident.natureInfraction}</p>
                              <span className="text-xs text-muted-foreground">{incident.dateIncident}</span>
                            </div>
                            <p className="text-sm mt-1">{incident.description}</p>
                            <Badge variant="outline" className="mt-2 border-destructive text-destructive">
                              Sanction: {incident.sanction}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">Aucun incident enregistré</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
