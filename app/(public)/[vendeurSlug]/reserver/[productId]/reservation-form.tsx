'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, Clock, User, Mail, Phone, MessageSquare, 
  CheckCircle, AlertCircle, Loader2, ChevronDown 
} from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

interface Availability {
  id: string;
  jourSemaine: number;
  heureDebut: string;
  heureFin: string;
}

interface ReservationFormProps {
  vendeurId: string;
  productId: string;
  vendeurNom: string;
  productNom: string;
  availabilities: Availability[];
  groupedAvailabilities: Record<number, Availability[]>;
}

const JOURS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export default function ReservationForm({ 
  vendeurId, 
  productId,
  vendeurNom,
  productNom,
  availabilities,
  groupedAvailabilities
}: ReservationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const [formData, setFormData] = useState({
    clientNom: '',
    clientEmail: '',
    clientTelephone: '',
    date: '',
    heure: '',
    note: '',
  });

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const jourSemaine = date.getDay();
      
      if (groupedAvailabilities[jourSemaine]) {
        dates.push({
          date: date,
          jourSemaine: jourSemaine,
          dateStr: date.toISOString().split('T')[0],
          display: `${date.getDate()} ${MOIS[date.getMonth()]} ${date.getFullYear()}`,
          dayName: JOURS[jourSemaine],
        });
      }
    }
    return dates;
  };

  const getAvailableHours = (dateStr: string) => {
    if (!dateStr) return [];
    
    const date = new Date(dateStr);
    const jourSemaine = date.getDay();
    const dayAvailabilities = groupedAvailabilities[jourSemaine] || [];
    
    const hours = [];
    for (const avail of dayAvailabilities) {
      const startHour = parseInt(avail.heureDebut.split(':')[0]);
      const endHour = parseInt(avail.heureFin.split(':')[0]);
      
      for (let h = startHour; h < endHour; h++) {
        const hourStr = `${String(h).padStart(2, '0')}:00`;
        hours.push(hourStr);
        const halfHourStr = `${String(h).padStart(2, '0')}:30`;
        hours.push(halfHourStr);
      }
    }
    return hours.sort();
  };

  const availableDates = getAvailableDates();
  const availableHours = getAvailableHours(selectedDate);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (error) setError(null);

    if (name === 'date') {
      setSelectedDate(value);
      setFormData(prev => ({ ...prev, heure: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.date || !formData.heure) {
      setError('Veuillez sélectionner une date et une heure');
      setLoading(false);
      return;
    }

    try {
      const formDataObj = new FormData();
      formDataObj.append('vendeurId', vendeurId);
      formDataObj.append('productId', productId);
      formDataObj.append('clientNom', formData.clientNom);
      formDataObj.append('clientEmail', formData.clientEmail);
      formDataObj.append('clientTelephone', formData.clientTelephone);
      formDataObj.append('date', formData.date);
      formDataObj.append('heure', formData.heure);
      formDataObj.append('note', formData.note);
      formDataObj.append('vendeurSlug', window.location.pathname.split('/')[1]);

      const response = await fetch('/api/appointments', {
        method: 'POST',
        body: formDataObj,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/${window.location.pathname.split('/')[1]}`);
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          Réservation confirmée !
        </h3>
        <p className="mt-2 text-gray-600">
          Votre rendez-vous pour <strong>{productNom}</strong> a été envoyé à {vendeurNom}.
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Vous recevrez une confirmation par email dans les plus brefs délais.
        </p>
        <Button 
          variant="primary" 
          className="mt-6"
          onClick={() => router.push(`/${window.location.pathname.split('/')[1]}`)}
        >
          Retour à l&apos;accueil
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Vos informations</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative">
            <Input
              label="Nom complet"
              name="clientNom"
              placeholder="Jean Dupont"
              value={formData.clientNom}
              onChange={handleChange}
              required
              className="pl-9"
            />
            <User className="absolute bottom-3 left-3 h-4 w-4 text-gray-400" />
          </div>

          <div className="relative">
            <Input
              label="Email"
              name="clientEmail"
              type="email"
              placeholder="jean@example.com"
              value={formData.clientEmail}
              onChange={handleChange}
              className="pl-9"
            />
            <Mail className="absolute bottom-3 left-3 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="relative">
          <Input
            label="Téléphone"
            name="clientTelephone"
            type="tel"
            placeholder="06 12 34 56 78"
            value={formData.clientTelephone}
            onChange={handleChange}
            required
            className="pl-9"
          />
          <Phone className="absolute bottom-3 left-3 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Choisissez votre créneau</h3>
        
        {availabilities.length === 0 ? (
          <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
            <AlertCircle className="mb-1 inline h-4 w-4" />
            <span> Ce vendeur n&apos;a pas encore défini ses disponibilités.</span>
          </div>
        ) : (
          <>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Date
              </label>
              <select
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pl-9 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none"
              >
                <option value="">Sélectionnez une date</option>
                {availableDates.map(({ dateStr, display, dayName }) => (
                  <option key={dateStr} value={dateStr}>
                    {dayName} - {display}
                  </option>
                ))}
              </select>
              <Calendar className="absolute bottom-3 left-3 h-4 w-4 text-gray-400" />
              <ChevronDown className="absolute bottom-3 right-3 h-4 w-4 text-gray-400" />
            </div>

            {selectedDate && (
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Heure
                </label>
                <select
                  name="heure"
                  value={formData.heure}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 pl-9 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none"
                >
                  <option value="">Sélectionnez une heure</option>
                  {availableHours.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
                <Clock className="absolute bottom-3 left-3 h-4 w-4 text-gray-400" />
                <ChevronDown className="absolute bottom-3 right-3 h-4 w-4 text-gray-400" />
              </div>
            )}

            {selectedDate && availableHours.length === 0 && (
              <p className="text-sm text-yellow-600">
                ⚠️ Aucun créneau disponible pour cette date
              </p>
            )}

            <div className="mt-2 rounded-lg bg-gray-50 p-3">
              <p className="text-xs font-medium text-gray-600">Disponibilités habituelles :</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {Object.entries(groupedAvailabilities).map(([jour, dispos]) => (
                  <span key={jour} className="text-xs bg-white px-2 py-1 rounded border border-gray-200">
                    {JOURS[Number(jour)]}: {dispos.map(d => `${d.heureDebut}-${d.heureFin}`).join(', ')}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Note (optionnel)
        </label>
        <textarea
          name="note"
          rows={3}
          placeholder="Informations complémentaires..."
          value={formData.note}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 pl-9 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <MessageSquare className="absolute bottom-3 left-3 h-4 w-4 text-gray-400" />
      </div>

      <div className="rounded-lg bg-gray-50 p-4">
        <p className="text-sm font-medium text-gray-700">Résumé de la réservation</p>
        <div className="mt-2 space-y-1 text-sm text-gray-600">
          <p>Service : <span className="font-medium">{productNom}</span></p>
          <p>Chez : <span className="font-medium">{vendeurNom}</span></p>
          {formData.date && (
            <p>
              Le :{' '}
              <span className="font-medium">
                {new Date(formData.date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </p>
          )}
          {formData.heure && (
            <p>
              À : <span className="font-medium">{formData.heure}</span>
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        disabled={loading || availabilities.length === 0}
        className="py-3 text-base"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          'Confirmer la réservation'
        )}
      </Button>

      <p className="text-center text-xs text-gray-500">
        En cliquant sur &quot;Confirmer&quot;, vous acceptez les conditions générales.
        <br />
        Vous recevrez un email de confirmation.
      </p>
    </form>
  );
}