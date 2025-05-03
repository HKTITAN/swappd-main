import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface PlatformSettings {
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
  loading: boolean;
  error: string | null;
}

interface SettingsData {
  id: string;
  settings: Json;
  created_at: string;
  updated_at: string | null;
}

export const useSettingsData = () => {
  const [settings, setSettings] = useState<PlatformSettings>({
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
    },
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setSettings(prev => ({ ...prev, loading: true }));
        
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 means no rows returned, which we'll handle by using default settings
          throw error;
        }

        if (data) {
          // Parse the stored JSON settings
          let parsedSettings = {} as any;
          
          try {
            // Handle different ways settings might be stored
            if (typeof data.settings === 'string') {
              parsedSettings = JSON.parse(data.settings);
            } else if (typeof data.settings === 'object') {
              parsedSettings = data.settings;
            } else {
              // Individual setting columns
              const settingsKeys = ['general', 'swapcoins', 'notifications'];
              settingsKeys.forEach(key => {
                if (data[key]) {
                  try {
                    parsedSettings[key] = typeof data[key] === 'string' 
                      ? JSON.parse(data[key]) 
                      : data[key];
                  } catch (e) {
                    console.warn(`Failed to parse settings section ${key}:`, e);
                  }
                }
              });
            }
            
            // Merge with default settings to ensure all fields exist
            setSettings(prev => ({
              general: { ...prev.general, ...parsedSettings.general },
              swapcoins: { ...prev.swapcoins, ...parsedSettings.swapcoins },
              notifications: { ...prev.notifications, ...parsedSettings.notifications },
              loading: false,
              error: null
            }));
          } catch (parseError) {
            console.error('Error parsing settings:', parseError);
            // Fallback to defaults if parsing fails
            setSettings(prev => ({ ...prev, loading: false }));
          }
        } else {
          // No settings found, using defaults
          setSettings(prev => ({ ...prev, loading: false }));
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
        setSettings(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load platform settings'
        }));
      }
    };

    fetchSettings();
    
    // Set up real-time subscription for settings changes
    const settingsSubscription = supabase
      .channel('settings_channel')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'settings' 
        }, 
        (payload) => {
          fetchSettings(); // Refetch settings when they change
        }
      )
      .subscribe();

    return () => {
      settingsSubscription.unsubscribe();
    };
  }, []);

  // Update settings function
  const updateSettings = async (settingsKey: keyof Omit<PlatformSettings, 'loading' | 'error'>, data: any) => {
    try {
      // Update local state first for better UX
      setSettings(prev => ({
        ...prev,
        [settingsKey]: {
          ...prev[settingsKey],
          ...data
        }
      }));
      
      // Prepare settings object to save
      const currentSettings = {
        general: settings.general,
        swapcoins: settings.swapcoins,
        notifications: settings.notifications
      };
      
      currentSettings[settingsKey] = {
        ...currentSettings[settingsKey],
        ...data
      };
      
      // Update settings in database
      const { error } = await supabase
        .from('settings')
        .upsert({ 
          id: "1", // Using string id to match the type in the database
          settings: currentSettings as Json,
          updated_at: new Date().toISOString() 
        });

      if (error) throw error;
      
      return { success: true };
    } catch (err) {
      console.error(`Error updating ${settingsKey} settings:`, err);
      // Revert to previous settings on error
      fetchSettings();
      return { success: false, error: `Failed to update ${settingsKey} settings` };
    }
  };

  // Fetch settings function that can be called from outside
  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        let parsedSettings: any;
        try {
          parsedSettings = typeof data.settings === 'string' 
            ? JSON.parse(data.settings as string) 
            : data.settings;
            
          setSettings(prev => ({
            general: { ...prev.general, ...parsedSettings.general },
            swapcoins: { ...prev.swapcoins, ...parsedSettings.swapcoins },
            notifications: { ...prev.notifications, ...parsedSettings.notifications },
            loading: false,
            error: null
          }));
        } catch (parseError) {
          console.error('Error parsing settings:', parseError);
        }
      }
    } catch (err) {
      console.error('Error in fetchSettings:', err);
    }
  };

  return {
    ...settings,
    updateSettings,
    refreshSettings: fetchSettings
  };
};