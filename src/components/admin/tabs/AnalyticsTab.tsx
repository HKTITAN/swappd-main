import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, BarChart, DonutChart } from "@/components/ui/chart";

interface AnalyticsProps {
  userGrowth: { date: string; count: number }[];
  itemsByCategory: { category: string; count: number }[];
  transactionVolume: { date: string; volume: number }[];
  userActivity: { date: string; active_users: number }[];
}

export const AnalyticsTab = ({ userGrowth, itemsByCategory, transactionVolume, userActivity }: AnalyticsProps) => {
  // Format data for charts
  const userGrowthData = {
    labels: userGrowth.map(point => point.date),
    datasets: [
      {
        label: 'User Growth',
        data: userGrowth.map(point => point.count),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const categoryData = {
    labels: itemsByCategory.map(item => item.category),
    datasets: [
      {
        label: 'Items by Category',
        data: itemsByCategory.map(item => item.count),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(79, 70, 229, 0.8)',
          'rgba(67, 56, 202, 0.8)',
          'rgba(55, 48, 163, 0.8)',
          'rgba(49, 46, 129, 0.8)',
          'rgba(30, 58, 138, 0.8)',
        ],
      },
    ],
  };

  const volumeData = {
    labels: transactionVolume.map(point => point.date),
    datasets: [
      {
        label: 'Transaction Volume',
        data: transactionVolume.map(point => point.volume),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      },
    ],
  };

  const activityData = {
    labels: userActivity.map(point => point.date),
    datasets: [
      {
        label: 'Active Users',
        data: userActivity.map(point => point.active_users),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Platform Analytics</h2>
        <p className="text-muted-foreground">View detailed platform statistics and trends</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New user sign-ups over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <LineChart data={userGrowthData} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Items by Category</CardTitle>
                <CardDescription>Distribution of items across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <DonutChart data={categoryData} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Volume</CardTitle>
                <CardDescription>SwapCoin transaction volume over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart data={volumeData} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Daily active users on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <LineChart data={activityData} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>User Growth Trends</CardTitle>
              <CardDescription>Monthly new user registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <LineChart data={userGrowthData} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>User Activity Metrics</CardTitle>
              <CardDescription>Daily active users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <LineChart data={activityData} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="items" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Item Distribution</CardTitle>
              <CardDescription>Items by category breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <DonutChart data={categoryData} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Transaction Volume</CardTitle>
              <CardDescription>SwapCoin transaction volume over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <BarChart data={volumeData} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};