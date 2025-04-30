import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface SettingsTabProps {
  settings: {
    general: {
      siteName: string;
      siteDescription: string;
      maintenanceMode: boolean;
      itemsPerPage: number;
      defaultCurrency: string;
    };
    swapcoins: {
      conversionRate: number;
      minSwapcoins: number;
      maxSwapcoins: number;
      enablePurchase: boolean;
    };
    notifications: {
      enableEmailNotifications: boolean;
      enablePushNotifications: boolean;
      newUserWelcomeMessage: string;
      itemApprovedTemplate: string;
      itemRejectedTemplate: string;
    };
  };
  onSaveSettings: (settingsKey: string, data: any) => void;
}

export const SettingsTab = ({ settings, onSaveSettings }: SettingsTabProps) => {
  const [generalSettings, setGeneralSettings] = useState(settings.general);
  const [swapcoinsSettings, setSwapcoinsSettings] = useState(settings.swapcoins);
  const [notificationSettings, setNotificationSettings] = useState(settings.notifications);

  const handleSaveGeneral = () => {
    onSaveSettings("general", generalSettings);
    toast({
      title: "General settings saved",
      description: "Your changes have been applied successfully.",
    });
  };

  const handleSaveSwapcoins = () => {
    onSaveSettings("swapcoins", swapcoinsSettings);
    toast({
      title: "SwapCoins settings saved",
      description: "Your changes have been applied successfully.",
    });
  };

  const handleSaveNotifications = () => {
    onSaveSettings("notifications", notificationSettings);
    toast({
      title: "Notification settings saved",
      description: "Your changes have been applied successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Admin Settings</h2>
        <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="swapcoins">SwapCoins</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription>
                Manage your site name, description and other general settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={generalSettings.siteName}
                  onChange={(e) => setGeneralSettings({
                    ...generalSettings,
                    siteName: e.target.value
                  })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={(e) => setGeneralSettings({
                    ...generalSettings,
                    siteDescription: e.target.value
                  })}
                  rows={3}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="itemsPerPage">Items Per Page</Label>
                <Input
                  id="itemsPerPage"
                  type="number"
                  value={generalSettings.itemsPerPage}
                  onChange={(e) => setGeneralSettings({
                    ...generalSettings,
                    itemsPerPage: Number(e.target.value)
                  })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="defaultCurrency">Default Currency</Label>
                <Select 
                  value={generalSettings.defaultCurrency} 
                  onValueChange={(value) => setGeneralSettings({
                    ...generalSettings,
                    defaultCurrency: value
                  })}
                >
                  <SelectTrigger id="defaultCurrency">
                    <SelectValue placeholder="Select a currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                    <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <p className="text-muted-foreground text-sm">When enabled, the site will show a maintenance page to normal users</p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={generalSettings.maintenanceMode}
                  onCheckedChange={(checked) => setGeneralSettings({
                    ...generalSettings,
                    maintenanceMode: checked
                  })}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneral}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="swapcoins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SwapCoins Settings</CardTitle>
              <CardDescription>
                Configure how SwapCoins work on your platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="conversionRate">Conversion Rate ($ to SwapCoins)</Label>
                <Input
                  id="conversionRate"
                  type="number"
                  value={swapcoinsSettings.conversionRate}
                  onChange={(e) => setSwapcoinsSettings({
                    ...swapcoinsSettings,
                    conversionRate: Number(e.target.value)
                  })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="minSwapcoins">Minimum SwapCoins Purchase</Label>
                <Input
                  id="minSwapcoins"
                  type="number"
                  value={swapcoinsSettings.minSwapcoins}
                  onChange={(e) => setSwapcoinsSettings({
                    ...swapcoinsSettings,
                    minSwapcoins: Number(e.target.value)
                  })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="maxSwapcoins">Maximum SwapCoins Purchase</Label>
                <Input
                  id="maxSwapcoins"
                  type="number"
                  value={swapcoinsSettings.maxSwapcoins}
                  onChange={(e) => setSwapcoinsSettings({
                    ...swapcoinsSettings,
                    maxSwapcoins: Number(e.target.value)
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enablePurchase">Enable SwapCoins Purchases</Label>
                  <p className="text-muted-foreground text-sm">Allow users to purchase SwapCoins on the platform</p>
                </div>
                <Switch
                  id="enablePurchase"
                  checked={swapcoinsSettings.enablePurchase}
                  onCheckedChange={(checked) => setSwapcoinsSettings({
                    ...swapcoinsSettings,
                    enablePurchase: checked
                  })}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSwapcoins}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure email and push notification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableEmailNotifications">Email Notifications</Label>
                  <p className="text-muted-foreground text-sm">Send notifications via email to users</p>
                </div>
                <Switch
                  id="enableEmailNotifications"
                  checked={notificationSettings.enableEmailNotifications}
                  onCheckedChange={(checked) => setNotificationSettings({
                    ...notificationSettings,
                    enableEmailNotifications: checked
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enablePushNotifications">Push Notifications</Label>
                  <p className="text-muted-foreground text-sm">Send push notifications to users' devices</p>
                </div>
                <Switch
                  id="enablePushNotifications"
                  checked={notificationSettings.enablePushNotifications}
                  onCheckedChange={(checked) => setNotificationSettings({
                    ...notificationSettings,
                    enablePushNotifications: checked
                  })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="newUserWelcomeMessage">New User Welcome Message</Label>
                <Textarea
                  id="newUserWelcomeMessage"
                  value={notificationSettings.newUserWelcomeMessage}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    newUserWelcomeMessage: e.target.value
                  })}
                  rows={4}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="itemApprovedTemplate">Item Approved Notification</Label>
                <Textarea
                  id="itemApprovedTemplate"
                  value={notificationSettings.itemApprovedTemplate}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    itemApprovedTemplate: e.target.value
                  })}
                  rows={4}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="itemRejectedTemplate">Item Rejected Notification</Label>
                <Textarea
                  id="itemRejectedTemplate"
                  value={notificationSettings.itemRejectedTemplate}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    itemRejectedTemplate: e.target.value
                  })}
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Security settings will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Platform Integrations</CardTitle>
              <CardDescription>
                Configure third-party integrations and APIs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Integration settings will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};