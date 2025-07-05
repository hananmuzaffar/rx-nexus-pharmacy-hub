
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, UserPlus, Calendar } from "lucide-react";
import CustomerTable from '@/components/customers/CustomerTable';
import CustomerViewDialog from '@/components/customers/CustomerViewDialog';
import CustomerFormDialog from '@/components/customers/CustomerFormDialog';
import { toast } from "@/hooks/use-toast";
import { useCustomers, Customer } from "@/hooks/useCustomers";

const Customers = () => {
  const { customers, loading, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Calculate customer metrics
  const totalCustomers = customers.length;
  const newCustomersThisMonth = customers.filter(customer => {
    const registeredDate = new Date(customer.date_registered);
    const today = new Date();
    return (
      registeredDate.getMonth() === today.getMonth() &&
      registeredDate.getFullYear() === today.getFullYear()
    );
  }).length;

  const visitorsThisWeek = customers.filter(customer => {
    const visitDate = new Date(customer.last_visit);
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    return visitDate >= sevenDaysAgo && visitDate <= today;
  }).length;

  const activeCustomers = customers.filter(customer => 
    customer.prescriptions > 0
  ).length;

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsViewDialogOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const handleDeleteCustomer = async (id: number) => {
    try {
      await deleteCustomer(id);
    } catch (error) {
      // Error already handled in hook
    }
  };

  const handleAddNewCustomer = () => {
    setSelectedCustomer(null);
    setIsAddDialogOpen(true);
  };

  const handleSaveCustomer = async (customerData: Partial<Customer>) => {
    try {
      if (selectedCustomer && customerData.id) {
        // Update existing customer
        await updateCustomer(selectedCustomer.id, customerData);
        setIsEditDialogOpen(false);
      } else {
        // Add new customer
        const newCustomerData = {
          name: customerData.name || "New Customer",
          email: customerData.email || "",
          phone: customerData.phone || "",
          address: customerData.address || "",
          date_registered: new Date().toISOString(),
          prescriptions: 0,
          last_visit: new Date().toISOString(),
          ...customerData
        };
        
        await addCustomer(newCustomerData);
        setIsAddDialogOpen(false);
      }
      setSelectedCustomer(null);
    } catch (error) {
      // Error already handled in hooks
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading customers...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Customer Management</h1>
        <Button onClick={handleAddNewCustomer}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Customer
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-primary" />
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">registered patients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <UserPlus className="h-4 w-4 mr-2 text-primary" />
              New This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newCustomersThisMonth}</div>
            <p className="text-xs text-muted-foreground">newly registered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              Recent Visits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visitorsThisWeek}</div>
            <p className="text-xs text-muted-foreground">past 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCustomers}</div>
            <p className="text-xs text-muted-foreground">customers with active prescriptions</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Customer Directory</CardTitle>
          <CardDescription>Manage your pharmacy customers and patients</CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerTable 
            customers={customers}
            onView={handleViewCustomer}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
          />
        </CardContent>
      </Card>
      
      <CustomerViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        customer={selectedCustomer}
        onEdit={handleEditCustomer}
      />

      <CustomerFormDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen}
        customer={selectedCustomer}
        onSave={handleSaveCustomer}
        title="Edit Customer" 
      />

      <CustomerFormDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        onSave={handleSaveCustomer}
        title="Add New Customer" 
      />
    </div>
  );
};

export default Customers;
