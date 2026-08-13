'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

export async function getAdminStats() {
  const session = await getSession();
  
  if (!session || session.user.role?.toUpperCase() !== 'ADMIN') {
    throw new Error('Non autorisé');
  }

  try {
    const [totalVendeurs, totalProducts, totalAppointments, vendeursActifs] = await Promise.all([
      prisma.user.count({ where: { role: 'VENDEUR' } }),
      prisma.product.count(),
      prisma.appointment.count(),
      prisma.user.count({ where: { role: 'VENDEUR', actif: true } }),
    ]);

    return {
      totalVendeurs,
      totalProducts,
      totalAppointments,
      vendeursActifs,
    };
  } catch (error) {
    console.error('Erreur getAdminStats:', error);
    return {
      totalVendeurs: 0,
      totalProducts: 0,
      totalAppointments: 0,
      vendeursActifs: 0,
    };
  }
}

export async function getVendeurs() {
  const session = await getSession();
  if (!session || session.user.role?.toUpperCase() !== 'ADMIN') {
    throw new Error('Non autorisé');
  }

  const vendeurs = await prisma.user.findMany({
    where: { role: 'VENDEUR' },
    include: {
      _count: {
        select: {
          products: true,
          appointments: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return vendeurs;
}

export async function toggleVendeurActif(vendeurId: string) {
  const session = await getSession();
  if (!session || session.user.role?.toUpperCase() !== 'ADMIN') {
    throw new Error('Non autorisé');
  }

  const vendeur = await prisma.user.findUnique({
    where: { id: vendeurId },
    select: { actif: true },
  });

  if (!vendeur) throw new Error('Vendeur non trouvé');

  await prisma.user.update({
    where: { id: vendeurId },
    data: { actif: !vendeur.actif },
  });

  revalidatePath('/vendeurs');
  return { success: true };
}

export async function deleteVendeur(vendeurId: string) {
  const session = await getSession();
  if (!session || session.user.role?.toUpperCase() !== 'ADMIN') {
    throw new Error('Non autorisé');
  }

  await prisma.user.delete({
    where: { id: vendeurId },
  });

  revalidatePath('/vendeurs');
  return { success: true };
}