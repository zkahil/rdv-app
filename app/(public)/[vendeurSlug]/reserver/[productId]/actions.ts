'use server';

import { db } from '@/lib/db';
import { createAppointmentSchema } from '@/lib/validations';

export type ActionResult = { success: boolean; message: string };

/**
 * Génère les créneaux disponibles pour un vendeur/produit à une date donnée,
 * en tenant compte de ses disponibilités hebdomadaires et des RDV déjà pris.
 */
export async function getAvailableSlots(vendeurId: string, productId: string, dateStr: string) {
  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) return [];

  const date = new Date(dateStr + 'T00:00:00');
  const jourSemaine = date.getDay();

  const disponibilites = await db.availability.findMany({
    where: { vendeurId, jourSemaine },
  });
  if (disponibilites.length === 0) return [];

  const startOfDay = new Date(dateStr + 'T00:00:00');
  const endOfDay = new Date(dateStr + 'T23:59:59');

  const existingAppointments = await db.appointment.findMany({
    where: {
      vendeurId,
      date: { gte: startOfDay, lte: endOfDay },
      statut: { not: 'ANNULE' },
    },
    include: { product: true },
  });

  const slots: string[] = [];

  for (const dispo of disponibilites) {
    const [hDebut, mDebut] = dispo.heureDebut.split(':').map(Number);
    const [hFin, mFin] = dispo.heureFin.split(':').map(Number);

    let cursor = new Date(date);
    cursor.setHours(hDebut, mDebut, 0, 0);
    const fin = new Date(date);
    fin.setHours(hFin, mFin, 0, 0);

    while (cursor.getTime() + product.duree * 60000 <= fin.getTime()) {
      const slotEnd = new Date(cursor.getTime() + product.duree * 60000);

      const overlaps = existingAppointments.some((a) => {
        const aStart = new Date(a.date);
        const aEnd = new Date(aStart.getTime() + a.product.duree * 60000);
        return cursor < aEnd && slotEnd > aStart;
      });

      const isPast = cursor.getTime() < Date.now();

      if (!overlaps && !isPast) {
        slots.push(
          `${String(cursor.getHours()).padStart(2, '0')}:${String(cursor.getMinutes()).padStart(2, '0')}`,
        );
      }

      cursor = new Date(cursor.getTime() + product.duree * 60000);
    }
  }

  return slots;
}

export async function createPublicAppointment(formData: FormData): Promise<ActionResult> {
  const dateStr = formData.get('date') as string;
  const heure = formData.get('heure') as string;

  const parsed = createAppointmentSchema.safeParse({
    productId: formData.get('productId'),
    vendeurId: formData.get('vendeurId'),
    date: new Date(`${dateStr}T${heure}:00`),
    clientNom: formData.get('clientNom'),
    clientTelephone: formData.get('clientTelephone'),
    clientEmail: formData.get('clientEmail') || '',
    note: formData.get('note') || '',
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0].message };
  }

  const { productId, vendeurId, date, clientNom, clientTelephone, clientEmail, note } = parsed.data;

  // Revérification anti double-réservation (protection contre les conditions de course)
  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) return { success: false, message: 'Produit introuvable' };

  const slotEnd = new Date(date.getTime() + product.duree * 60000);

  const conflict = await db.appointment.findFirst({
    where: {
      vendeurId,
      statut: { not: 'ANNULE' },
      date: { lt: slotEnd },
    },
  });

  const conflicts = await db.appointment.findMany({
    where: { vendeurId, statut: { not: 'ANNULE' } },
    include: { product: true },
  });
  const hasOverlap = conflicts.some((a) => {
    const aStart = new Date(a.date);
    const aEnd = new Date(aStart.getTime() + a.product.duree * 60000);
    return date < aEnd && slotEnd > aStart;
  });

  if (hasOverlap) {
    return { success: false, message: 'Ce créneau vient d\'être réservé, merci d\'en choisir un autre' };
  }

  await db.appointment.create({
    data: {
      productId,
      vendeurId,
      date,
      clientNom,
      clientTelephone,
      clientEmail: clientEmail || null,
      note: note || null,
      statut: 'EN_ATTENTE',
    },
  });

  return { success: true, message: 'Votre rendez-vous a été réservé avec succès !' };
}
