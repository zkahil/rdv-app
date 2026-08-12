import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">RDV App</h1>
      <p className="text-gray-500">Plateforme de prise de rendez-vous multi-vendeurs</p>
      <Link href="/login" className="rounded bg-brand-600 px-4 py-2 text-white hover:bg-brand-700">
        Connexion
      </Link>
    </div>
  );
}
