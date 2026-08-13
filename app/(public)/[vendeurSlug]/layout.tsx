import { db } from '@/lib/db';
import Link from 'next/link';
import { Home, Calendar, Phone } from 'lucide-react';

interface PublicLayoutProps {
  children: React.ReactNode;
  params: { vendeurSlug: string };
}

export default async function PublicLayout({ children, params }: PublicLayoutProps) {
  const vendeur = await db.user.findUnique({
    where: { slug: params.vendeurSlug },
    select: { nom: true, slug: true },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-400 hover:text-gray-600">
                <Home className="h-5 w-5" />
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {vendeur?.nom || 'Vendeur'}
                </h1>
                <p className="text-sm text-gray-500">Prendre rendez-vous en ligne</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-gray-500 sm:inline">
                Besoin d'aide ?
              </span>
              <a 
                href="tel:0612345678" 
                className="flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1.5 text-sm text-brand-600 hover:bg-brand-100"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">Contact</span>
              </a>
            </div>
          </div>
        </div>
      </header>
      
      <main>
        {children}
      </main>
    </div>
  );
}