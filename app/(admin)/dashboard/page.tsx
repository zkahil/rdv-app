import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  await requireRole('ADMIN');

  const [nbVendeurs, nbProduits, nbRdv, nbRdvEnAttente] = await Promise.all([
    db.user.count({ where: { role: 'VENDEUR' } }),
    db.product.count(),
    db.appointment.count(),
    db.appointment.count({ where: { statut: 'EN_ATTENTE' } }),
  ]);

  const stats = [
    { label: 'Vendeurs', value: nbVendeurs },
    { label: 'Produits', value: nbProduits },
    { label: 'Rendez-vous totaux', value: nbRdv },
    { label: 'En attente', value: nbRdvEnAttente },
  ];

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">Dashboard Admin</h1>

      <div className="mb-8 grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-2xl font-semibold">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <Link href="/vendeurs" className="text-brand-600 hover:underline">
        Gérer les comptes vendeurs →
      </Link>
    </div>
  );
}
