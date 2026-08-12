import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import ReservationForm from './reservation-form';

export const dynamic = 'force-dynamic';

export default async function ReserverPage({
  params,
}: {
  params: { vendeurSlug: string; productId: string };
}) {
  const vendeur = await db.user.findUnique({
    where: { slug: params.vendeurSlug, role: 'VENDEUR', actif: true },
  });
  if (!vendeur) return notFound();

  const product = await db.product.findFirst({
    where: { id: params.productId, vendeurId: vendeur.id, actif: true },
  });
  if (!product) return notFound();

  return (
    <div className="mx-auto max-w-lg p-8">
      <h1 className="mb-1 text-2xl font-semibold">{product.nom}</h1>
      <p className="mb-6 text-gray-500">
        Chez {vendeur.nom} — {Number(product.prix).toFixed(2)} MAD — {product.duree} min
      </p>

      <ReservationForm vendeurId={vendeur.id} productId={product.id} />
    </div>
  );
}
