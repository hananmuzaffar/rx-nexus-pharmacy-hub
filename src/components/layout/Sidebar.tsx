
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { 
  Activity, 
  Users, 
  ShoppingCart, 
  Package, 
  FileText, 
  BarChart3, 
  Settings, 
  Bell, 
  ShieldCheck,
  Mail,
  RotateCcw,
  Pill
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Sidebar = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [userPermissions, setUserPermissions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (currentUser) {
      const checkPermissions = async () => {
        const modules = ['inventory', 'sales', 'purchases', 'customers', 'prescriptions', 'returns', 'reports', 'settings'];
        const permissions: Record<string, boolean> = {};
        
        for (const module of modules) {
          try {
            const { data } = await supabase.rpc('has_permission', {
              user_id: currentUser.id,
              module_name: module,
              action_name: 'view'
            });
            permissions[module] = data || false;
          } catch (error) {
            permissions[module] = false;
          }
        }
        
        setUserPermissions(permissions);
      };
      
      checkPermissions();
    }
  }, [currentUser]);

  const mainMenuItems = [
    { icon: Activity, label: 'Dashboard', path: '/', module: 'dashboard' },
    { icon: Package, label: 'Inventory', path: '/inventory', module: 'inventory' },
    { icon: ShoppingCart, label: 'Sales', path: '/sales', module: 'sales' },
    { icon: Pill, label: 'Purchases', path: '/purchases', module: 'purchases' },
    { icon: Users, label: 'Customers', path: '/customers', module: 'customers' },
    { icon: FileText, label: 'Prescriptions', path: '/prescriptions', module: 'prescriptions' },
  ];

  const managementMenuItems = [
    { icon: RotateCcw, label: 'Returns', path: '/returns', module: 'returns' },
    { icon: Bell, label: 'Alerts', path: '/alerts', module: 'alerts' },
    { icon: BarChart3, label: 'Reports', path: '/reports', module: 'reports' },
    { icon: ShieldCheck, label: 'Compliance', path: '/compliance', module: 'compliance' },
    { icon: Mail, label: 'E-Prescriptions', path: '/e-prescriptions', module: 'prescriptions' },
    { icon: Settings, label: 'Settings', path: '/settings', module: 'settings' },
  ];

  const isMenuItemVisible = (module: string) => {
    if (module === 'dashboard') return true; // Dashboard is always visible
    return userPermissions[module] === true;
  };

  return (
    <SidebarComponent>
      <SidebarHeader className="py-6 px-6">
        <div className="flex items-center space-x-2">
          <Pill size={24} className="text-pharma-600" />
          <span className="font-bold text-xl">RxNexus</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">Pharmacy Management System</div>
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems
                .filter(item => isMenuItemVisible(item.module))
                .map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.path} 
                      className={cn(
                        "flex items-center space-x-3",
                        location.pathname === item.path && "bg-accent text-accent-foreground"
                      )}
                    >
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementMenuItems
                .filter(item => isMenuItemVisible(item.module))
                .map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.path} 
                      className={cn(
                        "flex items-center space-x-3",
                        location.pathname === item.path && "bg-accent text-accent-foreground"
                      )}
                    >
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="px-6 py-4 border-t text-xs text-center text-muted-foreground">
          RxNexus v1.0 © 2025
        </div>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
