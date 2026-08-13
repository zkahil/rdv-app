import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, DollarSign, User, Mail, Phone, Calendar, MessageSquare, CheckCircle } from 'lucide-react';
import ReservationForm from './reservation-form';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';

export const dynamic = 'force-dynamic';

const JOURS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

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

  // Récupérer les disponibilités du vendeur
  const availabilities = await db.availability.findMany({
    where: { vendeurId: vendeur.id },
    orderBy: { jourSemaine: 'asc' },
  });

  // Grouper par jour
  const groupedAvailabilities = availabilities.reduce((acc, avail) => {
    const jour = avail.jourSemaine;
    if (!acc[jour]) acc[jour] = [];
    acc[jour].push(avail);
    return acc;
  }, {} as Record<number, typeof availabilities>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Bouton retour */}
        <Link
          href={`/${vendeur.slug}`}
          className="group mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Retour aux services
        </Link>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Colonne de gauche - Infos du service */}
          <div className="lg:col-span-2">
            <Card className="sticky top-8">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{product.nom}</CardTitle>
                  <Badge variant="success">Disponible</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.description && (
                  <div>
                    <p className="text-sm text-gray-600">{product.description}</p>
                  </div>
                )}

                <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Prix</span>
                    <span className="font-semibold text-brand-600">
                      {Number(product.prix).toFixed(2)} MAD
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Durée</span>
                    <span className="flex items-center font-medium">
                      <Clock className="mr-1 h-4 w-4 text-gray-400" />
                      {product.duree} minutes
                    </span>
                  </div>
                </div>

                {/* Info vendeur */}
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-sm font-medium text-gray-700">Fourni par</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-semibold">
                      {vendeur.nom.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{vendeur.nom}</p>
                      <p className="text-sm text-gray-500">Professionnel certifié</p>
                    </div>
                  </div>
                </div>

                {/* Points forts */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                    <span className="text-gray-600">Confirmation immédiate</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                    <span className="text-gray-600">Paiement sécurisé</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                    <span className="text-gray-600">Annulation gratuite 24h à l'avance</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne de droite - Formulaire */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Réserver ce service</CardTitle>
                <p className="text-sm text-gray-500">
                  Remplissez le formulaire ci-dessous pour réserver votre créneau
                </p>
              </CardHeader>
              <CardContent>
                <ReservationForm 
                  vendeurId={vendeur.id} 
                  productId={product.id}
                  vendeurNom={vendeur.nom}
                  productNom={product.nom}
                  availabilities={availabilities}
                  groupedAvailabilities={groupedAvailabilities}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}