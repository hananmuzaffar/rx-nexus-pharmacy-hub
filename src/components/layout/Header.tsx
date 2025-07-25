
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Search, Settings, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "@/hooks/use-toast";
import { useInventoryStore } from '@/stores/inventoryStore';
import { useCustomerStore } from '@/stores/customerStore';
import { useAuth } from '@/hooks/useAuth';
import NotificationPanel from './NotificationPanel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const { getItemsByCategoryOrSearch } = useInventoryStore();
  const { customers } = useCustomerStore();

  const handleLogout = async () => {
    // Log out using Supabase
    await logout();
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    
    // Navigate to login page
    navigate("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }
    
    const items = getItemsByCategoryOrSearch(searchQuery);
    const foundCustomers = customers.filter(customer => 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Show results count in a toast
    toast({
      title: "Search Results",
      description: `Found ${items.length} items and ${foundCustomers.length} customers`,
    });
    
    // Navigate to search results page or open a modal with results
    if (items.length > 0) {
      navigate('/inventory', { state: { searchQuery } });
    } else if (foundCustomers.length > 0) {
      navigate('/customers', { state: { searchQuery } });
    } else {
      toast({
        title: "No Results",
        description: "No items or customers found for your search",
      });
    }
  };

  return (
    <header className="border-b bg-white flex items-center justify-between p-4">
      <div className="flex items-center">
        <SidebarTrigger className="mr-4" />
        <form onSubmit={handleSearch} className="flex items-center">
          <div className="flex items-center border rounded-md px-3 py-1.5 bg-gray-50 w-64 lg:w-96">
            <Search size={18} className="mr-2 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none flex-1 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" variant="ghost" className="ml-1">
            <Search size={18} />
          </Button>
        </form>
      </div>
      <div className="flex items-center space-x-3">
        <NotificationPanel />
        
        <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
          <Settings size={20} />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-3 py-2 text-sm font-medium border-b mb-1">
              {currentUser?.name || "User"}
              <div className="text-xs font-normal text-muted-foreground">{currentUser?.role || "User"}</div>
            </div>
            <DropdownMenuItem onClick={() => navigate('/settings?tab=profile')}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
