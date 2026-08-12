'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export type ActionResult = { success: boolean; message: string };

export async function updateAppointmentStatus(
  appointmentId: string,
  statut: 'CONFIRME' | 'ANNULE',
): Promise<ActionResult> {
  const session = await requireRole('VENDEUR').catch(() => null);
  if (!session) return { success: false, message: 'Non autorisé' };

  const rdv = await db.appointment.findFirst({
    where: { id: appointmentId, vendeurId: (session.user as any).id },
  });
  if (!rdv) return { success: false, message: 'Rendez-vous introuvable' };

  await db.appointment.update({ where: { id: appointmentId }, data: { statut } });

  revalidatePath('/rendez-vous');
  return { success: true, message: 'Statut mis à jour' };
}

export async function listMyAppointments() {
  const session = await requireRole('VENDEUR');
  return db.appointment.findMany({
    where: { vendeurId: (session.user as any).id },
    include: { product: true },
    orderBy: { date: 'asc' },
  });
}
