// Si vous n'utilisez pas encore l'envoi d'email, simplifiez la fonction
export async function sendConfirmationEmail(email: string, nom: string) {
  // Implémentation à venir
  console.log(`📧 Email à envoyer à ${email} pour ${nom}`);
  return true;
}

// Ou si vous voulez garder la signature complète
export async function sendConfirmationEmailWithAppointment(
  email: string, 
  nom: string, 
  // appointment: any // Supprimer si non utilisé
) {
  console.log(`📧 Email à envoyer à ${email} pour ${nom}`);
  return true;
}