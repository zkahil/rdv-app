import { z } from 'zod';

export const createVendeurSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, 'Slug: lettres minuscules, chiffres et tirets uniquement'),
});

export const createProductSchema = z.object({
  nom: z.string().min(2, 'Le nom du produit est requis'),
  description: z.string().optional(),
  prix: z.coerce.number().positive('Le prix doit être positif'),
  duree: z.coerce.number().int().positive('La durée doit être positive (en minutes)'),
});

export const createAppointmentSchema = z.object({
  productId: z.string().cuid(),
  vendeurId: z.string().cuid(),
  date: z.coerce.date(),
  clientNom: z.string().min(2, 'Le nom est requis'),
  clientTelephone: z.string().min(8, 'Numéro de téléphone invalide'),
  clientEmail: z.string().email().optional().or(z.literal('')),
  note: z.string().optional(),
});

export const availabilitySchema = z.object({
  jourSemaine: z.coerce.number().min(0).max(6),
  heureDebut: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  heureFin: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
});
