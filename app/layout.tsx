import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RDV App',
  description: "Plateforme de prise de rendez-vous multi-vendeurs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
