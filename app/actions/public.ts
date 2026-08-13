'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getVendeurPublic(slug: string) {
  return await prisma.user.findFirst({
    where: {
      slug,
      role: 'VENDEUR',
      actif: true,
    },
    select: {
      id: true,
      nom: true,
      email: true,
      slug: true,
    },
  });
}

export async function getVendeurProductsPublic(vendeurId: string) {
  return await prisma.product.findMany({
    where: {
      vendeurId,
      actif: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getVendeurAvailabilitiesPublic(vendeurId: string) {
  return await prisma.availability.findMany({
    where: {
      vendeurId,
    },
    orderBy: { jourSemaine: 'asc' },
  });
}

export async function createAppointmentPublic(formData: FormData) {
  const vendeurId = formData.get('vendeurId') as string;
  const productId = formData.get('productId') as string;
  const date = new Date(formData.get('date') as string);
  const clientNom = formData.get('clientNom') as string;
  const clientEmail = formData.get('clientEmail') as string;
  const clientTelephone = formData.get('clientTelephone') as string;
  const note = formData.get('note') as string;

  // Vérifier que le créneau n'est pas déjà réservé
  const existingAppointment = await prisma.appointment.findFirst({
    where: {
      vendeurId,
      date: date,
      statut: { not: 'ANNULE' },
    },
  });

  if (existingAppointment) {
    throw new Error('Ce créneau est déjà réservé');
  }

  // Créer le rendez-vous
  const appointment = await prisma.appointment.create({
    data: {
      vendeurId,
      productId,
      date,
      clientNom,
      clientEmail,
      clientTelephone,
      note,
      statut: 'EN_ATTENTE',
    },
  });

  revalidatePath(`/${formData.get('vendeurSlug')}`);
  return appointment;
}