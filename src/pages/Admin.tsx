import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Database, Flag, ChartBar, MessageSquare, AlertTriangle, Search } from "lucide-react";

import { DashboardStats } from "@/components/admin/DashboardStats";
import { UsersTab } from "@/components/admin/tabs/UsersTab";
import { ItemsTab } from "@/components/admin/tabs/ItemsTab";
import { TransactionsTab } from "@/components/admin/tabs/TransactionsTab";
import { ReportsTab } from "@/components/admin/tabs/ReportsTab";
import { AnalyticsTab } from "@/components/admin/tabs/AnalyticsTab";
import { SettingsTab } from "@/components/admin/tabs/SettingsTab";
import { PlaceholderTab } from "@/components/admin/tabs/PlaceholderTab";
import { AdminTabsList } from "@/components/admin/AdminTabsList";
import { useAdminData } from "@/hooks/useAdminData";
import { toast } from "@/hooks/use-toast";

const Admin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { filteredUsers, filteredItems, reports } = useAdminData(searchQuery);
  
  // Mock data for new tabs
  const mockTransactions = [
    {
      id: "tx-001",
      user_id: "user-001",
      username: "johndoe",
      amount: 500,
      type: "credit" as const,
      description: "Item sold: Vintage Denim Jacket",
      created_at: new Date(2025, 3, 28).toISOString(),
      status: "completed"
    },
    {
      id: "tx-002",
      user_id: "user-002",
      username: "janedoe",
      amount: 300,
      type: "debit" as const,
      description: "Item purchased: Classic Black Jeans",
      created_at: new Date(2025, 3, 27).toISOString(),
      status: "completed"
    },
    {
      id: "tx-003",
      user_id: "user-003",
      username: "mikesmith",
      amount: 1000,
      type: "credit" as const,
      description: "Purchased SwapCoins",
      created_at: new Date(2025, 3, 26).toISOString(),
      status: "completed"
    },
    {
      id: "tx-004",
      user_id: "user-001",
      username: "johndoe",
      amount: 250,
      type: "debit" as const,
      description: "Item purchased: White T-Shirt",
      created_at: new Date(2025, 3, 25).toISOString(),
      status: "completed"
    },
    {
      id: "tx-005",
      user_id: "user-004",
      username: "sarahconnor",
      amount: 400,
      type: "credit" as const,
      description: "Item sold: Graphic Print Hoodie",
      created_at: new Date(2025, 3, 24).toISOString(),
      status: "pending"
    }
  ];

  const mockAnalyticsData = {
    userGrowth: [
      { date: 'Jan 2025', count: 120 },
      { date: 'Feb 2025', count: 180 },
      { date: 'Mar 2025', count: 240 },
      { date: 'Apr 2025', count: 310 },
    ],
    itemsByCategory: [
      { category: 'Tops', count: 450 },
      { category: 'Bottoms', count: 320 },
      { category: 'Outerwear', count: 280 },
      { category: 'Footwear', count: 210 },
      { category: 'Accessories', count: 180 },
    ],
    transactionVolume: [
      { date: 'Jan 2025', volume: 12500 },
      { date: 'Feb 2025', volume: 18700 },
      { date: 'Mar 2025', volume: 22400 },
      { date: 'Apr 2025', volume: 28900 },
    ],
    userActivity: [
      { date: 'Apr 24', active_users: 85 },
      { date: 'Apr 25', active_users: 92 },
      { date: 'Apr 26', active_users: 78 },
      { date: 'Apr 27', active_users: 110 },
      { date: 'Apr 28', active_users: 98 },
      { date: 'Apr 29', active_users: 115 },
      { date: 'Apr 30', active_users: 120 },
    ]
  };

  const mockReports = [
    {
      id: "rep-001",
      user_id: "user-005",
      username: "davidwilson",
      report_type: "Item Issue",
      reported_item_id: "item-001",
      reported_user_id: null,
      subject: "Item condition doesn't match description",
      description: "The item I received was marked as 'like new' but has visible wear and tear. The seller's description wasn't accurate.",
      status: "open" as const,
      priority: "high" as const,
      created_at: new Date(2025, 3, 28).toISOString(),
      updated_at: new Date(2025, 3, 28).toISOString()
    },
    {
      id: "rep-002",
      user_id: "user-006",
      username: "emilybrown",
      report_type: "User Behavior",
      reported_item_id: null,
      reported_user_id: "user-007",
      subject: "User sent inappropriate messages",
      description: "This user has been sending inappropriate messages when I attempted to arrange a swap. I've included screenshots in my email.",
      status: "investigating" as const,
      priority: "critical" as const,
      created_at: new Date(2025, 3, 27).toISOString(),
      updated_at: new Date(2025, 3, 29).toISOString()
    },
    {
      id: "rep-003",
      user_id: "user-008",
      username: "alexnguyen",
      report_type: "Platform Issue",
      reported_item_id: null,
      reported_user_id: null,
      subject: "Payment system error",
      description: "I tried to purchase SwapCoins but my payment was processed twice. Please help resolve this and refund the extra charge.",
      status: "resolved" as const,
      priority: "high" as const,
      created_at: new Date(2025, 3, 25).toISOString(),
      updated_at: new Date(2025, 3, 26).toISOString()
    },
    {
      id: "rep-004",
      user_id: "user-009",
      username: "sarahjones",
      report_type: "Item Issue",
      reported_item_id: "item-002",
      reported_user_id: null,
      subject: "Item never arrived",
      description: "I purchased this item two weeks ago but it never arrived. The tracking number provided doesn't work.",
      status: "open" as const,
      priority: "medium" as const,
      created_at: new Date(2025, 3, 22).toISOString(),
      updated_at: new Date(2025, 3, 22).toISOString()
    },
    {
      id: "rep-005",
      user_id: "user-010",
      username: "robertlee",
      report_type: "Other",
      reported_item_id: null,
      reported_user_id: null,
      subject: "Feature request",
      description: "It would be great if we could filter items by multiple categories at once. Just a suggestion for improving the platform.",
      status: "closed" as const,
      priority: "low" as const,
      created_at: new Date(2025, 3, 20).toISOString(),
      updated_at: new Date(2025, 3, 21).toISOString()
    }
  ];

  // Mock settings data
  const mockSettings = {
    general: {
      siteName: "SwapPD",
      siteDescription: "A sustainable fashion platform for swapping clothes and accessories",
      maintenanceMode: false,
      itemsPerPage: 12,
      defaultCurrency: "USD"
    },
    swapcoins: {
      conversionRate: 10, // $1 = 10 SwapCoins
      minSwapcoins: 100,
      maxSwapcoins: 10000,
      enablePurchase: true
    },
    notifications: {
      enableEmailNotifications: true,
      enablePushNotifications: false,
      newUserWelcomeMessage: "Welcome to SwapPD! Start by adding your first item to swap.",
      itemApprovedTemplate: "Good news! Your item {item_name} has been approved and is now listed on the platform.",
      itemRejectedTemplate: "We're sorry, but your item {item_name} has been rejected. Reason: {rejection_reason}"
    }
  };
  
  // Handle report status changes
  const handleReportStatusChange = (reportId: string, status: string) => {
    toast({
      title: "Report status updated",
      description: `Report #${reportId.substring(0, 6)} has been marked as ${status}.`,
    });
    // In a real app, you would update the database here
  };

  // Handle report replies
  const handleReportReply = (reportId: string, message: string) => {
    toast({
      title: "Reply sent",
      description: "Your response has been sent to the user.",
    });
    // In a real app, you would send the reply to the user and update the database
  };

  // Handle settings updates
  const handleSaveSettings = (settingsKey: string, data: any) => {
    toast({
      title: "Settings updated",
      description: `${settingsKey.charAt(0).toUpperCase() + settingsKey.slice(1)} settings have been saved.`,
    });
    // In a real app, you would update the database here
    console.log(`Updated ${settingsKey} settings:`, data);
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

        <DashboardStats
          totalUsers={reports.total_users}
          totalItems={reports.total_items}
          totalSwapcoins={reports.total_swapcoins}
        />

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
                <ItemsTab items={filteredItems} />
              </TabsContent>

              <TabsContent value="transactions" className="m-0">
                <TransactionsTab transactions={mockTransactions} />
              </TabsContent>

              <TabsContent value="reports" className="m-0">
                <ReportsTab 
                  reports={mockReports} 
                  onStatusChange={handleReportStatusChange} 
                  onReplySubmit={handleReportReply} 
                />
              </TabsContent>

              <TabsContent value="analytics" className="m-0">
                <AnalyticsTab 
                  userGrowth={mockAnalyticsData.userGrowth}
                  itemsByCategory={mockAnalyticsData.itemsByCategory}
                  transactionVolume={mockAnalyticsData.transactionVolume}
                  userActivity={mockAnalyticsData.userActivity}
                />
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
                <SettingsTab 
                  settings={mockSettings}
                  onSaveSettings={handleSaveSettings}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
