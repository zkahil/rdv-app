import { createProductSchema, createVendeurSchema, createAppointmentSchema } from '@/lib/validations';

describe('createProductSchema', () => {
  it('valide un produit correct', () => {
    const result = createProductSchema.safeParse({
      nom: 'Coupe homme',
      description: 'Coupe classique',
      prix: '80',
      duree: '30',
    });
    expect(result.success).toBe(true);
  });

  it('rejette un prix négatif', () => {
    const result = createProductSchema.safeParse({
      nom: 'Coupe homme',
      prix: '-10',
      duree: '30',
    });
    expect(result.success).toBe(false);
  });

  it('rejette un nom trop court', () => {
    const result = createProductSchema.safeParse({ nom: 'A', prix: '10', duree: '30' });
    expect(result.success).toBe(false);
  });
});

describe('createVendeurSchema', () => {
  it('rejette un slug avec majuscules ou espaces', () => {
    const result = createVendeurSchema.safeParse({
      nom: 'Karim',
      email: 'karim@test.com',
      password: '123456',
      slug: 'Karim Coiffure',
    });
    expect(result.success).toBe(false);
  });

  it('accepte un slug valide', () => {
    const result = createVendeurSchema.safeParse({
      nom: 'Karim',
      email: 'karim@test.com',
      password: '123456',
      slug: 'karim-coiffure',
    });
    expect(result.success).toBe(true);
  });
});

describe('createAppointmentSchema', () => {
  it('rejette un email client invalide', () => {
    const result = createAppointmentSchema.safeParse({
      productId: 'clx0000000000000000000000',
      vendeurId: 'clx0000000000000000000001',
      date: new Date().toISOString(),
      clientNom: 'Ahmed',
      clientTelephone: '0612345678',
      clientEmail: 'pas-un-email',
    });
    expect(result.success).toBe(false);
  });
});
