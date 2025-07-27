
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      // General settings
      generalSettings: {
        pharmacyName: "RxNexus Pharmacy",
        licenseNumber: "PL-2025-00123",
        email: "contact@rxnexus.com",
        phone: "1234567890",
        address: "Illahi Bagh",
        city: "Srinagar",
        state: "Jammu & Kashmir",
        zipCode: "190020"
      },
      
      // Notification settings
      notificationSettings: {
        lowStock: true,
        expiry: true,
        ePrescription: true,
        refill: true,
        systemUpdates: true,
        email: true,
        push: true,
        inApp: true
      },
      
      // Profile settings
      profileSettings: {
        darkMode: false,
        sessionTimeout: 30
      },
      
      updateGeneralSettings: (settings) => {
        set({
          generalSettings: {
            ...get().generalSettings,
            ...settings
          }
        });
      },
      
      updateNotificationSettings: (settings) => {
        set({
          notificationSettings: {
            ...get().notificationSettings,
            ...settings
          }
        });
      },
      
      updateProfileSettings: (settings) => {
        set({
          profileSettings: {
            ...get().profileSettings,
            ...settings
          }
        });
      },
      
      toggleNotificationSetting: (key) => {
        set({
          notificationSettings: {
            ...get().notificationSettings,
            [key]: !get().notificationSettings[key]
          }
        });
      },
      
      toggleDarkMode: () => {
        set({
          profileSettings: {
            ...get().profileSettings,
            darkMode: !get().profileSettings.darkMode
          }
        });
      }
    }),
    {
      name: 'pharmacy-settings-storage', // Name for localStorage
    }
  )
);
