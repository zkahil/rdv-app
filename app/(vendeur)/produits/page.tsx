import { getVendeurProducts, deleteProduct } from '@/app/actions/vendeur';
import Button from '@/components/ui/button';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Badge from '@/components/ui/badge';

export default async function ProduitsPage() {
  const produits = await getVendeurProducts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Mes produits</h1>
        <Button variant="primary">+ Ajouter un produit</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {produits.map((produit) => (
          <Card key={produit.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{produit.nom}</CardTitle>
                <Badge variant={produit.actif ? "success" : "danger"}>
                  {produit.actif ? "Actif" : "Inactif"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">{produit.description || 'Aucune description'}</p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-brand-600">
                    {produit.prix}€
                  </span>
                  <p className="text-xs text-gray-500">{produit.duree} minutes</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">Modifier</Button>
                  <form action={deleteProduct.bind(null, produit.id)}>
                    <Button variant="danger" size="sm" type="submit">Supprimer</Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {produits.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun produit pour le moment</p>
            <Button variant="primary" className="mt-4">
              Ajouter votre premier produit
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}