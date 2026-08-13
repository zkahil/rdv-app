import { getVendeurAvailabilities, deleteAvailability } from '@/app/actions/vendeur';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';

const JOURS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export default async function DisponibilitesPage() {
  const availabilities = await getVendeurAvailabilities();

  // Grouper par jour
  const groupedAvailabilities = availabilities.reduce((acc, avail) => {
    const jour = avail.jourSemaine;
    if (!acc[jour]) acc[jour] = [];
    acc[jour].push(avail);
    return acc;
  }, {} as Record<number, typeof availabilities>);

  const jours = Object.keys(groupedAvailabilities).map(Number).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Mes disponibilités</h1>
        <Button variant="primary">+ Ajouter une disponibilité</Button>
      </div>

      <div className="space-y-4">
        {jours.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500">Aucune disponibilité définie</p>
              <Button variant="primary" className="mt-4">
                Ajouter une disponibilité
              </Button>
            </div>
          </Card>
        ) : (
          jours.map((jour) => (
            <Card key={jour}>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">
                  {JOURS[jour]}
                </h3>
                <div className="space-y-2">
                  {groupedAvailabilities[jour].map((avail) => (
                    <div
                      key={avail.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="font-medium">
                          {avail.heureDebut} - {avail.heureFin}
                        </p>
                      </div>
                      <form action={deleteAvailability.bind(null, avail.id)}>
                        <Button variant="danger" size="sm" type="submit">
                          Supprimer
                        </Button>
                      </form>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}