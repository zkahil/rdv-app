import { getVendeurs, toggleVendeurActif, deleteVendeur } from '@/app/actions/admin';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';

export default async function VendeursPage() {
  const vendeurs = await getVendeurs();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Gestion des vendeurs</h1>
        <Button variant="primary">+ Ajouter un vendeur</Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendeur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rendez-vous
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vendeurs.map((vendeur) => (
                <tr key={vendeur.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{vendeur.nom}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vendeur.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={vendeur.actif ? "success" : "danger"}>
                      {vendeur.actif ? "Actif" : "Désactivé"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vendeur._count.products}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vendeur._count.appointments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <form action={toggleVendeurActif.bind(null, vendeur.id)} className="inline">
                      <Button 
                        variant={vendeur.actif ? "danger" : "success"} 
                        size="sm" 
                        className="mr-2"
                        type="submit"
                      >
                        {vendeur.actif ? "Désactiver" : "Activer"}
                      </Button>
                    </form>
                    <form action={deleteVendeur.bind(null, vendeur.id)} className="inline">
                      <Button variant="danger" size="sm" type="submit">
                        Supprimer
                      </Button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}