'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { createVendeurSchema } from '@/lib/validations';

export type ActionResult = { success: boolean; message: string };

export async function createVendeurAccount(formData: FormData): Promise<ActionResult> {
  const session = await requireRole('ADMIN').catch(() => null);
  if (!session) return { success: false, message: 'Non autorisé' };

  const parsed = createVendeurSchema.safeParse({
    nom: formData.get('nom'),
    email: formData.get('email'),
    password: formData.get('password'),
    slug: formData.get('slug'),
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0].message };
  }

  const { nom, email, password, slug } = parsed.data;

  const existingEmail = await db.user.findUnique({ where: { email } });
  if (existingEmail) return { success: false, message: 'Cet email est déjà utilisé' };

  const existingSlug = await db.user.findUnique({ where: { slug } });
  if (existingSlug) return { success: false, message: 'Ce slug est déjà pris' };

  const hashed = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      nom,
      email,
      password: hashed,
      slug,
      role: 'VENDEUR',
      createdById: (session.user as any).id,
    },
  });

  revalidatePath('/vendeurs');
  return { success: true, message: 'Compte vendeur créé avec succès' };
}

export async function toggleVendeurActif(vendeurId: string): Promise<ActionResult> {
  await requireRole('ADMIN');

  const vendeur = await db.user.findUnique({ where: { id: vendeurId } });
  if (!vendeur) return { success: false, message: 'Vendeur introuvable' };

  await db.user.update({
    where: { id: vendeurId },
    data: { actif: !vendeur.actif },
  });

  revalidatePath('/vendeurs');
  return { success: true, message: 'Statut mis à jour' };
}

export async function deleteVendeur(vendeurId: string): Promise<ActionResult> {
  await requireRole('ADMIN');

  await db.user.delete({ where: { id: vendeurId } });

  revalidatePath('/vendeurs');
  return { success: true, message: 'Vendeur supprimé' };
}

export async function listVendeurs() {
  await requireRole('ADMIN');

  return db.user.findMany({
    where: { role: 'VENDEUR' },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { products: true, appointments: true } } },
  });
}
