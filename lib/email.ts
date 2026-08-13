// lib/email.ts
export async function sendConfirmationEmail(email: string, nom: string, appointment: any) {
  // Utilisez nodemailer ou un service d'email
  console.log(`📧 Email envoyé à ${email} pour ${nom}`);
}