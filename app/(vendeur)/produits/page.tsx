import { listMyProducts, createProduct, toggleProductActif, deleteProduct } from './actions';

export const dynamic = 'force-dynamic';

export default async function ProduitsPage() {
  const produits = await listMyProducts();

  async function handleCreate(formData: FormData) {
    'use server';
    await createProduct(formData);
  }

  async function handleToggle(formData: FormData) {
    'use server';
    await toggleProductActif(formData.get('id') as string);
  }

  async function handleDelete(formData: FormData) {
    'use server';
    await deleteProduct(formData.get('id') as string);
  }

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">Mes produits / services</h1>

      <form action={handleCreate} className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-medium">Ajouter un produit (ex: Coupe homme, Massage...)</h2>
        <div className="grid grid-cols-2 gap-4">
          <input name="nom" placeholder="Nom du produit" required className="rounded border px-3 py-2 text-sm" />
          <input name="prix" type="number" step="0.01" placeholder="Prix (MAD)" required className="rounded border px-3 py-2 text-sm" />
          <input name="duree" type="number" placeholder="Durée (minutes)" required className="rounded border px-3 py-2 text-sm" />
          <input name="description" placeholder="Description (optionnel)" className="rounded border px-3 py-2 text-sm" />
        </div>
        <button type="submit" className="mt-4 rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          Ajouter le produit
        </button>
      </form>

      <div className="grid grid-cols-2 gap-4">
        {produits.map((p) => (
          <div key={p.id} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{p.nom}</h3>
                <p className="text-sm text-gray-500">{p.description}</p>
                <p className="mt-2 text-sm">
                  {Number(p.prix).toFixed(2)} MAD — {p.duree} min
                </p>
              </div>
              <span className={p.actif ? 'text-xs text-green-600' : 'text-xs text-red-600'}>
                {p.actif ? 'Actif' : 'Désactivé'}
              </span>
            </div>
            <div className="mt-3 flex gap-3">
              <form action={handleToggle}>
                <input type="hidden" name="id" value={p.id} />
                <button className="text-xs text-brand-600 hover:underline">
                  {p.actif ? 'Désactiver' : 'Activer'}
                </button>
              </form>
              <form action={handleDelete}>
                <input type="hidden" name="id" value={p.id} />
                <button className="text-xs text-red-600 hover:underline">Supprimer</button>
              </form>
            </div>
          </div>
        ))}
        {produits.length === 0 && <p className="text-gray-400">Aucun produit pour le moment</p>}
      </div>
    </div>
  );
}
