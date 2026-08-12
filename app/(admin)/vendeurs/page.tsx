import { listVendeurs, createVendeurAccount, toggleVendeurActif, deleteVendeur } from './actions';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function VendeursPage() {
  const vendeurs = await listVendeurs();

  async function handleCreate(formData: FormData) {
    'use server';
    await createVendeurAccount(formData);
  }

  async function handleToggle(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await toggleVendeurActif(id);
  }

  async function handleDelete(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await deleteVendeur(id);
  }

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">Gestion des comptes vendeurs</h1>

      <form action={handleCreate} className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-medium">Créer un nouveau compte vendeur</h2>
        <div className="grid grid-cols-2 gap-4">
          <input name="nom" placeholder="Nom complet" required className="rounded border px-3 py-2 text-sm" />
          <input name="email" type="email" placeholder="Email" required className="rounded border px-3 py-2 text-sm" />
          <input name="password" type="password" placeholder="Mot de passe" required className="rounded border px-3 py-2 text-sm" />
          <input name="slug" placeholder="slug (ex: karim-coiffure)" required className="rounded border px-3 py-2 text-sm" />
        </div>
        <button type="submit" className="mt-4 rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          Créer le compte
        </button>
      </form>

      <div className="rounded-lg border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left">
              <th className="p-3">Nom</th>
              <th className="p-3">Email</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Produits</th>
              <th className="p-3">RDV</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendeurs.map((v) => (
              <tr key={v.id} className="border-b last:border-0">
                <td className="p-3">{v.nom}</td>
                <td className="p-3">{v.email}</td>
                <td className="p-3">/{v.slug}</td>
                <td className="p-3">{v._count.products}</td>
                <td className="p-3">{v._count.appointments}</td>
                <td className="p-3">
                  <span className={v.actif ? 'text-green-600' : 'text-red-600'}>
                    {v.actif ? 'Actif' : 'Désactivé'}
                  </span>
                </td>
                <td className="flex gap-2 p-3">
                  <form action={handleToggle}>
                    <input type="hidden" name="id" value={v.id} />
                    <button className="text-xs text-brand-600 hover:underline">
                      {v.actif ? 'Désactiver' : 'Activer'}
                    </button>
                  </form>
                  <form action={handleDelete}>
                    <input type="hidden" name="id" value={v.id} />
                    <button className="text-xs text-red-600 hover:underline">Supprimer</button>
                  </form>
                </td>
              </tr>
            ))}
            {vendeurs.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-400">
                  Aucun vendeur pour le moment
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
