import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useUserStore } from '@/stores/userStore';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasPermission: (module: string, action: string) => boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: any; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { users, getRolePermissions, isAuthenticated, currentUser: storeUser, login: storeLogin, logout: storeLogout } = useUserStore();
  const [permissions, setPermissions] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Watch for user store changes and update permissions
  useEffect(() => {
    if (storeUser) {
      const rolePermissions = getRolePermissions(storeUser.role) || {};
      setPermissions(rolePermissions);
    } else {
      setPermissions({});
    }
  }, [storeUser, getRolePermissions]);

  const hasPermission = (module: string, action: string) => {
    if (!storeUser) return false;
    if (storeUser.role === "Administrator") return true;
    return permissions[module]?.[action] === true;
  };
  
  const login = async (email: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> => {
    setIsLoading(true);
    try {
      const result = await storeLogin(email, password);
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    setIsLoading(true);
    try {
      await storeLogout();
    } finally {
      setIsLoading(false);
    }
  };
  
  const value: AuthContextType = {
    currentUser: storeUser,
    isAuthenticated,
    isLoading,
    hasPermission,
    login,
    logout
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;