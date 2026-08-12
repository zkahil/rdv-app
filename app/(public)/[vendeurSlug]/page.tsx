import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function VendeurPublicPage({ params }: { params: { vendeurSlug: string } }) {
  const vendeur = await db.user.findUnique({
    where: { slug: params.vendeurSlug, role: 'VENDEUR', actif: true },
    include: { products: { where: { actif: true } } },
  });

  if (!vendeur) return notFound();

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="mb-1 text-2xl font-semibold">{vendeur.nom}</h1>
      <p className="mb-8 text-gray-500">Choisissez un service pour réserver votre créneau</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {vendeur.products.map((p) => (
          <Link
            key={p.id}
            href={`/${vendeur.slug}/reserver/${p.id}`}
            className="rounded-lg border bg-white p-5 shadow-sm transition hover:border-brand-500 hover:shadow-md"
          >
            <h3 className="font-medium">{p.nom}</h3>
            {p.description && <p className="mt-1 text-sm text-gray-500">{p.description}</p>}
            <p className="mt-3 text-sm font-medium text-brand-700">
              {Number(p.prix).toFixed(2)} MAD — {p.duree} min
            </p>
          </Link>
        ))}
        {vendeur.products.length === 0 && (
          <p className="text-gray-400">Aucun service disponible pour le moment</p>
        )}
      </div>
    </div>
  );
}
