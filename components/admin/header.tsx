"use client";

import { usePathname } from "next/navigation";

interface AdminHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname();
  
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Tableau de bord";
    if (pathname === "/vendeurs") return "Gestion des vendeurs";
    if (pathname?.startsWith("/vendeurs/")) return "Détails du vendeur";
    return "Administration";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden sm:inline">
            {user?.email}
          </span>
          <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold">
            {user?.name ? getInitials(user.name) : "A"}
          </div>
        </div>
      </div>
    </header>
  );
}