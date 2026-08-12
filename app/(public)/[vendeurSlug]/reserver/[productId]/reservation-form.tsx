'use client';

import { useState, useTransition } from 'react';
import { getAvailableSlots, createPublicAppointment } from './actions';

export default function ReservationForm({
  vendeurId,
  productId,
}: {
  vendeurId: string;
  productId: string;
}) {
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleDateChange(value: string) {
    setDate(value);
    setSelectedSlot('');
    setSlots([]);
    if (!value) return;

    startTransition(async () => {
      const available = await getAvailableSlots(vendeurId, productId, value);
      setSlots(available);
    });
  }

  async function handleSubmit(formData: FormData) {
    formData.set('vendeurId', vendeurId);
    formData.set('productId', productId);
    formData.set('date', date);
    formData.set('heure', selectedSlot);

    const res = await createPublicAppointment(formData);
    setResult(res);
  }

  const todayStr = new Date().toISOString().split('T')[0];

  if (result?.success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-green-700">
        {result.message}
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Date souhaitée</label>
        <input
          type="date"
          min={todayStr}
          value={date}
          onChange={(e) => handleDateChange(e.target.value)}
          required
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </div>

      {date && (
        <div>
          <label className="mb-1 block text-sm font-medium">Créneau disponible</label>
          {isPending && <p className="text-sm text-gray-400">Chargement des créneaux...</p>}
          {!isPending && slots.length === 0 && (
            <p className="text-sm text-gray-400">Aucun créneau disponible ce jour-là</p>
          )}
          <div className="flex flex-wrap gap-2">
            {slots.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setSelectedSlot(s)}
                className={`rounded border px-3 py-1.5 text-sm ${
                  selectedSlot === s
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'hover:border-brand-500'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedSlot && (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium">Nom complet</label>
            <input name="clientNom" required className="w-full rounded border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Téléphone</label>
            <input name="clientTelephone" required className="w-full rounded border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email (optionnel)</label>
            <input name="clientEmail" type="email" className="w-full rounded border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Note (optionnel)</label>
            <textarea name="note" className="w-full rounded border px-3 py-2 text-sm" rows={2} />
          </div>

          {result && !result.success && (
            <p className="rounded bg-red-50 p-2 text-sm text-red-600">{result.message}</p>
          )}

          <button
            type="submit"
            className="w-full rounded bg-brand-600 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Confirmer la réservation
          </button>
        </>
      )}
    </form>
  );
}
