
import { 
  Users, Package, ShoppingCart, Settings, ChartBar, 
  AlertTriangle, MessageSquare, Flag, Database 
} from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AdminTabsList = () => {
  return (
    <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
      <TabsTrigger value="users" className="flex items-center gap-2">
        <Users className="h-4 w-4" />Users
      </TabsTrigger>
      <TabsTrigger value="items" className="flex items-center gap-2">
        <Package className="h-4 w-4" />Items
      </TabsTrigger>
      <TabsTrigger value="transactions" className="flex items-center gap-2">
        <ShoppingCart className="h-4 w-4" />Transactions
      </TabsTrigger>
      <TabsTrigger value="reports" className="flex items-center gap-2">
        <Flag className="h-4 w-4" />Reports
      </TabsTrigger>
      <TabsTrigger value="analytics" className="flex items-center gap-2">
        <ChartBar className="h-4 w-4" />Analytics
      </TabsTrigger>
      <TabsTrigger value="messages" className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />Messages
      </TabsTrigger>
      <TabsTrigger value="alerts" className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />Alerts
      </TabsTrigger>
      <TabsTrigger value="settings" className="flex items-center gap-2">
        <Settings className="h-4 w-4" />Settings
      </TabsTrigger>
    </TabsList>
  );
};
