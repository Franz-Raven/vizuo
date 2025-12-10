import { Users, Shield, Palette } from "lucide-react";

interface AdminStatsProps {
  totalUsers: number;
  adminCount: number;
  designerCount: number;
}

export default function AdminStats({ totalUsers, adminCount, designerCount }: AdminStatsProps) {
  const stats = [
    { label: "Total Users", value: totalUsers, icon: Users },
    { label: "Admins", value: adminCount, icon: Shield },
    { label: "Designers", value: designerCount, icon: Palette },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-2xl bg-card border border-border/70 shadow-xl shadow-black/40 p-5 animate-fade-in flex items-center justify-between"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex flex-col">
              <p className="text-3xl font-bold leading-tight">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>

            <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
