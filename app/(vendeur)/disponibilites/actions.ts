'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { availabilitySchema } from '@/lib/validations';

export type ActionResult = { success: boolean; message: string };

const JOURS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
export { JOURS };

export async function createAvailability(formData: FormData): Promise<ActionResult> {
  const session = await requireRole('VENDEUR').catch(() => null);
  if (!session) return { success: false, message: 'Non autorisé' };

  const parsed = availabilitySchema.safeParse({
    jourSemaine: formData.get('jourSemaine'),
    heureDebut: formData.get('heureDebut'),
    heureFin: formData.get('heureFin'),
  });

  if (!parsed.success) return { success: false, message: parsed.error.errors[0].message };

  if (parsed.data.heureDebut >= parsed.data.heureFin) {
    return { success: false, message: "L'heure de fin doit être après l'heure de début" };
  }

  await db.availability.create({
    data: { ...parsed.data, vendeurId: (session.user as any).id },
  });

  revalidatePath('/disponibilites');
  return { success: true, message: 'Disponibilité ajoutée' };
}

export async function deleteAvailability(id: string): Promise<ActionResult> {
  const session = await requireRole('VENDEUR');
  await db.availability.deleteMany({ where: { id, vendeurId: (session.user as any).id } });
  revalidatePath('/disponibilites');
  return { success: true, message: 'Disponibilité supprimée' };
}

export async function listMyAvailabilities() {
  const session = await requireRole('VENDEUR');
  return db.availability.findMany({
    where: { vendeurId: (session.user as any).id },
    orderBy: [{ jourSemaine: 'asc' }, { heureDebut: 'asc' }],
  });
}
