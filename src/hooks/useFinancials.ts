import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blink } from '../lib/blink';

export function useFinancials() {
  const queryClient = useQueryClient();

  // Fee Configuration
  const feeConfigs = useQuery({
    queryKey: ['feeConfigs'],
    queryFn: () => blink.db.fraisScolarite.list()
  });

  const upsertFeeConfig = useMutation({
    mutationFn: (data: any) => blink.db.fraisScolarite.upsert(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feeConfigs'] })
  });

  // Payments
  const payments = useQuery({
    queryKey: ['payments'],
    queryFn: () => blink.db.paiements.list()
  });

  const addPayment = useMutation({
    mutationFn: (data: any) => blink.db.paiements.create({
      ...data,
      datePaiement: data.datePaiement || new Date().toISOString()
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payments'] })
  });

  // Staff Salaries
  const salaries = useQuery({
    queryKey: ['salaries'],
    queryFn: () => blink.db.salaires.list()
  });

  const upsertSalary = useMutation({
    mutationFn: (data: any) => blink.db.salaires.upsert(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['salaries'] })
  });

  // Students with balance (Unpaid Dashboard)
  const studentsWithBalance = useQuery({
    queryKey: ['students-balance'],
    queryFn: async () => {
      const students = await blink.db.eleves.list();
      const allPayments = await blink.db.paiements.list();
      const configs = await blink.db.fraisScolarite.list();
      const classes = await blink.db.classes.list();
      
      return students.map((student: any) => {
        const cls = classes.find((c: any) => c.id === student.idClasseActuelle);
        const config = configs.find((cf: any) => cf.niveauId === cls?.niveauId);
        
        const totalExpected = config 
          ? (Number(config.montantInscription) || 0) + 
            (Number(config.montantTranche1) || 0) + 
            (Number(config.montantTranche2) || 0) + 
            (Number(config.montantTranche3) || 0)
          : 0;
          
        const totalPaid = allPayments
          .filter((p: any) => p.eleveId === student.matricule)
          .reduce((sum: number, p: any) => sum + (Number(p.montant) || 0), 0);
          
        return {
          ...student,
          totalExpected,
          totalPaid,
          balance: totalExpected - totalPaid
        };
      }).filter(s => s.balance > 0);
    }
  });

  // Financial Stats
  const financialStats = useQuery({
    queryKey: ['financial-stats'],
    queryFn: async () => {
      const students = await blink.db.eleves.list();
      const allPayments = await blink.db.paiements.list();
      const configs = await blink.db.fraisScolarite.list();
      const classes = await blink.db.classes.list();

      let totalExpected = 0;
      students.forEach((student: any) => {
        const cls = classes.find((c: any) => c.id === student.idClasseActuelle);
        const config = configs.find((cf: any) => cf.niveauId === cls?.niveauId);
        if (config) {
          totalExpected += (Number(config.montantInscription) || 0) + 
                          (Number(config.montantTranche1) || 0) + 
                          (Number(config.montantTranche2) || 0) + 
                          (Number(config.montantTranche3) || 0);
        }
      });

      const totalCollected = allPayments.reduce((sum, p: any) => sum + (Number(p.montant) || 0), 0);

      return {
        totalExpected,
        totalCollected,
        totalOutstanding: totalExpected - totalCollected
      };
    }
  });

  return {
    feeConfigs,
    upsertFeeConfig,
    payments,
    addPayment,
    salaries,
    upsertSalary,
    studentsWithBalance,
    financialStats
  };
}
