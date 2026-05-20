import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { blink } from '../../lib/blink';
import { useLanguage } from '../../hooks/useLanguage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  RadioGroup,
  RadioGroupItem,
} from '@blinkdotnew/ui';
import { Loader2, Upload, X } from 'lucide-react';
import { generateMatricule } from '../../lib/utils/matricule';
import { toast } from '@blinkdotnew/ui';

const studentSchema = z.object({
  nom: z.string().min(2, 'Le nom est requis'),
  prenom: z.string().min(2, 'Le prénom est requis'),
  dateNaissance: z.string().min(1, 'La date de naissance est requise'),
  lieuNaissanceId: z.string().min(1, 'Le lieu de naissance est requis'),
  sexe: z.enum(['garcon', 'fille']),
  langue: z.enum(['fr', 'en']),
  idClasseActuelle: z.string().min(1, 'La classe est requise'),
  parentId: z.string().optional(),
});

interface StudentFormProps {
  student?: any;
  onClose: () => void;
}

export function StudentForm({ student, onClose }: StudentFormProps) {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(student?.photoUrl || null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: cities = [] } = useQuery({
    queryKey: ['cities'],
    queryFn: () => blink.db.villesCameroun.list()
  });

  const { data: classes = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: () => blink.db.classes.list()
  });

  const { data: levels = [] } = useQuery({
    queryKey: ['levels'],
    queryFn: () => blink.db.niveaux.list()
  });

  const { data: parents = [] } = useQuery({
    queryKey: ['parents'],
    queryFn: () => blink.db.personnes.list({ where: { typePersonne: 'parent' } })
  });

  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      nom: student?.nom || '',
      prenom: student?.prenom || '',
      dateNaissance: student?.dateNaissance || '',
      lieuNaissanceId: student?.lieuNaissanceId || '',
      sexe: student?.sexe || 'fille',
      langue: student?.langue || 'fr',
      idClasseActuelle: student?.idClasseActuelle || '',
      parentId: student?.parentId || '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof studentSchema>) => {
      let photoUrl = student?.photoUrl;

      if (photo) {
        setIsUploading(true);
        try {
          const { url } = await blink.storage.upload(photo);
          photoUrl = url;
        } catch (error) {
          toast.error('Erreur lors de l\'envoi de la photo');
        } finally {
          setIsUploading(false);
        }
      }

      const payload = {
        ...values,
        photoUrl,
        actif: "1",
      };

      if (student) {
        return blink.db.eleves.update(student.matricule, payload);
      } else {
        return blink.db.eleves.create({
          ...payload,
          matricule: generateMatricule(),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success(student ? 'Étudiant mis à jour' : 'Étudiant ajouté');
      onClose();
    },
    onError: (error) => {
      toast.error('Une erreur est survenue');
      console.error(error);
    }
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{student ? t('students.editStudent') : t('students.addStudent')}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Photo Upload */}
              <div className="flex flex-col items-center space-y-4 border rounded-lg p-4 bg-muted/30">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-primary/20">
                  {photoPreview ? (
                    <>
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => { setPhoto(null); setPhotoPreview(null); }}
                        className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <Label htmlFor="photo" className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                  {t('students.photo')}
                  <input id="photo" type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                </Label>
              </div>

              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">{t('students.personalInfo')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('students.lastName')}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="prenom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('students.firstName')}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="dateNaissance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('students.dateOfBirth')}</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lieuNaissanceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('students.placeOfBirth')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('students.selectCity')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((city: any) => (
                            <SelectItem key={city.id} value={city.id}>{city.nom} ({city.region})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sexe"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>{t('students.gender')}</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-row space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl><RadioGroupItem value="garcon" /></FormControl>
                              <Label className="font-normal">{t('students.male')}</Label>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl><RadioGroupItem value="fille" /></FormControl>
                              <Label className="font-normal">{t('students.female')}</Label>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="langue"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>{t('students.language')}</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-row space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl><RadioGroupItem value="fr" /></FormControl>
                              <Label className="font-normal">{t('students.french')}</Label>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl><RadioGroupItem value="en" /></FormControl>
                              <Label className="font-normal">{t('students.english')}</Label>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Academic & Relationship Info */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">{t('students.academicInfo')}</h3>
                  <FormField
                    control={form.control}
                    name="idClasseActuelle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('students.class')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choisir une classe" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {classes.map((cls: any) => (
                              <SelectItem key={cls.id} value={cls.id}>{cls.libelle}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">{t('students.relationshipInfo')}</h3>
                  <FormField
                    control={form.control}
                    name="parentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('students.parent')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choisir un parent" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {parents.map((p: any) => (
                              <SelectItem key={p.id} value={p.id}>{p.nom} {p.prenom}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>
                Annuler
              </Button>
              <Button type="submit" disabled={mutation.isPending || isUploading}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('students.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
