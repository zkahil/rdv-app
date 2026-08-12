'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { createProductSchema } from '@/lib/validations';

export type ActionResult = { success: boolean; message: string };

export async function createProduct(formData: FormData): Promise<ActionResult> {
  const session = await requireRole('VENDEUR').catch(() => null);
  if (!session) return { success: false, message: 'Non autorisé' };

  const parsed = createProductSchema.safeParse({
    nom: formData.get('nom'),
    description: formData.get('description'),
    prix: formData.get('prix'),
    duree: formData.get('duree'),
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0].message };
  }

  await db.product.create({
    data: {
      ...parsed.data,
      vendeurId: (session.user as any).id,
    },
  });

  revalidatePath('/produits');
  return { success: true, message: 'Produit créé avec succès' };
}

export async function toggleProductActif(productId: string): Promise<ActionResult> {
  const session = await requireRole('VENDEUR');

  const product = await db.product.findFirst({
    where: { id: productId, vendeurId: (session.user as any).id },
  });
  if (!product) return { success: false, message: 'Produit introuvable' };

  await db.product.update({
    where: { id: productId },
    data: { actif: !product.actif },
  });

  revalidatePath('/produits');
  return { success: true, message: 'Statut mis à jour' };
}

export async function deleteProduct(productId: string): Promise<ActionResult> {
  const session = await requireRole('VENDEUR');

  await db.product.deleteMany({
    where: { id: productId, vendeurId: (session.user as any).id },
  });

  revalidatePath('/produits');
  return { success: true, message: 'Produit supprimé' };
}

export async function listMyProducts() {
  const session = await requireRole('VENDEUR');

  return db.product.findMany({
    where: { vendeurId: (session.user as any).id },
    orderBy: { createdAt: 'desc' },
  });
}
