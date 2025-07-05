
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash, Search, Filter, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Customer = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  date_registered?: string;
  prescriptions?: number;
  last_visit?: string;
};

interface CustomerTableWithFilterProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: number) => void;
  onView: (customer: Customer) => void;
}

const CustomerTableWithFilter: React.FC<CustomerTableWithFilterProps> = ({ 
  customers, 
  onEdit,
  onDelete,
  onView
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Apply filters
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = !searchTerm || 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.phone && customer.phone.includes(searchTerm));
    
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && customer.last_visit && 
       new Date(customer.last_visit) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
      (statusFilter === 'inactive' && (!customer.last_visit || 
       new Date(customer.last_visit) <= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)));

    return matchesSearch && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search customers..." 
            className="pl-8 w-full"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem onClick={() => setStatusFilter('')}>
              All Customers
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('active')}>
              Active (30 days)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>
              Inactive
            </DropdownMenuItem>
            <DropdownMenuItem onClick={clearFilters}>
              Clear Filters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="relative w-full overflow-auto rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b bg-muted/50">
            <tr className="border-b transition-colors hover:bg-muted/50">
              <th className="h-10 px-4 text-left align-middle font-medium">Name</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Email</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Phone</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Prescriptions</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Last Visit</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-2 align-middle font-medium">{customer.name}</td>
                  <td className="p-2 align-middle">{customer.email || 'N/A'}</td>
                  <td className="p-2 align-middle">{customer.phone || 'N/A'}</td>
                  <td className="p-2 align-middle">{customer.prescriptions || 0}</td>
                  <td className="p-2 align-middle">
                    {customer.last_visit ? new Date(customer.last_visit).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="p-2 align-middle">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => onView(customer)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(customer)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(customer.id)}>
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-muted-foreground">
                  No customers found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTableWithFilter;
