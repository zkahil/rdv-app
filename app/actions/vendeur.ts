'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

export async function getVendeurProducts() {
  const session = await getSession();
  if (!session || session.user.role?.toUpperCase() !== 'VENDEUR') {
    throw new Error('Non autorisé');
  }

  return await prisma.product.findMany({
    where: { vendeurId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getVendeurAvailabilities() {
  const session = await getSession();
  if (!session || session.user.role?.toUpperCase() !== 'VENDEUR') {
    throw new Error('Non autorisé');
  }

  return await prisma.availability.findMany({
    where: { vendeurId: session.user.id },
    orderBy: { jourSemaine: 'asc' },
  });
}

export async function deleteAvailability(availabilityId: string) {
  const session = await getSession();
  if (!session || session.user.role?.toUpperCase() !== 'VENDEUR') {
    throw new Error('Non autorisé');
  }

  await prisma.availability.delete({
    where: { id: availabilityId },
  });

  revalidatePath('/disponibilites');
  return { success: true };
}

export async function getVendeurAppointments() {
  const session = await getSession();
  if (!session || session.user.role?.toUpperCase() !== 'VENDEUR') {
    throw new Error('Non autorisé');
  }

  return await prisma.appointment.findMany({
    where: { vendeurId: session.user.id },
    include: {
      product: {
        select: {
          nom: true,
        },
      },
    },
    orderBy: { date: 'asc' },
  });
}

export async function updateAppointmentStatus(
  appointmentId: string,
  statut: 'CONFIRME' | 'ANNULE' | 'EN_ATTENTE'
) {
  const session = await getSession();
  if (!session || session.user.role?.toUpperCase() !== 'VENDEUR') {
    throw new Error('Non autorisé');
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    select: { vendeurId: true },
  });

  if (!appointment || appointment.vendeurId !== session.user.id) {
    throw new Error('Rendez-vous non trouvé');
  }

  const updated = await prisma.appointment.update({
    where: { id: appointmentId },
    data: { statut },
  });

  revalidatePath('/rendez-vous');
  return updated;
}

export async function deleteProduct(productId: string) {
  const session = await getSession();
  if (!session || session.user.role?.toUpperCase() !== 'VENDEUR') {
    throw new Error('Non autorisé');
  }

  await prisma.product.delete({
    where: { id: productId },
  });

  revalidatePath('/produits');
  return { success: true };
}