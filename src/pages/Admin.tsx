import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Database, Flag, ChartBar, MessageSquare, AlertTriangle, Search, Package } from "lucide-react";

import { DashboardStats } from "@/components/admin/DashboardStats";
import { InventoryManager } from "@/components/admin/InventoryManager";
import { UsersTab } from "@/components/admin/tabs/UsersTab";
import { ItemsTab } from "@/components/admin/tabs/ItemsTab";
import { TransactionsTab } from "@/components/admin/tabs/TransactionsTab";
import { ReportsTab } from "@/components/admin/tabs/ReportsTab";
import { AnalyticsTab } from "@/components/admin/tabs/AnalyticsTab";
import { SettingsTab } from "@/components/admin/tabs/SettingsTab";
import { PlaceholderTab } from "@/components/admin/tabs/PlaceholderTab";
import { AdminTabsList } from "@/components/admin/AdminTabsList";

// Import the real-time data hooks
import { useAdminData } from "@/hooks/useAdminData";
import { useTransactionsData } from "@/hooks/useTransactionsData";
import { useReportsData } from "@/hooks/useReportsData";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { useSettingsData } from "@/hooks/useSettingsData";
import { useInventoryData } from "@/hooks/useInventoryData";

import { toast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const Admin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Use the real-time data hooks
  const { filteredUsers, filteredItems, reports } = useAdminData(searchQuery);
  const { transactions, loading: transactionsLoading } = useTransactionsData(searchQuery);
  const { 
    reports: userReports, 
    loading: reportsLoading, 
    updateReportStatus, 
    submitReportReply 
  } = useReportsData(searchQuery);
  
  const analyticsData = useAnalyticsData();
  const { 
    general: generalSettings,
    swapcoins: swapcoinsSettings,
    notifications: notificationSettings,
    loading: settingsLoading,
    updateSettings
  } = useSettingsData();

  // Use inventory data hook
  const {
    shopItems,
    loading: inventoryLoading,
    error: inventoryError,
  } = useInventoryData();

  // Combine all items including shop inventory items
  const allItems = [...filteredItems, ...shopItems.filter(item => 
    !filteredItems.some(fi => fi.id === item.id)
  )];

  // Handle report status changes
  const handleReportStatusChange = async (reportId: string, status: string) => {
    const result = await updateReportStatus(reportId, status);
    if (result.success) {
      toast({
        title: "Report status updated",
        description: `Report #${reportId.substring(0, 6)} has been marked as ${status}.`,
      });
    } else {
      toast({
        title: "Update failed",
        description: result.error || "Failed to update report status",
        variant: "destructive",
      });
    }
  };

  // Handle report replies
  const handleReportReply = async (reportId: string, message: string) => {
    const result = await submitReportReply(reportId, message);
    if (result.success) {
      toast({
        title: "Reply sent",
        description: "Your response has been sent to the user.",
      });
    } else {
      toast({
        title: "Failed to send reply",
        description: result.error || "An error occurred",
        variant: "destructive",
      });
    }
  };

  // Handle settings updates
  const handleSaveSettings = async (settingsKey: "general" | "swapcoins" | "notifications", data: any) => {
    const result = await updateSettings(settingsKey, data);
    if (result.success) {
      toast({
        title: "Settings updated",
        description: `${settingsKey.charAt(0).toUpperCase() + settingsKey.slice(1)} settings have been saved.`,
      });
    } else {
      toast({
        title: "Update failed",
        description: result.error || `Failed to update ${settingsKey} settings`,
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) {
    navigate("/");
    return null;
  }

  return (
    <div className="container py-8 lg:py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage all aspects of your platform</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users, items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
        </div>

        {/* Real-time dashboard stats */}
        <DashboardStats />
        
        {/* Add inventory manager */}
        <InventoryManager />

        <div className="rounded-lg border bg-card">
          <Tabs defaultValue="users" className="space-y-4">
            <div className="border-b px-3">
              <AdminTabsList />
            </div>

            <div className="p-6">
              <TabsContent value="users" className="m-0">
                <UsersTab users={filteredUsers} />
              </TabsContent>

              <TabsContent value="items" className="m-0">
                {inventoryLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <LoadingSpinner size="large" />
                  </div>
                ) : (
                  <ItemsTab items={allItems} />
                )}
              </TabsContent>

              <TabsContent value="transactions" className="m-0">
                {transactionsLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <LoadingSpinner size="large" />
                  </div>
                ) : (
                  <TransactionsTab transactions={transactions} />
                )}
              </TabsContent>

              <TabsContent value="reports" className="m-0">
                {reportsLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <LoadingSpinner size="large" />
                  </div>
                ) : (
                  <ReportsTab 
                    reports={userReports} 
                    onStatusChange={handleReportStatusChange} 
                    onReplySubmit={handleReportReply} 
                  />
                )}
              </TabsContent>

              <TabsContent value="analytics" className="m-0">
                {analyticsData.loading ? (
                  <div className="flex justify-center items-center py-20">
                    <LoadingSpinner size="large" />
                  </div>
                ) : (
                  <AnalyticsTab 
                    userGrowth={analyticsData.userGrowth}
                    itemsByCategory={analyticsData.itemsByCategory}
                    transactionVolume={analyticsData.transactionVolume}
                    userActivity={analyticsData.userActivity}
                  />
                )}
              </TabsContent>

              <TabsContent value="messages" className="m-0">
                <PlaceholderTab
                  title="System Messages"
                  description="Manage system-wide announcements and notifications"
                  icon={MessageSquare}
                />
              </TabsContent>

              <TabsContent value="alerts" className="m-0">
                <PlaceholderTab
                  title="System Alerts"
                  description="View and manage system alerts and notifications"
                  icon={AlertTriangle}
                />
              </TabsContent>

              <TabsContent value="settings" className="m-0">
                {settingsLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <LoadingSpinner size="large" />
                  </div>
                ) : (
                  <SettingsTab 
                    settings={{
                      general: generalSettings,
                      swapcoins: swapcoinsSettings,
                      notifications: notificationSettings
                    }}
                    onSaveSettings={handleSaveSettings}
                  />
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
