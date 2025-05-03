import { Users, Package, ChartBar, ShoppingBag, AlertTriangle, DollarSign, Loader2 } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const DashboardStats = () => {
  // Use our real-time dashboard stats hook
  const { 
    totalUsers, 
    totalItems, 
    totalSwapcoins, 
    inventoryStats,
    loading,
    error,
    refreshStats
  } = useDashboardStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard statistics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error} <button onClick={refreshStats} className="underline ml-2">Try again</button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="Total Users" value={totalUsers} icon={<Users />} />
        <StatsCard title="Total Items" value={totalItems} icon={<Package />} />
        <StatsCard title="Total SwapCoins" value={totalSwapcoins} icon={<ChartBar />} />
      </div>
      
      {inventoryStats && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Inventory Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard 
              title="Shop Items" 
              value={inventoryStats.totalItems} 
              icon={<ShoppingBag />} 
              valuePrefix=""
            />
            <StatsCard 
              title="Low Stock Items" 
              value={inventoryStats.lowStockItems} 
              icon={<AlertTriangle />} 
              valuePrefix=""
              variant={inventoryStats.lowStockItems > 0 ? "warning" : "default"}
            />
            <StatsCard 
              title="Out of Stock Items" 
              value={inventoryStats.outOfStockItems} 
              icon={<AlertTriangle />} 
              valuePrefix=""
              variant={inventoryStats.outOfStockItems > 0 ? "destructive" : "default"}
            />
            <StatsCard 
              title="Inventory Value" 
              value={inventoryStats.totalValue} 
              icon={<DollarSign />} 
              valuePrefix="$" 
              valueFormatter={(value) => value.toFixed(2)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
