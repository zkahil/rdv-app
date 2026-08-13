import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const vendeurId = formData.get('vendeurId') as string;
    const productId = formData.get('productId') as string;
    const clientNom = formData.get('clientNom') as string;
    const clientEmail = formData.get('clientEmail') as string;
    const clientTelephone = formData.get('clientTelephone') as string;
    const dateStr = formData.get('date') as string;
    const heure = formData.get('heure') as string;
    const note = formData.get('note') as string;
    const vendeurSlug = formData.get('vendeurSlug') as string;

    // Validation
    if (!vendeurId || !productId || !clientNom || !clientTelephone || !dateStr || !heure) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // Combiner date et heure
    const dateTime = new Date(`${dateStr}T${heure}:00`);

    // Vérifier la disponibilité du vendeur pour ce jour et cette heure
    const jourSemaine = dateTime.getDay();
    const availability = await db.availability.findFirst({
      where: {
        vendeurId,
        jourSemaine,
        heureDebut: { lte: heure },
        heureFin: { gt: heure },
      },
    });

    if (!availability) {
      return NextResponse.json(
        { error: 'Ce créneau n\'est pas disponible' },
        { status: 409 }
      );
    }

    // Vérifier que le créneau n'est pas déjà réservé
    const existingAppointment = await db.appointment.findFirst({
      where: {
        vendeurId,
        date: dateTime,
        statut: { not: 'ANNULE' },
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'Ce créneau est déjà réservé. Veuillez choisir un autre horaire.' },
        { status: 409 }
      );
    }

    // Créer le rendez-vous
    const appointment = await db.appointment.create({
      data: {
        vendeurId,
        productId,
        date: dateTime,
        clientNom,
        clientEmail: clientEmail || null,
        clientTelephone,
        note: note || null,
        statut: 'EN_ATTENTE',
      },
    });

    // Ici vous pouvez envoyer un email de confirmation
    // await sendConfirmationEmail(clientEmail, clientNom, appointment);

    return NextResponse.json({
      success: true,
      appointment,
      message: 'Rendez-vous créé avec succès',
    });

  } catch (error) {
    console.error('Erreur création rendez-vous:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la réservation' },
      { status: 500 }
    );
  }
}