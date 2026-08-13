import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, Calendar, Star, Users, Phone, Mail, MapPin, Award } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function VendeurPublicPage({ params }: { params: { vendeurSlug: string } }) {
  const vendeur = await db.user.findUnique({
    where: { slug: params.vendeurSlug, role: 'VENDEUR', actif: true },
    include: { 
      products: { 
        where: { actif: true },
        orderBy: { createdAt: 'desc' }
      } 
    },
  });

  if (!vendeur) return notFound();

  // Compter les avis (simulé - à remplacer par vos données réelles)
  const stats = {
    totalAvis: 47,
    noteMoyenne: 4.8,
    totalClients: 128,
    anneesExperience: 5,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* En-tête du vendeur */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 to-brand-800 shadow-xl">
          <div className="relative px-6 py-8 sm:px-8 sm:py-12">
            <div className="absolute inset-0 bg-black/10" />
            
            <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              {/* Avatar */}
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-4xl font-bold text-white shadow-lg backdrop-blur-sm sm:h-32 sm:w-32 sm:text-5xl">
                {vendeur.nom.charAt(0).toUpperCase()}
              </div>
              
              {/* Informations */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-white sm:text-4xl">
                  {vendeur.nom}
                </h1>
                <p className="mt-1 text-lg text-blue-100">
                  Professionnel certifié
                </p>
                
                {/* Stats */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
                  <div className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-sm text-white">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{stats.noteMoyenne} ({stats.totalAvis} avis)</span>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-sm text-white">
                    <Users className="h-4 w-4" />
                    <span>{stats.totalClients} clients</span>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-sm text-white">
                    <Award className="h-4 w-4" />
                    <span>{stats.anneesExperience} ans d'expérience</span>
                  </div>
                </div>
              </div>

              {/* Contact rapide */}
              <div className="flex shrink-0 flex-col gap-2">
                <Button variant="secondary" size="sm" className="bg-white/20 text-white hover:bg-white/30">
                  <Phone className="mr-2 h-4 w-4" />
                  Appeler
                </Button>
                <Button variant="secondary" size="sm" className="bg-white/20 text-white hover:bg-white/30">
                  <Mail className="mr-2 h-4 w-4" />
                  Contacter
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Mes services</h2>
            <Badge variant="info" size="sm">
              {vendeur.products.length} services disponibles
            </Badge>
          </div>
          <p className="mt-1 text-gray-600">
            Sélectionnez un service pour réserver votre créneau
          </p>
        </div>

        {vendeur.products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vendeur.products.map((product) => (
              <Link 
                key={product.id} 
                href={`/${vendeur.slug}/reserver/${product.id}`}
                className="group block transition-transform hover:scale-[1.02]"
              >
                <Card className="h-full border-2 transition-all hover:border-brand-300 hover:shadow-xl">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg group-hover:text-brand-600">
                        {product.nom}
                      </CardTitle>
                      <Badge variant="success" size="sm">Disponible</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {product.description && (
                      <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Prix</span>
                        <span className="text-lg font-bold text-brand-600">
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

                      <Button 
                        variant="primary" 
                        className="w-full group-hover:shadow-lg"
                      >
                        Réserver maintenant
                        <Calendar className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="border-2 border-dashed">
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Clock className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Aucun service disponible
              </h3>
              <p className="mt-2 text-gray-500">
                Ce vendeur n'a pas encore de services disponibles.
                <br />
                Revenez plus tard pour découvrir ses offres.
              </p>
            </div>
          </Card>
        )}

        {/* Section À propos */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>À propos de {vendeur.nom}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Professionnel dédié à vous offrir des services de qualité. 
              Avec {stats.anneesExperience} ans d'expérience et plus de {stats.totalClients} clients satisfaits, 
              je m'engage à répondre à vos besoins avec professionnalisme et attention.
            </p>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <div className="rounded-full bg-brand-100 p-2">
                  <MapPin className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Localisation</p>
                  <p className="text-sm text-gray-500">Maroc</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <div className="rounded-full bg-brand-100 p-2">
                  <Calendar className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Disponibilité</p>
                  <p className="text-sm text-gray-500">Du lundi au samedi</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} {vendeur.nom} - Tous droits réservés
          </p>
          <p className="mt-1">
            Plateforme de prise de rendez-vous en ligne
          </p>
        </div>
      </div>
    </div>
  );
}