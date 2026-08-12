import { listMyAppointments, updateAppointmentStatus } from './actions';

export const dynamic = 'force-dynamic';

const STATUT_COLORS: Record<string, string> = {
  EN_ATTENTE: 'text-yellow-600',
  CONFIRME: 'text-green-600',
  ANNULE: 'text-red-600',
};

export default async function RendezVousPage() {
  const rdvs = await listMyAppointments();

  async function handleConfirm(formData: FormData) {
    'use server';
    await updateAppointmentStatus(formData.get('id') as string, 'CONFIRME');
  }

  async function handleCancel(formData: FormData) {
    'use server';
    await updateAppointmentStatus(formData.get('id') as string, 'ANNULE');
  }

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">Mes rendez-vous</h1>

      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left">
              <th className="p-3">Date</th>
              <th className="p-3">Produit</th>
              <th className="p-3">Client</th>
              <th className="p-3">Téléphone</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rdvs.map((r) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="p-3">{new Date(r.date).toLocaleString('fr-FR')}</td>
                <td className="p-3">{r.product.nom}</td>
                <td className="p-3">{r.clientNom}</td>
                <td className="p-3">{r.clientTelephone}</td>
                <td className={`p-3 font-medium ${STATUT_COLORS[r.statut]}`}>{r.statut}</td>
                <td className="flex gap-2 p-3">
                  {r.statut === 'EN_ATTENTE' && (
                    <>
                      <form action={handleConfirm}>
                        <input type="hidden" name="id" value={r.id} />
                        <button className="text-xs text-green-600 hover:underline">Confirmer</button>
                      </form>
                      <form action={handleCancel}>
                        <input type="hidden" name="id" value={r.id} />
                        <button className="text-xs text-red-600 hover:underline">Annuler</button>
                      </form>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {rdvs.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-400">
                  Aucun rendez-vous pour le moment
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
