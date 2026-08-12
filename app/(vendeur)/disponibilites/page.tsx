import { listMyAvailabilities, createAvailability, deleteAvailability, JOURS } from './actions';

export const dynamic = 'force-dynamic';

export default async function DisponibilitesPage() {
  const disponibilites = await listMyAvailabilities();

  async function handleCreate(formData: FormData) {
    'use server';
    await createAvailability(formData);
  }

  async function handleDelete(formData: FormData) {
    'use server';
    await deleteAvailability(formData.get('id') as string);
  }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">Mes disponibilités</h1>

      <form action={handleCreate} className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
        <div className="grid grid-cols-3 gap-4">
          <select name="jourSemaine" className="rounded border px-3 py-2 text-sm">
            {JOURS.map((j, i) => (
              <option key={i} value={i}>{j}</option>
            ))}
          </select>
          <input name="heureDebut" type="time" required className="rounded border px-3 py-2 text-sm" />
          <input name="heureFin" type="time" required className="rounded border px-3 py-2 text-sm" />
        </div>
        <button type="submit" className="mt-4 rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          Ajouter le créneau
        </button>
      </form>

      <div className="space-y-2">
        {disponibilites.map((d) => (
          <div key={d.id} className="flex items-center justify-between rounded border bg-white p-3 text-sm">
            <span>{JOURS[d.jourSemaine]} : {d.heureDebut} - {d.heureFin}</span>
            <form action={handleDelete}>
              <input type="hidden" name="id" value={d.id} />
              <button className="text-xs text-red-600 hover:underline">Supprimer</button>
            </form>
          </div>
        ))}
        {disponibilites.length === 0 && <p className="text-gray-400">Aucune disponibilité définie</p>}
      </div>
    </div>
  );
}
