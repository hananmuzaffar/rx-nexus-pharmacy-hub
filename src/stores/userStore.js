
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

// Initial users data
const initialUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@rxnexus.com",
    role: "Administrator",
    status: "active",
    lastLogin: "Today, 8:30 AM"
  },
  {
    id: "2",
    name: "Pharmacist",
    email: "pharmacist@rxnexus.com",
    role: "Pharmacist",
    status: "active",
    lastLogin: "Today, 9:15 AM"
  },
  {
    id: "3",
    name: "Technician",
    email: "tech@rxnexus.com",
    role: "Pharmacy Technician",
    status: "active",
    lastLogin: "Yesterday, 5:30 PM"
  }
];

// Define role permissions
const rolePermissions = {
  Administrator: {
    inventory: { view: true, add: true, edit: true, delete: true },
    sales: { view: true, add: true, edit: true, delete: true },
    purchases: { view: true, add: true, edit: true, delete: true },
    customers: { view: true, add: true, edit: true, delete: true },
    prescriptions: { view: true, add: true, edit: true, delete: true },
    returns: { view: true, add: true, edit: true, delete: true },
    reports: { view: true, add: true, edit: true, delete: true },
    settings: { view: true, add: true, edit: true, delete: true },
    users: { view: true, add: true, edit: true, delete: true },
  },
  Pharmacist: {
    inventory: { view: true, add: true, edit: true, delete: false },
    sales: { view: true, add: true, edit: true, delete: false },
    purchases: { view: true, add: false, edit: false, delete: false },
    customers: { view: true, add: true, edit: true, delete: false },
    prescriptions: { view: true, add: true, edit: true, delete: false },
    returns: { view: true, add: true, edit: true, delete: false },
    reports: { view: true, add: false, edit: false, delete: false },
    settings: { view: false, add: false, edit: false, delete: false },
    users: { view: false, add: false, edit: false, delete: false },
  },
  "Pharmacy Technician": {
    inventory: { view: true, add: false, edit: false, delete: false },
    sales: { view: true, add: true, edit: false, delete: false },
    purchases: { view: true, add: false, edit: false, delete: false },
    customers: { view: true, add: true, edit: true, delete: false },
    prescriptions: { view: true, add: false, edit: false, delete: false },
    returns: { view: true, add: true, edit: false, delete: false },
    reports: { view: false, add: false, edit: false, delete: false },
    settings: { view: false, add: false, edit: false, delete: false },
    users: { view: false, add: false, edit: false, delete: false },
  },
  Cashier: {
    inventory: { view: true, add: false, edit: false, delete: false },
    sales: { view: true, add: true, edit: false, delete: false },
    purchases: { view: false, add: false, edit: false, delete: false },
    customers: { view: true, add: true, edit: false, delete: false },
    prescriptions: { view: false, add: false, edit: false, delete: false },
    returns: { view: true, add: true, edit: false, delete: false },
    reports: { view: false, add: false, edit: false, delete: false },
    settings: { view: false, add: false, edit: false, delete: false },
    users: { view: false, add: false, edit: false, delete: false },
  }
};

export const useUserStore = create(
  persist(
    (set, get) => ({
      users: initialUsers,
      rolePermissions: rolePermissions,
      customRolePermissions: {}, // For custom permission overrides
      
      // Add a new user
      addUser: async (user) => {
        try {
          // Add user to Supabase if possible (email/password should be handled separately)
          // Store in local state for now
          set((state) => ({
            users: [...state.users, { ...user, id: Date.now().toString() }]
          }));
          return { success: true };
        } catch (error) {
          console.error("Error adding user:", error);
          return { success: false, error };
        }
      },
      
      // Update an existing user
      updateUser: (updatedUser) => {
        set((state) => ({
          users: state.users.map((user) => 
            user.id === updatedUser.id ? updatedUser : user
          )
        }));
      },
      
      // Delete a user
      deleteUser: (userId) => {
        set((state) => ({
          users: state.users.filter((user) => user.id !== userId),
          // Also remove any custom permissions
          customRolePermissions: {
            ...state.customRolePermissions,
            [userId]: undefined
          }
        }));
      },
      
      // Get user by ID
      getUserById: (id) => {
        return get().users.find(user => user.id === id);
      },
      
      // Get permissions for a role
      getRolePermissions: (role) => {
        return role ? get().rolePermissions[role] : null;
      },
      
      // Get custom permissions for a specific user
      getUserPermissions: (userId) => {
        const user = get().getUserById(userId);
        if (!user) return null;
        
        // Check for custom permissions
        const customPermissions = get().customRolePermissions[userId];
        if (customPermissions) {
          return customPermissions;
        }
        
        // Fall back to role-based permissions
        return get().getRolePermissions(user.role);
      },
      
      // Set custom permissions for a specific user
      setUserPermissions: (userId, permissions) => {
        set((state) => ({
          customRolePermissions: {
            ...state.customRolePermissions,
            [userId]: permissions
          }
        }));
      },
      
      // Clear custom permissions for a user (revert to role-based)
      clearUserPermissions: (userId) => {
        set((state) => {
          const { [userId]: _, ...rest } = state.customRolePermissions;
          return {
            customRolePermissions: rest
          };
        });
      },
      
      // Get available roles
      getAvailableRoles: () => {
        return Object.keys(get().rolePermissions);
      },
      
      // Get all users by role
      getUsersByRole: (role) => {
        return get().users.filter(user => user.role === role);
      }
    }),
    {
      name: 'pharmacy-users-storage', // Name for localStorage
    }
  )
);
