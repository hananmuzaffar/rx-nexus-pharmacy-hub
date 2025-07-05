
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Edit, Trash, Search, Filter } from "lucide-react";
import { Customer } from '@/hooks/useCustomers';

interface CustomerTableProps {
  customers: Customer[];
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (id: number) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({ 
  customers, 
  onView,
  onEdit,
  onDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(customers);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term) {
      setFilteredCustomers(customers);
      return;
    }
    
    const filtered = customers.filter(
      customer => 
        customer.name.toLowerCase().includes(term) || 
        customer.email.toLowerCase().includes(term) ||
        customer.phone.toLowerCase().includes(term)
    );
    
    setFilteredCustomers(filtered);
  };

  // Update filtered customers when original list changes
  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = customers.filter(
        customer => 
          customer.name.toLowerCase().includes(term) || 
          customer.email.toLowerCase().includes(term) ||
          customer.phone.toLowerCase().includes(term)
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [customers, searchTerm]);

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
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
      
      <div className="relative w-full overflow-auto rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b bg-muted/50">
            <tr>
              <th className="h-10 px-4 text-left align-middle font-medium">Name</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Email</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Phone</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Registered</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Prescriptions</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Last Visit</th>
              <th className="h-10 px-4 text-center align-middle font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-2 align-middle">{customer.name}</td>
                  <td className="p-2 align-middle">{customer.email}</td>
                  <td className="p-2 align-middle">{customer.phone}</td>
                  <td className="p-2 align-middle">{new Date(customer.date_registered).toLocaleDateString()}</td>
                  <td className="p-2 align-middle">{customer.prescriptions}</td>
                  <td className="p-2 align-middle">{new Date(customer.last_visit).toLocaleDateString()}</td>
                  <td className="p-2 align-middle">
                    <div className="flex items-center justify-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => onView(customer)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(customer)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this customer?")) {
                            onDelete(customer.id);
                          }
                        }}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-4 text-center text-muted-foreground">
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

export default CustomerTable;
