import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import VendeurSidebar from "@/components/vendeur/sidebar";
import VendeurHeader from "@/components/vendeur/header";

export default async function VendeurLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.user.role?.toUpperCase() !== 'VENDEUR') {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <VendeurSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <VendeurHeader user={session.user} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}