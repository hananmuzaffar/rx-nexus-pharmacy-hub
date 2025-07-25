import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Initial notifications data
const initialNotifications = [
  {
    id: "1",
    type: "warning",
    title: "Low Stock Alert",
    message: "Amoxicillin 500mg is running low (5 units remaining)",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    read: false,
    priority: "high"
  },
  {
    id: "2", 
    type: "info",
    title: "E-Prescription Received",
    message: "New e-prescription ERX00456 from Dr. Miller",
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    read: false,
    priority: "medium"
  },
  {
    id: "3",
    type: "warning", 
    title: "Prescription Expiry",
    message: "3 prescriptions will expire in 7 days",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    read: true,
    priority: "medium"
  },
  {
    id: "4",
    type: "success",
    title: "Sale Completed",
    message: "Sale #12345 completed successfully for ₹1,250",
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    read: true,
    priority: "low"
  }
];

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: initialNotifications,
      
      // Get all notifications
      getNotifications: () => {
        return get().notifications.sort((a, b) => b.timestamp - a.timestamp);
      },
      
      // Get unread notifications count
      getUnreadCount: () => {
        return get().notifications.filter(n => !n.read).length;
      },
      
      // Mark notification as read
      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          )
        }));
      },
      
      // Mark all notifications as read
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, read: true }))
        }));
      },
      
      // Add new notification
      addNotification: (notification) => {
        const newNotification = {
          id: Date.now().toString(),
          timestamp: new Date(),
          read: false,
          priority: "medium",
          ...notification
        };
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications]
        }));
      },
      
      // Remove notification
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      },
      
      // Clear all notifications
      clearAllNotifications: () => {
        set({ notifications: [] });
      }
    }),
    {
      name: 'pharmacy-notifications-storage',
    }
  )
);