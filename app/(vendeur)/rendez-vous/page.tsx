import { getVendeurAppointments, updateAppointmentStatus } from '@/app/actions/vendeur';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';

export default async function RendezVousPage() {
  const appointments = await getVendeurAppointments();

  const getBadgeVariant = (statut: string) => {
    switch (statut) {
      case 'CONFIRME': return 'success' as const;
      case 'EN_ATTENTE': return 'warning' as const;
      case 'ANNULE': return 'danger' as const;
      default: return 'default' as const;
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'CONFIRME': return 'Confirmé';
      case 'EN_ATTENTE': return 'En attente';
      case 'ANNULE': return 'Annulé';
      default: return statut;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Mes rendez-vous</h1>
        <div className="flex gap-2">
          <Button variant="secondary">Aujourd'hui</Button>
          <Button variant="secondary">Cette semaine</Button>
          <Button variant="primary">Voir tout</Button>
        </div>
      </div>

      <div className="space-y-4">
        {appointments.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun rendez-vous pour le moment</p>
            </div>
          </Card>
        ) : (
          appointments.map((rdv) => (
            <Card key={rdv.id} className="hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold">
                      {rdv.clientNom.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{rdv.clientNom}</h3>
                      <p className="text-sm text-gray-500">
                        {rdv.product?.nom || 'Service non spécifié'}
                      </p>
                      <p className="text-xs text-gray-400">{rdv.clientEmail}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                  <div className="text-sm">
                    <p className="font-medium">
                      {rdv.date.toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-gray-500">
                      {rdv.date.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <Badge variant={getBadgeVariant(rdv.statut)}>
                    {getStatutLabel(rdv.statut)}
                  </Badge>
                  {rdv.statut === 'EN_ATTENTE' && (
                    <div className="flex gap-2">
                      <form action={updateAppointmentStatus.bind(null, rdv.id, 'CONFIRME')}>
                        <Button variant="success" size="sm" type="submit">
                          Confirmer
                        </Button>
                      </form>
                      <form action={updateAppointmentStatus.bind(null, rdv.id, 'ANNULE')}>
                        <Button variant="danger" size="sm" type="submit">
                          Annuler
                        </Button>
                      </form>
                    </div>
                  )}
                  {rdv.statut === 'CONFIRME' && (
                    <form action={updateAppointmentStatus.bind(null, rdv.id, 'ANNULE')}>
                      <Button variant="danger" size="sm" type="submit">
                        Annuler
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}