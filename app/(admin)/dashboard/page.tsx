import { getAdminStats } from '@/app/actions/admin';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';

export default async function DashboardPage() {
  const stats = await getAdminStats();

  const statItems = [
    { 
      label: "Vendeurs", 
      value: stats.totalVendeurs, 
      trend: `${stats.vendeursActifs} actifs`,
      color: "info" as const 
    },
    { 
      label: "Produits", 
      value: stats.totalProducts, 
      trend: "Total",
      color: "success" as const 
    },
    { 
      label: "Rendez-vous", 
      value: stats.totalAppointments, 
      trend: "Total",
      color: "warning" as const 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statItems.map((stat) => (
          <Card key={stat.label}>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">
                {stat.label}
              </span>
              <span className="text-3xl font-bold text-gray-900 mt-1">
                {stat.value}
              </span>
              <Badge variant={stat.color} className="mt-2 self-start">
                {stat.trend}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Bienvenue dans l'administration</h2>
          <p className="text-gray-600">
            Gérez vos vendeurs, produits et rendez-vous depuis cet espace.
          </p>
        </div>
      </Card>
    </div>
  );
}