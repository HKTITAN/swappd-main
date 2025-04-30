
import { Users, Package, ChartBar } from "lucide-react";
import { StatsCard } from "./StatsCard";

interface DashboardStatsProps {
  totalUsers: number;
  totalItems: number;
  totalSwapcoins: number;
}

export const DashboardStats = ({ totalUsers, totalItems, totalSwapcoins }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard title="Total Users" value={totalUsers} icon={Users} />
      <StatsCard title="Total Items" value={totalItems} icon={Package} />
      <StatsCard title="Total SwapCoins" value={totalSwapcoins} icon={ChartBar} />
    </div>
  );
};
